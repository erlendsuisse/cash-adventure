import type { StoryCard } from '../../engine/types'
import { venture } from './factories'

export const chapter7CommodityCards: StoryCard[] = [
  venture({
    id: 'ch7_artifact_collection',
    weight: 5,
    title: 'The Cabinet of Wonders',
    body: [
      'An old collector opens a cabinet of wonders. A clock that runs backwards. A compass that points to whatever you want most. "400 gold," he says, "for the whole collection."',
    ],
    asset: { id: 'ch7_artifacts', label: 'Forbidden Artifact Collection', cost: 400, monthlyCashflow: 150, sector: 'transcendence' },
    accept: {
      id: 'collect_artifacts',
      label: 'Buy the cabinet (400g)',
      effects: [
        { kind: 'stat', stat: 'nerve', delta: 2 },
        { kind: 'narrate', text: 'At night, the objects hum softly and whisper secrets about the market.' },
      ],
    },
    decline: { id: 'refuse_artifacts', label: 'Close the cabinet', text: 'Some wonders are best left in their cabinet.' },
  }),

  venture({
    id: 'ch7_dimensional_trade',
    weight: 4,
    title: 'The Door to Elsewhere',
    body: ['A merchant in a coat of shifting colours shows you a door standing alone in a field. Through it you glimpse purple grass and two suns. "Goods from other worlds," she says. "380 gold opens it."'],
    asset: { id: 'ch7_gateway', label: 'Dimensional Trade Gateway', cost: 380, monthlyCashflow: 140, sector: 'transcendence' },
    accept: {
      id: 'open_gateway',
      label: 'Open the door (380g)',
      effects: [
        { kind: 'flag', id: 'dimensional_trader', set: 1 },
        { kind: 'narrate', text: 'Glowing fruit and singing glass now arrive through your door. Nobody else sells anything like it.' },
      ],
    },
    decline: { id: 'stay_mundane', label: 'Stay in this world', text: 'You leave the door closed. One world is plenty.' },
  }),

  venture({
    id: 'ch7_consciousness_trade',
    weight: 3,
    title: 'The Market of Ideas',
    body: ['A glowing figure made of starlight smiles at you. "Here, people trade ideas, dreams and memories," it says. "For 420 gold, I will teach you how."'],
    asset: { id: 'ch7_consciousness', label: 'Consciousness Trading Network', cost: 420, monthlyCashflow: 160, sector: 'transcendence' },
    accept: {
      id: 'trade_consciousness',
      label: 'Learn to trade in ideas (420g)',
      effects: [
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'transcendent_being', set: 1 },
        { kind: 'narrate', text: 'Your mind feels enormous. You sell a brilliant idea before breakfast and a sweet dream by lunch.' },
      ],
    },
    decline: { id: 'stay_human', label: 'Keep your ideas to yourself', text: 'Some things should stay inside your own head.' },
  }),
]

export const chapter7MarketCards: StoryCard[] = [
  {
    id: 'ch7_reality_fractures',
    weight: 5,
    title: 'The World Cracks Open',
    body: ['Cracks of light split the sky. Through them you see other cities, other skies. A street in Vessarin leads somewhere new each morning. Nothing works the way it used to.'],
    choices: [
      {
        id: 'ride_wave',
        label: 'Ride the chaos (+500g)',
        effects: [
          { kind: 'gold', delta: 500 },
          { kind: 'marketShift', sector: 'spice', delta: 50 },
          { kind: 'stat', stat: 'nerve', delta: 2 },
          { kind: 'narrate', text: 'You trade between the cracks, buying in one world and selling in the next. The profits are astonishing.' },
        ],
      },
      {
        id: 'seek_refuge',
        label: 'Help people find safe ground (-300g)',
        effects: [
          { kind: 'gold', delta: -300 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'You lead frightened neighbours to streets that stay put. Gold can wait.' },
        ],
      },
    ],
  },

  {
    id: 'ch7_time_market_chaos',
    weight: 4,
    title: 'The Clocks Go Wrong',
    body: ['Every clock in the market shows a different time. A trader sells you an apple before you buy it. Fortunes appear and vanish in the blink of an eye.'],
    choices: [
      {
        id: 'time_arbitrage',
        label: 'Buy yesterday, sell tomorrow (+450g)',
        effects: [
          { kind: 'gold', delta: 450 },
          { kind: 'marketShift', sector: 'salt', delta: 40 },
          { kind: 'narrate', text: 'You buy at yesterday\'s prices and sell at tomorrow\'s. It makes no sense, but it pays.' },
        ],
      },
      {
        id: 'abandon_market',
        label: 'Step out of the time muddle (-250g)',
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'advanceDays', days: 5 },
          { kind: 'narrate', text: 'You step back into plain old today. Safe, but it costs you.' },
        ],
      },
    ],
  },

  {
    id: 'ch7_cosmic_event',
    weight: 3,
    title: 'The Violet Sky',
    body: ['The sky over Vessarin turns violet. Every scale in the market swings at once, and the old prices simply melt away. Whoever moves first will write the new ones.'],
    choices: [
      {
        id: 'embrace_new_order',
        label: 'Write the new prices (+550g)',
        effects: [
          { kind: 'gold', delta: 550 },
          { kind: 'marketShift', sector: 'iron', delta: 60 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'You set the first new prices, and the whole world follows. Your wealth is beyond counting.' },
        ],
      },
      {
        id: 'transcend_wealth',
        label: 'Give your wealth away',
        effects: [
          { kind: 'gold', delta: -1000 },
          { kind: 'stat', stat: 'charm', delta: 3 },
          { kind: 'narrate', text: 'You give it all away, and feel lighter than you have in years. Some treasures can\'t be bought.' },
        ],
      },
    ],
  },
]

