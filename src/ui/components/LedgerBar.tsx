import { passiveIncome } from '../../engine/selectors'
import type { GameState } from '../../engine/types'
import styles from './LedgerBar.module.css'

export function LedgerBar({ state }: { state: GameState }) {
  const income = passiveIncome(state)
  const netIncome = income - state.finances.monthlyExpenses

  return (
    <div className={styles.bar}>
      {/* Critical info only - compact display */}
      <div className={styles.group}>
        <span className={styles.label}>Gold</span>
        <span className={styles.value}>{state.finances.gold}</span>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>Wages</span>
        <span className={styles.value}>{state.finances.wages}g/mo</span>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>Net</span>
        <span className={`${styles.value} ${netIncome >= 0 ? styles.positive : styles.negative}`}>
          {netIncome >= 0 ? '+' : ''}{netIncome}g
        </span>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>Day</span>
        <span className={styles.value}>{state.clock.day}</span>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>Colossi</span>
        <span className={styles.value}>{state.progress.colossiDefeated}/7</span>
      </div>
    </div>
  )
}
