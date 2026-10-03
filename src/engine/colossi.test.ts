import { describe, expect, it } from 'vitest'
import { checkConsequenceTrigger, checkTrialTrigger } from './colossi'
import { makeState } from './testHelpers'
import type { Campaign } from './types'

const campaign = {
  colossusCardIds: ['c1_start', 'c2_start', 'c3_start'],
  tuning: { marketDayInterval: 14, marketDriftRange: 0, freedomDaysToTrial: 21, daysPerTurn: 1, paydayInterval: 7 },
  consequenceTuning: {
    mafia: { flagId: 'mafia_trigger', threshold: 3 },
    police: { flagId: 'police_trigger', threshold: 3 },
    war: { flagId: 'war_trigger', threshold: 3 },
    banking: { flagId: 'banking_trigger', threshold: 3 },
  },
} as unknown as Campaign

const progress = (colossiDefeated: number) => ({ colossiDefeated, boons: [], freedomDays: 0, tier: 1, storyPhase: 'recovery' as const })

describe('checkConsequenceTrigger', () => {
  it('pulls the next Colossus forward in order, whichever path built the heat', () => {
    const s = checkConsequenceTrigger(makeState({ progress: progress(1), flags: { war_trigger: 3 } }), campaign)
    expect(s.pendingCards).toEqual(['c2_start'])
    expect(s.progress.currentPath).toBe('war')
    expect(s.flags.war_trigger).toBe(0)
  })

  it('does nothing below the threshold', () => {
    const state = makeState({ flags: { mafia_trigger: 2 } })
    expect(checkConsequenceTrigger(state, campaign)).toBe(state)
  })

  it('folds heat into a trial that is already coming instead of queueing a second', () => {
    const s = checkConsequenceTrigger(makeState({ pendingCards: ['c1_start'], flags: { mafia_trigger: 3 } }), campaign)
    expect(s.pendingCards).toEqual(['c1_start'])
    expect(s.flags.mafia_trigger).toBe(0)
  })

  it('never re-summons a trial already under way', () => {
    const s = checkConsequenceTrigger(makeState({ seenCardIds: ['c1_start'], flags: { police_trigger: 3 } }), campaign)
    expect(s.pendingCards).toEqual([])
  })

  it('does nothing once every Colossus is beaten', () => {
    const state = makeState({ progress: progress(3), flags: { banking_trigger: 5 } })
    expect(checkConsequenceTrigger(state, campaign)).toBe(state)
  })
})

describe('checkTrialTrigger', () => {
  it('summons the next Colossus after enough free days', () => {
    const s = checkTrialTrigger(makeState({ progress: { ...progress(0), freedomDays: 21 } }), campaign)
    expect(s.pendingCards).toEqual(['c1_start'])
    expect(s.progress.freedomDays).toBe(0)
  })

  it('does not queue a Colossus that is already pending', () => {
    const state = makeState({ progress: { ...progress(0), freedomDays: 21 }, pendingCards: ['c1_start'] })
    expect(checkTrialTrigger(state, campaign)).toBe(state)
  })
})
