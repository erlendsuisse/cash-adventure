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
import { marketOpportunityCards } from './cards/market-opportunities'
import { CHAPTER_DECKS } from './chapterDecks'
import { consequenceTuning, initial, SECTORS, tuning } from './tuning'

const allCards: StoryCard[] = [
  ...prologueCards,
  ...deckCards,
  ...opportunityDealCards,
  ...wealthBuildingDeck,
  ...commodityTradingCards,
  ...marketOpportunityCards,
  ...dangerCards,
  ...Object.values(CHAPTER_DECKS).flat(),
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
  // Fail loudly: a duplicate id would silently replace the earlier card.
  if (cards[card.id]) throw new Error(`Duplicate card id: ${card.id}`)
  cards[card.id] = card
}


export const campaign: Campaign = Object.freeze({
  startCardId: 'prologue',
  cards: Object.freeze(cards),
  // Every weighted card is drawable; there is no separate deck list to keep in sync.
  deckCardIds: allCards.filter((c) => c.weight !== undefined).map((c) => c.id),
  sectors: SECTORS,
  colossusCardIds: ['colossus01_start', 'colossus02_start', 'colossus03_start', 'colossus04_start', 'colossus05_start', 'colossus06_start', 'colossus07_start'],
  marketDayCardId: marketDayCard.id,
  tuning,
  consequenceTuning,
  initial,
})
