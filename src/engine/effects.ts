import { isMet } from './requirements'
import { commodityBuyPrice, commodityPrice } from './selectors'
import type { Campaign, Commodity, Effect, GameState } from './types'

/** Market-priced effects (buyStock/sellStock) need the campaign's base prices. */
type PriceBook = Pick<Campaign, 'commodityBasePrice'>

/** apply() must never call Math.random/Date.now or reach outside `state` (and the campaign's price book). */
export function apply(effect: Effect, state: GameState, campaign?: PriceBook): GameState {
  switch (effect.kind) {
    case 'gold':
      return { ...state, finances: { ...state.finances, gold: state.finances.gold + effect.delta } }

    case 'stat':
      return { ...state, stats: { ...state.stats, [effect.stat]: state.stats[effect.stat] + effect.delta } }

    case 'flag': {
      const current = state.flags[effect.id] ?? 0
      const next = effect.set !== undefined ? effect.set : current + (effect.delta ?? 0)
      return { ...state, flags: { ...state.flags, [effect.id]: next } }
    }

    case 'acquireAsset': {
      const existing = state.finances.assets.find((a) => a.id === effect.asset.id)
      if (existing) {
        // Asset already owned: update quantity and increase monthly cashflow
        const newAssets = state.finances.assets.map((a) =>
          a.id === effect.asset.id
            ? {
                ...a,
                quantity: (a.quantity ?? 1) + (effect.asset.quantity ?? 1),
                monthlyCashflow: a.monthlyCashflow + effect.asset.monthlyCashflow,
              }
            : a
        )
        return {
          ...state,
          finances: { ...state.finances, assets: newAssets },
        }
      }
      // New asset: add to list
      return {
        ...state,
        finances: { ...state.finances, assets: [...state.finances.assets, effect.asset] },
      }
    }

    case 'sellAsset': {
      const asset = state.finances.assets.find((a) => a.id === effect.id)
      if (!asset) return state
      const price = asset.cost * (effect.priceMultiplier ?? 1)
      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold + price,
          assets: state.finances.assets.filter((a) => a.id !== effect.id),
        },
      }
    }

    case 'wages':
      return { ...state, finances: { ...state.finances, wages: state.finances.wages + effect.delta } }

    case 'expense':
      return {
        ...state,
        finances: { ...state.finances, monthlyExpenses: Math.max(0, state.finances.monthlyExpenses + effect.delta) },
      }

    case 'loan':
      return {
        ...state,
        finances: {
          ...state.finances,
          gold: state.finances.gold + effect.principal,
          debt: state.finances.debt + effect.principal,
          monthlyExpenses: state.finances.monthlyExpenses + effect.monthlyPayment,
          loanPayments: (state.finances.loanPayments ?? 0) + effect.monthlyPayment,
        },
      }

    case 'advanceDays':
      return { ...state, clock: { ...state.clock, day: state.clock.day + effect.days } }

    case 'queueCard':
      return {
        ...state,
        pendingCards: effect.front
          ? [effect.card, ...state.pendingCards]
          : [...state.pendingCards, effect.card],
      }

    case 'marketShift': {
      const current = state.market[effect.sector] ?? 100
      return { ...state, market: { ...state.market, [effect.sector]: current + effect.delta } }
    }

    case 'grantBoon':
      return state.progress.boons.includes(effect.boon)
        ? state
        : { ...state, progress: { ...state.progress, boons: [...state.progress.boons, effect.boon] } }

    case 'advancePhase':
      return { ...state, progress: { ...state.progress, storyPhase: effect.to } }

    case 'reckoning': {
      // The cost of surviving a Colossus: assets and wages are stripped, debt remains.
      // Failing forward, not a game over - the player rebuilds toward the next trial.
      const nextDefeated = state.progress.colossiDefeated + 1
      const newState = {
        ...state,
        progress: {
          ...state.progress,
          colossiDefeated: nextDefeated,
          freedomDays: 0,
          tier: state.progress.tier + 1,
        },
        finances: {
          ...state.finances,
          assets: [],
          wages: Math.round(state.finances.wages * 0.5),
        },
      }
      // Victory condition: defeat all 7 Colossi
      if (nextDefeated >= 7) {
        return { ...newState, status: 'won' }
      }
      return newState
    }

    case 'narrate':
      return { ...state, log: [...state.log, { day: state.clock.day, text: effect.text }] }

    case 'end':
      return { ...state, status: effect.status }

    case 'commodity': {
      const current = state.finances.commodities[effect.type]
      const newAmount = Math.max(0, current + effect.delta)
      return {
        ...state,
        finances: {
          ...state.finances,
          commodities: { ...state.finances.commodities, [effect.type]: newAmount },
        },
      }
    }

    case 'buyStock': {
      const unit = Math.max(1, Math.round(commodityBuyPrice(state, priceBook(campaign), effect.type) * effect.priceMultiplier))
      const units = Math.max(0, Math.min(effect.amount, Math.floor(state.finances.gold / unit)))
      return withStock(state, effect.type, units, -units * unit)
    }

    case 'sellStock': {
      const held = state.finances.commodities[effect.type]
      const units = Math.min(held, effect.amount ?? held)
      const unit = Math.round(commodityPrice(state, priceBook(campaign), effect.type) * effect.priceMultiplier)
      return withStock(state, effect.type, -units, units * unit)
    }

    case 'if':
      return applyAll(isMet(effect.when, state) ? effect.then : effect.else ?? [], state, campaign)
  }
}

export function applyAll(effects: Effect[], state: GameState, campaign?: PriceBook): GameState {
  return effects.reduce((s, effect) => apply(effect, s, campaign), state)
}

function priceBook(campaign: PriceBook | undefined): PriceBook {
  if (!campaign) throw new Error('buyStock/sellStock need the campaign to price the trade')
  return campaign
}

function withStock(state: GameState, commodity: Commodity, unitDelta: number, goldDelta: number): GameState {
  return {
    ...state,
    finances: {
      ...state.finances,
      gold: state.finances.gold + goldDelta,
      commodities: { ...state.finances.commodities, [commodity]: state.finances.commodities[commodity] + unitDelta },
    },
  }
}
