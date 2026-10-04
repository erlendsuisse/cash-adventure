import { useState } from 'react'
import { campaign } from '../../content/campaign'
import { inTrouble } from '../../content/cards/work-opportunities'
import { CHAPTERS } from '../../content/chapters'
import { isMet } from '../../engine/requirements'
import { currentChapter, isFree, passiveIncome } from '../../engine/selectors'
import type { GameState } from '../../engine/types'
import styles from './ChapterBanner.module.css'

/** What to do right now, in one line, from the player's actual situation. */
function objective(state: GameState): { text: string; tone: 'warn' | 'goal' | 'good' } {
  if (isMet(inTrouble(currentChapter(state)), state)) {
    return { tone: 'warn', text: 'You\'re in the red. Take the work that comes your way and hold off on new ventures until your monthly balance is positive.' }
  }
  const passive = passiveIncome(state)
  const expenses = state.finances.monthlyExpenses
  if (!isFree(state)) {
    return { tone: 'goal', text: `Goal: passive income ${passive}g of ${expenses}g a month. Buy ventures to cover the last ${expenses - passive}g and you're free.` }
  }
  const remaining = Math.max(0, campaign.tuning.freedomDaysToTrial - state.progress.freedomDays)
  const next = state.progress.colossiDefeated + 1
  return { tone: 'good', text: `You're free! Hold it ${remaining} more day${remaining === 1 ? '' : 's'} and Colossus ${next} will come to test you.` }
}

export function ChapterBanner({ state }: { state: GameState }) {
  const [open, setOpen] = useState(false)
  const chapter = CHAPTERS[currentChapter(state)]
  const goal = objective(state)
  return (
    <div className={styles.banner}>
      <button type="button" className={styles.heading} onClick={() => setOpen((o) => !o)} aria-expanded={open} title="What is this chapter about?">
        <span className={styles.chapter}>Chapter {chapter.numeral}</span>
        <span className={styles.name}>{chapter.name}</span>
        <span className={styles.toggle}>{open ? '▴' : '▾'}</span>
      </button>
      <span className={`${styles.objective} ${styles[goal.tone]}`}>{goal.text}</span>
      {open && (
        <div className={styles.details}>
          <p>{chapter.theme}</p>
          <p className={styles.hint}>{chapter.hint}</p>
        </div>
      )}
    </div>
  )
}
