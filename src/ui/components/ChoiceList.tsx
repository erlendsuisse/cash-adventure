import { isMet } from '../../engine/requirements'
import type { Choice, GameState } from '../../engine/types'
import styles from './EncounterCard.module.css'

export function ChoiceList({ choices, state, onChoose }: { choices: Choice[]; state: GameState; onChoose: (choiceId: string) => void }) {
  return (
    <div className={styles.choices}>
      {choices.map((choice) => {
        const unmet = (choice.requires ?? []).filter((r) => !isMet(r, state))
        if (unmet.length > 0 && !choice.showLockedAs) return null

        const locked = unmet.length > 0
        return (
          <button key={choice.id} type="button" className={styles.choice} disabled={locked} onClick={() => onChoose(choice.id)}>
            {choice.label}
            {locked && choice.showLockedAs ? <span className={styles.reason}>{choice.showLockedAs}</span> : null}
          </button>
        )
      })}
    </div>
  )
}
