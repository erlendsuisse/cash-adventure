import { checkConsequenceTrigger, checkTrialTrigger } from './colossi'
import { rollDie } from './rng'
import { currentChapter, isFree, totalMonthlyIncome } from './selectors'
import type { Campaign, GameState } from './types'

/** Advances the systemic clock by `daysAdvanced` days (already applied to
 *  state.clock.day by an `advanceDays` effect). Walks day-by-day so market
 *  ticks and freedom-day accrual land on the right boundaries even when a
 *  single choice skips many days at once. */
export function tick(state: GameState, daysAdvanced: number, campaign: Campaign): GameState {
  let s = state
  const startDay = state.clock.day - daysAdvanced
  for (let i = 1; i <= daysAdvanced; i++) {
    s = tickOneDay(s, startDay + i, campaign)
  }
  return s
}

function tickOneDay(state: GameState, day: number, campaign: Campaign): GameState {
  const freedomDays = isFree(state) ? state.progress.freedomDays + 1 : 0
  let s: GameState = { ...state, progress: { ...state.progress, freedomDays } }

  if (day >= s.clock.nextPayday) {
    const net = totalMonthlyIncome(s) - s.finances.monthlyExpenses
    s = {
      ...s,
      finances: { ...s.finances, gold: s.finances.gold + net },
      clock: { ...s.clock, nextPayday: day + campaign.tuning.paydayInterval },
      log: [...s.log, { day, text: `Payday: ${net >= 0 ? '+' : ''}${net} gold.` }],
    }
  }

  if (day >= s.clock.nextMarketDay) {
    s = driftMarket(s, campaign)
    s = {
      ...s,
      clock: { ...s.clock, nextMarketDay: day + campaign.tuning.marketDayInterval },
      pendingCards: [...s.pendingCards, campaign.marketDayCardId],
    }
  }

  s = checkConsequenceTrigger(s, campaign)
  return checkTrialTrigger(s, campaign)
}

/** Market day: each sector wobbles randomly and, if the current chapter has a
 *  market regime, is pulled part of the way toward that chapter's target -
 *  so war drives iron up over a few market days rather than overnight, and
 *  prices keep moving after the chapter that set them. */
function driftMarket(state: GameState, campaign: Campaign): GameState {
  let rng = state.rng
  const market = { ...state.market }
  const regime = campaign.marketRegimes?.[currentChapter(state)]
  const range = regime?.volatility ?? campaign.tuning.marketDriftRange
  const spread = range * 2 + 1
  for (const sector of campaign.sectors) {
    const rolled = rollDie(rng, spread)
    rng = rolled.rng
    const current = market[sector] ?? 100
    const target = regime?.target[sector]
    const pull = target === undefined ? 0 : Math.round((target - current) * regime!.pull)
    market[sector] = Math.max(10, current + pull + rolled.roll - (range + 1))
  }
  return { ...state, rng, market }
}
