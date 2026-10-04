import type { Campaign, ChapterNumber, Commodity, ConsequenceTuning, MarketRegime, SectorId, Tuning } from '../engine/types'

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

// ---- Commodity markets ----

/** Gold per unit at a market index of 100. */
export const COMMODITY_BASE_PRICE: Record<Commodity, number> = { spice: 15, salt: 8, iron: 12 }

/** Each chapter's market: prices drift toward these index targets over a few
 *  market days, so what's cheap in one chapter can be dear in the next - and
 *  stock you hold survives a reckoning. Described to players in chapters.ts. */
export const MARKET_REGIMES: Record<ChapterNumber, MarketRegime> = {
  1: { target: { salt: 100, spice: 100, iron: 100 }, pull: 0.1 }, // steady: learn the trade
  2: { target: { salt: 120, spice: 70, iron: 100 }, pull: 0.3, volatility: 5 }, // smuggled spice floods in; untaxed salt sells dear
  3: { target: { salt: 140, spice: 70, iron: 170 }, pull: 0.3, volatility: 5 }, // the army buys iron and salt; spice is a luxury
  4: { target: { salt: 90, spice: 140, iron: 115 }, pull: 0.2, volatility: 12 }, // speculators chase spice up and down
  5: { target: { salt: 150, spice: 180, iron: 60 }, pull: 0.3, volatility: 6 }, // medicine and preserving soar; nobody builds
  6: { target: { salt: 115, spice: 130, iron: 145 }, pull: 0.25, volatility: 10 }, // routes cut, nobody trusted: dear and jumpy
  7: { target: { salt: 100, spice: 100, iron: 100 }, pull: 0.1, volatility: 18 }, // reality is unstable: wild swings
}
