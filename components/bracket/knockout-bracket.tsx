"use client"

import type { BracketNode, MatchStage } from "@/types/worldcup"
import { BracketMatch } from "@/components/bracket/bracket-match"
import { BracketTreeView } from "@/components/bracket/bracket-tree-view"
import { useLocale } from "@/components/providers/locale-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStageLabel } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { ChevronRight, GitBranch, List } from "lucide-react"
import { useMemo, useState } from "react"

interface KnockoutBracketProps {
  bracket: Record<MatchStage, BracketNode[]>
}

type ViewMode = "list" | "tree"

type Phase = {
  stage: MatchStage
  shortLabel: string
  fullLabel: string
  highlight?: boolean
}

function ViewModeToggle({
  mode,
  onChange,
  listLabel,
  treeLabel,
  ariaLabel,
}: {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
  listLabel: string
  treeLabel: string
  ariaLabel: string
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex rounded-lg border border-border bg-wc-surface p-1"
    >
      <button
        type="button"
        aria-pressed={mode === "list"}
        onClick={() => onChange("list")}
        className={cn(
          "inline-flex items-center gap-2 min-h-11 px-4 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          mode === "list"
            ? "bg-wc-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <List className="h-4 w-4" aria-hidden />
        {listLabel}
      </button>
      <button
        type="button"
        aria-pressed={mode === "tree"}
        onClick={() => onChange("tree")}
        className={cn(
          "inline-flex items-center gap-2 min-h-11 px-4 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          mode === "tree"
            ? "bg-wc-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <GitBranch className="h-4 w-4" aria-hidden />
        {treeLabel}
      </button>
    </div>
  )
}

function PhaseStepper({
  phases,
  activeStage,
  ariaLabel,
}: {
  phases: Phase[]
  activeStage: MatchStage
  ariaLabel: string
}) {
  const activeIndex = phases.findIndex((p) => p.stage === activeStage)

  return (
    <nav
      aria-label={ariaLabel}
      className="hidden sm:flex items-center gap-1 flex-wrap text-xs text-muted-foreground mb-4"
    >
      {phases.map((phase, index) => (
        <div key={phase.stage} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
          )}
          <span
            className={cn(
              "px-2 py-1 rounded-md",
              index === activeIndex
                ? "bg-wc-primary/15 text-wc-primary font-semibold"
                : index < activeIndex
                  ? "text-foreground"
                  : ""
            )}
          >
            {phase.shortLabel}
          </span>
        </div>
      ))}
    </nav>
  )
}

function RoundMatches({
  nodes,
  phase,
  t,
}: {
  nodes: BracketNode[]
  phase: Phase
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  if (nodes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        {t("knockout.matchesUnavailable", { phase: phase.fullLabel })}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <h3 className="font-display font-semibold text-foreground">
          {phase.fullLabel}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {nodes.length}{" "}
          {nodes.length === 1
            ? t("knockout.matchInPhase")
            : t("knockout.matchesInPhase")}
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 list-none">
        {nodes.map((node, index) => (
          <li key={node.match.id}>
            <BracketMatch
              node={node}
              highlight={phase.highlight}
              matchNumber={index + 1}
              hideStage
            />
          </li>
        ))}
      </ol>
    </div>
  )
}

function ListView({
  bracket,
  phases,
  t,
}: KnockoutBracketProps & {
  phases: Phase[]
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const availablePhases = phases.filter((p) => bracket[p.stage].length > 0)
  const defaultPhase = availablePhases[0]?.stage

  if (!defaultPhase) return null

  return (
    <Tabs defaultValue={defaultPhase}>
      <TabsList
        className="flex flex-wrap h-auto min-h-11 gap-1 p-1 w-full bg-wc-surface border border-border"
        aria-label={t("knockout.selectPhaseAria")}
      >
        {availablePhases.map((phase) => (
          <TabsTrigger
            key={phase.stage}
            value={phase.stage}
            className="min-h-11 flex-1 min-w-[80px] data-[state=active]:bg-wc-primary data-[state=active]:text-primary-foreground"
          >
            {phase.shortLabel}
            <span className="ml-1.5 text-[10px] opacity-70">
              ({bracket[phase.stage].length})
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {availablePhases.map((phase) => (
        <TabsContent key={phase.stage} value={phase.stage} className="mt-5">
          <PhaseStepper
            phases={availablePhases}
            activeStage={phase.stage}
            ariaLabel={t("knockout.phasesAria")}
          />
          <RoundMatches nodes={bracket[phase.stage]} phase={phase} t={t} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

export function KnockoutBracket({ bracket }: KnockoutBracketProps) {
  const { locale, t } = useLocale()
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const phases = useMemo<Phase[]>(
    () => [
      {
        stage: "r32",
        shortLabel: t("stageShort.r32"),
        fullLabel: t("stageFull.r32"),
      },
      {
        stage: "r16",
        shortLabel: t("stageShort.r16"),
        fullLabel: t("stageFull.r16"),
      },
      {
        stage: "qf",
        shortLabel: t("stageShort.qf"),
        fullLabel: t("stageFull.qf"),
      },
      {
        stage: "sf",
        shortLabel: t("stageShort.sf"),
        fullLabel: t("stageFull.sf"),
        highlight: true,
      },
      {
        stage: "final",
        shortLabel: t("stageShort.final"),
        fullLabel: t("stageFull.final"),
        highlight: true,
      },
    ],
    [t]
  )

  const availablePhases = phases.filter((p) => bracket[p.stage].length > 0)

  if (availablePhases.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-8">
        {t("knockout.knockoutUnavailable")}
      </p>
    )
  }

  return (
    <section aria-labelledby="knockout-bracket-title">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h2
            id="knockout-bracket-title"
            className="font-display text-2xl font-bold"
          >
            {t("knockout.bracketTitle")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            {viewMode === "list"
              ? t("knockout.listViewDesc")
              : t("knockout.treeViewDesc")}
          </p>
        </div>
        <ViewModeToggle
          mode={viewMode}
          onChange={setViewMode}
          listLabel={t("knockout.list")}
          treeLabel={t("knockout.tree")}
          ariaLabel={t("knockout.viewModeAria")}
        />
      </div>

      {viewMode === "list" ? (
        <ListView bracket={bracket} phases={phases} t={t} />
      ) : (
        <BracketTreeView bracket={bracket} />
      )}

      {bracket.third.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="font-display text-lg font-semibold mb-1">
            {getStageLabel(locale, "third")}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t("knockout.thirdPlaceDesc")}
          </p>
          <div className="max-w-md">
            {bracket.third.map((node, index) => (
              <BracketMatch
                key={node.match.id}
                node={node}
                matchNumber={index + 1}
                hideStage
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
