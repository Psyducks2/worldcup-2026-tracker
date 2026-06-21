import type { Metadata } from "next"
import { SiteShell } from "@/components/layout/site-shell"
import { TeamsContent } from "@/components/teams/teams-content"
import { mapTeam } from "@/lib/api"
import { getTournamentData } from "@/lib/tournament-data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Teams · WC26 Tracker",
}

export default async function TeamsPage() {
  const { teamsMap, ratingsUpdatedAt } = await getTournamentData()
  const teams = Object.values(teamsMap).map(mapTeam)

  return (
    <SiteShell updatedAt={ratingsUpdatedAt}>
      <TeamsContent teams={teams} />
    </SiteShell>
  )
}
