// Market event cards - prices spike/crash, creating trading opportunities
import type { StoryCard } from '../../engine/types'

export const marketOpportunityCards: StoryCard[] = [
  {
    id: 'spice_shortage',
    title: 'Bandits on the Spice Road',
    body: [
      'Bandits have blocked the eastern spice road! No caravans are getting through, and spice prices are shooting up.',
      'Merchants are buying in a panic. Sell your spice now, or wait for even higher prices?',
    ],
    storyPhase: 'climbing',
    weight: 8,
    choices: [
      {
        id: 'sell_spice_now',
        label: 'Sell all your spice now (25% above market)',
        effects: [
          { kind: 'sellStock', type: 'spice', priceMultiplier: 1.25 },
          { kind: 'narrate', text: 'You sell every sack at a record price. Profit!' },
        ],
      },
      {
        id: 'hold_spice',
        label: 'Wait for prices to climb higher',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: 40 },
          {
            kind: 'narrate',
            text: 'The shortage gets worse, and spice prices skyrocket. Anyone with spice is king.',
          },
        ],
      },
      {
        id: 'buy_spice_shortage',
        label: 'Buy cheap from nervous sellers',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: 30 },
          { kind: 'narrate', text: 'You find a few nervous sellers and quietly buy their spice cheap.' },
        ],
      },
    ],
  },

  {
    id: 'iron_boom',
    title: 'The Building Boom',
    body: [
      'The council announces a grand new bridge and a dozen new towers! Iron prices jump.',
      'The boom won\'t last forever. Act fast!',
    ],
    storyPhase: 'climbing',
    weight: 7,
    choices: [
      {
        id: 'sell_iron_boom',
        label: 'Sell your iron while it\'s pricey',
        effects: [
          { kind: 'marketShift', sector: 'iron', delta: 25 },
          { kind: 'narrate', text: 'You sell your iron at the top. Great timing!' },
        ],
      },
      {
        id: 'buy_iron_boom',
        label: 'Buy more before prices climb',
        effects: [
          { kind: 'marketShift', sector: 'iron', delta: 35 },
          { kind: 'narrate', text: 'You buy a big pile of iron, betting prices will climb higher.' },
        ],
      },
      {
        id: 'ignore_iron',
        label: 'Let it pass',
        effects: [
          { kind: 'marketShift', sector: 'iron', delta: 30 },
          { kind: 'narrate', text: 'Iron prices climb. You watch others cash in.' },
        ],
      },
    ],
  },

  {
    id: 'salt_harvest',
    title: 'A Mountain of Salt',
    body: [
      'A long sunny summer has made the biggest salt harvest in years. White mountains of salt pile up on the docks.',
      'Salt prices crash. Great for buyers, terrible for sellers.',
    ],
    storyPhase: 'climbing',
    weight: 8,
    choices: [
      {
        id: 'buy_salt_harvest',
        label: 'Buy loads of cheap salt',
        effects: [
          { kind: 'marketShift', sector: 'salt', delta: -30 },
          { kind: 'narrate', text: 'You buy heaps of salt at rock-bottom prices. Smart thinking.' },
        ],
      },
      {
        id: 'sell_salt_harvest',
        label: 'Sell your salt before it drops more',
        effects: [
          { kind: 'marketShift', sector: 'salt', delta: -40 },
          { kind: 'narrate', text: 'You sell your salt just before prices sink. Phew!' },
        ],
      },
      {
        id: 'wait_salt',
        label: 'Wait for prices to settle',
        effects: [
          { kind: 'marketShift', sector: 'salt', delta: -35 },
          { kind: 'narrate', text: 'Salt prices hit the bottom. Your salt is worth half what it was.' },
        ],
      },
    ],
  },

  {
    id: 'market_panic',
    title: 'Market Panic',
    body: [
      'A great merchant house goes bust, owing gold to half the city. Panic spreads street by street.',
      'Everyone is selling everything, and prices are tumbling.',
    ],
    weight: 6,
    requires: [{ kind: 'goldAtLeast', amount: 50 }, { kind: 'colossiAtLeast', count: 1 }], // mid-game danger (was gated on the never-entered 'entangled' phase)
    choices: [
      {
        id: 'buy_panic',
        label: 'Buy while everything is cheap',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: -25 },
          { kind: 'marketShift', sector: 'salt', delta: -25 },
          { kind: 'marketShift', sector: 'iron', delta: -25 },
          {
            kind: 'narrate',
            text: 'While others panic, you buy. When the dust settles, you\'ll be rich.',
          },
        ],
      },
      {
        id: 'panic_sell',
        label: 'Sell everything too',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: -35 },
          { kind: 'marketShift', sector: 'salt', delta: -35 },
          { kind: 'marketShift', sector: 'iron', delta: -35 },
          {
            kind: 'narrate',
            text: 'Fear wins. You sell everything for whatever you can get.',
          },
        ],
      },
      {
        id: 'hold_panic',
        label: 'Hold steady and wait',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: -30 },
          { kind: 'marketShift', sector: 'salt', delta: -30 },
          { kind: 'marketShift', sector: 'iron', delta: -30 },
          {
            kind: 'narrate',
            text: 'You wait out the storm. Things calm down, but your goods are worth less than you paid.',
          },
        ],
      },
    ],
  },

  {
    id: 'arbitrage_opportunity',
    title: 'A Merchant in a Hurry',
    body: [
      'A merchant from the coast mops his brow. His warehouse is empty and the season is ending.',
      '"Buy 5 units of anything for me," he begs, "and I\'ll pay more than market price!"',
    ],
    storyPhase: 'climbing',
    weight: 9,
    requires: [{ kind: 'goldAtLeast', amount: 40 }],
    choices: [
      {
        id: 'trade_with_merchant_spice',
        label: 'Buy 5 spice at 20g each for him (profit on delivery)',
        effects: [
          {
            kind: 'narrate',
            text: 'You buy the spice and sell it straight to him. Quick profit!',
          },
          { kind: 'gold', delta: 25 },
        ],
      },
      {
        id: 'trade_with_merchant_salt',
        label: 'Buy 5 salt at 12g each for him (good margin)',
        effects: [
          { kind: 'narrate', text: 'The salt deal goes smoothly. A tidy profit for little risk.' },
          { kind: 'gold', delta: 20 },
        ],
      },
      {
        id: 'trade_with_merchant_iron',
        label: 'Buy 5 iron at 18g each for him (high risk)',
        effects: [
          {
            kind: 'narrate',
            text: 'You buy the iron. If he pays as promised, it\'s a solid profit.',
          },
          { kind: 'gold', delta: 30 },
        ],
      },
      {
        id: 'refuse_merchant',
        label: 'Too risky',
        effects: [{ kind: 'narrate', text: 'He hurries off to ask someone else.' }],
      },
    ],
  },

  {
    id: 'expert_tip',
    title: 'Caravan Gossip',
    body: [
      'A dusty caravan master leans in close. "Big spice shipments are coming," he whispers. "Spice will crash. But iron will stay scarce."',
      '"Sell your spice and buy iron," he winks. "Before everyone else does."',
    ],
    storyPhase: 'climbing',
    weight: 7,
    choices: [
      {
        id: 'follow_tip',
        label: 'Take his tip: sell spice, buy up to 10 iron',
        effects: [
          { kind: 'sellStock', type: 'spice', priceMultiplier: 1 },
          { kind: 'buyStock', type: 'iron', amount: 10, priceMultiplier: 1 },
          { kind: 'marketShift', sector: 'spice', delta: -30 },
          { kind: 'marketShift', sector: 'iron', delta: 20 },
          { kind: 'narrate', text: 'You follow his tip. Soon after, prices shift exactly as he said!' },
        ],
      },
      {
        id: 'ignore_tip',
        label: 'Ignore the gossip',
        effects: [
          { kind: 'marketShift', sector: 'spice', delta: -25 },
          { kind: 'marketShift', sector: 'iron', delta: 15 },
          { kind: 'narrate', text: 'He was right. You missed your chance.' },
        ],
      },
    ],
  },
]
