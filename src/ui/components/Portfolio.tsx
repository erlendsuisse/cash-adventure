import { useState } from 'react'
import type { GameState } from '../../engine/types'
import { totalMonthlyIncome } from '../../engine/selectors'
import { useGame } from '../GameProvider'
import styles from './Portfolio.module.css'

export function Portfolio({ state }: { state: GameState }) {
  const { dispatch } = useGame()
  const { finances } = state
  const monthlyIncome = totalMonthlyIncome(state)
  const monthlyExpenses = finances.monthlyExpenses
  const netIncome = monthlyIncome - monthlyExpenses
  const [sellAmounts, setSellAmounts] = useState<Record<'spice' | 'salt' | 'iron', number>>({ spice: 0, salt: 0, iron: 0 })
  const [buyAmounts, setBuyAmounts] = useState<Record<'spice' | 'salt' | 'iron', number>>({ spice: 0, salt: 0, iron: 0 })

  const getMarketPrice = (commodity: 'spice' | 'salt' | 'iron'): number => {
    const basePrice: Record<'spice' | 'salt' | 'iron', number> = { spice: 15, salt: 8, iron: 12 }
    const sectorPrice = state.market[commodity] ?? 100
    return Math.round(((basePrice[commodity] ?? 0) * sectorPrice) / 100)
  }

  const getBuyPrice = (commodity: 'spice' | 'salt' | 'iron'): number => {
    return Math.round(getMarketPrice(commodity) * 1.1)
  }

  const getPriceTrend = (commodity: 'spice' | 'salt' | 'iron'): 'up' | 'down' | 'stable' => {
    const sectorPrice = state.market[commodity] ?? 100
    if (sectorPrice > 105) return 'up'
    if (sectorPrice < 95) return 'down'
    return 'stable'
  }

  const handleBuyCommodity = (commodity: 'spice' | 'salt' | 'iron', amount: number) => {
    if (amount <= 0) return
    const price = getBuyPrice(commodity)
    const totalCost = amount * price
    if (totalCost > finances.gold) return
    dispatch({ type: 'buyCommodity', commodity, amount, pricePerUnit: price })
    setBuyAmounts({ ...buyAmounts, [commodity]: 0 })
  }

  const handleSellCommodity = (commodity: 'spice' | 'salt' | 'iron', amount: number) => {
    const available = finances.commodities[commodity]
    const toSell = Math.min(amount, available)
    if (toSell > 0) {
      const price = getMarketPrice(commodity)
      dispatch({ type: 'sellCommodity', commodity, amount: toSell, pricePerUnit: price })
      setSellAmounts({ ...sellAmounts, [commodity]: 0 })
    }
  }

  const assetValue = finances.assets.reduce((sum, asset) => sum + asset.cost, 0)
  const commodityValue =
    finances.commodities.spice * getMarketPrice('spice') +
    finances.commodities.salt * getMarketPrice('salt') +
    finances.commodities.iron * getMarketPrice('iron')
  const netWorth = finances.gold + assetValue + commodityValue - finances.debt

  return (
    <div className={styles.portfolio}>
      <div className={styles.inner}>
        <h3 className={styles.title}>Portfolio</h3>

        {/* Net Worth - Super Compact */}
        <div className={styles.section}>
          <div className={styles.compactRow}>
            <span>Gold</span>
            <span className={styles.gold}>{finances.gold}g</span>
          </div>
          <div className={styles.compactRow}>
            <span>Worth</span>
            <span className={netWorth >= 0 ? styles.positive : styles.negative}>{netWorth}g</span>
          </div>
        </div>

        {/* Monthly Flow - Compact */}
        <div className={styles.section}>
          <div className={styles.compactRow}>
            <span>+{monthlyIncome}g</span>
            <span className={styles.negative}>−{monthlyExpenses}g</span>
            <span className={netIncome >= 0 ? styles.positive : styles.negative}>{netIncome > 0 ? '+' : ''}{netIncome}g</span>
          </div>
        </div>

        {/* Market Prices - Grid */}
        <div className={styles.section}>
          <div className={styles.pricesGrid}>
            {(['spice', 'salt', 'iron'] as const).map((commodity) => {
              const trend = getPriceTrend(commodity)
              const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '→'
              return (
                <div key={commodity} className={styles.priceGridItem}>
                  <div className={styles.priceTop}>
                    <span>{commodity[0]}</span>
                    <span>{trendIcon}</span>
                  </div>
                  <div className={styles.priceMid}>
                    <span className={styles.sellPrice}>{getMarketPrice(commodity)}</span>
                    <span className={styles.buyPrice}>{getBuyPrice(commodity)}</span>
                  </div>
                  {finances.commodities[commodity] > 0 && (
                    <div className={styles.priceBot}>×{finances.commodities[commodity]}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Trading - Compact 3-column */}
        <div className={styles.section}>
          <div className={styles.tradeGrid}>
            {(['spice', 'salt', 'iron'] as const).map((commodity) => {
              const firstLetter = commodity.charAt(0).toUpperCase()
              return (
              <div key={commodity} className={styles.tradeGridItem}>
                <div className={styles.tradeName}>{firstLetter}</div>

                {/* Sell */}
                {finances.commodities[commodity] > 0 && (
                  <div className={styles.tradeInputGroup}>
                    <input
                      type="number"
                      min="0"
                      max={finances.commodities[commodity]}
                      value={sellAmounts[commodity] ?? 0}
                      onChange={(e) => setSellAmounts({ ...sellAmounts, [commodity]: Number(e.target.value) || 0 })}
                      placeholder="Sell"
                      className={styles.tinyInput}
                    />
                    <button
                      className={styles.tinySellBtn}
                      onClick={() => handleSellCommodity(commodity, sellAmounts[commodity] ?? 0)}
                      disabled={(sellAmounts[commodity] ?? 0) <= 0}
                      title="Sell"
                    >
                      S
                    </button>
                  </div>
                )}

                {/* Buy */}
                {finances.gold > 0 && (
                  <div className={styles.tradeInputGroup}>
                    <input
                      type="number"
                      min="0"
                      max={Math.floor(finances.gold / getBuyPrice(commodity))}
                      value={buyAmounts[commodity] ?? 0}
                      onChange={(e) => setBuyAmounts({ ...buyAmounts, [commodity]: Number(e.target.value) || 0 })}
                      placeholder="Buy"
                      className={styles.tinyInput}
                    />
                    <button
                      className={styles.tinyBuyBtn}
                      onClick={() => handleBuyCommodity(commodity, buyAmounts[commodity] ?? 0)}
                      disabled={(buyAmounts[commodity] ?? 0) <= 0 || (buyAmounts[commodity] ?? 0) * getBuyPrice(commodity) > finances.gold}
                      title="Buy"
                    >
                      B
                    </button>
                  </div>
                )}
              </div>
            )
            })}
          </div>
        </div>

        {/* Assets - Compact List */}
        {finances.assets.length > 0 && (
          <div className={styles.section}>
            {finances.assets.map((asset) => (
              <div key={asset.id} className={styles.assetMini}>
                <span className={styles.assetMiniName}>{asset.label}</span>
                <span className={styles.assetMiniIncome}>+{asset.monthlyCashflow}g</span>
              </div>
            ))}
          </div>
        )}

        {/* Debt Warning */}
        {finances.debt > 0 && (
          <div className={styles.section}>
            <div className={styles.debtWarning}>
              Debt: {finances.debt}g
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
