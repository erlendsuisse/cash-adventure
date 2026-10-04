import type { StoryCard } from '../../engine/types'
import { favour } from '../standings'
import { heat, venture } from './factories'

export const chapter2CommodityCards: StoryCard[] = [
  venture({
    id: 'ch2_spice_smuggling',
    weight: 4,
    title: 'The Secret Spice Tunnels',
    body: [
      'A smuggler lifts a trapdoor in a tavern floor. Below, a tunnel smells of pepper and cinnamon. "We move spice under the city," she whispers. "No taxes. Want in?"',
    ],
    asset: { id: 'ch2_spice_ring', label: 'Spice Smuggling Ring', cost: 150, monthlyCashflow: 35, sector: 'spice' },
    accept: {
      id: 'join_spice_smuggle',
      label: 'Climb down into the tunnels (150g)',
      effects: [{ kind: 'narrate', text: 'Sacks of spice travel the tunnels for you now. The profits are sweet. The risks are not.' }, heat('police')],
    },
    decline: { id: 'refuse_spice_ring', label: 'Close the trapdoor', text: 'She shrugs and drops down into the dark alone.' },
  }),

  venture({
    id: 'ch2_salt_black_market',
    weight: 3,
    title: 'Salt from the Back Door',
    body: [
      'A man knocks on your back door at midnight. He opens a sack: snowy white salt, with no tax stamp. "The crown taxes every grain," he says. "We don\'t. Sell it for me, and we split the take."',
    ],
    asset: { id: 'ch2_salt_black', label: 'Black Market Salt Operation', cost: 140, monthlyCashflow: 32, sector: 'salt' },
    accept: {
      id: 'partner_salt_black',
      label: 'Sell his secret salt (140g)',
      effects: [{ kind: 'narrate', text: 'Untaxed salt slips out your back door every night. The crown would love to catch you.' }, heat('police')],
    },
    decline: { id: 'refuse_salt_black', label: 'Shut the door', text: 'He shoulders his sack and knocks on the next door down.' },
  }),

  venture({
    id: 'ch2_iron_theft_fence',
    weight: 3,
    title: 'Iron with an Army Stamp',
    body: ['A nervous man pulls back a tarp. The iron bars underneath carry the army\'s stamp. "Cheap," he says quickly. "Very cheap. Just don\'t ask where they came from."'],
    asset: { id: 'ch2_iron_fence', label: 'Stolen Iron Distribution', cost: 130, monthlyCashflow: 40, sector: 'iron' },
    accept: {
      id: 'fence_stolen_iron',
      label: 'Sell the stolen iron (130g)',
      effects: [{ kind: 'narrate', text: 'The iron sells fast. Somewhere, an army quartermaster is very, very cross.' }, heat('police')],
    },
    decline: { id: 'refuse_iron_fence', label: 'Keep your hands clean', text: 'He throws the tarp back over the iron and hurries off.' },
  }),
]

export const chapter2MarketCards: StoryCard[] = [
  {
    id: 'ch2_turf_war_spike',
    weight: 5,
    title: 'The Gangs Go to War',
    body: ['Shutters slam all over the harbour. 2 gangs are fighting over the docks, and no cargo is getting through. Prices shoot up. Clever traders could profit. Careless ones could lose everything.'],
    choices: [
      {
        id: 'profit_turf_war',
        label: 'Sell while prices are high (+200g)',
        requires: [{ kind: 'goldAtLeast', amount: 50 }],
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'marketShift', sector: 'spice', delta: 15 },
          { kind: 'marketShift', sector: 'salt', delta: 12 },
          { kind: 'narrate', text: 'You sell at just the right moment, when prices peak.' },
        ],
      },
      {
        id: 'stay_neutral_turf',
        label: 'Stay out of it',
        effects: [
          { kind: 'marketShift', sector: 'iron', delta: -10 },
          { kind: 'narrate', text: 'The fighting spreads, and the whole market slumps.' },
        ],
      },
    ],
  },

  {
    id: 'ch2_protection_racket_squeeze',
    weight: 4,
    once: true,
    title: 'The Price Goes Up',
    body: ['Your "protectors" from the syndicate are back, picking their teeth. "Business looks good," says one. "So we want more. 100 gold more."'],
    choices: [
      {
        id: 'pay_squeeze',
        label: 'Pay up (-100g)',
        requires: [{ kind: 'goldAtLeast', amount: 100 }],
        effects: [
          { kind: 'gold', delta: -100 },
          { kind: 'narrate', text: 'You pay. They tip their hats and swagger off.' },
        ],
      },
      {
        id: 'refuse_squeeze',
        label: 'Refuse, and find new friends',
        effects: [
          { kind: 'flag', id: 'syndicate_hostile', set: 1 },
          { kind: 'narrate', text: 'They stop smiling. You have made an enemy today.' },
        ],
      },
    ],
  },

  {
    id: 'ch2_informant_tip',
    weight: 3,
    title: 'A Whisper in the Dark',
    body: ['A note slides under your door: "Ship from the north. Good goods, cheap. Pier 4 at dawn. Be first." It is from your informant.'],
    choices: [
      {
        id: 'act_on_tip',
        label: 'Race to Pier 4 (+150g)',
        requires: [{ kind: 'goldAtLeast', amount: 75 }],
        effects: [
          { kind: 'gold', delta: 150 },
          { kind: 'marketShift', sector: 'iron', delta: -8 },
          { kind: 'narrate', text: 'You reach the pier first and buy everything cheap. Sweet!' },
        ],
      },
      {
        id: 'ignore_tip',
        label: 'Stay in bed',
        effects: [{ kind: 'narrate', text: 'By breakfast, someone else has bought the lot.' }],
      },
    ],
  },
]

