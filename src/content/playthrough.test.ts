import { describe, expect, it } from 'vitest'
import { newGame } from '../engine/init'
import { isMet } from '../engine/requirements'
import { reduce } from '../engine/reduce'
import type { Action, Choice, GameState } from '../engine/types'
import { createSave, replay } from '../persist/save'
import { campaign } from './campaign'

/** Prefers buying whatever's on offer (to build passive income toward
 *  freedom) among choices the player actually qualifies for, otherwise takes
 *  the first eligible choice. Deliberately a bit of play-logic living in the
 *  test, not the engine - it exists only to drive a deterministic-enough
 *  playthrough for the assertion below. */
function pickChoiceId(state: GameState): string | undefined {
  const card = campaign.cards[state.currentCardId]
  if (!card || card.choices.length === 0) return undefined

  const isEligible = (c: Choice) => (c.requires ?? []).every((r) => isMet(r, state))
  const eligible = card.choices.filter(isEligible)
  if (eligible.length === 0) return card.choices[0]?.id

  return (eligible.find((c) => c.id.startsWith('buy_')) ?? eligible[0])?.id
}

describe('golden playthrough', () => {
  it('reaches and clears Colossus I along a real content path', () => {
    let state = newGame(42, campaign)
    const actions: Action[] = []

    for (let i = 0; i < 2000 && state.progress.colossiDefeated < 1; i++) {
      const card = campaign.cards[state.currentCardId]
      if (!card) break
      const action: Action = card.choices.length === 0 ? { type: 'advance' } : { type: 'choose', choiceId: pickChoiceId(state)! }
      actions.push(action)
      state = reduce(state, action, campaign)
    }

    expect(state.progress.colossiDefeated).toBeGreaterThanOrEqual(1)
    expect(state.progress.boons).toContain('ledger_wyrm_scale')

    // Save/load/replay equivalence: replaying the same actions from the same
    // seed must reproduce the exact snapshot, byte for byte.
    const save = createSave(42, actions, state, 'v1')
    const rebuilt = replay(save.seed, save.actions, campaign)
    expect(rebuilt).toEqual(save.snapshot)
  })
})
