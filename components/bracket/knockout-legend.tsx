"use client"

import { useLocale } from "@/components/providers/locale-provider"
import { CheckCircle2, CircleDashed, HelpCircle } from "lucide-react"

export function KnockoutLegend() {
  const { t } = useLocale()

  return (
    <div
      className="rounded-xl border border-border bg-wc-surface px-4 py-3"
      aria-label={t("knockoutLegend.ariaLabel")}
    >
      <p className="text-sm font-medium mb-2">{t("knockoutLegend.title")}</p>
      <ul className="grid gap-2 sm:grid-cols-3 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-wc-confirmed" aria-hidden />
          <span>{t("knockoutLegend.confirmed")}</span>
        </li>
        <li className="flex items-center gap-2">
          <CircleDashed className="h-4 w-4 shrink-0 text-wc-provisional" aria-hidden />
          <span>{t("knockoutLegend.projected")}</span>
        </li>
        <li className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span>{t("knockoutLegend.dependsOnWinner")}</span>
        </li>
      </ul>
    </div>
  )
}
