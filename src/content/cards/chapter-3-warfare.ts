import type { StoryCard } from '../../engine/types'
import { heat, venture } from './factories'

export const chapter3CommodityCards: StoryCard[] = [
  {
    id: 'ch3_war_profiteer_iron',
    weight: 5,
    title: 'War Profiteering - Iron',
    body: ['The kingdom mobilizes for war. A military contractor offers to buy iron at inflated prices. "We need weapons, armor, fortifications. Name your price."'],
    choices: [
      {
        id: 'sell_war_iron',
        label: 'Sell to the war effort (+300g)',
        effects: [
          { kind: 'gold', delta: 300 },
          { kind: 'stat', stat: 'savvy', delta: 1 },
          { kind: 'narrate', text: 'You profit from the kingdom\'s need. Blood money, but money nonetheless.' },
          heat('war'),
        ],
      },
      {
        id: 'refuse_war_iron',
        label: 'Refuse (moral stand)',
        effects: [{ kind: 'narrate', text: 'You turn down the blood profit. Your conscience is clear but your purse is light.' }],
      },
    ],
  },

  venture({
    id: 'ch3_military_supply_contract',
    weight: 4,
    title: 'Military Supply Contract',
    body: [
      'A general offers an exclusive contract to supply the army. "Spice, salt, iron - we need it all. 200 gold upfront, then we buy everything you can produce."',
    ],
    asset: { id: 'ch3_military_contract', label: 'Military Supply Contract', cost: 200, monthlyCashflow: 75, sector: 'military' },
    accept: {
      id: 'sign_military_contract',
      label: 'Sign the military contract (200g)',
      effects: [
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'You become the kingdom\'s primary supplier. Your fortune rises with the war.' },
      ],
    },
    decline: { id: 'refuse_military_contract', label: 'Decline', text: 'The general moves to the next merchant.' },
  }),

  {
    id: 'ch3_refugee_trade',
    weight: 3,
    title: 'Trading with Refugees',
    body: ['Refugees fleeing the war sell their goods at desperate prices. You could buy cheap and resell to the army at profit. Or you could help them escape with passage.'],
    choices: [
      {
        id: 'exploit_refugees',
        label: 'Buy refugee goods at 40% value (+250g)',
        effects: [
          { kind: 'gold', delta: 250 },
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'flag', id: 'refugee_exploiter', set: 1 },
          { kind: 'narrate', text: 'You buy their possessions for pennies. Easy profit. Easier guilt.' },
          heat('war'),
        ],
      },
      {
        id: 'help_refugees',
        label: 'Pay fair prices and help them escape (-80g)',
        requires: [{ kind: 'goldAtLeast', amount: 80 }],
        effects: [
          { kind: 'gold', delta: -80 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'flag', id: 'refugee_helper', set: 1 },
          { kind: 'narrate', text: 'You help families escape. It feels like the right choice.' },
        ],
      },
    ],
  },
]

export const chapter3MarketCards: StoryCard[] = [
  {
    id: 'ch3_battle_disrupts_supply',
    weight: 5,
    title: 'Battle Disrupts Trade Routes',
    body: ['A major battle closes the northern trade routes. Supply becomes scarce. Prices spike or crash depending on what you hold.'],
    choices: [
      {
        id: 'hold_scarce_goods',
        label: 'Hold and sell at premium (+200g)',
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'marketShift', sector: 'spice', delta: 25 },
          { kind: 'marketShift', sector: 'salt', delta: 20 },
          { kind: 'narrate', text: 'You hold the right goods. The shortage makes you rich.' },
        ],
      },
      {
        id: 'dump_excess',
        label: 'Sell everything before prices crash (-150g loss)',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'marketShift', sector: 'iron', delta: -30 },
          { kind: 'narrate', text: 'You sell in panic. The market declines anyway.' },
        ],
      },
    ],
  },

  {
    id: 'ch3_refugees_flood_market',
    weight: 4,
    title: 'Refugees Flood the Market',
    body: ['Thousands of refugees sell whatever they own to buy passage. Basic goods flood the market at rock-bottom prices.'],
    choices: [
      {
        id: 'buy_refugee_surplus',
        label: 'Buy the surplus cheaply (+180g)',
        requires: [{ kind: 'goldAtLeast', amount: 50 }],
        effects: [
          { kind: 'gold', delta: 180 },
          { kind: 'marketShift', sector: 'salt', delta: -25 },
          { kind: 'narrate', text: 'You buy when others panic. Smart trading.' },
        ],
      },
      {
        id: 'avoid_refugee_goods',
        label: 'Stay out of it',
        effects: [{ kind: 'narrate', text: 'Someone else profits from the chaos.' }],
      },
    ],
  },

  {
    id: 'ch3_military_convoy_raid',
    weight: 3,
    title: 'Military Convoy Raided',
    body: ['Bandits raid a military supply convoy. Soldiers chase them into the city. Your warehouse is caught in the crossfire.'],
    choices: [
      {
        id: 'protect_warehouse',
        label: 'Help soldiers defend (+50g reward)',
        effects: [
          { kind: 'gold', delta: 50 },
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'narrate', text: 'You fight alongside soldiers. They remember your help.' },
        ],
      },
      {
        id: 'hide',
        label: 'Hide and let it happen',
        effects: [
          { kind: 'gold', delta: -80 },
          { kind: 'narrate', text: 'Crossfire damages your goods. The cost is high.' },
        ],
      },
    ],
  },
]

