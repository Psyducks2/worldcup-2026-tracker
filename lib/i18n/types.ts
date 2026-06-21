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
    brand: string
    updated: string
  }
  nav: {
    matches: string
    teams: string
    groups: string
    odds: string
    analysis: string
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
  error: {
    title: string
    description: string
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
    details: string
    winProbability: string
    draw: string
    favored: string
    fifaRank: string
    today: string
    matchesCount: string
    backTo: string
    eloModel: string
    eloFootnote: string
    ratingsAsOf: string
    localKickoff: string
    forYou: string
    noPrediction: string
  }
  form: {
    title: string
    mostRecent: string
    limited: string
  }
  h2h: {
    title: string
    firstMeeting: string
    meetings: string
  }
  venue: {
    title: string
  }
  odds: {
    title: string
    description: string
    team: string
    probability: string
    change: string
    movers: string
    allOdds: string
    updated: string
  }
  analysis: {
    title: string
    subtitle: string
    aiGenerated: string
    preview: string
    review: string
    watch: string
    sources: string
    noKey: string
    matchDayPreview: string
    matchDayReview: string
    whatToWatch: string
  }
  teams: {
    title: string
    description: string
    elo: string
    fifaRank: string
    group: string
  }
  disclaimer: {
    unofficial: string
    notLive: string
    notBetting: string
    aiLabel: string
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
