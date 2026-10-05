import { useCallback, useEffect, useRef, useState } from 'react'
import { campaign } from '../../content/campaign'
import { Background } from '../components/Background/Background'
import { getCardArtworkPath } from '../artwork'
import { CreationScreen } from '../components/CreationScreen'
import { EncounterCard } from '../components/EncounterCard'
import { GuideTour, type TourTab } from '../components/GuideTour'
import { PaydayBanner } from '../components/PaydayBanner'
import { VictoryScreen } from '../components/VictoryScreen'
import { ChapterBanner } from '../components/ChapterBanner'
import { LedgerBar } from '../components/LedgerBar'
import { StatScroll } from '../components/StatScroll'
import { FortunePage } from '../components/FortunePage'
import { GuildHall } from '../components/GuildHall'
import { useGame } from '../GameProvider'
import { getCharacterMood } from '../../engine/characterSelectors'
import { currentChapter } from '../../engine/selectors'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import { useGuildNudge } from '../hooks/useGuildNudge'
import { updateSettings, useSettings } from '../settings'
import styles from './PlayScreen.module.css'

const randomSeed = () => Math.floor(Math.random() * 1_000_000)

export function PlayScreen() {
  const { state, dispatch } = useGame()
  const [victoryClosed, setVictoryClosed] = useState(false)
  // One page at a time, picked in the top bar: Adventure, Fortune or Guild Hall
  const [tab, setTab] = useState<TourTab>('story')
  const settings = useSettings()
  // A new game starts with creating a hero (saves from before heroes keep playing without one)
  const fresh = state.seenCardIds.length <= 1 && state.clock.day === 0
  const creatingHero = !state.hero && fresh && !!campaign.heroClasses
  // Then Old Tobias's tour (Skip ends it); ⚙️ > How to play brings him back
  const [touring, setTouring] = useState(() => fresh && !!state.hero)
  const heroName = state.hero?.name
  const hadHero = useRef(!!heroName)
  useEffect(() => {
    if (heroName && !hadHero.current) setTouring(true)
    hadHero.current = !!heroName
  }, [heroName])
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
    setTouring(false) // the tour follows character creation
    dispatch({ type: 'restart', seed })
  }

  // Point new players at the Guild Hall when there's something they can afford
  const nudge = useGuildNudge(state, tab, touring || creatingHero || payday !== null)

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
      <LedgerBar
        state={state}
        tab={tab}
        onTab={setTab}
        onShowTour={() => setTouring(true)}
        onNewGame={() => startNewGame(randomSeed())}
        guildBadge={nudge.badge}
        guildTip={nudge.tip}
        onTipClose={nudge.dismissTip}
      />

      {/* Which chapter, what it's about, and what to do right now (the Fortune page shows the same, bigger) */}
      {tab === 'story' && <ChapterBanner state={state} />}

      <div className={styles.mainLayout} data-tab={tab}>
        {/* Story tab, wide screens: attributes and reputation beside the card */}
        <div className={styles.sidebar} data-tour="stats">
          <StatScroll state={state} />
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

        {/* Fortune: your money at a glance. Guild Hall: spend it on yourself. */}
        {tab === 'fortune' && (
          <div className={styles.page}>
            <FortunePage state={state} />
          </div>
        )}
        {tab === 'guild' && (
          <div className={styles.page}>
            <GuildHall state={state} />
          </div>
        )}
      </div>

      {payday !== null && state.status === 'playing' && !touring && <PaydayBanner state={state} net={payday} onClose={closePayday} />}

      {creatingHero && <CreationScreen state={state} campaign={campaign} dispatch={dispatch} />}

      {touring && !creatingHero && <GuideTour onTab={setTab} onDone={endTour} />}

      {state.status === 'won' && !victoryClosed && (
        <VictoryScreen
          state={state}
          onPlayAgain={() => startNewGame(randomSeed())}
          onClose={() => setVictoryClosed(true)}
        />
      )}

    </div>
  )
}
