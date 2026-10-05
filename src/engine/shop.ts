import { applyAll } from './effects'
import { isMet } from './requirements'
import { currentChapter } from './selectors'
import type { Campaign, GameState, ShopItem } from './types'

// THE GUILD HALL
// Gold spent on yourself: training, skills and gear. What you buy here is
// never taken by a Colossus, so it's the one investment that always survives.

export function timesBought(item: ShopItem, state: GameState): number {
  return state.progress.purchases?.[item.id] ?? 0
}

/** Each purchase makes the next one dearer (training gets harder the better you are). */
export function itemPrice(item: ShopItem, state: GameState): number {
  return item.price + (item.priceRise ?? 0) * timesBought(item, state)
}

export type ShopStatus = 'available' | 'tooPoor' | 'soldOut' | 'later' | 'hidden'

/** Gold the Guild Hall won't let you spend: a month's living costs, so
 *  training never leaves you broke and stuck. */
export function shopReserve(state: GameState): number {
  return Math.max(0, state.finances.monthlyExpenses)
}

export function shopStatus(item: ShopItem, state: GameState): ShopStatus {
  if ((item.requires ?? []).some((r) => !isMet(r, state))) return 'hidden'
  if (currentChapter(state) < item.fromChapter) return 'later'
  if (timesBought(item, state) >= item.limit) return 'soldOut'
  if (state.finances.gold - itemPrice(item, state) < shopReserve(state)) return 'tooPoor'
  return 'available'
}

export function buyItem(state: GameState, itemId: string, campaign: Campaign): GameState {
  const item = campaign.shop?.find((i) => i.id === itemId)
  if (!item || state.status !== 'playing' || shopStatus(item, state) !== 'available') return state
  const price = itemPrice(item, state)
  const paid: GameState = {
    ...state,
    finances: { ...state.finances, gold: state.finances.gold - price },
    progress: { ...state.progress, purchases: { ...state.progress.purchases, [item.id]: timesBought(item, state) + 1 } },
    log: [...state.log, { day: state.clock.day, text: `Guild Hall: ${item.name} for ${price}g` }],
  }
  return applyAll(item.effects, paid, campaign)
}
