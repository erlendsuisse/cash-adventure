// Commodity trading: acquire spice, salt, and iron for later sale
import type { StoryCard } from '../../engine/types'

export const commodityTradingCards: StoryCard[] = [
  {
    id: 'salt_shipment_offer',
    title: 'A Salt Shipment Arrives',
    body: [
      'A salt trader at the docks pats a stack of sacks. "Fine marsh salt, fair price," she says. "Buy now, sell when prices rise."',
    ],
    storyPhase: 'climbing',
    weight: 11,
    requires: [{ kind: 'goldAtLeast', amount: 30 }],
    choices: [
      {
        id: 'buy_salt_10',
        label: 'Buy 10 salt (30g)',
        effects: [
          { kind: 'gold', delta: -30 },
          { kind: 'commodity', type: 'salt', delta: 10 },
          { kind: 'narrate', text: 'You buy 10 sacks of salt and stack them in your storeroom.' },
        ],
      },
      {
        id: 'buy_salt_5',
        label: 'Buy 5 salt (15g)',
        effects: [
          { kind: 'gold', delta: -15 },
          { kind: 'commodity', type: 'salt', delta: 5 },
          { kind: 'narrate', text: 'You buy 5 sacks of salt.' },
        ],
      },
      {
        id: 'pass_salt',
        label: 'Not today',
        effects: [{ kind: 'narrate', text: 'She moves on to find another buyer.' }],
      },
    ],
  },

  {
    id: 'spice_acquisition',
    title: 'Cheap Spice Today',
    body: [
      'A spice trader whispers, "Prices are low today. Buy now, and sell high later!"',
    ],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 40 }],
    choices: [
      {
        id: 'buy_spice_8',
        label: 'Buy 8 spice (40g)',
        effects: [
          { kind: 'gold', delta: -40 },
          { kind: 'commodity', type: 'spice', delta: 8 },
          { kind: 'narrate', text: 'You buy 8 jars of spice. Good timing!' },
        ],
      },
      {
        id: 'buy_spice_4',
        label: 'Buy 4 spice (20g)',
        effects: [
          { kind: 'gold', delta: -20 },
          { kind: 'commodity', type: 'spice', delta: 4 },
          { kind: 'narrate', text: 'You buy 4 jars of spice.' },
        ],
      },
      {
        id: 'pass_spice',
        label: 'Too risky',
        effects: [
          {
            kind: 'narrate',
            text: 'You walk away. Prices may change before your next chance.',
          },
        ],
      },
    ],
  },

  {
    id: 'iron_stock_available',
    title: 'Fresh Iron Ore',
    body: [
      'A prospector rolls a cart of iron ore into the market. "Fresh from the mines," he says. "Want some for later?"',
    ],
    storyPhase: 'climbing',
    weight: 9,
    requires: [{ kind: 'goldAtLeast', amount: 35 }],
    choices: [
      {
        id: 'buy_iron_7',
        label: 'Buy 7 iron (35g)',
        effects: [
          { kind: 'gold', delta: -35 },
          { kind: 'commodity', type: 'iron', delta: 7 },
          { kind: 'narrate', text: 'You buy 7 lumps of ore. The prospector helps you carry them in.' },
        ],
      },
      {
        id: 'buy_iron_3',
        label: 'Buy 3 iron (15g)',
        effects: [
          { kind: 'gold', delta: -15 },
          { kind: 'commodity', type: 'iron', delta: 3 },
          { kind: 'narrate', text: 'You buy 3 lumps of iron ore.' },
        ],
      },
      {
        id: 'pass_iron_stock',
        label: 'No thanks',
        effects: [
          {
            kind: 'narrate',
            text: 'He pushes his cart on down the street.',
          },
        ],
      },
    ],
  },

  // Selling opportunities
  {
    id: 'sell_commodities_boom',
    title: 'The Shipbuilder Is Buying',
    weight: 13,
    requires: [{ kind: 'anyOf', of: [{ kind: 'commodityAtLeast', type: 'iron', amount: 1 }, { kind: 'commodityAtLeast', type: 'salt', amount: 1 }] }],
    body: ['A shipbuilder is paying top prices for iron and salt! Merchants rush to the shipyard. This is your chance.'],
    choices: [
      {
        id: 'sell_all_commodities',
        label: 'Sell your iron and salt to him (30% above market)',
        effects: [
          { kind: 'sellStock', type: 'iron', priceMultiplier: 1.3 },
          { kind: 'sellStock', type: 'salt', priceMultiplier: 1.3 },
          { kind: 'narrate', text: 'His clerk counts out a pile of coins. A good day to have stock!' },
        ],
      },
      { id: 'hold_commodities', label: 'Hold out for more', effects: [{ kind: 'narrate', text: 'You keep your stock. Prices might climb higher. Or not.' }] },
    ],
  },

  {
    id: 'trader_bulk_purchase',
    title: 'The Big Buyer',
    weight: 10,
    requires: [
      {
        kind: 'anyOf',
        of: [
          { kind: 'commodityAtLeast', type: 'salt', amount: 1 },
          { kind: 'commodityAtLeast', type: 'spice', amount: 1 },
          { kind: 'commodityAtLeast', type: 'iron', amount: 1 },
        ],
      },
    ],
    body: ['A rich merchant from the capital rolls up with three empty wagons. "I\'ll buy everything you have," he says. "Fair prices!"'],
    choices: [
      {
        id: 'sell_to_merchant',
        label: 'Sell everything (10% above market)',
        effects: [
          { kind: 'sellStock', type: 'salt', priceMultiplier: 1.1 },
          { kind: 'sellStock', type: 'spice', priceMultiplier: 1.1 },
          { kind: 'sellStock', type: 'iron', priceMultiplier: 1.1 },
          { kind: 'narrate', text: 'He loads up every sack. Quick, easy money.' },
        ],
      },
      {
        id: 'negotiate_higher',
        label: 'Haggle for more (Charm check, DC 13)',
        check: {
          stat: 'charm',
          dc: 13,
          success: {
            text: 'He grumbles, then pays 40% above market for the lot!',
            effects: [
              { kind: 'sellStock', type: 'salt', priceMultiplier: 1.4 },
              { kind: 'sellStock', type: 'spice', priceMultiplier: 1.4 },
              { kind: 'sellStock', type: 'iron', priceMultiplier: 1.4 },
            ],
          },
          failure: { text: 'He walks out in a huff. You keep your stock for another day.' },
        },
      },
    ],
  },
]
