"use client"

import { useLocale } from "@/components/providers/locale-provider"
import { Info } from "lucide-react"

export function ProvisionalNotice() {
  const { t } = useLocale()

  return (
    <div
      role="note"
      className="flex gap-3 rounded-xl border border-wc-provisional/30 bg-wc-provisional/10 px-4 py-3"
    >
      <Info
        className="h-5 w-5 shrink-0 text-wc-provisional mt-0.5"
        aria-hidden
      />
      <div className="text-sm">
        <p className="font-medium text-foreground">{t("provisional.title")}</p>
        <ul className="mt-1.5 space-y-1 text-muted-foreground list-disc pl-4">
          <li>{t("provisional.item1")}</li>
          <li>{t("provisional.item2")}</li>
          <li>{t("provisional.item3")}</li>
        </ul>
      </div>
    </div>
  )
}
