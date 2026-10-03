import type { GameState } from '../../engine/types'
import styles from './MarketStrip.module.css'

export function MarketStrip({ state }: { state: GameState }) {
  return (
    <div className={styles.strip}>
      {Object.entries(state.market).map(([sector, value]) => (
        <span key={sector} className={styles.sector}>
          {sector}: <span className={value >= 100 ? styles.up : styles.down}>{value}</span>
        </span>
      ))}
    </div>
  )
}
