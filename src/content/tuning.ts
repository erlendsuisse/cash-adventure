import type { Campaign, ConsequenceTuning, SectorId, Tuning } from '../engine/types'

export const SECTORS: SectorId[] = ['salt', 'spice', 'iron']

export const tuning: Tuning = {
  marketDayInterval: 14,
  marketDriftRange: 4,
  freedomDaysToTrial: 21,
  daysPerTurn: 2,
  paydayInterval: 7,
}

export const consequenceTuning: ConsequenceTuning = {
  mafia: { flagId: 'mafia_trigger', threshold: 3 },
  police: { flagId: 'police_trigger', threshold: 3 },
  war: { flagId: 'war_trigger', threshold: 3 },
  banking: { flagId: 'banking_trigger', threshold: 3 },
}

export const initial: Campaign['initial'] = {
  stats: { grit: 2, savvy: 2, charm: 2, nerve: 2 },
  finances: { gold: 50, wages: 0, monthlyExpenses: 20, debt: 0, assets: [], commodities: { spice: 0, salt: 0, iron: 0 } },
  market: { salt: 100, spice: 100, iron: 100 },
}
