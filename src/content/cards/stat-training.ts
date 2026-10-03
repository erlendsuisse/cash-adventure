import type { StoryCard } from '../../engine/types'

// Stat training cards - available in climbing phases
// Players can invest gold to improve their attributes

const grit_training: StoryCard = {
  id: 'grit_training',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Steel Your Resolve',
  body: [
    'A hardened veteran approaches you in the market. "I\'ve trained many soft merchants to be hard. It costs 80 gold, but you\'ll leave stronger than you arrived."',
    'They teach discipline, endurance, and the mental fortitude to never back down from a deal.',
  ],
  choices: [
    {
      id: 'train_grit',
      label: 'Train with the veteran (80 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 80 }],
      effects: [
        { kind: 'gold', delta: -80 },
        { kind: 'stat', stat: 'grit', delta: 2 },
        { kind: 'narrate', text: 'Your resolve hardens. You learn to push through exhaustion and doubt.' },
        { kind: 'advanceDays', days: 7 },
      ],
    },
    { id: 'skip_grit', label: 'Too expensive', effects: [] },
  ],
}

const savvy_training: StoryCard = {
  id: 'savvy_training',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Learn the Markets',
  body: [
    'A merchant sage invites you to study with them. "Understand the patterns of gold, and gold will flow to you. 100 gold for the apprenticeship."',
    'They teach you to read price movements, predict shortages, and spot opportunities others miss.',
  ],
  choices: [
    {
      id: 'train_savvy',
      label: 'Study with the sage (100 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'narrate', text: 'Your mind sharpens. Market movements reveal themselves to you like a map.' },
        { kind: 'advanceDays', days: 8 },
      ],
    },
    { id: 'skip_savvy', label: 'Too costly', effects: [] },
  ],
}

const nerve_training: StoryCard = {
  id: 'nerve_training',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Master Your Fear',
  body: [
    'A daring smuggler sees potential in you. "Fear is just unfinished business. Train with me for 90 gold, and you\'ll never hesitate again."',
    'They teach you to act decisively, to gamble with confidence, and to stare down danger without flinching.',
  ],
  choices: [
    {
      id: 'train_nerve',
      label: 'Learn from the smuggler (90 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 90 }],
      effects: [
        { kind: 'gold', delta: -90 },
        { kind: 'stat', stat: 'nerve', delta: 2 },
        { kind: 'narrate', text: 'Fear loses its hold on you. You move through the world with quiet confidence.' },
        { kind: 'advanceDays', days: 6 },
      ],
    },
    { id: 'skip_nerve', label: 'Not ready', effects: [] },
  ],
}

const charm_training: StoryCard = {
  id: 'charm_training',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Art of Persuasion',
  body: [
    'A charismatic courtier offers to teach you. "People buy what they want to believe. Learn to make them believe. 85 gold for the course."',
    'They teach you voice, presence, the subtle art of making people want to say yes to you.',
  ],
  choices: [
    {
      id: 'train_charm',
      label: 'Train with the courtier (85 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 85 }],
      effects: [
        { kind: 'gold', delta: -85 },
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'narrate', text: 'You learn to speak with grace and power. People lean in to listen.' },
        { kind: 'advanceDays', days: 7 },
      ],
    },
    { id: 'skip_charm', label: 'Not for me', effects: [] },
  ],
}

// Recovery phase training - more intense, higher cost
const grit_recovery_training: StoryCard = {
  id: 'grit_recovery_training',
  weight: 2,
  storyPhase: 'recovery',
  title: 'Forge Your Spirit',
  body: [
    'In the aftermath of your reckoning, you find a master who teaches ultimate resilience. The cost is steep—120 gold—but they promise unbreakable will.',
    'You emerge from weeks of training fundamentally changed, able to face any adversity.',
  ],
  choices: [
    {
      id: 'advanced_grit',
      label: 'Intensive training (120 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 120 }],
      effects: [
        { kind: 'gold', delta: -120 },
        { kind: 'stat', stat: 'grit', delta: 3 },
        { kind: 'narrate', text: 'You are reforged. Nothing can break you now.' },
        { kind: 'advanceDays', days: 14 },
      ],
    },
    { id: 'skip_recovery_grit', label: 'Find another path', effects: [] },
  ],
}

const savvy_recovery_training: StoryCard = {
  id: 'savvy_recovery_training',
  weight: 2,
  storyPhase: 'recovery',
  title: 'Decipher the Future',
  body: [
    'A legendary analyst emerges from retirement. "I see patterns others miss. For 140 gold, I\'ll teach you to see them too. Then you\'ll never be blindsided again."',
    'You study the deepest mysteries of commerce and timing.',
  ],
  choices: [
    {
      id: 'advanced_savvy',
      label: 'Master analysis (140 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 140 }],
      effects: [
        { kind: 'gold', delta: -140 },
        { kind: 'stat', stat: 'savvy', delta: 3 },
        { kind: 'narrate', text: 'You see three moves ahead. The market reveals its secrets to you.' },
        { kind: 'advanceDays', days: 12 },
      ],
    },
    { id: 'skip_recovery_savvy', label: 'Move on', effects: [] },
  ],
}

const nerve_recovery_training: StoryCard = {
  id: 'nerve_recovery_training',
  weight: 2,
  storyPhase: 'recovery',
  title: 'Dance With Danger',
  body: [
    'A legendary daredevil finds you. "You\'ve already faced your worst. Now learn to thrive in chaos. 125 gold, and I\'ll show you how to turn danger into advantage."',
    'You learn to find opportunity in catastrophe, to gamble with perfect clarity.',
  ],
  choices: [
    {
      id: 'advanced_nerve',
      label: 'Advanced training (125 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 125 }],
      effects: [
        { kind: 'gold', delta: -125 },
        { kind: 'stat', stat: 'nerve', delta: 3 },
        { kind: 'narrate', text: 'Danger becomes your dance partner. You move through it with perfect grace.' },
        { kind: 'advanceDays', days: 11 },
      ],
    },
    { id: 'skip_recovery_nerve', label: 'Decline', effects: [] },
  ],
}

const charm_recovery_training: StoryCard = {
  id: 'charm_recovery_training',
  weight: 2,
  storyPhase: 'recovery',
  title: 'Become Unforgettable',
  body: [
    'A retired diplomat approaches you. "I\'ve advised kings. For 130 gold, I\'ll teach you what I know. You\'ll be able to convince anyone of anything."',
    'You learn the deepest secrets of human persuasion and influence.',
  ],
  choices: [
    {
      id: 'advanced_charm',
      label: 'Elite training (130 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 130 }],
      effects: [
        { kind: 'gold', delta: -130 },
        { kind: 'stat', stat: 'charm', delta: 3 },
        { kind: 'narrate', text: 'Your words become law. People will move mountains for you.' },
        { kind: 'advanceDays', days: 12 },
      ],
    },
    { id: 'skip_recovery_charm', label: 'Not interested', effects: [] },
  ],
}

export const statTrainingCards: StoryCard[] = [
  grit_training,
  savvy_training,
  nerve_training,
  charm_training,
  grit_recovery_training,
  savvy_recovery_training,
  nerve_recovery_training,
  charm_recovery_training,
]
