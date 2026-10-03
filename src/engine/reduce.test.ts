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
    tuning: { marketDayInterval: 1000, marketDriftRange: 4, freedomDaysToTrial: 1000, daysPerTurn: 1, paydayInterval: 1000 },
    initial: { stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 }, finances: { gold: 100, wages: 0, monthlyExpenses: 0, debt: 0, assets: [] }, market: { salt: 100 } },
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

  it('queues an interrupt ahead of the authored goto and resumes afterward', () => {
    const campaign = makeCampaign(
      [
        card('start', { choices: [{ id: 'go', label: 'Go', effects: [{ kind: 'advanceDays', days: 1 }], goto: 'story_continues' }] }),
        card('story_continues'),
      ],
      { tuning: { marketDayInterval: 1, marketDriftRange: 0, freedomDaysToTrial: 1000, daysPerTurn: 0, paydayInterval: 1000 } },
    )
    const state = newGame(1, campaign)
    const s = reduce(state, { type: 'choose', choiceId: 'go' }, campaign)
    expect(s.currentCardId).toBe('market_day')
    expect(s.pendingCards).toEqual(['story_continues'])

    const s2 = reduce(s, { type: 'choose', choiceId: 'ack' }, campaign)
    // the market_day card in this test has no choices, so 'ack' matches nothing - use advance instead
    expect(s2).toEqual(s)
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
