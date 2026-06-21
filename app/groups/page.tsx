import type { Metadata } from "next"
import { GroupsContent } from "@/components/groups/groups-content"
import { SiteShell } from "@/components/layout/site-shell"
import { buildBracket } from "@/lib/bracket"
import { getQualifications } from "@/lib/qualification"
import { getTournamentData } from "@/lib/tournament-data"
import { WifiOff } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Groups · WC26 Tracker",
}

export default async function GroupsPage() {
  const { groups, matches, dataError, ratingsUpdatedAt } = await getTournamentData()
  const qualifications = getQualifications(groups)
  const bracket = buildBracket(matches, groups)

  return (
    <SiteShell updatedAt={ratingsUpdatedAt}>
      {dataError && (
        <div
          role="alert"
          className="mb-6 flex gap-3 rounded-xl border border-wc-live/30 bg-wc-live/10 px-4 py-3"
        >
          <WifiOff className="h-5 w-5 shrink-0 text-wc-live" aria-hidden />
        </div>
      )}
      <GroupsContent
        groups={groups}
        qualifications={qualifications}
        bracket={bracket}
      />
    </SiteShell>
  )
}
