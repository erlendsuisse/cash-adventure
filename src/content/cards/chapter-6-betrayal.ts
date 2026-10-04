import type { StoryCard } from '../../engine/types'
import { favour } from '../standings'
import { heat, venture } from './factories'

export const chapter6CommodityCards: StoryCard[] = [
  venture({
    id: 'ch6_intelligence_trade',
    weight: 5,
    title: 'The Spymaster\'s Offer',
    body: ['In a candlelit room full of maps, a spymaster pours you tea. "I know what your rivals plan before they do," she smiles. "350 gold, and you\'ll know too."'],
    asset: { id: 'ch6_intel', label: 'Intelligence Trading Network', cost: 350, monthlyCashflow: 110, sector: 'espionage' },
    accept: {
      id: 'buy_intelligence',
      label: 'Buy her secrets (350g)',
      effects: [{ kind: 'narrate', text: 'Now you know your rivals\' every move. But you start to wonder who is watching you.' }],
    },
    decline: { id: 'refuse_intelligence', label: 'Finish your tea and leave', text: 'Some secrets are safer not knowing.' },
  }),

  venture({
    id: 'ch6_conspiracy_network',
    weight: 4,
    title: 'A Seat at the Secret Table',
    body: ['Masked nobles sit around a round table in a hidden cellar. One pulls out a chair for you. "We decide who rules this city," he whispers. "Join us for 320 gold."'],
    asset: { id: 'ch6_conspiracy', label: 'Conspiracy Network Share', cost: 320, monthlyCashflow: 95, sector: 'espionage' },
    accept: {
      id: 'join_conspiracy',
      label: 'Take the empty chair (320g)',
      effects: [
        { kind: 'flag', id: 'conspirator', set: 1 },
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'You put on a mask. There is no turning back now.' },
      ],
    },
    decline: { id: 'refuse_conspiracy', label: 'Back out of the cellar', text: 'You climb the stairs. Behind you, masked faces watch you go.' },
  }),

  venture({
    id: 'ch6_blackmail_operation',
    weight: 3,
    title: 'Trading in Secrets',
    body: [
      'A smooth-talking rogue fans out a stack of stolen letters. "Everyone has secrets they\'ll pay to hide," he says. "Back me with 300 gold, and we share the takings."',
    ],
    asset: { id: 'ch6_blackmail', label: 'Secret Letters Ring', cost: 300, monthlyCashflow: 120, sector: 'espionage' },
    accept: {
      id: 'fund_blackmail',
      label: 'Back his scheme (300g)',
      effects: [
        { kind: 'stat', stat: 'charm', delta: -2 },
        { kind: 'flag', id: 'blackmailer', set: 1 },
        { kind: 'narrate', text: 'Frightened people pay to keep their secrets. The money is good. You feel worse every day.' },
        heat('police'),
      ],
    },
    decline: { id: 'refuse_blackmail', label: 'Refuse: keep your honour', text: 'Some gold just isn\'t worth it.' },
  }),
]

export const chapter6MarketCards: StoryCard[] = [
  {
    id: 'ch6_faction_war',
    weight: 5,
    title: 'The City Takes Sides',
    body: ['Banners of red and blue hang from rival windows. The great families are fighting for control of the city. Friends become enemies overnight. Everyone must pick a side.'],
    choices: [
      {
        id: 'back_winning_faction',
        label: 'Back the side that will win (+350g)',
        effects: [
          { kind: 'gold', delta: 350 },
          { kind: 'marketShift', sector: 'iron', delta: 30 },
          { kind: 'narrate', text: 'You picked the winners! They remember their friends.' },
        ],
      },
      {
        id: 'stay_neutral',
        label: 'Stay neutral (-200g)',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'Both sides squeeze you for "gifts". Staying neutral is expensive.' },
        ],
      },
    ],
  },

  {
    id: 'ch6_trust_collapses',
    weight: 4,
    title: 'Nobody Trusts Anybody',
    body: ['A huge cheat is uncovered at the Exchange. Suddenly nobody trusts anybody. Handshakes mean nothing, and every contract is torn up.'],
    choices: [
      {
        id: 'exploit_distrust',
        label: 'Profit from the panic (+300g)',
        effects: [
          { kind: 'gold', delta: 300 },
          { kind: 'marketShift', sector: 'spice', delta: -45 },
          { kind: 'flag', id: 'trust_exploiter', set: 1 },
          { kind: 'narrate', text: 'You make a fortune from broken promises. It is not pretty, but it pays.' },
        ],
      },
      {
        id: 'rebuild_trust',
        label: 'Help rebuild trust (-150g)',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'stat', stat: 'charm', delta: 2 },
          { kind: 'narrate', text: 'You pay for honest inspectors and fair weights. Expensive, but the market thanks you.' },
        ],
      },
    ],
  },

  {
    id: 'ch6_political_upheaval',
    weight: 3,
    once: true,
    title: 'A New Ruler Overnight',
    body: ['You wake to new flags on every tower. The old council has been thrown out in the night. The new rulers do not like friends of the old ones.'],
    choices: [
      {
        id: 'flee_country',
        label: 'Flee to safety (-400g)',
        effects: [
          { kind: 'gold', delta: -400 },
          { kind: 'flag', id: 'exile', set: 1 },
          { kind: 'narrate', text: 'You slip out of the city with a single bag. Everything else stays behind.' },
        ],
      },
      {
        id: 'adapt_new_regime',
        label: 'Win over the new rulers (Charm check, DC 14)',
        check: {
          stat: 'charm',
          dc: 14,
          success: { text: 'You bow low and say all the right things. The new rulers decide they like you.', effects: [{ kind: 'stat', stat: 'charm', delta: 2 }] },
          failure: { text: 'They remember who your friends were. It takes a lot of gold to change their minds.', effects: [{ kind: 'gold', delta: -500 }] },
        },
      },
    ],
  },
]

