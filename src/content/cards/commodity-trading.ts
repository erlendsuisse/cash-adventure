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
    body: [
      'News spreads fast: a major shipbuilder is offering premium prices for iron and salt. Merchants rush to sell. This is your chance.',
    ],
    storyPhase: 'entangled',
    weight: 13,
    requires: [
      {
        kind: 'anyOf',
        of: [
          { kind: 'flag', id: 'own_salt', atLeast: 1 },
          { kind: 'flag', id: 'own_spice', atLeast: 1 },
          { kind: 'flag', id: 'own_iron', atLeast: 1 },
        ],
      },
    ],
    choices: [
      {
        id: 'sell_all_commodities',
        label: 'Sell everything at market price',
        effects: [
          {
            kind: 'if',
            when: { kind: 'flag', id: 'has_salt', atLeast: 1 },
            then: [
              { kind: 'gold', delta: 40 }, // 10 units * 4g each
              { kind: 'commodity', type: 'salt', delta: -10 },
            ],
          },
          {
            kind: 'if',
            when: { kind: 'flag', id: 'has_spice', atLeast: 1 },
            then: [
              { kind: 'gold', delta: 60 }, // 8 units * 7.5g each
              { kind: 'commodity', type: 'spice', delta: -8 },
            ],
          },
          {
            kind: 'if',
            when: { kind: 'flag', id: 'has_iron', atLeast: 1 },
            then: [
              { kind: 'gold', delta: 45 }, // 7 units * 6.4g each
              { kind: 'commodity', type: 'iron', delta: -7 },
            ],
          },
          { kind: 'narrate', text: 'You unload your inventory at peak prices. The profits are substantial.' },
        ],
      },
      {
        id: 'hold_commodities',
        label: 'Hold for better prices',
        effects: [
          {
            kind: 'narrate',
            text: 'You decide to wait. The market might go even higher.',
          },
        ],
      },
    ],
  },

  {
    id: 'trader_bulk_purchase',
    title: 'A Bulk Buyer Arrives',
    body: [
      'A wealthy merchant from the capital is buying bulk quantities of commodities. "I\'ll pay fair prices for anything you have," he says.',
    ],
    storyPhase: 'entangled',
    weight: 10,
    requires: [
      {
        kind: 'anyOf',
        of: [
          { kind: 'flag', id: 'has_salt', atLeast: 1 },
          { kind: 'flag', id: 'has_spice', atLeast: 1 },
          { kind: 'flag', id: 'has_iron', atLeast: 1 },
        ],
      },
    ],
    choices: [
      {
        id: 'sell_to_merchant',
        label: 'Sell your commodities',
        effects: [
          { kind: 'gold', delta: 120 }, // Simplified: average of all commodities
          { kind: 'commodity', type: 'salt', delta: -999 }, // Sell all
          { kind: 'commodity', type: 'spice', delta: -999 },
          { kind: 'commodity', type: 'iron', delta: -999 },
          { kind: 'narrate', text: 'The merchant pays well for your entire inventory. A profitable transaction.' },
        ],
      },
      {
        id: 'negotiate_higher',
        label: 'Demand higher prices',
        check: {
          stat: 'charm',
          dc: 14,
          success: {
            text: 'Your negotiation convinces him. He raises his offer significantly.',
            effects: [
              { kind: 'gold', delta: 160 },
              { kind: 'commodity', type: 'salt', delta: -999 },
              { kind: 'commodity', type: 'spice', delta: -999 },
              { kind: 'commodity', type: 'iron', delta: -999 },
            ],
          },
          failure: {
            text: 'He takes offense at your greed and walks away.',
            effects: [
              {
                kind: 'narrate',
                text: 'The merchant leaves. You\'ve lost the opportunity.',
              },
            ],
          },
        },
      },
    ],
  },
]
