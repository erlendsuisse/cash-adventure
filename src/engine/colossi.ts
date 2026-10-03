import type { Campaign, CardId, ConsequencePath, GameState } from './types'

export const COLOSSI_TO_WIN = 7

/** If the player has held freedom long enough and a Colossus remains,
 *  cuts its trial-start card to the front of the queue and resets the
 *  freedom-day counter - being called to a trial ends the streak that
 *  summoned it, which is also what stops this from re-triggering every
 *  single day for the several turns the trial itself takes to resolve. */
export function checkTrialTrigger(state: GameState, campaign: Campaign): GameState {
  const nextColossus = summonableColossus(state, campaign)
  if (!nextColossus) return state
  if (state.progress.freedomDays < campaign.tuning.freedomDaysToTrial) return state

  return {
    ...state,
    progress: { ...state.progress, freedomDays: 0 },
    pendingCards: [nextColossus, ...state.pendingCards],
  }
}

/** The next Colossus's trial-start card, unless every Colossus is beaten or
 *  that trial is already queued or under way (its start card has been seen but
 *  the reckoning that counts the defeat hasn't happened yet). */
function summonableColossus(state: GameState, campaign: Campaign): CardId | undefined {
  const next = campaign.colossusCardIds[state.progress.colossiDefeated]
  if (!next) return undefined
  if (state.pendingCards.includes(next) || state.seenCardIds.includes(next)) return undefined
  return next
}

/** Heat on a consequence path (a trigger flag at its threshold) pulls the next
 *  Colossus forward, freedom or not, and colours the run with that path.
 *  Colossi always come in order - the path never picks which one. The trigger
 *  flag resets either way: heat that builds while a trial is already coming
 *  folds into that trial instead of summoning a second one straight after. */
export function checkConsequenceTrigger(state: GameState, campaign: Campaign): GameState {
  if (!campaign.consequenceTuning) return state
  if (!campaign.colossusCardIds[state.progress.colossiDefeated]) return state

  const paths: ConsequencePath[] = ['mafia', 'police', 'war', 'banking']

  for (const path of paths) {
    const tuning = campaign.consequenceTuning[path]
    if (!tuning) continue

    const flagValue = state.flags[tuning.flagId] ?? 0

    if (flagValue >= tuning.threshold) {
      const nextColossus = summonableColossus(state, campaign)
      return {
        ...state,
        progress: { ...state.progress, currentPath: path },
        flags: { ...state.flags, [tuning.flagId]: 0 },
        pendingCards: nextColossus ? [nextColossus, ...state.pendingCards] : state.pendingCards,
      }
    }
  }

  return state
}

export function isVictory(state: GameState): boolean {
  return state.progress.colossiDefeated >= COLOSSI_TO_WIN
}
