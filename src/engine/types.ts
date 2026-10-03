// PURE. This module and its siblings in engine/ must never import React, the DOM,
// Math.random, Date.now, or anything outside engine/. See CLAUDE.md.

export type CardId = string
export type FlagId = string
export type SectorId = string
export type BoonId = string

export type StoryPhase = 'early_game' | 'climbing' | 'entangled' | 'reckoning' | 'recovery'
export type ConsequencePath = 'mafia' | 'police' | 'war' | 'banking'

export interface Stats {
  grit: number // endurance, resisting pressure
  savvy: number // financial/analytical
  charm: number // negotiation
  nerve: number // risk tolerance / bluffing
}

export type StatId = keyof Stats

export interface OwnedAsset {
  id: string
  label: string
  cost: number
  monthlyCashflow: number
  sector: SectorId
  visualEffect?: EquipmentSlot // if this asset has a visual equipment effect
  quantity?: number // for assets that accumulate (merchant routes, etc)
}

export interface Finances {
  gold: number
  wages: number // active income - the thing you want to stop needing
  monthlyExpenses: number
  debt: number
  assets: OwnedAsset[]
  commodities: {
    spice: number
    salt: number
    iron: number
  }
}

export interface Progress {
  colossiDefeated: number // 0..7
  boons: BoonId[]
  freedomDays: number // consecutive days with passive income >= expenses
  tier: number // scales card weights and trial difficulty
  storyPhase: StoryPhase // current story phase gates available content
  currentPath?: ConsequencePath // which consequence path player is currently on
}

export interface RngState {
  seed: number
  cursor: number // number of draws taken so far
}

export interface Clock {
  day: number
  nextMarketDay: number
  nextPayday: number
}

export interface LogEntry {
  day: number
  text: string
}

export type GameStatus = 'playing' | 'won'

export interface CharacterState {
  equipmentSlots: Record<EquipmentSlot, string | null> // equipment IDs or null
}

export interface EffectSummary {
  stats: Record<StatId, number>
  gold: number
  wages: number
  monthlyExpenses: number
  debt: number
  assetsGained: string[]
  assetsLost: string[]
  flagsSet: string[]
}

export interface PendingOutcome {
  text: string
  checkResult?: CheckResult
  effectSummary?: EffectSummary
}

export interface GameState {
  version: 1
  rng: RngState
  stats: Stats
  finances: Finances
  market: Record<SectorId, number> // sector price index, drifts on market day
  flags: Record<FlagId, number> // integers; counters subsume booleans
  progress: Progress
  currentCardId: CardId
  pendingCards: CardId[] // interrupt queue: market day, trials, consequences
  recentlyDrawn: CardId[] // cooldown window for the random deck
  seenCardIds: CardId[] // permanent record of all cards shown to prevent repeats
  clock: Clock
  log: LogEntry[]
  status: GameStatus
  character: CharacterState // visual state (non-game-logic)
  pendingOutcome?: PendingOutcome // skill check outcome awaiting player acknowledgment
}

// ---- Requirements: pure predicates over state ----

export type Requirement =
  | { kind: 'goldAtLeast'; amount: number }
  | { kind: 'statAtLeast'; stat: StatId; value: number }
  | { kind: 'flag'; id: FlagId; atLeast?: number; equals?: number }
  | { kind: 'ownsAsset'; id: string }
  | { kind: 'isFree' }
  | { kind: 'colossiAtLeast'; count: number }
  | { kind: 'storyPhase'; phase: StoryPhase }
  | { kind: 'cardSeen'; id: CardId }
  | { kind: 'cardNotSeen'; id: CardId }
  | { kind: 'not'; of: Requirement }
  | { kind: 'allOf'; of: Requirement[] }
  | { kind: 'anyOf'; of: Requirement[] }

// ---- Effects: consequences are data, never functions ----

export type Effect =
  | { kind: 'gold'; delta: number }
  | { kind: 'stat'; stat: StatId; delta: number }
  | { kind: 'flag'; id: FlagId; set?: number; delta?: number }
  | { kind: 'acquireAsset'; asset: OwnedAsset }
  | { kind: 'sellAsset'; id: string; priceMultiplier?: number }
  | { kind: 'wages'; delta: number }
  | { kind: 'expense'; delta: number }
  | { kind: 'loan'; principal: number; monthlyPayment: number }
  | { kind: 'advanceDays'; days: number }
  | { kind: 'queueCard'; card: CardId; front?: boolean }
  | { kind: 'marketShift'; sector: SectorId; delta: number }
  | { kind: 'grantBoon'; boon: BoonId }
  | { kind: 'advancePhase'; to: StoryPhase }
  | { kind: 'reckoning' }
  | { kind: 'narrate'; text: string }
  | { kind: 'end'; status: 'won'; summary: string }
  | { kind: 'if'; when: Requirement; then: Effect[]; else?: Effect[] }
  | { kind: 'commodity'; type: 'spice' | 'salt' | 'iron'; delta: number }

