import { describe, expect, it } from 'vitest'
import { formatCheck, resolveCheck } from './checks'
import { rollDie } from './rng'
import { makeState } from './testHelpers'
import type { RngState } from './types'

/** Finds an rng cursor (for a fixed seed) whose next `rollDie(sides)` draw equals `target`. */
function findCursorFor(seed: number, sides: number, target: number): number {
  for (let cursor = 0; cursor < 5000; cursor++) {
    const { roll } = rollDie({ seed, cursor }, sides)
    if (roll === target) return cursor
  }
  throw new Error(`no cursor found producing roll ${target} on d${sides}`)
}

function rngFor(sides: number, target: number): RngState {
  const seed = 99
  return { seed, cursor: findCursorFor(seed, sides, target) }
}

describe('resolveCheck', () => {
  it('succeeds when total exactly equals the DC', () => {
    const rng = rngFor(20, 10) // roll 10 + statMod 2 = 12
    const state = makeState({ rng, stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 } })
    const { result } = resolveCheck({ stat: 'savvy', dc: 12, success: { text: 'ok' }, failure: { text: 'no' } }, state)
    expect(result.total).toBe(12)
    expect(result.result).toBe('success')
  })

  it('fails when total is one below the DC', () => {
    const rng = rngFor(20, 10)
    const state = makeState({ rng, stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 } })
    const { result } = resolveCheck({ stat: 'savvy', dc: 13, success: { text: 'ok' }, failure: { text: 'no' } }, state)
    expect(result.result).toBe('failure')
  })

  it('treats a natural 1 as critFailure only when critFailure is defined', () => {
    const rng = rngFor(20, 1)
    const state = makeState({ rng })
    const withCrit = resolveCheck(
      { stat: 'savvy', dc: 1, success: { text: 'ok' }, failure: { text: 'no' }, critFailure: { text: 'crit no' } },
      state,
    )
    expect(withCrit.result.result).toBe('critFailure')

    const withoutCrit = resolveCheck({ stat: 'savvy', dc: 1, success: { text: 'ok' }, failure: { text: 'no' } }, state)
    expect(withoutCrit.result.result).toBe('success')
  })

  it('treats a natural max as critSuccess only when critSuccess is defined', () => {
    const rng = rngFor(20, 20)
    const state = makeState({ rng })
    const withCrit = resolveCheck(
      { stat: 'savvy', dc: 100, success: { text: 'ok' }, failure: { text: 'no' }, critSuccess: { text: 'crit yes' } },
      state,
    )
    expect(withCrit.result.result).toBe('critSuccess')

    const withoutCrit = resolveCheck({ stat: 'savvy', dc: 100, success: { text: 'ok' }, failure: { text: 'no' } }, state)
    expect(withoutCrit.result.result).toBe('failure')
  })

  it('stacks conditional bonuses that are met and skips ones that are not', () => {
    const rng = rngFor(20, 10)
    const state = makeState({ rng, flags: { haggler: 1 } })
    const { result } = resolveCheck(
      {
        stat: 'savvy',
        dc: 1,
        bonuses: [
          { if: { kind: 'flag', id: 'haggler' }, mod: 2, reason: "haggler's boon" },
          { if: { kind: 'flag', id: 'absent' }, mod: 5, reason: 'should not apply' },
        ],
        success: { text: 'ok' },
        failure: { text: 'no' },
      },
      state,
    )
    expect(result.bonuses).toEqual([{ mod: 2, reason: "haggler's boon" }])
    expect(result.total).toBe(10 + 2 + 2) // roll + statMod + bonus
  })

  it('consumes exactly one rng draw', () => {
    const state = makeState({ rng: { seed: 5, cursor: 0 } })
    const { rng } = resolveCheck({ stat: 'savvy', dc: 1, success: { text: 'ok' }, failure: { text: 'no' } }, state)
    expect(rng.cursor).toBe(1)
  })

  it('formatCheck renders the full arithmetic', () => {
    const rng = rngFor(20, 14)
    const state = makeState({ rng, stats: { grit: 2, savvy: 3, charm: 2, nerve: 2 } })
    const { result } = resolveCheck(
      {
        stat: 'savvy',
        dc: 15,
        bonuses: [{ if: { kind: 'goldAtLeast', amount: 0 }, mod: 2, reason: "haggler's boon" }],
        success: { text: 'ok' },
        failure: { text: 'no' },
      },
      state,
    )
    expect(formatCheck(result)).toBe("d20 (14) + savvy (3) + haggler's boon (2) = 19 vs DC 15 -> SUCCESS")
  })
})
