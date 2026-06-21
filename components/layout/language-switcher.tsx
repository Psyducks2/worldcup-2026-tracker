"use client"

import { useLocale } from "@/components/providers/locale-provider"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Globe } from "lucide-react"

const OPTIONS: { value: Locale; labelKey: "language.ptBR" | "language.en" }[] =
  [
    { value: "pt-BR", labelKey: "language.ptBR" },
    { value: "en", labelKey: "language.en" },
  ]

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="group"
      aria-label={t("language.label")}
    >
      <Globe className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
      <div className="inline-flex rounded-lg border border-border bg-wc-surface p-0.5">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            aria-pressed={locale === option.value}
            className={cn(
              "min-h-9 px-3 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              locale === option.value
                ? "bg-wc-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(option.labelKey)}
          </button>
        ))}
      </div>
    </div>
  )
}
