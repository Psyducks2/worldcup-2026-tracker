import { unstable_cache } from "next/cache"
import type { Group, Match } from "@/types/worldcup"
import { getRecentForm } from "@/lib/form"
import { getHeadToHead } from "@/lib/h2h"
import { resolveIso2 } from "@/lib/seed"
import { formatMatchDateLong } from "@/lib/api"

export interface AnalysisSection {
  id: string
  title: string
  body: string[]
  generatedAt: string
}

export interface DailyAnalysis {
  sections: AnalysisSection[]
  usedAi: boolean
}

function buildMatchPreviewLine(match: Match, locale: string): string {
  const home = match.homeTeam?.name ?? match.homeTeamLabel ?? "TBD"
  const away = match.awayTeam?.name ?? match.awayTeamLabel ?? "TBD"
  const p = match.prediction
  if (!p) return `**${home}** vs **${away}** — probabilities unavailable.`

  const homeIso = match.homeTeam
    ? resolveIso2(match.homeTeam.code, match.homeTeam.iso2)
    : ""
  const awayIso = match.awayTeam
    ? resolveIso2(match.awayTeam.code, match.awayTeam.iso2)
    : ""

  const parts = [
    `**${home}** vs **${away}** — ${p.homeWin}% / ${p.draw}% / ${p.awayWin}%.`,
  ]

  if (p.eloDiff !== 0) {
    const fav = p.eloDiff > 0 ? home : away
    parts.push(
      `The model leans toward ${fav}, with a ${Math.abs(p.eloDiff)}-point Elo edge.`
    )
  }

  if (homeIso && awayIso) {
    const h2h = getHeadToHead(homeIso, awayIso)
    if (h2h.meetings === 0) {
      parts.push("The sides have never met before.")
    } else if (h2h.lastMeeting) {
      parts.push(`Last meeting: ${h2h.lastMeeting.summary}.`)
    }

    const homeForm = getRecentForm(homeIso, [])
    const awayForm = getRecentForm(awayIso, [])
    const homeWins = homeForm.filter((r) => r === "W").length
    const awayWins = awayForm.filter((r) => r === "W").length
    if (homeWins === 0 && homeForm.length >= 3) {
      parts.push(`${home} are winless in their last ${homeForm.length}.`)
    }
    if (awayWins === 0 && awayForm.length >= 3) {
      parts.push(`${away} are winless in their last ${awayForm.length}.`)
    }
  }

  return parts.join(" ")
}

function generateTemplateAnalysis(
  matches: Match[],
  groups: Group[],
  locale: string
): DailyAnalysis {
  const isPt = locale === "pt-BR"
  const now = new Date().toISOString().slice(0, 16)
  const today = new Date()
  const todayMatches = matches.filter((m) => {
    const [month, day, year] = m.date.split("/").map(Number)
    const d = new Date(year, month - 1, day)
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    )
  })

  const previewLines = todayMatches.map((m) => buildMatchPreviewLine(m, locale))
  const dateLabel =
    todayMatches[0]?.date
      ? formatMatchDateLong(todayMatches[0].date, locale)
      : "today"

  const finishedYesterday = matches
    .filter((m) => m.status === "finished")
    .slice(-4)

  const reviewLines = finishedYesterday.map((m) => {
    const home = m.homeTeam?.name ?? "?"
    const away = m.awayTeam?.name ?? "?"
    const p = m.prediction
  const fav = p && p.homeWin >= p.awayWin ? home : away
    return `**${home}** ${m.homeScore}–${m.awayScore} **${away}**${p ? ` — model favourite ${fav} (${Math.max(p.homeWin, p.awayWin)}%)` : ""}.`
  })

  const watchLines: string[] = []
  for (const group of groups) {
    for (const standing of group.standings) {
      if (standing.position >= 3 && standing.points === 0 && standing.played >= 2) {
        watchLines.push(
          `**${standing.team.name}** under pressure in ${group.name}: zero points from ${standing.played} games.`
        )
      }
    }
  }

  if (todayMatches.length > 0) {
    const top = [...todayMatches].sort(
      (a, b) => (b.prediction?.homeElo ?? 0) - (a.prediction?.homeElo ?? 0)
    )[0]
    if (top?.homeTeam && top.awayTeam) {
      watchLines.push(
        `Circle ${dateLabel}: **${top.homeTeam.name}** vs **${top.awayTeam.name}** is the heavyweight fixture of the window.`
      )
    }
  }

  const previewIntro = isPt
    ? `Veja como o modelo enxerga os ${todayMatches.length} jogos do dia (casa / empate / fora).`
    : `Here's how the model sees the day's ${todayMatches.length} matches (home / draw / away).`

  return {
    usedAi: false,
    sections: [
      {
        id: "preview",
        title: isPt ? `Prévia do dia — ${dateLabel}` : `Match day preview — ${dateLabel}`,
        body:
          previewLines.length > 0
            ? [previewIntro, ...previewLines.map((l) => `• ${l}`)]
            : [
                isPt
                  ? "Nenhum jogo agendado para hoje no dataset atual."
                  : "No matches scheduled for today in the current dataset.",
              ],
        generatedAt: now,
      },
      {
        id: "review",
        title: isPt ? "Ontem, analisado" : "Yesterday, analyzed",
        body:
          reviewLines.length > 0
            ? reviewLines.map((l) => `• ${l}`)
            : [
                isPt
                  ? "Nenhum jogo recente finalizado para revisar."
                  : "No recent finished matches to review.",
              ],
        generatedAt: now,
      },
      {
        id: "watch",
        title: isPt ? "O que acompanhar" : "What to watch",
        body:
          watchLines.length > 0
            ? [
                isPt
                  ? "O que os próximos dias reservam, segundo os dados:"
                  : "What the next few days hinge on, according to the data:",
                ...watchLines.map((l) => `• ${l}`),
              ]
            : [
                isPt
                  ? "Nenhuma storyline em destaque na classificação atual."
                  : "No standout storylines from current standings.",
              ],
        generatedAt: now,
      },
    ],
  }
}

async function generateAiAnalysis(
  matches: Match[],
  groups: Group[],
  locale: string
): Promise<DailyAnalysis | null> {
  const apiKey = process.env.AI_GATEWAY_API_KEY ?? process.env.OPENAI_API_KEY
  if (!apiKey) return null

  try {
    const { generateText } = await import("ai")
    const { openai } = await import("@ai-sdk/openai")

    const template = generateTemplateAnalysis(matches, groups, locale)
    const prompt = `You are a football data analyst. Rewrite this World Cup 2026 daily briefing in ${locale === "pt-BR" ? "Brazilian Portuguese" : "English"}. Keep facts and numbers exact. Use markdown bullets.

${template.sections.map((s) => `${s.title}\n${s.body.join("\n")}`).join("\n\n")}`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
    })

    return {
      usedAi: true,
      sections: [
        {
          id: "ai-brief",
          title: locale === "pt-BR" ? "Briefing diário" : "Daily briefing",
          body: text.split("\n").filter(Boolean),
          generatedAt: new Date().toISOString().slice(0, 16),
        },
        ...template.sections,
      ],
    }
  } catch {
    return null
  }
}

export async function getDailyAnalysis(
  matches: Match[],
  groups: Group[],
  locale: string
): Promise<DailyAnalysis> {
  const cached = unstable_cache(
    async () => {
      const ai = await generateAiAnalysis(matches, groups, locale)
      if (ai) return ai
      return generateTemplateAnalysis(matches, groups, locale)
    },
    ["daily-analysis", locale, matches.length.toString()],
    { revalidate: 21600 }
  )

  return cached()
}
