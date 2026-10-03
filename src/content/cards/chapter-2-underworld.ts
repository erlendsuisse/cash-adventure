import type { StoryCard } from '../../engine/types'

export const chapter2CommodityCards: StoryCard[] = [
  {
    id: 'ch2_spice_smuggling',
    chapter: 2,
    weight: 4,
    storyPhase: 'entangled',
    title: 'Underground Spice Network',
    body: ['A smuggler offers to cut you in on an underground spice distribution network. "We move high-margin spice through back channels. No taxes, no tariffs - just profit."'],
    choices: [
      {
        id: 'join_spice_smuggle',
        label: 'Join the smuggling ring (150g)',
        requires: [{ kind: 'goldAtLeast', amount: 150 }],
        effects: [
          { kind: 'gold', delta: -150 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch2_spice_ring', label: 'Spice Smuggling Ring', cost: 150, monthlyCashflow: 35, sector: 'spice' },
          },
          { kind: 'narrate', text: 'You enter the underground spice trade. The profits are excellent, but so are the risks.' },
        ],
      },
      { id: 'refuse_spice_ring', label: 'Too risky', effects: [{ kind: 'narrate', text: 'The smuggler vanishes into the shadows.' }] },
    ],
  },

  {
    id: 'ch2_salt_black_market',
    chapter: 2,
    weight: 3,
    storyPhase: 'entangled',
    title: 'Black Market Salt Supplier',
    body: ['A dealer in restricted goods offers partnership. "Salt is heavily controlled. We move it illegally at premium prices. Your network, my supply - we split the take."'],
    choices: [
      {
        id: 'partner_salt_black',
        label: 'Partner with black market (140g)',
        requires: [{ kind: 'goldAtLeast', amount: 140 }],
        effects: [
          { kind: 'gold', delta: -140 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch2_salt_black', label: 'Black Market Salt Operation', cost: 140, monthlyCashflow: 32, sector: 'salt' },
          },
          { kind: 'narrate', text: 'You move restricted salt. The authorities would pay to catch you.' },
        ],
      },
      { id: 'refuse_salt_black', label: 'Decline', effects: [{ kind: 'narrate', text: 'The dealer moves on.' }] },
    ],
  },

  {
    id: 'ch2_iron_theft_fence',
    chapter: 2,
    weight: 3,
    storyPhase: 'entangled',
    title: 'Stolen Iron Fence',
    body: ['A criminal offers to sell you stolen military-grade iron at 60% below market. "No questions asked. We just need a distributor."'],
    choices: [
      {
        id: 'fence_stolen_iron',
        label: 'Distribute stolen iron (130g)',
        requires: [{ kind: 'goldAtLeast', amount: 130 }],
        effects: [
          { kind: 'gold', delta: -130 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch2_iron_fence', label: 'Stolen Iron Distribution', cost: 130, monthlyCashflow: 40, sector: 'iron' },
          },
          { kind: 'narrate', text: 'You fence stolen iron. The military will want it back.' },
        ],
      },
      { id: 'refuse_iron_fence', label: 'Stay clean', effects: [{ kind: 'narrate', text: 'The fence shrugs and leaves.' }] },
    ],
  },
]

export const chapter2MarketCards: StoryCard[] = [
  {
    id: 'ch2_turf_war_spike',
    chapter: 2,
    weight: 5,
    storyPhase: 'entangled',
    title: 'Turf War Erupts',
    body: ['Two criminal syndicates clash over territory. Market prices spike as supply chains are disrupted. This could be an opportunity - or a disaster.'],
    choices: [
      {
        id: 'profit_turf_war',
        label: 'Sell high during the chaos (+200g)',
        requires: [{ kind: 'goldAtLeast', amount: 50 }],
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'marketShift', sector: 'spice', delta: 15 },
          { kind: 'marketShift', sector: 'salt', delta: 12 },
          { kind: 'narrate', text: 'You time the chaos perfectly, selling at peak prices.' },
        ],
      },
      {
        id: 'stay_neutral_turf',
        label: 'Stay out of it',
        effects: [
          { kind: 'marketShift', sector: 'iron', delta: -10 },
          { kind: 'narrate', text: 'The violence spreads. Markets decline.' },
        ],
      },
    ],
  },

  {
    id: 'ch2_protection_racket_squeeze',
    chapter: 2,
    weight: 4,
    storyPhase: 'entangled',
    title: 'Protection Money Squeeze',
    body: ['The syndicate that "protects" your operations demands a payment increase. "Business is good. Time to pay more."'],
    choices: [
      {
        id: 'pay_squeeze',
        label: 'Pay increased protection (-100g)',
        requires: [{ kind: 'goldAtLeast', amount: 100 }],
        effects: [
          { kind: 'gold', delta: -100 },
          { kind: 'narrate', text: 'You pay. The protection continues.' },
        ],
      },
      {
        id: 'refuse_squeeze',
        label: 'Refuse - find new allies',
        effects: [
          { kind: 'flag', id: 'syndicate_hostile', set: 1 },
          { kind: 'narrate', text: 'The syndicate smiles coldly. You\'ve made an enemy.' },
        ],
      },
    ],
  },

  {
    id: 'ch2_informant_tip',
    chapter: 2,
    weight: 3,
    storyPhase: 'entangled',
    title: 'A Timely Informant Tip',
    body: ['Your informant warns of incoming supply. "Shipment from the north. High quality, cheap. Get there first."'],
    choices: [
      {
        id: 'act_on_tip',
        label: 'Rush to buy stock (+150g)',
        requires: [{ kind: 'goldAtLeast', amount: 75 }],
        effects: [
          { kind: 'gold', delta: 150 },
          { kind: 'marketShift', sector: 'iron', delta: -8 },
          { kind: 'narrate', text: 'You arrive first and buy at bargain prices. Smart move.' },
        ],
      },
      {
        id: 'ignore_tip',
        label: 'Ignore it',
        effects: [{ kind: 'narrate', text: 'Someone else profits from the tip.' }],
      },
    ],
  },
]

