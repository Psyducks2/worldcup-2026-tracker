import historicalResults from "@/data/seed/historical-results.json"
import type { HeadToHeadSummary } from "@/types/worldcup"

interface HistoricalMatch {
  date: string
  home: string
  away: string
  homeScore: number
  awayScore: number
}

const HISTORICAL = historicalResults.results as HistoricalMatch[]

export function getHeadToHead(homeIso2: string, awayIso2: string): HeadToHeadSummary {
  const home = homeIso2.toLowerCase()
  const away = awayIso2.toLowerCase()

  const meetings = HISTORICAL.filter(
    (r) =>
      (r.home === home && r.away === away) || (r.home === away && r.away === home)
  ).sort((a, b) => b.date.localeCompare(a.date))

  if (meetings.length === 0) {
    return { meetings: 0, lastMeeting: null }
  }

  const last = meetings[0]
  const year = last.date.slice(0, 4)
  const homeTeam = last.home.toUpperCase()
  const awayTeam = last.away.toUpperCase()

  return {
    meetings: meetings.length,
    lastMeeting: {
      date: last.date,
      homeTeam: last.home,
      awayTeam: last.away,
      homeScore: last.homeScore,
      awayScore: last.awayScore,
      summary: `${homeTeam} ${last.homeScore}–${last.awayScore} ${awayTeam} (${year})`,
    },
  }
}
