// Wealth-building cards: new opportunities to acquire iron, spice, and merchant routes
import type { StoryCard } from '../../engine/types'

export const wealthBuildingDeck: StoryCard[] = [
  // Iron opportunities (various tiers)
  {
    id: 'iron_broker_visit',
    title: 'The Iron Broker',
    body: ['A broad merchant with soot on his cheeks drops an iron bar on your table. Clang! "Plenty more where that came from," he says. "The shipyards can\'t get enough."'],
    storyPhase: 'climbing',
    weight: 12,
    choices: [
      {
        id: 'buy_iron_bars',
        label: 'Buy into his iron trade (120g, +18g/month)',
        requires: [{ kind: 'goldAtLeast', amount: 120 }],
        showLockedAs: 'Needs 120g',
        effects: [
          { kind: 'gold', delta: -120 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'iron_bars',
              label: 'Iron Bars',
              cost: 120,
              monthlyCashflow: 18,
              sector: 'iron',
            },
          },
          {
            kind: 'narrate',
            text: 'Iron bars arrive every month, and so does a steady little profit.',
          },
        ],
      },
      {
        id: 'pass_iron_broker',
        label: 'Politely decline',
        effects: [{ kind: 'narrate', text: 'He tucks the bar under his arm and clanks off to find another buyer.' }],
      },
    ],
  },

  {
    id: 'mining_syndicate_offer',
    title: 'A Letter from the Mining Syndicate',
    body: ['A letter arrives, sealed with a pickaxe in red wax. The mining syndicate is selling shares in a new iron mine. "Only 50 trusted partners are invited," it reads.'],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 180 }],
    choices: [
      {
        id: 'buy_syndicate_share',
        label: 'Buy a share (180g, +32g/month)',
        effects: [
          { kind: 'gold', delta: -180 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'mining_syndicate_share',
              label: 'Mining Syndicate Share',
              cost: 180,
              monthlyCashflow: 32,
              sector: 'iron',
            },
          },
          {
            kind: 'narrate',
            text: 'You are one of the 50 now. A share of the mine\'s profits arrives every month.',
          },
        ],
      },
      {
        id: 'pass_syndicate',
        label: 'Too risky',
        effects: [{ kind: 'narrate', text: 'You fold the letter away. Someone else will take your place.' }],
      },
    ],
  },

  {
    id: 'scrap_iron_collection',
    title: 'The Scrap Iron Trade',
    body: ['A friendly blacksmith wipes her brow. "The shipyards throw out heaps of scrap iron," she says. "Buy it cheap, and I\'ll help you sell it on."'],
    storyPhase: 'early_game',
    weight: 14,
    requires: [{ kind: 'goldAtLeast', amount: 60 }],
    choices: [
      {
        id: 'start_scrap_business',
        label: 'Start the scrap trade (60g, +12g/month)',
        effects: [
          { kind: 'gold', delta: -60 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'scrap_iron_operation',
              label: 'Scrap Iron Operation',
              cost: 60,
              monthlyCashflow: 12,
              sector: 'iron',
            },
          },
          { kind: 'flag', id: 'scrap_iron_started', set: 1 },
          {
            kind: 'narrate',
            text: 'Your cart clatters around the shipyards collecting scrap. The first coins arrive before the month is out.',
          },
        ],
      },
      {
        id: 'decline_scrap',
        label: 'Not for you',
        effects: [
          {
            kind: 'narrate',
            text: 'She shrugs and asks someone else.',
          },
        ],
      },
    ],
  },

  // Spice opportunities (various tiers)
  {
    id: 'spice_merchant_contact',
    title: 'The Spice Road',
    body: ['A woman in a saffron-yellow robe smiles at you. Cinnamon drifts from her sleeves. "My caravans walk the southern spice road," she says. "A small share pays you every month."'],
    storyPhase: 'climbing',
    weight: 12,
    requires: [{ kind: 'goldAtLeast', amount: 80 }],
    choices: [
      {
        id: 'invest_spice_trade',
        label: 'Buy a share (80g, +22g/month)',
        effects: [
          { kind: 'gold', delta: -80 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'spice_trade_share',
              label: 'Spice Trade Share',
              cost: 80,
              monthlyCashflow: 22,
              sector: 'spice',
            },
          },
          {
            kind: 'narrate',
            text: 'Camels plod along the spice road, and every month a little of their profit is yours.',
          },
        ],
      },
      {
        id: 'pass_spice_merchant',
        label: 'Politely refuse',
        effects: [
          {
            kind: 'narrate',
            text: 'She nods and disappears into the crowd, trailing cinnamon.',
          },
        ],
      },
    ],
  },

  {
    id: 'spice_warehouse_venture',
    title: 'A Warehouse Full of Spice',
    body: ['Your friend at the docks leans in. "There\'s a warehouse stuffed with spice that needs a partner," she whispers. "Good terms, if you\'re quick."'],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 150 }],
    choices: [
      {
        id: 'fund_warehouse',
        label: 'Fund the warehouse (150g, +35g/month)',
        effects: [
          { kind: 'gold', delta: -150 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'spice_warehouse',
              label: 'Spice Warehouse',
              cost: 150,
              monthlyCashflow: 35,
              sector: 'spice',
            },
          },
          {
            kind: 'narrate',
            text: 'Sacks of spice come in and go out, and you earn on every one.',
          },
        ],
      },
      {
        id: 'pass_warehouse',
        label: 'Look for something else',
        effects: [
          {
            kind: 'narrate',
            text: 'The warehouse finds another partner.',
          },
        ],
      },
    ],
  },

  // Merchant routes (special assets with quantity)
  {
    id: 'merchant_route_offer',
    title: 'The Southern Road',
    body: ['A new road has opened to the south! Merchants are building trading posts along it. "There\'s room for one more partner," says a cheerful trader.'],
    storyPhase: 'climbing',
    weight: 11,
    requires: [{ kind: 'goldAtLeast', amount: 100 }],
    choices: [
      {
        id: 'establish_merchant_route',
        label: 'Open a trading post (100g, +28g/month)',
        effects: [
          { kind: 'gold', delta: -100 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'merchant_route',
              label: 'Merchant Route',
              cost: 100,
              monthlyCashflow: 28,
              sector: 'trade',
              quantity: 1,
            },
          },
          { kind: 'flag', id: 'merchant_route_active', set: 1 },
          {
            kind: 'narrate',
            text: 'Your trading post opens on the southern road. Carts stop, trade and pay.',
          },
        ],
      },
      {
        id: 'pass_route',
        label: 'Wait for another chance',
        effects: [
          {
            kind: 'narrate',
            text: 'Not now. Maybe later.',
          },
        ],
      },
    ],
  },

  {
    id: 'expand_merchant_routes',
    title: 'A Second Road',
    body: ['Your trading post is busy every day. Your partners grin. "We\'re opening another road, to the west," they say. "Are you in?"'],
    weight: 13,
    requires: [
      { kind: 'flag', id: 'merchant_route_active', atLeast: 1 },
      { kind: 'goldAtLeast', amount: 100 },
    ],
    choices: [
      {
        id: 'expand_routes',
        label: 'Open a second post (100g, +28g/month)',
        effects: [
          { kind: 'gold', delta: -100 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'merchant_route',
              label: 'Merchant Route',
              cost: 100,
              monthlyCashflow: 28,
              sector: 'trade',
              quantity: 2,
            },
          },
          {
            kind: 'narrate',
            text: 'Now you have trading posts on two roads, and twice the profit.',
          },
        ],
      },
      {
        id: 'decline_expansion',
        label: 'One road is enough',
        effects: [
          {
            kind: 'narrate',
            text: 'You focus on making your first post even better.',
          },
        ],
      },
    ],
  },

  // Late-game wealth consolidation
  {
    id: 'guild_partnership',
    title: 'A Partner in the Guild',
    body: ['The guild master himself visits your shop, chain of office glinting. "We want traders like you," he says. "Become a full guild partner."'],
    weight: 9,
    requires: [
      { kind: 'goldAtLeast', amount: 200 },
      { kind: 'colossiAtLeast', count: 3 },
    ],
    choices: [
      {
        id: 'join_guild',
        label: 'Become a guild partner (200g, +50g/month)',
        requires: [{ kind: 'goldAtLeast', amount: 200 }],
        showLockedAs: 'Needs 200g',
        effects: [
          { kind: 'gold', delta: -200 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'guild_partnership',
              label: 'Guild Partnership',
              cost: 200,
              monthlyCashflow: 50,
              sector: 'trade',
            },
          },
          { kind: 'flag', id: 'in_guild', set: 1 },
          {
            kind: 'narrate',
            text: 'You sign the guild\'s great book. Doors open everywhere, and the profits roll in.',
          },
        ],
      },
      {
        id: 'decline_guild',
        label: 'Stay independent',
        effects: [
          {
            kind: 'narrate',
            text: 'You prefer your freedom. The guild master bows and leaves you be.',
          },
        ],
      },
    ],
  },
]