export const chapter2DangerCards: StoryCard[] = [
  {
    id: 'ch2_rival_merchant',
    chapter: 2,
    weight: 4,
    storyPhase: 'entangled',
    title: 'A Rival Merchant Challenges You',
    body: ['A competing merchant corners you. "You\'re cutting into my territory. This ends now - pay me 80 gold protection or we settle this in the streets."'],
    choices: [
      {
        id: 'pay_rival',
        label: 'Pay the rival (-80g)',
        requires: [{ kind: 'goldAtLeast', amount: 80 }],
        effects: [
          { kind: 'gold', delta: -80 },
          { kind: 'narrate', text: 'You pay. Temporary peace.' },
        ],
      },
      {
        id: 'challenge_rival',
        label: 'Challenge them (Nerve check, DC 14)',
        check: {
          stat: 'nerve',
          dc: 14,
          success: { text: 'You intimidate them. They back down.', effects: [{ kind: 'stat', stat: 'nerve', delta: 1 }] },
          failure: { text: 'They beat you senseless.', effects: [{ kind: 'gold', delta: -150 }, { kind: 'stat', stat: 'grit', delta: -1 }] },
        },
      },
    ],
  },

  {
    id: 'ch2_police_shakedown',
    chapter: 2,
    weight: 3,
    storyPhase: 'entangled',
    title: 'Police Shakedown',
    body: ['Corrupt police stop you on the street. "We hear you\'re doing good business. Time for an informal tax."'],
    choices: [
      {
        id: 'pay_police',
        label: 'Pay the bribe (-90g)',
        requires: [{ kind: 'goldAtLeast', amount: 90 }],
        effects: [
          { kind: 'gold', delta: -90 },
          { kind: 'narrate', text: 'You bribe them. They leave satisfied.' },
        ],
      },
      {
        id: 'charm_police',
        label: 'Talk your way out (Charm check, DC 13)',
        check: {
          stat: 'charm',
          dc: 13,
          success: { text: 'You charm them. They let you go without payment.', effects: [{ kind: 'stat', stat: 'charm', delta: 1 }] },
          failure: { text: 'They get angry. You pay double: 180g.', effects: [{ kind: 'gold', delta: -180 }] },
        },
      },
    ],
  },

  {
    id: 'ch2_loan_collector',
    chapter: 2,
    weight: 3,
    storyPhase: 'entangled',
    title: 'Aggressive Loan Collector',
    body: ['A collector from the underworld appears. "Your debt has interest. Time to pay 120 gold or we take it from your assets."'],
    choices: [
      {
        id: 'pay_collector',
        label: 'Pay immediately (-120g)',
        requires: [{ kind: 'goldAtLeast', amount: 120 }],
        effects: [
          { kind: 'gold', delta: -120 },
          { kind: 'narrate', text: 'You pay. They leave, satisfied - for now.' },
        ],
      },
      {
        id: 'defy_collector',
        label: 'Defy them (Grit check, DC 15)',
        check: {
          stat: 'grit',
          dc: 15,
          success: { text: 'They respect your nerve. They negotiate terms.', effects: [{ kind: 'stat', stat: 'grit', delta: 1 }] },
          failure: { text: 'They break your legs. You\'re hospitalized.', effects: [{ kind: 'advanceDays', days: 10 }, { kind: 'stat', stat: 'grit', delta: -2 }] },
        },
      },
    ],
  },
]
