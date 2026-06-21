"use client"

import type { BracketNode } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CircleDashed } from "lucide-react"
import Image from "next/image"

interface BracketMatchProps {
  node: BracketNode
  highlight?: boolean
  matchNumber?: number
  hideStage?: boolean
  compact?: boolean
}

function TeamLine({
  side,
  score,
  isWinner,
  compact,
  projectedLabel,
}: {
  side: BracketNode["home"]
  score: number | null
  isWinner: boolean
  compact?: boolean
  projectedLabel: string
}) {
  const flag = side.team?.flag ?? ""

  return (
    <div
      className={cn(
        "flex items-center gap-2 min-w-0",
        compact ? "py-1" : "py-1.5",
        isWinner && "font-semibold"
      )}
    >
      {flag ? (
        <Image
          src={flag}
          alt=""
          width={compact ? 20 : 24}
          height={compact ? 14 : 18}
          className="object-cover rounded-sm shrink-0"
        />
      ) : (
        <span
          className={cn(
            "bg-muted rounded-sm shrink-0",
            compact ? "w-5 h-3.5" : "w-6 h-[18px]"
          )}
        />
      )}
      <span className={cn("flex-1 truncate", compact ? "text-xs" : "text-sm")}>
        {side.label}
      </span>
      {score !== null && (
        <span
          className={cn(
            "font-display tabular-nums w-6 text-right",
            compact ? "text-base" : "text-lg"
          )}
        >
          {score}
        </span>
      )}
      {side.isProvisional && (
        <CircleDashed
          className={cn(
            "shrink-0 text-wc-provisional",
            compact ? "h-3 w-3" : "h-3.5 w-3.5"
          )}
          aria-label={projectedLabel}
        />
      )}
    </div>
  )
}

export function BracketMatch({
  node,
  highlight = false,
  matchNumber,
  hideStage = false,
  compact = false,
}: BracketMatchProps) {
  const { t } = useLocale()
  const { match, home, away } = node
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const isLive = match.status === "live"
  const isProvisional = home.isProvisional || away.isProvisional
  const homeWins =
    hasScore && match.homeScore !== null && match.awayScore !== null
      ? match.homeScore > match.awayScore
      : false
  const awayWins =
    hasScore && match.homeScore !== null && match.awayScore !== null
      ? match.awayScore > match.homeScore
      : false

  const contextLines = [home, away]
    .map((side) =>
      side.origin && side.origin !== side.label ? side.origin : null
    )
    .filter((line, index, arr): line is string => line !== null && arr.indexOf(line) === index)

  return (
    <article
      className={cn(
        "rounded-xl border bg-card h-full",
        compact ? "p-2" : "p-3",
        highlight
          ? "border-wc-gold/50"
          : isProvisional
            ? "border-dashed border-wc-provisional/40"
            : "border-border"
      )}
      aria-label={
        matchNumber
          ? `${t("match.match")} ${matchNumber}: ${home.label} vs ${away.label}`
          : `${home.label} vs ${away.label}`
      }
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        {matchNumber && !compact ? (
          <span className="text-xs font-semibold text-muted-foreground">
            {t("match.match")} {matchNumber}
          </span>
        ) : (
          compact ? (
            <span className="text-[10px] font-semibold text-muted-foreground">
              #{match.id}
            </span>
          ) : (
            !hideStage && (
              <span className="text-xs font-semibold text-muted-foreground">
                {t("match.match")} {match.id}
              </span>
            )
          )
        )}
        <div className="flex items-center gap-1.5 ml-auto">
          {isLive && (
            <Badge variant="live" className="text-[10px] px-1.5">
              {t("match.live")}
            </Badge>
          )}
          {match.status === "finished" && (
            <Badge variant="secondary" className="text-[10px] px-1.5">
              {t("match.finished")}
            </Badge>
          )}
        </div>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border/60 overflow-hidden px-2">
        <TeamLine
          side={home}
          score={hasScore ? match.homeScore : null}
          isWinner={homeWins}
          compact={compact}
          projectedLabel={t("match.projectedTeam")}
        />
        <TeamLine
          side={away}
          score={hasScore ? match.awayScore : null}
          isWinner={awayWins}
          compact={compact}
          projectedLabel={t("match.projectedTeam")}
        />
      </div>

      {!hasScore && match.status === "notstarted" && !compact && (
        <p className="mt-2 text-xs text-center text-muted-foreground">
          {match.date} · {match.time}
        </p>
      )}

      {contextLines.length > 0 && !compact && (
        <p
          className={cn(
            "mt-2 text-xs leading-snug",
            isProvisional ? "text-wc-provisional" : "text-muted-foreground"
          )}
        >
          {isProvisional ? `${t("match.projection")} ` : ""}
          {contextLines.join(" · ")}
        </p>
      )}
    </article>
  )
}
