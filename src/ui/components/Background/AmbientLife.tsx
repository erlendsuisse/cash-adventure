import type { ChapterNumber } from '../../../engine/types'
import styles from './AmbientLife.module.css'

// Each chapter's city has its own quiet life drifting over the picture.
// Particles use fixed positions so nothing jumps between renders.
const KIND: Record<ChapterNumber, string> = {
  1: 'fireflies', // lantern-lit harbour
  2: 'embers', // smoky night streets
  3: 'dust', // busy camps and wagons
  4: 'glints', // gold in the bank halls
  5: 'fog', // quiet foggy mornings
  6: 'candles', // whispering courts by candlelight
  7: 'stars', // the sky opening up
}

const COUNT = 16

export function AmbientLife({ chapter }: { chapter: ChapterNumber }) {
  const kind = KIND[chapter]
  if (kind === 'fog') {
    return (
      <div className={styles.ambient} aria-hidden="true">
        <div className={`${styles.fog} ${styles.fogA}`} />
        <div className={`${styles.fog} ${styles.fogB}`} />
      </div>
    )
  }
  return (
    <div className={styles.ambient} aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          className={`${styles.particle} ${styles[kind]}`}
          style={{
            left: `${(i * 61) % 100}%`,
            top: `${(i * 37 + 11) % 100}%`,
            animationDelay: `${-((i * 1.7) % 12)}s`,
            animationDuration: `${9 + (i % 6) * 2}s`,
          }}
        />
      ))}
    </div>
  )
}
