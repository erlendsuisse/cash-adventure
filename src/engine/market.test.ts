import { describe, expect, it } from 'vitest'
import { tick } from './economy'
import { apply } from './effects'
import { reduce } from './reduce'
import { isMet } from './requirements'
import { commodityBuyPrice, commodityPrice } from './selectors'
import { makeState } from './testHelpers'
import type { Campaign, GameState, StoryCard } from './types'

const card: StoryCard = { id: 'x', body: [], choices: [] }
const campaign: Campaign = {
  startCardId: 'x',
  cards: { x: card },
  deckCardIds: [],
  sectors: ['salt', 'spice', 'iron'],
  colossusCardIds: [],
  marketDayCardId: 'x',
  commodityBasePrice: { spice: 15, salt: 8, iron: 10 },
  tuning: { marketDayInterval: 14, marketDriftRange: 0, freedomDaysToTrial: 999, daysPerTurn: 0, paydayInterval: 999 },
  initial: { stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 }, finances: { gold: 0, wages: 0, monthlyExpenses: 0, debt: 0, assets: [], commodities: { spice: 0, salt: 0, iron: 0 } }, market: { salt: 100, spice: 100, iron: 100 } },
}

function holding(gold: number, iron: number, ironIndex = 100): GameState {
  const s = makeState()
  return { ...s, market: { ...s.market, iron: ironIndex }, finances: { ...s.finances, gold, commodities: { spice: 0, salt: 0, iron } } }
}

describe('commodity prices', () => {
  it('scale the base price by the market index, with a 10% margin to buy', () => {
    expect(commodityPrice(holding(0, 0, 150), campaign, 'iron')).toBe(15)
    expect(commodityBuyPrice(holding(0, 0, 150), campaign, 'iron')).toBe(17)
  })
})

describe('stock effects', () => {
  it('commodityAtLeast checks units actually held', () => {
    expect(isMet({ kind: 'commodityAtLeast', type: 'iron', amount: 5 }, holding(0, 5))).toBe(true)
    expect(isMet({ kind: 'commodityAtLeast', type: 'iron', amount: 6 }, holding(0, 5))).toBe(false)
  })

  it('buyStock buys at a market-relative price, only as much as you can afford', () => {
    // buy price 11, at half price 6 per unit (rounded): 40 gold buys 6 units for 36
    const s = apply({ kind: 'buyStock', type: 'iron', amount: 30, priceMultiplier: 0.5 }, holding(40, 0), campaign)
    expect(s.finances.commodities.iron).toBe(6)
    expect(s.finances.gold).toBe(4)
  })

  it('sellStock sells everything (or a set amount) at a premium on the market price', () => {
    const all = apply({ kind: 'sellStock', type: 'iron', priceMultiplier: 1.5 }, holding(0, 12), campaign)
    expect(all.finances).toMatchObject({ gold: 180, commodities: { iron: 0 } })
    const some = apply({ kind: 'sellStock', type: 'iron', amount: 5, priceMultiplier: 1 }, holding(0, 12), campaign)
    expect(some.finances).toMatchObject({ gold: 50, commodities: { iron: 7 } })
  })

  it('market-priced effects refuse to run without a price book', () => {
    expect(() => apply({ kind: 'sellStock', type: 'iron', priceMultiplier: 1 }, holding(0, 1))).toThrow()
  })
})

describe('trading actions', () => {
  it('are priced by the engine, never by the client', () => {
    const s = reduce(holding(0, 10), { type: 'sellCommodity', commodity: 'iron', amount: 10, pricePerUnit: 9999 }, campaign)
    expect(s.finances.gold).toBe(100)
  })

  it('cannot sell stock you do not hold', () => {
    const s = reduce(holding(0, 3), { type: 'sellCommodity', commodity: 'iron', amount: 10 }, campaign)
    expect(s.finances).toMatchObject({ gold: 30, commodities: { iron: 0 } })
  })

  it('cannot buy what you cannot afford', () => {
    const state = holding(20, 0)
    expect(reduce(state, { type: 'buyCommodity', commodity: 'iron', amount: 5 }, campaign)).toBe(state)
  })
})

describe('chapter market regimes', () => {
  it('pull prices toward the current chapter\'s targets on market day', () => {
    const regimeCampaign = { ...campaign, marketRegimes: { 1: { target: { iron: 200 }, pull: 0.5, volatility: 0 } } }
    const state = { ...holding(0, 0, 100), clock: { day: 1, nextMarketDay: 1, nextPayday: 999 } }
    const s = tick(state, 1, regimeCampaign)
    expect(s.market.iron).toBe(150)
    expect(s.market.salt).toBe(100) // no target: just the (zero) wobble
  })
})
