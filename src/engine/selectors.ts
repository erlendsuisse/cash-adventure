import type { Campaign, ChapterNumber, Commodity, GameState } from './types'

// Derived values are computed on read, never stored on GameState. Storing them
// would mean every migration has to keep them in sync with the fields they're
// derived from; selectors can't drift because there's nothing to drift.

export function passiveIncome(state: GameState): number {
  return state.finances.assets.reduce((sum, a) => sum + a.monthlyCashflow, 0)
}

export function totalMonthlyIncome(state: GameState): number {
  return state.finances.wages + passiveIncome(state)
}

/** Free means passive income alone covers expenses. Some passive income is
 *  required: owning nothing isn't freedom, even if expenses hit zero. */
export function isFree(state: GameState): boolean {
  const passive = passiveIncome(state)
  return passive > 0 && passive >= state.finances.monthlyExpenses
}

export function netWorth(state: GameState): number {
  const assetValue = state.finances.assets.reduce((sum, a) => sum + a.cost, 0)
  return state.finances.gold + assetValue - state.finances.debt
}

/** Chapter N opens once N-1 Colossi are defeated; the seventh is the last. */
export function currentChapter(state: GameState): ChapterNumber {
  return Math.min(state.progress.colossiDefeated + 1, 7) as ChapterNumber
}

/** Days you must stay free in this chapter before its Colossus comes. */
export function freedomDaysToTrial(state: GameState, campaign: Pick<Campaign, 'tuning'>): number {
  return campaign.tuning.freedomDaysByChapter?.[currentChapter(state)] ?? campaign.tuning.freedomDaysToTrial
}

/** What the market pays per unit right now. */
export function commodityPrice(state: GameState, campaign: Pick<Campaign, 'commodityBasePrice'>, commodity: Commodity): number {
  return Math.max(1, Math.round((campaign.commodityBasePrice[commodity] * (state.market[commodity] ?? 100)) / 100))
}

/** What the market charges per unit right now (sellers keep a 10% margin). */
export function commodityBuyPrice(state: GameState, campaign: Pick<Campaign, 'commodityBasePrice'>, commodity: Commodity): number {
  return Math.round(commodityPrice(state, campaign, commodity) * 1.1)
}
