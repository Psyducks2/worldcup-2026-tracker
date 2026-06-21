"use client"

import type { HeadToHeadSummary } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HeadToHeadCardProps {
  summary: HeadToHeadSummary
}

export function HeadToHeadCard({ summary }: HeadToHeadCardProps) {
  const { t } = useLocale()

  return (
    <Card className="border-border bg-wc-surface h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider">
          {t("h2h.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary.meetings === 0 ? (
          <p className="text-sm text-muted-foreground">{t("h2h.firstMeeting")}</p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {summary.meetings} {t("h2h.meetings")}
            </p>
            {summary.lastMeeting && (
              <p className="text-sm font-medium">{summary.lastMeeting.summary}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
