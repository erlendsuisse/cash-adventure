import type { StoryCard } from '../../engine/types'

const colossus05_start: StoryCard = {
  id: 'colossus05_start',
  title: 'The Plague Arrives',
  body: [
    'It begins with whispers. A sickness in the eastern quarter that the healers cannot name. Within days, it spreads.',
    'The Plague is the fifth Colossus. It is indiscriminate catastrophe—crisis that levels all wealth and status. Before the Plague, gold means nothing. Power means nothing. Only survival and the bonds between people matter.',
    'Markets close. Ships are quarantined. Trade routes die. The city fills with the sound of coughing, prayers, and desperation.',
    'The wealthy flee. The poor remain. And your fortune—built on the flow of goods through those very streets—collapses along with the city.',
    'You must choose: will you save yourself and flee, or will you stay and help others survive? The Plague cares nothing for merchants or mercenaries. It only understands life and death, compassion and survival.',
    'This is not a merchant problem. This is not a financial crisis. This is the Plague—a force that reminds you that wealth means nothing when survival is in doubt.',
  ],
  choices: [{ id: 'face_plague', label: 'Confront the Crisis', goto: 'colossus05_trial_charm' }],
}

const colossus05_trial_charm: StoryCard = {
  id: 'colossus05_trial_charm',
  title: 'The City\'s Heart Breaks',
  body: [
    'The city council meets in secret. They are terrified. People are dying by the hundreds. Authority is crumbling.',
    'A council member sees you in the street: "We need someone the people trust. A merchant who has given, not just taken. Will you help us coordinate relief efforts? We need supplies, we need hope, we need a face the people will believe."',
    'Can you inspire the city through this darkness?',
  ],
  choices: [
    {
      id: 'inspire_city',
      label: 'Organize relief efforts (Charm check, DC 17)',
      check: {
        stat: 'charm',
        dc: 17,
        success: {
          text: 'You speak with authority and compassion. The city believes you. Relief efforts organize around your leadership. People survive because of your words.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_plague', atLeast: 1 }, then: [{ kind: 'narrate', text: 'Your earlier investments in community relationships bear fruit. People trust you because you\'ve been building that trust all along.' }], else: [] },
          ],
          goto: 'colossus05_trial_grit',
        },
        failure: {
          text: 'Your words ring hollow. People are too afraid to hear. You retreat, ashamed.',
          effects: [{ kind: 'stat', stat: 'charm', delta: -1 }],
          goto: 'colossus05_trial_grit',
        },
      },
    },
  ],
}

const colossus05_trial_grit: StoryCard = {
  id: 'colossus05_trial_grit',
  title: 'The Long Vigil',
  body: [
    'Weeks pass. The plague shows no sign of relenting. People grow numb. Some give up entirely.',
    'You spend days in the sick quarters, organizing supplies, supporting the hopeless. Your fortune evaporates as you pay for medicine, bread, shelter.',
    'A healer approaches you, hollow-eyed: "Most abandon the dying. You haven\'t. Why do you persist when everything is falling apart?"',
    'The question is real. Why do you continue?',
  ],
  choices: [
    {
      id: 'endure_plague',
      label: 'Endure and keep helping (Grit check, DC 18)',
      check: {
        stat: 'grit',
        dc: 18,
        success: {
          text: 'You find meaning beyond wealth. You discover something in yourself that survives loss—something that cannot be taken by plague or poverty. You are transformed.',
          effects: [
            { kind: 'stat', stat: 'grit', delta: 2 },
            { kind: 'if', when: { kind: 'flag', id: 'investigated_plague', atLeast: 1 }, then: [{ kind: 'stat', stat: 'charm', delta: 1 }, { kind: 'narrate', text: 'The bonds you cultivated earlier sustain you now. Community keeps you alive as much as courage does.' }], else: [] },
          ],
          goto: 'colossus05_outcome',
        },
        failure: {
          text: 'The weight is too much. You retreat, broken by what you\'ve witnessed. Survive, but diminished.',
          effects: [{ kind: 'stat', stat: 'grit', delta: -1 }],
          goto: 'colossus05_outcome',
        },
      },
    },
  ],
}

const colossus05_outcome: StoryCard = {
  id: 'colossus05_outcome',
  title: 'The Plague Breaks',
  onEnter: [
    { kind: 'grantBoon', boon: 'plague_survivor' },
    { kind: 'reckoning' },
    { kind: 'advancePhase', to: 'recovery' },
    { kind: 'queueCard', card: 'plague_aftermath' },
    { kind: 'narrate', text: 'The plague breaks as mysteriously as it came. The city slowly returns to life, but it is not the same city you knew. And you are not the same person who entered it. You have learned what truly matters. Your fortune returns, but it is now weighted with understanding.' },
  ],
  body: [
    'Months later, the plague ends. The city survives. Your name is remembered.',
    'You stand in the market square—half-ruined, half-rebuilt. The trade routes reopen. Merchants return. But something fundamental has shifted in you.',
    'Wealth, you now understand, is not the point. It is only a tool. And the world can take it away at any moment. What matters is what you choose to do with it while you have it.',
  ],
  choices: [{ id: 'continue_after_plague', label: 'Move Forward', effects: [] }],
}

export const colossus05Cards: StoryCard[] = [
  colossus05_start,
  colossus05_trial_charm,
  colossus05_trial_grit,
  colossus05_outcome,
]
