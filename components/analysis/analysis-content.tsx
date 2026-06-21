"use client"

import type { AnalysisSection, DailyAnalysis } from "@/lib/analysis"
import { useLocale } from "@/components/providers/locale-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AnalysisContentProps {
  analysis: DailyAnalysis
}

export function AnalysisContent({ analysis }: AnalysisContentProps) {
  const { t } = useLocale()

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold">{t("analysis.title")}</h1>
        <Badge variant="secondary" className="text-xs">
          {analysis.usedAi ? t("analysis.aiGenerated") : t("analysis.noKey")}
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm">{t("analysis.subtitle")}</p>
      <p className="text-xs text-muted-foreground">{t("disclaimer.aiLabel")}</p>

      <div className="space-y-6">
        {analysis.sections.map((section) => (
          <AnalysisSectionCard key={section.id} section={section} />
        ))}
      </div>

      <Card className="border-border bg-wc-surface/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("analysis.sources")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• Elo model probabilities — ratings as of today</p>
          <p>• Recent form — historical international results (seed dataset)</p>
          <p>• Head-to-head — historical international results (seed dataset)</p>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalysisSectionCard({ section }: { section: AnalysisSection }) {
  return (
    <Card className="border-border bg-wc-surface">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display font-bold">{section.title}</CardTitle>
        <p className="text-xs text-muted-foreground">Generated {section.generatedAt}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm leading-relaxed">
        {section.body.map((paragraph, i) => (
          <p
            key={i}
            className="text-muted-foreground [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{
              __html: paragraph
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/^• /, ""),
            }}
          />
        ))}
      </CardContent>
    </Card>
  )
}
