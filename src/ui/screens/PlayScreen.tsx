import { useState } from 'react'
import { campaign } from '../../content/campaign'
import { Background } from '../components/Background/Background'
import { EncounterCard } from '../components/EncounterCard'
import { LedgerBar } from '../components/LedgerBar'
import { StatScroll } from '../components/StatScroll'
import { Portfolio } from '../components/Portfolio'
import { useGame } from '../GameProvider'
import { getCharacterMood } from '../../engine/characterSelectors'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import styles from './PlayScreen.module.css'

export function PlayScreen() {
  const { state, dispatch, exportSave } = useGame()
  const [seedInput, setSeedInput] = useState('42')

  // Background music playback based on story phase
  useBackgroundMusic(state)

  const card = campaign.cards[state.currentCardId]
  const mood = getCharacterMood(state)

  return (
    <div className={styles.screen}>
      {/* Background layer with fade-in animation */}
      <Background cardId={state.currentCardId} mood={mood} />

      {/* Minimal top bar with critical info only */}
      <LedgerBar state={state} />

      {/* Main layout: Left sidebar + Card area + Right sidebar */}
      <div className={styles.mainLayout}>
        {/* Left sidebar with character stats and holdings */}
        <div className={styles.sidebar}>
          <StatScroll state={state} />
        </div>

        {/* Center: Card and narrative */}
        <div className={styles.cardContainer}>
          {state.status === 'won' ? (
            <div className={styles.ending}>
              <h1>Victory</h1>
              <p>You have overcome all seven Colossi. Vessarin will speak of this for a generation.</p>
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

        {/* Right sidebar with portfolio and commodities */}
        <div className={styles.rightSidebar}>
          <Portfolio state={state} />
        </div>
      </div>

      {/* Footer with controls */}
      <div className={styles.footer}>
        <label>
          Seed:{' '}
          <input value={seedInput} onChange={(e) => setSeedInput(e.target.value)} inputMode="numeric" />
        </label>
        <button type="button" onClick={() => dispatch({ type: 'restart', seed: Number(seedInput) || 0 })}>
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
    </div>
  )
}
