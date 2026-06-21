import {
  fetchTeams,
  fetchGroups,
  fetchGames,
  mapGroups,
  mapGames,
} from "@/lib/api"
import { buildBracket } from "@/lib/bracket"
import { getQualifications } from "@/lib/qualification"
import { HomeContent } from "@/components/home/home-content"
import type { Group, Match } from "@/types/worldcup"

export const dynamic = "force-dynamic"

async function getTournamentData(): Promise<{
  groups: Group[]
  matches: Match[]
  dataError: boolean
}> {
  try {
    const [teamsMap, apiGroups, apiGames] = await Promise.all([
      fetchTeams(),
      fetchGroups(),
      fetchGames(),
    ])

    return {
      groups: mapGroups(apiGroups, teamsMap),
      matches: mapGames(apiGames, teamsMap),
      dataError: false,
    }
  } catch (error) {
    console.error("Failed to fetch tournament data:", error)
    return { groups: [], matches: [], dataError: true }
  }
}

export default async function Home() {
  const { groups, matches, dataError } = await getTournamentData()

  const qualifications = getQualifications(groups)
  const bracket = buildBracket(matches, groups)

  return (
    <HomeContent
      groups={groups}
      matches={matches}
      qualifications={qualifications}
      bracket={bracket}
      dataError={dataError}
    />
  )
}
