import { describe, expect, it } from 'vitest'
import { newGame } from '../engine/init'
import { currentChapter } from '../engine/selectors'
import { campaign } from './campaign'
import { play } from './testBot'

// Whole-campaign runs with a sensible bot across several seeds. Guards pacing
// (chapter tuning: content/tuning.ts) and catches poverty traps - a chapter a
// reasonable player can't climb out of. Thresholds are deliberately loose;
// tighten them as chapter decks grow.

const SEEDS = [42, 7, 1234, 99, 2024, 5, 31337, 8]
const MAX_STEPS = 2000

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[xs.length >> 1]!

const runs = SEEDS.map((seed) => {
  const chapterSteps: Record<number, number> = {}
  const draws: Record<number, { all: number; own: number }> = {}
  const { state } = play(newGame(seed, campaign), MAX_STEPS, (s) => s.status !== 'playing', (before, after) => {
    const chapter = currentChapter(before)
    chapterSteps[chapter] = (chapterSteps[chapter] ?? 0) + 1
    if (after.currentCardId === before.currentCardId || !campaign.deckCardIds.includes(after.currentCardId)) return
    const d = (draws[currentChapter(after)] ??= { all: 0, own: 0 })
    d.all++
    if (campaign.cards[after.currentCardId]!.chapter) d.own++
  })
  return { seed, state, chapterSteps, draws }
})

describe('campaign pacing', () => {
  it('a sensible player wins every seed', () => {
    expect(runs.filter((r) => r.state.status !== 'won').map((r) => r.seed)).toEqual([])
  })

  it('no chapter after the first is over in a handful of turns', () => {
    for (const chapter of [2, 3, 4, 5, 6]) {
      expect(median(runs.map((r) => r.chapterSteps[chapter] ?? 0)), `chapter ${chapter}`).toBeGreaterThanOrEqual(25)
    }
  })

  it('a chapter’s own cards make up a large share of its draws', () => {
    for (const chapter of [2, 3, 4, 5, 6, 7]) {
      const share = median(runs.map((r) => (r.draws[chapter] ? r.draws[chapter].own / r.draws[chapter].all : 0)))
      expect(share, `chapter ${chapter}`).toBeGreaterThanOrEqual(0.35)
    }
  })
})
