import type { GameState } from './types'

export function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    version: 1,
    rng: { seed: 1, cursor: 0 },
    stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 },
    finances: { gold: 100, wages: 0, monthlyExpenses: 20, debt: 0, assets: [] },
    market: { salt: 100, spice: 100, iron: 100 },
    flags: {},
    progress: { colossiDefeated: 0, boons: [], freedomDays: 0, tier: 1, storyPhase: 'early_game', currentPath: undefined },
    currentCardId: 'test_card',
    pendingCards: [],
    recentlyDrawn: [],
    seenCardIds: [],
    clock: { day: 0, nextMarketDay: 14, nextPayday: 7 },
    log: [],
    status: 'playing',
    character: { equipmentSlots: { headgear: null, clothing: null, accessories: null } },
    ...overrides,
  }
}
