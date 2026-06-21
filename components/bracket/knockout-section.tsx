"use client"

import { useLocale } from "@/components/providers/locale-provider"
import { KnockoutBracket } from "@/components/bracket/knockout-bracket"
import { KnockoutLegend } from "@/components/bracket/knockout-legend"
import { QualificationOverview } from "@/components/bracket/qualification-overview"
import { ProvisionalNotice } from "@/components/provisional-notice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BracketNode, Group, MatchStage, TeamQualification } from "@/types/worldcup"

interface KnockoutSectionProps {
  groups: Group[]
  qualifications: TeamQualification[]
  bracket: Record<MatchStage, BracketNode[]>
}

export function KnockoutSection({
  groups,
  qualifications,
  bracket,
}: KnockoutSectionProps) {
  const { t } = useLocale()

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-2xl font-bold">{t("knockout.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          {t("knockout.description")}
        </p>
      </header>

      <ProvisionalNotice />
      <KnockoutLegend />

      <Tabs defaultValue="qualification">
        <TabsList className="grid w-full grid-cols-2 h-auto min-h-11 p-1 bg-wc-surface border border-border">
          <TabsTrigger
            value="qualification"
            className="min-h-11 data-[state=active]:bg-wc-primary data-[state=active]:text-primary-foreground"
          >
            {t("knockout.whoQualifies")}
          </TabsTrigger>
          <TabsTrigger
            value="bracket"
            className="min-h-11 data-[state=active]:bg-wc-primary data-[state=active]:text-primary-foreground"
          >
            {t("knockout.matchups")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qualification" className="mt-5">
          <QualificationOverview
            groups={groups}
            qualifications={qualifications}
          />
        </TabsContent>

        <TabsContent value="bracket" className="mt-5">
          <KnockoutBracket bracket={bracket} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
