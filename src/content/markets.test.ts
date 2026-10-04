import { describe, expect, it } from 'vitest'
import type { ChapterNumber, Commodity } from '../engine/types'
import { campaign } from './campaign'
import { CHAPTERS, chapterTitleCardId } from './chapters'
import { cardEffects } from './integrity'
import { MARKET_REGIMES } from './tuning'

const COMMODITIES: Commodity[] = ['salt', 'spice', 'iron']

function trades(chapter: ChapterNumber, kind: 'buyStock' | 'sellStock'): Set<Commodity> {
  return new Set(
    campaign.deckCardIds
      .map((id) => campaign.cards[id]!)
      .filter((c) => c.chapter === chapter)
      .flatMap((c) => cardEffects(c).flatMap((e) => (e.kind === kind ? [e.type] : []))),
  )
}

describe('chapter markets', () => {
  it('every chapter has a market regime and tells the player about it', () => {
    for (const n of [1, 2, 3, 4, 5, 6, 7] as ChapterNumber[]) {
      expect(MARKET_REGIMES[n], `chapter ${n} regime`).toBeDefined()
      expect(CHAPTERS[n].market.length, `chapter ${n} market line`).toBeGreaterThan(20)
      if (n > 1) expect(campaign.cards[chapterTitleCardId(n)]!.body.join(' ')).toContain(CHAPTERS[n].market)
    }
  })

  it('what a chapter makes dear, someone there will buy; what it makes cheap, someone there will sell', () => {
    for (const n of [2, 3, 4, 5, 6] as ChapterNumber[]) {
      const target = MARKET_REGIMES[n].target
      const byTarget = [...COMMODITIES].sort((a, b) => (target[a] ?? 100) - (target[b] ?? 100))
      expect(trades(n, 'sellStock'), `chapter ${n} buyer for ${byTarget[2]}`).toContain(byTarget[2])
      expect(trades(n, 'buyStock'), `chapter ${n} shipment of ${byTarget[0]}`).toContain(byTarget[0])
    }
  })

  it('markets keep moving after Chapter 1: every later chapter shifts some price by at least 30%', () => {
    for (const n of [2, 3, 4, 5, 6] as ChapterNumber[]) {
      const target = MARKET_REGIMES[n].target
      expect(COMMODITIES.some((c) => Math.abs((target[c] ?? 100) - 100) >= 30), `chapter ${n}`).toBe(true)
    }
    expect(MARKET_REGIMES[7].volatility ?? 0).toBeGreaterThanOrEqual(10) // Transcendence swings instead
  })

  it('no card trades stock through flags nobody sets', () => {
    const flagReads = JSON.stringify(Object.values(campaign.cards))
    expect(flagReads).not.toMatch(/"id":"(own|has)_(salt|spice|iron)"/)
  })
})
