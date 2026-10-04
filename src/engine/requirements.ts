import { isFree, totalMonthlyIncome } from './selectors'
import type { GameState, Requirement } from './types'

export function isMet(req: Requirement, state: GameState): boolean {
  switch (req.kind) {
    case 'goldAtLeast':
      return state.finances.gold >= req.amount
    case 'commodityAtLeast':
      return state.finances.commodities[req.type] >= req.amount
    case 'netIncomeAtLeast':
      return totalMonthlyIncome(state) - state.finances.monthlyExpenses >= req.amount
    case 'statAtLeast':
      return state.stats[req.stat] >= req.value
    case 'flag': {
      const value = state.flags[req.id] ?? 0
      if (req.equals !== undefined) return value === req.equals
      if (req.atLeast !== undefined) return value >= req.atLeast
      return value > 0
    }
    case 'ownsAsset':
      return state.finances.assets.some((a) => a.id === req.id)
    case 'isFree':
      return isFree(state)
    case 'colossiAtLeast':
      return state.progress.colossiDefeated >= req.count
    case 'storyPhase':
      return state.progress.storyPhase === req.phase
    case 'cardSeen':
      return state.seenCardIds.includes(req.id)
    case 'cardNotSeen':
      return !state.seenCardIds.includes(req.id)
    case 'heroClass':
      return state.hero?.classId === req.id
    case 'background':
      return state.hero?.backgroundId === req.id
    case 'not':
      return !isMet(req.of, state)
    case 'allOf':
      return req.of.every((r) => isMet(r, state))
    case 'anyOf':
      return req.of.some((r) => isMet(r, state))
  }
}
