import type { StoryCard } from '../../engine/types'

// ===== MENTOR RELATIONSHIPS =====

const master_trader: StoryCard = {
  id: 'master_trader',
  title: 'The Master\'s Lesson',
  weight: 2,
  storyPhase: 'climbing',
  body: [
    'An elderly merchant with decades of experience approaches you.',
    '"Most traders chase quick profits. You seem different—you think ahead," she observes.',
    '"I\'ve built an empire by understanding people, not just markets. I could teach you, if you\'re willing to listen."',
  ],
  choices: [
    {
      id: 'mentor_accept',
      label: 'Accept mentorship (invest time & 80g/month)',
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
  title: 'Mentor\'s Wisdom',
  weight: 1,
  requires: [{ kind: 'flag', id: 'mentor_trader', atLeast: 1 }],
  storyPhase: 'climbing',
  body: [
    'Your mentor shares hard-won lessons: "The greatest fortunes are built on trust, not deception.',
    'People remember who treats them well. That reputation is worth more than any single transaction."',
    'Over weeks of study, you internalize these principles. Your approach to business changes fundamentally.',
  ],
  choices: [
    {
      id: 'wisdom_applied',
      label: 'Apply these lessons',
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
    'Walking through the market, you run into someone from your childhood—a friend you thought was lost to time.',
    '"I\'ve been away," they say. "Building something in a new city. But I\'m home now, and I\'d love to reconnect."',
    'They look at you with warmth and something else—hope, perhaps, that you\'ll stay in their life.',
  ],
  choices: [
    {
      id: 'friend_reconnect',
      label: 'Reconnect and offer support',
      effects: [
        { kind: 'flag', id: 'friend_close', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
    {
      id: 'friend_busy',
      label: 'Be cordial but focus on business',
      effects: [{ kind: 'flag', id: 'friend_distant', set: 1 }],
    },
  ],
}

const friend_crisis: StoryCard = {
  id: 'friend_crisis',
  title: 'A Friend in Trouble',
  weight: 1,
  requires: [{ kind: 'flag', id: 'friend_close', atLeast: 1 }],
  storyPhase: 'climbing',
  body: [
    'Your childhood friend arrives at your door, desperate. "I\'m in debt. Serious debt. I made a bad business decision and now people are threatening me."',
    '"I know I have no right to ask, but... could you help? I need 200 gold to make this go away."',
    'They look terrified. This person once meant everything to you.',
  ],
  choices: [
    {
      id: 'friend_save',
      label: 'Give them 200 gold',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'flag', id: 'friend_debt', set: 1 },
      ],
    },
    {
      id: 'friend_refuse',
      label: 'Refuse—they must face consequences',
      effects: [{ kind: 'flag', id: 'friend_close', set: 0 }],
    },
    {
      id: 'friend_loan',
      label: 'Offer a business opportunity to earn it',
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
  title: 'A Ruthless Rival Emerges',
  weight: 2,
  storyPhase: 'climbing',
  body: [
    'A new merchant moves into Vessarin—aggressive, ambitious, and willing to undercut everyone.',
    'Within weeks, they\'ve cornered part of the spice market and are moving on salt.',
    '"You\'re good," they tell you with a smirk, "but I\'m better. And I play harder."',
    'This is a direct threat to your livelihood.',
  ],
  choices: [
    {
      id: 'rival_compete',
      label: 'Out-compete them with better strategy',
      effects: [
        { kind: 'flag', id: 'rival_compete', set: 1 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
      ],
    },
    {
      id: 'rival_sabotage',
      label: 'Investigate their methods for weaknesses',
      effects: [
        { kind: 'flag', id: 'rival_sabotage', set: 1 },
        { kind: 'flag', id: 'moral_compromise', delta: 1 },
      ],
    },
    { id: 'rival_ignore', label: 'Focus on your own business', effects: [] },
  ],
}

const rival_showdown: StoryCard = {
  id: 'rival_showdown',
  title: 'Competition Heats Up',
  weight: 1,
  requires: [{ kind: 'flag', id: 'rival_compete', equals: 1 }],
  storyPhase: 'climbing',
  body: [
    'The marketplace becomes a battleground. Prices drop as you both undercut each other.',
    'Your rival is ruthless, but you\'re strategic. In a crucial negotiation, you outmaneuver them and secure a major contract.',
    'For now, you\'ve won. But your rival whispers a promise: "This isn\'t over."',
  ],
  choices: [
    {
      id: 'rival_victory',
      label: 'Bask in victory',
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
  title: 'A Tempting Crime',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'A shadowy figure proposes something illegal: steal a shipment of valuable spices from a competitor.',
    '"No one will know it was you. The job pays 300 gold, and the competitor deserves it anyway."',
    '"All you have to do is provide the warehouse key. You have it, don\'t you?"',
    'You do. The choice sits heavy in your mind.',
  ],
  choices: [
    {
      id: 'theft_accept',
      label: 'Accept the job',
      effects: [
        { kind: 'gold', delta: 300 },
        { kind: 'flag', id: 'criminal_act', set: 1 },
        { kind: 'flag', id: 'heat_level', delta: 1 },
        { kind: 'flag', id: 'guilt_weight', delta: 1 },
      ],
    },
    {
      id: 'theft_refuse',
      label: 'Refuse and report them',
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
  title: 'Sickness Spreads',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'An illness spreads through the city\'s poor quarters. The guild does little—profits matter more than people.',
    'You hear that someone close to you has fallen ill. The healer\'s fee is 100 gold.',
    'You have the gold. The question is whether you\'ll spend it.',
  ],
  choices: [
    {
      id: 'plague_pay',
      label: 'Pay for the healer (100 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'flag', id: 'loved_one_saved', set: 1 },
      ],
    },
    {
      id: 'plague_pray',
      label: 'Pray they recover on their own',
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
    'The Merchant Guild offers you a position on their council.',
    'It comes with prestige, influence, and a seat at the table where real decisions are made.',
    '"But there\'s a price," the guild master says. "A 500-gold contribution to the guild coffers. Consider it an investment in your future."',
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
    { id: 'guild_decline', label: 'Decline', effects: [] },
  ],
}

// ===== PHILOSOPHICAL MOMENTS =====

const fortune_teller: StoryCard = {
  id: 'fortune_teller',
  title: 'The Seer\'s Reading',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'A fortune teller reads your cards and looks troubled.',
    '"You stand at a crossroads. Your choices now will define who you become. Wealth without conscience is an empty throne."',
    '"The cards show both great fortune and great regret in your future. Which path will you walk?"',
  ],
  choices: [
    {
      id: 'fortune_reflect',
      label: 'Take the warning seriously',
      effects: [{ kind: 'flag', id: 'soul_searching', set: 1 }],
    },
    { id: 'fortune_dismiss', label: 'Dismiss it as superstition', effects: [] },
  ],
}

// ===== EXPANSION HOOKS (lead to colossus) =====

const presage_ledger_wyrm: StoryCard = {
  id: 'presage_ledger_wyrm',
  title: 'Disturbing Omens',
  weight: 1,
  storyPhase: 'climbing',
  requires: [{ kind: 'colossiAtLeast', count: 0 }],
  body: [
    'Strange reports circulate among merchants. Ledgers have gone missing from secure vaults. Records that should be impossible to access are appearing in the hands of competitors.',
    '"Something is wrong," an older merchant tells you. "I\'ve been trading for 40 years. I can feel it. Something ancient is stirring. Something that hungers for order... and judgment."',
    'You dismiss it as superstition. But a chill runs down your spine.',
  ],
  choices: [{ id: 'presage_continue', label: 'Continue with caution', effects: [] }],
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
