import type { Match } from "@/types/worldcup"
import { TEAMS_META } from "@/lib/seed/teams-meta"
import type { EloRatingsMap } from "./probability"

const K_FACTOR = 20

export function buildInitialRatings(): EloRatingsMap {
  const ratings: EloRatingsMap = {}
  for (const [iso2, meta] of Object.entries(TEAMS_META)) {
    ratings[iso2] = meta.elo
  }
  return ratings
}

function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

function actualScore(homeScore: number, awayScore: number, side: "home" | "away"): number {
  if (homeScore === awayScore) return 0.5
  if (side === "home") return homeScore > awayScore ? 1 : 0
  return awayScore > homeScore ? 1 : 0
}

export function updateRatingsFromMatches(
  ratings: EloRatingsMap,
  matches: Match[],
  homeIsoById: Map<string, string>,
  awayIsoById: Map<string, string>
): EloRatingsMap {
  const updated = { ...ratings }

  const finished = matches
    .filter(
      (m) =>
        m.status === "finished" &&
        m.homeScore !== null &&
        m.awayScore !== null &&
        m.homeTeam &&
        m.awayTeam
    )
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))

  for (const match of finished) {
    const homeIso = homeIsoById.get(match.homeTeam!.id) ?? match.homeTeam!.code.toLowerCase()
    const awayIso = awayIsoById.get(match.awayTeam!.id) ?? match.awayTeam!.code.toLowerCase()

    if (updated[homeIso] === undefined || updated[awayIso] === undefined) continue

    const homeElo = updated[homeIso]
    const awayElo = updated[awayIso]
    const homeExpected = expectedScore(homeElo, awayElo)
    const awayExpected = 1 - homeExpected

    const homeActual = actualScore(match.homeScore!, match.awayScore!, "home")
    const awayActual = actualScore(match.homeScore!, match.awayScore!, "away")

    updated[homeIso] = Math.round(homeElo + K_FACTOR * (homeActual - homeExpected))
    updated[awayIso] = Math.round(awayElo + K_FACTOR * (awayActual - awayExpected))
  }

  return updated
}
