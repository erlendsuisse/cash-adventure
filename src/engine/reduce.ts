import { formatCheck, resolveCheck } from './checks'
import { drawCard, recordDraw } from './director'
import { tick } from './economy'
import { applyAll } from './effects'
import { newGame } from './init'
import { commodityBuyPrice, commodityPrice } from './selectors'
import { isMet } from './requirements'
import type { Action, Campaign, CardId, Commodity, EffectSummary, GameState } from './types'

export function reduce(state: GameState, action: Action, campaign: Campaign): GameState {
  switch (action.type) {
    case 'restart':
      return newGame(action.seed, campaign)
    case 'choose':
      return applyChoose(state, action.choiceId, campaign)
    case 'advance':
      return applyAdvance(state, campaign)
    case 'takeLoan':
      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold + action.principal,
          debt: state.finances.debt + action.principal,
          monthlyExpenses: state.finances.monthlyExpenses + action.monthlyPayment,
          loanPayments: (state.finances.loanPayments ?? 0) + action.monthlyPayment,
        },
        log: [...state.log, { day: state.clock.day, text: `Took loan: +${action.principal}g (payment: ${action.monthlyPayment}g/month)` }],
      }
    case 'payLoan': {
      const oldDebt = state.finances.debt
      // Can't pay with gold you don't have, or pay off more than you owe.
      const paid = Math.min(action.amount, oldDebt)
      if (paid <= 0 || paid > state.finances.gold) return state
      const proportionPaid = paid / oldDebt
      // Only the loan-servicing share of expenses goes away, never base living costs.
      const loanPayments = state.finances.loanPayments ?? 0
      const expenseReduction = Math.round(loanPayments * proportionPaid)

      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold - paid,
          debt: oldDebt - paid,
          monthlyExpenses: Math.max(0, state.finances.monthlyExpenses - expenseReduction),
          loanPayments: loanPayments - expenseReduction,
        },
        log: [...state.log, { day: state.clock.day, text: `Paid loan: −${paid}g (−${expenseReduction}g/month)` }],
      }
    }
    case 'sellCommodity': {
      // Priced by the engine from the market - the client's price is never trusted.
      const amount = Math.min(Math.max(0, Math.floor(action.amount)), state.finances.commodities[action.commodity])
      if (amount === 0) return state
      const price = commodityPrice(state, campaign, action.commodity)
      const totalValue = amount * price
      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold + totalValue,
          commodities: { ...state.finances.commodities, [action.commodity]: state.finances.commodities[action.commodity] - amount },
        },
        log: [...state.log, { day: state.clock.day, text: `Sold ${amount} ${action.commodity} for ${totalValue}g (${price}g each)` }],
      }
    }
    case 'buyCommodity': {
      const amount = Math.max(0, Math.floor(action.amount))
      const price = commodityBuyPrice(state, campaign, action.commodity)
      const totalCost = amount * price
      if (amount === 0 || totalCost > state.finances.gold) return state
      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold - totalCost,
          commodities: { ...state.finances.commodities, [action.commodity]: state.finances.commodities[action.commodity] + amount },
        },
        log: [...state.log, { day: state.clock.day, text: `Bought ${amount} ${action.commodity} for ${totalCost}g (${price}g each)` }],
      }
    }
    case 'sellAsset': {
      const asset = state.finances.assets.find((a) => a.id === action.id)
      if (!asset) return state

      const salePrice = Math.round(asset.cost * action.priceMultiplier)

      // Passive income is derived from owned assets, so removing the asset is
      // the whole cashflow change - expenses are untouched.
      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold + salePrice,
          assets: state.finances.assets.filter((a) => a.id !== action.id),
        },
        log: [
          ...state.log,
          {
            day: state.clock.day,
            text: `Sold ${asset.label} for ${salePrice}g (${Math.round(action.priceMultiplier * 100)}% of value)`,
          },
        ],
      }
    }
  }
}

function calculateEffectSummary(before: GameState, after: GameState, campaign: Campaign): EffectSummary {
  const statDeltas: Record<string, number> = {}
  for (const stat of ['grit', 'savvy', 'charm', 'nerve'] as const) {
    const delta = after.stats[stat] - before.stats[stat]
    if (delta !== 0) statDeltas[stat] = delta
  }

  const assetsGained = after.finances.assets
    .filter((a) => !before.finances.assets.find((b) => b.id === a.id))
    .map((a) => a.label)

  const assetsLost = before.finances.assets
    .filter((a) => !after.finances.assets.find((b) => b.id === a.id))
    .map((a) => a.label)

  const flagsSet = Object.entries(after.flags)
    .filter(([id, value]) => (before.flags[id] ?? 0) !== value && value > 0)
    .map(([id]) => id)

  const commodities: Partial<Record<Commodity, number>> = {}
  for (const c of ['spice', 'salt', 'iron'] as const) {
    const delta = after.finances.commodities[c] - before.finances.commodities[c]
    if (delta !== 0) commodities[c] = delta
  }

  const trackedFlagDeltas: Record<string, number> = {}
  for (const id of campaign.trackedFlags ?? []) {
    const delta = (after.flags[id] ?? 0) - (before.flags[id] ?? 0)
    if (delta !== 0) trackedFlagDeltas[id] = delta
  }

  return {
    stats: statDeltas,
    gold: after.finances.gold - before.finances.gold,
    wages: after.finances.wages - before.finances.wages,
    monthlyExpenses: after.finances.monthlyExpenses - before.finances.monthlyExpenses,
    debt: after.finances.debt - before.finances.debt,
    assetsGained,
    assetsLost,
    flagsSet,
    commodities,
    trackedFlagDeltas,
  }
}

