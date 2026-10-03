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
import { consequenceTuning, initial, SECTORS, tuning } from './tuning'

const allCards: StoryCard[] = [
  ...prologueCards,
  ...deckCards,
  ...wealthBuildingDeck,
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
