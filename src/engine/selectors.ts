import type { ChapterNumber, GameState } from './types'

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
