import type { StoryCard } from '../../engine/types'
import { heat, venture } from './factories'

export const chapter3CommodityCards: StoryCard[] = [
  {
    id: 'ch3_war_profiteer_iron',
    weight: 5,
    once: true,
    title: 'Iron for the Forges',
    body: ['Drums beat in the square. The kingdom is going to war, and the forges are hungry. A quartermaster in a plumed hat slaps the table. "Iron! All you have. Name your price!"'],
    choices: [
      {
        id: 'sell_war_iron',
        label: 'Sell him your iron (+300g)',
        effects: [
          { kind: 'gold', delta: 300 },
          { kind: 'stat', stat: 'savvy', delta: 1 },
          { kind: 'narrate', text: 'Your iron rolls off toward the forges. The gold is good, but it is war gold.' },
          heat('war'),
        ],
      },
      {
        id: 'refuse_war_iron',
        label: 'Refuse: you won\'t feed the war',
        effects: [{ kind: 'narrate', text: 'You say no. Your heart feels light. So does your purse.' }],
      },
    ],
  },

  venture({
    id: 'ch3_military_supply_contract',
    weight: 4,
    title: 'The General\'s Contract',
    body: [
      'A general with a magnificent moustache unrolls a contract on his map table. "Spice, salt, iron, the army needs it all! Put in 200 gold, and we buy everything you can bring."',
    ],
    asset: { id: 'ch3_military_contract', label: 'Military Supply Contract', cost: 200, monthlyCashflow: 75, sector: 'military' },
    accept: {
      id: 'sign_military_contract',
      label: 'Sign the contract (200g)',
      effects: [
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'His moustache twitches with delight. Your wagons now roll to every army camp in the land.' },
      ],
    },
    decline: { id: 'refuse_military_contract', label: 'Politely decline', text: 'He twirls his moustache and calls the next merchant in.' },
  }),

  {
    id: 'ch3_refugee_trade',
    weight: 3,
    once: true,
    title: 'Families at the Gate',
    body: ['Families fleeing the war crowd the town gate with carts of pots and blankets. They will sell anything for a ticket to somewhere safe. You could buy cheap, or you could help.'],
    choices: [
      {
        id: 'exploit_refugees',
        label: 'Buy their things cheap (+250g)',
        effects: [
          { kind: 'gold', delta: 250 },
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'flag', id: 'refugee_exploiter', set: 1 },
          { kind: 'narrate', text: 'You buy their things for pennies. The profit is easy. Looking them in the eye is not.' },
          heat('war'),
        ],
      },
      {
        id: 'help_refugees',
        label: 'Pay fairly and help them leave (-80g)',
        requires: [{ kind: 'goldAtLeast', amount: 80 }],
        effects: [
          { kind: 'gold', delta: -80 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'flag', id: 'refugee_helper', set: 1 },
          { kind: 'narrate', text: 'A little girl waves at you from the back of a cart. It feels right.' },
        ],
      },
    ],
  },
]

export const chapter3MarketCards: StoryCard[] = [
  {
    id: 'ch3_battle_disrupts_supply',
    weight: 5,
    title: 'The Bridge Is Down',
    body: ['News arrives: the great northern bridge has fallen, and no caravans can cross. Some goods will be rare and precious. Others will pile up with nowhere to go.'],
    choices: [
      {
        id: 'hold_scarce_goods',
        label: 'Hold on and sell high (+200g)',
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'marketShift', sector: 'spice', delta: 25 },
          { kind: 'marketShift', sector: 'salt', delta: 20 },
          { kind: 'narrate', text: 'You hold exactly what people need. Buyers queue at your door.' },
        ],
      },
      {
        id: 'dump_excess',
        label: 'Sell everything in a hurry (-150g loss)',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'marketShift', sector: 'iron', delta: -30 },
          { kind: 'narrate', text: 'You sell in a panic. Prices drop anyway.' },
        ],
      },
    ],
  },

  {
    id: 'ch3_refugees_flood_market',
    weight: 4,
    title: 'A Market Full of Bargains',
    body: ['The square is packed with travellers selling rugs, pots and chairs to pay for passage. Everything is cheap, cheaper than you have ever seen.'],
    choices: [
      {
        id: 'buy_refugee_surplus',
        label: 'Buy up the bargains (+180g)',
        requires: [{ kind: 'goldAtLeast', amount: 50 }],
        effects: [
          { kind: 'gold', delta: 180 },
          { kind: 'marketShift', sector: 'salt', delta: -25 },
          { kind: 'narrate', text: 'You buy while others panic. Later, you sell for a tidy profit.' },
        ],
      },
      {
        id: 'avoid_refugee_goods',
        label: 'Stay out of it',
        effects: [{ kind: 'narrate', text: 'Other traders fill their carts instead.' }],
      },
    ],
  },

  {
    id: 'ch3_military_convoy_raid',
    weight: 3,
    once: true,
    title: 'Chaos in the Street',
    body: ['Crash! An army supply cart tips over outside your warehouse. Bandits grab sacks of apples and run. Soldiers charge after them, right through your goods.'],
    choices: [
      {
        id: 'protect_warehouse',
        label: 'Help the soldiers (+50g reward)',
        effects: [
          { kind: 'gold', delta: 50 },
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'narrate', text: 'You trip a fleeing bandit with a broom. The soldiers cheer and pay you a reward.' },
        ],
      },
      {
        id: 'hide',
        label: 'Hide behind the barrels',
        effects: [
          { kind: 'gold', delta: -80 },
          { kind: 'narrate', text: 'When the dust settles, half your goods are trampled flat.' },
        ],
      },
    ],
  },
]

