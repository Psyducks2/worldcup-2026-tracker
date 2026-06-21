"use client"

import type { BracketNode, Group, Match, MatchStage, TeamQualification } from "@/types/worldcup"
import { KnockoutSection } from "@/components/bracket/knockout-section"
import { GroupTable } from "@/components/group-table"
import { SectionTabs } from "@/components/layout/section-tabs"
import { SiteHeader } from "@/components/layout/site-header"
import { MatchCard } from "@/components/match-card"
import { StatsCards } from "@/components/stats-cards"
import { useLocale } from "@/components/providers/locale-provider"
import { getLiveMatches, getUpcomingMatches } from "@/lib/api"
import { ExternalLink, Radio, Trophy, WifiOff } from "lucide-react"

interface HomeContentProps {
  groups: Group[]
  matches: Match[]
  qualifications: TeamQualification[]
  bracket: Record<MatchStage, BracketNode[]>
  dataError?: boolean
}

export function HomeContent({
  groups,
  matches,
  qualifications,
  bracket,
  dataError = false,
}: HomeContentProps) {
  const { t } = useLocale()

  const upcoming = getUpcomingMatches(matches, 8)
  const liveMatches = getLiveMatches(matches)
  const groupMatches = matches.filter((m) => m.stage === "group")

  const overview = (
    <>
      <StatsCards matches={matches} />

      {liveMatches.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Radio className="h-6 w-6 text-wc-live" />
            {t("sections.live")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-wc-primary" />
            {t("sections.upcoming")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}
    </>
  )

  const standings = (
    <>
      <section>
        <h2 className="font-display text-2xl font-bold mb-2">
          {t("sections.groupStage")}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t("sections.groupStageDesc")}
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((group) => (
            <GroupTable
              key={group.name}
              group={group}
              qualifications={qualifications}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-6">
          {t("sections.groupMatches")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groupMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </>
  )

  const knockout = (
    <KnockoutSection
      groups={groups}
      qualifications={qualifications}
      bracket={bracket}
    />
  )

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {dataError && (
          <div
            role="alert"
            className="mb-6 flex gap-3 rounded-xl border border-wc-live/30 bg-wc-live/10 px-4 py-3"
          >
            <WifiOff
              className="h-5 w-5 shrink-0 text-wc-live mt-0.5"
              aria-hidden
            />
            <div className="text-sm">
              <p className="font-medium text-foreground">{t("error.title")}</p>
              <p className="mt-1 text-muted-foreground">{t("error.description")}</p>
            </div>
          </div>
        )}
        <SectionTabs
          overview={overview}
          standings={standings}
          knockout={knockout}
        />
      </main>

      <footer className="border-t border-border bg-wc-surface/50 mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
              <p className="text-sm text-foreground">
                {t("footer.developedBy")}{" "}
                <span className="font-medium">Luis Roberto — PsyDucks2</span>
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                <a
                  href="https://www.linkedin.com/in/luis-roberto-4aa69b30a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-11 text-sm text-wc-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Psyducks2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-11 text-sm text-wc-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  GitHub
                </a>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{t("footer.dataSource")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
