// Wealth-building cards: new opportunities to acquire iron, spice, and merchant routes
import type { StoryCard } from '../../engine/types'

export const wealthBuildingDeck: StoryCard[] = [
  // Iron opportunities (various tiers)
  {
    id: 'iron_broker_visit',
    title: 'The Iron Broker',
    body: ['A rough-dressed merchant approaches with a proposition. "I deal in raw iron bars. Cheap and plentiful. Interested?" The demand from the crown\'s shipyards seems endless.'],
    storyPhase: 'climbing',
    weight: 12,
    choices: [
      {
        id: 'buy_iron_bars',
        label: 'Buy a shipment',
        effects: [
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
            text: 'You acquire a steady supply of iron bars. Every month brings predictable returns.',
          },
        ],
      },
      {
        id: 'pass_iron_broker',
        label: 'Decline politely',
        effects: [{ kind: 'narrate', text: 'The broker shrugs and moves on to find another buyer.' }],
      },
    ],
  },

  {
    id: 'mining_syndicate_offer',
    title: 'The Mining Syndicate',
    body: ['A letter arrives sealed with a mark you recognize. The mining syndicate is offering shares in a new iron operation. "Only 50 trusted partners get this opportunity," it reads.'],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 180 }],
    choices: [
      {
        id: 'buy_syndicate_share',
        label: 'Invest in the syndicate',
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
            text: 'Your investment secures a seat at the syndicate\'s table. Monthly dividends begin to arrive.',
          },
        ],
      },
      {
        id: 'pass_syndicate',
        label: 'Too risky',
        effects: [{ kind: 'narrate', text: 'You fold the letter carefully. Someone else will take the opportunity.' }],
      },
    ],
  },

  {
    id: 'scrap_iron_collection',
    title: 'Scrap Iron Opportunity',
    body: ['A blacksmith you know needs help. "I\'ve got contacts at the shipyards. They sell scrap iron cheap. If you take the waste, I\'ll help you find buyers." Easy profit if you move fast.'],
    storyPhase: 'early_game',
    weight: 14,
    requires: [{ kind: 'goldAtLeast', amount: 60 }],
    choices: [
      {
        id: 'start_scrap_business',
        label: 'Start collecting scrap',
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
            text: 'You establish a small operation collecting and reselling scrap iron. Your first profits arrive before the month ends.',
          },
        ],
      },
      {
        id: 'decline_scrap',
        label: 'Not interested',
        effects: [
          {
            kind: 'narrate',
            text: 'The blacksmith shrugs and finds someone else to help.',
          },
        ],
      },
    ],
  },

  // Spice opportunities (various tiers)
  {
    id: 'spice_merchant_contact',
    title: 'A Spice Merchant\'s Offer',
    body: ['A robed woman with dark eyes finds you in the market. "I have connections to the southern spice routes. Small investments, steady returns. Are you interested?"'],
    storyPhase: 'climbing',
    weight: 12,
    requires: [{ kind: 'goldAtLeast', amount: 80 }],
    choices: [
      {
        id: 'invest_spice_trade',
        label: 'Invest in spice trading',
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
            text: 'Your investment enters the spice trade network. Each month brings returns as goods move along the routes.',
          },
        ],
      },
      {
        id: 'pass_spice_merchant',
        label: 'Politely refuse',
        effects: [
          {
            kind: 'narrate',
            text: 'The merchant nods understanding and vanishes back into the crowd.',
          },
        ],
      },
    ],
  },

  {
    id: 'spice_warehouse_venture',
    title: 'The Warehouse Opportunity',
    body: ['Your friend at the docks knows about a spice warehouse looking for investors. "They\'re full of inventory and need working capital. Good terms if you commit now."'],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 150 }],
    choices: [
      {
        id: 'fund_warehouse',
        label: 'Fund the warehouse',
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
            text: 'Your capital secures a stake in the warehouse. As spice moves in and out, you profit from the flow.',
          },
        ],
      },
      {
        id: 'pass_warehouse',
        label: 'Find another investment',
        effects: [
          {
            kind: 'narrate',
            text: 'You pass on the opportunity. The warehouse finds another backer.',
          },
        ],
      },
    ],
  },

  // Merchant routes (special assets with quantity)
  {
    id: 'merchant_route_offer',
    title: 'A Trade Route Opens',
    body: ['News travels fast. A new land route has opened to the south. Several merchants are pooling resources to establish trading posts along it. "Partnership shares available for early investors," one tells you.'],
    storyPhase: 'climbing',
    weight: 11,
    requires: [{ kind: 'goldAtLeast', amount: 100 }],
    choices: [
      {
        id: 'establish_merchant_route',
        label: 'Establish a route',
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
            text: 'Your merchants establish a trading post. Goods flow and profits accumulate.',
          },
        ],
      },
      {
        id: 'pass_route',
        label: 'Wait for another opportunity',
        effects: [
          {
            kind: 'narrate',
            text: 'You decide the timing isn\'t right. Perhaps later.',
          },
        ],
      },
    ],
  },

  {
    id: 'expand_merchant_routes',
    title: 'Expand Your Routes',
    body: ['Your first merchant route is thriving. Your partners approach you. "We\'re opening a second route to the west. You in?"'],
    weight: 13,
    requires: [
      { kind: 'flag', id: 'merchant_route_active', atLeast: 1 },
      { kind: 'goldAtLeast', amount: 100 },
    ],
    choices: [
      {
        id: 'expand_routes',
        label: 'Expand to a second route',
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
            text: 'You expand your trade network. Now goods flow along multiple routes, multiplying your returns.',
          },
        ],
      },
      {
        id: 'decline_expansion',
        label: 'One route is enough',
        effects: [
          {
            kind: 'narrate',
            text: 'You focus on optimizing what you already have.',
          },
        ],
      },
    ],
  },

  // Late-game wealth consolidation
  {
    id: 'guild_partnership',
    title: 'Guild Partnership Proposal',
    body: ['As your wealth grows, the merchant guilds take notice. "We want successful independent traders like you. Join our guild. Full partnership with quarterly bonuses."'],
    weight: 9,
    requires: [
      { kind: 'goldAtLeast', amount: 200 },
      { kind: 'colossiAtLeast', count: 3 },
    ],
    choices: [
      {
        id: 'join_guild',
        label: 'Accept the guild partnership',
        effects: [
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
            text: 'You join the merchant guild as a full partner. Doors open and wealth flows from every direction.',
          },
        ],
      },
      {
        id: 'decline_guild',
        label: 'Remain independent',
        effects: [
          {
            kind: 'narrate',
            text: 'You prefer your freedom. The guild respects your choice and makes no further approach.',
          },
        ],
      },
    ],
  },
]
