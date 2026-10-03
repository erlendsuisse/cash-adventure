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
    'An old merchant pulls you aside at the market. "They\'re coming for us," he whispers. "The Ledger-Wyrm. The auditors and tax collectors. They say it\'s a force of nature, inevitable as the tide."',
    'He looks haunted. "If you want to survive their scrutiny, you need to know: they can\'t break a perfectly clean ledger. Keep your books impeccable. Don\'t give them anything to find."',
  ],
  choices: [
    {
      id: 'heed_ledger_warning',
      label: 'Study his warnings closely',
      effects: [
        { kind: 'flag', id: 'investigated_ledger_wyrm', set: 1 },
        { kind: 'narrate', text: 'You memorize his advice. When the auditors come, you\'ll be ready.' },
      ],
    },
    {
      id: 'ignore_ledger_warning',
      label: 'Dismiss it as paranoia',
      effects: [{ kind: 'narrate', text: 'You\'ve heard enough doom-saying. You focus on business.' }],
    },
  ],
}

const investigate_inquisitor: StoryCard = {
  id: 'investigate_inquisitor',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Whispers of the Inquisition',
  body: [
    'A priestess finds you in the temple district. "There is something you should know," she says quietly. "The Inquisitor—the force that judges moral failings—it cannot see into an honest heart."',
    '"If you\'ve done things you regret, face them now. Name them. Confess them to yourself. Carry no lies into the trial, and it cannot find a foothold."',
  ],
  choices: [
    {
      id: 'heed_inquisitor_warning',
      label: 'Take her guidance to heart',
      effects: [
        { kind: 'flag', id: 'investigated_inquisitor', set: 1 },
        { kind: 'narrate', text: 'You understand: honesty is your shield.' },
      ],
    },
    {
      id: 'ignore_inquisitor_warning',
      label: 'Keep your past buried',
      effects: [{ kind: 'narrate', text: 'Some secrets are better left alone.' }],
    },
  ],
}

const investigate_tide: StoryCard = {
  id: 'investigate_tide',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Old Sailor\'s Wisdom',
  body: [
    'You meet an ancient sailor in a harbor tavern, weathered by decades at sea. "The Tide comes for all who dare to command the market," he says, swirling his drink.',
    '"I\'ve seen men richer than kings broken by it. The secret? Never overcommit. Never bet everything on one wave. Diversify. When the storm comes—and it always does—you survive because you have many anchors, not one."',
  ],
  choices: [
    {
      id: 'heed_tide_warning',
      label: 'Learn his lessons about diversification',
      effects: [
        { kind: 'flag', id: 'investigated_tide', set: 1 },
        { kind: 'narrate', text: 'You resolve to spread your investments. No single failure will destroy you.' },
      ],
    },
    {
      id: 'ignore_tide_warning',
      label: 'Believe in your instincts',
      effects: [{ kind: 'narrate', text: 'You trust your own judgment over an old sailor\'s tales.' }],
    },
  ],
}

const investigate_machine: StoryCard = {
  id: 'investigate_machine',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Mechanic\'s Warning',
  body: [
    'A factory worker approaches you with fear in his eyes. "The Machine—it\'s not evil, but it\'s not merciful either. It only understands efficiency."',
    '"If you want to survive what\'s coming, learn to think like it does. Understand profit margins. Understand what you can offer that machines cannot—adaptability, intuition, the human touch. Make yourself valuable in a world of machines."',
  ],
  choices: [
    {
      id: 'heed_machine_warning',
      label: 'Study industrial economics',
      effects: [
        { kind: 'flag', id: 'investigated_machine', set: 1 },
        { kind: 'narrate', text: 'You begin to grasp the logic of machines and markets.' },
      ],
    },
    {
      id: 'ignore_machine_warning',
      label: 'Trust traditional methods',
      effects: [{ kind: 'narrate', text: 'The old ways have served you well enough.' }],
    },
  ],
}

const investigate_plague: StoryCard = {
  id: 'investigate_plague',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Healer\'s Preparation',
  body: [
    'A physician pulls you aside. "Sickness will come to this city. Not today, perhaps, but inevitably. When it does, those who prepared will survive—not just physically, but spiritually."',
    '"Cultivate compassion now. Build relationships with people who matter. When the crisis comes, you\'ll draw strength from the connections you\'ve made. The ones who survive are never the ones who hoard alone."',
  ],
  choices: [
    {
      id: 'heed_plague_warning',
      label: 'Invest in relationships and community',
      effects: [
        { kind: 'flag', id: 'investigated_plague', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'You begin helping others, building bonds that may save you.' },
      ],
    },
    {
      id: 'ignore_plague_warning',
      label: 'Focus on accumulating wealth',
      effects: [{ kind: 'narrate', text: 'Gold will protect you when crisis comes.' }],
    },
  ],
}

const investigate_betrayal: StoryCard = {
  id: 'investigate_betrayal',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Fixer\'s Advice',
  body: [
    'A shady figure in the underworld catches your attention. "Play with fire, you\'ll get burned. You\'re making deals with people who don\'t forgive."',
    '"If betrayal comes—and it will—your only weapon is understanding. Know the networks. Know who owes whom. Know the price of everything. When they come to collect, you\'ll be ready to negotiate."',
  ],
  choices: [
    {
      id: 'heed_betrayal_warning',
      label: 'Study the underworld\'s networks',
      effects: [
        { kind: 'flag', id: 'investigated_betrayal', set: 1 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'You learn the hidden rules of the city\'s underworld.' },
      ],
    },
    {
      id: 'ignore_betrayal_warning',
      label: 'Stay out of underworld politics',
      effects: [{ kind: 'narrate', text: 'You prefer to keep your hands clean.' }],
    },
  ],
}

const investigate_mirror: StoryCard = {
  id: 'investigate_mirror',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Philosopher\'s Warning',
  body: [
    'An old philosopher stops you in the street. "You will face yourself one day. Not as an enemy—as a mirror. The question is not whether you\'ll see your reflection, but whether you\'ll recognize it."',
    '"Spend time now understanding who you are. What are your principles? What would you never compromise? When you face the Mirror, know yourself—truly know yourself. That is the only way through."',
  ],
  choices: [
    {
      id: 'heed_mirror_warning',
      label: 'Spend time in reflection and meditation',
      effects: [
        { kind: 'flag', id: 'investigated_mirror', set: 1 },
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'You take time to understand your own heart.' },
      ],
    },
    {
      id: 'ignore_mirror_warning',
      label: 'Avoid such existential thinking',
      effects: [{ kind: 'narrate', text: 'You\'ve enough to worry about without philosophical questions.' }],
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
