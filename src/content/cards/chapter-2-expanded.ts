import type { StoryCard } from '../../engine/types'
import { favour } from '../standings'
import { heat, venture } from './factories'

// CHAPTER 2 EXPANDED: Underworld Rising
// Organized ventures, street hustles, criminal networks, black market deals, gang politics, corruption

export const chapter2VentureCards: StoryCard[] = [
  venture({
    id: 'ch2_protection_racket_start',
    weight: 4,
    title: 'Start a Protection Racket',
    body: [
      'A local gang boss suggests you could make serious money protecting merchants from... accidents. "Most smart business owners pay for peace of mind."',
    ],
    asset: { id: 'ch2_protection_racket', label: 'Protection Racket', cost: 120, monthlyCashflow: 45, sector: 'underworld' },
    accept: {
      id: 'start_protection_racket',
      label: 'Start protection racket (120g investment)',
      effects: [{ kind: 'narrate', text: 'You become a protection provider. Fear is a commodity.' }, heat('mafia')],
    },
    decline: { id: 'refuse_racket', label: 'Too risky', text: 'The boss shrugs. "Your loss."' },
  }),
  venture({
    id: 'ch2_gambling_house_invest',
    weight: 3,
    title: 'Invest in an Underground Gambling Den',
    body: ['A casino operator wants capital to expand. "The house always wins. With your money behind me, we split the take."'],
    asset: { id: 'ch2_gambling_den', label: 'Underground Casino', cost: 160, monthlyCashflow: 55, sector: 'underworld' },
    accept: {
      id: 'fund_gambling',
      label: 'Fund the gambling den (160g)',
      effects: [{ kind: 'narrate', text: 'You own a piece of the house. Addiction is profitable.' }, heat('mafia')],
    },
    decline: { id: 'refuse_gambling', label: 'Decline', text: 'Another investor will take the deal.' },
  }),
  venture({
    id: 'ch2_counterfeiting_operation',
    weight: 3,
    title: 'Counterfeit Coin Operation',
    body: ['A forger needs safe houses for their operation. "Fake coins flood the market, values crash, we buy cheap, real coin returns, we sell high."'],
    asset: { id: 'ch2_counterfeiting', label: 'Counterfeiting Operation', cost: 140, monthlyCashflow: 60, sector: 'underworld' },
    accept: {
      id: 'run_counterfeiting',
      label: 'Provide safe houses (140g)',
      effects: [
        { kind: 'flag', id: 'counterfeiter', set: 1 },
        { kind: 'narrate', text: 'You run a counterfeiting operation. Authorities will hunt you if they learn the truth.' },
        heat('police'),
      ],
    },
    decline: { id: 'skip_counterfeiting', label: 'Too dangerous', text: 'The forger finds another partner.' },
  }),
  venture({
    id: 'ch2_brothel_investment',
    weight: 2,
    title: 'Sex Work Enterprise',
    body: ['An experienced madam seeks capital. "Sex never goes out of business. Invest with me, you\'ll never need to work again."'],
    asset: { id: 'ch2_brothel', label: 'Sex Work Enterprise', cost: 170, monthlyCashflow: 50, sector: 'underworld' },
    accept: {
      id: 'fund_brothel',
      label: 'Fund the enterprise (170g)',
      effects: [
        { kind: 'stat', stat: 'charm', delta: -1 },
        { kind: 'narrate', text: 'You profit from pleasure and desperation. The money is good. The mirror is hard to face.' },
      ],
    },
    decline: { id: 'refuse_brothel', label: 'Decline', text: 'The madam nods understandingly and leaves.' },
  }),
  venture({
    id: 'ch2_drug_house_landlord',
    weight: 3,
    title: 'Rent to Drug Dealers',
    body: ['Drug dealers need safe houses to cook and distribute. You could rent them space. "The money is excellent and we handle all the risk."'],
    asset: { id: 'ch2_drug_landlord', label: 'Drug House Landlord', cost: 110, monthlyCashflow: 42, sector: 'underworld' },
    accept: {
      id: 'rent_to_dealers',
      label: 'Rent them properties (110g)',
      effects: [
        { kind: 'flag', id: 'drug_landlord', set: 1 },
        { kind: 'narrate', text: 'Your properties become drug manufacturing centers. You profit from addiction.' },
        heat('mafia'),
      ],
    },
    decline: { id: 'refuse_dealers', label: 'Decline', text: 'They find other landlords.' },
  }),
  venture({
    id: 'ch2_fence_stolen_goods',
    weight: 4,
    title: 'Fence Stolen Goods',
    body: ['Professional thieves need someone to move their stolen goods. "We steal it, you sell it. Split the proceeds 60-40."'],
    asset: { id: 'ch2_fence', label: 'Stolen Goods Fence', cost: 95, monthlyCashflow: 38, sector: 'underworld' },
    accept: {
      id: 'become_fence',
      label: 'Become their fence (95g startup)',
      effects: [{ kind: 'narrate', text: 'You become a fence for stolen goods. Every item has a story of loss.' }, heat('police')],
    },
    decline: { id: 'refuse_fence', label: 'Decline', text: 'They find another fence.' },
  }),
  venture({
    id: 'ch2_racket_extortion',
    weight: 3,
    title: 'Extortion Scheme',
    body: ['A con artist offers partnership. "We get dirt on wealthy people, they pay to keep it quiet. Foolproof money."'],
    asset: { id: 'ch2_extortion', label: 'Extortion Scheme', cost: 105, monthlyCashflow: 48, sector: 'underworld' },
    accept: {
      id: 'run_extortion',
      label: 'Run extortion scheme (105g)',
      effects: [{ kind: 'flag', id: 'extortionist', set: 1 }, { kind: 'narrate', text: 'You profit from blackmail. One day, someone refuses to pay.' }, heat('mafia')],
    },
    decline: { id: 'refuse_extortion', label: 'Decline', text: 'The con artist disappears.' },
  }),
]

