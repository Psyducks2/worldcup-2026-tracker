"use client"

import type { Team } from "@/types/worldcup"
import type { TeamMeta } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { getTeamMetaForTeam } from "@/lib/seed"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface TeamsContentProps {
  teams: Team[]
}

export function TeamsContent({ teams }: TeamsContentProps) {
  const { t } = useLocale()

  const sorted = [...teams].sort((a, b) => {
    const metaA = getTeamMetaForTeam(a)?.fifaRank ?? 999
    const metaB = getTeamMetaForTeam(b)?.fifaRank ?? 999
    return metaA - metaB
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t("teams.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("teams.description")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}

function TeamCard({ team }: { team: Team }) {
  const { t } = useLocale()
  const meta: TeamMeta | null = getTeamMetaForTeam(team)

  return (
    <Card className="border-border bg-wc-surface">
      <CardContent className="flex items-center gap-4 p-4">
        {team.flag ? (
          <Image src={team.flag} alt="" width={40} height={28} className="rounded-sm object-cover shrink-0" />
        ) : (
          <span className="w-10 h-7 bg-muted rounded-sm shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{team.name}</p>
          <p className="text-xs text-muted-foreground">
            {t("teams.group")} {team.group}
          </p>
        </div>
        <div className="text-right text-xs shrink-0">
          {meta && (
            <>
              <p>
                {t("teams.fifaRank")} #{meta.fifaRank}
              </p>
              <p className="text-muted-foreground">
                {t("teams.elo")} {meta.elo}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
