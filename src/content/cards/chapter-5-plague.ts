import type { StoryCard } from '../../engine/types'
import { favour } from '../standings'
import { heat, venture } from './factories'

export const chapter5CommodityCards: StoryCard[] = [
  venture({
    id: 'ch5_plague_medicine',
    weight: 5,
    title: 'The Only Medicine in Town',
    body: ['A fever is spreading through the city. An alchemist holds up a glowing blue bottle. "This helps," she says. "Sell it for me, and nobody else can. Name any price you like."'],
    asset: { id: 'ch5_medicine', label: 'Plague Medicine Distribution', cost: 320, monthlyCashflow: 100, sector: 'plague' },
    accept: {
      id: 'distribute_medicine',
      label: 'Control the medicine (320g)',
      effects: [
        { kind: 'stat', stat: 'charm', delta: -1 },
        { kind: 'narrate', text: 'The medicine works, and people pay whatever you ask. You earn a lot, but it doesn\'t feel good.' },
      ],
    },
    decline: { id: 'refuse_medicine', label: 'Refuse: it\'s not right', text: 'You cannot get rich from sick people. Some things matter more than gold.' },
  }),

  venture({
    id: 'ch5_infection_prevention',
    weight: 4,
    title: 'Keeping the Fever Away',
    body: ['A team of healers in beaked masks knocks on your door. "We scrub, we air, we burn sweet herbs," says their leader. "For 280 gold, the fever stays out of your buildings."'],
    asset: { id: 'ch5_prevention', label: 'Infection Prevention Network', cost: 280, monthlyCashflow: 50, sector: 'health' },
    accept: {
      id: 'join_prevention',
      label: 'Hire the healers (280g)',
      effects: [{ kind: 'narrate', text: 'Your buildings smell of lavender and soap. The fever stays outside.' }],
    },
    decline: { id: 'decline_prevention', label: 'Not today', text: 'You take your chances like everyone else.' },
  }),

  venture({
    id: 'ch5_grave_robbing_artifacts',
    weight: 3,
    title: 'Treasure from Empty Houses',
    body: ['Many families have fled the fever, leaving their houses locked and empty. Two looters grin at you. "Full of treasure, those houses. Pay us 250 gold, and we split what we find."'],
    asset: { id: 'ch5_grave_robbing', label: 'Empty-House Looting', cost: 250, monthlyCashflow: 70, sector: 'plague' },
    accept: {
      id: 'fund_grave_robbing',
      label: 'Pay the looters (250g)',
      effects: [
        { kind: 'stat', stat: 'grit', delta: -1 },
        { kind: 'flag', id: 'desecrator', set: 1 },
        { kind: 'narrate', text: 'Silver and paintings flow in from the empty houses. The families will come home to nothing.' },
        heat('police'),
      ],
    },
    decline: { id: 'refuse_graves', label: 'Refuse: those homes aren\'t yours', text: 'Some lines you will not cross.' },
  }),
]

export const chapter5MarketCards: StoryCard[] = [
  {
    id: 'ch5_plague_spreads',
    weight: 5,
    title: 'The Fever Spreads',
    body: ['The fever spreads faster every day. Shops close. Streets fall quiet. Nobody wants silk or spice now, only bread, medicine and clean water.'],
    choices: [
      {
        id: 'hoard_supplies',
        label: 'Stock up and wait (+250g)',
        effects: [
          { kind: 'gold', delta: 250 },
          { kind: 'marketShift', sector: 'spice', delta: 35 },
          { kind: 'narrate', text: 'You fill your cellars and wait. Soon, your supplies are worth a fortune.' },
        ],
      },
      {
        id: 'flee_city',
        label: 'Escape to the countryside',
        effects: [
          { kind: 'advanceDays', days: 30 },
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'You escape to a quiet farm in the hills. The city struggles on without you.' },
        ],
      },
    ],
  },

  {
    id: 'ch5_quarantine_economy',
    weight: 4,
    once: true,
    title: 'The Closed Districts',
    body: ['Ropes and guards now close off whole districts. Nobody may carry goods between them. But people on the other side still need food and medicine.'],
    choices: [
      {
        id: 'become_smuggler',
        label: 'Sneak supplies across (+300g)',
        effects: [
          { kind: 'gold', delta: 300 },
          { kind: 'flag', id: 'plague_smuggler', set: 1 },
          { kind: 'narrate', text: 'You sneak food and medicine across the ropes at night. It helps people, and it is very risky.' },
          heat('police'),
        ],
      },
      {
        id: 'respect_quarantine',
        label: 'Follow the rules',
        effects: [
          { kind: 'gold', delta: -100 },
          { kind: 'narrate', text: 'You follow the rules. Trade grinds to a halt.' },
        ],
      },
    ],
  },

  {
    id: 'ch5_mass_death_discount',
    weight: 3,
    title: 'Houses for Sale, Everywhere',
    body: ['So many families have left for the countryside that houses stand empty all over town. Land, homes and shops are cheaper than anyone can remember.'],
    choices: [
      {
        id: 'buy_dead_estates',
        label: 'Buy the empty houses cheap (+400g)',
        effects: [
          { kind: 'gold', delta: 400 },
          { kind: 'marketShift', sector: 'salt', delta: -50 },
          { kind: 'narrate', text: 'You buy whole streets for a song. When the families return, they will have to rent from you.' },
        ],
      },
      {
        id: 'ignore_discount',
        label: 'Leave the houses be',
        effects: [{ kind: 'narrate', text: 'Other buyers swoop in instead.' }],
      },
    ],
  },
]

