import { describe, expect, it } from 'vitest'
import { isMet } from './requirements'
import { makeState } from './testHelpers'

describe('isMet', () => {
  it('goldAtLeast', () => {
    expect(isMet({ kind: 'goldAtLeast', amount: 100 }, makeState())).toBe(true)
    expect(isMet({ kind: 'goldAtLeast', amount: 101 }, makeState())).toBe(false)
  })

  it('statAtLeast', () => {
    expect(isMet({ kind: 'statAtLeast', stat: 'savvy', value: 2 }, makeState())).toBe(true)
    expect(isMet({ kind: 'statAtLeast', stat: 'savvy', value: 3 }, makeState())).toBe(false)
  })

  it('flag defaults to 0, supports atLeast and equals', () => {
    const state = makeState({ flags: { seen: 2 } })
    expect(isMet({ kind: 'flag', id: 'missing' }, state)).toBe(false)
    expect(isMet({ kind: 'flag', id: 'seen' }, state)).toBe(true)
    expect(isMet({ kind: 'flag', id: 'seen', atLeast: 2 }, state)).toBe(true)
    expect(isMet({ kind: 'flag', id: 'seen', atLeast: 3 }, state)).toBe(false)
    expect(isMet({ kind: 'flag', id: 'seen', equals: 2 }, state)).toBe(true)
    expect(isMet({ kind: 'flag', id: 'seen', equals: 1 }, state)).toBe(false)
  })

  it('ownsAsset', () => {
    const state = makeState({ finances: { gold: 0, wages: 0, monthlyExpenses: 0, debt: 0, assets: [{ id: 'a', label: 'A', cost: 1, monthlyCashflow: 1, sector: 'salt' }], commodities: { spice: 0, salt: 0, iron: 0 } } })
    expect(isMet({ kind: 'ownsAsset', id: 'a' }, state)).toBe(true)
    expect(isMet({ kind: 'ownsAsset', id: 'b' }, state)).toBe(false)
  })

  it('isFree compares passive income to expenses', () => {
    const free = makeState({ finances: { gold: 0, wages: 0, monthlyExpenses: 10, debt: 0, assets: [{ id: 'a', label: 'A', cost: 1, monthlyCashflow: 10, sector: 'salt' }], commodities: { spice: 0, salt: 0, iron: 0 } } })
    const notFree = makeState({ finances: { gold: 0, wages: 0, monthlyExpenses: 10, debt: 0, assets: [{ id: 'a', label: 'A', cost: 1, monthlyCashflow: 5, sector: 'salt' }], commodities: { spice: 0, salt: 0, iron: 0 } } })
    expect(isMet({ kind: 'isFree' }, free)).toBe(true)
    expect(isMet({ kind: 'isFree' }, notFree)).toBe(false)
  })

  it('isFree needs some passive income, even when expenses are zero', () => {
    const broke = makeState({ finances: { gold: 0, wages: 50, monthlyExpenses: 0, debt: 0, assets: [], commodities: { spice: 0, salt: 0, iron: 0 } } })
    expect(isMet({ kind: 'isFree' }, broke)).toBe(false)
  })

  it('netIncomeAtLeast compares wages plus passive income against expenses', () => {
    const finances = { gold: 0, wages: 30, monthlyExpenses: 50, debt: 0, assets: [{ id: 'a', label: 'A', cost: 1, monthlyCashflow: 10, sector: 'salt' }], commodities: { spice: 0, salt: 0, iron: 0 } }
    expect(isMet({ kind: 'netIncomeAtLeast', amount: 0 }, makeState({ finances }))).toBe(false) // 40 in, 50 out
    expect(isMet({ kind: 'netIncomeAtLeast', amount: -10 }, makeState({ finances }))).toBe(true)
  })

  it('colossiAtLeast', () => {
    const state = makeState({ progress: { colossiDefeated: 2, boons: [], freedomDays: 0, tier: 1, storyPhase: 'early_game', currentPath: undefined } })
    expect(isMet({ kind: 'colossiAtLeast', count: 2 }, state)).toBe(true)
    expect(isMet({ kind: 'colossiAtLeast', count: 3 }, state)).toBe(false)
  })

  it('not, allOf, anyOf compose', () => {
    const state = makeState()
    const gold100 = { kind: 'goldAtLeast', amount: 100 } as const
    const gold200 = { kind: 'goldAtLeast', amount: 200 } as const
    expect(isMet({ kind: 'not', of: gold200 }, state)).toBe(true)
    expect(isMet({ kind: 'allOf', of: [gold100, gold200] }, state)).toBe(false)
    expect(isMet({ kind: 'allOf', of: [gold100] }, state)).toBe(true)
    expect(isMet({ kind: 'anyOf', of: [gold100, gold200] }, state)).toBe(true)
    expect(isMet({ kind: 'anyOf', of: [gold200] }, state)).toBe(false)
  })
})
