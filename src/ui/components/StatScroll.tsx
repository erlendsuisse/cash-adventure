import { useEffect, useRef, useState } from 'react'
import type { GameState, StatId } from '../../engine/types'
import { FACTIONS, HEAT_PATHS, STANDING_THRESHOLD, standingTier } from '../../content/standings'
import { campaign } from '../../content/campaign'
import { abilityCheckBonuses, STAT_ORDER } from '../../engine/hero'
import { heroIcon, heroPortrait } from '../heroArt'
import styles from './StatScroll.module.css'

/** The Story tab's side panel: just your attributes and reputation (and attention, once you draw some). */
export function StatScroll({ state }: { state: GameState }) {
  const { stats } = state
  const rollBonus = Object.fromEntries(STAT_ORDER.map((stat) => [stat, abilityCheckBonuses(stat, state, campaign).reduce((sum, b) => sum + b.mod, 0)])) as Record<StatId, number>
  const kit = state.progress.boons.flatMap((b) => (campaign.perks?.[b] ? [campaign.perks[b]] : []))
  const changed = useStatChanges(state)

  return (
    <div className={styles.scroll}>
      <div className={styles.inner}>
        {/* Stats Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Attributes</h4>
          <div className={styles.statGrid}>
            {(['grit', 'savvy', 'charm', 'nerve'] as const).map((stat) => (
              <div
                key={`${stat}-${changed[stat]?.count ?? 0}`}
                className={`${styles.stat} ${changed[stat]?.up ? styles.statUp : ''} ${changed[stat] && !changed[stat].up ? styles.statDown : ''}`}
              >
                <span className={styles.label}>{stat[0]!.toUpperCase() + stat.slice(1)}</span>
                {rollBonus[stat] > 0 && (
                  <span className={styles.rollBonus} title="Extra on every roll, from your ability, skills, gear and trophies">
                    +{rollBonus[stat]} on rolls
                  </span>
                )}
                <span className={styles.value}>{stats[stat]}</span>
              </div>
            ))}
          </div>
          {/* Skills, gear and trophies at a glance (details on the Fortune page) */}
          {kit.length > 0 && (
            <div className={styles.kit} aria-label="Carried with you">
              {kit.map((perk) => (
                <span key={perk.id} className={styles.kitItem} title={`${perk.name}: ${perk.text}`} aria-label={`${perk.name}: ${perk.text}`}>
                  {perk.icon}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Reputation: what each faction thinks of you, and what it's worth */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Reputation</h4>
          <div className={styles.stats}>
            {Object.values(FACTIONS).map((faction) => {
              const value = state.flags[faction.flagId] ?? 0
              const reach = Math.min(Math.abs(value), 5) * 10 // % of the bar each side of centre
              return (
                <div key={faction.flagId} className={styles.reputation} title={`${faction.blurb}. At ${STANDING_THRESHOLD} they do you favours; at -${STANDING_THRESHOLD} they work against you.`}>
                  <div className={styles.reputationRow}>
                    <span className={styles.label}>{faction.label}</span>
                    <span className={value > 0 ? styles.positive : value < 0 ? styles.negative : styles.tier}>
                      {standingTier(value)} ({value > 0 ? '+' : ''}{value})
                    </span>
                  </div>
                  <div className={styles.reputationBar}>
                    <div
                      className={value >= 0 ? styles.reputationFillPositive : styles.reputationFillNegative}
                      style={value >= 0 ? { left: '50%', width: `${reach}%` } : { right: '50%', width: `${reach}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Heat: misconduct draws attention; full heat summons the next Colossus early */}
        {HEAT_PATHS.some((h) => (state.flags[h.flagId] ?? 0) > 0) && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle} title="Misconduct draws attention. When a meter fills, the next Colossus comes early.">Attention</h4>
            <div className={styles.stats}>
              {HEAT_PATHS.filter((h) => (state.flags[h.flagId] ?? 0) > 0).map((heat) => {
                const value = Math.min(state.flags[heat.flagId] ?? 0, heat.threshold)
                return (
                  <div key={heat.flagId} className={styles.stat}>
                    <span className={styles.label}>{heat.label}</span>
                    <span className={styles.heatPips} aria-label={`${value} of ${heat.threshold}`}>
                      {'●'.repeat(value)}
                      <span className={styles.heatEmpty}>{'○'.repeat(heat.threshold - value)}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

/** Which stats just changed and which way, so they can sparkle (up) or flash red (down);
 *  the count changes each time to restart the animation. */
function useStatChanges(state: GameState): Partial<Record<StatId, { count: number; up: boolean }>> {
  const [changed, setChanged] = useState<Partial<Record<StatId, { count: number; up: boolean }>>>({})
  const previous = useRef(state.stats)
  useEffect(() => {
    const before = previous.current
    previous.current = state.stats
    const moved = (Object.keys(state.stats) as StatId[]).filter((stat) => state.stats[stat] !== before[stat])
    if (moved.length === 0) return
    setChanged((c) => ({
      ...c,
      ...Object.fromEntries(moved.map((stat) => [stat, { count: (c[stat]?.count ?? 0) + 1, up: state.stats[stat] > before[stat] }])),
    }))
  }, [state.stats])
  return changed
}

/** Who you are: portrait, name, class, background and the class ability. */
export function HeroCard({ state }: { state: GameState }) {
  const heroClass = state.hero ? campaign.heroClasses?.[state.hero.classId] : undefined
  if (!state.hero || !heroClass) return <h3 className={styles.title}>Character & Fortune</h3>
  const background = campaign.backgrounds?.[state.hero.backgroundId]
  const Icon = heroIcon(heroClass.id)
  const portrait = heroPortrait(heroClass.id, state.hero.look)
  return (
    <div className={styles.heroCard}>
      <div className={styles.heroTop}>
        <span className={styles.heroPortrait}>{portrait ? <img src={portrait} alt="" /> : <Icon size={30} strokeWidth={1.8} />}</span>
        <span className={styles.heroNames}>
          <span className={styles.heroName}>{state.hero.name}</span>
          <span className={styles.heroClass}>
            {heroClass.name}
            {background ? ` · ${background.name}` : ''}
          </span>
        </span>
      </div>
      <div className={styles.heroAbility}>
        <strong>{heroClass.ability.name}:</strong> {heroClass.ability.text}
      </div>
    </div>
  )
}
