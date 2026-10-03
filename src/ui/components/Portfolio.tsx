import { useState } from 'react'
import type { GameState } from '../../engine/types'
import { totalMonthlyIncome } from '../../engine/selectors'
import { useGame } from '../GameProvider'
import styles from './Portfolio.module.css'

type TabType = 'overview' | 'market' | 'commodities' | 'assets'

export function Portfolio({ state }: { state: GameState }) {
  const { dispatch } = useGame()
  const { finances } = state
  const monthlyIncome = totalMonthlyIncome(state)
  const monthlyExpenses = finances.monthlyExpenses
  const netIncome = monthlyIncome - monthlyExpenses
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [sellAmounts, setSellAmounts] = useState<Record<'spice' | 'salt' | 'iron', number>>({ spice: 0, salt: 0, iron: 0 })
  const [buyAmounts, setBuyAmounts] = useState<Record<'spice' | 'salt' | 'iron', number>>({ spice: 0, salt: 0, iron: 0 })

  // Get market prices from game state
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

  // Calculations
  const assetValue = finances.assets.reduce((sum, asset) => sum + asset.cost, 0)
  const commodityValue =
    finances.commodities.spice * getMarketPrice('spice') +
    finances.commodities.salt * getMarketPrice('salt') +
    finances.commodities.iron * getMarketPrice('iron')
  const netWorth = finances.gold + assetValue + commodityValue - finances.debt

  return (
    <div className={styles.portfolio}>
      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'market' ? styles.active : ''}`}
          onClick={() => setActiveTab('market')}
        >
          Market
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'commodities' ? styles.active : ''}`}
          onClick={() => setActiveTab('commodities')}
        >
          Trade
        </button>
        {finances.assets.length > 0 && (
          <button
            className={`${styles.tab} ${activeTab === 'assets' ? styles.active : ''}`}
            onClick={() => setActiveTab('assets')}
          >
            Assets
          </button>
        )}
      </div>

      <div className={styles.content}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className={styles.tabContent}>
            <div className={styles.stat}>
              <span>Gold</span>
              <span className={styles.value}>{finances.gold}g</span>
            </div>
            <div className={styles.stat}>
              <span>Net Worth</span>
              <span className={netWorth >= 0 ? styles.positive : styles.negative}>{netWorth}g</span>
            </div>
            <div className={styles.stat}>
              <span>Income</span>
              <span className={styles.positive}>+{monthlyIncome}g</span>
            </div>
            <div className={styles.stat}>
              <span>Expenses</span>
              <span className={styles.negative}>−{monthlyExpenses}g</span>
            </div>
            <div className={styles.stat}>
              <span>Net/mo</span>
              <span className={netIncome >= 0 ? styles.positive : styles.negative}>
                {netIncome >= 0 ? '+' : '−'}{Math.abs(netIncome)}g
              </span>
            </div>
            {finances.debt > 0 && (
              <div className={styles.stat}>
                <span>Debt</span>
                <span className={styles.negative}>{finances.debt}g</span>
              </div>
            )}
            <div className={styles.breakdown}>
              <div className={styles.breakdownItem}>
                <span>Assets</span>
                <span>{assetValue}g</span>
              </div>
              <div className={styles.breakdownItem}>
                <span>Commodities</span>
                <span>{commodityValue}g</span>
              </div>
            </div>
          </div>
        )}

        {/* Market Tab */}
        {activeTab === 'market' && (
          <div className={styles.tabContent}>
            {(['spice', 'salt', 'iron'] as const).map((commodity) => {
              const buyPrice = getBuyPrice(commodity)
              const sellPrice = getMarketPrice(commodity)
              const trend = getPriceTrend(commodity)
              const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '→'

              return (
                <div key={commodity} className={styles.priceCard}>
                  <div className={styles.priceHeader}>
                    <span className={styles.commodityName}>{commodity}</span>
                    <span className={styles.trendIcon}>{trendIcon}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Sell</span>
                    <span className={styles.sellPrice}>{sellPrice}g</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Buy</span>
                    <span className={styles.buyPrice}>{buyPrice}g</span>
                  </div>
                  {finances.commodities[commodity] > 0 && (
                    <div className={styles.priceRow}>
                      <span>Own</span>
                      <span>{finances.commodities[commodity]}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Commodities Tab */}
        {activeTab === 'commodities' && (
          <div className={styles.tabContent}>
            {(['spice', 'salt', 'iron'] as const).map((commodity) => (
              <div key={commodity} className={styles.commodityTrade}>
                <div className={styles.commodityName}>{commodity}</div>

                {/* Sell */}
                {finances.commodities[commodity] > 0 && (
                  <div className={styles.tradeRow}>
                    <input
                      type="number"
                      min="0"
                      max={finances.commodities[commodity]}
                      value={sellAmounts[commodity] ?? 0}
                      onChange={(e) => setSellAmounts({ ...sellAmounts, [commodity]: Number(e.target.value) || 0 })}
                      placeholder="Sell"
                      className={styles.tradeInputSmall}
                    />
                    <button
                      className={styles.sellBtnSmall}
                      onClick={() => handleSellCommodity(commodity, sellAmounts[commodity] ?? 0)}
                      disabled={(sellAmounts[commodity] ?? 0) <= 0}
                    >
                      Sell
                    </button>
                  </div>
                )}

                {/* Buy */}
                {finances.gold > 0 && (
                  <div className={styles.tradeRow}>
                    <input
                      type="number"
                      min="0"
                      max={Math.floor(finances.gold / getBuyPrice(commodity))}
                      value={buyAmounts[commodity] ?? 0}
                      onChange={(e) => setBuyAmounts({ ...buyAmounts, [commodity]: Number(e.target.value) || 0 })}
                      placeholder="Buy"
                      className={styles.tradeInputSmall}
                    />
                    <button
                      className={styles.buyBtnSmall}
                      onClick={() => handleBuyCommodity(commodity, buyAmounts[commodity] ?? 0)}
                      disabled={(buyAmounts[commodity] ?? 0) <= 0 || (buyAmounts[commodity] ?? 0) * getBuyPrice(commodity) > finances.gold}
                    >
                      Buy
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && finances.assets.length > 0 && (
          <div className={styles.tabContent}>
            {finances.assets.map((asset) => (
              <div key={asset.id} className={styles.assetRowSmall}>
                <div className={styles.assetNameSmall}>{asset.label}</div>
                <div className={styles.assetIncomeSmall}>+{asset.monthlyCashflow}g</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
