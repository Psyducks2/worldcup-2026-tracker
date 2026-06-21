import type { MatchStage } from "@/types/worldcup"
import { en } from "./en"
import { ptBR } from "./pt-BR"
import type { Dictionary, Locale } from "./types"
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from "./types"

export { DEFAULT_LOCALE, LOCALE_STORAGE_KEY }
export type { Dictionary, Locale }

const dictionaries: Record<Locale, Dictionary> = {
  "pt-BR": ptBR,
  en,
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export function isValidLocale(value: string): value is Locale {
  return value === "pt-BR" || value === "en"
}

export function getStageLabel(locale: Locale, stage: MatchStage): string {
  return getDictionary(locale).stages[stage]
}

export function formatDate(locale: Locale, dateStr: string): string {
  const [month, day, year] = dateStr.split("/")
  const date = new Date(`${year}-${month}-${day}T00:00:00`)
  return date.toLocaleDateString(locale === "pt-BR" ? "pt-BR" : "en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
}

export function interpolate(
  template: string,
  params: Record<string, string | number>
): string {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template
  )
}
