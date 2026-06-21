import type {
  Group,
  GroupStanding,
  QualificationStatus,
  QualificationZone,
  RoundOf32Slot,
  Team,
  TeamQualification,
} from "@/types/worldcup"
import { getGroupLetter } from "@/lib/api"

const GROUPS_PER_TOURNAMENT = 12
const MATCHES_PER_GROUP = 3
const THIRD_PLACE_QUALIFIERS = 8

function compareStandings(a: GroupStanding, b: GroupStanding): number {
  if (b.points !== a.points) return b.points - a.points
  if (b.goalDifference !== a.goalDifference) {
    return b.goalDifference - a.goalDifference
  }
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
  return 0
}

function getGroupShortName(groupName: string): string {
  return getGroupLetter(groupName)
}

function isGroupStageComplete(groups: Group[]): boolean {
  return groups.every((group) =>
    group.standings.every((standing) => standing.played >= MATCHES_PER_GROUP)
  )
}

function getMaxPossiblePoints(standing: GroupStanding): number {
  const remaining = MATCHES_PER_GROUP - standing.played
  return standing.points + remaining * 3
}

function canFallFromDirect(
  standing: GroupStanding,
  group: Group
): boolean {
  if (standing.position > 2) return false

  const rivals = group.standings.filter((s) => s.team.id !== standing.team.id)
  const maxPointsNeededToPass = getMaxPossiblePoints(standing)

  for (const rival of rivals) {
    if (rival.position >= standing.position) continue
    if (getMaxPossiblePoints(rival) > maxPointsNeededToPass) return true
    if (
      getMaxPossiblePoints(rival) === maxPointsNeededToPass &&
      compareStandings(rival, standing) > 0
    ) {
      return true
    }
  }

  return standing.position === 2 && group.standings[0].points <= maxPointsNeededToPass
}

function canCatchThirdPlace(
  standing: GroupStanding,
  group: Group,
  thirdRank: number | undefined
): boolean {
  if (standing.position !== 3 || thirdRank === undefined) return true
  if (thirdRank <= THIRD_PLACE_QUALIFIERS) {
    const fourth = group.standings[3]
    if (!fourth) return false
    return getMaxPossiblePoints(fourth) >= standing.points
  }
  return true
}

function resolveStatus(
  zone: QualificationZone,
  standing: GroupStanding,
  group: Group,
  thirdRank: number | undefined,
  groupStageComplete: boolean
): QualificationStatus {
  if (groupStageComplete) return "confirmed"

  if (zone === "direct") {
    return canFallFromDirect(standing, group) ? "provisional" : "confirmed"
  }

  if (zone === "third_playoff") {
    return canCatchThirdPlace(standing, group, thirdRank)
      ? "provisional"
      : "confirmed"
  }

  if (zone === "eliminated" && standing.position === 3 && thirdRank !== undefined) {
    return thirdRank > THIRD_PLACE_QUALIFIERS ? "confirmed" : "provisional"
  }

  return "provisional"
}

export function getQualifications(groups: Group[]): TeamQualification[] {
  const groupStageComplete = isGroupStageComplete(groups)

  const thirdPlaceCandidates = groups
    .map((group) => {
      const third = group.standings[2]
      if (!third) return null
      return {
        standing: third,
        group: getGroupShortName(group.name),
        groupName: group.name,
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => compareStandings(a.standing, b.standing))

  const thirdRankMap = new Map<string, number>()
  thirdPlaceCandidates.forEach((entry, index) => {
    thirdRankMap.set(entry.standing.team.id, index + 1)
  })

  const qualifications: TeamQualification[] = []

  for (const group of groups) {
    const groupLetter = getGroupShortName(group.name)

    for (const standing of group.standings) {
      let zone: QualificationZone
      const thirdRank = thirdRankMap.get(standing.team.id)

      if (standing.position <= 2) {
        zone = "direct"
      } else if (standing.position === 3) {
        zone =
          thirdRank !== undefined && thirdRank <= THIRD_PLACE_QUALIFIERS
            ? "third_playoff"
            : "eliminated"
      } else {
        zone = "eliminated"
      }

      qualifications.push({
        team: standing.team,
        group: groupLetter,
        position: standing.position,
        zone,
        status: resolveStatus(
          zone,
          standing,
          group,
          thirdRank,
          groupStageComplete
        ),
        thirdRank,
      })
    }
  }

  return qualifications
}

export function getProjectedRoundOf32(groups: Group[]): RoundOf32Slot[] {
  const qualifications = getQualifications(groups)

  const direct = qualifications
    .filter((q) => q.zone === "direct")
    .sort((a, b) => a.group.localeCompare(b.group) || a.position - b.position)

  const thirdPlayoff = qualifications
    .filter((q) => q.zone === "third_playoff")
    .sort((a, b) => (a.thirdRank ?? 99) - (b.thirdRank ?? 99))

  const slots: RoundOf32Slot[] = []

  for (const q of direct) {
    slots.push({
      team: q.team,
      origin: `${q.position}º Grupo ${q.group}`,
      zone: "direct",
      status: q.status,
      group: q.group,
      position: q.position,
    })
  }

  for (const q of thirdPlayoff) {
    slots.push({
      team: q.team,
      origin: `3º — ${q.thirdRank}º melhor`,
      zone: "third_playoff",
      status: q.status,
      group: q.group,
      position: 3,
    })
  }

  return slots
}

export function getQualificationForTeam(
  qualifications: TeamQualification[],
  teamId: string
): TeamQualification | undefined {
  return qualifications.find((q) => q.team.id === teamId)
}

export function getTeamByGroupPosition(
  groups: Group[],
  groupLetter: string,
  position: number
): Team | null {
  const group = groups.find(
    (g) => getGroupShortName(g.name).toUpperCase() === groupLetter.toUpperCase()
  )
  if (!group) return null
  const standing = group.standings.find((s) => s.position === position)
  return standing?.team ?? null
}

export function getThirdPlaceTeam(
  groups: Group[],
  groupLetter: string,
  qualifications: TeamQualification[]
): Team | null {
  const qual = qualifications.find(
    (q) =>
      q.group.toUpperCase() === groupLetter.toUpperCase() &&
      q.position === 3 &&
      q.zone === "third_playoff"
  )
  return qual?.team ?? null
}

export function isGroupStageActive(groups: Group[]): boolean {
  return !isGroupStageComplete(groups)
}

export { GROUPS_PER_TOURNAMENT, THIRD_PLACE_QUALIFIERS }
