import type { Metadata } from "next"
import { AnalysisPageClient } from "@/components/analysis/analysis-page-client"
import { SiteShell } from "@/components/layout/site-shell"
import { getTournamentData } from "@/lib/tournament-data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Analysis · WC26 Tracker",
}

export default async function AnalysisPage() {
  const { matches, groups, ratingsUpdatedAt } = await getTournamentData()

  return (
    <SiteShell updatedAt={ratingsUpdatedAt}>
      <AnalysisPageClient matches={matches} groups={groups} />
    </SiteShell>
  )
}
