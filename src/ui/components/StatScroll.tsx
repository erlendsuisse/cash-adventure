import { useState } from 'react'
import type { GameState } from '../../engine/types'
import { isFree, totalMonthlyIncome } from '../../engine/selectors'
import { useGame } from '../GameProvider'
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

  return (
    <div className={styles.scroll}>
      <div className={styles.inner}>
        <h3 className={styles.title}>Character & Fortune</h3>

        {/* Stats Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Attributes</h4>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.label}>Grit</span>
              <span className={styles.value}>{stats.grit}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Savvy</span>
              <span className={styles.value}>{stats.savvy}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Charm</span>
              <span className={styles.value}>{stats.charm}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Nerve</span>
              <span className={styles.value}>{stats.nerve}</span>
            </div>
          </div>
        </div>

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
