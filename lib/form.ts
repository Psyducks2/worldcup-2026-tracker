import historicalResults from "@/data/seed/historical-results.json"
import type { FormResult, Match } from "@/types/worldcup"

interface HistoricalMatch {
  date: string
  home: string
  away: string
  homeScore: number
  awayScore: number
}

const HISTORICAL = historicalResults.results as HistoricalMatch[]

function resultForTeam(
  teamIso2: string,
  home: string,
  away: string,
  homeScore: number,
  awayScore: number
): FormResult {
  const iso = teamIso2.toLowerCase()
  if (homeScore === awayScore) return "D"
  if (iso === home) return homeScore > awayScore ? "W" : "L"
  return awayScore > homeScore ? "W" : "L"
}

function tournamentResultsForTeam(teamIso2: string, matches: Match[]): FormResult[] {
  const iso = teamIso2.toLowerCase()
  return matches
    .filter(
      (m) =>
        m.status === "finished" &&
        m.homeScore !== null &&
        m.awayScore !== null &&
        (m.homeTeam?.code.toLowerCase() === iso || m.awayTeam?.code.toLowerCase() === iso)
    )
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
    .map((m) =>
      resultForTeam(iso, m.homeTeam!.code.toLowerCase(), m.awayTeam!.code.toLowerCase(), m.homeScore!, m.awayScore!)
    )
}

export function getRecentForm(
  teamIso2: string,
  tournamentMatches: Match[] = [],
  limit = 5
): FormResult[] {
  const iso = teamIso2.toLowerCase()

  const fromHistory = HISTORICAL.filter((r) => r.home === iso || r.away === iso)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((r) => resultForTeam(iso, r.home, r.away, r.homeScore, r.awayScore))

  const fromTournament = tournamentResultsForTeam(iso, tournamentMatches)

  const combined = [...fromTournament, ...fromHistory]
  return combined.slice(0, limit).reverse()
}
