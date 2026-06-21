import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MatchDetailContent } from "@/components/matches/match-detail-content"
import { SiteShell } from "@/components/layout/site-shell"
import { getHeadToHead } from "@/lib/h2h"
import { getRecentForm } from "@/lib/form"
import { resolveIso2 } from "@/lib/seed"
import { getMatchById, getTournamentData } from "@/lib/tournament-data"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { matches } = await getTournamentData()
  const match = getMatchById(matches, id)
  if (!match) return { title: "Match · WC26 Tracker" }

  const home = match.homeTeam?.name ?? match.homeTeamLabel ?? "TBD"
  const away = match.awayTeam?.name ?? match.awayTeamLabel ?? "TBD"
  return { title: `${home} vs ${away} · WC26 Tracker` }
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params
  const { matches, ratingsUpdatedAt } = await getTournamentData()
  const match = getMatchById(matches, id)

  if (!match) notFound()

  const homeIso = match.homeTeam
    ? resolveIso2(match.homeTeam.code, match.homeTeam.iso2)
    : ""
  const awayIso = match.awayTeam
    ? resolveIso2(match.awayTeam.code, match.awayTeam.iso2)
    : ""

  const homeForm = homeIso ? getRecentForm(homeIso, matches) : []
  const awayForm = awayIso ? getRecentForm(awayIso, matches) : []
  const h2h =
    homeIso && awayIso
      ? getHeadToHead(homeIso, awayIso)
      : { meetings: 0, lastMeeting: null }

  return (
    <SiteShell updatedAt={ratingsUpdatedAt} showDisclaimer={false}>
      <MatchDetailContent
        match={match}
        ratingsUpdatedAt={ratingsUpdatedAt}
        homeForm={homeForm}
        awayForm={awayForm}
        h2h={h2h}
      />
    </SiteShell>
  )
}
