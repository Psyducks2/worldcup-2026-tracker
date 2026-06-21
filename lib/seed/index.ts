import stadiumsData from "@/data/seed/stadiums.json"
import titleOddsData from "@/data/seed/title-odds.json"
import { TEAMS_META } from "./teams-meta"
import type { Stadium, TeamMeta, TitleOddsEntry } from "@/types/worldcup"

type StadiumSeed = Record<string, { name: string; city: string; country: string }>

const STADIUMS = stadiumsData as StadiumSeed

export function getStadium(stadiumId: string): Stadium | null {
  const entry = STADIUMS[stadiumId]
  if (!entry) return null
  return { id: stadiumId, ...entry }
}

export function getTeamMeta(iso2: string): TeamMeta | null {
  const key = iso2.toLowerCase()
  const meta = TEAMS_META[key]
  if (!meta) return null
  return { iso2: key, elo: meta.elo, fifaRank: meta.fifaRank }
}

export function getAllTeamMeta(): TeamMeta[] {
  return Object.entries(TEAMS_META).map(([iso2, meta]) => ({
    iso2,
    elo: meta.elo,
    fifaRank: meta.fifaRank,
  }))
}

export function getTitleOdds(): TitleOddsEntry[] {
  return titleOddsData.teams as TitleOddsEntry[]
}

export function getTitleOddsUpdatedAt(): string {
  return titleOddsData.updatedAt as string
}

export function resolveIso2(code: string, iso2?: string): string {
  if (iso2) {
    const normalized = iso2.toLowerCase()
    const isoAliases: Record<string, string> = {
      "gb-eng": "eng",
      "gb-sct": "sct",
      "gb-wls": "wal",
      "gb-nir": "nir",
    }
    return isoAliases[normalized] ?? normalized
  }
  const special: Record<string, string> = {
    ENG: "eng",
    SCO: "sct",
    NIR: "nir",
    WAL: "wal",
  }
  const upper = code.toUpperCase()
  if (special[upper]) return special[upper]
  return code.toLowerCase()
}

export function getTeamMetaForTeam(team: { code: string; iso2?: string }): TeamMeta | null {
  const iso = resolveIso2(team.code, team.iso2)
  return getTeamMeta(iso)
}
