import type {
  BracketNode,
  Group,
  Match,
  MatchStage,
  ResolvedSide,
  Team,
  TeamQualification,
} from "@/types/worldcup"
import { getMatchesByStage } from "@/lib/api"
import {
  formatMatchRefLabel,
  formatSlotOrigin,
  formatThirdOrigin,
  isGroupSlotKind,
  parseSlotLabel,
} from "@/lib/bracket-slots"
import {
  getQualifications,
  getTeamByGroupPosition,
  getThirdPlaceTeam,
  isGroupStageActive,
} from "@/lib/qualification"

const KNOCKOUT_STAGES: MatchStage[] = [
  "r32",
  "r16",
  "qf",
  "sf",
  "third",
  "final",
]

interface ResolveContext {
  groups: Group[]
  qualifications: TeamQualification[]
  groupStageActive: boolean
  matchById: Map<string, Match>
  sideCache: Map<string, ResolvedSide>
  visiting: Set<string>
}

function getMatchWinner(match: Match): Team | null {
  if (match.status !== "finished") return null
  if (match.homeScore === null || match.awayScore === null) return null
  if (match.homeScore > match.awayScore) return match.homeTeam
  if (match.awayScore > match.homeScore) return match.awayTeam
  return null
}

function getMatchLoser(match: Match): Team | null {
  if (match.status !== "finished") return null
  if (match.homeScore === null || match.awayScore === null) return null
  if (match.homeScore > match.awayScore) return match.awayTeam
  if (match.awayScore > match.homeScore) return match.homeTeam
  return null
}

function resolveGroupSlot(
  parsed: NonNullable<ReturnType<typeof parseSlotLabel>>,
  ctx: ResolveContext
): ResolvedSide {
  if (parsed.kind === "group_third_multi") {
    return {
      team: null,
      label: parsed.raw,
      isProvisional: ctx.groupStageActive,
      origin: `Melhor 3º entre grupos ${parsed.groups.join(", ")}`,
    }
  }

  if (!parsed.group || parsed.position === null) {
    return {
      team: null,
      label: parsed.raw,
      isProvisional: ctx.groupStageActive,
      origin: parsed.raw,
    }
  }

  const groupLetter = parsed.group

  if (parsed.position === 3) {
    const team = getThirdPlaceTeam(ctx.groups, groupLetter, ctx.qualifications)
    const qual = ctx.qualifications.find(
      (q) =>
        q.group.toUpperCase() === groupLetter.toUpperCase() && q.position === 3
    )

    if (team) {
      return {
        team,
        label: team.name,
        isProvisional: qual?.status === "provisional",
        origin: qual?.thirdRank
          ? `3º — ${qual.thirdRank}º melhor (Grupo ${groupLetter})`
          : formatThirdOrigin(groupLetter),
      }
    }

    return {
      team: null,
      label: parsed.raw,
      isProvisional: true,
      origin: formatThirdOrigin(groupLetter),
    }
  }

  const team = getTeamByGroupPosition(ctx.groups, groupLetter, parsed.position)
  const qual = ctx.qualifications.find(
    (q) =>
      q.group.toUpperCase() === groupLetter.toUpperCase() &&
      q.position === parsed.position
  )

  if (team) {
    return {
      team,
      label: team.name,
      isProvisional: qual?.status === "provisional",
      origin: formatSlotOrigin(parsed.position, groupLetter),
    }
  }

  return {
    team: null,
    label: parsed.raw,
    isProvisional: true,
    origin: formatSlotOrigin(parsed.position, groupLetter),
  }
}

