import type { GameState } from '../../engine/types'
import { passiveIncome } from '../../engine/selectors'
import { campaign } from '../../content/campaign'
import styles from './VictoryScreen.module.css'

// Falling coins: fixed positions so every render looks the same
const COINS = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 0.7) % 6,
  duration: 6 + (i % 5),
  size: 14 + (i % 4) * 4,
}))

export function VictoryScreen({ state, onPlayAgain, onClose }: { state: GameState; onPlayAgain: () => void; onClose: () => void }) {
  const stats = [
    { label: 'Colossi defeated', value: `${state.progress.colossiDefeated} / 7` },
    { label: 'Days in Vessarin', value: state.clock.day.toLocaleString() },
    { label: 'Gold in the vault', value: `${state.finances.gold.toLocaleString()}g` },
    { label: 'Earned every month', value: `${passiveIncome(state).toLocaleString()}g` },
    { label: 'Ventures owned', value: state.finances.assets.length.toLocaleString() },
  ]

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="victory-title">
      <div className={styles.rays} aria-hidden="true" />
      <div className={styles.coins} aria-hidden="true">
        {COINS.map((coin, i) => (
          <span
            key={i}
            className={styles.coin}
            style={{ left: `${coin.left}%`, width: coin.size, height: coin.size, animationDelay: `${coin.delay}s`, animationDuration: `${coin.duration}s` }}
          />
        ))}
      </div>

      <div className={styles.panel}>
        <p className={styles.eyebrow}>The Seventh Colossus Falls</p>
        <h1 id="victory-title" className={styles.title}>
          Victory!
        </h1>
        <p className={styles.subtitle}>
          {state.hero ? `${state.hero.name} the ${campaign.heroClasses?.[state.hero.classId]?.name ?? 'Merchant'}, Legend of Vessarin` : 'You are the Legend of Vessarin'}
        </p>
        <div className={styles.divider} aria-hidden="true">
          ✦ ✦ ✦
        </div>
        <p className={styles.story}>
          {(state.hero && campaign.heroClasses?.[state.hero.classId]?.ending) ??
            'You arrived with a few coins and a lot of nerve. Seven Colossi stood in your way, and you outwitted every one of them. Today every bell in the port rings for you, and merchants will tell your story for a hundred years.'}
        </p>

        <dl className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dd>{stat.value}</dd>
              <dt>{stat.label}</dt>
            </div>
          ))}
        </dl>

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={onPlayAgain}>
            Play again
          </button>
          <button type="button" className={styles.secondary} onClick={onClose}>
            Look at your fortune
          </button>
        </div>
      </div>
    </div>
  )
}
