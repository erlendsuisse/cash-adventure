import type { StoryCard } from '../../engine/types'

// Asset liquidation cards - let players sell assets for gold
// These appear when players need cash or want to restructure their portfolio

const sell_property: StoryCard = {
  id: 'sell_property',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Noble Wants Your Manor',
  body: [
    'A noble in a fur-trimmed cloak admires your manor from the gate.',
    '"A lovely house," she says. "I\'ll pay 300 gold for it, today."',
  ],
  choices: [
    {
      id: 'sell_manor',
      label: 'Sell the manor (+300g)',
      requires: [{ kind: 'ownsAsset', id: 'manor_estate' }],
      effects: [
        { kind: 'sellAsset', id: 'manor_estate', priceMultiplier: 1.0 },
        { kind: 'narrate', text: 'You hand over the keys for 300 gold. She moves in that very afternoon.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'keep_property',
      label: 'Keep the manor',
      effects: [{ kind: 'narrate', text: 'You smile and shake your head. The manor is worth more to you.' }],
    },
  ],
}

const merchant_guild_buyback: StoryCard = {
  id: 'merchant_guild_buyback',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Guild Buys Back Charters',
  body: [
    'A letter arrives from the Merchant Guild.',
    '"We are buying back guild charters," it reads. "We will pay 150 gold for yours."',
    'You would get the gold, but lose the charter\'s income and your seat at guild dinners.',
  ],
  choices: [
    {
      id: 'sell_charter',
      label: 'Sell the charter (+150g)',
      requires: [{ kind: 'ownsAsset', id: 'guild_charter' }],
      effects: [
        { kind: 'sellAsset', id: 'guild_charter', priceMultiplier: 1.0 },
        { kind: 'narrate', text: 'You sell the charter back. One less thing to worry about.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'keep_charter',
      label: 'Keep the charter',
      effects: [],
    },
  ],
}

const trade_route_buyer: StoryCard = {
  id: 'trade_route_buyer',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Someone Wants Your Trade Routes',
  body: [
    'A group of merchants in matching blue coats wants to buy your trade routes.',
    '"Your routes fit our map perfectly," says their leader. "200 gold, and we take over everything."',
  ],
  choices: [
    {
      id: 'sell_route',
      label: 'Sell the routes (+200g)',
      requires: [{ kind: 'ownsAsset', id: 'trade_route' }],
      effects: [
        { kind: 'sellAsset', id: 'trade_route', priceMultiplier: 1.0 },
        { kind: 'narrate', text: 'You sell the routes. Blue-coated merchants take over the very next morning.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'keep_routes',
      label: 'Keep your routes',
      effects: [],
    },
  ],
}

const desperate_buyer: StoryCard = {
  id: 'desperate_buyer',
  weight: 1,
  storyPhase: 'recovery',
  title: 'A Quick, Cheap Sale',
  body: [
    'A twitchy trader catches your sleeve.',
    '"Need gold fast?" he asks. "I\'ll buy your farm or vineyard right now. Not at full price, mind. 60 coins for every 100 it\'s worth."',
    'You would lose money, but you would have gold in your hand today.',
  ],
  choices: [
    {
      id: 'sell_farm',
      label: 'Sell the farm cheap (60% of its value)',
      requires: [{ kind: 'ownsAsset', id: 'farm' }],
      effects: [
        { kind: 'sellAsset', id: 'farm', priceMultiplier: 0.6 },
        { kind: 'narrate', text: 'You sell the farm at a loss. At least you have gold now.' },
        { kind: 'advanceDays', days: 1 },
      ],
    },
    {
      id: 'sell_vineyard',
      label: 'Sell the vineyard cheap (60% of its value)',
      requires: [{ kind: 'ownsAsset', id: 'vineyard' }],
      effects: [
        { kind: 'sellAsset', id: 'vineyard', priceMultiplier: 0.6 },
        { kind: 'narrate', text: 'You sell the vineyard at a loss. You needed the gold.' },
        { kind: 'advanceDays', days: 1 },
      ],
    },
    {
      id: 'hold_assets',
      label: 'Keep what you have',
      effects: [{ kind: 'narrate', text: 'You shake your head. Your ventures are your safety net.' }],
    },
  ],
}

const spice_merchant_liquidation: StoryCard = {
  id: 'spice_merchant_liquidation',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Spice Guild\'s Offer',
  body: [
    'A Spice Guild agent arrives, smelling faintly of cloves.',
    '"We\'re buying up spice businesses," she says. "250 gold for yours. No haggling."',
    'You would get a pile of gold now, but lose the monthly spice income.',
  ],
  choices: [
    {
      id: 'sell_spice_guild',
      label: 'Sell your spice business (+250g)',
      requires: [{ kind: 'ownsAsset', id: 'spice_guild_charter' }],
      effects: [
        { kind: 'sellAsset', id: 'spice_guild_charter', priceMultiplier: 1.0 },
        { kind: 'narrate', text: 'You sell to the guild. Your spice business is theirs now.' },
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
  title: 'An Offer for Your Salt Caravan',
  body: [
    'A salt broker with crusty white cuffs wants your caravan share.',
    '"180 gold for your share," he says. "Clean and simple."',
  ],
  choices: [
    {
      id: 'sell_salt_caravan',
      label: 'Sell your share (+180g)',
      requires: [{ kind: 'ownsAsset', id: 'salt_caravan_share' }],
      effects: [
        { kind: 'sellAsset', id: 'salt_caravan_share', priceMultiplier: 1.0 },
        { kind: 'narrate', text: 'You sell your share. One less caravan to worry about.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'keep_salt',
      label: 'Keep the caravan',
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