export const chapter3DangerCards: StoryCard[] = [
  {
    id: 'ch3_conscription_notice',
    weight: 4,
    title: 'Conscription Notice',
    body: ['The kingdom conscripts able-bodied merchants for the war effort. You\'re summoned to serve. Refusal means losing trading privileges or worse.'],
    choices: [
      {
        id: 'bribe_for_exemption',
        label: 'Bribe your way out (-250g)',
        requires: [{ kind: 'goldAtLeast', amount: 250 }],
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'narrate', text: 'You pay. Your exemption is quietly filed away.' },
        ],
      },
      {
        id: 'serve_military',
        label: 'Serve (3 months out)',
        effects: [
          { kind: 'advanceDays', days: 90 },
          { kind: 'stat', stat: 'grit', delta: 2 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'You serve. War hardens you in ways gold never could.' },
        ],
      },
      {
        id: 'flee_conscription',
        label: 'Flee the kingdom',
        effects: [
          { kind: 'flag', id: 'kingdom_fugitive', set: 1 },
          { kind: 'narrate', text: 'You abandon your business and flee. A new life, or a new prison.' },
        ],
      },
    ],
  },

  {
    id: 'ch3_soldier_demands_goods',
    weight: 3,
    title: 'Soldiers Demand Tribute',
    body: ['A contingent of soldiers arrives. "The kingdom takes what it needs. Give us supplies or we take them by force."'],
    choices: [
      {
        id: 'comply_soldiers',
        label: 'Give them supplies (-200g value)',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'You hand over goods. At least they don\'t burn the place.' },
        ],
      },
      {
        id: 'resist_soldiers',
        label: 'Resist (Grit check, DC 16)',
        check: {
          stat: 'grit',
          dc: 16,
          success: { text: 'You stand firm. They respect it and leave empty-handed.', effects: [{ kind: 'stat', stat: 'grit', delta: 2 }] },
          failure: { text: 'They burn your warehouse.', effects: [{ kind: 'gold', delta: -500 }, { kind: 'stat', stat: 'nerve', delta: -2 }] },
        },
      },
    ],
  },

  {
    id: 'ch3_spy_recruitment',
    weight: 3,
    title: 'Spies Approach You',
    body: ['An agent appears. "You trade with many people. Report on them. We\'ll pay well. Refuse and we\'ll suspect you\'re spying for the enemy."'],
    choices: [
      {
        id: 'become_informant',
        label: 'Spy for the kingdom (+50g wages)',
        effects: [
          // A job, not an asset: a free asset would count as passive income toward freedom.
          { kind: 'wages', delta: 50 },
          { kind: 'flag', id: 'kingdom_spy', set: 1 },
          { kind: 'narrate', text: 'You become a spy. The money is good. The danger is better.' },
          heat('war'),
        ],
      },
      {
        id: 'refuse_spying',
        label: 'Refuse (risk suspicion)',
        effects: [
          { kind: 'flag', id: 'suspected_spy', set: 1 },
          { kind: 'narrate', text: 'You refuse. They leave, but you\'re marked as suspicious.' },
        ],
      },
    ],
  },
]
