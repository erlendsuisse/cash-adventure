import { formatCheck, resolveCheck } from './checks'
import { drawCard, recordDraw } from './director'
import { tick } from './economy'
import { applyAll } from './effects'
import { abilityCheckBonuses, availableReroll, bestStat, effectiveChoice, effectiveOutcome, heroAction, rerollFlagId } from './hero'
import { buyItem } from './shop'
import { newGame } from './init'
import { commodityBuyPrice, commodityPrice } from './selectors'
import { isMet } from './requirements'
import type { Action, Campaign, CardId, CheckResult, Commodity, EffectSummary, GameState, StatId } from './types'

export function reduce(state: GameState, action: Action, campaign: Campaign): GameState {
  switch (action.type) {
    case 'restart':
      return newGame(action.seed, campaign)
    case 'choose':
      return applyChoose(state, action.choiceId, campaign)
    case 'rollStats':
    case 'swapStats':
    case 'createHero':
      return heroAction(state, action, campaign)
    case 'buyItem':
      return buyItem(state, action.itemId, campaign)
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

  const perksGained = after.progress.boons
    .filter((b) => !before.progress.boons.includes(b) && campaign.perks?.[b])
    .map((b) => `${campaign.perks![b]!.icon} ${campaign.perks![b]!.name}`)

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
    perksGained,
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
    Object.keys(summary.trackedFlagDeltas).length > 0 ||
    (summary.perksGained?.length ?? 0) > 0
  )
}

function applyChoose(state: GameState, choiceId: string, campaign: Campaign): GameState {
  // An outcome on screen must be acknowledged (advance) first; choosing again
  // would re-apply the same card's choice.
  if (state.pendingOutcome) return state
  const card = campaign.cards[state.currentCardId]
  if (!card) return state
  const authored = card.choices.find((c) => c.id === choiceId)
  if (!authored) return state
  // The choice as this hero sees it (class abilities can change prices and heat)
  const choice = effectiveChoice(authored, state, campaign)
  if ((choice.requires ?? []).some((r) => !isMet(r, state))) return state

  let working = state
  let before = state
  let target: CardId | undefined
  let checkResult: CheckResult | undefined
  let outcomeText: string | undefined

  if (choice.check) {
    // "Your own way" checks use the hero's best attribute
    const check = { ...choice.check, stat: choice.check.stat === 'best' ? bestStat(working) : choice.check.stat }
    const bonuses = abilityCheckBonuses(check.stat, working, campaign)
    let resolved = resolveCheck(check, working, bonuses)
    const passed = (r: CheckResult) => r.result === 'success' || r.result === 'critSuccess'
    // A class ability or perk may re-roll one failed check per chapter
    const reroll = passed(resolved.result) ? undefined : availableReroll(check.stat, working, campaign)
    if (reroll) {
      const first = resolved.result.roll
      working = { ...working, rng: resolved.rng, flags: { ...working.flags, [rerollFlagId(working, reroll.id)]: 1 } }
      resolved = resolveCheck(check, working, bonuses)
      resolved = { ...resolved, result: { ...resolved.result, reroll: { firstRoll: first, ability: reroll.source } } }
    }
    const { rng } = resolved
    const result = withHelpers(resolved.result, working, campaign)
    const outcome = effectiveOutcome(resolved.outcome, passed(result), working, campaign)
    working = { ...working, rng, log: [...working.log, { day: working.clock.day, text: formatCheck(result) }] }
    if (outcome.text) working = { ...working, log: [...working.log, { day: working.clock.day, text: outcome.text }] }
    before = working
    working = applyAll(outcome.effects ?? [], working, campaign)
    target = outcome.goto
    checkResult = result
    outcomeText = outcome.text
  } else {
    working = applyAll(choice.effects ?? [], working, campaign)
    target = choice.goto
  }

  // Show what the choice did before moving on: the roll, the story text (narrate
  // effects write it to the log) and what changed. Only a choice with none of
  // these goes straight to the next card.
  const narration = working.log.slice(before.log.length).map((entry) => entry.text)
  const text = [outcomeText, ...narration].filter(Boolean).join(' ')
  const summary = calculateEffectSummary(before, working, campaign)
  const significant = hasSignificantEffects(summary)
  if (checkResult || text || significant) {
    return {
      ...working,
      pendingOutcome: {
        text,
        ...(checkResult ? { checkResult } : {}),
        ...(significant ? { effectSummary: summary } : {}),
        ...(target ? { goto: target } : {}),
        turnStartDay: state.clock.day,
      },
    }
  }

  return resolveNext(state, working, target, campaign)
}

function applyAdvance(state: GameState, campaign: Campaign): GameState {
  // Acknowledging an outcome finishes the turn its choice started
  if (state.pendingOutcome) {
    const { goto, turnStartDay } = state.pendingOutcome
    const turnStart = { ...state, clock: { ...state.clock, day: turnStartDay } }
    return resolveNext(turnStart, state, goto, campaign)
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
    arrivalNotes: undefined,
  }
  if (card?.onEnter) {
    const before = s.log.length
    s = applyAll(card.onEnter, s, campaign)
    const notes = s.log.slice(before).map((entry) => entry.text)
    if (notes.length > 0) s = { ...s, arrivalNotes: notes }
  }
  return s
}

/** Points of this stat bought at the Guild Hall (training and masterclasses). */
function trainedPoints(stat: StatId, state: GameState, campaign: Campaign): number {
  return (campaign.shop ?? []).reduce((sum, item) => {
    const bought = state.progress.purchases?.[item.id] ?? 0
    const gain = item.effects.reduce((g, e) => (e.kind === 'stat' && e.stat === stat ? g + e.delta : g), 0)
    return sum + bought * gain
  }, 0)
}

/** A success that would have been a failure without the hero's bonuses and
 *  Guild Hall training names them, so the player sees their choices pay off. */
export function withHelpers(result: CheckResult, state: GameState, campaign: Campaign): CheckResult {
  if (result.result !== 'success') return result
  const helpers = result.bonuses.filter((b) => b.mod > 0).map((b) => ({ name: b.reason, mod: b.mod }))
  const trained = Math.min(trainedPoints(result.stat, state, campaign), result.statMod)
  if (trained > 0) helpers.push({ name: `your ${result.stat[0]!.toUpperCase() + result.stat.slice(1)} training`, mod: trained })
  const help = helpers.reduce((sum, h) => sum + h.mod, 0)
  return help > 0 && result.total - help < result.dc ? { ...result, helpedBy: helpers.map((h) => h.name) } : result
}
