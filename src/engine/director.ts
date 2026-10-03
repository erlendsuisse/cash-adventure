import { getCurrentChapter } from '../content/chapters'
import { isMet } from './requirements'
import { rollWeighted } from './rng'
import type { Campaign, CardId, GameState, RngState } from './types'

export const RECENT_DRAWN_WINDOW = 4

/** Picks the next random-deck card: eligible by requirement and tier, weighted
 *  by `weight`, avoiding cards seen in the last few draws unless that would
 *  leave nothing to draw. Returns undefined only if the deck has no card the
 *  player currently qualifies for at all - well-formed content should never
 *  hit that, and the caller falls back to the campaign start card. */
export function drawCard(
  state: GameState,
  campaign: Campaign,
): { cardId: CardId | undefined; rng: RngState } {
  const currentChapter = getCurrentChapter(state.progress.colossiDefeated)

  const eligible = campaign.deckCardIds.filter((id) => {
    const card = campaign.cards[id]
    if (!card || !card.weight || card.weight <= 0) return false
    if ((card.minTier ?? 0) > state.progress.tier) return false
    if (card.storyPhase && card.storyPhase !== state.progress.storyPhase) return false
    if (card.chapter && card.chapter !== currentChapter) return false
    return (card.requires ?? []).every((r) => isMet(r, state))
  })

  const fresh = eligible.filter((id) => !state.seenCardIds.includes(id) && !state.recentlyDrawn.includes(id))
  const pool = fresh.length > 0 ? fresh : eligible
  if (pool.length === 0) return { cardId: undefined, rng: state.rng }

  const weights = pool.map((id) => campaign.cards[id]?.weight ?? 0)
  const { index, rng } = rollWeighted(state.rng, weights)
  return { cardId: pool[index], rng }
}

export function recordDraw(recentlyDrawn: CardId[], cardId: CardId): CardId[] {
  return [...recentlyDrawn, cardId].slice(-RECENT_DRAWN_WINDOW)
}
