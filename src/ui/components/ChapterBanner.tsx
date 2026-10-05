import { useState } from 'react'
import { campaign } from '../../content/campaign'
import { inTrouble } from '../../content/cards/work-opportunities'
import { CHAPTERS } from '../../content/chapters'
import { isMet } from '../../engine/requirements'
import { currentChapter, freedomDaysToTrial, isFree, passiveIncome } from '../../engine/selectors'
import type { GameState } from '../../engine/types'
import { RichText } from '../RichText'
import styles from './ChapterBanner.module.css'

interface Objective {
  text: string
  tone: 'warn' | 'goal' | 'good'
  /** How close you are, shown as a bar */
  progress: { value: number; max: number; label: string }
}

/** What to do right now, from the player's actual situation. */
function objective(state: GameState): Objective {
  const passive = passiveIncome(state)
  const expenses = state.finances.monthlyExpenses
  const income = { value: passive, max: Math.max(1, expenses), label: `Ventures pay ${passive}g of your ${expenses}g monthly costs` }
  if (isMet(inTrouble(currentChapter(state)), state)) {
    return { tone: 'warn', text: 'You\'re in the red! Take the work that comes your way, and wait to buy ventures until you earn more than you spend.', progress: income }
  }
  if (!isFree(state)) {
    return { tone: 'goal', text: `Buy ventures until they pay for your living costs. Just ${expenses - passive}g a month to go, and you're free!`, progress: income }
  }
  const days = freedomDaysToTrial(state, campaign)
  const remaining = Math.max(0, days - state.progress.freedomDays)
  const next = state.progress.colossiDefeated + 1
  return {
    tone: 'good',
    text: `You're free! Stay free ${remaining} more day${remaining === 1 ? '' : 's'}, and Colossus ${next} will come to test you. Train at the Guild Hall while you wait!`,
    progress: { value: state.progress.freedomDays, max: days, label: `Free for ${state.progress.freedomDays} of ${days} days` },
  }
}

export function ChapterBanner({ state }: { state: GameState }) {
  const [open, setOpen] = useState(false)
  const chapter = CHAPTERS[currentChapter(state)]
  const goal = objective(state)
  const pct = Math.min(100, Math.round((goal.progress.value / goal.progress.max) * 100))
  return (
    <div className={`${styles.banner} ${styles[goal.tone]}`} data-tour="goal">
      <button type="button" className={styles.heading} onClick={() => setOpen((o) => !o)} aria-expanded={open} title="What is this chapter about?">
        <span className={styles.badge}>{chapter.numeral}</span>
        <span className={styles.titles}>
          <span className={styles.chapter}>Chapter {chapter.numeral}</span>
          <span className={styles.name}>
            {chapter.name} <span className={styles.toggle}>{open ? '▴' : '▾'}</span>
          </span>
        </span>
      </button>
      <div className={styles.quest}>
        <p className={styles.objective}>
          <RichText text={goal.text} />
        </p>
        <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={goal.progress.max} aria-valuenow={goal.progress.value} aria-label={goal.progress.label}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          <span className={styles.progressLabel}>
            <RichText text={goal.progress.label} />
          </span>
        </div>
      </div>
      {open && (
        <div className={styles.details}>
          <p>{chapter.theme}</p>
          <p className={styles.hint}>{chapter.hint}</p>
          <p className={styles.market}>At the market: {chapter.market}</p>
        </div>
      )}
    </div>
  )
}
