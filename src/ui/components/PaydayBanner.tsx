import { useEffect } from 'react'
import type { GameState } from '../../engine/types'
import { sfx } from '../sfx'
import styles from './PaydayBanner.module.css'

const SHOW_MS = 2600

// Falling coins: fixed positions so every render looks the same
const COINS = Array.from({ length: 14 }, (_, i) => ({ left: (i * 41) % 100, delay: (i * 0.13) % 1.2 }))

/** The monthly reward made visible: what each venture paid, wages, costs, and the net. */
export function PaydayBanner({ state, net, onClose }: { state: GameState; net: number; onClose: () => void }) {
  useEffect(() => {
    sfx.payday()
    const timer = setTimeout(onClose, SHOW_MS)
    return () => clearTimeout(timer)
  }, [onClose])

  const ventures = state.finances.assets.filter((a) => a.monthlyCashflow !== 0)
  const lines = [
    ...ventures.map((a) => ({ label: a.label, amount: a.monthlyCashflow })),
    ...(state.finances.wages ? [{ label: 'Wages', amount: state.finances.wages }] : []),
    ...(state.finances.monthlyExpenses ? [{ label: 'Living costs', amount: -state.finances.monthlyExpenses }] : []),
  ]

  return (
    <div className={styles.wrap} role="status">
      {net > 0 && (
        <div className={styles.coins} aria-hidden="true">
          {COINS.map((c, i) => (
            <span key={i} className={styles.coin} style={{ left: `${c.left}%`, animationDelay: `${c.delay}s` }} />
          ))}
        </div>
      )}
      <div className={styles.banner} onClick={onClose}>
        <div className={styles.title}>{net >= 0 ? 'Payday!' : 'Month end'}</div>
        <div className={`${styles.net} ${net >= 0 ? styles.gain : styles.loss}`}>
          {net >= 0 ? '+' : '−'}
          {Math.abs(net)}g
        </div>
        {/* Living costs alone are no news; list lines once there's income to show */}
        {lines.length > 1 && (
          <ul className={styles.lines}>
            {lines.slice(0, 6).map((line, i) => (
              <li key={i}>
                <span>{line.label}</span>
                <strong className={line.amount >= 0 ? styles.gain : styles.loss}>
                  {line.amount >= 0 ? '+' : '−'}
                  {Math.abs(line.amount)}g
                </strong>
              </li>
            ))}
            {lines.length > 6 && <li className={styles.more}>…and {lines.length - 6} more</li>}
          </ul>
        )}
      </div>
    </div>
  )
}
