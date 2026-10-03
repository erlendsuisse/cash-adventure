import { describe, expect, it } from 'vitest'
import { newGame } from '../engine/init'
import { createSave, replay } from '../persist/save'
import { campaign } from './campaign'
import { play } from './testBot'

describe('golden playthrough', () => {
  it('reaches and clears Colossus I along a real content path', () => {
    const { state, actions } = play(newGame(42, campaign), 2000, (s) => s.progress.colossiDefeated >= 1)

    expect(state.progress.colossiDefeated).toBeGreaterThanOrEqual(1)
    expect(state.progress.boons).toContain('ledger_wyrm_scale')

    // Save/load/replay equivalence: replaying the same actions from the same
    // seed must reproduce the exact snapshot, byte for byte.
    const save = createSave(42, actions, state, 'v1')
    const rebuilt = replay(save.seed, save.actions, campaign)
    expect(rebuilt).toEqual(save.snapshot)
  })
})
