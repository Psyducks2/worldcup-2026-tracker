import type { Metadata } from "next"
import { SiteShell } from "@/components/layout/site-shell"
import { MatchesContent } from "@/components/matches/matches-content"
import { getTournamentData } from "@/lib/tournament-data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Matches · WC26 Tracker",
}

export default async function MatchesPage() {
  const { matches, dataError, ratingsUpdatedAt } = await getTournamentData()

  return (
    <SiteShell updatedAt={ratingsUpdatedAt}>
      <MatchesContent matches={matches} dataError={dataError} />
    </SiteShell>
  )
}
