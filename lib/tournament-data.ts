import {
  fetchTeams,
  fetchGroups,
  fetchGames,
  mapGroups,
  mapGames,
} from "@/lib/api"
import {
  buildInitialRatings,
  predictFromRatings,
  updateRatingsFromMatches,
} from "@/lib/elo"
import { getStadium, resolveIso2 } from "@/lib/seed"
import type { ApiTeam, Group, Match } from "@/types/worldcup"

export interface TournamentData {
  groups: Group[]
  matches: Match[]
  teamsMap: Record<string, ApiTeam>
  dataError: boolean
  ratingsUpdatedAt: string
}

function buildIsoMaps(teamsMap: Record<string, ApiTeam>) {
  const isoByTeamId = new Map<string, string>()
  for (const team of Object.values(teamsMap)) {
    isoByTeamId.set(team.id, resolveIso2(team.fifa_code, team.iso2))
  }
  return isoByTeamId
}

function enrichMatches(matches: Match[], teamsMap: Record<string, ApiTeam>): Match[] {
  const isoByTeamId = buildIsoMaps(teamsMap)
  let ratings = buildInitialRatings()

  const homeIsoById = new Map<string, string>()
  const awayIsoById = new Map<string, string>()
  for (const [id, iso] of isoByTeamId) {
    homeIsoById.set(id, iso)
    awayIsoById.set(id, iso)
  }

  ratings = updateRatingsFromMatches(ratings, matches, homeIsoById, awayIsoById)

  return matches.map((match) => {
    const stadium = match.stadiumId ? getStadium(match.stadiumId) : null
    let prediction = null

    if (match.homeTeam && match.awayTeam) {
      const homeIso =
        isoByTeamId.get(match.homeTeam.id) ??
        resolveIso2(match.homeTeam.code, match.homeTeam.iso2)
      const awayIso =
        isoByTeamId.get(match.awayTeam.id) ??
        resolveIso2(match.awayTeam.code, match.awayTeam.iso2)

      prediction = predictFromRatings(
        homeIso,
        awayIso,
        ratings,
        stadium?.country
      )
    }

    return { ...match, stadium, prediction }
  })
}

export async function getTournamentData(): Promise<TournamentData> {
  try {
    const [teamsMap, apiGroups, apiGames] = await Promise.all([
      fetchTeams(),
      fetchGroups(),
      fetchGames(),
    ])

    const groups = mapGroups(apiGroups, teamsMap)
    const matches = enrichMatches(mapGames(apiGames, teamsMap), teamsMap)

    return {
      groups,
      matches,
      teamsMap,
      dataError: false,
      ratingsUpdatedAt: new Date().toISOString().slice(0, 10),
    }
  } catch (error) {
    console.error("Failed to fetch tournament data:", error)
    return {
      groups: [],
      matches: [],
      teamsMap: {},
      dataError: true,
      ratingsUpdatedAt: new Date().toISOString().slice(0, 10),
    }
  }
}

export function getMatchById(matches: Match[], id: string): Match | undefined {
  return matches.find((m) => m.id === id)
}
