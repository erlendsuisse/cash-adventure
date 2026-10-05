import { standingFlagIds, trackedFlagLabel } from '../../content/standings'
import type { EffectSummary } from '../../engine/types'
import styles from './EffectSummary.module.css'

export function EffectSummary({ summary }: { summary: EffectSummary }) {
  return (
    <div className={styles.summary}>
      <div className={styles.grid}>
        {Object.entries(summary.stats).map(([stat, delta]) => (
          <div key={stat} className={styles.item}>
            <span className={styles.label}>{stat}</span>
            <span className={delta > 0 ? styles.positive : styles.negative}>
              {delta > 0 ? '+' : ''}{delta}
            </span>
          </div>
        ))}
        {summary.gold !== 0 && (
          <div className={styles.item}>
            <span className={styles.label}>Gold</span>
            <span className={summary.gold > 0 ? styles.positive : styles.negative}>
              {summary.gold > 0 ? '+' : ''}{summary.gold}
            </span>
          </div>
        )}
        {summary.wages !== 0 && (
          <div className={styles.item}>
            <span className={styles.label}>Wages</span>
            <span className={summary.wages > 0 ? styles.positive : styles.negative}>
              {summary.wages > 0 ? '+' : ''}{summary.wages}/mo
            </span>
          </div>
        )}
        {summary.monthlyExpenses !== 0 && (
          <div className={styles.item}>
            <span className={styles.label}>Expenses</span>
            <span className={summary.monthlyExpenses > 0 ? styles.negative : styles.positive}>
              {summary.monthlyExpenses > 0 ? '+' : ''}{summary.monthlyExpenses}/mo
            </span>
          </div>
        )}
        {Object.entries(summary.commodities ?? {}).map(([commodity, delta]) => (
          <div key={commodity} className={styles.item}>
            <span className={styles.label}>{commodity[0]!.toUpperCase() + commodity.slice(1)}</span>
            <span className={delta > 0 ? styles.positive : styles.negative}>
              {delta > 0 ? '+' : ''}{delta} units
            </span>
          </div>
        ))}
        {Object.entries(summary.trackedFlagDeltas ?? {}).map(([flagId, delta]) => {
          // Standing going up is good; heat going up is not.
          const good = standingFlagIds.includes(flagId) ? delta > 0 : delta < 0
          return (
            <div key={flagId} className={styles.item}>
              <span className={styles.label}>{trackedFlagLabel(flagId)}</span>
              <span className={good ? styles.positive : styles.negative}>
                {delta > 0 ? '+' : ''}{delta}
              </span>
            </div>
          )
        })}
        {summary.debt !== 0 && (
          <div className={styles.item}>
            <span className={styles.label}>Debt</span>
            <span className={summary.debt > 0 ? styles.negative : styles.positive}>
              {summary.debt > 0 ? '+' : ''}{summary.debt}
            </span>
          </div>
        )}
      </div>

      {(summary.perksGained?.length ?? 0) > 0 && (
        <div className={styles.assets}>
          <div className={styles.assetGroup}>
            <span className={styles.assetLabel}>Yours to keep:</span>
            <ul className={styles.assetList}>
              {summary.perksGained!.map((perk) => (
                <li key={perk} className={styles.positive}>{perk}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {(summary.assetsGained.length > 0 || summary.assetsLost.length > 0) && (
        <div className={styles.assets}>
          {summary.assetsGained.length > 0 && (
            <div className={styles.assetGroup}>
              <span className={styles.assetLabel}>Acquired:</span>
              <ul className={styles.assetList}>
                {summary.assetsGained.map((asset, i) => (
                  <li key={i} className={styles.positive}>{asset}</li>
                ))}
              </ul>
            </div>
          )}
          {summary.assetsLost.length > 0 && (
            <div className={styles.assetGroup}>
              <span className={styles.assetLabel}>Lost:</span>
              <ul className={styles.assetList}>
                {summary.assetsLost.map((asset, i) => (
                  <li key={i} className={styles.negative}>{asset}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
