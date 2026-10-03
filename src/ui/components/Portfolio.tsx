import { useState } from 'react'
import type { GameState } from '../../engine/types'
import { useGame } from '../GameProvider'
import styles from './Portfolio.module.css'

export function Portfolio({ state }: { state: GameState }) {
  const { dispatch } = useGame()
  const { finances } = state
  const [sellAmounts, setSellAmounts] = useState<Record<'spice' | 'salt' | 'iron', number>>({ spice: 0, salt: 0, iron: 0 })
  const [buyAmounts, setBuyAmounts] = useState<Record<'spice' | 'salt' | 'iron', number>>({ spice: 0, salt: 0, iron: 0 })
  const [sellAssetId, setSellAssetId] = useState<string | null>(null)

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

  const handleSellAsset = (assetId: string) => {
    const asset = finances.assets.find((a) => a.id === assetId)
    if (asset) {
      dispatch({
        type: 'sellAsset',
        id: assetId,
        priceMultiplier: 0.8, // Emergency sale at 80% of value
      })
      setSellAssetId(null)
    }
  }

  return (
    <div className={styles.portfolio}>
      <div className={styles.inner}>
        <h3 className={styles.title}>Trade</h3>

        {/* Market Prices Header */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Market Prices</h4>
          <div className={styles.pricesCompact}>
            {(['spice', 'salt', 'iron'] as const).map((commodity) => {
              const trend = getPriceTrend(commodity)
              const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '→'
              return (
                <div key={commodity} className={styles.priceRow}>
                  <span className={styles.commodityName}>
                    {commodity} {trendIcon}
                  </span>
                  <span className={styles.sellPrice}>{getMarketPrice(commodity)}g</span>
                  <span className={styles.buyPrice}>{getBuyPrice(commodity)}g</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Commodities - Prominent Trading */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Stocks</h4>
          <div className={styles.commoditiesPanel}>
            {/* Spice */}
            <div className={styles.commodityCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Spice</span>
                {finances.commodities.spice > 0 && (
                  <span className={styles.cardValue}>{finances.commodities.spice} units</span>
                )}
              </div>

              {finances.commodities.spice > 0 && (
                <div className={styles.tradeRow}>
                  <input
                    type="number"
                    min="0"
                    max={finances.commodities.spice}
                    value={sellAmounts.spice ?? 0}
                    onChange={(e) => setSellAmounts({ ...sellAmounts, spice: Number(e.target.value) || 0 })}
                    placeholder="Qty"
                    className={styles.qtyInput}
                  />
                  <button
                    className={styles.sellBtn}
                    onClick={() => handleSellCommodity('spice', sellAmounts.spice ?? 0)}
                    disabled={(sellAmounts.spice ?? 0) <= 0}
                  >
                    Sell
                  </button>
                </div>
              )}

              {finances.gold > 0 && (
                <div className={styles.tradeRow}>
                  <input
                    type="number"
                    min="0"
                    max={Math.floor(finances.gold / getBuyPrice('spice'))}
                    value={buyAmounts.spice ?? 0}
                    onChange={(e) => setBuyAmounts({ ...buyAmounts, spice: Number(e.target.value) || 0 })}
                    placeholder="Qty"
                    className={styles.qtyInput}
                  />
                  <button
                    className={styles.buyBtn}
                    onClick={() => handleBuyCommodity('spice', buyAmounts.spice ?? 0)}
                    disabled={(buyAmounts.spice ?? 0) <= 0 || (buyAmounts.spice ?? 0) * getBuyPrice('spice') > finances.gold}
                  >
                    Buy
                  </button>
                </div>
              )}
            </div>

            {/* Salt */}
            <div className={styles.commodityCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Salt</span>
                {finances.commodities.salt > 0 && (
                  <span className={styles.cardValue}>{finances.commodities.salt} units</span>
                )}
              </div>

              {finances.commodities.salt > 0 && (
                <div className={styles.tradeRow}>
                  <input
                    type="number"
                    min="0"
                    max={finances.commodities.salt}
                    value={sellAmounts.salt ?? 0}
                    onChange={(e) => setSellAmounts({ ...sellAmounts, salt: Number(e.target.value) || 0 })}
                    placeholder="Qty"
                    className={styles.qtyInput}
                  />
                  <button
                    className={styles.sellBtn}
                    onClick={() => handleSellCommodity('salt', sellAmounts.salt ?? 0)}
                    disabled={(sellAmounts.salt ?? 0) <= 0}
                  >
                    Sell
                  </button>
                </div>
              )}

              {finances.gold > 0 && (
                <div className={styles.tradeRow}>
                  <input
                    type="number"
                    min="0"
                    max={Math.floor(finances.gold / getBuyPrice('salt'))}
                    value={buyAmounts.salt ?? 0}
                    onChange={(e) => setBuyAmounts({ ...buyAmounts, salt: Number(e.target.value) || 0 })}
                    placeholder="Qty"
                    className={styles.qtyInput}
                  />
                  <button
                    className={styles.buyBtn}
                    onClick={() => handleBuyCommodity('salt', buyAmounts.salt ?? 0)}
                    disabled={(buyAmounts.salt ?? 0) <= 0 || (buyAmounts.salt ?? 0) * getBuyPrice('salt') > finances.gold}
                  >
                    Buy
                  </button>
                </div>
              )}
            </div>

            {/* Iron */}
            <div className={styles.commodityCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Iron</span>
                {finances.commodities.iron > 0 && (
                  <span className={styles.cardValue}>{finances.commodities.iron} units</span>
                )}
              </div>

              {finances.commodities.iron > 0 && (
                <div className={styles.tradeRow}>
                  <input
                    type="number"
                    min="0"
                    max={finances.commodities.iron}
                    value={sellAmounts.iron ?? 0}
                    onChange={(e) => setSellAmounts({ ...sellAmounts, iron: Number(e.target.value) || 0 })}
                    placeholder="Qty"
                    className={styles.qtyInput}
                  />
                  <button
                    className={styles.sellBtn}
                    onClick={() => handleSellCommodity('iron', sellAmounts.iron ?? 0)}
                    disabled={(sellAmounts.iron ?? 0) <= 0}
                  >
                    Sell
                  </button>
                </div>
              )}

              {finances.gold > 0 && (
                <div className={styles.tradeRow}>
                  <input
                    type="number"
                    min="0"
                    max={Math.floor(finances.gold / getBuyPrice('iron'))}
                    value={buyAmounts.iron ?? 0}
                    onChange={(e) => setBuyAmounts({ ...buyAmounts, iron: Number(e.target.value) || 0 })}
                    placeholder="Qty"
                    className={styles.qtyInput}
                  />
                  <button
                    className={styles.buyBtn}
                    onClick={() => handleBuyCommodity('iron', buyAmounts.iron ?? 0)}
                    disabled={(buyAmounts.iron ?? 0) <= 0 || (buyAmounts.iron ?? 0) * getBuyPrice('iron') > finances.gold}
                  >
                    Buy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Holdings - Emergency Sell */}
        {finances.assets.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Holdings</h4>
            <div className={styles.assetsList}>
              {finances.assets.map((asset) => (
                <div key={asset.id} className={styles.assetRow}>
                  <div className={styles.assetLeft}>
                    <div className={styles.assetName}>{asset.label}</div>
                    <div className={styles.assetIncome}>+{asset.monthlyCashflow}g/mo</div>
                  </div>
                  <button
                    className={styles.emergencySellBtn}
                    onClick={() => {
                      if (sellAssetId === asset.id) {
                        handleSellAsset(asset.id)
                      } else {
                        setSellAssetId(asset.id)
                      }
                    }}
                  >
                    {sellAssetId === asset.id ? 'Confirm?' : 'Sell'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
