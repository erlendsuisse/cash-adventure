import type { StoryCard } from '../../engine/types'

// ===== MENTOR RELATIONSHIPS =====

const master_trader: StoryCard = {
  id: 'master_trader',
  title: 'The Grand Old Trader',
  weight: 2,
  storyPhase: 'climbing',
  body: [
    'A grand old trader with a silver cane taps your shoe to get your attention.',
    '"Most traders chase quick coins," she says. "You think ahead. I like that."',
    '"I built my fortune by understanding people. I could teach you, if you\'ll listen."',
  ],
  choices: [
    {
      id: 'mentor_accept',
      label: 'Become her student (80g/month)',
      effects: [
        { kind: 'expense', delta: 80 },
        { kind: 'flag', id: 'mentor_trader', set: 1 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
    { id: 'mentor_decline', label: 'Politely decline', effects: [] },
  ],
}

const mentor_wisdom: StoryCard = {
  id: 'mentor_wisdom',
  title: 'Lessons by the Fire',
  weight: 1,
  requires: [{ kind: 'flag', id: 'mentor_trader', atLeast: 1 }],
  storyPhase: 'climbing',
  body: [
    'By her crackling fire, your teacher shares her secret. "The greatest fortunes are built on trust, not tricks."',
    '"People remember who treated them well. A good name is worth more than any single deal."',
    'Week by week, her lessons sink in. You start to see business in a whole new way.',
  ],
  choices: [
    {
      id: 'wisdom_applied',
      label: 'Put her lessons to work',
      effects: [
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'flag', id: 'mentor_trader', set: 2 },
      ],
    },
  ],
}

// ===== FAMILY & BACKSTORY =====

const childhood_friend: StoryCard = {
  id: 'childhood_friend',
  title: 'A Face from the Past',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'In the busy market, someone calls your name. It\'s your best friend from when you were small! You haven\'t seen each other in years.',
    '"I\'ve been away in another city," your friend says, beaming. "But I\'m home now. Let\'s catch up!"',
  ],
  choices: [
    {
      id: 'friend_reconnect',
      label: 'Catch up properly',
      effects: [
        { kind: 'flag', id: 'friend_close', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
    {
      id: 'friend_busy',
      label: 'Wave, but get back to work',
      effects: [{ kind: 'flag', id: 'friend_distant', set: 1 }],
    },
  ],
}

const friend_crisis: StoryCard = {
  id: 'friend_crisis',
  title: 'Your Friend Needs Help',
  weight: 1,
  requires: [{ kind: 'flag', id: 'friend_close', atLeast: 1 }],
  storyPhase: 'climbing',
  body: [
    'Your old friend arrives at your door, pale and shaking. "I made a terrible deal," your friend says. "Now I owe money to some very scary people."',
    '"I hate to ask. But could you lend me 200 gold?"',
  ],
  choices: [
    {
      id: 'friend_save',
      label: 'Give your friend 200 gold',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'flag', id: 'friend_debt', set: 1 },
      ],
    },
    {
      id: 'friend_refuse',
      label: 'Refuse: your friend must sort it out',
      effects: [{ kind: 'flag', id: 'friend_close', set: 0 }],
    },
    {
      id: 'friend_loan',
      label: 'Offer your friend work to earn it',
      effects: [
        { kind: 'flag', id: 'friend_partner', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
  ],
}

// ===== RIVAL RELATIONSHIPS =====

const ruthless_competitor: StoryCard = {
  id: 'ruthless_competitor',
  title: 'The Ruthless Rival',
  weight: 2,
  storyPhase: 'climbing',
  body: [
    'A new merchant sweeps into Vessarin in a black carriage, cutting prices everywhere.',
    'In weeks, he has grabbed half the spice market. Now he wants the salt trade too.',
    '"You\'re good," he smirks, tipping his hat. "But I\'m better. And I play dirty."',
  ],
  choices: [
    {
      id: 'rival_compete',
      label: 'Beat him with a better plan',
      effects: [
        { kind: 'flag', id: 'rival_compete', set: 1 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
      ],
    },
    {
      id: 'rival_sabotage',
      label: 'Look for his weak spot',
      effects: [
        { kind: 'flag', id: 'rival_sabotage', set: 1 },
        { kind: 'flag', id: 'moral_compromise', delta: 1 },
      ],
    },
    { id: 'rival_ignore', label: 'Ignore him and mind your own shop', effects: [] },
  ],
}

const rival_showdown: StoryCard = {
  id: 'rival_showdown',
  title: 'The Price War',
  weight: 1,
  requires: [{ kind: 'flag', id: 'rival_compete', equals: 1 }],
  storyPhase: 'climbing',
  body: [
    'The market becomes a battlefield. You both cut prices again and again.',
    'He plays dirty, but you play smart. In the big meeting, you win the contract he wanted most.',
    'You have won, for now. On his way out, he hisses: "This isn\'t over."',
  ],
  choices: [
    {
      id: 'rival_victory',
      label: 'Enjoy the win',
      effects: [
        { kind: 'gold', delta: 180 },
        { kind: 'flag', id: 'rival_beaten', set: 1 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
      ],
    },
  ],
}

// ===== DARK CHOICES & CONSEQUENCES =====

const theft_offer: StoryCard = {
  id: 'theft_offer',
  title: 'The Warehouse Key',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'A hooded figure slides into the seat beside you. "Your rival\'s spice warehouse," she whispers. "Help us empty it."',
    '"Nobody will know. It pays 300 gold, and he deserves it anyway."',
    '"All you have to do is lend us the key. You have one, don\'t you?"',
    'You do. The key feels heavy in your pocket.',
  ],
  choices: [
    {
      id: 'theft_accept',
      label: 'Hand over the key',
      effects: [
        { kind: 'gold', delta: 300 },
        { kind: 'flag', id: 'criminal_act', set: 1 },
        { kind: 'flag', id: 'heat_level', delta: 1 },
        { kind: 'flag', id: 'guilt_weight', delta: 1 },
      ],
    },
    {
      id: 'theft_refuse',
      label: 'Refuse, and report her',
      effects: [
        { kind: 'stat', stat: 'grit', delta: 1 },
        { kind: 'flag', id: 'criminal_safe', set: 1 },
      ],
    },
  ],
}

// ===== TRAGEDY & LOSS =====

const plague_outbreak: StoryCard = {
  id: 'plague_outbreak',
  title: 'Someone You Love Is Sick',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'A sickness is spreading through the poor quarter, and the guild does nothing to help.',
    'Then the news reaches you: someone you love has caught it. The healer wants 100 gold.',
  ],
  choices: [
    {
      id: 'plague_pay',
      label: 'Pay the healer (100g)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'flag', id: 'loved_one_saved', set: 1 },
      ],
    },
    {
      id: 'plague_pray',
      label: 'Hope they get better on their own',
      effects: [{ kind: 'flag', id: 'loved_one_lost', set: 1 }],
    },
  ],
}

// ===== POWER & INFLUENCE =====

const guild_leadership: StoryCard = {
  id: 'guild_leadership',
  title: 'A Seat on the Council',
  weight: 1,
  requires: [{ kind: 'goldAtLeast', amount: 500 }, { kind: 'statAtLeast', stat: 'savvy', value: 4 }],
  storyPhase: 'climbing',
  body: [
    'A letter with the guild\'s golden seal arrives. They want you on their council!',
    'A seat at the table where the big decisions are made.',
    '"There is a small matter of a gift," the guild master coughs. "500 gold for the guild chest. An investment in your future."',
  ],
  choices: [
    {
      id: 'guild_join',
      label: 'Join the council',
      effects: [
        { kind: 'gold', delta: -500 },
        { kind: 'flag', id: 'guild_member', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
    { id: 'guild_decline', label: 'Decline the seat', effects: [] },
  ],
}

// ===== PHILOSOPHICAL MOMENTS =====

const fortune_teller: StoryCard = {
  id: 'fortune_teller',
  title: 'The Seer\'s Cards',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'A fortune teller turns over her cards, then frowns.',
    '"You stand at a crossroads," she says. "Gold without a good heart is an empty throne."',
    '"I see great fortune in your future, and great regret. Which path will you choose?"',
  ],
  choices: [
    {
      id: 'fortune_reflect',
      label: 'Take her warning to heart',
      effects: [{ kind: 'flag', id: 'soul_searching', set: 1 }],
    },
    { id: 'fortune_dismiss', label: 'Laugh it off', effects: [] },
  ],
}

// ===== EXPANSION HOOKS (lead to colossus) =====

const presage_ledger_wyrm: StoryCard = {
  id: 'presage_ledger_wyrm',
  title: 'Strange Signs',
  weight: 1,
  storyPhase: 'climbing',
  requires: [{ kind: 'colossiAtLeast', count: 0 }],
  body: [
    'Strange things are happening. Ledgers vanish from locked vaults. Secret records turn up in rivals\' hands. At night, the guild towers creak.',
    '"Something old is waking up," an elderly merchant whispers. "Something that hungers for order. And judgment."',
    'You tell yourself it\'s just a story. But a chill runs down your spine.',
  ],
  choices: [{ id: 'presage_continue', label: 'Carry on, carefully', effects: [] }],
}

// Export all cards
export const storyExpansion2Cards: StoryCard[] = [
  master_trader,
  mentor_wisdom,
  childhood_friend,
  friend_crisis,
  ruthless_competitor,
  rival_showdown,
  theft_offer,
  plague_outbreak,
  guild_leadership,
  fortune_teller,
  presage_ledger_wyrm,
]
