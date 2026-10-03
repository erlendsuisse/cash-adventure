import { useState } from 'react'
import type { LogEntry } from '../../engine/types'
import styles from './LogPanel.module.css'

export function LogPanel({ log }: { log: LogEntry[] }) {
  const [open, setOpen] = useState(false)
  const recent = [...log].reverse().slice(0, 50)

  return (
    <div className={styles.panel}>
      <button type="button" className={styles.toggle} onClick={() => setOpen((v) => !v)}>
        {open ? 'Hide' : 'Show'} chronicle ({log.length})
      </button>
      {open && (
        <div className={styles.entries}>
          {recent.map((entry, i) => (
            <div key={i} className={styles.entry}>
              <span className={styles.day}>d{entry.day}</span>
              <span className={entry.text.includes('vs DC') ? styles.check : undefined}>{entry.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
