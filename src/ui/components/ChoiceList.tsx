import { campaign } from '../../content/campaign'
import { abilityName, effectiveChoice } from '../../engine/hero'
import { isMet } from '../../engine/requirements'
import type { Choice, GameState } from '../../engine/types'
import { choiceIcon } from '../choiceIcon'
import { RichText } from '../RichText'
import styles from './EncounterCard.module.css'

export function ChoiceList({ choices, state, onChoose }: { choices: Choice[]; state: GameState; onChoose: (choiceId: string) => void }) {
  return (
    <div className={styles.choices}>
      {choices.map((choice) => {
        // The choice as this hero sees it: the Silver Tongue's Haggle lowers prices
        const shown = effectiveChoice(choice, state, campaign)
        const unmet = (shown.requires ?? []).filter((r) => !isMet(r, state))
        if (unmet.length > 0 && !choice.showLockedAs) return null

        const locked = unmet.length > 0
        const Icon = choiceIcon(choice, locked)
        const price = (c: typeof choice) => -((c.effects ?? []).find((e) => e.kind === 'gold' && e.delta < 0) as { delta: number } | undefined)?.delta! || 0
        const was = price(choice)
        const now = price(shown)
        const haggled = was > 0 && now !== was
        const label = haggled ? choice.label.replace(`${was}g`, `${now}g`) : choice.label
        const lockedText = haggled ? choice.showLockedAs?.replace(`${was}g`, `${now}g`) : choice.showLockedAs
        return (
          <button key={choice.id} type="button" className={styles.choice} disabled={locked} onClick={() => onChoose(choice.id)}>
            <span className={styles.choiceIcon} aria-hidden="true">
              <Icon size={20} strokeWidth={2} />
            </span>
            <span className={styles.choiceText}>
              <RichText text={label} />
              {haggled && (
                <span className={styles.abilityTag}>
                  {abilityName(state, campaign)}: was {was}g
                </span>
              )}
              {locked && lockedText ? <span className={styles.reason}>{lockedText}</span> : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}
