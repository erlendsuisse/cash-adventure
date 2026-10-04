import type { StoryCard } from '../../engine/types'

// Investigation opportunities for each Colossi
// These cards let players learn about dangers before facing them
// Investigation flags provide bonuses in Colossi trials

const investigate_ledger_wyrm: StoryCard = {
  id: 'investigate_ledger_wyrm',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Warnings of the Auditors',
  body: [
    'An old merchant pulls you behind a stall. "The Ledger-Wyrm is stirring," he whispers. "A dragon of taxes and audits. It comes for anyone who grows rich too fast."',
    '"Here\'s the secret," he says. "It can\'t bite a perfectly honest ledger. Keep your books spotless. Give it nothing to find."',
  ],
  choices: [
    {
      id: 'heed_ledger_warning',
      label: 'Listen closely',
      effects: [
        { kind: 'flag', id: 'investigated_ledger_wyrm', set: 1 },
        { kind: 'narrate', text: 'You remember every word. When the Wyrm comes, you will be ready.' },
      ],
    },
    {
      id: 'ignore_ledger_warning',
      label: 'Laugh it off',
      effects: [{ kind: 'narrate', text: 'Dragons made of taxes? You laugh and get back to work.' }],
    },
  ],
}

const investigate_inquisitor: StoryCard = {
  id: 'investigate_inquisitor',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Whispers of the Inquisition',
  body: [
    'A priestess in white stops you on the temple steps. "The Inquisitor will come one day," she says quietly. "He judges hearts. But he cannot find a crack in an honest one."',
    '"If you\'ve done things you regret, own up to them now," she says. "Carry no lies into his trial, and he has nothing to grab onto."',
  ],
  choices: [
    {
      id: 'heed_inquisitor_warning',
      label: 'Take her words to heart',
      effects: [
        { kind: 'flag', id: 'investigated_inquisitor', set: 1 },
        { kind: 'narrate', text: 'You understand now: honesty is your shield.' },
      ],
    },
    {
      id: 'ignore_inquisitor_warning',
      label: 'Keep your secrets',
      effects: [{ kind: 'narrate', text: 'Some secrets are better left buried. You hope.' }],
    },
  ],
}

const investigate_tide: StoryCard = {
  id: 'investigate_tide',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Old Sailor\'s Wisdom',
  body: [
    'An old sailor with a face like a walnut beckons you to his table. "The Tide is coming," he says. "A giant made of waves. It drowns anyone who thinks they rule the market."',
    '"The secret? Never bet everything on one wave. Spread your gold around. When the storm hits, many small anchors hold better than one big one."',
  ],
  choices: [
    {
      id: 'heed_tide_warning',
      label: 'Learn his lesson',
      effects: [
        { kind: 'flag', id: 'investigated_tide', set: 1 },
        { kind: 'narrate', text: 'You decide to spread your money around. No single storm will sink you.' },
      ],
    },
    {
      id: 'ignore_tide_warning',
      label: 'Trust your own instincts',
      effects: [{ kind: 'narrate', text: 'You thank him for the story and trust your own gut instead.' }],
    },
  ],
}

const investigate_machine: StoryCard = {
  id: 'investigate_machine',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Mechanic\'s Warning',
  body: [
    'A mechanic with oily hands grabs your sleeve. "The Machine is coming," she says. "It isn\'t evil. It just doesn\'t care about anything but speed."',
    '"Learn how it thinks," she says. "And learn what machines can\'t do: change their minds, have ideas, be kind. Be good at those, and you\'ll always be needed."',
  ],
  choices: [
    {
      id: 'heed_machine_warning',
      label: 'Study how machines work',
      effects: [
        { kind: 'flag', id: 'investigated_machine', set: 1 },
        { kind: 'narrate', text: 'You spend evenings with gears and diagrams. Slowly, it starts to make sense.' },
      ],
    },
    {
      id: 'ignore_machine_warning',
      label: 'Stick to the old ways',
      effects: [{ kind: 'narrate', text: 'The old ways have worked fine so far.' }],
    },
  ],
}

const investigate_plague: StoryCard = {
  id: 'investigate_plague',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Healer\'s Preparation',
  body: [
    'A healer with kind eyes stops you in the street. "One day, a great sickness will come," she says. "When it does, gold won\'t save you. People will."',
    '"Make friends now," she says. "Help people. When hard times come, the ones who make it are never the ones who hide alone with their gold."',
  ],
  choices: [
    {
      id: 'heed_plague_warning',
      label: 'Start helping people',
      effects: [
        { kind: 'flag', id: 'investigated_plague', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'You start lending a hand around the city. People begin to smile when they see you.' },
      ],
    },
    {
      id: 'ignore_plague_warning',
      label: 'Focus on your gold',
      effects: [{ kind: 'narrate', text: 'Gold will protect you, you tell yourself.' }],
    },
  ],
}

const investigate_betrayal: StoryCard = {
  id: 'investigate_betrayal',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Fixer\'s Advice',
  body: [
    'A fixer in a grey cloak leans out of a doorway. "You\'re dealing with people who never forget a debt," she says. "One day, they will all come to collect."',
    '"When that day comes, knowledge is your only weapon. Learn who owes whom. Learn the price of everything. Then you can bargain your way out."',
  ],
  choices: [
    {
      id: 'heed_betrayal_warning',
      label: 'Learn the underworld\'s secrets',
      effects: [
        { kind: 'flag', id: 'investigated_betrayal', set: 1 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'You learn who owes whom, and the secret rules nobody writes down.' },
      ],
    },
    {
      id: 'ignore_betrayal_warning',
      label: 'Stay out of it',
      effects: [{ kind: 'narrate', text: 'You would rather keep your hands clean.' }],
    },
  ],
}

const investigate_mirror: StoryCard = {
  id: 'investigate_mirror',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Philosopher\'s Riddle',
  body: [
    'An old philosopher with a long white beard blocks your path. "One day, you will meet yourself in a mirror," he says. "Will you like who you see?"',
    '"Think about who you are," he says. "What would you never do, not for all the gold in the world? Know that, and the Mirror cannot scare you."',
  ],
  choices: [
    {
      id: 'heed_mirror_warning',
      label: 'Take time to think about it',
      effects: [
        { kind: 'flag', id: 'investigated_mirror', set: 1 },
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'You sit by the harbour and think about who you really are.' },
      ],
    },
    {
      id: 'ignore_mirror_warning',
      label: 'Too much thinking',
      effects: [{ kind: 'narrate', text: 'You have enough to worry about without riddles.' }],
    },
  ],
}

export const colossiInvestigationCards: StoryCard[] = [
  investigate_ledger_wyrm,
  investigate_inquisitor,
  investigate_tide,
  investigate_machine,
  investigate_plague,
  investigate_betrayal,
  investigate_mirror,
]
