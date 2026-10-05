import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import portrait from '../../assets/guide/old-tobias.webp'
import { RichText } from '../RichText'
import { speak, stopSpeaking } from '../voice'
import styles from './GuideTour.module.css'

export type TourTab = 'story' | 'fortune' | 'guild'

interface Step {
  /** data-tour value of the element to point at; none = centred */
  target?: string
  /** The tab that shows the target (a function when it depends on screen size) */
  tab?: TourTab | (() => TourTab)
  text: string
}

// Short lines a 10-year-old can take in at a glance; numbers stay digits so they show bold.
// Attributes and reputation sit beside the card on wide screens; on phones they're behind a Fortune tile
const statsTab = (): TourTab => (window.matchMedia('(max-width: 700px)').matches ? 'fortune' : 'story')

const STEPS: Step[] = [
  { text: "Welcome to Vessarin! I'm Old Tobias. Along the way you'll have adventures of your own. First, let me show you around - it only takes a minute." },
  { target: 'purse', tab: 'story', text: 'This is your purse. You start with 50 gold. Every choice can add gold or cost you some.' },
  { target: 'goal', tab: 'story', text: 'Your goal: buy ventures - stalls, crews, workshops - that pay you every month. When they pay more than you spend, you are free!' },
  { target: 'card', tab: 'story', text: 'Each card is a moment in your story. Read it, then tap a choice. Bold numbers tell you what it costs or pays.' },
  { target: 'stats', tab: statsTab, text: 'Your skills - Grit, Savvy, Charm and Nerve - help you win dice rolls. Here you also see what the people of Vessarin think of you.' },
  { target: 'fortune', tab: 'fortune', text: 'Fortune shows your road to freedom: what comes in, what goes out, and what you own. Tap any tile to see more, or to visit the moneylender.' },
  { target: 'guild', tab: 'guild', text: 'In the Guild Hall you spend gold on yourself: training, gear and skills. A Colossus can take your ventures, but never these!' },
  { target: 'tabs', tab: 'story', text: 'Grow rich and the 7 Colossi will come to test you, one by one. Tap Adventure to get back to your story.' },
  { target: 'settings', tab: 'story', text: 'Tap here to have every card read aloud, change the sound, see this tour again or start a new game. Good luck, merchant!' },
]

const PAD = 8

export function GuideTour({ onTab, onDone }: { onTab: (tab: TourTab) => void; onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const step = STEPS[index]!
  const last = index === STEPS.length - 1

  const measure = useCallback(() => {
    // The first copy of the target that's actually on screen (some live on two tabs)
    const els = step.target ? [...document.querySelectorAll<HTMLElement>(`[data-tour="${step.target}"]`)] : []
    const r = els.map((el) => el.getBoundingClientRect()).find((box) => box.width > 0 && box.height > 0)
    setRect(r ?? null)
  }, [step.target])

  // Switch tabs first, then measure once the layout has settled
  useLayoutEffect(() => {
    if (step.tab) onTab(typeof step.tab === 'function' ? step.tab() : step.tab)
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
