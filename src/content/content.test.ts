import { describe, expect, it } from 'vitest'
import { campaign } from './campaign'
import { checkIntegrity } from './integrity'
import { storyCardSchema } from './schema'

describe('campaign content', () => {
  it('every card matches the authoring schema', () => {
    for (const card of Object.values(campaign.cards)) {
      const result = storyCardSchema.safeParse(card)
      if (!result.success) {
        throw new Error(`${card.id}: ${result.error.message}`)
      }
    }
  })

  it('has no dangling goto/queueCard references', () => {
    const { danglingReferences } = checkIntegrity(campaign)
    expect(danglingReferences).toEqual([])
  })

  it('has no unreachable cards', () => {
    const { unreachableCards } = checkIntegrity(campaign)
    expect(unreachableCards).toEqual([])
  })

  it('every deck card id resolves to a real card', () => {
    for (const id of campaign.deckCardIds) {
      expect(campaign.cards[id]).toBeDefined()
    }
  })

  it('the start card, market day card, and every Colossus card exist', () => {
    expect(campaign.cards[campaign.startCardId]).toBeDefined()
    expect(campaign.cards[campaign.marketDayCardId]).toBeDefined()
    for (const id of campaign.colossusCardIds) {
      expect(campaign.cards[id]).toBeDefined()
    }
  })
})
