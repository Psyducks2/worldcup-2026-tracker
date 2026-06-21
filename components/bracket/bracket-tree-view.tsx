"use client"

import type { BracketNode, MatchStage } from "@/types/worldcup"
import { BracketMatch } from "@/components/bracket/bracket-match"
import { useLocale } from "@/components/providers/locale-provider"
import { cn } from "@/lib/utils"
import { ArrowLeftRight } from "lucide-react"
import { useMemo } from "react"

interface BracketTreeViewProps {
  bracket: Record<MatchStage, BracketNode[]>
}

const SLOT_HEIGHT = 108

function TreeColumn({
  nodes,
  label,
  highlight,
  showConnector,
  columnHeight,
}: {
  nodes: BracketNode[]
  label: string
  highlight?: boolean
  showConnector?: boolean
  columnHeight: number
}) {
  if (nodes.length === 0) return null

  return (
    <div
      className={cn(
        "relative flex flex-col shrink-0",
        showConnector && "pr-8"
      )}
      style={{ minHeight: columnHeight }}
    >
      <h3
        className={cn(
          "font-display text-xs font-semibold text-center mb-3 sticky top-0 bg-wc-bg/95 py-2 z-10",
          highlight ? "text-wc-gold" : "text-muted-foreground"
        )}
      >
        {label}
      </h3>

      <div
        className="flex flex-col justify-around flex-1 gap-1"
        role="list"
      >
        {nodes.map((node, index) => (
          <div
            key={node.match.id}
            className={cn(
              "relative w-[200px]",
              showConnector &&
                "after:absolute after:top-1/2 after:-right-8 after:w-8 after:h-px after:bg-border"
            )}
            role="listitem"
          >
            {showConnector && index % 2 === 0 && index + 1 < nodes.length && (
              <div
                className="absolute -right-8 top-1/2 w-px bg-border pointer-events-none"
                style={{ height: SLOT_HEIGHT }}
              />
            )}
            <BracketMatch node={node} compact highlight={highlight} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BracketTreeView({ bracket }: BracketTreeViewProps) {
  const { t } = useLocale()

  const treePhases = useMemo(
    () => [
      { stage: "r32" as const, label: t("stageShort.r32") },
      { stage: "r16" as const, label: t("stageShort.r16") },
      { stage: "qf" as const, label: t("stageShort.qf") },
      { stage: "sf" as const, label: t("stageShort.sf"), highlight: true },
      { stage: "final" as const, label: t("stageShort.final"), highlight: true },
    ],
    [t]
  )

  const availablePhases = treePhases.filter(
    (p) => bracket[p.stage].length > 0
  )

  if (availablePhases.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        {t("knockout.knockoutUnavailable")}
      </p>
    )
  }

  const r32Count = bracket.r32.length || 16
  const columnHeight = Math.max(r32Count * SLOT_HEIGHT, 400)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowLeftRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{t("knockout.scrollHint")}</span>
      </div>

      <div
        className="overflow-x-auto pb-4 -mx-1 px-1"
        tabIndex={0}
        role="region"
        aria-label={t("knockout.treeAria")}
      >
        <div className="flex items-stretch gap-0 min-w-max py-2">
          {availablePhases.map((phase, index) => (
            <TreeColumn
              key={phase.stage}
              nodes={bracket[phase.stage]}
              label={phase.label}
              highlight={phase.highlight}
              showConnector={index < availablePhases.length - 1}
              columnHeight={columnHeight}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
