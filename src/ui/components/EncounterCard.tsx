import type { GameState, StoryCard } from '../../engine/types'
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
              <p>{state.pendingOutcome!.text}</p>
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
