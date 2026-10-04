import { isMet } from '../../engine/requirements'
import type { Choice, GameState } from '../../engine/types'
import { choiceIcon } from '../choiceIcon'
import { RichText } from '../RichText'
import styles from './EncounterCard.module.css'

export function ChoiceList({ choices, state, onChoose }: { choices: Choice[]; state: GameState; onChoose: (choiceId: string) => void }) {
  return (
    <div className={styles.choices}>
      {choices.map((choice) => {
        const unmet = (choice.requires ?? []).filter((r) => !isMet(r, state))
        if (unmet.length > 0 && !choice.showLockedAs) return null

        const locked = unmet.length > 0
        const Icon = choiceIcon(choice, locked)
        return (
          <button key={choice.id} type="button" className={styles.choice} disabled={locked} onClick={() => onChoose(choice.id)}>
            <span className={styles.choiceIcon} aria-hidden="true">
              <Icon size={20} strokeWidth={2} />
            </span>
            <span className={styles.choiceText}>
              <RichText text={choice.label} />
              {locked && choice.showLockedAs ? <span className={styles.reason}>{choice.showLockedAs}</span> : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}
