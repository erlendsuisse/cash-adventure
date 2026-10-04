import { applyAll } from './effects'
import type { Campaign, GameState } from './types'

export function newGame(seed: number, campaign: Campaign): GameState {
  const startCard = campaign.cards[campaign.startCardId]

  const state: GameState = {
    version: 1,
    rng: { seed, cursor: 0 },
    stats: { ...campaign.initial.stats },
    finances: { ...campaign.initial.finances, assets: [...campaign.initial.finances.assets] },
    market: { ...campaign.initial.market },
    flags: {},
    progress: { colossiDefeated: 0, boons: [], freedomDays: 0, tier: 1, storyPhase: 'early_game', currentPath: undefined },
    currentCardId: campaign.startCardId,
    pendingCards: [],
    recentlyDrawn: [],
    seenCardIds: [],
    clock: { day: 0, nextMarketDay: campaign.tuning.marketDayInterval, nextPayday: campaign.tuning.paydayInterval },
    log: [{ day: 0, text: startCard?.title ? `-- ${startCard.title} --` : '-- Begin --' }],
    status: 'playing',
    character: { equipmentSlots: { headgear: null, clothing: null, accessories: null } },
  }

  return startCard ? applyAll(startCard.onEnter ?? [], state, campaign) : state
}
