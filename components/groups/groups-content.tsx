"use client"

import type { BracketNode, Group, MatchStage, TeamQualification } from "@/types/worldcup"
import { KnockoutSection } from "@/components/bracket/knockout-section"
import { GroupTable } from "@/components/group-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocale } from "@/components/providers/locale-provider"

interface GroupsContentProps {
  groups: Group[]
  qualifications: TeamQualification[]
  bracket: Record<MatchStage, BracketNode[]>
}

export function GroupsContent({ groups, qualifications, bracket }: GroupsContentProps) {
  const { t } = useLocale()

  const standings = (
    <div className="grid gap-6 md:grid-cols-2">
      {groups.map((group) => (
        <GroupTable
          key={group.name}
          group={group}
          qualifications={qualifications}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t("nav.groups")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("sections.groupStageDesc")}</p>
      </div>
      <Tabs defaultValue="standings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto min-h-11 p-1 bg-wc-surface border border-border">
          <TabsTrigger
            value="standings"
            className="min-h-11 data-[state=active]:bg-wc-primary data-[state=active]:text-primary-foreground"
          >
            {t("tabs.standings")}
          </TabsTrigger>
          <TabsTrigger
            value="knockout"
            className="min-h-11 data-[state=active]:bg-wc-primary data-[state=active]:text-primary-foreground"
          >
            {t("tabs.knockout")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="standings" className="mt-6">
          {standings}
        </TabsContent>
        <TabsContent value="knockout" className="mt-6">
          <KnockoutSection
            groups={groups}
            qualifications={qualifications}
            bracket={bracket}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
