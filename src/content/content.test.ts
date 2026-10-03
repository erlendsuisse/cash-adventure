import { describe, expect, it } from 'vitest'
import type { StoryCard, StoryPhase } from '../engine/types'
import { campaign } from './campaign'
import { cardEffects, checkIntegrity } from './integrity'
import { storyCardSchema } from './schema'
import { consequenceTuning } from './tuning'

/** Fewest own cards a chapter deck may have before it feels thin. */
const MIN_CHAPTER_DECK = 9

describe('campaign content', () => {
  it('every card matches the authoring schema', () => {
    for (const card of Object.values(campaign.cards)) {
      const result = storyCardSchema.safeParse(card)
      if (!result.success) {
        throw new Error(`${card.id}: ${result.error.message}`)
      }
    }
  })

  it('has no dangling goto/queueCard references', () => {
    const { danglingReferences } = checkIntegrity(campaign)
    expect(danglingReferences).toEqual([])
  })

  it('has no unreachable cards', () => {
    const { unreachableCards } = checkIntegrity(campaign)
    expect(unreachableCards).toEqual([])
  })

  it('every deck card id resolves to a real card', () => {
    for (const id of campaign.deckCardIds) {
      expect(campaign.cards[id]).toBeDefined()
    }
  })

  it('the start card, market day card, and every Colossus card exist', () => {
    expect(campaign.cards[campaign.startCardId]).toBeDefined()
    expect(campaign.cards[campaign.marketDayCardId]).toBeDefined()
    for (const id of campaign.colossusCardIds) {
      expect(campaign.cards[id]).toBeDefined()
    }
  })
})

// The director filters cards out silently, so bad gating never crashes - it
// just makes content disappear. These tests are the only thing that notices.
describe('deck coverage', () => {
  const allCards = Object.values(campaign.cards)
  const deck = campaign.deckCardIds.map((id) => campaign.cards[id]!)

  it('every phase a deck card is gated on is one the story actually enters', () => {
    const reachable = new Set<StoryPhase>(['early_game'])
    for (const card of allCards) for (const e of cardEffects(card)) if (e.kind === 'advancePhase') reachable.add(e.to)
    const dead = deck.filter((c) => c.storyPhase && !reachable.has(c.storyPhase)).map((c) => `${c.id} (${c.storyPhase})`)
    expect(dead).toEqual([])
  })

  it('chapter cards are gated by chapter alone, not story phase', () => {
    // From chapter 2 on the phase is always 'recovery', so a phase gate can only hide them.
    expect(deck.filter((c) => c.chapter && c.storyPhase).map((c) => c.id)).toEqual([])
  })

  it('every chapter from 2 to 7 has a playable deck of its own', () => {
    for (const chapter of [2, 3, 4, 5, 6, 7]) {
      const own = deck.filter((c) => c.chapter === chapter)
      expect(own.length, `chapter ${chapter}`).toBeGreaterThanOrEqual(MIN_CHAPTER_DECK)
    }
  })

  it('no chapter card can be drawn outside the chapter its Colossus count implies', () => {
    for (const card of deck) {
      const req = card.requires?.find((r) => r.kind === 'colossiAtLeast')
      if (card.chapter && req?.kind === 'colossiAtLeast') expect(req.count, card.id).toBeLessThanOrEqual(card.chapter - 1)
    }
  })

  it('every card with choices offers at least one the player can always take', () => {
    // Safe if some choice is ungated, or one choice needs exactly R and another exactly not-R.
    const key = (r: unknown) => JSON.stringify(r)
    const alwaysOpen = (c: StoryCard) => {
      const singles = new Set(c.choices.flatMap((ch) => (ch.requires?.length === 1 ? [key(ch.requires[0])] : [])))
      return c.choices.some((ch) => !ch.requires?.length) || [...singles].some((r) => singles.has(key({ kind: 'not', of: JSON.parse(r) })))
    }
    const softlocks = allCards.filter((c) => c.choices.length > 0 && !alwaysOpen(c))
    expect(softlocks.map((c) => c.id)).toEqual([])
  })

  it('every asset costs something', () => {
    // A free asset is passive income for nothing - a shortcut straight to freedom.
    const free = allCards.flatMap((c) => cardEffects(c).flatMap((e) => (e.kind === 'acquireAsset' && e.asset.cost <= 0 ? [`${c.id}:${e.asset.id}`] : [])))
    expect(free).toEqual([])
  })

  it('buying an asset requires holding the gold it costs', () => {
    // Without the gate a broke player can buy in and sink deep into negative gold.
    const unguarded = allCards.flatMap((c) =>
      c.choices.flatMap((ch) => {
        if (!(ch.effects ?? []).some((e) => e.kind === 'acquireAsset')) return []
        const spent = -(ch.effects ?? []).reduce((sum, e) => sum + (e.kind === 'gold' ? e.delta : 0), 0)
        // A card-level gate counts too: drawn cards are played the turn they're drawn.
        const held = Math.max(0, ...[...(c.requires ?? []), ...(ch.requires ?? [])].map((r) => (r.kind === 'goldAtLeast' ? r.amount : 0)))
        return spent > 0 && held < spent ? [`${c.id}/${ch.id} spends ${spent}, requires ${held}`] : []
      }),
    )
    expect(unguarded).toEqual([])
  })

  it('every consequence path can actually build heat', () => {
    const written = new Set(allCards.flatMap((c) => cardEffects(c).flatMap((e) => (e.kind === 'flag' && (e.delta ?? 0) > 0 ? [e.id] : []))))
    for (const { flagId } of Object.values(consequenceTuning)) expect(written.has(flagId), flagId).toBe(true)
  })
})