function resolveFromLabel(label: string | undefined, ctx: ResolveContext): ResolvedSide {
  const parsed = parseSlotLabel(label)

  if (!parsed) {
    return {
      team: null,
      label: label || "A definir",
      isProvisional: false,
      origin: undefined,
    }
  }

  if (parsed.kind === "match_winner" || parsed.kind === "match_loser") {
    const matchId = parsed.matchId
    if (!matchId) {
      return {
        team: null,
        label: parsed.raw,
        isProvisional: false,
        origin: parsed.raw,
      }
    }

    const cacheKey = `${parsed.kind}:${matchId}`
    if (ctx.sideCache.has(cacheKey)) {
      return ctx.sideCache.get(cacheKey)!
    }

    if (ctx.visiting.has(cacheKey)) {
      return {
        team: null,
        label: formatMatchRefLabel(parsed.kind, matchId),
        isProvisional: false,
        origin: formatMatchRefLabel(parsed.kind, matchId),
      }
    }

    ctx.visiting.add(cacheKey)
    const refMatch = ctx.matchById.get(matchId)

    if (!refMatch) {
      const fallback: ResolvedSide = {
        team: null,
        label: formatMatchRefLabel(parsed.kind, matchId),
        isProvisional: false,
        origin: formatMatchRefLabel(parsed.kind, matchId),
      }
      ctx.sideCache.set(cacheKey, fallback)
      ctx.visiting.delete(cacheKey)
      return fallback
    }

    const finishedTeam =
      parsed.kind === "match_winner"
        ? getMatchWinner(refMatch)
        : getMatchLoser(refMatch)

    if (finishedTeam) {
      const resolved: ResolvedSide = {
        team: finishedTeam,
        label: finishedTeam.name,
        isProvisional: false,
        origin: formatMatchRefLabel(parsed.kind, matchId),
      }
      ctx.sideCache.set(cacheKey, resolved)
      ctx.visiting.delete(cacheKey)
      return resolved
    }

    const home = resolveMatchSide(refMatch, "home", ctx)
    const away = resolveMatchSide(refMatch, "away", ctx)
    const refLabel = formatMatchRefLabel(parsed.kind, matchId)
    const preview =
      home.team && away.team
        ? `${refLabel} (${home.label} vs ${away.label})`
        : home.label !== "A definir" || away.label !== "A definir"
          ? `${refLabel} (${home.label} vs ${away.label})`
          : refLabel

    const unresolved: ResolvedSide = {
      team: null,
      label: refLabel,
      isProvisional: false,
      origin: preview,
    }
    ctx.sideCache.set(cacheKey, unresolved)
    ctx.visiting.delete(cacheKey)
    return unresolved
  }

  if (isGroupSlotKind(parsed.kind)) {
    return resolveGroupSlot(parsed, ctx)
  }

  return {
    team: null,
    label: parsed.raw,
    isProvisional: false,
    origin: parsed.raw,
  }
}

function resolveMatchSide(
  match: Match,
  side: "home" | "away",
  ctx: ResolveContext
): ResolvedSide {
  const team = side === "home" ? match.homeTeam : match.awayTeam
  const label = side === "home" ? match.homeTeamLabel : match.awayTeamLabel
  const parsed = parseSlotLabel(label)

  if (team) {
    const qual = ctx.qualifications.find((q) => q.team.id === team.id)
    const isGroupSlot =
      parsed !== null && isGroupSlotKind(parsed.kind) && ctx.groupStageActive

    return {
      team,
      label: team.name,
      isProvisional: isGroupSlot && qual?.status === "provisional",
      origin: parsed && isGroupSlotKind(parsed.kind)
        ? qual
          ? qual.zone === "third_playoff"
            ? `3º — ${qual.thirdRank}º melhor (Grupo ${qual.group})`
            : `${qual.position}º Grupo ${qual.group}`
          : label
        : label ?? team.name,
    }
  }

  if (match.stage === "r32" && parsed && isGroupSlotKind(parsed.kind)) {
    return resolveGroupSlot(parsed, ctx)
  }

  return resolveFromLabel(label, ctx)
}

function buildRoundNodes(
  matches: Match[],
  stage: MatchStage,
  ctx: ResolveContext
): BracketNode[] {
  const sorted = [...matches].sort(
    (a, b) => parseInt(a.id, 10) - parseInt(b.id, 10)
  )

  return sorted.map((match, index) => ({
    match,
    home: resolveMatchSide(match, "home", ctx),
    away: resolveMatchSide(match, "away", ctx),
    round: stage,
    slotIndex: index,
  }))
}

export function buildBracket(
  matches: Match[],
  groups: Group[]
): Record<MatchStage, BracketNode[]> {
  const qualifications = getQualifications(groups)
  const groupStageActive = isGroupStageActive(groups)
  const matchById = new Map(matches.map((m) => [m.id, m]))

  const ctx: ResolveContext = {
    groups,
    qualifications,
    groupStageActive,
    matchById,
    sideCache: new Map(),
    visiting: new Set(),
  }

  const bracket: Record<MatchStage, BracketNode[]> = {
    group: [],
    r32: [],
    r16: [],
    qf: [],
    sf: [],
    third: [],
    final: [],
  }

  for (const stage of KNOCKOUT_STAGES) {
    const stageMatches = getMatchesByStage(matches, stage)
    bracket[stage] = buildRoundNodes(stageMatches, stage, ctx)
  }

  return bracket
}

export function getBracketStages(): MatchStage[] {
  return KNOCKOUT_STAGES
}
