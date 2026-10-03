import { describe, expect, it } from 'vitest'
import { drawCard, recordDraw, RECENT_DRAWN_WINDOW } from './director'
import { makeState } from './testHelpers'
import type { Campaign, StoryCard } from './types'

function card(id: string, overrides: Partial<StoryCard> = {}): StoryCard {
  return { id, body: [], choices: [], weight: 1, ...overrides }
}

function makeCampaign(cards: StoryCard[]): Campaign {
  const record: Record<string, StoryCard> = {}
  for (const c of cards) record[c.id] = c
  return {
    startCardId: cards[0]?.id ?? 'start',
    cards: record,
    deckCardIds: cards.filter((c) => c.weight).map((c) => c.id),
    sectors: [],
    colossusCardIds: [],
    marketDayCardId: 'market_day',
    tuning: { marketDayInterval: 14, marketDriftRange: 4, freedomDaysToTrial: 21, daysPerTurn: 1, paydayInterval: 999 },
    initial: { stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 }, finances: { gold: 100, wages: 0, monthlyExpenses: 0, debt: 0, assets: [] }, market: {} },
  }
}

describe('drawCard', () => {
  it('only draws cards the player is eligible for', () => {
    const campaign = makeCampaign([
      card('a', { requires: [{ kind: 'goldAtLeast', amount: 1000 }] }),
      card('b'),
    ])
    let rng = { seed: 1, cursor: 0 }
    for (let i = 0; i < 20; i++) {
      const { cardId, rng: next } = drawCard(makeState({ rng }), campaign)
      expect(cardId).toBe('b')
      rng = next
    }
  })

  it('gates by minTier', () => {
    const campaign = makeCampaign([card('a', { minTier: 5 }), card('b')])
    const { cardId } = drawCard(makeState({ progress: { colossiDefeated: 0, boons: [], freedomDays: 0, tier: 1, storyPhase: 'early_game', currentPath: undefined } }), campaign)
    expect(cardId).toBe('b')
  })

  it('avoids recently drawn cards while an alternative exists', () => {
    const campaign = makeCampaign([card('a'), card('b')])
    const state = makeState({ recentlyDrawn: ['a'] })
    for (let cursor = 0; cursor < 50; cursor++) {
      const { cardId } = drawCard({ ...state, rng: { seed: 1, cursor } }, campaign)
      expect(cardId).toBe('b')
    }
  })

  it('falls back to the full eligible pool when everything is on cooldown', () => {
    const campaign = makeCampaign([card('a'), card('b')])
    const state = makeState({ recentlyDrawn: ['a', 'b'] })
    const { cardId } = drawCard(state, campaign)
    expect(['a', 'b']).toContain(cardId)
  })

  it('returns undefined when nothing is eligible', () => {
    const campaign = makeCampaign([card('a', { requires: [{ kind: 'goldAtLeast', amount: 1000 }] })])
    const { cardId } = drawCard(makeState(), campaign)
    expect(cardId).toBeUndefined()
  })

  it('weight biases the draw distribution', () => {
    const campaign = makeCampaign([card('rare', { weight: 1 }), card('common', { weight: 99 })])
    let rng = { seed: 1, cursor: 0 }
    let commonCount = 0
    for (let i = 0; i < 200; i++) {
      const { cardId, rng: next } = drawCard(makeState({ rng, recentlyDrawn: [] }), campaign)
      if (cardId === 'common') commonCount++
      rng = next
    }
    expect(commonCount).toBeGreaterThan(150)
  })
})

describe('recordDraw', () => {
  it('keeps only the last RECENT_DRAWN_WINDOW entries', () => {
    let recent: string[] = []
    for (let i = 0; i < RECENT_DRAWN_WINDOW + 3; i++) {
      recent = recordDraw(recent, `c${i}`)
    }
    expect(recent).toHaveLength(RECENT_DRAWN_WINDOW)
    expect(recent[recent.length - 1]).toBe(`c${RECENT_DRAWN_WINDOW + 2}`)
  })
})
