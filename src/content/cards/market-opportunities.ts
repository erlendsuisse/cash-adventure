// Market event cards - prices spike/crash, creating trading opportunities
import type { StoryCard } from '../../engine/types'

export const marketOpportunityCards: StoryCard[] = [
  {
    id: 'spice_shortage',
    title: 'Trade Route Disruption',
    body: [
      'News arrives that the eastern trade routes have been blocked by bandits. Spice prices soar as supplies run scarce.',
      'Merchants are panic-buying. If you have spice in stock, now is the time to sell. Or wait and hope prices climb higher?',
    ],
    storyPhase: 'climbing',
    weight: 8,
    choices: [
      {
        id: 'sell_spice_now',
        label: 'Sell all your spice now at peak prices (25% above market)',
        effects: [
          { kind: 'sellStock', type: 'spice', priceMultiplier: 1.25 },
          { kind: 'narrate', text: 'You dump your entire inventory at record prices. Profit!' },
        ],
      },
      {
        id: 'hold_spice',
        label: 'Hold and wait for prices to climb even higher',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: 40 },
          {
            kind: 'narrate',
            text: 'Spice prices skyrocket as the shortage deepens. Those with supplies are king.',
          },
        ],
      },
      {
        id: 'buy_spice_shortage',
        label: 'Buy cheap spice from desperate sellers',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: 30 },
          { kind: 'narrate', text: 'You find sellers willing to offload at discount. You purchase quietly.' },
        ],
      },
    ],
  },

  {
    id: 'iron_boom',
    title: 'Construction Boom',
    body: [
      'The city council announces a massive building project. Iron prices jump as demand surges.',
      'This is temporary - the project will eventually slow. Act fast.',
    ],
    storyPhase: 'climbing',
    weight: 7,
    choices: [
      {
        id: 'sell_iron_boom',
        label: 'Sell iron at inflated prices',
        effects: [
          { kind: 'marketShift', sector: 'iron', delta: 25 },
          { kind: 'narrate', text: 'You offload iron at peak rates. Great timing.' },
        ],
      },
      {
        id: 'buy_iron_boom',
        label: 'Stock up on iron before prices rise more',
        effects: [
          { kind: 'marketShift', sector: 'iron', delta: 35 },
          { kind: 'narrate', text: 'You purchase heavily at current rates, betting on higher prices soon.' },
        ],
      },
      {
        id: 'ignore_iron',
        label: 'Ignore the opportunity',
        effects: [
          { kind: 'marketShift', sector: 'iron', delta: 30 },
          { kind: 'narrate', text: 'Iron prices climb. You watch others profit.' },
        ],
      },
    ],
  },

  {
    id: 'salt_harvest',
    title: 'Record Salt Harvest',
    body: [
      'Good weather has produced the biggest salt harvest in years. Market is flooded with cheap salt.',
      'Prices crash. This is a buyer\'s market, but sellers are desperate.',
    ],
    storyPhase: 'climbing',
    weight: 8,
    choices: [
      {
        id: 'buy_salt_harvest',
        label: 'Buy massive quantities of cheap salt',
        effects: [
          { kind: 'marketShift', sector: 'salt', delta: -30 },
          { kind: 'narrate', text: 'You purchase thousands of units at rock-bottom prices. A smart investment.' },
        ],
      },
      {
        id: 'sell_salt_harvest',
        label: 'Sell your salt holdings before prices crash',
        effects: [
          { kind: 'marketShift', sector: 'salt', delta: -40 },
          { kind: 'narrate', text: 'You unload your salt just before the market tanks. Dodged that one.' },
        ],
      },
      {
        id: 'wait_salt',
        label: 'Wait for prices to stabilize',
        effects: [
          { kind: 'marketShift', sector: 'salt', delta: -35 },
          { kind: 'narrate', text: 'Salt prices hit bottom. Your holdings are worth half what they were.' },
        ],
      },
    ],
  },

  {
    id: 'market_panic',
    title: 'Market Panic',
    body: [
      'A major merchant house collapses, owing gold to half the city. Panic spreads. Everyone is liquidating.',
      'Prices for everything are plummeting as panicked sellers dump goods.',
    ],
    weight: 6,
    requires: [{ kind: 'goldAtLeast', amount: 50 }, { kind: 'colossiAtLeast', count: 1 }], // mid-game danger (was gated on the never-entered 'entangled' phase)
    choices: [
      {
        id: 'buy_panic',
        label: 'Buy everything at fire-sale prices',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: -25 },
          { kind: 'marketShift', sector: 'salt', delta: -25 },
          { kind: 'marketShift', sector: 'iron', delta: -25 },
          {
            kind: 'narrate',
            text: 'While others panic, you buy. When this panic subsides, you\'ll be wealthy.',
          },
        ],
      },
      {
        id: 'panic_sell',
        label: 'Panic sell your holdings',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: -35 },
          { kind: 'marketShift', sector: 'salt', delta: -35 },
          { kind: 'marketShift', sector: 'iron', delta: -35 },
          {
            kind: 'narrate',
            text: 'Fear overtakes you. You dump everything for whatever price you can get.',
          },
        ],
      },
      {
        id: 'hold_panic',
        label: 'Hold steady. This too shall pass.',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: -30 },
          { kind: 'marketShift', sector: 'salt', delta: -30 },
          { kind: 'marketShift', sector: 'iron', delta: -30 },
          {
            kind: 'narrate',
            text: 'You wait out the chaos. Markets eventually stabilize, but your holdings are underwater.',
          },
        ],
      },
    ],
  },

  {
    id: 'arbitrage_opportunity',
    title: 'The Traveling Merchant',
    body: [
      'A wealthy merchant from the coast offers you a deal: buy goods here, deliver to his warehouse on the coast, profit.',
      '5 units of any commodity. Higher price than market rate. He\'s desperate to get supplies to his warehouse before the season ends.',
    ],
    storyPhase: 'climbing',
    weight: 9,
    requires: [{ kind: 'goldAtLeast', amount: 40 }],
    choices: [
      {
        id: 'trade_with_merchant_spice',
        label: 'Buy 5 spice at 20g/unit to sell him (profit on delivery)',
        effects: [
          {
            kind: 'narrate',
            text: 'You purchase spice and immediately sell to the merchant. Quick profit. Use the Portfolio to buy and track commodities.',
          },
          { kind: 'gold', delta: 25 },
        ],
      },
      {
        id: 'trade_with_merchant_salt',
        label: 'Buy 5 salt at 12g/unit to sell him (good margin)',
        effects: [
          { kind: 'narrate', text: 'Salt trade executed smoothly. Decent profit for little risk.' },
          { kind: 'gold', delta: 20 },
        ],
      },
      {
        id: 'trade_with_merchant_iron',
        label: 'Buy 5 iron at 18g/unit to sell him (high risk)',
        effects: [
          {
            kind: 'narrate',
            text: 'You purchase iron. High stakes, but if he pays as promised, solid profit.',
          },
          { kind: 'gold', delta: 30 },
        ],
      },
      {
        id: 'refuse_merchant',
        label: 'Decline. Too risky.',
        effects: [{ kind: 'narrate', text: 'The merchant shrugs and moves on to find another partner.' }],
      },
    ],
  },

  {
    id: 'expert_tip',
    title: 'Caravan Gossip',
    body: [
      'A caravan master shares insider gossip: spice prices will crash soon when new shipments arrive, but iron will stay scarce.',
      'He advises selling spice and buying iron now, before the market shifts.',
    ],
    storyPhase: 'climbing',
    weight: 7,
    choices: [
      {
        id: 'follow_tip',
        label: 'Follow the advice: sell your spice, buy up to 10 iron',
        effects: [
          { kind: 'sellStock', type: 'spice', priceMultiplier: 1 },
          { kind: 'buyStock', type: 'iron', amount: 10, priceMultiplier: 1 },
          { kind: 'marketShift', sector: 'spice', delta: -30 },
          { kind: 'marketShift', sector: 'iron', delta: 20 },
          { kind: 'narrate', text: 'You follow the tip. Moments later, the markets shift exactly as predicted.' },
        ],
      },
      {
        id: 'ignore_tip',
        label: 'Ignore gossip. Trade what you know.',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: -25 },
          { kind: 'marketShift', sector: 'iron', delta: 15 },
          { kind: 'narrate', text: 'The tip turns out to be accurate, but you missed it.' },
        ],
      },
    ],
  },
]
