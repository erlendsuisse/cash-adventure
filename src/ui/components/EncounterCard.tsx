import type { CheckResult, GameState, StoryCard } from '../../engine/types'
import { resolveProse } from '../prose'
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
  const showingOutcome = !!state.pendingOutcome

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        {card.title && <h2 className={styles.title}>{card.title}</h2>}
        <div className={styles.body}>
          {showingOutcome ? (
            <div>
              {state.pendingOutcome!.checkResult && <RollBreakdown result={state.pendingOutcome!.checkResult} />}
              {state.pendingOutcome!.text && <p>{state.pendingOutcome!.text}</p>}
              {state.pendingOutcome!.effectSummary && (
                <EffectSummary summary={state.pendingOutcome!.effectSummary} />
              )}
            </div>
          ) : (
            paragraphs.map((text, i) => <p key={i}>{text}</p>)
          )}
        </div>
        {showingOutcome ? (
          <div className={styles.choices}>
            <button type="button" className={styles.choice} onClick={onAdvance}>
              Continue
            </button>
          </div>
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

/** The roll, spelled out - including the bonuses reputation earned you. */
function RollBreakdown({ result }: { result: CheckResult }) {
  const passed = result.result === 'success' || result.result === 'critSuccess'
  return (
    <div className={styles.roll}>
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
        {' '}= {result.total} vs DC {result.dc}: <strong className={passed ? styles.rollPass : styles.rollFail}>{RESULT_TEXT[result.result]}</strong>
      </span>
    </div>
  )
}
