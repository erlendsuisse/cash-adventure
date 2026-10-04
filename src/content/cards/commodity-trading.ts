// Commodity trading: acquire spice, salt, and iron for later sale
import type { StoryCard } from '../../engine/types'

export const commodityTradingCards: StoryCard[] = [
  {
    id: 'salt_shipment_offer',
    title: 'A Salt Shipment Arrives',
    body: [
      'A trader at the docks approaches you with an opportunity. "I have a surplus of salt from the marshes. Quality goods at a fair price. Buy by the unit and sell when the market is favorable."',
    ],
    storyPhase: 'climbing',
    weight: 11,
    requires: [{ kind: 'goldAtLeast', amount: 30 }],
    choices: [
      {
        id: 'buy_salt_10',
        label: 'Buy 10 units of salt (30g)',
        effects: [
          { kind: 'gold', delta: -30 },
          { kind: 'commodity', type: 'salt', delta: 10 },
          { kind: 'narrate', text: 'You acquire 10 units of salt. The goods are packed and stored.' },
        ],
      },
      {
        id: 'buy_salt_5',
        label: 'Buy 5 units (15g)',
        effects: [
          { kind: 'gold', delta: -15 },
          { kind: 'commodity', type: 'salt', delta: 5 },
          { kind: 'narrate', text: 'You acquire 5 units of salt.' },
        ],
      },
      {
        id: 'pass_salt',
        label: 'Not interested',
        effects: [{ kind: 'narrate', text: 'The trader moves on to find another buyer.' }],
      },
    ],
  },

  {
    id: 'spice_acquisition',
    title: 'Spice Market Opportunity',
    body: [
      'A spice trader whispers to you in the market. "Prices are low today. If you stock up now, you can sell high when the blockade tightens. What do you say?"',
    ],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 40 }],
    choices: [
      {
        id: 'buy_spice_8',
        label: 'Buy 8 units of spice (40g)',
        effects: [
          { kind: 'gold', delta: -40 },
          { kind: 'commodity', type: 'spice', delta: 8 },
          { kind: 'narrate', text: 'You acquire 8 units of spice at current market prices. Good timing.' },
        ],
      },
      {
        id: 'buy_spice_4',
        label: 'Buy 4 units (20g)',
        effects: [
          { kind: 'gold', delta: -20 },
          { kind: 'commodity', type: 'spice', delta: 4 },
          { kind: 'narrate', text: 'You acquire 4 units of spice.' },
        ],
      },
      {
        id: 'pass_spice',
        label: 'Too risky',
        effects: [
          {
            kind: 'narrate',
            text: 'You walk away. The prices might change before you get another chance.',
          },
        ],
      },
    ],
  },

  {
    id: 'iron_stock_available',
    title: 'Iron Ore Available',
    body: [
      'A prospector at the market has iron ore fresh from the mines. "Good quality, reasonable price. Interested in stocking some for later?"',
    ],
    storyPhase: 'climbing',
    weight: 9,
    requires: [{ kind: 'goldAtLeast', amount: 35 }],
    choices: [
      {
        id: 'buy_iron_7',
        label: 'Buy 7 units of iron (35g)',
        effects: [
          { kind: 'gold', delta: -35 },
          { kind: 'commodity', type: 'iron', delta: 7 },
          { kind: 'narrate', text: 'You acquire 7 units of iron ore. The prospector helps load it into storage.' },
        ],
      },
      {
        id: 'buy_iron_3',
        label: 'Buy 3 units (15g)',
        effects: [
          { kind: 'gold', delta: -15 },
          { kind: 'commodity', type: 'iron', delta: 3 },
          { kind: 'narrate', text: 'You acquire 3 units of iron ore.' },
        ],
      },
      {
        id: 'pass_iron_stock',
        label: 'No thanks',
        effects: [
          {
            kind: 'narrate',
            text: 'The prospector packs up his goods and leaves.',
          },
        ],
      },
    ],
  },

  // Selling opportunities
  {
    id: 'sell_commodities_boom',
    title: 'Market Surge',
    weight: 13,
    requires: [{ kind: 'anyOf', of: [{ kind: 'commodityAtLeast', type: 'iron', amount: 1 }, { kind: 'commodityAtLeast', type: 'salt', amount: 1 }] }],
    body: ['News spreads fast: a major shipbuilder is offering premium prices for iron and salt. Merchants rush to sell. This is your chance.'],
    choices: [
      {
        id: 'sell_all_commodities',
        label: 'Sell all your iron and salt to the shipbuilder (30% above market)',
        effects: [
          { kind: 'sellStock', type: 'iron', priceMultiplier: 1.3 },
          { kind: 'sellStock', type: 'salt', priceMultiplier: 1.3 },
          { kind: 'narrate', text: 'The shipbuilder\'s clerk counts out your coin. A good day to be holding stock.' },
        ],
      },
      { id: 'hold_commodities', label: 'Hold for better prices', effects: [{ kind: 'narrate', text: 'You keep your stock. Prices may climb further - or not.' }] },
    ],
  },

  {
    id: 'trader_bulk_purchase',
    title: 'A Bulk Buyer Arrives',
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
    body: ['A wealthy merchant from the capital is buying bulk quantities of commodities. "I\'ll pay fair prices for anything you have," he says.'],
    choices: [
      {
        id: 'sell_to_merchant',
        label: 'Sell all your stock (10% above market)',
        effects: [
          { kind: 'sellStock', type: 'salt', priceMultiplier: 1.1 },
          { kind: 'sellStock', type: 'spice', priceMultiplier: 1.1 },
          { kind: 'sellStock', type: 'iron', priceMultiplier: 1.1 },
          { kind: 'narrate', text: 'The buyer takes everything. Quick, clean money.' },
        ],
      },
      {
        id: 'negotiate_higher',
        label: 'Demand higher prices (Charm check, DC 13)',
        check: {
          stat: 'charm',
          dc: 13,
          success: {
            text: 'The buyer grumbles, then pays 40% above market for the lot.',
            effects: [
              { kind: 'sellStock', type: 'salt', priceMultiplier: 1.4 },
              { kind: 'sellStock', type: 'spice', priceMultiplier: 1.4 },
              { kind: 'sellStock', type: 'iron', priceMultiplier: 1.4 },
            ],
          },
          failure: { text: 'The buyer walks out. You keep your stock for another day.' },
        },
      },
    ],
  },
]
