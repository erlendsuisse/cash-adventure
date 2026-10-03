import type { Campaign, ChapterNumber, ConsequenceTuning, SectorId, Tuning } from '../engine/types'

export const SECTORS: SectorId[] = ['salt', 'spice', 'iron']

export const tuning: Tuning = {
  marketDayInterval: 14,
  marketDriftRange: 4,
  freedomDaysToTrial: 21,
  daysPerTurn: 2,
  paydayInterval: 7,
}

export const consequenceTuning: ConsequenceTuning = {
  mafia: { flagId: 'mafia_trigger', threshold: 5 },
  police: { flagId: 'police_trigger', threshold: 5 },
  war: { flagId: 'war_trigger', threshold: 5 },
  banking: { flagId: 'banking_trigger', threshold: 5 },
}

export const initial: Campaign['initial'] = {
  stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 },
  finances: { gold: 50, wages: 0, monthlyExpenses: 20, debt: 0, assets: [], commodities: { spice: 0, salt: 0, iron: 0 } },
  market: { salt: 100, spice: 100, iron: 100 },
}

// ---- Chapter pacing ----

/** Monthly expenses added on entering each chapter (applied by the outcome card
 *  of the Colossus that opens it). A reckoning strips your assets, so this is
 *  what makes each chapter's rebuild take longer than the last. */
export const LIVING_COST_RISE: Record<Exclude<ChapterNumber, 1>, number> = {
  2: 30,
  3: 40,
  4: 50,
  5: 60,
  6: 70,
  7: 80,
}

/** Share of each living-cost rise that also comes back as wages. A higher
 *  station pays better too; without this, wages (halved by every reckoning)
 *  fall so far behind expenses that a player can never save up to buy back in. */
export const STATION_WAGE_SHARE = 0.5

/** Chapter cards' draw weight is multiplied by this, so a chapter's own deck
 *  outweighs the generic pool it shares the draw with. */
export const CHAPTER_DRAW_WEIGHT = 3
