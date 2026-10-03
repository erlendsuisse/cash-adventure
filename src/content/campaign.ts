import type { Campaign, StoryCard } from '../engine/types'
import { colossus01Cards } from './cards/colossus01'
import { colossus02Cards } from './cards/colossus02-inquisitor'
import { colossus03Cards } from './cards/colossus03-tide'
import { colossus04Cards } from './cards/colossus04-machine'
import { colossus05Cards } from './cards/colossus05-plague'
import { colossus06Cards } from './cards/colossus06-betrayal'
import { colossus07Cards } from './cards/colossus07-mirror'
import { deckCards } from './cards/deck'
import { prologueCards } from './cards/prologue'
import { marketDayCard } from './cards/systemCards'
import { expansionCards } from './cards/expansion'
import { storyExpansionCards } from './cards/story-expansion'
import { storyExpansion2Cards } from './cards/story-expansion-2'
import { storyEventCards } from './cards/story-events'
import { recoveryPhaseCards } from './cards/recovery-phase'
import { recoveryDeckCards } from './cards/recovery-deck'
import { adventureDeckCards } from './cards/adventure-deck'
import { statTrainingCards } from './cards/stat-training'
import { assetLiquidationCards } from './cards/asset-liquidation'
import { marketEventCards } from './cards/market-events'
import { narrativeConsequenceCards } from './cards/narrative-consequences'
import { colossuAftermath } from './cards/colossus-aftermath'
import { colossiInvestigationCards } from './cards/colossi-investigation'
import { wealthBuildingDeck } from './cards/wealth-building'
import { commodityTradingCards } from './cards/commodity-trading'
import { opportunityDealCards } from './cards/opportunity-deals'
import { dangerCards } from './cards/dangers-and-penalties'
import { chapterOneCards, chapterTwoCards, chapterThreeCards, chapterFourCards } from './cards/chapter-decks'
import { marketOpportunityCards } from './cards/market-opportunities'
import { chapter2CommodityCards, chapter2MarketCards, chapter2DangerCards } from './cards/chapter-2-underworld'
import { chapter2VentureCards, chapter2StoryCards, chapter2MoreMarketCards, chapter2MoreDangerCards, chapter2RecoveryCards } from './cards/chapter-2-expanded'
import { chapter3CommodityCards, chapter3MarketCards, chapter3DangerCards } from './cards/chapter-3-warfare'
import { chapter3MilitaryVentureCards, chapter3WarScenarioCards, chapter3WarEconomyCards, chapter3WarDangerCards, chapter3RecoveryCards } from './cards/chapter-3-expanded'
import { chapter4CommodityCards, chapter4MarketCards, chapter4DangerCards } from './cards/chapter-4-banking'
import { chapter5CommodityCards, chapter5MarketCards, chapter5DangerCards } from './cards/chapter-5-plague'
import { chapter6CommodityCards, chapter6MarketCards, chapter6DangerCards } from './cards/chapter-6-betrayal'
import { chapter7CommodityCards, chapter7MarketCards, chapter7DangerCards } from './cards/chapter-7-transcendence'
import { consequenceTuning, initial, SECTORS, tuning } from './tuning'

