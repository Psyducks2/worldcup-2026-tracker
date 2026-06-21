"use client"

import type { Group, TeamQualification } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getGroupLetter } from "@/lib/api"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface GroupTableProps {
  group: Group
  qualifications: TeamQualification[]
}

export function GroupTable({ group, qualifications }: GroupTableProps) {
  const { t } = useLocale()
  const groupLetter = getGroupLetter(group.name)

  function getQualificationBadge(qual: TeamQualification | undefined) {
    if (!qual) return null

    switch (qual.zone) {
      case "direct":
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
              ? t("groupTable.qualified")
              : t("groupTable.provisional")}
          </Badge>
        )
      case "third_playoff":
        return (
          <Badge
            variant="outline"
            className="text-[10px] shrink-0 border-wc-provisional/50 text-wc-provisional"
          >
            {t("groupTable.playoffSpot")}
          </Badge>
        )
      case "eliminated":
        return (
          <Badge
            variant="outline"
            className="text-[10px] shrink-0 border-border text-muted-foreground"
          >
            {t("groupTable.out")}
          </Badge>
        )
      case "fighting":
        return (
          <Badge variant="outline" className="text-[10px] shrink-0">
            {t("groupTable.fighting")}
          </Badge>
        )
      default: {
        const _exhaustive: never = qual.zone
        return _exhaustive
      }
    }
  }

  function getRowClass(qual: TeamQualification | undefined) {
    if (!qual) return ""
    if (qual.zone === "direct") return "bg-wc-primary/5"
    if (qual.zone === "third_playoff") return "bg-wc-provisional/5"
    return ""
  }

  return (
    <Card className="border-border bg-wc-surface overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg">{group.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>{t("groupTable.team")}</TableHead>
              <TableHead className="text-center">P</TableHead>
              <TableHead className="text-center hidden sm:table-cell">J</TableHead>
              <TableHead className="text-center hidden md:table-cell">V</TableHead>
              <TableHead className="text-center hidden md:table-cell">E</TableHead>
              <TableHead className="text-center hidden md:table-cell">D</TableHead>
              <TableHead className="text-center hidden lg:table-cell">GP</TableHead>
              <TableHead className="text-center hidden lg:table-cell">GC</TableHead>
              <TableHead className="text-center">SG</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.standings.map((standing) => {
              const qual = qualifications.find(
                (q) =>
                  q.team.id === standing.team.id &&
                  q.group.toUpperCase() === groupLetter.toUpperCase()
              )

              return (
                <TableRow
                  key={standing.team.id}
                  className={getRowClass(qual)}
                >
                  <TableCell className="font-medium">{standing.position}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-0">
                      {standing.team.flag ? (
                        <Image
                          src={standing.team.flag}
                          alt=""
                          width={20}
                          height={16}
                          className="object-cover rounded-sm shrink-0"
                        />
                      ) : (
                        <span className="w-5 h-4 bg-muted rounded-sm inline-block shrink-0" />
                      )}
                      <span className="font-medium text-sm truncate">
                        {standing.team.name}
                      </span>
                      {getQualificationBadge(qual)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {standing.points}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {standing.played}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    {standing.won}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    {standing.drawn}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    {standing.lost}
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    {standing.goalsFor}
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    {standing.goalsAgainst}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        standing.goalDifference > 0 && "text-wc-primary",
                        standing.goalDifference < 0 && "text-wc-live"
                      )}
                    >
                      {standing.goalDifference > 0 ? "+" : ""}
                      {standing.goalDifference}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
