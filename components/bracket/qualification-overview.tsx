"use client"

import type { Group, TeamQualification } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getGroupLetter } from "@/lib/api"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface QualificationOverviewProps {
  groups: Group[]
  qualifications: TeamQualification[]
}

function getQualForTeam(
  qualifications: TeamQualification[],
  groupLetter: string,
  teamId: string
) {
  return qualifications.find(
    (q) =>
      q.team.id === teamId &&
      q.group.toUpperCase() === groupLetter.toUpperCase()
  )
}

function PositionBadge({
  qual,
  t,
}: {
  qual: TeamQualification | undefined
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  if (!qual) return null

  if (qual.zone === "direct") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "text-[10px] shrink-0",
          qual.status === "confirmed"
            ? "border-wc-confirmed/50 text-wc-confirmed"
            : "border-wc-provisional/50 text-wc-provisional"
        )}
      >
        {qual.status === "confirmed"
          ? t("knockout.toR32")
          : t("knockout.provisionalR32")}
      </Badge>
    )
  }

  if (qual.zone === "third_playoff") {
    return (
      <Badge
        variant="outline"
        className="text-[10px] shrink-0 border-wc-provisional/50 text-wc-provisional"
      >
        {t("knockout.thirdPlaceOrdinal")} — {qual.thirdRank}º {t("knockout.thirdBest")}
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="text-[10px] shrink-0 border-border text-muted-foreground"
    >
      {t("knockout.outOfProjection")}
    </Badge>
  )
}

export function QualificationOverview({
  groups,
  qualifications,
}: QualificationOverviewProps) {
  const { t } = useLocale()

  const projectedCount = qualifications.filter(
    (q) => q.zone === "direct" || q.zone === "third_playoff"
  ).length

  return (
    <Card className="border-border bg-wc-surface">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-xl">
          {t("knockout.whoQualifiesTitle")}
        </CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("knockout.whoQualifiesDesc")}{" "}
          <strong className="text-foreground">
            {projectedCount} {t("knockout.teams")}
          </strong>
          .
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {groups.map((group) => {
          const groupLetter = getGroupLetter(group.name)

          return (
            <div
              key={group.name}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <div className="px-3 py-2 bg-muted/40 border-b border-border">
                <h3 className="font-display text-sm font-semibold">
                  {group.name}
                </h3>
              </div>
              <ul className="divide-y divide-border">
                {group.standings.map((standing) => {
                  const qual = getQualForTeam(
                    qualifications,
                    groupLetter,
                    standing.team.id
                  )

                  return (
                    <li
                      key={standing.team.id}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 min-h-11",
                        qual?.zone === "direct" && "bg-wc-primary/5",
                        qual?.zone === "third_playoff" && "bg-wc-provisional/5"
                      )}
                    >
                      <span
                        className="w-6 text-center text-sm font-bold text-muted-foreground shrink-0"
                        aria-label={`${standing.position}º ${t("knockout.position")}`}
                      >
                        {standing.position}º
                      </span>
                      {standing.team.flag ? (
                        <Image
                          src={standing.team.flag}
                          alt=""
                          width={24}
                          height={18}
                          className="object-cover rounded-sm shrink-0"
                        />
                      ) : (
                        <span className="w-6 h-[18px] bg-muted rounded-sm shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {standing.team.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {standing.points} {t("knockout.pts")} · {t("knockout.gd")}{" "}
                          {standing.goalDifference > 0 ? "+" : ""}
                          {standing.goalDifference}
                        </p>
                      </div>
                      <PositionBadge qual={qual} t={t} />
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
