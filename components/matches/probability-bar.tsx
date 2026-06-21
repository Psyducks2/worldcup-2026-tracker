"use client"

import type { MatchPrediction } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { cn } from "@/lib/utils"

interface ProbabilityBarProps {
  prediction: MatchPrediction
  homeName: string
  awayName: string
  compact?: boolean
  showLegend?: boolean
}

export function ProbabilityBar({
  prediction,
  homeName,
  awayName,
  compact = false,
  showLegend = true,
}: ProbabilityBarProps) {
  const { t } = useLocale()
  const { homeWin, draw, awayWin } = prediction

  const homeFavored = homeWin >= awayWin && homeWin > draw
  const awayFavored = awayWin > homeWin && awayWin > draw

  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      <div
        className={cn(
          "flex w-full overflow-hidden rounded-md",
          compact ? "h-2" : "h-3"
        )}
        role="img"
        aria-label={`${homeName} ${homeWin}%, ${t("match.draw")} ${draw}%, ${awayName} ${awayWin}%`}
      >
        <div
          className="bg-wc-primary shrink-0"
          style={{ width: `${homeWin}%` }}
        />
        <div
          className="shrink-0 bg-muted"
          style={{
            width: `${draw}%`,
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 3px, oklch(0.35 0.02 260) 3px, oklch(0.35 0.02 260) 6px)",
          }}
        />
        <div
          className="bg-wc-live shrink-0"
          style={{ width: `${awayWin}%` }}
        />
      </div>

      {showLegend && (
        <ul className={cn("flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", compact && "text-[11px]")}>
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-wc-primary" aria-hidden />
            {homeFavored && <span className="text-wc-primary">▲</span>}
            {homeName} {homeWin}%
            {homeFavored && (
              <span className="text-muted-foreground">({t("match.favored")})</span>
            )}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted" aria-hidden />
            {t("match.draw")} {draw}%
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-wc-live" aria-hidden />
            {awayFavored && <span className="text-wc-live">▲</span>}
            {awayName} {awayWin}%
            {awayFavored && (
              <span className="text-muted-foreground">({t("match.favored")})</span>
            )}
          </li>
        </ul>
      )}
    </div>
  )
}
