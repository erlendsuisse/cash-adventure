import { useEffect, useRef, useState } from 'react'
import type { GameState, StatId } from '../../engine/types'
import { isFree, totalMonthlyIncome } from '../../engine/selectors'
import { FACTIONS, HEAT_PATHS, STANDING_THRESHOLD, standingTier } from '../../content/standings'
import { campaign } from '../../content/campaign'
import { useGame } from '../GameProvider'
import { heroIcon, heroPortrait } from '../heroArt'
import styles from './StatScroll.module.css'

export function StatScroll({ state }: { state: GameState }) {
  const { dispatch } = useGame()
  const [loanAmount, setLoanAmount] = useState('')
  const [paybackAmount, setPaybackAmount] = useState('')
  const { stats, finances } = state
  const monthlyIncome = totalMonthlyIncome(state)
  const monthlyExpenses = finances.monthlyExpenses
  const netIncome = monthlyIncome - monthlyExpenses
  const free = isFree(state)
  const changed = useStatChanges(state)

  return (
    <div className={styles.scroll}>
      <div className={styles.inner}>
        <HeroCard state={state} />

        {/* Stats Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Attributes</h4>
          <div className={styles.stats}>
            {(['grit', 'savvy', 'charm', 'nerve'] as const).map((stat) => (
              <div
                key={`${stat}-${changed[stat]?.count ?? 0}`}
                className={`${styles.stat} ${changed[stat]?.up ? styles.statUp : ''} ${changed[stat] && !changed[stat].up ? styles.statDown : ''}`}
              >
                <span className={styles.label}>{stat[0]!.toUpperCase() + stat.slice(1)}</span>
                <span className={styles.value}>{stats[stat]}</span>
              </div>
            ))}
          </div>
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

        {/* Assets Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Holdings</h4>
          <div className={styles.assets}>
            {/* Financial Assets */}
            {finances.assets.map((asset) => (
              <div key={asset.id} className={styles.asset}>
                <div className={styles.assetInfo}>
                  <span className={styles.assetLabel}>{asset.label}</span>
                  {asset.quantity && asset.quantity > 1 && (
                    <span className={styles.assetQuantity}>×{asset.quantity}</span>
                  )}
                </div>
                <span className={styles.assetFlow}>
                  +{asset.monthlyCashflow}g/mo
                </span>
              </div>
            ))}

            {/* Commodities */}
            {(finances.commodities.spice > 0 || finances.commodities.salt > 0 || finances.commodities.iron > 0) && (
              <div className={styles.commoditiesSection}>
                {finances.commodities.spice > 0 && (
                  <div className={styles.commodity}>
                    <span className={styles.commodityLabel}>Spice</span>
                    <span className={styles.commodityAmount}>{finances.commodities.spice} units</span>
                  </div>
                )}
                {finances.commodities.salt > 0 && (
                  <div className={styles.commodity}>
                    <span className={styles.commodityLabel}>Salt</span>
                    <span className={styles.commodityAmount}>{finances.commodities.salt} units</span>
                  </div>
                )}
                {finances.commodities.iron > 0 && (
                  <div className={styles.commodity}>
                    <span className={styles.commodityLabel}>Iron</span>
                    <span className={styles.commodityAmount}>{finances.commodities.iron} units</span>
                  </div>
                )}
              </div>
            )}

            {finances.assets.length === 0 && finances.commodities.spice === 0 && finances.commodities.salt === 0 && finances.commodities.iron === 0 && (
              <div className={styles.emptyHoldings}>
                No holdings yet. Seek investment opportunities.
              </div>
            )}
          </div>
        </div>

        {/* Income Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Monthly Flow</h4>
          <div className={styles.flow}>
            <div className={styles.flowItem}>
              <span>Active Wages</span>
              <span className={styles.positive}>+{finances.wages}g</span>
            </div>
            {monthlyIncome - finances.wages > 0 && (
              <div className={styles.flowItem}>
                <span>Passive Income</span>
                <span className={styles.positive}>
                  +{monthlyIncome - finances.wages}g
                </span>
              </div>
            )}
            <div className={styles.flowItem}>
              <span>Expenses</span>
              <span className={styles.negative}>−{monthlyExpenses}g</span>
            </div>
            <div className={`${styles.flowItem} ${styles.net}`}>
              <span>Net Income</span>
              <span className={netIncome >= 0 ? styles.positive : styles.negative}>
                {netIncome >= 0 ? '+' : '−'}{Math.abs(netIncome)}g
              </span>
            </div>
            {free && <div className={styles.freeFlag}>🏆 FINANCIALLY FREE</div>}
          </div>
        </div>

        {/* Debt Warning */}
        {finances.debt > 0 && (
          <div className={styles.section}>
            <div className={styles.debt}>
              <span className={styles.debtLabel}>Debt Owed</span>
              <span className={styles.debtValue}>{finances.debt}g</span>
            </div>
          </div>
        )}

        {/* Loan Management */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Loans</h4>
          <div className={styles.loanForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Request Loan</label>
              <div className={styles.formInput}>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Amount"
                  min="0"
                  max="1000"
                />
                <button
                  className={styles.smallBtn}
                  onClick={() => {
                    const amount = Math.floor(Number(loanAmount) || 0)
                    if (amount > 0) {
                      dispatch({ type: 'takeLoan', principal: amount, monthlyPayment: Math.ceil(amount * 0.1) })
                      setLoanAmount('')
                    }
                  }}
                >
                  Borrow
                </button>
              </div>
            </div>

            {finances.debt > 0 && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Pay Back Loan</label>
                <div className={styles.formInput}>
                  <input
                    type="number"
                    value={paybackAmount}
                    onChange={(e) => setPaybackAmount(e.target.value)}
                    placeholder={`Max: ${Math.min(finances.gold, finances.debt)}g`}
                    min="0"
                    max={Math.min(finances.gold, finances.debt)}
                  />
                  <button
                    className={styles.smallBtn}
                    onClick={() => {
                      const amount = Math.floor(Number(paybackAmount) || 0)
                      if (amount > 0 && amount <= finances.gold && amount <= finances.debt) {
                        dispatch({ type: 'payLoan', amount })
                        setPaybackAmount('')
                      }
                    }}
                  >
                    Pay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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
function HeroCard({ state }: { state: GameState }) {
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
