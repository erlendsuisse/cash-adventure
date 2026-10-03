import { describe, expect, it } from 'vitest'
import { apply, applyAll } from './effects'
import { makeState } from './testHelpers'
import type { Effect } from './types'

describe('apply', () => {
  it('gold', () => {
    const s = apply({ kind: 'gold', delta: -30 }, makeState({ finances: { gold: 100, wages: 0, monthlyExpenses: 20, debt: 0, assets: [] } }))
    expect(s.finances.gold).toBe(70)
  })

  it('stat', () => {
    const s = apply({ kind: 'stat', stat: 'savvy', delta: 1 }, makeState())
    expect(s.stats.savvy).toBe(3)
  })

  it('flag set overrides delta', () => {
    const s = apply({ kind: 'flag', id: 'foo', set: 5, delta: 100 }, makeState())
    expect(s.flags.foo).toBe(5)
  })

  it('flag delta accumulates from default 0', () => {
    const s = apply({ kind: 'flag', id: 'foo', delta: 3 }, makeState())
    expect(s.flags.foo).toBe(3)
  })

  it('acquireAsset appends to assets', () => {
    const s = apply(
      { kind: 'acquireAsset', asset: { id: 'a', label: 'A', cost: 10, monthlyCashflow: 1, sector: 'salt' } },
      makeState(),
    )
    expect(s.finances.assets).toHaveLength(1)
  })

  it('sellAsset removes the asset and pays its cost times multiplier', () => {
    const state = makeState({
      finances: { gold: 0, wages: 0, monthlyExpenses: 0, debt: 0, assets: [{ id: 'a', label: 'A', cost: 100, monthlyCashflow: 5, sector: 'salt' }] },
    })
    const s = apply({ kind: 'sellAsset', id: 'a', priceMultiplier: 0.5 }, state)
    expect(s.finances.gold).toBe(50)
    expect(s.finances.assets).toHaveLength(0)
  })

  it('sellAsset is a no-op for an asset that is not owned', () => {
    const state = makeState()
    const s = apply({ kind: 'sellAsset', id: 'nope' }, state)
    expect(s).toEqual(state)
  })

  it('wages', () => {
    const s = apply({ kind: 'wages', delta: 10 }, makeState())
    expect(s.finances.wages).toBe(10)
  })

  it('expense', () => {
    const s = apply({ kind: 'expense', delta: 5 }, makeState())
    expect(s.finances.monthlyExpenses).toBe(25)
  })

  it('loan adds gold and debt and a recurring payment', () => {
    const s = apply({ kind: 'loan', principal: 300, monthlyPayment: 30 }, makeState())
    expect(s.finances.gold).toBe(400)
    expect(s.finances.debt).toBe(300)
    expect(s.finances.monthlyExpenses).toBe(50)
  })

  it('advanceDays', () => {
    const s = apply({ kind: 'advanceDays', days: 7 }, makeState())
    expect(s.clock.day).toBe(7)
  })

  it('queueCard pushes to the back by default, front when requested', () => {
    const state = makeState({ pendingCards: ['x'] })
    const back = apply({ kind: 'queueCard', card: 'y' }, state)
    expect(back.pendingCards).toEqual(['x', 'y'])
    const front = apply({ kind: 'queueCard', card: 'y', front: true }, state)
    expect(front.pendingCards).toEqual(['y', 'x'])
  })

  it('marketShift adjusts a sector from its current or default value', () => {
    const s = apply({ kind: 'marketShift', sector: 'salt', delta: 10 }, makeState())
    expect(s.market.salt).toBe(110)
  })

  it('grantBoon is idempotent', () => {
    const once = apply({ kind: 'grantBoon', boon: 'b1' }, makeState())
    const twice = apply({ kind: 'grantBoon', boon: 'b1' }, once)
    expect(twice.progress.boons).toEqual(['b1'])
  })

  it('reckoning strips assets, halves wages, and advances progress', () => {
    const state = makeState({
      progress: { colossiDefeated: 0, boons: [], freedomDays: 30, tier: 1, storyPhase: 'early_game', currentPath: undefined },
      finances: { gold: 0, wages: 100, monthlyExpenses: 0, debt: 0, assets: [{ id: 'a', label: 'A', cost: 1, monthlyCashflow: 1, sector: 'salt' }] },
    })
    const s = apply({ kind: 'reckoning' }, state)
    expect(s.finances.assets).toEqual([])
    expect(s.finances.wages).toBe(50)
    expect(s.progress.colossiDefeated).toBe(1)
    expect(s.progress.freedomDays).toBe(0)
    expect(s.progress.tier).toBe(2)
  })

  it('narrate appends to the log with the current day', () => {
    const s = apply({ kind: 'narrate', text: 'hi' }, makeState({ clock: { day: 3, nextMarketDay: 14, nextPayday: 7 } }))
    expect(s.log).toEqual([{ day: 3, text: 'hi' }])
  })

  it('end sets status', () => {
    const s = apply({ kind: 'end', status: 'won', summary: 'done' }, makeState())
    expect(s.status).toBe('won')
  })

  it('if applies the then branch when the requirement is met', () => {
    const s = apply(
      { kind: 'if', when: { kind: 'goldAtLeast', amount: 1 }, then: [{ kind: 'gold', delta: 1 }], else: [{ kind: 'gold', delta: -1 }] },
      makeState(),
    )
    expect(s.finances.gold).toBe(101)
  })

  it('if applies the else branch when the requirement fails, and nothing when else is absent', () => {
    const s = apply(
      { kind: 'if', when: { kind: 'goldAtLeast', amount: 999 }, then: [{ kind: 'gold', delta: 1 }], else: [{ kind: 'gold', delta: -1 }] },
      makeState(),
    )
    expect(s.finances.gold).toBe(99)

    const unchanged = apply({ kind: 'if', when: { kind: 'goldAtLeast', amount: 999 }, then: [{ kind: 'gold', delta: 1 }] }, makeState())
    expect(unchanged.finances.gold).toBe(100)
  })
})

describe('applyAll', () => {
  it('applies effects in order, left fold', () => {
    const effects: Effect[] = [{ kind: 'gold', delta: 10 }, { kind: 'gold', delta: -5 }]
    const s = applyAll(effects, makeState())
    expect(s.finances.gold).toBe(105)
  })
})
