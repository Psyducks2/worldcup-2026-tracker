"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { useLocale } from "@/components/providers/locale-provider"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/matches", key: "matches" as const },
  { href: "/teams", key: "teams" as const },
  { href: "/groups", key: "groups" as const },
  { href: "/odds", key: "odds" as const },
  { href: "/analysis", key: "analysis" as const },
]

interface MainNavProps {
  updatedAt?: string
}

export function MainNav({ updatedAt }: MainNavProps) {
  const pathname = usePathname()
  const { t } = useLocale()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-wc-bg/95 backdrop-blur supports-[backdrop-filter]:bg-wc-bg/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/matches"
          className="font-display text-sm font-bold tracking-widest text-foreground shrink-0"
        >
          {t("header.brand")}
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-xs font-semibold tracking-wider uppercase transition-colors",
                  active
                    ? "text-foreground after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-wc-live"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {updatedAt && (
            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-wc-primary" aria-hidden />
              {t("header.updated")} {updatedAt}
            </span>
          )}
          <LanguageSwitcher />
        </div>
      </div>

      <nav
        className="flex md:hidden overflow-x-auto border-t border-border px-4 gap-1 py-1"
        aria-label="Main mobile"
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 px-3 py-2 text-xs font-semibold tracking-wider uppercase",
                active ? "text-foreground border-b-2 border-wc-live" : "text-muted-foreground"
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
