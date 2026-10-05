import { useEffect, useRef, useState } from 'react'
import { Compass, Gem, Landmark } from 'lucide-react'
import type { GameState } from '../../engine/types'
import type { TourTab } from './GuideTour'
import { prefersReducedMotion, updateSettings, useSettings } from '../settings'
import { sfx } from '../sfx'
import { stopSpeaking, voiceSupported } from '../voice'
import styles from './LedgerBar.module.css'

const COUNT_MS = 700

interface Floater {
  id: number
  delta: number
}

const TABS: { id: TourTab; label: string; Icon: typeof Compass }[] = [
  { id: 'story', label: 'Adventure', Icon: Compass },
  { id: 'fortune', label: 'Fortune', Icon: Gem },
  { id: 'guild', label: 'Guild Hall', Icon: Landmark },
]

/** The top bar: your purse, the three pages of the game, and ⚙️ for settings. */
export function LedgerBar({ state, tab, onTab, onShowTour, onNewGame }: { state: GameState; tab: TourTab; onTab: (tab: TourTab) => void; onShowTour: () => void; onNewGame: () => void }) {
  const gold = state.finances.gold
  const shownGold = useCountUp(gold, state.clock.day)
  const purseRef = useRef<HTMLDivElement>(null)
  const [floaters, setFloaters] = useState<Floater[]>([])
  const [bump, setBump] = useState(0)
  const previous = useRef({ gold, day: state.clock.day })

  // React to every change in gold: sound, a floating "+25g", a purse bounce and coins flying in
  useEffect(() => {
    const before = previous.current
    previous.current = { gold, day: state.clock.day }
    const delta = gold - before.gold
    // A new game resets the clock; that isn't income
    if (delta === 0 || state.clock.day < before.day) return

    if (delta > 0) sfx.coins(Math.ceil(Math.log10(delta + 1) * 2))
    else sfx.spend()
    if (prefersReducedMotion()) return

    const id = Date.now() + Math.random()
    setFloaters((list) => [...list, { id, delta }])
    setTimeout(() => setFloaters((list) => list.filter((f) => f.id !== id)), 1400)
    setBump((n) => (delta > 0 ? Math.abs(n) + 1 : -(Math.abs(n) + 1))) // sign picks bounce or shake
    const coins = Math.min(8, 2 + Math.floor(Math.log10(Math.abs(delta) + 1) * 2))
    if (purseRef.current) (delta > 0 ? flyCoins : dropCoins)(purseRef.current, coins)
  }, [gold, state.clock.day])

  return (
    <div className={styles.bar}>
      <div
        ref={purseRef}
        key={bump}
        className={`${styles.group} ${styles.purse} ${bump > 0 ? styles.purseBump : bump < 0 ? styles.purseShake : ''}`}
        title="Gold in your purse"
        data-tour="purse"
      >
        <span className={styles.purseIcon} aria-hidden="true">
          💰
        </span>
        <span className={styles.label}>Gold</span>
        <span className={styles.value}>{shownGold}g</span>
        {floaters.map((f) => (
          <span key={f.id} className={`${styles.floater} ${f.delta > 0 ? styles.floaterGain : styles.floaterLoss}`} aria-hidden="true">
            {f.delta > 0 ? '+' : '−'}
            {Math.abs(f.delta)}g
          </span>
        ))}
      </div>
      <nav className={styles.tabs} aria-label="Game pages" data-tour="tabs">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} type="button" className={styles.tab} aria-current={tab === id ? 'page' : undefined} onClick={() => onTab(id)} data-tour={`tab-${id}`}>
            <Icon className={styles.tabIcon} size={20} strokeWidth={2} aria-hidden="true" />
            <span className={styles.tabLabel}>{label}</span>
          </button>
        ))}
      </nav>
      <SettingsMenu onShowTour={onShowTour} onNewGame={onNewGame} />
    </div>
  )
}

