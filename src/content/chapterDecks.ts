import type { ChapterNumber, StoryCard } from '../engine/types'
import { chapter2IntroCards, chapter3IntroCards, chapter4IntroCards, chapter5IntroCards } from './cards/chapter-decks'
import { chapter2CommodityCards, chapter2DangerCards, chapter2MarketCards } from './cards/chapter-2-underworld'
import { chapter2MoreDangerCards, chapter2MoreMarketCards, chapter2RecoveryCards, chapter2StoryCards, chapter2VentureCards } from './cards/chapter-2-expanded'
import { chapter3CommodityCards, chapter3DangerCards, chapter3MarketCards } from './cards/chapter-3-warfare'
import { chapter3MilitaryVentureCards, chapter3RecoveryCards, chapter3WarDangerCards, chapter3WarEconomyCards, chapter3WarScenarioCards } from './cards/chapter-3-expanded'
import { chapter4CommodityCards, chapter4DangerCards, chapter4MarketCards } from './cards/chapter-4-banking'
import { chapter5CommodityCards, chapter5DangerCards, chapter5MarketCards } from './cards/chapter-5-plague'
import { chapter6CommodityCards, chapter6DangerCards, chapter6MarketCards } from './cards/chapter-6-betrayal'
import { chapter7CommodityCards, chapter7DangerCards, chapter7MarketCards } from './cards/chapter-7-transcendence'
import { defineChapterDeck } from './cards/factories'
import {
  chapter2TraderVentures,
  chapter3TraderVentures,
  chapter4TraderVentures,
  chapter5TraderVentures,
  chapter6TraderVentures,
  chapter7TraderVentures,
} from './cards/trader-ventures'

// The one place chapter content is registered. Each deck's cards get `chapter`
// stamped here, so card files never set it. Chapter decks should not set
// `storyPhase` either: by chapter 2 the phase is always 'recovery', so a phase
// gate can only ever hide a chapter card, never help it (content.test.ts checks).
export const CHAPTER_DECKS: Partial<Record<ChapterNumber, StoryCard[]>> = {
  2: defineChapterDeck(2, [
    ...chapter2IntroCards,
    ...chapter2CommodityCards,
    ...chapter2MarketCards,
    ...chapter2DangerCards,
    ...chapter2VentureCards,
    ...chapter2StoryCards,
    ...chapter2MoreMarketCards,
    ...chapter2MoreDangerCards,
    ...chapter2RecoveryCards,
    ...chapter2TraderVentures,
  ]),
  3: defineChapterDeck(3, [
    ...chapter3IntroCards,
    ...chapter3CommodityCards,
    ...chapter3MarketCards,
    ...chapter3DangerCards,
    ...chapter3MilitaryVentureCards,
    ...chapter3WarScenarioCards,
    ...chapter3WarEconomyCards,
    ...chapter3WarDangerCards,
    ...chapter3RecoveryCards,
    ...chapter3TraderVentures,
  ]),
  4: defineChapterDeck(4, [...chapter4IntroCards, ...chapter4CommodityCards, ...chapter4MarketCards, ...chapter4DangerCards, ...chapter4TraderVentures]),
  5: defineChapterDeck(5, [...chapter5IntroCards, ...chapter5CommodityCards, ...chapter5MarketCards, ...chapter5DangerCards, ...chapter5TraderVentures]),
  6: defineChapterDeck(6, [...chapter6CommodityCards, ...chapter6MarketCards, ...chapter6DangerCards, ...chapter6TraderVentures]),
  7: defineChapterDeck(7, [...chapter7CommodityCards, ...chapter7MarketCards, ...chapter7DangerCards, ...chapter7TraderVentures]),
}
