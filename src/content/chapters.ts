import type { ChapterNumber } from '../engine/types'

// Display metadata only. Which chapter is active is engine logic: see
// currentChapter() in engine/selectors.ts.

export interface ChapterDefinition {
  number: ChapterNumber
  name: string
  requiredColossiDefeated: number
  baseTier: number
}

export const CHAPTERS: Record<ChapterNumber, ChapterDefinition> = {
  1: {
    number: 1,
    name: 'Merchant City',
    requiredColossiDefeated: 0,
    baseTier: 1,
  },
  2: {
    number: 2,
    name: 'Underworld Rising',
    requiredColossiDefeated: 1,
    baseTier: 2,
  },
  3: {
    number: 3,
    name: 'Warfare & Conflict',
    requiredColossiDefeated: 2,
    baseTier: 3,
  },
  4: {
    number: 4,
    name: 'Banking & Finance',
    requiredColossiDefeated: 3,
    baseTier: 4,
  },
  5: {
    number: 5,
    name: 'Plague & Decay',
    requiredColossiDefeated: 4,
    baseTier: 5,
  },
  6: {
    number: 6,
    name: 'Betrayal',
    requiredColossiDefeated: 5,
    baseTier: 6,
  },
  7: {
    number: 7,
    name: 'Transcendence',
    requiredColossiDefeated: 6,
    baseTier: 7,
  },
}
