import type { MatchPrediction } from "@/types/worldcup"

export const HOST_ADVANTAGE_ELO = 100
export const HOST_COUNTRIES = new Set(["USA", "Canada", "Mexico"])

export interface EloRatingsMap {
  [iso2: string]: number
}

export function getHostBoost(iso2: string, stadiumCountry?: string): number {
  if (!stadiumCountry || !HOST_COUNTRIES.has(stadiumCountry)) return 0
  const hostMap: Record<string, string> = {
    us: "USA",
    ca: "Canada",
    mx: "Mexico",
  }
  return hostMap[iso2.toLowerCase()] === stadiumCountry ? HOST_ADVANTAGE_ELO : 0
}

/** Three-way outcome model (home / draw / away) from Elo difference. */
export function calculateMatchPrediction(
  homeElo: number,
  awayElo: number
): MatchPrediction {
  const diff = homeElo - awayElo
  const homeWinRaw = 1 / (1 + Math.pow(10, -diff / 400))
  const awayWinRaw = 1 / (1 + Math.pow(10, diff / 400))
  const drawRaw = 0.28 * Math.exp(-Math.abs(diff) / 350)

  const total = homeWinRaw + drawRaw + awayWinRaw
  let homeWin = Math.round((homeWinRaw / total) * 100)
  let draw = Math.round((drawRaw / total) * 100)
  let awayWin = Math.round((awayWinRaw / total) * 100)

  const sum = homeWin + draw + awayWin
  if (sum !== 100) {
    const adjust = 100 - sum
    if (homeWin >= awayWin) homeWin += adjust
    else awayWin += adjust
  }

  return {
    homeWin,
    draw,
    awayWin,
    homeElo: Math.round(homeElo),
    awayElo: Math.round(awayElo),
    eloDiff: Math.round(homeElo - awayElo),
  }
}

export function predictFromRatings(
  homeIso2: string,
  awayIso2: string,
  ratings: EloRatingsMap,
  stadiumCountry?: string
): MatchPrediction | null {
  const homeBase = ratings[homeIso2.toLowerCase()]
  const awayBase = ratings[awayIso2.toLowerCase()]
  if (homeBase === undefined || awayBase === undefined) return null

  const homeElo = homeBase + getHostBoost(homeIso2, stadiumCountry)
  const awayElo = awayBase + getHostBoost(awayIso2, stadiumCountry)

  return calculateMatchPrediction(homeElo, awayElo)
}