const allCards: StoryCard[] = [
  ...prologueCards,
  ...deckCards,
  ...opportunityDealCards,
  ...wealthBuildingDeck,
  ...commodityTradingCards,
  ...marketOpportunityCards,
  ...dangerCards,
  ...chapterOneCards,
  ...chapterTwoCards,
  ...chapterThreeCards,
  ...chapterFourCards,
  ...chapter2CommodityCards,
  ...chapter2MarketCards,
  ...chapter2DangerCards,
  ...chapter2VentureCards,
  ...chapter2StoryCards,
  ...chapter2MoreMarketCards,
  ...chapter2MoreDangerCards,
  ...chapter2RecoveryCards,
  ...chapter3CommodityCards,
  ...chapter3MarketCards,
  ...chapter3DangerCards,
  ...chapter3MilitaryVentureCards,
  ...chapter3WarScenarioCards,
  ...chapter3WarEconomyCards,
  ...chapter3WarDangerCards,
  ...chapter3RecoveryCards,
  ...chapter4CommodityCards,
  ...chapter4MarketCards,
  ...chapter4DangerCards,
  ...chapter5CommodityCards,
  ...chapter5MarketCards,
  ...chapter5DangerCards,
  ...chapter6CommodityCards,
  ...chapter6MarketCards,
  ...chapter6DangerCards,
  ...chapter7CommodityCards,
  ...chapter7MarketCards,
  ...chapter7DangerCards,
  ...adventureDeckCards,
  ...storyEventCards,
  ...statTrainingCards,
  ...assetLiquidationCards,
  ...marketEventCards,
  ...colossiInvestigationCards,
  ...recoveryDeckCards,
  ...recoveryPhaseCards,
  ...narrativeConsequenceCards,
  ...colossuAftermath,
  marketDayCard,
  ...expansionCards,
  ...storyExpansionCards,
  ...storyExpansion2Cards,
  ...colossus01Cards,
  ...colossus02Cards,
  ...colossus03Cards,
  ...colossus04Cards,
  ...colossus05Cards,
  ...colossus06Cards,
  ...colossus07Cards,
]

const cards: Record<string, StoryCard> = {}
for (const card of allCards) {
  cards[card.id] = card
}

const allDeckCards = [
  ...deckCards,
  ...adventureDeckCards,
  ...storyEventCards,
  ...statTrainingCards,
  ...assetLiquidationCards,
  ...marketEventCards,
  ...colossiInvestigationCards,
  ...expansionCards,
  ...storyExpansionCards,
  ...storyExpansion2Cards,
  ...recoveryDeckCards,
  ...recoveryPhaseCards,
  ...narrativeConsequenceCards,
  ...colossuAftermath,
  ...opportunityDealCards,
  ...wealthBuildingDeck,
  ...commodityTradingCards,
  ...marketOpportunityCards,
  ...dangerCards,
  ...chapterOneCards,
  ...chapterTwoCards,
  ...chapterThreeCards,
  ...chapterFourCards,
  ...chapter2CommodityCards,
  ...chapter2MarketCards,
  ...chapter2DangerCards,
  ...chapter2VentureCards,
  ...chapter2StoryCards,
  ...chapter2MoreMarketCards,
  ...chapter2MoreDangerCards,
  ...chapter2RecoveryCards,
  ...chapter3CommodityCards,
  ...chapter3MarketCards,
  ...chapter3DangerCards,
  ...chapter3MilitaryVentureCards,
  ...chapter3WarScenarioCards,
  ...chapter3WarEconomyCards,
  ...chapter3WarDangerCards,
  ...chapter3RecoveryCards,
  ...chapter4CommodityCards,
  ...chapter4MarketCards,
  ...chapter4DangerCards,
  ...chapter5CommodityCards,
  ...chapter5MarketCards,
  ...chapter5DangerCards,
  ...chapter6CommodityCards,
  ...chapter6MarketCards,
  ...chapter6DangerCards,
  ...chapter7CommodityCards,
  ...chapter7MarketCards,
  ...chapter7DangerCards,
]

export const campaign: Campaign = Object.freeze({
  startCardId: 'prologue',
  cards: Object.freeze(cards),
  deckCardIds: allDeckCards.filter((c) => c.weight !== undefined).map((c) => c.id),
  sectors: SECTORS,
  colossusCardIds: ['colossus01_start', 'colossus02_start', 'colossus03_start', 'colossus04_start', 'colossus05_start', 'colossus06_start', 'colossus07_start'],
  colossusPathCards: {
    mafia: 'colossus01_start',        // Ledger-Wyrm: financial reckoning
    police: 'colossus02_start',       // The Inquisitor: moral judgment
    war: 'colossus03_start',          // The Tide: uncontrollable chaos
    banking: 'colossus04_start',      // The Machine: market disruption
  },
  marketDayCardId: marketDayCard.id,
  tuning,
  consequenceTuning,
  initial,
})
