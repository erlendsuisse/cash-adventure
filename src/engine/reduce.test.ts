import { describe, expect, it } from 'vitest'
import { newGame } from './init'
import { reduce } from './reduce'
import type { Campaign, StoryCard } from './types'

function card(id: string, overrides: Partial<StoryCard> = {}): StoryCard {
  return { id, body: [], choices: [], ...overrides }
}

function makeCampaign(cards: StoryCard[], overrides: Partial<Campaign> = {}): Campaign {
  const record: Record<string, StoryCard> = {}
  for (const c of cards) record[c.id] = c
  return {
    startCardId: cards[0]?.id ?? 'start',
    cards: record,
    deckCardIds: [],
    sectors: ['salt'],
    colossusCardIds: [],
    marketDayCardId: 'market_day',
    commodityBasePrice: { spice: 15, salt: 8, iron: 12 },
    tuning: { marketDayInterval: 1000, marketDriftRange: 4, freedomDaysToTrial: 1000, daysPerTurn: 1, paydayInterval: 1000 },
    initial: { stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 }, finances: { gold: 100, wages: 0, monthlyExpenses: 0, debt: 0, assets: [], commodities: { spice: 0, salt: 0, iron: 0 } }, market: { salt: 100 } },
    ...overrides,
  }
}

describe('reduce - choose', () => {
  it('applies effects and follows the choice goto', () => {
    const campaign = makeCampaign([
      card('start', { choices: [{ id: 'go', label: 'Go', effects: [{ kind: 'gold', delta: 10 }], goto: 'next' }] }),
      card('next'),
    ])
    const state = newGame(1, campaign)
    const s = reduce(state, { type: 'choose', choiceId: 'go' }, campaign)
    expect(s.finances.gold).toBe(110)
    expect(s.currentCardId).toBe('next')
  })

  it('ignores a choiceId that does not exist on the current card', () => {
    const campaign = makeCampaign([card('start', { choices: [{ id: 'go', label: 'Go', goto: 'next' }] }), card('next')])
    const state = newGame(1, campaign)
    const s = reduce(state, { type: 'choose', choiceId: 'nope' }, campaign)
    expect(s).toEqual(state)
  })

  it('refuses a choice whose requirements are not met', () => {
    const campaign = makeCampaign([
      card('start', { choices: [{ id: 'go', label: 'Go', requires: [{ kind: 'goldAtLeast', amount: 1000 }], goto: 'next' }] }),
      card('next'),
    ])
    const state = newGame(1, campaign)
    const s = reduce(state, { type: 'choose', choiceId: 'go' }, campaign)
    expect(s.currentCardId).toBe('start')
  })

  it('resolves a skill check and follows the outcome goto, logging the roll', () => {
    const campaign = makeCampaign([
      card('start', {
        choices: [
          {
            id: 'check',
            label: 'Check',
            check: { stat: 'savvy', dc: 1, success: { text: 'yes', goto: 'won_card' }, failure: { text: 'no', goto: 'lost_card' } },
          },
        ],
      }),
      card('won_card'),
      card('lost_card'),
    ])
    const state = newGame(1, campaign)
    const s = reduce(state, { type: 'choose', choiceId: 'check' }, campaign)
    expect(s.currentCardId).toBe('won_card') // dc 1 always succeeds
    expect(s.log.some((l) => l.text.includes('vs DC 1'))).toBe(true)
  })

  it('draws from the deck when no goto is specified', () => {
    const campaign = makeCampaign(
      [card('start', { choices: [{ id: 'go', label: 'Go' }] }), card('drawn', { weight: 1 })],
      { deckCardIds: ['drawn'] },
    )
    const state = newGame(1, campaign)
    const s = reduce(state, { type: 'choose', choiceId: 'go' }, campaign)
    expect(s.currentCardId).toBe('drawn')
  })

  it('lets an authored goto finish its chain before a queued interrupt plays', () => {
    // An interrupt cutting into a goto chain would break multi-card sequences
    // like a Colossus trial, so it waits in the queue and plays on the next draw.
    const campaign = makeCampaign(
      [
        card('start', { choices: [{ id: 'go', label: 'Go', effects: [{ kind: 'advanceDays', days: 1 }], goto: 'story_continues' }] }),
        card('story_continues', { choices: [{ id: 'onward', label: 'Onward' }] }),
      ],
      { tuning: { marketDayInterval: 1, marketDriftRange: 0, freedomDaysToTrial: 1000, daysPerTurn: 0, paydayInterval: 1000 } },
    )
    const state = newGame(1, campaign)
    const s = reduce(state, { type: 'choose', choiceId: 'go' }, campaign)
    expect(s.currentCardId).toBe('story_continues')
    expect(s.pendingCards).toEqual(['market_day'])

    const s2 = reduce(s, { type: 'choose', choiceId: 'onward' }, campaign)
    expect(s2.currentCardId).toBe('market_day')
    expect(s2.pendingCards).not.toContain('market_day') // this turn's draw waits behind it instead
  })

  it('plays a queued interrupt instead of drawing, so draws never pile up behind it', () => {
    const campaign = makeCampaign([card('start', { choices: [{ id: 'go', label: 'Go' }] }), card('interrupt')])
    const state = { ...newGame(1, campaign), pendingCards: ['interrupt'] }
    const s = reduce(state, { type: 'choose', choiceId: 'go' }, campaign)
    expect(s.currentCardId).toBe('interrupt')
    expect(s.pendingCards).toEqual([])
    expect(s.rng).toEqual(state.rng) // nothing was drawn
  })

  it('shows changes to tracked flags (like reputation) in the effect summary', () => {
    const campaign = makeCampaign([card('start', { choices: [{ id: 'help', label: 'Help', effects: [{ kind: 'flag', id: 'rep', delta: 1 }, { kind: 'flag', id: 'secret', set: 1 }] }] })], { trackedFlags: ['rep'] })
    const s = reduce(newGame(1, campaign), { type: 'choose', choiceId: 'help' }, campaign)
    expect(s.pendingOutcome?.effectSummary?.trackedFlagDeltas).toEqual({ rep: 1 })
  })

  it('ignores a choice while an outcome is waiting to be acknowledged', () => {
    const campaign = makeCampaign([card('start', { choices: [{ id: 'buy', label: 'Buy', effects: [{ kind: 'gold', delta: -10 }] }] })])
    const s = reduce(newGame(1, campaign), { type: 'choose', choiceId: 'buy' }, campaign)
    expect(s.pendingOutcome).toBeDefined()
    expect(reduce(s, { type: 'choose', choiceId: 'buy' }, campaign)).toBe(s)
  })

  it('repaying a loan removes only its payments, never base living costs', () => {
    const campaign = makeCampaign([card('start')])
    let s = newGame(1, campaign) // base expenses 0 in the test campaign
    s = { ...s, finances: { ...s.finances, monthlyExpenses: 20 } }
    s = reduce(s, { type: 'takeLoan', principal: 100, monthlyPayment: 10 }, campaign)
    expect(s.finances.monthlyExpenses).toBe(30)
    s = reduce(s, { type: 'payLoan', amount: 500 }, campaign) // overpaying is capped at the debt
    expect(s.finances.debt).toBe(0)
    expect(s.finances.monthlyExpenses).toBe(20)
    expect(s.finances.gold).toBe(100) // 100 start + 100 borrowed - 100 repaid
  })

  it('refuses a loan payment the player cannot afford', () => {
    const campaign = makeCampaign([card('start')])
    const s = { ...newGame(1, campaign), finances: { ...newGame(1, campaign).finances, gold: 10, debt: 100 } }
    expect(reduce(s, { type: 'payLoan', amount: 50 }, campaign)).toBe(s)
  })

  it('selling an asset changes cashflow only through the lost income', () => {
    const campaign = makeCampaign([card('start')])
    const base = newGame(1, campaign)
    const s = { ...base, finances: { ...base.finances, monthlyExpenses: 20, assets: [{ id: 'a', label: 'A', cost: 100, monthlyCashflow: 30, sector: 'salt' }] } }
    const sold = reduce(s, { type: 'sellAsset', id: 'a', priceMultiplier: 0.5 }, campaign)
    expect(sold.finances.monthlyExpenses).toBe(20)
    expect(sold.finances.gold).toBe(base.finances.gold + 50)
  })

  it('stops advancing once the game has ended', () => {
    const campaign = makeCampaign([
      card('start', { choices: [{ id: 'win', label: 'Win', effects: [{ kind: 'end', status: 'won', summary: 'done' }], goto: 'never' }] }),
      card('never'),
    ])
    const state = newGame(1, campaign)
    const s = reduce(state, { type: 'choose', choiceId: 'win' }, campaign)
    expect(s.status).toBe('won')
    expect(s.currentCardId).toBe('start')
  })
})

describe('reduce - advance', () => {
  it('follows a no-choice card\'s next pointer', () => {
    const campaign = makeCampaign([card('start', { next: 'second' }), card('second')])
    const state = newGame(1, campaign)
    const s = reduce(state, { type: 'advance' }, campaign)
    expect(s.currentCardId).toBe('second')
  })

  it('is a no-op on a card with no next', () => {
    const campaign = makeCampaign([card('start')])
    const state = newGame(1, campaign)
    const s = reduce(state, { type: 'advance' }, campaign)
    expect(s).toEqual(state)
  })
})

describe('reduce - restart', () => {
  it('produces a fresh game from the given seed', () => {
    const campaign = makeCampaign([
      card('start', { choices: [{ id: 'go', label: 'Go', effects: [{ kind: 'gold', delta: -50 }], goto: 'start' }] }),
    ])
    const state = newGame(1, campaign)
    const spent = reduce(state, { type: 'choose', choiceId: 'go' }, campaign)
    expect(spent.finances.gold).toBe(50)
    const restarted = reduce(spent, { type: 'restart', seed: 1 }, campaign)
    expect(restarted).toEqual(state)
  })
})
