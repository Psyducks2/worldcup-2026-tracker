"use client"

import Link from "next/link"
import type { Match } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { formatMatchDateShort } from "@/lib/api"
import Image from "next/image"

interface MatchDetailHeroProps {
  match: Match
}

export function MatchDetailHero({ match }: MatchDetailHeroProps) {
  const { locale, t } = useLocale()

  const homeName = match.homeTeam?.name ?? match.homeTeamLabel ?? "TBD"
  const awayName = match.awayTeam?.name ?? match.awayTeamLabel ?? "TBD"
  const venue = match.stadium
    ? `${match.stadium.city}, ${match.stadium.country}`
    : ""

  const meta = [
    match.group && `${t("match.group")} ${match.group}`,
    match.matchday && `${t("match.matchday")} ${match.matchday}`,
    match.stadium?.name,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <section className="rounded-xl bg-gradient-to-br from-[oklch(0.22_0.04_260)] to-[oklch(0.15_0.02_260)] px-6 py-8 -mx-4 sm:mx-0 sm:px-10">
      <Link
        href="/matches"
        className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
      >
        ← {t("match.backTo")} {formatMatchDateShort(match.date, locale)}
      </Link>

      <p className="text-xs uppercase tracking-widest text-muted-foreground text-right mb-4">
        {meta}
      </p>

      <div className="space-y-4">
        <TeamHeroLine name={homeName} code={match.homeTeam?.code} flag={match.homeTeam?.flag} />
        <TeamHeroLine name={awayName} code={match.awayTeam?.code} flag={match.awayTeam?.flag} />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {formatMatchDateShort(match.date, locale)}, {match.time}
        {venue && ` · ${venue}`}
      </p>
    </section>
  )
}

function TeamHeroLine({
  name,
  code,
  flag,
}: {
  name: string
  code?: string
  flag?: string
}) {
  return (
    <div className="flex items-center gap-4">
      {flag ? (
        <Image src={flag} alt="" width={40} height={28} className="rounded-sm object-cover" />
      ) : (
        <span className="w-10 h-7 bg-muted rounded-sm" />
      )}
      <div className="flex items-baseline gap-3">
        {code && <span className="text-sm text-muted-foreground font-mono">{code}</span>}
        <span className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight">
          {name}
        </span>
      </div>
    </div>
  )
}
