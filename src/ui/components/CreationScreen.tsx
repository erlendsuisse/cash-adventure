import { useEffect, useState } from 'react'
import { keptScore, scoreToStat, STAT_ORDER } from '../../engine/hero'
import type { Action, Campaign, GameState, HeroLook, StatId } from '../../engine/types'
import { heroIcon, heroPortrait } from '../heroArt'
import { prefersReducedMotion } from '../settings'
import { sfx } from '../sfx'
import { speak } from '../voice'
import styles from './CreationScreen.module.css'

const STAT_INFO: Record<StatId, { label: string; text: string }> = {
  grit: { label: 'Grit', text: 'toughness: holding on when things get hard' },
  savvy: { label: 'Savvy', text: 'cleverness with numbers and deals' },
  charm: { label: 'Charm', text: 'making friends and talking people round' },
  nerve: { label: 'Nerve', text: 'courage, bluffing and taking risks' },
}

const NAMES = ['Ada', 'Bram', 'Cora', 'Dex', 'Elsie', 'Finn', 'Greta', 'Hugo', 'Ivy', 'Jasper', 'Kit', 'Lena', 'Milo', 'Nell', 'Otto', 'Pia', 'Quinn', 'Rosa', 'Sam', 'Tilda', 'Ulf', 'Vera', 'Wren', 'Zoe']

type Step = 'class' | 'background' | 'roll' | 'name'