export const chapter2StoryCards: StoryCard[] = [
  {
    id: 'ch2_street_hustler_friend',
    weight: 3,
    once: true,
    title: 'An Old Friend from the Streets',
    body: ['Someone you used to know appears, street-worn and desperate. "I remember when you had nothing too. You\'ve made it big. Help me out?"'],
    choices: [
      {
        id: 'help_friend',
        label: 'Give them 80g',
        requires: [{ kind: 'goldAtLeast', amount: 80 }],
        effects: [
          { kind: 'gold', delta: -80 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'flag', id: 'street_friend_helped', set: 1 },
          { kind: 'narrate', text: 'Your old friend survives another week. They\'ll remember this.' },
        ],
      },
      {
        id: 'refuse_friend',
        label: 'Turn them away',
        effects: [
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'narrate', text: 'Your old friend looks hurt but not surprised. You\'ve forgotten where you came from.' },
        ],
      },
    ],
  },
  {
    id: 'ch2_gang_initiation_offer',
    weight: 3,
    once: true,
    title: 'Gang Initiation Offer',
    body: ['A gang leader approaches. "You\'re making serious money. Join us officially. Get protection, influence, and a cut of everything."'],
    choices: [
      {
        id: 'join_gang',
        label: 'Join the gang',
        effects: [
          { kind: 'flag', id: 'gang_member', set: 1 },
          { kind: 'stat', stat: 'nerve', delta: 2 },
          { kind: 'narrate', text: 'You are now made. You belong to something bigger and darker than yourself.' },
          heat('mafia'),
        ],
      },
      {
        id: 'stay_independent',
        label: 'Remain independent',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'You maintain your independence. But now they see you as competition.' },
        ],
      },
    ],
  },
  {
    id: 'ch2_informant_recruitment',
    weight: 2,
    once: true,
    title: 'Recruit an Informant',
    body: ['A desperate guard offers to sell you information about shipments, schedules, and opportunities. "I need 50g just to stay alive."'],
    choices: [
      {
        id: 'hire_informant',
        label: 'Hire them (50g)',
        requires: [{ kind: 'goldAtLeast', amount: 50 }],
        effects: [
          { kind: 'gold', delta: -50 },
          { kind: 'flag', id: 'has_informant', set: 1 },
          { kind: 'narrate', text: 'You have an inside source. Knowledge is power in the underworld.' },
        ],
      },
      { id: 'refuse_informant', label: 'Decline', effects: [{ kind: 'narrate', text: 'They approach someone else.' }] },
    ],
  },
  {
    id: 'ch2_rival_merchant_cooperation',
    weight: 2,
    once: true,
    title: 'Propose Cooperation to Rival',
    body: ['Your old rival merchant approaches with a proposition. "We\'re destroying each other. Partners instead of enemies?"'],
    choices: [
      {
        id: 'partner_rival',
        label: 'Form partnership',
        effects: [
          { kind: 'flag', id: 'rival_partner', set: 1 },
          { kind: 'stat', stat: 'savvy', delta: 1 },
          { kind: 'narrate', text: 'Your enemy becomes your ally. The underworld respects pragmatism.' },
        ],
      },
      {
        id: 'crush_rival',
        label: 'Crush them instead',
        effects: [
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'narrate', text: 'You destroy them. Victory feels hollow.' },
        ],
      },
    ],
  },
]

