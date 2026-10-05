import { useEffect, useRef, useState } from 'react'
import type { CheckResult, EffectSummary as Summary, GameState, StoryCard } from '../../engine/types'
import { resolveProse } from '../prose'
import { ContinueIcon } from '../choiceIcon'
import { RichText } from '../RichText'
import { prefersReducedMotion } from '../settings'
import { sfx } from '../sfx'
import { speak, stopSpeaking, voiceSupported } from '../voice'
import { ChoiceList } from './ChoiceList'
import { EffectSummary } from './EffectSummary'
import styles from './EncounterCard.module.css'

export function EncounterCard({
  card,
  state,
  onChoose,
  onAdvance,
}: {
  card: StoryCard
  state: GameState
  onChoose: (choiceId: string) => void
  onAdvance: () => void
}) {
  const paragraphs = resolveProse(card.body, state)
  const outcome = state.pendingOutcome
  const showingOutcome = !!outcome
  // A skill check holds back the outcome until the die has landed
  const [rollLanded, setRollLanded] = useState(!outcome?.checkResult || prefersReducedMotion())
  const [result, setResult] = useState<'pass' | 'fail' | null>(null)

  // The card waits a moment so the new artwork can be enjoyed, then is dealt
  // in; its sound and narration wait for the same moment.
  const [arrived, setArrived] = useState(() => cardArriveMs() === 0)
  useEffect(() => {
    const t = setTimeout(() => {
      setArrived(true)
      sfx.card()
    }, cardArriveMs())
    return () => {
      clearTimeout(t)
      stopSpeaking()
    }
  }, [])

  useEffect(() => {
    setRollLanded(!outcome?.checkResult || prefersReducedMotion())
    setResult(null)
  }, [outcome])

  // What the card did as it arrived (a Colossus taking your ventures, what your perks saved)
  const arrival = state.currentCardId === card.id ? (state.arrivalNotes ?? []) : []
  const spokenText = showingOutcome ? outcome!.text : [card.title, ...paragraphs, ...arrival].filter(Boolean).join('. ')

  // Narrate each card and each outcome as it appears (when narration is on)
  useEffect(() => {
    if (rollLanded && arrived) speak(spokenText)
  }, [spokenText, rollLanded, arrived])

  const outcomeVisible = showingOutcome && rollLanded
  const summary = outcome?.effectSummary
  const acquired = outcomeVisible && (summary?.assetsGained.length ?? 0) > 0
  const lost = outcomeVisible && (summary?.assetsLost.length ?? 0) > 0
  const badNews = outcomeVisible && (result === 'fail' || isSetback(summary))

  useEffect(() => {
    if (acquired) sfx.sparkle()
  }, [acquired])

  // A failed roll already played its own sound
  useEffect(() => {
    if (badNews && result !== 'fail') sfx.bad()
  }, [badNews, result])

  return (
    <div className={styles.wrap}>
      {badNews && <div className={styles.badVignette} aria-hidden="true" />}
      <div
        className={`${styles.card} ${result === 'pass' ? styles.cardPass : ''} ${badNews ? styles.cardBad : ''} ${arrived ? '' : styles.arriving}`}
        style={{ '--arrive': `${cardArriveMs()}ms` } as React.CSSProperties}
      >
        {badNews && (
          <div className={styles.rainCloud} aria-hidden="true">
            🌧️
          </div>
        )}
        <div className={styles.header}>
          {card.title && <h2 className={styles.title}>{card.title}</h2>}
          {voiceSupported() && (
            <button type="button" className={styles.readAloud} onClick={() => speak(spokenText, true)} aria-label="Read this card aloud" title="Read aloud">
              🔊
            </button>
          )}
        </div>
        <div key={showingOutcome ? 'outcome' : 'story'} className={`${styles.body} ${showingOutcome ? styles.flipIn : ''}`}>
          {showingOutcome ? (
            <div>
              {outcome!.checkResult && (
                <RollBreakdown
                  result={outcome!.checkResult}
                  onLanded={(passed) => {
                    setResult(passed ? 'pass' : 'fail')
                    setRollLanded(true)
                  }}
                />
              )}
              {outcomeVisible && (
                <div className={styles.reveal}>
                  {acquired && (
                    <div className={styles.stamp} aria-label="Acquired">
                      Acquired!
                    </div>
                  )}
                  {lost && (
                    <div className={`${styles.stamp} ${styles.stampLost}`} aria-label="Lost">
                      Lost!
                    </div>
                  )}
                  {outcome!.text && (
                    <p>
                      <RichText text={outcome!.text} />
                    </p>
                  )}
                  {outcome!.effectSummary && <EffectSummary summary={outcome!.effectSummary} />}
                </div>
              )}
            </div>
          ) : (
            <>
              {paragraphs.map((text, i) => (
                <p key={i}>
                  <RichText text={text} />
                </p>
              ))}
              {arrival.length > 0 && (
                <div className={styles.arrival}>
                  {arrival.map((text, i) => (
                    <p key={i}>
                      <RichText text={text} />
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        {showingOutcome ? (
          rollLanded && (
            <div className={styles.choices}>
              <button type="button" className={styles.choice} onClick={onAdvance}>
                <span className={styles.choiceIcon} aria-hidden="true">
                  <ContinueIcon size={20} strokeWidth={2} />
                </span>
                <span className={styles.choiceText}>Continue</span>
              </button>
            </div>
          )
        ) : card.choices.length > 0 ? (
          <ChoiceList choices={card.choices} state={state} onChoose={onChoose} />
        ) : card.next ? (
          <div className={styles.choices}>
            <button type="button" className={styles.choice} onClick={onAdvance}>
              <span className={styles.choiceIcon} aria-hidden="true">
                <ContinueIcon size={20} strokeWidth={2} />
              </span>
              <span className={styles.choiceText}>Continue</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

/** Bad news: something was lost and nothing gained in return (buying a venture
 *  or paying for training costs gold but isn't a setback). */
function isSetback(summary: Summary | undefined): boolean {
  if (!summary || summary.assetsGained.length > 0) return false
  if (summary.assetsLost.length > 0) return true
  const stats = Object.values(summary.stats)
  if (stats.some((delta) => delta > 0)) return false
  return summary.gold < 0 || summary.wages < 0 || summary.monthlyExpenses > 0 || stats.some((delta) => delta < 0)
}

const RESULT_TEXT: Record<CheckResult['result'], string> = {
  critSuccess: 'Critical success',
  success: 'Success',
  failure: 'Failure',
  critFailure: 'Critical failure',
}

const ROLL_MS = 1000

/** The pause before a new card is dealt, to enjoy the artwork (the background crossfade takes 1.2s) */
const CARD_ARRIVE_MS = 2000
const cardArriveMs = () => (prefersReducedMotion() ? 0 : CARD_ARRIVE_MS)

/** "A", "A and B", "A, B and C" */
function joinNames(names: string[]): string {
  return names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

/** A die that tumbles, lands on the real roll, then spells the roll out -
 *  including the bonuses reputation earned you. Tap the die to skip. */
function RollBreakdown({ result, onLanded }: { result: CheckResult; onLanded: (passed: boolean) => void }) {
  const passed = result.result === 'success' || result.result === 'critSuccess'
  const [face, setFace] = useState(() => (prefersReducedMotion() ? result.roll : 1 + Math.floor(Math.random() * result.die)))
  const [landed, setLanded] = useState(prefersReducedMotion())
  const landedRef = useRef(landed)

  function land() {
    if (landedRef.current) return
    landedRef.current = true
    setFace(result.roll)
    setLanded(true)
    if (passed) sfx.success()
    else sfx.fail()
    onLanded(passed)
  }

  useEffect(() => {
    if (landed) {
      onLanded(passed)
      return
    }
    sfx.dice()
    const spin = setInterval(() => setFace(1 + Math.floor(Math.random() * result.die)), 70)
    const stop = setTimeout(() => {
      clearInterval(spin)
      land()
    }, ROLL_MS)
    return () => {
      clearInterval(spin)
      clearTimeout(stop)
    }
    // Runs once per roll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.roll}>
      <button
        type="button"
        className={`${styles.die} ${landed ? (passed ? styles.diePass : styles.dieFail) : styles.dieRolling}`}
        onClick={land}
        aria-label={landed ? `Rolled ${result.roll}` : 'Rolling - tap to skip'}
      >
        {face}
      </button>
      {landed ? (
        <div className={styles.rollText}>
          {result.reroll && (
            <span className={styles.rerollNote}>
              {result.reroll.ability}! You rolled a {result.reroll.firstRoll}, then rolled again.{' '}
            </span>
          )}
          <span>
            d{result.die} rolled <strong>{result.roll}</strong> + {result.stat} {result.statMod}
          </span>
          {result.bonuses.map((b, i) => (
            <span key={i} className={b.mod >= 0 ? styles.rollBonus : styles.rollPenalty}>
              {b.mod >= 0 ? ' + ' : ' − '}
              {b.reason} {Math.abs(b.mod)}
            </span>
          ))}
          <span>
            {' '}= <strong>{result.total}</strong> vs DC {result.dc}:{' '}
            <strong className={passed ? styles.rollPass : styles.rollFail}>{RESULT_TEXT[result.result]}</strong>
          </span>
          {result.helpedBy && (
            <span className={styles.helpedBy}>
              ✨ Made the difference: {joinNames(result.helpedBy)}!
            </span>
          )}
        </div>
      ) : (
        <div className={styles.rollText}>
          Rolling for <strong>{result.stat}</strong>…
        </div>
      )}
    </div>
  )
}
