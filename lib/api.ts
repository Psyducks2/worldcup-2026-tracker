import type {
  ApiGame,
  ApiGroup,
  ApiTeam,
  Team,
  Group,
  GroupStanding,
  Match,
  MatchStage,
  MatchStatus,
  ApiGamesResponse,
  ApiGroupsResponse,
  ApiTeamsResponse,
} from "@/types/worldcup"

const BASE_URL = "https://worldcup26.ir"

export async function fetchTeams(): Promise<Record<string, ApiTeam>> {
  const res = await fetch(`${BASE_URL}/get/teams`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error("Failed to fetch teams")
  const data: ApiTeamsResponse = await res.json()
  const map: Record<string, ApiTeam> = {}
  for (const team of data.teams) {
    map[team.id] = team
  }
  return map
}

export async function fetchGroups(): Promise<ApiGroup[]> {
  const res = await fetch(`${BASE_URL}/get/groups`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error("Failed to fetch groups")
  const data: ApiGroupsResponse = await res.json()
  return data.groups
}

export async function fetchGames(): Promise<ApiGame[]> {
  const res = await fetch(`${BASE_URL}/get/games`, {
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error("Failed to fetch games")
  const data: ApiGamesResponse = await res.json()
  return data.games
}

export function mapTeam(apiTeam: ApiTeam): Team {
  return {
    id: apiTeam.id,
    name: apiTeam.name_en,
    code: apiTeam.fifa_code,
    flag: apiTeam.flag,
    group: apiTeam.groups,
  }
}

export function mapGroups(
  apiGroups: ApiGroup[],
  teamsMap: Record<string, ApiTeam>
): Group[] {
  return apiGroups
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((group) => {
      const sorted = [...group.teams].sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts
        if (b.gd !== a.gd) return b.gd - a.gd
        if (b.gf !== a.gf) return b.gf - a.gf
        return 0
      })

      const standings: GroupStanding[] = sorted.map((t, i) => {
        const apiTeam = teamsMap[t.team_id]
        return {
          position: i + 1,
          team: apiTeam
            ? mapTeam(apiTeam)
            : { id: t.team_id, name: `Time ${t.team_id}`, code: t.team_id, flag: "", group: group.name },
          played: t.mp,
          won: t.w,
          drawn: t.d,
          lost: t.l,
          goalsFor: t.gf,
          goalsAgainst: t.ga,
          goalDifference: t.gd,
          points: t.pts,
        }
      })

      return {
        name: `Grupo ${group.name}`,
        standings,
      }
    })
}

function mapStage(type: string): MatchStage {
  const stageMap: Record<string, MatchStage> = {
    group: "group",
    r32: "r32",
    r16: "r16",
    qf: "qf",
    sf: "sf",
    third: "third",
    final: "final",
  }
  return stageMap[type] || "group"
}

function mapStatus(game: ApiGame): MatchStatus {
  if (game.finished === "TRUE") return "finished"
  if (game.time_elapsed === "live") return "live"
  return "notstarted"
}

function parseScorers(scorersStr: string): string[] {
  if (!scorersStr || scorersStr === "null") return []
  try {
    const cleaned = scorersStr.replace(/^{/, "").replace(/}$/, "")
    return cleaned.split(",").map((s) => s.trim().replace(/^"|"$/g, ""))
  } catch {
    return []
  }
}

export function mapGames(
  apiGames: ApiGame[],
  teamsMap: Record<string, ApiTeam>
): Match[] {
  return apiGames.map((game) => {
    const homeTeam =
      game.home_team_id && game.home_team_id !== "0"
        ? teamsMap[game.home_team_id]
        : undefined
    const awayTeam =
      game.away_team_id && game.away_team_id !== "0"
        ? teamsMap[game.away_team_id]
        : undefined

    return {
      id: game.id,
      stage: mapStage(game.type),
      group: game.group,
      date: game.local_date.split(" ")[0],
      time: game.local_date.split(" ")[1] || "",
      homeTeam: homeTeam ? mapTeam(homeTeam) : null,
      awayTeam: awayTeam ? mapTeam(awayTeam) : null,
      homeScore: game.home_score !== "null" ? parseInt(game.home_score) : null,
      awayScore: game.away_score !== "null" ? parseInt(game.away_score) : null,
      homeScorers: parseScorers(game.home_scorers),
      awayScorers: parseScorers(game.away_scorers),
      status: mapStatus(game),
      matchday: game.matchday,
      homeTeamLabel: game.home_team_label,
      awayTeamLabel: game.away_team_label,
    }
  })
}

export function getMatchesByStage(matches: Match[], stage: MatchStage): Match[] {
  return matches.filter((m) => m.stage === stage)
}

export function getMatchesByGroup(matches: Match[], group: string): Match[] {
  return matches.filter((m) => m.group === group)
}

export function getLiveMatches(matches: Match[]): Match[] {
  return matches.filter((m) => m.status === "live")
}

export function getUpcomingMatches(matches: Match[], limit = 5): Match[] {
  return matches
    .filter((m) => m.status === "notstarted")
    .sort((a, b) => {
      const dateA = `${a.date} ${a.time}`
      const dateB = `${b.date} ${b.time}`
      return dateA.localeCompare(dateB)
    })
    .slice(0, limit)
}

export function getFinishedMatches(matches: Match[]): Match[] {
  return matches.filter((m) => m.status === "finished")
}

export function formatDate(dateStr: string): string {
  const [month, day, year] = dateStr.split("/")
  const date = new Date(`${year}-${month}-${day}T00:00:00`)
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
}

export function formatTime(timeStr: string): string {
  return timeStr
}

export function getStageLabel(stage: MatchStage): string {
  const labels: Record<MatchStage, string> = {
    group: "Fase de Grupos",
    r32: "Rodada dos 32",
    r16: "Oitavas de Final",
    qf: "Quartas de Final",
    sf: "Semifinal",
    third: "Disputa de 3º Lugar",
    final: "Final",
  }
  return labels[stage]
}

export function getGroupLetter(groupName: string): string {
  return groupName.replace("Grupo ", "")
}
