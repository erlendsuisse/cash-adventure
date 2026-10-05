import { describe, expect, it } from 'vitest'
import { apply } from './effects'
import { abilityCheckBonuses, availableReroll, bestStat } from './hero'
import { newGame } from './init'
import { reduce, withHelpers } from './reduce'
import { itemPrice, shopStatus } from './shop'
import { makeState } from './testHelpers'
import type { Campaign, Perk, ShopItem, StoryCard } from './types'

const perks: Record<string, Perk> = {
  abacus: { id: 'abacus', kind: 'gear', name: 'Abacus', icon: '🧮', text: '+1 Savvy', rules: [{ kind: 'checkBonus', stat: 'savvy', mod: 1 }] },
  lucky: { id: 'lucky', kind: 'skill', name: 'Lucky', icon: '🍀', text: 're-roll', rules: [{ kind: 'rerollFailed', stat: 'any' }] },
  vault: { id: 'vault', kind: 'skill', name: 'Vault', icon: '🗝️', text: 'keep 1', rules: [{ kind: 'keepVentures', count: 1 }] },
  purse: { id: 'purse', kind: 'skill', name: 'Purse', icon: '👛', text: 'keep wages', rules: [{ kind: 'keepWages', percent: 25 }] },
}

const shop: ShopItem[] = [
  { id: 'train_savvy', kind: 'training', name: 'Savvy', icon: '📚', text: '+1', price: 50, priceRise: 40, limit: 2, fromChapter: 1, effects: [{ kind: 'stat', stat: 'savvy', delta: 1 }] },
  { id: 'buy_abacus', kind: 'gear', name: 'Abacus', icon: '🧮', text: '+1', price: 70, limit: 1, fromChapter: 1, effects: [{ kind: 'grantBoon', boon: 'abacus' }] },
  { id: 'buy_vault', kind: 'skill', name: 'Vault', icon: '🗝️', text: 'keep', price: 10, limit: 1, fromChapter: 2, effects: [{ kind: 'grantBoon', boon: 'vault' }] },
]

function makeCampaign(cards: StoryCard[] = [{ id: 'start', body: [], choices: [] }]): Campaign {
  return {
    startCardId: cards[0]!.id,
    cards: Object.fromEntries(cards.map((c) => [c.id, c])),
    deckCardIds: [],
    sectors: ['salt'],
    colossusCardIds: [],
    marketDayCardId: 'market_day',
    commodityBasePrice: { spice: 15, salt: 8, iron: 12 },
    tuning: { marketDayInterval: 1000, marketDriftRange: 4, freedomDaysToTrial: 1000, daysPerTurn: 1, paydayInterval: 1000 },
    perks,
    shop,
    initial: { stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 }, finances: { gold: 200, wages: 0, monthlyExpenses: 0, debt: 0, assets: [], commodities: { spice: 0, salt: 0, iron: 0 } }, market: { salt: 100 } },
  }
}

describe('the Guild Hall', () => {
  it('sells training at a price that rises with each lesson, up to its limit', () => {
    const campaign = makeCampaign()
    let s = newGame(1, campaign)
    s = reduce(s, { type: 'buyItem', itemId: 'train_savvy' }, campaign)
    expect(s.stats.savvy).toBe(3)
    expect(s.finances.gold).toBe(150)
    expect(itemPrice(shop[0]!, s)).toBe(90)
    s = reduce(s, { type: 'buyItem', itemId: 'train_savvy' }, campaign)
    expect(s.stats.savvy).toBe(4)
    expect(s.finances.gold).toBe(60)
    // Sold out after 2
    expect(reduce(s, { type: 'buyItem', itemId: 'train_savvy' }, campaign)).toBe(s)
  })

  it('refuses what you cannot afford, and what opens in a later chapter', () => {
    const campaign = makeCampaign()
    const poor = { ...newGame(1, campaign), finances: { ...newGame(1, campaign).finances, gold: 20 } }
    expect(reduce(poor, { type: 'buyItem', itemId: 'buy_abacus' }, campaign)).toBe(poor)
    // A month's living costs always stay in the purse
    const tight = { ...newGame(1, campaign), finances: { ...newGame(1, campaign).finances, gold: 80, monthlyExpenses: 20 } }
    expect(reduce(tight, { type: 'buyItem', itemId: 'buy_abacus' }, campaign)).toBe(tight)
    const s = newGame(1, campaign)
    expect(reduce(s, { type: 'buyItem', itemId: 'buy_vault' }, campaign)).toBe(s)
  })

  it('a perk bought as gear adds to rolls of its attribute, named after the gear', () => {
    const campaign = makeCampaign()
    const s = reduce(newGame(1, campaign), { type: 'buyItem', itemId: 'buy_abacus' }, campaign)
    expect(s.progress.boons).toContain('abacus')
    expect(abilityCheckBonuses('savvy', s, campaign)).toEqual([{ mod: 1, reason: '🧮 Abacus' }])
    expect(abilityCheckBonuses('grit', s, campaign)).toEqual([])
  })
})

