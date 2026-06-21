"use client"

import type { Match } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { Card, CardContent } from "@/components/ui/card"
import { getTournamentProgress } from "@/lib/tournament-progress"
import { Target, TrendingUp, Trophy } from "lucide-react"

interface StatsCardsProps {
  matches: Match[]
}

export function StatsCards({ matches }: StatsCardsProps) {
  const { t } = useLocale()
  const progress = getTournamentProgress(matches)

  const finishedMatches = matches.filter((m) => m.status === "finished")
  const totalGoals = finishedMatches.reduce((acc, m) => {
    return acc + (m.homeScore || 0) + (m.awayScore || 0)
  }, 0)
  const avgGoals =
    finishedMatches.length > 0
      ? (totalGoals / finishedMatches.length).toFixed(2)
      : "0.00"

  return (
    <div className="space-y-4 mb-8">
      <Card className="border-border bg-wc-surface overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("progress.title")}</p>
              <p className="font-display text-3xl font-bold tabular-nums">
                {progress.percentage}%
                <span className="text-base font-normal text-muted-foreground ml-2">
                  {t("progress.completed")}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <p className="font-display text-xl font-bold tabular-nums">
                  {progress.remaining}
                </p>
                <p className="text-muted-foreground">{t("progress.remaining")}</p>
              </div>
              <div className="hidden sm:block w-px bg-border" />
              <div>
                <p className="font-display text-xl font-bold tabular-nums">
                  {progress.finished} {t("progress.of")} {progress.total}
                </p>
                <p className="text-muted-foreground">{t("progress.total")}</p>
              </div>
            </div>
          </div>
          <div
            className="h-3 w-full rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={progress.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progress.percentage}% ${t("progress.completed")}`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-wc-primary to-wc-gold transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-wc-surface">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-wc-primary/15 rounded-lg">
              <Trophy className="h-6 w-6 text-wc-primary" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">
                {finishedMatches.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("stats.finishedMatches")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-wc-surface">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-wc-provisional/15 rounded-lg">
              <Target className="h-6 w-6 text-wc-provisional" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">{totalGoals}</p>
              <p className="text-sm text-muted-foreground">
                {t("stats.goalsScored")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-wc-surface">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-wc-gold/15 rounded-lg">
              <TrendingUp className="h-6 w-6 text-wc-gold" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">{avgGoals}</p>
              <p className="text-sm text-muted-foreground">
                {t("stats.avgGoals")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
