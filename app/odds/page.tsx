import type { Metadata } from "next"
import { OddsContent } from "@/components/odds/odds-content"
import { SiteShell } from "@/components/layout/site-shell"
import { mapTeam } from "@/lib/api"
import { getTitleOdds, getTitleOddsUpdatedAt, resolveIso2 } from "@/lib/seed"
import { getTournamentData } from "@/lib/tournament-data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Odds · WC26 Tracker",
}

export default async function OddsPage() {
  const { teamsMap, ratingsUpdatedAt } = await getTournamentData()
  const odds = getTitleOdds()
  const updatedAt = getTitleOddsUpdatedAt()

  const teamsByIso: Record<string, { name: string; flag: string }> = {}
  for (const apiTeam of Object.values(teamsMap)) {
    const team = mapTeam(apiTeam)
    const iso = resolveIso2(team.code, team.iso2)
    teamsByIso[iso] = { name: team.name, flag: team.flag }
  }

  return (
    <SiteShell updatedAt={ratingsUpdatedAt}>
      <OddsContent odds={odds} updatedAt={updatedAt} teamsByIso={teamsByIso} />
    </SiteShell>
  )
}
