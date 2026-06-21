"use client"

import { useMemo, useState } from "react"
import type { Match } from "@/types/worldcup"
import { DateScroller, DateSectionHeader } from "@/components/matches/date-scroller"
import { MatchListCard } from "@/components/matches/match-list-card"
import { useLocale } from "@/components/providers/locale-provider"
import { parseMatchDate } from "@/lib/api"
import { WifiOff } from "lucide-react"

interface MatchesContentProps {
  matches: Match[]
  dataError?: boolean
}

export function MatchesContent({ matches, dataError }: MatchesContentProps) {
  const { t } = useLocale()

  const dates = useMemo(() => {
    const map = new Map<string, number>()
    for (const m of matches) {
      map.set(m.date, (map.get(m.date) ?? 0) + 1)
    }
    return [...map.entries()]
      .sort(([a], [b]) => parseMatchDate(a).getTime() - parseMatchDate(b).getTime())
      .map(([date, count]) => ({ date, count }))
  }, [matches])

  const todayStr = useMemo(() => {
    const now = new Date()
    const found = dates.find(({ date }) => {
      const d = parseMatchDate(date)
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      )
    })
    return found?.date ?? dates[0]?.date ?? ""
  }, [dates])

  const [selectedDate, setSelectedDate] = useState(todayStr)

  const visibleDates = useMemo(() => {
    if (!selectedDate) return dates
    const idx = dates.findIndex((d) => d.date === selectedDate)
    if (idx === -1) return dates.slice(0, 3)
    return dates.slice(Math.max(0, idx - 1), idx + 4)
  }, [dates, selectedDate])

  const dayMatches = matches
    .filter((m) => m.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">
          World Cup 2026 — {t("nav.matches")}
        </h1>
        <p className="text-muted-foreground text-sm">{t("disclaimer.notBetting")}</p>
      </div>

      {dataError && (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-wc-live/30 bg-wc-live/10 px-4 py-3"
        >
          <WifiOff className="h-5 w-5 shrink-0 text-wc-live mt-0.5" aria-hidden />
          <div className="text-sm">
            <p className="font-medium">{t("error.title")}</p>
            <p className="mt-1 text-muted-foreground">{t("error.description")}</p>
          </div>
        </div>
      )}

      {dates.length > 0 && (
        <DateScroller
          dates={dates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
      )}

      {selectedDate && (
        <section>
          <DateSectionHeader date={selectedDate} count={dayMatches.length} />
          {dayMatches.length === 0 ? (
            <p className="text-muted-foreground text-sm">—</p>
          ) : (
            <div className="grid gap-4">
              {dayMatches.map((match) => (
                <MatchListCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </section>
      )}

      {visibleDates
        .filter((d) => d.date !== selectedDate)
        .map(({ date, count }) => {
          const sectionMatches = matches
            .filter((m) => m.date === date)
            .sort((a, b) => a.time.localeCompare(b.time))
          return (
            <section key={date} id={`day-${date}`}>
              <DateSectionHeader date={date} count={count} />
              <div className="grid gap-4">
                {sectionMatches.map((match) => (
                  <MatchListCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          )
        })}
    </div>
  )
}
