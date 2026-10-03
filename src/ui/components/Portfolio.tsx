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

  // Get market prices from game state
  const getMarketPrice = (commodity: 'spice' | 'salt' | 'iron'): number => {
    const basePrice: Record<'spice' | 'salt' | 'iron', number> = { spice: 15, salt: 8, iron: 12 }
    const sectorPrice = state.market[commodity] ?? 100
    return Math.round(((basePrice[commodity] ?? 0) * sectorPrice) / 100)
  }

  // Get buy price (10% markup on market price)
  const getBuyPrice = (commodity: 'spice' | 'salt' | 'iron'): number => {
    return Math.round(getMarketPrice(commodity) * 1.1)
  }

  // Calculate price trend (compare to previous)
  const getPriceTrend = (commodity: 'spice' | 'salt' | 'iron'): 'up' | 'down' | 'stable' => {
    const sectorPrice = state.market[commodity] ?? 100
    if (sectorPrice > 105) return 'up'
    if (sectorPrice < 95) return 'down'
    return 'stable'
  }

  // Handle commodity purchases
  const handleBuyCommodity = (commodity: 'spice' | 'salt' | 'iron', amount: number) => {
    if (amount <= 0) return
    const price = getBuyPrice(commodity)
    const totalCost = amount * price
    if (totalCost > finances.gold) return
    dispatch({
      type: 'buyCommodity',
      commodity,
      amount,
      pricePerUnit: price,
    })
    setBuyAmounts({ ...buyAmounts, [commodity]: 0 })
  }

  // Calculate net worth
  const assetValue = finances.assets.reduce((sum, asset) => sum + asset.cost, 0)
  const commodityValue =
    finances.commodities.spice * getMarketPrice('spice') +
    finances.commodities.salt * getMarketPrice('salt') +
    finances.commodities.iron * getMarketPrice('iron')
  const netWorth = finances.gold + assetValue + commodityValue - finances.debt

  // Handle commodity sales
  const handleSellCommodity = (commodity: 'spice' | 'salt' | 'iron', amount: number) => {
    const available = finances.commodities[commodity]
    const toSell = Math.min(amount, available)
    if (toSell > 0) {
      const price = getMarketPrice(commodity)
      dispatch({
        type: 'sellCommodity',
        commodity,
        amount: toSell,
        pricePerUnit: price,
      })
      setSellAmounts({ ...sellAmounts, [commodity]: 0 })
    }
  }

  return (
    <div className={styles.portfolio}>
      <div className={styles.inner}>
        <h3 className={styles.title}>Portfolio</h3>

        {/* Net Worth Summary */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Net Worth</h4>
          <div className={styles.netWorth}>
            <div className={styles.netWorthRow}>
              <span>Liquid Gold</span>
              <span className={styles.gold}>{finances.gold}g</span>
            </div>
            <div className={styles.netWorthRow}>
              <span>Asset Value</span>
              <span className={styles.asset}>{assetValue}g</span>
            </div>
            <div className={styles.netWorthRow}>
              <span>Commodities</span>
              <span className={styles.commodity}>{commodityValue}g</span>
            </div>
            {finances.debt > 0 && (
              <div className={styles.netWorthRow}>
                <span>Debt</span>
                <span className={styles.debt}>−{finances.debt}g</span>
              </div>
            )}
            <div className={`${styles.netWorthRow} ${styles.total}`}>
              <span>Total Worth</span>
              <span className={netWorth >= 0 ? styles.positive : styles.negative}>{netWorth}g</span>
            </div>
          </div>
        </div>

        {/* Income & Expenses */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Monthly</h4>
          <div className={styles.monthlyFlow}>
            <div className={styles.flowRow}>
              <span>Income</span>
              <span className={styles.positive}>+{monthlyIncome}g</span>
            </div>
            <div className={styles.flowRow}>
              <span>Expenses</span>
              <span className={styles.negative}>−{monthlyExpenses}g</span>
            </div>
            <div className={`${styles.flowRow} ${styles.net}`}>
              <span>Net</span>
              <span className={netIncome >= 0 ? styles.positive : styles.negative}>
                {netIncome >= 0 ? '+' : '−'}{Math.abs(netIncome)}g
              </span>
            </div>
          </div>
        </div>

        {/* Market Prices & Trading */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Market Prices</h4>
          <div className={styles.marketPrices}>
            {(['spice', 'salt', 'iron'] as const).map((commodity) => {
              const buyPrice = getBuyPrice(commodity)
              const sellPrice = getMarketPrice(commodity)
              const trend = getPriceTrend(commodity)
              const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '→'

              return (
                <div key={commodity} className={styles.priceRow}>
                  <div className={styles.priceLabel}>
                    <span className={styles.commodityName}>{commodity}</span>
                    <span className={styles.trendIcon}>{trendIcon}</span>
                  </div>
                  <div className={styles.priceValues}>
                    <span className={styles.sellPrice}>Sell {sellPrice}g</span>
                    <span className={styles.buyPrice}>Buy {buyPrice}g</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Commodities for Trading */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Commodities</h4>
          <div className={styles.commoditiesPanel}>
              {/* Spice */}
              {/* Spice */}
              <div className={styles.commodityCard}>
                <div className={styles.commodityHeader}>
                  <span className={styles.commodityName}>Spice</span>
                  {finances.commodities.spice > 0 && (
                    <span className={styles.commodityQuantity}>Own: {finances.commodities.spice}</span>
                  )}
                </div>

                {/* Sell Section */}
                {finances.commodities.spice > 0 && (
                  <div className={styles.tradeSection}>
                    <div className={styles.tradeLabel}>Sell</div>
                    <div className={styles.tradeForm}>
                      <input
                        type="number"
                        min="0"
                        max={finances.commodities.spice}
                        value={sellAmounts.spice ?? 0}
                        onChange={(e) => setSellAmounts({ ...sellAmounts, spice: Number(e.target.value) || 0 })}
                        placeholder="Amount"
                        className={styles.tradeInput}
                      />
                      <button
                        className={styles.tradeBtn}
                        onClick={() => handleSellCommodity('spice', sellAmounts.spice ?? 0)}
                        disabled={(sellAmounts.spice ?? 0) <= 0}
                      >
                        {(sellAmounts.spice ?? 0) > 0 ? `+${(sellAmounts.spice ?? 0) * getMarketPrice('spice')}g` : 'Sell'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Buy Section */}
                {finances.gold > 0 && (
                  <div className={styles.tradeSection}>
                    <div className={styles.tradeLabel}>Buy</div>
                    <div className={styles.tradeForm}>
                      <input
                        type="number"
                        min="0"
                        max={Math.floor(finances.gold / getBuyPrice('spice'))}
                        value={buyAmounts.spice ?? 0}
                        onChange={(e) => setBuyAmounts({ ...buyAmounts, spice: Number(e.target.value) || 0 })}
                        placeholder="Amount"
                        className={styles.tradeInput}
                      />
                      <button
                        className={styles.buyBtn}
                        onClick={() => handleBuyCommodity('spice', buyAmounts.spice ?? 0)}
                        disabled={(buyAmounts.spice ?? 0) <= 0 || (buyAmounts.spice ?? 0) * getBuyPrice('spice') > finances.gold}
                      >
                        {(buyAmounts.spice ?? 0) > 0 ? `-${(buyAmounts.spice ?? 0) * getBuyPrice('spice')}g` : 'Buy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Salt */}
              <div className={styles.commodityCard}>
                <div className={styles.commodityHeader}>
                  <span className={styles.commodityName}>Salt</span>
                  {finances.commodities.salt > 0 && (
                    <span className={styles.commodityQuantity}>Own: {finances.commodities.salt}</span>
                  )}
                </div>

                {/* Sell Section */}
                {finances.commodities.salt > 0 && (
                  <div className={styles.tradeSection}>
                    <div className={styles.tradeLabel}>Sell</div>
                    <div className={styles.tradeForm}>
                      <input
                        type="number"
                        min="0"
                        max={finances.commodities.salt}
                        value={sellAmounts.salt ?? 0}
                        onChange={(e) => setSellAmounts({ ...sellAmounts, salt: Number(e.target.value) || 0 })}
                        placeholder="Amount"
                        className={styles.tradeInput}
                      />
                      <button
                        className={styles.tradeBtn}
                        onClick={() => handleSellCommodity('salt', sellAmounts.salt ?? 0)}
                        disabled={(sellAmounts.salt ?? 0) <= 0}
                      >
                        {(sellAmounts.salt ?? 0) > 0 ? `+${(sellAmounts.salt ?? 0) * getMarketPrice('salt')}g` : 'Sell'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Buy Section */}
                {finances.gold > 0 && (
                  <div className={styles.tradeSection}>
                    <div className={styles.tradeLabel}>Buy</div>
                    <div className={styles.tradeForm}>
                      <input
                        type="number"
                        min="0"
                        max={Math.floor(finances.gold / getBuyPrice('salt'))}
                        value={buyAmounts.salt ?? 0}
                        onChange={(e) => setBuyAmounts({ ...buyAmounts, salt: Number(e.target.value) || 0 })}
                        placeholder="Amount"
                        className={styles.tradeInput}
                      />
                      <button
                        className={styles.buyBtn}
                        onClick={() => handleBuyCommodity('salt', buyAmounts.salt ?? 0)}
                        disabled={(buyAmounts.salt ?? 0) <= 0 || (buyAmounts.salt ?? 0) * getBuyPrice('salt') > finances.gold}
                      >
                        {(buyAmounts.salt ?? 0) > 0 ? `-${(buyAmounts.salt ?? 0) * getBuyPrice('salt')}g` : 'Buy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Iron */}
              <div className={styles.commodityCard}>
                <div className={styles.commodityHeader}>
                  <span className={styles.commodityName}>Iron</span>
                  {finances.commodities.iron > 0 && (
                    <span className={styles.commodityQuantity}>Own: {finances.commodities.iron}</span>
                  )}
                </div>

                {/* Sell Section */}
                {finances.commodities.iron > 0 && (
                  <div className={styles.tradeSection}>
                    <div className={styles.tradeLabel}>Sell</div>
                    <div className={styles.tradeForm}>
                      <input
                        type="number"
                        min="0"
                        max={finances.commodities.iron}
                        value={sellAmounts.iron ?? 0}
                        onChange={(e) => setSellAmounts({ ...sellAmounts, iron: Number(e.target.value) || 0 })}
                        placeholder="Amount"
                        className={styles.tradeInput}
                      />
                      <button
                        className={styles.tradeBtn}
                        onClick={() => handleSellCommodity('iron', sellAmounts.iron ?? 0)}
                        disabled={(sellAmounts.iron ?? 0) <= 0}
                      >
                        {(sellAmounts.iron ?? 0) > 0 ? `+${(sellAmounts.iron ?? 0) * getMarketPrice('iron')}g` : 'Sell'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Buy Section */}
                {finances.gold > 0 && (
                  <div className={styles.tradeSection}>
                    <div className={styles.tradeLabel}>Buy</div>
                    <div className={styles.tradeForm}>
                      <input
                        type="number"
                        min="0"
                        max={Math.floor(finances.gold / getBuyPrice('iron'))}
                        value={buyAmounts.iron ?? 0}
                        onChange={(e) => setBuyAmounts({ ...buyAmounts, iron: Number(e.target.value) || 0 })}
                        placeholder="Amount"
                        className={styles.tradeInput}
                      />
                      <button
                        className={styles.buyBtn}
                        onClick={() => handleBuyCommodity('iron', buyAmounts.iron ?? 0)}
                        disabled={(buyAmounts.iron ?? 0) <= 0 || (buyAmounts.iron ?? 0) * getBuyPrice('iron') > finances.gold}
                      >
                        {(buyAmounts.iron ?? 0) > 0 ? `-${(buyAmounts.iron ?? 0) * getBuyPrice('iron')}g` : 'Buy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* Assets Summary */}
        {finances.assets.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Assets ({finances.assets.length})</h4>
            <div className={styles.assetsList}>
              {finances.assets.map((asset) => (
                <div key={asset.id} className={styles.assetRow}>
                  <div className={styles.assetInfo}>
                    <span className={styles.assetName}>{asset.label}</span>
                    {asset.quantity && asset.quantity > 1 && (
                      <span className={styles.assetQty}>×{asset.quantity}</span>
                    )}
                  </div>
                  <span className={styles.assetIncome}>+{asset.monthlyCashflow}g</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
