import type { StoryCard } from '../../engine/types'

// Asset liquidation cards - let players sell assets for gold
// These appear when players need cash or want to restructure their portfolio

const sell_property: StoryCard = {
  id: 'sell_property',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Property Buyer Inquiry',
  body: [
    'A wealthy noble expresses interest in purchasing your property holdings.',
    '"I\'m willing to pay fairly for quality real estate," they say. "Name your price."',
    'You could liquidate your property investments for immediate capital.',
  ],
  choices: [
    {
      id: 'sell_manor',
      label: 'Sell manor estate for 300g',
      requires: [{ kind: 'ownsAsset', id: 'manor_estate' }],
      effects: [
        { kind: 'sellAsset', id: 'manor_estate', priceMultiplier: 1.0 },
        { kind: 'narrate', text: 'You sell the manor estate for 300 gold. The noble takes possession immediately.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'keep_property',
      label: 'Keep your property',
      effects: [{ kind: 'narrate', text: 'You decline. The property is too valuable to let go.' }],
    },
  ],
}

const merchant_guild_buyback: StoryCard = {
  id: 'merchant_guild_buyback',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Guild Charter Consolidation',
  body: [
    'The Merchant Guild contacts you with an unusual proposal.',
    '"We\'re consolidating membership benefits," the guild master explains. "We\'re buying back charter memberships from merchants looking to simplify. We\'ll pay 150 gold for yours if you\'re interested."',
    'It would free you from the charter cost, but you\'d lose the status and some business connections.',
  ],
  choices: [
    {
      id: 'sell_charter',
      label: 'Sell guild charter for 150g',
      requires: [{ kind: 'ownsAsset', id: 'guild_charter' }],
      effects: [
        { kind: 'sellAsset', id: 'guild_charter', priceMultiplier: 1.0 },
        { kind: 'narrate', text: 'You sell your guild charter back. One less commitment, one more opportunity.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'keep_charter',
      label: 'Keep the guild charter',
      effects: [],
    },
  ],
}

const trade_route_buyer: StoryCard = {
  id: 'trade_route_buyer',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Trade Route Acquisition',
  body: [
    'A merchant consortium approaches you with an offer to buy your trade route licenses.',
    '"We\'re consolidating routes between the northern territories. Your route fits perfectly. We\'ll pay you 200 gold and take over all shipping duties."',
    'It\'s a clean exit from the logistics business if you need liquid assets.',
  ],
  choices: [
    {
      id: 'sell_route',
      label: 'Sell trade routes for 200g',
      requires: [{ kind: 'ownsAsset', id: 'trade_route' }],
      effects: [
        { kind: 'sellAsset', id: 'trade_route', priceMultiplier: 1.0 },
        { kind: 'narrate', text: 'You sell your trade routes. The consortium takes over operations immediately.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'keep_routes',
      label: 'Keep managing the routes',
      effects: [],
    },
  ],
}

const desperate_buyer: StoryCard = {
  id: 'desperate_buyer',
  weight: 1,
  storyPhase: 'recovery',
  title: 'Desperate Buyer',
  body: [
    'In difficult times, a merchant approaches you with desperation in their eyes.',
    '"I need to sell assets quickly to cover debts," they explain. "But I\'m also buying. If you need gold urgently, I\'ll buy your holdings—though not at full price. 60 cents on the gold, as they say."',
    'Selling to them would be a loss, but it would convert assets to gold fast.',
  ],
  choices: [
    {
      id: 'sell_farm',
      label: 'Sell farm at 60% value',
      requires: [{ kind: 'ownsAsset', id: 'farm' }],
      effects: [
        { kind: 'sellAsset', id: 'farm', priceMultiplier: 0.6 },
        { kind: 'narrate', text: 'You sell the farm at a loss. At least you have gold now.' },
        { kind: 'advanceDays', days: 1 },
      ],
    },
    {
      id: 'sell_vineyard',
      label: 'Sell vineyard at 60% value',
      requires: [{ kind: 'ownsAsset', id: 'vineyard' }],
      effects: [
        { kind: 'sellAsset', id: 'vineyard', priceMultiplier: 0.6 },
        { kind: 'narrate', text: 'You sell the vineyard at a loss, but you needed the gold.' },
        { kind: 'advanceDays', days: 1 },
      ],
    },
    {
      id: 'hold_assets',
      label: 'Hold onto your assets',
      effects: [{ kind: 'narrate', text: 'You decline. Your assets are your security.' }],
    },
  ],
}

const spice_merchant_liquidation: StoryCard = {
  id: 'spice_merchant_liquidation',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Spice Guild Offer',
  body: [
    'A representative from the Spice Guild approaches you.',
    '"We\'re interested in acquiring spice holdings from independent merchants like you. We\'ll buy your entire spice inventory at market rates—250 gold. No haggling, clean transaction."',
    'It would convert your passive spice income into liquid capital.',
  ],
  choices: [
    {
      id: 'sell_spice_guild',
      label: 'Sell spice holdings for 250g',
      requires: [{ kind: 'ownsAsset', id: 'spice_guild_charter' }],
      effects: [
        { kind: 'sellAsset', id: 'spice_guild_charter', priceMultiplier: 1.0 },
        { kind: 'narrate', text: 'You sell your spice holdings to the guild. They now control your inventory.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'keep_spice',
      label: 'Keep the spice business',
      effects: [],
    },
  ],
}

const salt_caravan_buyer: StoryCard = {
  id: 'salt_caravan_buyer',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Salt Caravan Consolidation',
  body: [
    'Salt caravan operators are consolidating their routes. A broker offers to buy your share.',
    '"We\'ll give you 180 gold for your salt caravan stake. Clean exit, no ongoing obligations."',
    'It would free you from the logistics of salt trading.',
  ],
  choices: [
    {
      id: 'sell_salt_caravan',
      label: 'Sell salt caravan share for 180g',
      requires: [{ kind: 'ownsAsset', id: 'salt_caravan_share' }],
      effects: [
        { kind: 'sellAsset', id: 'salt_caravan_share', priceMultiplier: 1.0 },
        { kind: 'narrate', text: 'You sell your salt caravan stake. One less business to manage.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'keep_salt',
      label: 'Keep the salt caravan',
      effects: [],
    },
  ],
}

export const assetLiquidationCards: StoryCard[] = [
  sell_property,
  merchant_guild_buyback,
  trade_route_buyer,
  desperate_buyer,
  spice_merchant_liquidation,
  salt_caravan_buyer,
]
