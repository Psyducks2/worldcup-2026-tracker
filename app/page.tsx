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

export const revalidate = 60

async function getTournamentData() {
  const [teamsMap, apiGroups, apiGames] = await Promise.all([
    fetchTeams(),
    fetchGroups(),
    fetchGames(),
  ])

  const groups = mapGroups(apiGroups, teamsMap)
  const matches = mapGames(apiGames, teamsMap)

  return { groups, matches }
}

export default async function Home() {
  const { groups, matches } = await getTournamentData()

  const qualifications = getQualifications(groups)
  const bracket = buildBracket(matches, groups)

  return (
    <HomeContent
      groups={groups}
      matches={matches}
      qualifications={qualifications}
      bracket={bracket}
    />
  )
}
