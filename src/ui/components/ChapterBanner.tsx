import { useEffect, useRef, useState } from 'react'
import { campaign } from '../../content/campaign'
import { inTrouble } from '../../content/cards/work-opportunities'
import { CHAPTERS } from '../../content/chapters'
import { isMet } from '../../engine/requirements'
import { currentChapter, freedomDaysToTrial, isFree, passiveIncome } from '../../engine/selectors'
import type { GameState } from '../../engine/types'
import portraitTobias from '../../assets/guide/old-tobias.webp'
import { heroPortrait } from '../heroArt'
import { RichText } from '../RichText'
import { prefersReducedMotion } from '../settings'
import { sfx } from '../sfx'
import styles from './ChapterBanner.module.css'

interface Objective {
  text: string
  tone: 'warn' | 'goal' | 'good'
  /** How close you are, shown as a journey along the bar */
  progress: { value: number; max: number; label: string }
  /** What waits at the end of the bar */
  end: { icon: string; label: string }
}

const COUNT = ['no', 'one', 'two', 'three', 'four', 'five']

/** The gap to freedom as a next step: "about one more like your Spice Kiosk!" */
function nextStep(state: GameState, gap: number): string {
  const best = [...state.finances.assets].sort((a, b) => b.monthlyCashflow - a.monthlyCashflow)[0]
  if (!best) return 'Your first venture is the first step!'
  const n = Math.ceil(gap / Math.max(1, best.monthlyCashflow))
  if (n > 5) return `Look for bigger ventures: your ${best.label} pays ${best.monthlyCashflow}g a month.`
  return `About ${COUNT[n]} more like your ${best.label}!`
}

/** What to do right now, from the player's actual situation. */
function objective(state: GameState): Objective {
  const passive = passiveIncome(state)
  const expenses = state.finances.monthlyExpenses
  const income = { value: passive, max: Math.max(1, expenses), label: `Ventures pay ${passive}g of your ${expenses}g monthly costs` }
  const freedom = { icon: '🏰', label: 'Freedom' }
  if (isMet(inTrouble(currentChapter(state)), state)) {
    return { tone: 'warn', text: "You're in the red! Take the work that comes your way, and wait to buy ventures until you earn more than you spend.", progress: income, end: freedom }
  }
  if (!isFree(state)) {
    const gap = expenses - passive
    return { tone: 'goal', text: `Just ${gap}g a month to go, and you're free! ${nextStep(state, gap)}`, progress: income, end: freedom }
  }
  const days = freedomDaysToTrial(state, campaign)
  const remaining = Math.max(0, days - state.progress.freedomDays)
  const next = state.progress.colossiDefeated + 1
  return {
    tone: 'good',
    text: `You're free! Stay free ${remaining} more day${remaining === 1 ? '' : 's'}, and Colossus ${next} will come to test you. Train at the Guild Hall while you wait!`,
    progress: { value: state.progress.freedomDays, max: days, label: `Free for ${state.progress.freedomDays} of ${days} days` },
    end: { icon: '🗿', label: `Colossus ${next}` },
  }
}

const MILESTONES = [25, 50, 75] as const
const CHEERS: Record<(typeof MILESTONES)[number] | 100, string> = {
  25: 'A quarter of the way to freedom! Well done!',
  50: 'Halfway to freedom! Keep going!',
  75: 'Three quarters there! Freedom is in sight!',
  100: "You're free! Your ventures pay for everything!",
}

export function ChapterBanner({ state }: { state: GameState }) {
  const [open, setOpen] = useState(false)
  const chapterNumber = currentChapter(state)
  const chapter = CHAPTERS[chapterNumber]
  const goal = objective(state)
  const pct = Math.min(100, Math.round((goal.progress.value / goal.progress.max) * 100))
  const passive = passiveIncome(state)
  const portrait = state.hero ? heroPortrait(state.hero.classId, state.hero.look) : undefined

  // Celebrate crossing a milestone on the road to freedom (once per milestone per chapter)
  const [cheer, setCheer] = useState<{ key: number; text: string } | null>(null)
  const reached = useRef<{ chapter: number; best: number } | null>(null)
  const freedomPct = Math.min(100, Math.round((passive / Math.max(1, state.finances.monthlyExpenses)) * 100))
  useEffect(() => {
    const before = reached.current
    if (!before || before.chapter !== chapterNumber) {
      // First look at this chapter: remember where we are, don't celebrate the past
      reached.current = { chapter: chapterNumber, best: freedomPct }
      return
    }
    if (freedomPct <= before.best) return
    const crossed = [...MILESTONES, 100 as const].filter((m) => before.best < m && freedomPct >= m).pop()
    reached.current = { chapter: chapterNumber, best: freedomPct }
    if (!crossed) return
    sfx.sparkle()
    setCheer({ key: Date.now(), text: CHEERS[crossed] })
  }, [freedomPct, chapterNumber])
  useEffect(() => {
    if (!cheer) return
    const t = setTimeout(() => setCheer(null), 4000)
    return () => clearTimeout(t)
  }, [cheer])

  // A new venture: a "+12g/mo" chip flies into the bar
  const [gain, setGain] = useState<{ key: number; amount: number } | null>(null)
  const lastPassive = useRef(passive)
  const lastChapter = useRef(chapterNumber)
  useEffect(() => {
    const delta = passive - lastPassive.current
    const sameChapter = lastChapter.current === chapterNumber
    lastPassive.current = passive
    lastChapter.current = chapterNumber
    if (delta > 0 && sameChapter && !prefersReducedMotion()) setGain({ key: Date.now(), amount: delta })
  }, [passive, chapterNumber])

  return (
    <div className={`${styles.banner} ${styles[goal.tone]} ${cheer ? styles.glow : ''}`} data-tour="goal">
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

        {/* The road: your hero walks the gold toward freedom (or the next Colossus) */}
        <div className={styles.road}>
          <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={goal.progress.max} aria-valuenow={goal.progress.value} aria-label={goal.progress.label}>
            <div className={styles.fill} style={{ width: `${pct}%` }} />
            {goal.tone !== 'good' &&
              MILESTONES.map((m) => <span key={m} className={`${styles.milestone} ${pct >= m ? styles.milestoneLit : ''}`} style={{ left: `${m}%` }} aria-hidden="true" />)}
            <span className={styles.amount} aria-hidden="true">
              {goal.tone === 'good' ? `${goal.progress.value}/${goal.progress.max} days` : `${goal.progress.value}/${goal.progress.max}g`}
            </span>
            <span className={styles.walker} style={{ left: `${Math.max(4, Math.min(96, pct))}%` }} aria-hidden="true">
              {portrait ? <img src={portrait} alt="" /> : '🧭'}
              {gain && (
                <span key={gain.key} className={styles.gain} onAnimationEnd={() => setGain(null)}>
                  +{gain.amount}g/mo
                </span>
              )}
            </span>
          </div>
          <span className={styles.end} title={goal.end.label}>
            <span className={styles.endIcon} aria-hidden="true">
              {goal.end.icon}
            </span>
            <span className={styles.endLabel}>{goal.end.label}</span>
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
      {cheer && (
        <div key={cheer.key} className={styles.cheer} role="status">
          <img src={portraitTobias} alt="" className={styles.cheerPortrait} />
          <span>
            <strong>Old Tobias:</strong> {cheer.text}
          </span>
        </div>
      )}
    </div>
  )
}
