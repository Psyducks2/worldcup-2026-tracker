"use client"

import Link from "next/link"
import type { Match } from "@/types/worldcup"
import { ProbabilityBar } from "@/components/matches/probability-bar"
import { useLocale } from "@/components/providers/locale-provider"
import { getTeamMetaForTeam } from "@/lib/seed"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface MatchListCardProps {
  match: Match
}

export function MatchListCard({ match }: MatchListCardProps) {
  const { t } = useLocale()

  const homeName = match.homeTeam?.name ?? match.homeTeamLabel ?? "TBD"
  const awayName = match.awayTeam?.name ?? match.awayTeamLabel ?? "TBD"
  const homeMeta = match.homeTeam ? getTeamMetaForTeam(match.homeTeam) : null
  const awayMeta = match.awayTeam ? getTeamMetaForTeam(match.awayTeam) : null

  const hasScore = match.homeScore !== null && match.awayScore !== null
  const venue = match.stadium
    ? `${match.stadium.name} · ${match.stadium.city}, ${match.stadium.country}`
    : null

  return (
    <Card className="overflow-hidden border-border bg-wc-surface hover:border-wc-primary/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground uppercase tracking-wide">
          <span>
            {match.group && `${t("match.group")} ${match.group}`}
            {match.matchday && ` · ${t("match.matchday")} ${match.matchday}`}
          </span>
          <span>{match.time}</span>
        </div>

        <div className="space-y-3">
          <TeamRow
            name={homeName}
            flag={match.homeTeam?.flag}
            code={match.homeTeam?.code}
            fifaRank={homeMeta?.fifaRank}
            winPct={match.prediction?.homeWin}
            align="left"
          />
          <TeamRow
            name={awayName}
            flag={match.awayTeam?.flag}
            code={match.awayTeam?.code}
            fifaRank={awayMeta?.fifaRank}
            winPct={match.prediction?.awayWin}
            align="left"
          />
        </div>

        {hasScore && (
          <div className="mt-3 text-center font-display text-2xl font-bold tabular-nums">
            {match.homeScore} – {match.awayScore}
          </div>
        )}

        {match.prediction && !hasScore && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              {t("match.winProbability")}
            </p>
            <ProbabilityBar
              prediction={match.prediction}
              homeName={homeName}
              awayName={awayName}
              compact
            />
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{venue ?? "—"}</span>
          <Link
            href={`/matches/${match.id}`}
            className="shrink-0 font-medium text-wc-primary hover:underline ml-2"
          >
            {t("match.details")}
          </Link>
        </div>

        {match.status === "live" && (
          <Badge variant="live" className="mt-3 text-xs">
            {t("match.live")}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

function TeamRow({
  name,
  flag,
  code,
  fifaRank,
  winPct,
  align,
}: {
  name: string
  flag?: string
  code?: string
  fifaRank?: number
  winPct?: number
  align: "left" | "right"
}) {
  const { t } = useLocale()

  return (
    <div className={cn("flex items-center gap-3", align === "right" && "flex-row-reverse")}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {flag ? (
          <Image src={flag} alt="" width={28} height={20} className="rounded-sm object-cover shrink-0" />
        ) : (
          <span className="w-7 h-5 bg-muted rounded-sm shrink-0" />
        )}
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            {code && (
              <span className="text-xs text-muted-foreground font-mono">{code}</span>
            )}
            <span className="font-display font-bold uppercase truncate">{name}</span>
          </div>
          {fifaRank && (
            <span className="text-xs text-muted-foreground">
              {t("match.fifaRank")} #{fifaRank}
            </span>
          )}
        </div>
      </div>
      {winPct !== undefined && (
        <span className="font-display text-2xl font-bold tabular-nums shrink-0">
          {winPct}%
        </span>
      )}
    </div>
  )
}
