"use client"

import type { Match } from "@/types/worldcup"
import { MatchDetailHero } from "@/components/matches/match-detail-hero"
import { HeadToHeadCard } from "@/components/matches/head-to-head"
import { ProbabilityBar } from "@/components/matches/probability-bar"
import { RecentFormSection } from "@/components/matches/recent-form"
import { VenueCard } from "@/components/matches/venue-card"
import { useLocale } from "@/components/providers/locale-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormResult, HeadToHeadSummary } from "@/types/worldcup"

interface MatchDetailContentProps {
  match: Match
  ratingsUpdatedAt: string
  homeForm: FormResult[]
  awayForm: FormResult[]
  h2h: HeadToHeadSummary
}

export function MatchDetailContent({
  match,
  ratingsUpdatedAt,
  homeForm,
  awayForm,
  h2h,
}: MatchDetailContentProps) {
  const { t } = useLocale()

  const homeName = match.homeTeam?.name ?? match.homeTeamLabel ?? "TBD"
  const awayName = match.awayTeam?.name ?? match.awayTeamLabel ?? "TBD"

  return (
    <div className="space-y-8">
      <MatchDetailHero match={match} />

      {match.prediction && (
        <Card className="border-border bg-wc-surface">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">
              {t("match.winProbability")}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {t("match.eloModel")} · {t("match.ratingsAsOf")} {ratingsUpdatedAt}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProbabilityBar
              prediction={match.prediction}
              homeName={homeName}
              awayName={awayName}
            />
            <p className="text-xs text-muted-foreground">{t("match.eloFootnote")}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentFormSection
          homeName={homeName}
          awayName={awayName}
          homeFlag={match.homeTeam?.flag}
          awayFlag={match.awayTeam?.flag}
          homeForm={homeForm}
          awayForm={awayForm}
        />
        <HeadToHeadCard summary={h2h} />
      </div>

      <VenueCard match={match} />
    </div>
  )
}
