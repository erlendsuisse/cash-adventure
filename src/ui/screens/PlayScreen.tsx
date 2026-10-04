import { useCallback, useEffect, useRef, useState } from 'react'
import { campaign } from '../../content/campaign'
import { Background } from '../components/Background/Background'
import { getCardArtworkPath } from '../artwork'
import { EncounterCard } from '../components/EncounterCard'
import { GuideTour, type TourTab } from '../components/GuideTour'
import { PaydayBanner } from '../components/PaydayBanner'
import { VictoryScreen } from '../components/VictoryScreen'
import { ChapterBanner } from '../components/ChapterBanner'
import { LedgerBar } from '../components/LedgerBar'
import { StatScroll } from '../components/StatScroll'
import { useGame } from '../GameProvider'
import { getCharacterMood } from '../../engine/characterSelectors'
import { currentChapter } from '../../engine/selectors'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import { updateSettings, useSettings } from '../settings'
import styles from './PlayScreen.module.css'

export function PlayScreen() {
  const { state, dispatch, exportSave } = useGame()
  const [seedInput, setSeedInput] = useState('42')
  const [victoryClosed, setVictoryClosed] = useState(false)
  // Narrow screens show one panel at a time, picked from the bottom tab bar
  const [tab, setTab] = useState<TourTab>('story')
  const settings = useSettings()
  // Old Tobias shows new players around once; ⚙️ > How to play brings him back
  const [touring, setTouring] = useState(() => !settings.tourDone && state.seenCardIds.length <= 1)
  const endTour = useCallback(() => {
    setTouring(false)
    updateSettings({ tourDone: true })
  }, [])

  // Payday: spot the economy's payday log entry as it arrives and celebrate it
  const [payday, setPayday] = useState<number | null>(null)
  const seenLog = useRef(state.log.length)
  useEffect(() => {
    const fresh = state.log.slice(Math.min(seenLog.current, state.log.length))
    seenLog.current = state.log.length
    const entry = fresh.findLast((e) => e.text.startsWith('Payday:'))
    if (entry) setPayday(Number(entry.text.match(/-?\d+/)?.[0] ?? 0))
  }, [state.log])
  const closePayday = useCallback(() => setPayday(null), [])

  function startNewGame(seed: number) {
    if (state.status === 'playing' && !window.confirm('Start a new game? Your current game will be lost.')) return
    setVictoryClosed(false)
    setTab('story')
    dispatch({ type: 'restart', seed })
  }

  // Background music by chapter, if the player has it on
  useBackgroundMusic(state, settings.music)

  const card = campaign.cards[state.currentCardId]
  const mood = getCharacterMood(state)

  return (
    <div className={styles.screen}>
      {/* Background layer with fade-in animation */}
      <Background
        cardId={state.currentCardId}
        chapter={card?.chapter}
        ambientChapter={currentChapter(state)}
        mood={mood}
        artworkUrl={card ? getCardArtworkPath(card) : null}
      />

      {/* Minimal top bar with critical info only */}
      <LedgerBar state={state} onShowTour={() => setTouring(true)} />

      {/* Which chapter, what it's about, and what to do right now */}
      <ChapterBanner state={state} />

      {/* Main layout: Left sidebar + Card area + Right sidebar */}
      <div className={styles.mainLayout} data-tab={tab}>
        {/* Left sidebar with character stats and holdings */}
        <div className={styles.sidebar} data-tour="you">
          <StatScroll state={state} />
          <button type="button" className={styles.mobileNewGame} onClick={() => startNewGame(Math.floor(Math.random() * 1_000_000))}>
            New Game
          </button>
        </div>

        {/* Center: Card and narrative */}
        <div className={styles.cardContainer} data-tour="card">
          {state.status === 'won' ? (
            <div className={styles.ending}>
              <h1 className={styles.endingTitle}>Victory!</h1>
              <p>You have overcome all seven Colossi. Vessarin will speak of your name for a hundred years.</p>
              <button type="button" className={styles.endingButton} onClick={() => setVictoryClosed(false)}>
                Show the celebration
              </button>
            </div>
          ) : card ? (
            <EncounterCard
              key={state.currentCardId}
              card={card}
              state={state}
              onChoose={(choiceId) => dispatch({ type: 'choose', choiceId })}
              onAdvance={() => dispatch({ type: 'advance' })}
            />
          ) : (
            <div className={styles.ending}>
              <p>The story has nowhere left to go ({state.currentCardId}).</p>
            </div>
          )}
        </div>

      </div>

      {payday !== null && state.status === 'playing' && !touring && <PaydayBanner state={state} net={payday} onClose={closePayday} />}

      {touring && <GuideTour onTab={setTab} onDone={endTour} />}

      {state.status === 'won' && !victoryClosed && (
        <VictoryScreen
          state={state}
          onPlayAgain={() => startNewGame(Math.floor(Math.random() * 1_000_000))}
          onClose={() => setVictoryClosed(true)}
        />
      )}

      {/* Footer with controls */}
      <div className={styles.footer}>
        <label>
          Seed:{' '}
          <input value={seedInput} onChange={(e) => setSeedInput(e.target.value)} inputMode="numeric" />
        </label>
        <button type="button" onClick={() => startNewGame(Number(seedInput) || 0)}>
          New Game
        </button>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(exportSave())
          }}
        >
          Export Save
        </button>
      </div>
      <nav className={styles.tabBar} aria-label="Game panels">
        {([
          ['you', '🧭', 'You'],
          ['story', '📜', 'Story'],
        ] as const).map(([id, icon, label]) => (
          <button
            key={id}
            type="button"
            className={styles.tab}
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => setTab(id)}
          >
            <span className={styles.tabIcon} aria-hidden="true">
              {icon}
            </span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
