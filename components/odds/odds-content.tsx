"use client"

import { useLocale } from "@/components/providers/locale-provider"
import type { TitleOddsEntry } from "@/types/worldcup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"

interface OddsContentProps {
  odds: TitleOddsEntry[]
  updatedAt: string
  teamsByIso: Record<string, { name: string; flag: string }>
}

export function OddsContent({ odds, updatedAt, teamsByIso }: OddsContentProps) {
  const { t } = useLocale()

  const movers = [...odds]
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 3)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">{t("odds.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("odds.description")}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {t("odds.updated")} {updatedAt}
        </p>
      </div>

      <section>
        <h2 className="font-display text-lg font-bold mb-4">{t("odds.movers")}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {movers.map((entry) => {
            const team = teamsByIso[entry.iso2]
            const up = entry.delta > 0
            return (
              <Card key={entry.iso2} className="border-border bg-wc-surface">
                <CardContent className="flex items-center justify-between p-4">
                  <span className="font-medium">{team?.name ?? entry.iso2.toUpperCase()}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold">{entry.probability}%</span>
                    <span
                      className={cn(
                        "flex items-center gap-0.5",
                        up ? "text-wc-primary" : "text-wc-live"
                      )}
                    >
                      {up ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      {Math.abs(entry.delta)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <Card className="border-border bg-wc-surface">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider">
            {t("odds.allOdds")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4">{t("odds.team")}</th>
                  <th className="pb-2 pr-4">{t("odds.probability")}</th>
                  <th className="pb-2">{t("odds.change")}</th>
                </tr>
              </thead>
              <tbody>
                {odds.map((entry) => {
                  const team = teamsByIso[entry.iso2]
                  return (
                    <tr key={entry.iso2} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">
                        {team?.name ?? entry.iso2.toUpperCase()}
                      </td>
                      <td className="py-3 pr-4 tabular-nums">{entry.probability}%</td>
                      <td
                        className={cn(
                          "py-3 tabular-nums",
                          entry.delta > 0 ? "text-wc-primary" : entry.delta < 0 ? "text-wc-live" : ""
                        )}
                      >
                        {entry.delta > 0 ? "+" : ""}
                        {entry.delta}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