// ---- Content: cards, choices, checks ----

export interface SkillCheck {
  stat: StatId
  dc: number
  die?: number // default 20
  bonuses?: { if: Requirement; mod: number; reason: string }[]
  success: Outcome
  failure: Outcome
  critSuccess?: Outcome
  critFailure?: Outcome
}

export interface Outcome {
  text: string
  effects?: Effect[]
  goto?: CardId
}

export type ProseBlock = string | { if: Requirement; text: string }

// ---- Visual Metadata (non-game-logic) ----

export type EquipmentSlot = 'headgear' | 'clothing' | 'accessories'

export interface VisualMetadata {
  backgroundId?: string // References assets/backgrounds/metadata.ts
  characterMood?: 'neutral' | 'tense' | 'triumphant' | 'fearful'
  soundEvents?: Array<{
    trigger: 'onEnter' | 'onChoice'
    eventType: string
  }>
}

export interface Choice {
  id: string
  label: string
  requires?: Requirement[] // hidden unless met
  showLockedAs?: string // shown but disabled, with this reason, if requires fail
  check?: SkillCheck
  effects?: Effect[] // applied when there is no check
  goto?: CardId
}

export interface StoryCard {
  id: CardId
  title?: string
  body: ProseBlock[]
  onEnter?: Effect[] // fires once, before choices render
  choices: Choice[]
  next?: CardId // no choices + next = auto-advance (economy interrupts)
  weight?: number // relative draw weight for the random deck (undrawable if absent)
  requires?: Requirement[] // gates whether the card can be drawn
  minTier?: number
  storyPhase?: StoryPhase // optional phase gate: card only drawable in this phase
  chapter?: number // optional chapter gate: 1-7, undefined = all chapters
  visual?: VisualMetadata // optional visual metadata for UI rendering
}

export interface CheckResult {
  die: number
  roll: number
  stat: StatId
  statMod: number
  bonuses: { mod: number; reason: string }[]
  total: number
  dc: number
  result: 'critSuccess' | 'success' | 'failure' | 'critFailure'
}

export type Action =
  | { type: 'choose'; choiceId: string }
  | { type: 'advance' }
  | { type: 'restart'; seed: number }
  | { type: 'takeLoan'; principal: number; monthlyPayment: number }
  | { type: 'payLoan'; amount: number }
  | { type: 'sellCommodity'; commodity: 'spice' | 'salt' | 'iron'; amount: number; pricePerUnit: number }
  | { type: 'buyCommodity'; commodity: 'spice' | 'salt' | 'iron'; amount: number; pricePerUnit: number }
  | { type: 'sellAsset'; id: string; priceMultiplier: number }

export interface Tuning {
  marketDayInterval: number // days between market ticks
  marketDriftRange: number // per-sector drift each market day is in [-range, +range]
  freedomDaysToTrial: number // consecutive free days before the next Colossus stirs
  daysPerTurn: number // days the clock advances for every card resolved, on top of any authored advanceDays
  paydayInterval: number // days between paydays, which credit (wages + passive income - expenses)
}

export interface ConsequenceTuning {
  mafia: { flagId: string; threshold: number }
  police: { flagId: string; threshold: number }
  war: { flagId: string; threshold: number }
  banking: { flagId: string; threshold: number }
}

export interface Campaign {
  startCardId: CardId
  cards: Record<CardId, StoryCard>
  deckCardIds: CardId[] // drawable pool, subset of cards with `weight`
  sectors: SectorId[]
  colossusCardIds: CardId[] // ordered trial-start cards, index = colossiDefeated (legacy support)
  colossusPathCards?: Record<ConsequencePath, CardId> // path-based colossus start cards
  marketDayCardId: CardId
  tuning: Tuning
  consequenceTuning?: ConsequenceTuning // thresholds for consequence triggers
  initial: {
    stats: Stats
    finances: Finances
    market: Record<SectorId, number>
  }
}
