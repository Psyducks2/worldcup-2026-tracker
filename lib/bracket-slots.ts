export type SlotPosition = 1 | 2 | 3

export type SlotKind =
  | "group_winner"
  | "group_runner_up"
  | "group_third"
  | "group_third_multi"
  | "match_winner"
  | "match_loser"
  | "unknown"

export interface ParsedSlot {
  kind: SlotKind
  position: SlotPosition | null
  group: string | null
  groups: string[]
  matchId: string | null
  raw: string
}

const GROUP_LETTER = /[A-L]/

export function parseSlotLabel(label: string | undefined): ParsedSlot | null {
  if (!label || label === "null" || label === "TBD") return null

  const raw = label.trim()
  const normalized = raw.toUpperCase()

  const matchWinner = normalized.match(/^WINNER\s+MATCH\s+(\d+)$/i)
  if (matchWinner) {
    return {
      kind: "match_winner",
      position: null,
      group: null,
      groups: [],
      matchId: matchWinner[1],
      raw,
    }
  }

  const matchLoser = normalized.match(/^LOSER\s+MATCH\s+(\d+)$/i)
  if (matchLoser) {
    return {
      kind: "match_loser",
      position: null,
      group: null,
      groups: [],
      matchId: matchLoser[1],
      raw,
    }
  }

  const winnerGroup = normalized.match(
    /^WINNER\s+GROUP\s+([A-L])$/i
  )
  if (winnerGroup) {
    return {
      kind: "group_winner",
      position: 1,
      group: winnerGroup[1],
      groups: [winnerGroup[1]],
      matchId: null,
      raw,
    }
  }

  const runnerUpGroup = normalized.match(
    /^RUNNER-UP\s+GROUP\s+([A-L])$/i
  )
  if (runnerUpGroup) {
    return {
      kind: "group_runner_up",
      position: 2,
      group: runnerUpGroup[1],
      groups: [runnerUpGroup[1]],
      matchId: null,
      raw,
    }
  }

  const thirdMulti = normalized.match(/^3RD\s+GROUP\s+([A-L](?:\/[A-L])+)$/i)
  if (thirdMulti) {
    const groups = thirdMulti[1].split("/")
    return {
      kind: "group_third_multi",
      position: 3,
      group: null,
      groups,
      matchId: null,
      raw,
    }
  }

  const thirdSingle = normalized.match(/^3RD\s+GROUP\s+([A-L])$/i)
  if (thirdSingle) {
    return {
      kind: "group_third",
      position: 3,
      group: thirdSingle[1],
      groups: [thirdSingle[1]],
      matchId: null,
      raw,
    }
  }

  const compact = normalized.match(/^([123])([A-L])$/)
  if (compact) {
    const position = parseInt(compact[1], 10) as SlotPosition
    const kind =
      position === 1
        ? "group_winner"
        : position === 2
          ? "group_runner_up"
          : "group_third"
    return {
      kind,
      position,
      group: compact[2],
      groups: [compact[2]],
      matchId: null,
      raw,
    }
  }

  return {
    kind: "unknown",
    position: null,
    group: null,
    groups: [],
    matchId: null,
    raw,
  }
}

export function formatSlotOrigin(
  position: SlotPosition,
  groupLetter: string
): string {
  return `${position}º Grupo ${groupLetter.toUpperCase()}`
}

export function formatThirdOrigin(groupLetter: string): string {
  return `3º Grupo ${groupLetter.toUpperCase()}`
}

export function formatMatchRefLabel(
  kind: "match_winner" | "match_loser",
  matchId: string
): string {
  return kind === "match_winner"
    ? `Vencedor — Jogo ${matchId}`
    : `Perdedor — Jogo ${matchId}`
}

export function isGroupSlotKind(kind: SlotKind): boolean {
  return (
    kind === "group_winner" ||
    kind === "group_runner_up" ||
    kind === "group_third" ||
    kind === "group_third_multi"
  )
}

export function isValidGroupLetter(letter: string): boolean {
  return GROUP_LETTER.test(letter)
}
