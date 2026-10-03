import { describe, expect, it } from 'vitest'
import { campaign } from '../content/campaign'

const files = Object.keys(import.meta.glob('../assets/artwork/**/*', { query: '?url' }))

describe('card artwork', () => {
  it('is all WebP (run scripts/optimize-artwork.mjs on fresh generations)', () => {
    expect(files.filter((f) => !f.endsWith('.webp'))).toEqual([])
  })

  it('every image belongs to a real card, filed under that card’s chapter', () => {
    const misfiled = files.flatMap((file) => {
      const match = /chapter(\d)\/([^/]+)\.webp$/.exec(file)
      const card = match ? campaign.cards[match[2]!] : undefined
      return card && card.chapter === Number(match![1]) ? [] : [file]
    })
    expect(misfiled).toEqual([])
  })
})
