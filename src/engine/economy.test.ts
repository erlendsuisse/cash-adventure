import { describe, expect, it } from 'vitest'
import { tick } from './economy'
import { makeState } from './testHelpers'
import type { Campaign, StoryCard } from './types'

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  const card: StoryCard = { id: 'x', body: [], choices: [] }
  return {
    startCardId: 'x',
    cards: { x: card },
    deckCardIds: [],
    sectors: ['salt', 'spice', 'iron'],
    colossusCardIds: ['colossus1'],
    marketDayCardId: 'market_day',
    tuning: { marketDayInterval: 14, marketDriftRange: 4, freedomDaysToTrial: 5, daysPerTurn: 0, paydayInterval: 999 },
    initial: { stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 }, finances: { gold: 0, wages: 0, monthlyExpenses: 0, debt: 0, assets: [] }, market: { salt: 100, spice: 100, iron: 100 } },
    ...overrides,
  }
}

describe('tick', () => {
  it('does nothing across zero days', () => {
    const state = makeState({ clock: { day: 0, nextMarketDay: 14, nextPayday: 999 } })
    const s = tick(state, 0, makeCampaign())
    expect(s).toEqual(state)
  })

  it('queues the market day card when a boundary is crossed and reschedules the next one', () => {
    // clock.day is the day *after* advancing (an advanceDays effect already applied it);
    // daysAdvanced=5 means we're walking days 11..15, crossing the day-14 boundary.
    const state = makeState({ clock: { day: 15, nextMarketDay: 14, nextPayday: 999 } })
    const s = tick(state, 5, makeCampaign())
    expect(s.pendingCards).toContain('market_day')
    expect(s.clock.nextMarketDay).toBe(14 + 14)
  })

  it('accrues freedomDays only while passive income covers expenses, and resets otherwise', () => {
    const free = makeState({
      finances: { gold: 0, wages: 0, monthlyExpenses: 10, debt: 0, assets: [{ id: 'a', label: 'A', cost: 1, monthlyCashflow: 10, sector: 'salt' }] },
      clock: { day: 0, nextMarketDay: 999, nextPayday: 999 },
    })
    const s = tick(free, 3, makeCampaign())
    expect(s.progress.freedomDays).toBe(3)

    const notFree = makeState({
      finances: { gold: 0, wages: 0, monthlyExpenses: 10, debt: 0, assets: [] },
      progress: { colossiDefeated: 0, boons: [], freedomDays: 5, tier: 1, storyPhase: 'early_game', currentPath: undefined },
      clock: { day: 0, nextMarketDay: 999, nextPayday: 999 },
    })
    const s2 = tick(notFree, 1, makeCampaign())
    expect(s2.progress.freedomDays).toBe(0)
  })

  it('queues the next Colossus trial once freedomDays reaches the threshold, and only once', () => {
    const free = makeState({
      finances: { gold: 0, wages: 0, monthlyExpenses: 10, debt: 0, assets: [{ id: 'a', label: 'A', cost: 1, monthlyCashflow: 10, sector: 'salt' }] },
      clock: { day: 0, nextMarketDay: 999, nextPayday: 999 },
    })
    const s = tick(free, 5, makeCampaign()) // freedomDaysToTrial = 5
    expect(s.pendingCards.filter((c) => c === 'colossus1')).toHaveLength(1)

    const s2 = tick(s, 1, makeCampaign())
    expect(s2.pendingCards.filter((c) => c === 'colossus1')).toHaveLength(1)
  })

  it('does not queue a trial once all Colossi are defeated', () => {
    const free = makeState({
      finances: { gold: 0, wages: 0, monthlyExpenses: 10, debt: 0, assets: [{ id: 'a', label: 'A', cost: 1, monthlyCashflow: 10, sector: 'salt' }] },
      progress: { colossiDefeated: 1, boons: [], freedomDays: 0, tier: 1, storyPhase: 'early_game', currentPath: undefined },
      clock: { day: 0, nextMarketDay: 999, nextPayday: 999 },
    })
    const s = tick(free, 5, makeCampaign())
    expect(s.pendingCards).toEqual([])
  })

  it('drifts every sector on a market day and consumes rng draws', () => {
    const state = makeState({ clock: { day: 14, nextMarketDay: 14, nextPayday: 999 }, rng: { seed: 1, cursor: 0 } })
    const s = tick(state, 1, makeCampaign())
    expect(s.rng.cursor).toBe(3) // one draw per sector
    for (const sector of ['salt', 'spice', 'iron']) {
      expect(s.market[sector]).not.toBe(100)
      expect(Math.abs((s.market[sector] ?? 0) - 100)).toBeLessThanOrEqual(4)
    }
  })
})
