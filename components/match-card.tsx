"use client"

import type { Match } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getStageLabel } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface MatchCardProps {
  match: Match
  compact?: boolean
}

export function MatchCard({ match, compact = false }: MatchCardProps) {
  const { locale, t } = useLocale()

  const isFinished = match.status === "finished"
  const isLive = match.status === "live"
  const isScheduled = match.status === "notstarted"

  const hasScore = match.homeScore !== null && match.awayScore !== null

  const homeName = match.homeTeam?.name || match.homeTeamLabel || "TBD"
  const awayName = match.awayTeam?.name || match.awayTeamLabel || "TBD"
  const homeFlag = match.homeTeam?.flag || ""
  const awayFlag = match.awayTeam?.flag || ""

  const isKnockout = match.stage !== "group"
  const isHighlight = match.stage === "final" || match.stage === "sf"

  return (
    <Card
      className={cn(
        "overflow-hidden border-border bg-wc-surface",
        isHighlight && "border-wc-gold/40"
      )}
    >
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">
            {getStageLabel(locale, match.stage)}
            {!isKnockout && match.group && ` · ${t("match.group")} ${match.group}`}
            {match.matchday && ` · ${t("match.matchday")} ${match.matchday}`}
          </span>
          {isLive && (
            <Badge variant="live" className="text-xs">
              {t("match.live")}
            </Badge>
          )}
          {isFinished && (
            <Badge variant="secondary" className="text-xs">
              {t("match.finished")}
            </Badge>
          )}
          {isScheduled && (
            <Badge variant="outline" className="text-xs">
              {match.date} · {match.time}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-right min-w-0">
            <div className="flex items-center justify-end gap-2">
              <span className="font-medium text-sm truncate">{homeName}</span>
              {homeFlag ? (
                <Image
                  src={homeFlag}
                  alt=""
                  width={24}
                  height={16}
                  className="object-cover rounded-sm flex-shrink-0"
                />
              ) : (
                <span className="w-6 h-4 bg-muted rounded-sm inline-block flex-shrink-0" />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center min-w-[70px]">
            {hasScore ? (
              <div className="flex items-center gap-2 font-display text-2xl font-bold tabular-nums">
                <span>{match.homeScore}</span>
                <span className="text-muted-foreground">:</span>
                <span>{match.awayScore}</span>
              </div>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                {t("match.vs")}
              </span>
            )}
          </div>

          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              {awayFlag ? (
                <Image
                  src={awayFlag}
                  alt=""
                  width={24}
                  height={16}
                  className="object-cover rounded-sm flex-shrink-0"
                />
              ) : (
                <span className="w-6 h-4 bg-muted rounded-sm inline-block flex-shrink-0" />
              )}
              <span className="font-medium text-sm truncate">{awayName}</span>
            </div>
          </div>
        </div>

        {(match.homeScorers.length > 0 || match.awayScorers.length > 0) && (
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <div className="text-right flex-1">
              {match.homeScorers.map((s, i) => (
                <div key={i}>{s}</div>
              ))}
            </div>
            <div className="w-4" />
            <div className="text-left flex-1">
              {match.awayScorers.map((s, i) => (
                <div key={i}>{s}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
