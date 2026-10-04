import { useEffect, useRef, useState } from 'react'
import type { CheckResult, GameState, StoryCard } from '../../engine/types'
import { resolveProse } from '../prose'
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

  useEffect(() => {
    sfx.card()
    return () => stopSpeaking()
  }, [])

  useEffect(() => {
    setRollLanded(!outcome?.checkResult || prefersReducedMotion())
    setResult(null)
  }, [outcome])

  const spokenText = showingOutcome ? outcome!.text : [card.title, ...paragraphs].filter(Boolean).join('. ')

  // Narrate each card and each outcome as it appears (when narration is on)
  useEffect(() => {
    if (rollLanded) speak(spokenText)
  }, [spokenText, rollLanded])

  const outcomeVisible = showingOutcome && rollLanded
  const acquired = outcomeVisible && (outcome!.effectSummary?.assetsGained.length ?? 0) > 0

  useEffect(() => {
    if (acquired) sfx.sparkle()
  }, [acquired])

  return (
    <div className={styles.wrap}>
      <div className={`${styles.card} ${result === 'pass' ? styles.cardPass : ''} ${result === 'fail' ? styles.cardFail : ''}`}>
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
            paragraphs.map((text, i) => (
              <p key={i}>
                <RichText text={text} />
              </p>
            ))
          )}
        </div>
        {showingOutcome ? (
          rollLanded && (
            <div className={styles.choices}>
              <button type="button" className={styles.choice} onClick={onAdvance}>
                Continue
              </button>
            </div>
          )
        ) : card.choices.length > 0 ? (
          <ChoiceList choices={card.choices} state={state} onChoose={onChoose} />
        ) : card.next ? (
          <div className={styles.choices}>
            <button type="button" className={styles.choice} onClick={onAdvance}>
              Continue
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const RESULT_TEXT: Record<CheckResult['result'], string> = {
  critSuccess: 'Critical success',
  success: 'Success',
  failure: 'Failure',
  critFailure: 'Critical failure',
}

const ROLL_MS = 1000

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
        </div>
      ) : (
        <div className={styles.rollText}>
          Rolling for <strong>{result.stat}</strong>…
        </div>
      )}
    </div>
  )
}
