export interface ApiTeam {
  _id: string
  name_en: string
  name_fa: string
  flag: string
  fifa_code: string
  iso2: string
  groups: string
  id: string
}

export interface ApiGame {
  _id: string
  id: string
  home_team_id: string
  away_team_id: string
  home_score: string
  away_score: string
  home_scorers: string
  away_scorers: string
  group: string
  matchday: string
  local_date: string
  persian_date: string
  stadium_id: string
  finished: string
  time_elapsed: string
  type: string
  home_team_name_en?: string
  home_team_name_fa?: string
  away_team_name_en?: string
  away_team_name_fa?: string
  home_team_label?: string
  away_team_label?: string
}

export interface ApiGroupTeam {
  team_id: string
  mp: number
  w: number
  l: number
  d: number
  pts: number
  gf: number
  ga: number
  gd: number
  _id: string
}

export interface ApiGroup {
  _id: string
  name: string
  teams: ApiGroupTeam[]
  createdAt: string
  updatedAt?: string
  __v: number
}

export interface ApiGroupsResponse {
  groups: ApiGroup[]
}

export interface ApiTeamsResponse {
  teams: ApiTeam[]
}

export interface ApiGamesResponse {
  games: ApiGame[]
}

export interface Team {
  id: string
  name: string
  code: string
  flag: string
  group: string
  iso2?: string
}

export interface TeamMeta {
  iso2: string
  elo: number
  fifaRank: number
}

export interface Stadium {
  id: string
  name: string
  city: string
  country: string
}

export interface MatchPrediction {
  homeWin: number
  draw: number
  awayWin: number
  homeElo: number
  awayElo: number
  eloDiff: number
}

export type FormResult = "W" | "D" | "L"

export interface HeadToHeadMeeting {
  date: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  summary: string
}

export interface HeadToHeadSummary {
  meetings: number
  lastMeeting: HeadToHeadMeeting | null
}

export interface TitleOddsEntry {
  iso2: string
  probability: number
  delta: number
}

export interface GroupStanding {
  position: number
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface Group {
  name: string
  standings: GroupStanding[]
}

export type MatchStage =
  | "group"
  | "r32"
  | "r16"
  | "qf"
  | "sf"
  | "third"
  | "final"

export type MatchStatus = "scheduled" | "live" | "finished" | "notstarted"

export interface Match {
  id: string
  stage: MatchStage
  group: string
  date: string
  time: string
  homeTeam: Team | null
  awayTeam: Team | null
  homeScore: number | null
  awayScore: number | null
  homeScorers: string[]
  awayScorers: string[]
  status: MatchStatus
  matchday: string
  homeTeamLabel?: string
  awayTeamLabel?: string
  stadiumId?: string
  stadium?: Stadium | null
  prediction?: MatchPrediction | null
}

export interface TournamentInfo {
  name: string
  edition: number
  host: string
  startDate: string
  endDate: string
  totalTeams: number
  totalMatches: number
  currentStage: MatchStage
}

export type QualificationZone =
  | "direct"
  | "third_playoff"
  | "eliminated"
  | "fighting"

export type QualificationStatus = "confirmed" | "provisional"

export interface TeamQualification {
  team: Team
  group: string
  position: number
  zone: QualificationZone
  status: QualificationStatus
  thirdRank?: number
}

export interface RoundOf32Slot {
  team: Team
  origin: string
  zone: "direct" | "third_playoff"
  status: QualificationStatus
  group: string
  position: number
}

export interface ResolvedSide {
  team: Team | null
  label: string
  isProvisional: boolean
  origin?: string
}

export interface BracketNode {
  match: Match
  home: ResolvedSide
  away: ResolvedSide
  round: MatchStage
  slotIndex: number
}