export const chapter2DangerCards: StoryCard[] = [
  {
    id: 'ch2_rival_merchant',
    weight: 4,
    once: true,
    title: 'Nose to Nose',
    body: ['A rival in a huge feathered hat jabs a finger at your chest. "This street is mine! Pay me 80 gold, or we settle it right here, in front of everyone."'],
    choices: [
      {
        id: 'pay_rival',
        label: 'Pay him off (-80g)',
        requires: [{ kind: 'goldAtLeast', amount: 80 }],
        effects: [
          { kind: 'gold', delta: -80 },
          { kind: 'narrate', text: 'You pay. He struts off, feathers bobbing. Peace, for now.' },
        ],
      },
      {
        id: 'challenge_rival',
        label: 'Stand your ground (Nerve check, DC 14)',
        check: {
          stat: 'nerve',
          dc: 14,
          success: { text: 'You stare him down. His feathers droop, and he backs away. The crowd cheers!', effects: [{ kind: 'stat', stat: 'nerve', delta: 1 }] },
          failure: { text: 'He shoves you into a fishmonger\'s barrel. The crowd roars with laughter.', effects: [{ kind: 'gold', delta: -150 }, { kind: 'stat', stat: 'grit', delta: -1 }] },
        },
      },
    ],
  },

  {
    id: 'ch2_police_shakedown',
    weight: 3,
    once: true,
    title: 'The Watch Wants a Tip',
    body: ['Two crooked guards of the Watch block your way, twirling their clubs. "Business is good, we hear," says one. "Time for a little tip."'],
    choices: [
      {
        id: 'pay_police',
        label: 'Pay the bribe (-90g)',
        requires: [{ kind: 'goldAtLeast', amount: 90 }],
        effects: [
          { kind: 'gold', delta: -90 },
          { kind: 'narrate', text: 'You pay. They stroll off, whistling.' },
        ],
      },
      {
        id: 'charm_police',
        label: 'Talk your way out (Charm check, DC 13)',
        check: {
          stat: 'charm',
          dc: 13,
          success: { text: 'You tell such a funny story that they forget all about the money.', effects: [{ kind: 'stat', stat: 'charm', delta: 1 }] },
          failure: { text: 'Your joke falls flat. Now they want double: 180 gold.', effects: [{ kind: 'gold', delta: -180 }] },
        },
      },
      favour('crown', {
        id: 'name_friends_at_court',
        label: 'Mention your friends at court',
        effects: [{ kind: 'narrate', text: 'The guard hears whose name you drop. He turns pale and wishes you a lovely evening.' }],
      }),
    ],
  },

  {
    id: 'ch2_loan_collector',
    weight: 3,
    once: true,
    title: 'The Debt Collector',
    body: ['A tall, thin man in black fills your doorway. He opens a huge ledger. "Your debt has grown, I\'m afraid. 120 gold, today. Or we take it from your things."'],
    choices: [
      {
        id: 'pay_collector',
        label: 'Pay him now (-120g)',
        requires: [{ kind: 'goldAtLeast', amount: 120 }],
        effects: [
          { kind: 'gold', delta: -120 },
          { kind: 'narrate', text: 'You pay. He snaps the ledger shut and glides away. For now.' },
        ],
      },
      {
        id: 'defy_collector',
        label: 'Refuse to be bullied (Grit check, DC 15)',
        check: {
          stat: 'grit',
          dc: 15,
          success: { text: 'He raises an eyebrow. "Brave. Very well, let us talk terms."', effects: [{ kind: 'stat', stat: 'grit', delta: 1 }] },
          failure: { text: 'His men toss you into the street and empty your shop. It takes days to recover.', effects: [{ kind: 'advanceDays', days: 10 }, { kind: 'stat', stat: 'grit', delta: -2 }] },
        },
      },
    ],
  },
]