/** The shown number glides to the real one instead of jumping. */
function useCountUp(target: number, resetKey: number): number {
  const [shown, setShown] = useState(target)
  const from = useRef(target)
  const lastReset = useRef(resetKey)

  useEffect(() => {
    const restarted = resetKey < lastReset.current
    lastReset.current = resetKey
    if (restarted || prefersReducedMotion()) {
      from.current = target
      setShown(target)
      return
    }
    const start = performance.now()
    const startValue = from.current
    let frame = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = Math.round(startValue + (target - startValue) * eased)
      from.current = value
      setShown(value)
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
    // resetKey only matters when target changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return shown
}

/** A few gold coins arc from the middle of the screen into the purse. */
function flyCoins(purse: HTMLElement, count: number) {
  const target = purse.getBoundingClientRect()
  const endX = target.left + 22
  const endY = target.top + target.height / 2
  for (let i = 0; i < count; i++) {
    const coin = document.createElement('span')
    coin.className = styles.flyingCoin!
    document.body.appendChild(coin)
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 160
    const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 100
    const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 120
    const midY = Math.min(startY, endY) - 60 - Math.random() * 80
    const animation = coin.animate(
      [
        { transform: `translate(${startX}px, ${startY}px) scale(0.6)`, opacity: 0 },
        { transform: `translate(${midX}px, ${midY}px) scale(1.1)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${endX}px, ${endY}px) scale(0.5)`, opacity: 0.9 },
      ],
      { duration: 650 + i * 70, delay: i * 60, easing: 'cubic-bezier(0.4, 0, 0.6, 1)', fill: 'both' },
    )
    animation.onfinish = () => coin.remove()
  }
}

/** Losing gold: a few coins tumble out of the purse and fall away. */
function dropCoins(purse: HTMLElement, count: number) {
  const from = purse.getBoundingClientRect()
  for (let i = 0; i < count; i++) {
    const coin = document.createElement('span')
    coin.className = `${styles.flyingCoin} ${styles.lostCoin}`
    document.body.appendChild(coin)
    const startX = from.left + 22 + (Math.random() - 0.5) * 16
    const startY = from.top + from.height / 2
    const endX = startX + (Math.random() - 0.3) * 140
    const endY = startY + 160 + Math.random() * 120
    const animation = coin.animate(
      [
        { transform: `translate(${startX}px, ${startY}px) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${(startX + endX) / 2}px, ${startY - 30}px) rotate(180deg)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${endX}px, ${endY}px) rotate(540deg)`, opacity: 0 },
      ],
      { duration: 800 + i * 60, delay: i * 50, easing: 'cubic-bezier(0.5, 0, 0.9, 0.6)', fill: 'both' },
    )
    animation.onfinish = () => coin.remove()
  }
}

/** ⚙️ in the top bar: sound, music, narration, replaying the guide's tour, and starting over. */
function SettingsMenu({ onShowTour, onNewGame }: { onShowTour: () => void; onNewGame: () => void }) {
  const settings = useSettings()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const toggles: { key: 'sound' | 'music' | 'voice'; icon: string; label: string; show: boolean }[] = [
    { key: 'sound', icon: '🔔', label: 'Sound effects', show: true },
    { key: 'music', icon: '🎵', label: 'Music', show: true },
    { key: 'voice', icon: '🗣️', label: 'Read cards aloud', show: voiceSupported() },
  ]

  return (
    <div className={styles.settings} ref={menuRef} data-tour="settings">
      <button type="button" className={styles.settingsButton} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Settings">
        ⚙️
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          {toggles
            .filter((t) => t.show)
            .map((t) => (
              <button
                key={t.key}
                type="button"
                role="menuitemcheckbox"
                aria-checked={settings[t.key]}
                className={styles.menuItem}
                onClick={() => {
                  if (t.key === 'voice' && settings.voice) stopSpeaking()
                  updateSettings({ [t.key]: !settings[t.key] })
                }}
              >
                <span aria-hidden="true">{t.icon}</span>
                <span className={styles.menuLabel}>{t.label}</span>
                <span className={`${styles.switch} ${settings[t.key] ? styles.switchOn : ''}`} aria-hidden="true" />
              </button>
            ))}
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => {
              setOpen(false)
              onShowTour()
            }}
          >
            <span aria-hidden="true">❓</span>
            <span className={styles.menuLabel}>How to play</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => {
              setOpen(false)
              onNewGame()
            }}
          >
            <span aria-hidden="true">🌅</span>
            <span className={styles.menuLabel}>New game</span>
          </button>
        </div>
      )}
    </div>
  )
}
