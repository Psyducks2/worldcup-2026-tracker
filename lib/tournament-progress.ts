import type { Match } from "@/types/worldcup"

export interface TournamentProgress {
  total: number
  finished: number
  remaining: number
  percentage: number
}

export function getTournamentProgress(matches: Match[]): TournamentProgress {
  const total = matches.length
  const finished = matches.filter((m) => m.status === "finished").length
  const remaining = total - finished
  const percentage = total > 0 ? Math.round((finished / total) * 100) : 0

  return { total, finished, remaining, percentage }
}
