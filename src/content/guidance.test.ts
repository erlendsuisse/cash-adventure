import { describe, expect, it } from 'vitest'
import { drawCard } from '../engine/director'
import { newGame } from '../engine/init'
import type { ChapterNumber, GameState } from '../engine/types'
import { campaign } from './campaign'
import { chapterLivingCost } from './cards/work-opportunities'
import { CHAPTERS, chapterTitleCardId } from './chapters'

const CHAPTER_NUMBERS: ChapterNumber[] = [1, 2, 3, 4, 5, 6, 7]

function inChapter(chapter: ChapterNumber, finances: Partial<GameState['finances']>): GameState {
  const base = newGame(1, campaign)
  return {
    ...base,
    progress: { ...base.progress, colossiDefeated: chapter - 1, storyPhase: chapter === 1 ? 'climbing' : 'recovery' },
    finances: { ...base.finances, ...finances },
  }
}

/** Share of 200 draws that are work cards. */
function workShare(state: GameState): number {
  let work = 0
  for (let cursor = 0; cursor < 200; cursor++) {
    const { cardId } = drawCard({ ...state, rng: { seed: 7, cursor } }, campaign)
    if (cardId?.includes('_work_')) work++
  }
  return work / 200
}

describe('player guidance', () => {
  it('every chapter has a title card that says what it is about and what to do', () => {
    for (const n of CHAPTER_NUMBERS) {
      const chapter = CHAPTERS[n]
      expect(chapter.theme.length, `chapter ${n} theme`).toBeGreaterThan(20)
      expect(chapter.hint.length, `chapter ${n} hint`).toBeGreaterThan(20)
      if (n > 1) expect(campaign.cards[chapterTitleCardId(n)], `chapter ${n} title card`).toBeDefined()
    }
  })

  it('each Colossus opens the next chapter with its title card', () => {
    campaign.colossusCardIds.slice(0, 6).forEach((_, i) => {
      const outcome = campaign.cards[`colossus0${i + 1}_outcome`]!
      expect(outcome.onEnter).toContainEqual({ kind: 'queueCard', card: chapterTitleCardId((i + 2) as ChapterNumber) })
    })
  })

  it('a player in the red is offered work often, in every chapter', () => {
    for (const n of CHAPTER_NUMBERS) {
      expect(workShare(inChapter(n, { gold: -50 })), `chapter ${n}`).toBeGreaterThanOrEqual(0.15)
    }
  })

  it('a player with savings is not pestered with rescue work', () => {
    for (const n of CHAPTER_NUMBERS) {
      // Losing money each month, but with more than a month's costs in hand: not trouble yet.
      expect(workShare(inChapter(n, { gold: chapterLivingCost(n) * 3, wages: 0, monthlyExpenses: 50 })), `chapter ${n}`).toBe(0)
    }
  })
})
