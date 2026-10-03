import { describe, expect, it } from 'vitest'
import { draw, rollDie, rollWeighted } from './rng'

describe('rng', () => {
  it('is a pure function of seed and cursor - same input, same output', () => {
    const a = draw({ seed: 42, cursor: 5 })
    const b = draw({ seed: 42, cursor: 5 })
    expect(a.value).toBe(b.value)
  })

  it('produces a stable golden sequence for seed 42', () => {
    let rng = { seed: 42, cursor: 0 }
    const rolls: number[] = []
    for (let i = 0; i < 5; i++) {
      const { roll, rng: next } = rollDie(rng, 20)
      rolls.push(roll)
      rng = next
    }
    expect(rolls).toEqual([19, 17, 12, 8, 11])
  })

  it('advances the cursor by exactly one per draw', () => {
    const { rng } = draw({ seed: 1, cursor: 0 })
    expect(rng.cursor).toBe(1)
  })

  it('rollDie stays within [1, sides]', () => {
    let rng = { seed: 7, cursor: 0 }
    for (let i = 0; i < 200; i++) {
      const { roll, rng: next } = rollDie(rng, 6)
      expect(roll).toBeGreaterThanOrEqual(1)
      expect(roll).toBeLessThanOrEqual(6)
      rng = next
    }
  })

  it('rollWeighted never returns an index with zero weight when others are positive', () => {
    let rng = { seed: 3, cursor: 0 }
    const seen = new Set<number>()
    for (let i = 0; i < 200; i++) {
      const { index, rng: next } = rollWeighted(rng, [0, 5, 0])
      seen.add(index)
      rng = next
    }
    expect(seen).toEqual(new Set([1]))
  })
})
