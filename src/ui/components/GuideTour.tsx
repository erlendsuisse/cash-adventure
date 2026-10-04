import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import portrait from '../../assets/guide/old-tobias.webp'
import { RichText } from '../RichText'
import { speak, stopSpeaking } from '../voice'
import styles from './GuideTour.module.css'

export type TourTab = 'you' | 'story'

interface Step {
  /** data-tour value of the element to point at; none = centred */
  target?: string
  /** On narrow screens, the tab that shows the target */
  tab?: TourTab
  text: string
}

// Short lines a 10-year-old can take in at a glance; numbers stay digits so they show bold.
const STEPS: Step[] = [
  { text: "Welcome to Vessarin! I'm Old Tobias. Let me show you around - it only takes a minute." },
  { target: 'purse', text: 'This is your purse. You start with 50 gold. Every choice can add gold or cost you some.' },
  { target: 'goal', text: 'Your goal: buy ventures - stalls, crews, workshops - that pay you every month. When they pay more than you spend, you are free!' },
  { target: 'net', text: 'Net is what your ventures earn each month minus your living costs. Wages from work are not counted - when Net turns green, you are free!' },
  { target: 'card', tab: 'story', text: 'Each card is a moment in your story. Read it, then tap a choice. Bold numbers tell you what it costs or pays.' },
  { target: 'you', tab: 'you', text: 'Here are your skills - Grit, Savvy, Charm and Nerve. They help you win dice rolls. Your ventures and monthly money are here too.' },
  { target: 'colossi', tab: 'story', text: 'Grow rich and the 7 Colossi will come to test you, one by one. Beat all 7 to become a legend!' },
  { target: 'settings', tab: 'story', text: 'I read every card aloud for you. Tap here to turn me off, change the sound, or see this tour again. Good luck, merchant!' },
]

const PAD = 8

export function GuideTour({ onTab, onDone }: { onTab: (tab: TourTab) => void; onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const step = STEPS[index]!
  const last = index === STEPS.length - 1

  const measure = useCallback(() => {
    const el = step.target ? document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`) : null
    const r = el?.getBoundingClientRect()
    setRect(r && r.width > 0 && r.height > 0 ? r : null)
  }, [step.target])

  // Switch tabs first (narrow screens), then measure once the layout has settled
  useLayoutEffect(() => {
    if (step.tab) onTab(step.tab)
    const frame = requestAnimationFrame(() => requestAnimationFrame(measure))
    return () => cancelAnimationFrame(frame)
  }, [step.tab, measure, onTab])

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  useEffect(() => {
    speak(step.text)
  }, [step.text])

  function finish() {
    stopSpeaking()
    onTab('story')
    onDone()
  }

  // Put the bubble below the highlighted thing when it's in the top half of the screen, else above
  const bubbleStyle: React.CSSProperties = {}
  if (rect) {
    const tall = rect.height > window.innerHeight * 0.45
    const below = rect.top + rect.height / 2 < window.innerHeight / 2
    if (tall) bubbleStyle.bottom = 16 // a whole panel is lit up: sit on top of its lower part
    else if (below) bubbleStyle.top = Math.min(rect.bottom + PAD + 12, window.innerHeight - 240)
    else bubbleStyle.bottom = Math.max(window.innerHeight - rect.top + PAD + 12, 12)
  }

  return (
    <div className={styles.tour} role="dialog" aria-modal="true" aria-label="How to play">
      {rect ? (
        <div
          className={styles.spotlight}
          style={{ left: rect.left - PAD, top: rect.top - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }}
        />
      ) : (
        <div className={styles.dim} />
      )}

      <div className={`${styles.bubble} ${rect ? '' : styles.centered}`} style={bubbleStyle} key={index}>
        <img src={portrait} alt="" className={styles.portrait} />
        <div className={styles.content}>
          <div className={styles.name}>Old Tobias</div>
          <p className={styles.text}>
            <RichText text={step.text} />
          </p>
          <div className={styles.controls}>
            <div className={styles.dots} aria-hidden="true">
              {STEPS.map((_, i) => (
                <span key={i} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
              ))}
            </div>
            {!last && (
              <button type="button" className={styles.skip} onClick={finish}>
                Skip
              </button>
            )}
            {index > 0 && (
              <button type="button" className={styles.secondary} onClick={() => setIndex((i) => i - 1)}>
                Back
              </button>
            )}
            <button type="button" className={styles.primary} onClick={() => (last ? finish() : setIndex((i) => i + 1))}>
              {last ? "Let's go!" : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
