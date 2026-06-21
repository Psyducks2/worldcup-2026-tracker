"use client"

import type { Match } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VenueCardProps {
  match: Match
}

export function VenueCard({ match }: VenueCardProps) {
  const { t } = useLocale()

  if (!match.stadium) return null

  return (
    <Card className="border-border bg-wc-surface">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider">
          {t("venue.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-medium">
          {match.stadium.name} · {match.stadium.city}, {match.stadium.country}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("match.localKickoff")}: {match.time} ({match.time} {t("match.forYou")})
        </p>
      </CardContent>
    </Card>
  )
}