describe('perks', () => {
  it('an "any" re-roll covers every attribute, once per chapter', () => {
    const campaign = makeCampaign()
    const s = makeState({ progress: { ...makeState().progress, boons: ['lucky'] } })
    expect(availableReroll('charm', s, campaign)?.source).toBe('🍀 Lucky')
    const used = { ...s, flags: { perk_reroll_lucky_ch1: 1 } }
    expect(availableReroll('charm', used, campaign)).toBeUndefined()
  })

  it('a Colossus leaves your best ventures and more wages to heroes with the right perks', () => {
    const campaign = makeCampaign()
    const assets = [
      { id: 'a', label: 'Small', cost: 50, monthlyCashflow: 10, sector: 'salt' as const },
      { id: 'b', label: 'Big', cost: 90, monthlyCashflow: 30, sector: 'salt' as const },
    ]
    const base = makeState({ finances: { ...makeState().finances, wages: 40, assets } })
    const plain = apply({ kind: 'reckoning' }, base, campaign)
    expect(plain.finances.assets).toEqual([])
    expect(plain.finances.wages).toBe(20)

    const perked = apply({ kind: 'reckoning' }, { ...base, progress: { ...base.progress, boons: ['vault', 'purse'] } }, campaign)
    expect(perked.finances.assets.map((a) => a.id)).toEqual(['b'])
    expect(perked.finances.wages).toBe(30)
  })

  it('shows a new perk on the outcome card', () => {
    const campaign = makeCampaign([{ id: 'start', body: [], choices: [{ id: 'take', label: 'Take it', effects: [{ kind: 'grantBoon', boon: 'abacus' }] }] }])
    const s = reduce(newGame(1, campaign), { type: 'choose', choiceId: 'take' }, campaign)
    expect(s.pendingOutcome?.effectSummary?.perksGained).toEqual(['🧮 Abacus'])
  })
})

describe('checks with your best attribute', () => {
  it('rolls with the highest attribute', () => {
    const campaign = makeCampaign([
      { id: 'start', body: [], choices: [{ id: 'own', label: 'Own way', check: { stat: 'best', dc: 1, success: { text: 'yes' }, failure: { text: 'no' } } }] },
    ])
    const s0 = newGame(1, campaign)
    const s1 = { ...s0, stats: { grit: 2, savvy: 2, charm: 7, nerve: 3 } }
    expect(bestStat(s1)).toBe('charm')
    const s = reduce(s1, { type: 'choose', choiceId: 'own' }, campaign)
    expect(s.pendingOutcome?.checkResult?.stat).toBe('charm')
    expect(s.pendingOutcome?.checkResult?.statMod).toBe(7)
  })
})

describe('seeing what you bought pay off', () => {
  const roll = { die: 20, roll: 11, stat: 'savvy' as const, statMod: 3, bonuses: [{ mod: 1, reason: '🧮 Abacus' }], total: 15, dc: 15, result: 'success' as const }

  it('names the gear and training that turned a miss into a success', () => {
    const campaign = makeCampaign()
    const trained = makeState({ progress: { ...makeState().progress, purchases: { train_savvy: 1 } } })
    expect(withHelpers(roll, trained, campaign).helpedBy).toEqual(['🧮 Abacus', 'your Savvy training'])
  })

  it('says nothing when the roll would have made it anyway', () => {
    const campaign = makeCampaign()
    expect(withHelpers({ ...roll, dc: 10 }, makeState(), campaign).helpedBy).toBeUndefined()
  })

  it('a Colossus tells you what your perks kept safe', () => {
    const campaign = makeCampaign()
    const base = makeState({ finances: { ...makeState().finances, assets: [{ id: 'b', label: 'Big Stall', cost: 90, monthlyCashflow: 30, sector: 'salt' }] }, progress: { ...makeState().progress, boons: ['vault'] } })
    const after = apply({ kind: 'reckoning' }, base, campaign)
    expect(after.log.at(-1)?.text).toBe('🗝️ Vault kept Big Stall safe from the Colossus!')
  })

  it("only shows a class's own items to that class", () => {
    const item: ShopItem = { id: 'x', kind: 'gear', name: 'Lute', icon: '🪕', text: '+2', price: 10, limit: 1, fromChapter: 1, requires: [{ kind: 'heroClass', id: 'bard' }], effects: [] }
    expect(shopStatus(item, makeState())).toBe('hidden')
    expect(shopStatus(item, makeState({ hero: { name: 'A', classId: 'bard', backgroundId: 'x' } }))).toBe('available')
  })
})
