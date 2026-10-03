import type { GameState } from './types'

// Derived values are computed on read, never stored on GameState. Storing them
// would mean every migration has to keep them in sync with the fields they're
// derived from; selectors can't drift because there's nothing to drift.

export function passiveIncome(state: GameState): number {
  return state.finances.assets.reduce((sum, a) => sum + a.monthlyCashflow, 0)
}

export function totalMonthlyIncome(state: GameState): number {
  return state.finances.wages + passiveIncome(state)
}

export function isFree(state: GameState): boolean {
  return passiveIncome(state) >= state.finances.monthlyExpenses
}

export function netWorth(state: GameState): number {
  const assetValue = state.finances.assets.reduce((sum, a) => sum + a.cost, 0)
  return state.finances.gold + assetValue - state.finances.debt
}