export const chapter2MoreMarketCards: StoryCard[] = [
  {
    id: 'ch2_police_crackdown',
    weight: 4,
    once: true,
    title: 'Police Crackdown on Crime',
    body: ['New police commissioner cracks down hard on the underworld. Street-level operations collapse. Prices spike from scarcity.'],
    choices: [
      {
        id: 'lay_low',
        label: 'Lay low during crackdown (+100g eventually)',
        effects: [
          { kind: 'gold', delta: 100 },
          { kind: 'advanceDays', days: 15 },
          { kind: 'narrate', text: 'You survive by staying hidden. Smaller operations emerge to fill the gap.' },
        ],
      },
      {
        id: 'bribe_police',
        label: 'Bribe the police (-250g)',
        requires: [{ kind: 'goldAtLeast', amount: 250 }],
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'flag', id: 'police_corrupt', set: 1 },
          { kind: 'narrate', text: 'The police look the other way. Corruption is your security.' },
          heat('police'),
        ],
      },
    ],
  },
  {
    id: 'ch2_supply_drought',
    weight: 3,
    once: true,
    title: 'Supply Route Drought',
    body: ['Border patrol tightens. Smugglers can\'t get goods through. Prices spike for smuggled items, crash for legitimate goods.'],
    choices: [
      {
        id: 'invest_smuggling',
        label: 'Invest in new smuggling routes (+200g)',
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'flag', id: 'smuggler_investor', set: 1 },
          { kind: 'narrate', text: 'You find the new routes. Profit flows from desperation.' },
        ],
      },
      {
        id: 'wait_out_drought',
        label: 'Wait for routes to normalize',
        effects: [{ kind: 'narrate', text: 'Routes reopen. Someone else already controls them.' }],
      },
    ],
  },
  {
    id: 'ch2_gang_war_opportunity',
    weight: 3,
    once: true,
    title: 'Gang War Creates Opportunity',
    body: ['2 major gangs war over territory. Neutral zone opens up for independent operators. Danger, but profit.'],
    choices: [
      {
        id: 'claim_neutral_zone',
        label: 'Set up in neutral zone (+150g)',
        effects: [
          { kind: 'gold', delta: 150 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'You operate in the chaos. One misstep means death.' },
          heat('mafia'),
        ],
      },
      {
        id: 'stay_away',
        label: 'Stay away from the war',
        effects: [{ kind: 'narrate', text: 'Safe, but you miss the profit opportunity.' }],
      },
    ],
  },
]