export const chapter3DangerCards: StoryCard[] = [
  {
    id: 'ch3_conscription_notice',
    weight: 4,
    once: true,
    title: 'The Royal Summons',
    body: ['A town crier climbs onto a barrel. "By royal order, every merchant must serve the army!" A sealed letter arrives with your name on it. Saying no could cost you your trading licence.'],
    choices: [
      {
        id: 'bribe_for_exemption',
        label: 'Pay to get out of it (-250g)',
        requires: [{ kind: 'goldAtLeast', amount: 250 }],
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'narrate', text: 'You pay. A clerk quietly stamps your papers: excused.' },
        ],
      },
      {
        id: 'serve_military',
        label: 'Serve the army (3 months away)',
        effects: [
          { kind: 'advanceDays', days: 90 },
          { kind: 'stat', stat: 'grit', delta: 2 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'You march, dig and carry for 3 long months. You come home tougher than ever.' },
        ],
      },
      {
        id: 'flee_conscription',
        label: 'Flee the kingdom',
        effects: [
          { kind: 'flag', id: 'kingdom_fugitive', set: 1 },
          { kind: 'narrate', text: 'You leave everything behind and slip away by night. A new start, with empty pockets.' },
        ],
      },
    ],
  },

  {
    id: 'ch3_soldier_demands_goods',
    weight: 3,
    once: true,
    title: 'Soldiers at the Counter',
    body: ['A pushy squad in bright tabards crowds your counter. Their sergeant points at your sacks. "The kingdom needs these. Hand them over, or we just take them."'],
    choices: [
      {
        id: 'comply_soldiers',
        label: 'Hand over the supplies (-200g value)',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'You hand them over. They march off with your sacks, singing.' },
        ],
      },
      {
        id: 'resist_soldiers',
        label: 'Stand firm (Grit check, DC 16)',
        check: {
          stat: 'grit',
          dc: 16,
          success: { text: 'You do not budge an inch. The sergeant grunts, and they leave empty-handed.', effects: [{ kind: 'stat', stat: 'grit', delta: 2 }] },
          failure: { text: 'They take everything, and wreck your warehouse on the way out.', effects: [{ kind: 'gold', delta: -500 }, { kind: 'stat', stat: 'nerve', delta: -2 }] },
        },
      },
    ],
  },

  {
    id: 'ch3_spy_recruitment',
    weight: 3,
    once: true,
    title: 'A Spy in a Grey Cloak',
    body: ['A woman in a grey cloak appears beside you. "You talk to many people," she murmurs. "Tell us what they say, and we pay well. Refuse, and we might wonder whose side you\'re on."'],
    choices: [
      {
        id: 'become_informant',
        label: 'Spy for the kingdom (+50g wages)',
        effects: [
          // A job, not an asset: a free asset would count as passive income toward freedom.
          { kind: 'wages', delta: 50 },
          { kind: 'flag', id: 'kingdom_spy', set: 1 },
          { kind: 'narrate', text: 'You become a spy. The money is good. Every stranger now makes you nervous.' },
          heat('war'),
        ],
      },
      {
        id: 'refuse_spying',
        label: 'Refuse, and risk her suspicion',
        effects: [
          { kind: 'flag', id: 'suspected_spy', set: 1 },
          { kind: 'narrate', text: 'She melts away. From now on, you feel eyes on your back.' },
        ],
      },
    ],
  },
]
