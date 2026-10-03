import type { Campaign, ConsequencePath, GameState } from './types'

export const COLOSSI_TO_WIN = 7

/** If the player has held freedom long enough and a Colossus remains,
 *  cuts its trial-start card to the front of the queue and resets the
 *  freedom-day counter - being called to a trial ends the streak that
 *  summoned it, which is also what stops this from re-triggering every
 *  single day for the several turns the trial itself takes to resolve. */
export function checkTrialTrigger(state: GameState, campaign: Campaign): GameState {
  const nextColossus = campaign.colossusCardIds[state.progress.colossiDefeated]
  if (!nextColossus) return state
  if (state.progress.freedomDays < campaign.tuning.freedomDaysToTrial) return state

  return {
    ...state,
    progress: { ...state.progress, freedomDays: 0 },
    pendingCards: [nextColossus, ...state.pendingCards],
  }
}

/** Checks if any consequence path has been triggered by accumulated flags.
 *  If triggered, queues the path's colossus card and sets currentPath.
 *  Resets the trigger flag to prevent re-triggering. */
export function checkConsequenceTrigger(state: GameState, campaign: Campaign): GameState {
  if (!campaign.consequenceTuning || !campaign.colossusPathCards) return state

  const paths: ConsequencePath[] = ['mafia', 'police', 'war', 'banking']

  for (const path of paths) {
    const tuning = campaign.consequenceTuning[path]
    if (!tuning) continue

    const flagValue = state.flags[tuning.flagId] ?? 0

    if (flagValue >= tuning.threshold) {
      const colossusCardId = campaign.colossusPathCards[path]
      if (!colossusCardId) continue

      return {
        ...state,
        progress: { ...state.progress, currentPath: path },
        flags: { ...state.flags, [tuning.flagId]: 0 },
        pendingCards: [colossusCardId, ...state.pendingCards],
      }
    }
  }

  return state
}

export function isVictory(state: GameState): boolean {
  return state.progress.colossiDefeated >= COLOSSI_TO_WIN
}
