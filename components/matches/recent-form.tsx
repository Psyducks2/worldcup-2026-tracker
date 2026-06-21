"use client"

import type { FormResult } from "@/types/worldcup"
import { useLocale } from "@/components/providers/locale-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface RecentFormProps {
  teamName: string
  flag?: string
  form: FormResult[]
}

const FORM_STYLES: Record<FormResult, string> = {
  W: "bg-wc-primary text-primary-foreground",
  L: "bg-wc-live text-white",
  D: "bg-muted text-muted-foreground",
}

export function RecentForm({ teamName, flag, form }: RecentFormProps) {
  const { t } = useLocale()

  return (
    <Card className="border-border bg-wc-surface">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
          {flag && (
            <Image src={flag} alt="" width={20} height={14} className="rounded-sm object-cover" />
          )}
          {teamName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {form.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("form.limited")}</p>
        ) : (
          <>
            <div className="flex gap-1.5">
              {form.map((result, i) => (
                <span
                  key={i}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded text-xs font-bold",
                    FORM_STYLES[result]
                  )}
                  title={result}
                >
                  {result}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-right">
              {t("form.mostRecent")}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function RecentFormSection({
  homeName,
  awayName,
  homeFlag,
  awayFlag,
  homeForm,
  awayForm,
}: {
  homeName: string
  awayName: string
  homeFlag?: string
  awayFlag?: string
  homeForm: FormResult[]
  awayForm: FormResult[]
}) {
  const { t } = useLocale()

  return (
    <section>
      <h2 className="font-display text-lg font-bold uppercase tracking-wider mb-4">
        {t("form.title")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <RecentForm teamName={homeName} flag={homeFlag} form={homeForm} />
        <RecentForm teamName={awayName} flag={awayFlag} form={awayForm} />
      </div>
    </section>
  )
}
