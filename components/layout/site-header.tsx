"use client"

import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { useLocale } from "@/components/providers/locale-provider"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy, Users } from "lucide-react"

export function SiteHeader() {
  const { t } = useLocale()

  return (
    <header className="border-b border-border bg-gradient-to-b from-wc-surface to-wc-bg">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-wc-primary/15 p-3">
              <Trophy className="h-10 w-10 text-wc-gold" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t("header.title")}
            </h1>
          </div>
          <p className="text-wc-muted text-lg">{t("header.host")}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Badge
              variant="secondary"
              className="gap-1.5 min-h-11 px-3 border-border bg-wc-surface text-foreground"
            >
              <Calendar className="h-3.5 w-3.5 text-wc-primary" />
              {t("header.dates")}
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 min-h-11 px-3 border-border bg-wc-surface text-foreground"
            >
              <Users className="h-3.5 w-3.5 text-wc-primary" />
              {t("header.teams")}
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 min-h-11 px-3 border-border bg-wc-surface text-foreground"
            >
              <MapPin className="h-3.5 w-3.5 text-wc-primary" />
              {t("header.matches")}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