export const chapter2MoreDangerCards: StoryCard[] = [
  {
    id: 'ch2_gang_enforcer_visit',
    weight: 4,
    once: true,
    title: 'Gang Enforcer Demands Payment',
    body: ['A gang enforcer arrives at your door. "We\'ve been protecting your operations. Time to pay what\'s owed. 200g."'],
    choices: [
      {
        id: 'pay_gang',
        label: 'Pay protection money (-200g)',
        requires: [{ kind: 'goldAtLeast', amount: 200 }],
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'You pay. The gang ensures your safety—for now.' },
        ],
      },
      {
        id: 'refuse_gang_extortion',
        label: 'Refuse (Nerve check, DC 15)',
        check: {
          stat: 'nerve',
          dc: 15,
          success: { text: 'They respect your spine. No payment needed.', effects: [{ kind: 'stat', stat: 'nerve', delta: 2 }] },
          failure: { text: 'They beat you senseless and take 300g anyway.', effects: [{ kind: 'gold', delta: -300 }, { kind: 'stat', stat: 'grit', delta: -1 }] },
        },
      },
      favour('underworld', {
        id: 'drop_a_name',
        label: 'Drop a name the gang respects',
        effects: [{ kind: 'narrate', text: 'The enforcer hears who you drink with and leaves without another word.' }],
      }),
    ],
  },
  {
    id: 'ch2_betrayal_by_partner',
    weight: 3,
    once: true,
    title: 'Partner Betrays You',
    body: ['Your business partner disappears with all the profits. You\'ve been robbed for 180g.'],
    choices: [
      {
        id: 'hunt_partner',
        label: 'Hunt them down (Nerve check, DC 14)',
        check: {
          stat: 'nerve',
          dc: 14,
          success: { text: 'You find them and recover the money.', effects: [{ kind: 'gold', delta: 180 }, { kind: 'stat', stat: 'nerve', delta: 1 }] },
          failure: { text: 'They\'ve fled the city. The money is gone.', effects: [{ kind: 'stat', stat: 'charm', delta: -1 }] },
        },
      },
      {
        id: 'accept_loss',
        label: 'Accept the loss',
        effects: [
          { kind: 'gold', delta: -180 },
          { kind: 'narrate', text: 'You accept the lesson. Trust is currency in the underworld.' },
        ],
      },
    ],
  },
  {
    id: 'ch2_witness_to_murder',
    weight: 2,
    once: true,
    title: 'You Witness a Murder',
    body: ['You see someone important killed by gang rivals. They notice you watching. "You didn\'t see anything, right?"'],
    choices: [
      {
        id: 'stay_silent',
        label: 'Keep silent',
        effects: [
          { kind: 'flag', id: 'silent_witness', set: 1 },
          { kind: 'narrate', text: 'You say nothing. The secret is safe, but you carry the guilt.' },
        ],
      },
      {
        id: 'go_to_police',
        label: 'Go to police (Grit check, DC 16)',
        check: {
          stat: 'grit',
          dc: 16,
          success: { text: 'You testify. The killer is arrested. You\'re marked as a rat.', effects: [{ kind: 'stat', stat: 'grit', delta: 2 }, { kind: 'flag', id: 'police_informant', set: 1 }] },
          failure: { text: 'The killer finds out. You escape with your life, barely.', effects: [{ kind: 'stat', stat: 'grit', delta: -1 }] },
        },
      },
    ],
  },
  {
    id: 'ch2_kidnapping_threat',
    weight: 2,
    once: true,
    title: 'Kidnapping Threat Against You',
    body: ['A rival gang threatens to kidnap you. "Pay 220g or you disappear."'],
    choices: [
      {
        id: 'pay_ransom',
        label: 'Pay the ransom (-220g)',
        requires: [{ kind: 'goldAtLeast', amount: 220 }],
        effects: [
          { kind: 'gold', delta: -220 },
          { kind: 'narrate', text: 'You pay. For now, you\'re safe. But you\'ve shown weakness.' },
        ],
      },
      {
        id: 'hire_protection',
        label: 'Hire bodyguards (-150g)',
        requires: [{ kind: 'goldAtLeast', amount: 150 }],
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'Armed guards now follow you. You live, but in constant vigilance.' },
        ],
      },
      {
        id: 'go_into_hiding',
        label: 'Go into hiding',
        effects: [
          { kind: 'advanceDays', days: 7 },
          { kind: 'stat', stat: 'nerve', delta: -1 },
          { kind: 'narrate', text: 'You vanish for a week, sleeping in cellars. The gang loses interest, but you lose your nerve.' },
        ],
      },
    ],
  },
]

export const chapter2RecoveryCards: StoryCard[] = [
  {
    id: 'ch2_safe_house_refuge',
    weight: 2,
    once: true,
    title: 'Find Refuge in a Safe House',
    body: ['When the heat is on, a trusted associate offers you shelter in their safe house. No questions asked.'],
    choices: [
      {
        id: 'hide_safety',
        label: 'Hide and recover',
        effects: [
          { kind: 'advanceDays', days: 10 },
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'narrate', text: 'You recover your nerves in safety. The outside world forgets about you.' },
        ],
      },
    ],
  },
]
