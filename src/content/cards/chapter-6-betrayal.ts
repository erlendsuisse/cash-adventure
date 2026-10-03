import type { StoryCard } from '../../engine/types'
import { heat, venture } from './factories'

export const chapter6CommodityCards: StoryCard[] = [
  venture({
    id: 'ch6_intelligence_trade',
    weight: 5,
    title: 'Intelligence Trading Network',
    body: ['A spymaster offers to sell you intelligence on your rivals. "Know their secrets before they move. 350 gold gets you complete access."'],
    asset: { id: 'ch6_intel', label: 'Intelligence Trading Network', cost: 350, monthlyCashflow: 110, sector: 'espionage' },
    accept: {
      id: 'buy_intelligence',
      label: 'Buy intelligence network (350g)',
      effects: [{ kind: 'narrate', text: 'You buy secrets. Knowledge is power, but enemies are everywhere.' }],
    },
    decline: { id: 'refuse_intelligence', label: 'Refuse (too dangerous)', text: 'Ignorance might be safer.' },
  }),

  venture({
    id: 'ch6_conspiracy_network',
    weight: 4,
    title: 'Conspiracy Network Partnership',
    body: ['Conspirators offer you a seat at their table. "We topple governments and make fortunes. Join us for 320 gold and you share the spoils."'],
    asset: { id: 'ch6_conspiracy', label: 'Conspiracy Network Share', cost: 320, monthlyCashflow: 95, sector: 'espionage' },
    accept: {
      id: 'join_conspiracy',
      label: 'Join the conspiracy (320g)',
      effects: [
        { kind: 'flag', id: 'conspirator', set: 1 },
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'You join the conspiracy. No turning back now.' },
      ],
    },
    decline: { id: 'refuse_conspiracy', label: 'Refuse (too risky)', text: 'You walk away. They watch you leave.' },
  }),

  venture({
    id: 'ch6_blackmail_operation',
    weight: 3,
    title: 'Blackmail Operation',
    body: [
      'A criminal offers to run blackmail operations with you as financial partner. "Secrets are currency. We collect them, we profit. 300 gold partnership."',
    ],
    asset: { id: 'ch6_blackmail', label: 'Blackmail Operation', cost: 300, monthlyCashflow: 120, sector: 'espionage' },
    accept: {
      id: 'fund_blackmail',
      label: 'Fund the blackmail ring (300g)',
      effects: [
        { kind: 'stat', stat: 'charm', delta: -2 },
        { kind: 'flag', id: 'blackmailer', set: 1 },
        { kind: 'narrate', text: 'You profit from secrets and shame. The money is excellent. Your soul is forfeit.' },
        heat('police'),
      ],
    },
    decline: { id: 'refuse_blackmail', label: 'Refuse (retain honor)', text: 'Some profit is not worth the price.' },
  }),
]

