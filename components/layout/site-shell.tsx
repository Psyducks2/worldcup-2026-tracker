"use client"

import { MainNav } from "@/components/layout/main-nav"
import { useLocale } from "@/components/providers/locale-provider"
import { ExternalLink } from "lucide-react"

interface SiteShellProps {
  children: React.ReactNode
  updatedAt?: string
  showDisclaimer?: boolean
}

export function SiteShell({ children, updatedAt, showDisclaimer = true }: SiteShellProps) {
  const { t } = useLocale()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav updatedAt={updatedAt} />

      {showDisclaimer && (
        <div className="border-b border-border bg-wc-surface/40">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 text-xs text-muted-foreground space-y-1">
            <p>{t("disclaimer.unofficial")}</p>
            <p>{t("disclaimer.notLive")}</p>
            <p>{t("disclaimer.notBetting")}</p>
          </div>
        </div>
      )}

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-border bg-wc-surface/50 mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
              <p className="text-sm text-foreground">
                {t("footer.developedBy")}{" "}
                <span className="font-medium">Luis Roberto — PsyDucks2</span>
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                <a
                  href="https://www.linkedin.com/in/luis-roberto-4aa69b30a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-wc-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Psyducks2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-wc-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  GitHub
                </a>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{t("footer.dataSource")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
