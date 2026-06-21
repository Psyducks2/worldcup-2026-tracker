import type { MatchStage } from "@/types/worldcup"

export type Locale = "pt-BR" | "en"

export const LOCALE_STORAGE_KEY = "wc2026-locale"
export const DEFAULT_LOCALE: Locale = "pt-BR"

export interface Dictionary {
  meta: {
    title: string
    description: string
  }
  header: {
    title: string
    host: string
    dates: string
    teams: string
    matches: string
  }
  tabs: {
    overview: string
    standings: string
    knockout: string
  }
  progress: {
    title: string
    completed: string
    remaining: string
    total: string
    of: string
  }
  stats: {
    finishedMatches: string
    goalsScored: string
    avgGoals: string
  }
  sections: {
    live: string
    upcoming: string
    groupStage: string
    groupStageDesc: string
    groupMatches: string
  }
  match: {
    live: string
    finished: string
    group: string
    matchday: string
    projectedTeam: string
    match: string
    vs: string
    projection: string
  }
  groupTable: {
    team: string
    qualified: string
    provisional: string
    playoffSpot: string
    out: string
    fighting: string
  }
  footer: {
    tagline: string
    developedBy: string
    dataSource: string
  }
  provisional: {
    title: string
    item1: string
    item2: string
    item3: string
  }
  knockoutLegend: {
    ariaLabel: string
    title: string
    confirmed: string
    projected: string
    dependsOnWinner: string
  }
  knockout: {
    title: string
    description: string
    whoQualifies: string
    matchups: string
    whoQualifiesTitle: string
    whoQualifiesDesc: string
    teams: string
    position: string
    toR32: string
    provisionalR32: string
    thirdBest: string
    thirdPlaceOrdinal: string
    outOfProjection: string
    pts: string
    gd: string
    bracketTitle: string
    listViewDesc: string
    treeViewDesc: string
    list: string
    tree: string
    viewModeAria: string
    phasesAria: string
    selectPhaseAria: string
    matchesUnavailable: string
    matchInPhase: string
    matchesInPhase: string
    knockoutUnavailable: string
    thirdPlaceDesc: string
    scrollHint: string
    treeAria: string
  }
  stages: Record<MatchStage, string>
  stageShort: {
    r32: string
    r16: string
    qf: string
    sf: string
    final: string
  }
  stageFull: {
    r32: string
    r16: string
    qf: string
    sf: string
    final: string
  }
  language: {
    label: string
    ptBR: string
    en: string
  }
}
