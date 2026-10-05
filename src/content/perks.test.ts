import { describe, expect, it } from 'vitest'
import { campaign } from './campaign'
import { cardEffects } from './integrity'
import { PERKS, SHOP } from './perks'
import { CHAPTER_DECKS } from './chapterDecks'
import type { ChapterNumber } from '../engine/types'

const cards = Object.values(campaign.cards)

describe('perks and the Guild Hall', () => {
  it('every boon a card grants is a perk the player can see', () => {
    const granted = new Set(cards.flatMap((c) => cardEffects(c).flatMap((e) => (e.kind === 'grantBoon' ? [e.boon] : []))))
    for (const boon of granted) expect(PERKS[boon], boon).toBeDefined()
  })

  it('everything in the Guild Hall is a real, sellable item', () => {
    const ids = new Set<string>()
    for (const item of SHOP) {
      expect(ids.has(item.id), `duplicate ${item.id}`).toBe(false)
      ids.add(item.id)
      expect(item.price).toBeGreaterThan(0)
      expect(item.limit).toBeGreaterThan(0)
      for (const e of item.effects) if (e.kind === 'grantBoon') expect(PERKS[e.boon], e.boon).toBeDefined()
    }
    // Something to buy from the very first chapter
    expect(SHOP.filter((i) => i.fromChapter === 1).length).toBeGreaterThanOrEqual(4)
  })

  it('every class has its own masterclass, gear and skill in the Guild Hall, each with a story', () => {
    for (const classId of Object.keys(campaign.heroClasses!)) {
      const own = SHOP.filter((i) => i.requires?.some((r) => r.kind === 'heroClass' && r.id === classId))
      expect(own.map((i) => i.kind).sort(), classId).toEqual(['gear', 'skill', 'training'])
    }
    for (const item of SHOP) expect(item.story, item.id).toBeTruthy()
  })

  it('every chapter has a mentor and a training card', () => {
    for (const chapter of [1, 2, 3, 4, 5, 6, 7] as ChapterNumber[]) {
      const ids = (CHAPTER_DECKS[chapter] ?? []).map((c) => c.id)
      expect(ids, `chapter ${chapter}`).toContain(`mentor_ch${chapter}`)
      expect(ids, `chapter ${chapter}`).toContain(`training_ch${chapter}`)
    }
  })

  it('every Colossus trial can be faced your own way, with the same reputation backing', () => {
    const trials = cards.filter((c) => /^colossus0\d_trial/.test(c.id))
    expect(trials.length).toBeGreaterThanOrEqual(7)
    for (const trial of trials) {
      const own = trial.choices.find((c) => c.check?.stat === 'best')
      expect(own, trial.id).toBeDefined()
      expect((own!.check!.bonuses ?? []).length, trial.id).toBeGreaterThan(0)
    }
  })

  it('chapters 2 and 3 give every attribute something to roll for', () => {
    for (const chapter of [2, 3] as ChapterNumber[]) {
      const stats = new Set((CHAPTER_DECKS[chapter] ?? []).flatMap((c) => c.choices.flatMap((ch) => (ch.check ? [ch.check.stat] : []))))
      for (const stat of ['grit', 'savvy', 'charm', 'nerve']) expect(stats.has(stat as never), `chapter ${chapter} ${stat}`).toBe(true)
    }
  })
})