export const chapter6MarketCards: StoryCard[] = [
  {
    id: 'ch6_faction_war',
    weight: 5,
    title: 'Faction War Erupts',
    body: ['Political factions war openly for control. Alliances crumble. Former allies become enemies. The market is in chaos.'],
    choices: [
      {
        id: 'back_winning_faction',
        label: 'Back the winning faction (+350g)',
        effects: [
          { kind: 'gold', delta: 350 },
          { kind: 'marketShift', sector: 'iron', delta: 30 },
          { kind: 'narrate', text: 'You pick the right side. Politics rewards the ruthless.' },
        ],
      },
      {
        id: 'stay_neutral',
        label: 'Stay neutral (-200g)',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'Neutrality is expensive in wartime.' },
        ],
      },
    ],
  },

  {
    id: 'ch6_trust_collapses',
    weight: 4,
    title: 'Market Trust Collapses',
    body: ['Evidence of widespread fraud rocks the market. No one knows who to trust. Contracts mean nothing.'],
    choices: [
      {
        id: 'exploit_distrust',
        label: 'Exploit the distrust (+300g)',
        effects: [
          { kind: 'gold', delta: 300 },
          { kind: 'marketShift', sector: 'spice', delta: -45 },
          { kind: 'flag', id: 'trust_exploiter', set: 1 },
          { kind: 'narrate', text: 'You profit from chaos and broken promises.' },
        ],
      },
      {
        id: 'rebuild_trust',
        label: 'Work to rebuild trust (-150g)',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'stat', stat: 'charm', delta: 2 },
          { kind: 'narrate', text: 'You invest in rebuilding trust. It\'s expensive but noble.' },
        ],
      },
    ],
  },

  {
    id: 'ch6_political_upheaval',
    weight: 3,
    once: true,
    title: 'Government Overthrown',
    body: ['The government falls in a coup. A new regime takes power. Old alliances become death sentences.'],
    choices: [
      {
        id: 'flee_country',
        label: 'Flee to safety (-400g cost)',
        effects: [
          { kind: 'gold', delta: -400 },
          { kind: 'flag', id: 'exile', set: 1 },
          { kind: 'narrate', text: 'You flee the country with your life. Everything else is left behind.' },
        ],
      },
      {
        id: 'adapt_new_regime',
        label: 'Adapt to the new regime (Charm check, DC 14)',
        check: {
          stat: 'charm',
          dc: 14,
          success: { text: 'You charm the new rulers. Your position is secure.', effects: [{ kind: 'stat', stat: 'charm', delta: 2 }] },
          failure: { text: 'They suspect your old loyalties. You pay heavy bribes.', effects: [{ kind: 'gold', delta: -500 }] },
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
    title: 'Assassination Contract on You',
    body: ['You learn someone has hired assassins to kill you. You have one night to prepare.'],
    choices: [
      {
        id: 'hire_protection',
        label: 'Hire protection detail (-400g)',
        requires: [{ kind: 'goldAtLeast', amount: 400 }],
        effects: [
          { kind: 'gold', delta: -400 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'Hired assassins guard you. You sleep lightly.' },
        ],
      },
      {
        id: 'confront_assassin',
        label: 'Confront the assassin (Nerve check, DC 18)',
        check: {
          stat: 'nerve',
          dc: 18,
          success: { text: 'You intimidate them. They abandon the contract.', effects: [{ kind: 'stat', stat: 'nerve', delta: 3 }] },
          failure: {
            text: 'The blade finds you. You survive - barely - and spend a fortune on physicians and a month in hiding.',
            effects: [{ kind: 'gold', delta: -300 }, { kind: 'stat', stat: 'nerve', delta: -1 }, { kind: 'advanceDays', days: 28 }],
          },
        },
      },
    ],
  },

  {
    id: 'ch6_trusted_friend_betrays',
    weight: 4,
    once: true,
    title: 'Closest Friend Betrays You',
    body: ['Your oldest, most trusted friend reveals they\'ve been spying on you the whole time. They sell your secrets to your rivals.'],
    choices: [
      {
        id: 'forgive_friend',
        label: 'Forgive them',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 2 },
          { kind: 'gold', delta: -250 },
          { kind: 'narrate', text: 'You forgive. The betrayal cuts deep, but humanity survives.' },
        ],
      },
      {
        id: 'destroy_friend',
        label: 'Destroy them publicly (Grit check, DC 14)',
        check: {
          stat: 'grit',
          dc: 14,
          success: { text: 'You ruin them. A lesson in loyalty.', effects: [{ kind: 'stat', stat: 'grit', delta: 2 }, { kind: 'stat', stat: 'charm', delta: -3 }] },
          failure: { text: 'The public sympathizes with them. You look like the villain.', effects: [{ kind: 'stat', stat: 'charm', delta: -3 }] },
        },
      },
    ],
  },

  {
    id: 'ch6_poison_conspiracy',
    weight: 3,
    once: true,
    title: 'Poisoning Conspiracy Discovered',
    body: ['You discover a poisoning conspiracy against you. Multiple conspirators. You must act.'],
    choices: [
      {
        id: 'counter_poison',
        label: 'Counter-poison them (-300g)',
        requires: [{ kind: 'goldAtLeast', amount: 300 }],
        effects: [
          { kind: 'gold', delta: -300 },
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'narrate', text: 'You poison the conspirators. An eye for an eye.' },
        ],
      },
      {
        id: 'expose_conspiracy',
        label: 'Expose them to authorities (Savvy check, DC 15)',
        check: {
          stat: 'savvy',
          dc: 15,
          success: { text: 'You gather evidence and expose them. Justice is served.', effects: [{ kind: 'stat', stat: 'savvy', delta: 2 }] },
          failure: {
            text: 'The authorities don\'t believe you, and the poison reaches your cup. You live, but the antidote costs dearly and you are weeks recovering.',
            effects: [{ kind: 'gold', delta: -250 }, { kind: 'stat', stat: 'grit', delta: -1 }, { kind: 'advanceDays', days: 21 }],
          },
        },
      },
    ],
  },
]