export const chapter5DangerCards: StoryCard[] = [
  {
    id: 'ch5_infection_risk',
    weight: 5,
    once: true,
    title: 'You Catch the Fever',
    body: ['You wake up shivering and burning hot. Your legs feel like jelly. It\'s the fever. Without help, this could get very bad.'],
    choices: [
      {
        id: 'buy_cure',
        label: 'Pay for the best healer (-400g)',
        requires: [{ kind: 'goldAtLeast', amount: 400 }],
        effects: [
          { kind: 'gold', delta: -400 },
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'narrate', text: 'The healer\'s bitter potion works. You are weak, but you are going to be fine.' },
        ],
      },
      {
        id: 'fight_infection',
        label: 'Fight it off yourself (Grit check, DC 17)',
        check: {
          stat: 'grit',
          dc: 17,
          success: { text: 'You sweat and shiver for 3 days. Then the fever breaks. You did it!', effects: [{ kind: 'stat', stat: 'grit', delta: 3 }] },
          failure: {
            text: 'You are sick in bed for weeks. Meanwhile, your business falls apart without you.',
            effects: [{ kind: 'gold', delta: -250 }, { kind: 'stat', stat: 'grit', delta: -1 }, { kind: 'advanceDays', days: 21 }],
          },
        },
      },
    ],
  },

  {
    id: 'ch5_plague_riot',
    weight: 4,
    once: true,
    title: 'An Angry Crowd',
    body: ['A frightened, angry crowd gathers outside your storehouse, waving torches. "Medicine!" they shout. "We know you have medicine!" They start pushing at the doors.'],
    choices: [
      {
        id: 'give_medicine',
        label: 'Share the medicine (-200g of stock)',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'You hand out the medicine. The crowd calms down, and people thank you.' },
        ],
      },
      {
        id: 'defend_warehouse',
        label: 'Hold the doors (Nerve check, DC 15)',
        check: {
          stat: 'nerve',
          dc: 15,
          success: { text: 'You stand in the doorway and do not move. Slowly, the crowd backs away.', effects: [{ kind: 'stat', stat: 'nerve', delta: 2 }] },
          failure: { text: 'The doors burst open. The crowd takes everything inside.', effects: [{ kind: 'gold', delta: -500 }] },
        },
      },
      favour('folk', {
        id: 'speak_to_the_crowd',
        label: 'Speak to the crowd: they know you',
        effects: [{ kind: 'narrate', text: 'Someone shouts your name: you were the one who helped them. The crowd lowers its torches and goes home.' }],
      }),
    ],
  },

  {
    id: 'ch5_healer_betrayal',
    weight: 3,
    once: true,
    title: 'The Healer\'s Betrayal',
    body: ['The healer you trusted has sold all your medicine to a rich lord, and left your workers with nothing. "The rich can pay more," he sneers.'],
    choices: [
      {
        id: 'forgive_healer',
        label: 'Forgive him and move on',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'gold', delta: -300 },
          { kind: 'narrate', text: 'You forgive him and buy new medicine. It costs a lot, but your workers get well.' },
        ],
      },
      {
        id: 'execute_healer',
        label: 'Have him arrested (Grit check, DC 13)',
        check: {
          stat: 'grit',
          dc: 13,
          success: { text: 'The Watch marches him off to the cells. Every healer in town hears about it.', effects: [{ kind: 'stat', stat: 'grit', delta: 2 }, { kind: 'stat', stat: 'charm', delta: -2 }] },
          failure: { text: 'The healer has friends in the Watch. They arrest you instead, and it costs 450 gold to get free.', effects: [{ kind: 'gold', delta: -450 }] },
        },
      },
    ],
  },
]
