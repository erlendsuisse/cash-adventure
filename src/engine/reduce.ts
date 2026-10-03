import { formatCheck, resolveCheck } from './checks'
import { drawCard, recordDraw } from './director'
import { tick } from './economy'
import { applyAll } from './effects'
import { newGame } from './init'
import { isMet } from './requirements'
import type { Action, Campaign, CardId, EffectSummary, GameState } from './types'

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
        },
        log: [...state.log, { day: state.clock.day, text: `Took loan: +${action.principal}g (payment: ${action.monthlyPayment}g/month)` }],
      }
    case 'payLoan': {
      const oldDebt = state.finances.debt
      const newDebt = Math.max(0, oldDebt - action.amount)
      const debtReduction = oldDebt - newDebt
      const proportionPaid = oldDebt > 0 ? debtReduction / oldDebt : 0
      const expenseReduction = Math.round(state.finances.monthlyExpenses * proportionPaid)

      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold - action.amount,
          debt: newDebt,
          monthlyExpenses: Math.max(0, state.finances.monthlyExpenses - expenseReduction),
        },
        log: [...state.log, { day: state.clock.day, text: `Paid loan: −${action.amount}g (−${expenseReduction}g/month)` }],
      }
    }
    case 'sellCommodity': {
      const totalValue = action.amount * action.pricePerUnit
      const commodities = { ...state.finances.commodities }
      commodities[action.commodity] -= action.amount

      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold + totalValue,
          commodities,
        },
        log: [
          ...state.log,
          {
            day: state.clock.day,
            text: `Sold ${action.amount} units of ${action.commodity} for ${totalValue}g (${action.pricePerUnit}g/unit)`,
          },
        ],
      }
    }
    case 'buyCommodity': {
      const totalCost = action.amount * action.pricePerUnit
      if (totalCost > state.finances.gold) return state

      const commodities = { ...state.finances.commodities }
      commodities[action.commodity] += action.amount

      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold - totalCost,
          commodities,
        },
        log: [
          ...state.log,
          {
            day: state.clock.day,
            text: `Bought ${action.amount} units of ${action.commodity} for ${totalCost}g (${action.pricePerUnit}g/unit)`,
          },
        ],
      }
    }
    case 'sellAsset': {
      const asset = state.finances.assets.find((a) => a.id === action.id)
      if (!asset) return state

      const salePrice = Math.round(asset.cost * action.priceMultiplier)
      const expenseReduction = Math.max(0, asset.monthlyCashflow)

      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold + salePrice,
          assets: state.finances.assets.filter((a) => a.id !== action.id),
          monthlyExpenses: state.finances.monthlyExpenses - expenseReduction,
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

function calculateEffectSummary(before: GameState, after: GameState): EffectSummary {
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

  return {
    stats: statDeltas,
    gold: after.finances.gold - before.finances.gold,
    wages: after.finances.wages - before.finances.wages,
    monthlyExpenses: after.finances.monthlyExpenses - before.finances.monthlyExpenses,
    debt: after.finances.debt - before.finances.debt,
    assetsGained,
    assetsLost,
    flagsSet,
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
    summary.assetsLost.length > 0
  )
}

function applyChoose(state: GameState, choiceId: string, campaign: Campaign): GameState {
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
    working = applyAll(outcome.effects ?? [], working)
    target = outcome.goto

    // If check outcome has no goto, show outcome on card and wait for advance
    if (!target) {
      return { ...working, pendingOutcome: { text: outcome.text, checkResult: result } }
    }
  } else {
    const before = working
    working = applyAll(choice.effects ?? [], working)
    target = choice.goto

    // If regular choice has effects, show a summary before proceeding
    const summary = calculateEffectSummary(before, working)
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
 *  resolve the next card id (authored goto, else a random draw), and enter it. */
function resolveNext(before: GameState, working: GameState, explicitTarget: CardId | undefined, campaign: Campaign): GameState {
  const authoredDays = working.clock.day - before.clock.day
  const daysAdvanced = authoredDays + campaign.tuning.daysPerTurn
  let s: GameState = { ...working, clock: { ...working.clock, day: before.clock.day + daysAdvanced } }
  s = tick(s, daysAdvanced, campaign)
  if (s.status !== 'playing') return s

  let target = explicitTarget
  if (!target) {
    const drawn = drawCard(s, campaign)
    s = { ...s, rng: drawn.rng }
    target = drawn.cardId ?? campaign.startCardId
  }

  // If there's an explicit target (from choice goto), it takes priority
  // Otherwise, use pending cards first
  let nextCardId: CardId
  if (explicitTarget) {
    nextCardId = target
    s = { ...s, pendingCards: s.pendingCards }  // Keep pending for later
  } else {
    const queue = [...s.pendingCards, target]
    nextCardId = queue[0] as CardId
    s = { ...s, pendingCards: queue.slice(1) }
  }

  return enterCard(s, nextCardId, campaign)
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
  if (card) s = applyAll(card.onEnter ?? [], s)
  return s
}