export const chapter7DangerCards: StoryCard[] = [
  {
    id: 'ch7_entity_confrontation',
    weight: 5,
    once: true,
    title: 'The Ancient Giant Awakes',
    body: ['In a ruined temple, an enormous stone figure opens glowing eyes. Its voice rumbles like an earthquake. "Little merchant. You have gathered great power. Now you must answer for it."'],
    choices: [
      {
        id: 'negotiate_entity',
        label: 'Reason with the giant (Charm check, DC 18)',
        check: {
          stat: 'charm',
          dc: 18,
          success: { text: 'You speak calmly and well. The giant\'s eyes soften. "Very well," it rumbles. "We have a truce."', effects: [{ kind: 'stat', stat: 'charm', delta: 3 }] },
          failure: { text: 'Your words bounce off the stone. The giant sweeps your treasure into its great hands and swallows it whole.', effects: [{ kind: 'gold', delta: -1000 }] },
        },
      },
      {
        id: 'fight_entity',
        label: 'Stand up to the giant',
        effects: [
          { kind: 'advanceDays', days: 7 },
          { kind: 'stat', stat: 'grit', delta: 2 },
          { kind: 'stat', stat: 'nerve', delta: 2 },
          { kind: 'narrate', text: 'You stand your ground as the temple shakes around you. You make it out, dusty and shaken, but alive.' },
        ],
      },
    ],
  },

  {
    id: 'ch7_mind_unraveling',
    weight: 4,
    once: true,
    title: 'The Whispers in Your Head',
    body: ['You have learned too many strange secrets. Now they whisper to you at night. Mirrors show the wrong room. You cannot always tell what is real.'],
    choices: [
      {
        id: 'embrace_madness',
        label: 'Listen to the whispers',
        effects: [
          { kind: 'stat', stat: 'nerve', delta: 3 },
          { kind: 'stat', stat: 'charm', delta: -2 },
          { kind: 'stat', stat: 'savvy', delta: -2 },
          { kind: 'narrate', text: 'You stop fighting and listen. The world becomes very strange, and strangely beautiful.' },
        ],
      },
      {
        id: 'resist_madness',
        label: 'Hold on to what\'s real (Grit check, DC 16)',
        check: {
          stat: 'grit',
          dc: 16,
          success: { text: 'You count your coins, name your friends, and hold on tight. The whispers fade.', effects: [{ kind: 'stat', stat: 'grit', delta: 3 }] },
          failure: {
            text: 'The whispers win for a whole season. When you come back to yourself, your clerks have been running things. Badly.',
            effects: [{ kind: 'gold', delta: -300 }, { kind: 'stat', stat: 'savvy', delta: -1 }, { kind: 'advanceDays', days: 28 }],
          },
        },
      },
    ],
  },

  {
    id: 'ch7_final_choice',
    weight: 5,
    once: true,
    title: 'A Choice Before the Mirror',
    body: ['Before the last Colossus comes, a voice speaks from a tall mirror. It shows you 3 futures: something more than human, a legacy that lives on, or simply yourself. Whatever you choose, you take it into the final trial.'],
    choices: [
      {
        id: 'ascend',
        label: 'Reach for something more than human',
        effects: [
          { kind: 'stat', stat: 'nerve', delta: 2 },
          { kind: 'stat', stat: 'savvy', delta: 2 },
          { kind: 'flag', id: 'chose_ascension', set: 1 },
          { kind: 'narrate', text: 'Something vast brushes your mind. You feel sharper, colder and braver.' },
        ],
      },
      {
        id: 'return_legacy',
        label: 'Build something for those who come after',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 3 },
          { kind: 'gold', delta: 500 },
          { kind: 'flag', id: 'chose_legacy', set: 1 },
          { kind: 'narrate', text: 'You pay for schools and guildhalls. People start to say your name with a smile.' },
        ],
      },
      {
        id: 'reject_both',
        label: 'Turn away and stay yourself',
        effects: [
          { kind: 'stat', stat: 'grit', delta: 2 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'flag', id: 'chose_self', set: 1 },
          { kind: 'narrate', text: 'You turn from the mirror. Whatever comes, it will meet you as you really are.' },
        ],
      },
    ],
  },
]