function hasSignificantEffects(summary: EffectSummary): boolean {
  return (
    Object.keys(summary.stats).length > 0 ||
    summary.gold !== 0 ||
    summary.wages !== 0 ||
    summary.monthlyExpenses !== 0 ||
    summary.debt !== 0 ||
    summary.assetsGained.length > 0 ||
    summary.assetsLost.length > 0 ||
    Object.keys(summary.commodities).length > 0 ||
    Object.keys(summary.trackedFlagDeltas).length > 0
  )
}

function applyChoose(state: GameState, choiceId: string, campaign: Campaign): GameState {
  // An outcome on screen must be acknowledged (advance) first; choosing again
  // would re-apply the same card's choice.
  if (state.pendingOutcome) return state
  const card = campaign.cards[state.currentCardId]
  if (!card) return state
  const choice = card.choices.find((c) => c.id === choiceId)
  if (!choice) return state
  if ((choice.requires ?? []).some((r) => !isMet(r, state))) return state

  let working = state
  let target: CardId | undefined

  if (choice.check) {
    const { result, outcome, rng } = resolveCheck(choice.check, working)
    working = { ...working, rng, log: [...working.log, { day: working.clock.day, text: formatCheck(result) }] }
    if (outcome.text) working = { ...working, log: [...working.log, { day: working.clock.day, text: outcome.text }] }
    const beforeOutcome = working
    working = applyAll(outcome.effects ?? [], working, campaign)
    target = outcome.goto

    // If check outcome has no goto, show outcome on card and wait for advance
    if (!target) {
      const summary = calculateEffectSummary(beforeOutcome, working, campaign)
      return { ...working, pendingOutcome: { text: outcome.text, checkResult: result, ...(hasSignificantEffects(summary) ? { effectSummary: summary } : {}) } }
    }
  } else {
    const before = working
    working = applyAll(choice.effects ?? [], working, campaign)
    target = choice.goto

    // If regular choice has effects, show a summary before proceeding
    const summary = calculateEffectSummary(before, working, campaign)
    if (hasSignificantEffects(summary) && !target) {
      return { ...working, pendingOutcome: { text: 'Effects applied.', effectSummary: summary } }
    }
  }

  return resolveNext(state, working, target, campaign)
}

function applyAdvance(state: GameState, campaign: Campaign): GameState {
  // If waiting on pending outcome, clear it and advance
  if (state.pendingOutcome) {
    return resolveNext(state, state, undefined, campaign)
  }

  const card = campaign.cards[state.currentCardId]
  if (!card || !card.next) return state
  return resolveNext(state, state, card.next, campaign)
}

/** Shared tail for both actions: advance the clock by one turn (plus any
 *  authored advanceDays on top), run the economy for the elapsed days,
 *  resolve the next card id, and enter it. Priority: an authored goto (so
 *  chains like a Colossus trial aren't cut), then the oldest queued interrupt,
 *  then a fresh random draw. Drawing only when the queue is empty matters: a
 *  draw parked behind an interrupt would play turns later, after the phase or
 *  chapter that made it eligible has passed. */
function resolveNext(before: GameState, working: GameState, explicitTarget: CardId | undefined, campaign: Campaign): GameState {
  const authoredDays = working.clock.day - before.clock.day
  const daysAdvanced = authoredDays + campaign.tuning.daysPerTurn
  let s: GameState = { ...working, clock: { ...working.clock, day: before.clock.day + daysAdvanced } }
  s = tick(s, daysAdvanced, campaign)
  if (s.status !== 'playing') return s

  if (explicitTarget) return enterCard(s, explicitTarget, campaign)

  const [queued, ...rest] = s.pendingCards
  if (queued) return enterCard({ ...s, pendingCards: rest }, queued, campaign)

  const drawn = drawCard(s, campaign)
  return enterCard({ ...s, rng: drawn.rng }, drawn.cardId ?? campaign.startCardId, campaign)
}

function enterCard(state: GameState, cardId: CardId, campaign: Campaign): GameState {
  const card = campaign.cards[cardId]
  let s: GameState = {
    ...state,
    currentCardId: cardId,
    recentlyDrawn: recordDraw(state.recentlyDrawn, cardId),
    seenCardIds: state.seenCardIds.includes(cardId) ? state.seenCardIds : [...state.seenCardIds, cardId],
    log: [...state.log, { day: state.clock.day, text: card?.title ? `-- ${card.title} --` : `-- ${cardId} --` }],
    pendingOutcome: undefined, // Clear pending outcome when entering new card
  }
  if (card) s = applyAll(card.onEnter ?? [], s, campaign)
  return s
}
