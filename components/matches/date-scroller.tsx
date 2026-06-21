"use client"

import { useEffect, useRef } from "react"
import { useLocale } from "@/components/providers/locale-provider"
import { formatMatchDateShort, parseMatchDate } from "@/lib/api"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface DateEntry {
  date: string
  count: number
}

interface DateScrollerProps {
  dates: DateEntry[]
  selectedDate: string
  onSelect: (date: string) => void
}

function isToday(dateStr: string): boolean {
  const d = parseMatchDate(dateStr)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function DateScroller({ dates, selectedDate, onSelect }: DateScrollerProps) {
  const { locale, t } = useLocale()
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [selectedDate])

  const scroll = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="shrink-0 p-2 text-muted-foreground hover:text-foreground"
        aria-label="Previous dates"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-none py-2 flex-1"
      >
        {dates.map(({ date, count }) => {
          const d = parseMatchDate(date)
          const selected = date === selectedDate
          const today = isToday(date)

          return (
            <button
              key={date}
              ref={selected ? selectedRef : undefined}
              type="button"
              onClick={() => onSelect(date)}
              className={cn(
                "shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-full text-center transition-colors",
                selected
                  ? "bg-foreground text-background"
                  : "bg-wc-surface border border-border text-muted-foreground hover:border-wc-primary/40"
              )}
            >
              <span className="text-[10px] font-semibold uppercase">
                {d.toLocaleDateString(locale === "pt-BR" ? "pt-BR" : "en-US", { weekday: "short" }).slice(0, 3)}
              </span>
              <span className="text-sm font-bold leading-none">{d.getDate()}</span>
              {today ? (
                <span className="text-[8px] font-bold uppercase mt-0.5">{t("match.today")}</span>
              ) : (
                <span className="text-[9px] opacity-70">{count}</span>
              )}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        className="shrink-0 p-2 text-muted-foreground hover:text-foreground"
        aria-label="Next dates"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export function DateSectionHeader({
  date,
  count,
}: {
  date: string
  count: number
}) {
  const { locale, t } = useLocale()
  const today = isToday(date)

  return (
    <div className="flex items-baseline gap-3 mb-4">
      {today && (
        <span className="text-xs font-bold uppercase tracking-wider text-wc-live bg-wc-live/10 px-2 py-0.5 rounded">
          {t("match.today")}
        </span>
      )}
      <h2 className="font-display text-2xl font-bold capitalize">
        {formatMatchDateShort(date, locale)}
      </h2>
      <span className="text-sm text-muted-foreground">
        {count} {t("match.matchesCount")}
      </span>
    </div>
  )
}
