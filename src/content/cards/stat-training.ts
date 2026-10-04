import type { StoryCard } from '../../engine/types'

// Stat training cards - available in climbing phases
// Players can invest gold to improve their attributes

const grit_training: StoryCard = {
  id: 'grit_training',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Old Soldier\'s Training',
  body: [
    'A grizzled old soldier looks you up and down. "Soft," he grunts. "80 gold, and I\'ll make you tough enough to face anything."',
  ],
  choices: [
    {
      id: 'train_grit',
      label: 'Train with him (80g)',
      requires: [{ kind: 'goldAtLeast', amount: 80 }],
      effects: [
        { kind: 'gold', delta: -80 },
        { kind: 'stat', stat: 'grit', delta: 2 },
        { kind: 'narrate', text: 'Dawn runs, cold baths, and never giving up. You come out tougher than ever.' },
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
  title: 'Lessons in Numbers',
  body: [
    'A wise old merchant taps a chalkboard covered in numbers. "Learn the patterns of gold," she says, "and gold will come to you. 100 gold for my lessons."',
  ],
  choices: [
    {
      id: 'train_savvy',
      label: 'Study with her (100g)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'narrate', text: 'Your mind sharpens. The market starts to look like a map you can read.' },
        { kind: 'advanceDays', days: 8 },
      ],
    },
    { id: 'skip_savvy', label: 'Too pricey', effects: [] },
  ],
}

const nerve_training: StoryCard = {
  id: 'nerve_training',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Lessons in Courage',
  body: [
    'A daring smuggler balances on a ship\'s rail, laughing. "Fear is just a habit," she calls. "Train with me for 90 gold, and you\'ll never freeze again."',
  ],
  choices: [
    {
      id: 'train_nerve',
      label: 'Train with her (90g)',
      requires: [{ kind: 'goldAtLeast', amount: 90 }],
      effects: [
        { kind: 'gold', delta: -90 },
        { kind: 'stat', stat: 'nerve', delta: 2 },
        { kind: 'narrate', text: 'You learn to jump first and worry later. Fear loosens its grip on you.' },
        { kind: 'advanceDays', days: 6 },
      ],
    },
    { id: 'skip_nerve', label: 'Not ready yet', effects: [] },
  ],
}

const charm_training: StoryCard = {
  id: 'charm_training',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Art of Charm',
  body: [
    'A dazzling courtier sweeps a bow. "People say yes to those they like," he purrs. "For 85 gold, I\'ll teach you to be liked."',
  ],
  choices: [
    {
      id: 'train_charm',
      label: 'Train with him (85g)',
      requires: [{ kind: 'goldAtLeast', amount: 85 }],
      effects: [
        { kind: 'gold', delta: -85 },
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'narrate', text: 'You learn to speak warmly and smile well. People lean in when you talk.' },
        { kind: 'advanceDays', days: 7 },
      ],
    },
    { id: 'skip_charm', label: 'Not for you', effects: [] },
  ],
}

// Recovery phase training - more intense, higher cost
const grit_recovery_training: StoryCard = {
  id: 'grit_recovery_training',
  weight: 2,
  storyPhase: 'recovery',
  title: 'The Mountain Master',
  body: [
    'High on a misty mountain lives a master of toughness. Her training is hard and costs 120 gold, but she promises you\'ll never break again.',
  ],
  choices: [
    {
      id: 'advanced_grit',
      label: 'Climb the mountain (120g)',
      requires: [{ kind: 'goldAtLeast', amount: 120 }],
      effects: [
        { kind: 'gold', delta: -120 },
        { kind: 'stat', stat: 'grit', delta: 3 },
        { kind: 'narrate', text: 'Weeks later, you walk down the mountain changed. Nothing can break you now.' },
        { kind: 'advanceDays', days: 14 },
      ],
    },
    { id: 'skip_recovery_grit', label: 'Stay down in the valley', effects: [] },
  ],
}

const savvy_recovery_training: StoryCard = {
  id: 'savvy_recovery_training',
  weight: 2,
  storyPhase: 'recovery',
  title: 'The Retired Genius',
  body: [
    'A legendary number-cruncher comes out of retirement, spectacles gleaming. "I see what\'s coming before anyone else," he says. "140 gold, and so will you."',
  ],
  choices: [
    {
      id: 'advanced_savvy',
      label: 'Learn from the genius (140g)',
      requires: [{ kind: 'goldAtLeast', amount: 140 }],
      effects: [
        { kind: 'gold', delta: -140 },
        { kind: 'stat', stat: 'savvy', delta: 3 },
        { kind: 'narrate', text: 'Now you see 3 moves ahead. The market shows you its secrets.' },
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
  title: 'The Daredevil',
  body: [
    'A famous daredevil swings down from a rooftop on a rope. "You\'ve faced the worst," she grins. "Now learn to love danger. 125 gold!"',
  ],
  choices: [
    {
      id: 'advanced_nerve',
      label: 'Train with the daredevil (125g)',
      requires: [{ kind: 'goldAtLeast', amount: 125 }],
      effects: [
        { kind: 'gold', delta: -125 },
        { kind: 'stat', stat: 'nerve', delta: 3 },
        { kind: 'narrate', text: 'Danger becomes your dance partner. You glide through it with a grin.' },
        { kind: 'advanceDays', days: 11 },
      ],
    },
    { id: 'skip_recovery_nerve', label: 'Keep your feet on the ground', effects: [] },
  ],
}

const charm_recovery_training: StoryCard = {
  id: 'charm_recovery_training',
  weight: 2,
  storyPhase: 'recovery',
  title: 'The King\'s Old Advisor',
  body: [
    'A silver-haired diplomat bows. "I advised 3 kings," she says. "For 130 gold, I\'ll teach you to win anyone over."',
  ],
  choices: [
    {
      id: 'advanced_charm',
      label: 'Learn from her (130g)',
      requires: [{ kind: 'goldAtLeast', amount: 130 }],
      effects: [
        { kind: 'gold', delta: -130 },
        { kind: 'stat', stat: 'charm', delta: 3 },
        { kind: 'narrate', text: 'People hang on your every word. They would move mountains for you.' },
        { kind: 'advanceDays', days: 12 },
      ],
    },
    { id: 'skip_recovery_charm', label: 'Not for you', effects: [] },
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