export const chapter6DangerCards: StoryCard[] = [
  {
    id: 'ch6_assassination_contract',
    weight: 5,
    once: true,
    title: 'A Price on Your Head',
    body: ['A friend rushes in, out of breath. "A rival has hired thugs to ruin you, tonight! They mean to smash everything you own." You have 1 night to get ready.'],
    choices: [
      {
        id: 'hire_protection',
        label: 'Hire guards (-400g)',
        requires: [{ kind: 'goldAtLeast', amount: 400 }],
        effects: [
          { kind: 'gold', delta: -400 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'Tough guards stand at every door all night. You sleep lightly, but you sleep.' },
        ],
      },
      {
        id: 'confront_assassin',
        label: 'Face the thugs yourself (Nerve check, DC 18)',
        check: {
          stat: 'nerve',
          dc: 18,
          success: { text: 'You meet them at the door with a lantern and a fierce stare. They lose their nerve and run.', effects: [{ kind: 'stat', stat: 'nerve', delta: 3 }] },
          failure: {
            text: 'The thugs knock you flat and wreck your shop. Doctors, repairs and a month in hiding cost a fortune.',
            effects: [{ kind: 'gold', delta: -300 }, { kind: 'stat', stat: 'nerve', delta: -1 }, { kind: 'advanceDays', days: 28 }],
          },
        },
      },
      favour('underworld', {
        id: 'buy_off_contract',
        label: 'Have your friends buy off the thugs (-100g)',
        effects: [{ kind: 'gold', delta: -100 }, { kind: 'narrate', text: 'A friend in the underworld finds the thugs first. For a small fee, the job is quietly cancelled.' }],
      }),
    ],
  },

  {
    id: 'ch6_trusted_friend_betrays',
    weight: 4,
    once: true,
    title: 'Your Best Friend, the Spy',
    body: ['You find a letter in your oldest friend\'s coat. It is addressed to your biggest rival, full of your secrets. Your friend has been spying on you all along.'],
    choices: [
      {
        id: 'forgive_friend',
        label: 'Forgive your friend',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 2 },
          { kind: 'gold', delta: -250 },
          { kind: 'narrate', text: 'It hurts terribly, but you forgive. Your friend cries and promises to make it right.' },
        ],
      },
      {
        id: 'destroy_friend',
        label: 'Shame your friend in public (Grit check, DC 14)',
        check: {
          stat: 'grit',
          dc: 14,
          success: { text: 'You show the letter to the whole market. Nobody will trust your friend again.', effects: [{ kind: 'stat', stat: 'grit', delta: 2 }, { kind: 'stat', stat: 'charm', delta: -3 }] },
          failure: { text: 'The crowd feels sorry for your friend instead. Somehow, you look like the villain.', effects: [{ kind: 'stat', stat: 'charm', delta: -3 }] },
        },
      },
    ],
  },

  {
    id: 'ch6_poison_conspiracy',
    weight: 3,
    once: true,
    title: 'The Sleeping Draught Plot',
    body: ['Your cook finds a strange green powder in your wine. A sleeping draught! Your rivals planned to knock you out and steal your ledgers. You must act fast.'],
    choices: [
      {
        id: 'counter_poison',
        label: 'Turn their trick on them (-300g)',
        requires: [{ kind: 'goldAtLeast', amount: 300 }],
        effects: [
          { kind: 'gold', delta: -300 },
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'narrate', text: 'You slip the draught into their own wine. They snore through their big meeting and lose a fortune.' },
        ],
      },
      {
        id: 'expose_conspiracy',
        label: 'Prove it to the Watch (Savvy check, DC 15)',
        check: {
          stat: 'savvy',
          dc: 15,
          success: { text: 'You gather the powder, the letters and the cook\'s story. The plotters are caught!', effects: [{ kind: 'stat', stat: 'savvy', delta: 2 }] },
          failure: {
            text: 'The Watch doesn\'t believe you. Then the draught gets you after all. You sleep for 3 days, and your ledgers are gone when you wake.',
            effects: [{ kind: 'gold', delta: -250 }, { kind: 'stat', stat: 'grit', delta: -1 }, { kind: 'advanceDays', days: 21 }],
          },
        },
      },
    ],
  },
]
