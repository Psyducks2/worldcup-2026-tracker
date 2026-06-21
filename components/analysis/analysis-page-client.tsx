"use client"

import { useMemo } from "react"
import type { Group, Match } from "@/types/worldcup"
import { AnalysisContent } from "@/components/analysis/analysis-content"
import { useLocale } from "@/components/providers/locale-provider"
import type { DailyAnalysis } from "@/lib/analysis"
import { buildClientAnalysis } from "@/lib/analysis-client"

interface AnalysisPageClientProps {
  matches: Match[]
  groups: Group[]
}

export function AnalysisPageClient({ matches, groups }: AnalysisPageClientProps) {
  const { locale } = useLocale()

  const analysis: DailyAnalysis = useMemo(
    () => buildClientAnalysis(matches, groups, locale),
    [matches, groups, locale]
  )

  return <AnalysisContent analysis={analysis} />
}
