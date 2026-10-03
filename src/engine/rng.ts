import type { RngState } from './types'

// splitmix32: pure function of (seed, cursor) -> uint32. No internal mutable
// generator object, so any save that stores {seed, cursor} can replay every
// future roll exactly. Never call this with a cursor you don't intend to persist.
function splitmix32(seed: number, cursor: number): number {
  let x = (seed + cursor * 0x9e3779b9) | 0
  x = Math.imul(x ^ (x >>> 16), 0x21f0aaad)
  x = Math.imul(x ^ (x >>> 15), 0x735a2d97)
  x = x ^ (x >>> 15)
  return x >>> 0
}

/** Draws one uint32 in [0, 2^32). Returns the value and the advanced rng state. */
export function draw(rng: RngState): { value: number; rng: RngState } {
  const value = splitmix32(rng.seed, rng.cursor)
  return { value, rng: { seed: rng.seed, cursor: rng.cursor + 1 } }
}

/** Rolls a die of `sides` faces, returning a value in [1, sides]. */
export function rollDie(rng: RngState, sides: number): { roll: number; rng: RngState } {
  const { value, rng: next } = draw(rng)
  const roll = (value % sides) + 1
  return { roll, rng: next }
}

/** Picks a uniformly random index in [0, length). */
export function rollIndex(rng: RngState, length: number): { index: number; rng: RngState } {
  const { value, rng: next } = draw(rng)
  return { index: value % length, rng: next }
}

/** Weighted pick over parallel `weights` (must be non-negative, sum > 0). */
export function rollWeighted(
  rng: RngState,
  weights: number[],
): { index: number; rng: RngState } {
  const total = weights.reduce((sum, w) => sum + w, 0)
  const { value, rng: next } = draw(rng)
  let target = value % total
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i] ?? 0
    if (target < w) return { index: i, rng: next }
    target -= w
  }
  return { index: weights.length - 1, rng: next }
}
