import { isMet } from '../engine/requirements'
import { reduce } from '../engine/reduce'
import type { Action, Choice, GameState } from '../engine/types'
import { campaign } from './campaign'

// A sensible-but-not-clever player for deterministic content tests. Lives in
// the test tooling, never the engine.

/** Rough worth of a choice: a year of any cashflow it changes, plus gold now.
 *  Skill checks score 0 - the bot neither fears nor favours them. */
function choiceValue(choice: Choice): number {
  return (choice.effects ?? []).reduce((sum, e) => {
    if (e.kind === 'acquireAsset') return sum + e.asset.monthlyCashflow * 12
    if (e.kind === 'wages') return sum + e.delta * 12
    if (e.kind === 'expense') return sum - e.delta * 12
    if (e.kind === 'loan') return sum - e.monthlyPayment * 12
    if (e.kind === 'gold') return sum + e.delta
    return sum
  }, 0)
}

export function pickChoiceId(state: GameState): string | undefined {
  const card = campaign.cards[state.currentCardId]
  if (!card || card.choices.length === 0) return undefined
  const eligible = card.choices.filter((c) => (c.requires ?? []).every((r) => isMet(r, state)))
  if (eligible.length === 0) return card.choices[0]?.id
  return eligible.reduce((best, c) => (choiceValue(c) > choiceValue(best) ? c : best)).id
}

export function nextAction(state: GameState): Action {
  const card = campaign.cards[state.currentCardId]
  return state.pendingOutcome || !card || card.choices.length === 0 ? { type: 'advance' } : { type: 'choose', choiceId: pickChoiceId(state)! }
}

/** Plays from `state` until `done` or `maxSteps`, calling `onStep` after each action. */
export function play(state: GameState, maxSteps: number, done: (s: GameState) => boolean, onStep?: (before: GameState, after: GameState, action: Action) => void): { state: GameState; actions: Action[] } {
  const actions: Action[] = []
  let s = state
  for (let i = 0; i < maxSteps && !done(s); i++) {
    const action = nextAction(s)
    const next = reduce(s, action, campaign)
    actions.push(action)
    onStep?.(s, next, action)
    if (next === s) break // the bot is stuck: nothing it can do changes the state
    s = next
  }
  return { state: s, actions }
}
