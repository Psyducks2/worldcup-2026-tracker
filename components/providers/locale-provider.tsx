"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  DEFAULT_LOCALE,
  getDictionary,
  interpolate,
  isValidLocale,
  LOCALE_STORAGE_KEY,
  type Dictionary,
  type Locale,
} from "@/lib/i18n"

interface LocaleContextValue {
  locale: Locale
  dictionary: Dictionary
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getNestedValue(obj: Dictionary, path: string): string | undefined {
  const keys = path.split(".")
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || typeof current !== "object" || !(key in current)) {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }

  return typeof current === "string" ? current : undefined
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && isValidLocale(stored)) {
      setLocaleState(stored)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    document.documentElement.lang = locale
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }, [locale, hydrated])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const dictionary = useMemo(() => getDictionary(locale), [locale])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const value = getNestedValue(dictionary, key) ?? key
      return params ? interpolate(value, params) : value
    },
    [dictionary]
  )

  const value = useMemo(
    () => ({ locale, dictionary, setLocale, t }),
    [locale, dictionary, setLocale, t]
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return context
}