/** Choosing a class and background, rolling stats (with one swap), and naming the hero. */
export function CreationScreen({ state, campaign, dispatch }: { state: GameState; campaign: Campaign; dispatch: (action: Action) => void }) {
  const classes = Object.values(campaign.heroClasses ?? {})
  const backgrounds = Object.values(campaign.backgrounds ?? {})
  const [step, setStep] = useState<Step>('class')
  const [classId, setClassId] = useState<string | null>(null)
  const [backgroundId, setBackgroundId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [swapFrom, setSwapFrom] = useState<StatId | null>(null)
  const [swapped, setSwapped] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [look, setLook] = useState<HeroLook>('female')

  const heroClass = classId ? campaign.heroClasses?.[classId] : undefined

  // Read each step's question aloud, for players still learning to read
  useEffect(() => {
    const chosen = heroClass ? `${heroClass.name}! ${heroClass.ability.name}: ${heroClass.ability.text} ` : ''
    speak({ class: 'Who will you be? Pick a hero.', background: `${chosen}Where did you grow up?`, roll: 'Roll for your stats!', name: 'What is your name?' }[step])
    // Only when the step changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])
  const background = backgroundId ? campaign.backgrounds?.[backgroundId] : undefined
  const rolls = state.creation?.rolls

  /** Picking a hero is the whole step: on to where they grew up (Back changes it) */
  function chooseClass(id: string) {
    setClassId(id)
    sfx.card()
    setStep('background')
  }

  function roll() {
    sfx.dice()
    dispatch({ type: 'rollStats' })
    if (!prefersReducedMotion()) {
      setRolling(true)
      setTimeout(() => setRolling(false), 1100)
    }
  }

  function tapStat(stat: StatId) {
    if (swapped || rolling) return
    if (!swapFrom) return setSwapFrom(stat)
    if (swapFrom !== stat) {
      dispatch({ type: 'swapStats', a: swapFrom, b: stat })
      setSwapped(true)
      sfx.card()
    }
    setSwapFrom(null)
  }

  function begin() {
    if (!classId || !backgroundId) return
    sfx.sparkle()
    dispatch({ type: 'createHero', name: name.trim() || heroClass!.name, classId, backgroundId, look })
  }

  // Bonuses the class and background add on top of the dice, per stat
  const bonus = (stat: StatId) =>
    (heroClass?.mainStat === stat ? 2 : 0) +
    (heroClass?.secondStat === stat ? 1 : 0) +
    (background?.start ?? []).reduce((sum, e) => (e.kind === 'stat' && e.stat === stat ? sum + e.delta : sum), 0)

  return (
    <div className={styles.screen}>
      <div className={styles.panel}>
        <div className={styles.steps} aria-hidden="true">
          {(['class', 'background', 'roll', 'name'] as Step[]).map((s, i) => (
            <span key={s} className={`${styles.stepDot} ${s === step ? styles.stepActive : ''}`}>
              {i + 1}
            </span>
          ))}
        </div>

        {step === 'class' && (
          <>
            <h1 className={styles.title}>Who will you be?</h1>
            <p className={styles.lead}>Every hero makes their fortune in their own way, and lives their own adventure.</p>
            <div className={styles.lookToggle} role="radiogroup" aria-label="Lass or lad">
              {(['female', 'male'] as HeroLook[]).map((l) => {
                const face = heroPortrait(classes[0]!.id, l)
                return (
                  <button key={l} type="button" role="radio" aria-checked={look === l} className={`${styles.lookButton} ${look === l ? styles.lookActive : ''}`} onClick={() => setLook(l)}>
                    {face && <img src={face} alt="" className={styles.lookFace} />}
                    {l === 'female' ? 'Lass' : 'Lad'}
                  </button>
                )
              })}
            </div>
            <div className={styles.classGrid}>
              {classes.map((c) => {
                const Icon = heroIcon(c.id)
                const portrait = heroPortrait(c.id, look)
                return (
                  <button key={c.id} type="button" className={`${styles.classCard} ${classId === c.id ? styles.selected : ''}`} onClick={() => chooseClass(c.id)} aria-pressed={classId === c.id}>
                    <span className={styles.portrait}>{portrait ? <img src={portrait} alt="" /> : <Icon size={34} strokeWidth={1.8} />}</span>
                    <span className={styles.className}>{c.name}</span>
                    <span className={styles.cousin}>like a {c.cousin}</span>
                    <span className={styles.tileTagline}>{c.tagline}</span>
                  </button>
                )
              })}
            </div>
            <p className={styles.detailHint}>Tap a hero to choose them.</p>
          </>
        )}

        {step === 'background' && heroClass && (
          <>
            <h1 className={styles.title}>Where did you grow up?</h1>
            <div className={styles.chosen}>
              <span className={styles.chosenPortrait}>{heroPortrait(heroClass.id, look) ? <img src={heroPortrait(heroClass.id, look)} alt="" /> : null}</span>
              <span>
                <strong className={styles.chosenName}>{heroClass.name}</strong> <span className={styles.cousin}>like a {heroClass.cousin}</span>
                <span className={styles.chosenAbility}>
                  <strong>{heroClass.ability.name}:</strong> {heroClass.ability.text} Best at {STAT_INFO[heroClass.mainStat].label} and {STAT_INFO[heroClass.secondStat].label}.
                </span>
              </span>
            </div>
            <p className={styles.lead}>Your past gives you a head start.</p>
            <div className={styles.backgroundList}>
              {backgrounds.map((b) => (
                <button key={b.id} type="button" className={`${styles.backgroundCard} ${backgroundId === b.id ? styles.selected : ''}`} onClick={() => { setBackgroundId(b.id); speak(`${b.name}. ${b.text}`) }} aria-pressed={backgroundId === b.id}>
                  <span className={styles.className}>{b.name}</span>
                  <span className={styles.tagline}>{b.text}</span>
                </button>
              ))}
            </div>
            <div className={styles.nav}>
              <button type="button" className={styles.secondary} onClick={() => setStep('class')}>
                Back
              </button>
              <button type="button" className={styles.primary} disabled={!backgroundId} onClick={() => setStep('roll')}>
                Next
              </button>
            </div>
          </>
        )}

        {step === 'roll' && heroClass && (
          <>
            <h1 className={styles.title}>Roll for your stats!</h1>
            <p className={styles.lead}>
              {rolls
                ? swapped
                  ? 'Your hero is ready. Higher is better in every stat.'
                  : 'You keep the best 3 dice of 4. Want to swap two stats? Tap one, then another. You get one swap.'
                : 'For each stat you roll 4 dice and keep the best 3. Then your class and background add their bonuses.'}
            </p>
            {!rolls && (
              <button type="button" className={styles.bigRoll} onClick={roll}>
                <span className={styles.bigRollDice} aria-hidden="true">
                  🎲🎲
                </span>
                Roll the dice!
              </button>
            )}
            <div className={styles.statList}>
              {STAT_ORDER.map((stat, i) => {
                const dice = rolls?.[i]
                const score = dice ? keptScore(dice) : undefined
                const lowest = dice ? dice.indexOf(Math.min(...dice)) : -1
                return (
                  <button
                    key={stat}
                    type="button"
                    className={`${styles.statRow} ${swapFrom === stat ? styles.swapPick : ''}`}
                    onClick={() => tapStat(stat)}
                    disabled={!rolls || swapped || rolling}
                  >
                    <span className={styles.statName}>
                      {STAT_INFO[stat].label}
                      <span className={styles.statText}>{STAT_INFO[stat].text}</span>
                    </span>
                    <span className={styles.dice}>
                      {[0, 1, 2, 3].map((d) => (
                        <span key={d} className={`${styles.die} ${rolling ? styles.dieRolling : ''} ${!rolling && d === lowest ? styles.dieDropped : ''}`}>
                          {dice ? (rolling ? '?' : dice[d]) : ''}
                        </span>
                      ))}
                    </span>
                    <span className={styles.statValue}>
                      {score !== undefined && !rolling ? (
                        <>
                          <span className={styles.score}>{score}</span>
                          <span className={styles.arrow}>→</span>
                          <strong className={styles.final}>{scoreToStat(score) + bonus(stat)}</strong>
                          {bonus(stat) > 0 && <span className={styles.bonus}>incl. +{bonus(stat)}</span>}
                        </>
                      ) : (
                        <span className={styles.score}>{bonus(stat) > 0 ? `+${bonus(stat)}` : ''}</span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className={styles.nav}>
              <button type="button" className={styles.secondary} onClick={() => setStep('background')} disabled={!!rolls}>
                Back
              </button>
              {rolls && (
                <button type="button" className={styles.primary} onClick={() => setStep('name')} disabled={rolling}>
                  Next
                </button>
              )}
            </div>
          </>
        )}

        {step === 'name' && heroClass && background && (
          <>
            <h1 className={styles.title}>What is your name?</h1>
            <p className={styles.lead}>
              The {background.name.toLowerCase()} who became a {heroClass.name}. Vessarin is waiting.
            </p>
            {heroPortrait(heroClass.id, look) && (
              <div className={styles.bigPortrait}>
                <img src={heroPortrait(heroClass.id, look)} alt={`${heroClass.name} portrait`} />
              </div>
            )}
            <div className={styles.nameRow}>
              <input className={styles.nameInput} value={name} maxLength={24} placeholder={heroClass.name} onChange={(e) => setName(e.target.value)} aria-label="Hero name" />
              <button type="button" className={styles.secondary} onClick={() => setName(NAMES[Math.floor(Math.random() * NAMES.length)]!)}>
                🎲 Random
              </button>
            </div>
            <div className={styles.nav}>
              <button type="button" className={styles.secondary} onClick={() => setStep('roll')}>
                Back
              </button>
              <button type="button" className={styles.primary} onClick={begin}>
                Begin the adventure
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
