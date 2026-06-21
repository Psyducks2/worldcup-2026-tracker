"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocale } from "@/components/providers/locale-provider"
import { cn } from "@/lib/utils"

interface SectionTabsProps {
  overview: React.ReactNode
  standings: React.ReactNode
  knockout: React.ReactNode
  className?: string
}

export function SectionTabs({
  overview,
  standings,
  knockout,
  className,
}: SectionTabsProps) {
  const { t } = useLocale()

  return (
    <Tabs defaultValue="overview" className={cn("w-full", className)}>
      <TabsList className="grid w-full grid-cols-3 h-auto min-h-11 p-1 bg-wc-surface border border-border">
        <TabsTrigger
          value="overview"
          className="min-h-11 data-[state=active]:bg-wc-primary data-[state=active]:text-primary-foreground"
        >
          {t("tabs.overview")}
        </TabsTrigger>
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

      <TabsContent value="overview" className="mt-6 space-y-8">
        {overview}
      </TabsContent>

      <TabsContent value="standings" className="mt-6 space-y-8">
        {standings}
      </TabsContent>

      <TabsContent value="knockout" className="mt-6 space-y-8">
        {knockout}
      </TabsContent>
    </Tabs>
  )
}
