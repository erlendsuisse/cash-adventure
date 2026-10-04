import type { StoryCard } from '../../engine/types'
import { enterChapter } from './factories'

const colossus05_start: StoryCard = {
  id: 'colossus05_start',
  title: 'The Plague Arrives',
  body: [
    'It starts with a cough in the eastern quarter. Then another. Within days, a grey fog creeps through every street.',
    'Inside the fog walks the fifth Colossus: the Plague, a giant of grey mist with cold, hollow eyes. Ships are turned away. Markets close. The rich flee the city.',
    'Against the Plague, gold is useless. Only courage and kindness help now. Will you run, or stay and help?',
  ],
  choices: [{ id: 'face_plague', label: 'Stay and help', goto: 'colossus05_trial_charm' }],
}

const colossus05_trial_charm: StoryCard = {
  id: 'colossus05_trial_charm',
  title: 'The City Needs a Leader',
  body: [
    'The city council huddles by candlelight, frightened and lost. Too many people are sick, and nobody knows what to do.',
    'An old councillor grabs your hands. "The people trust you. You\'ve given, not just taken. Will you lead the relief? We need bread, medicine, and someone to give people hope."',
  ],
  choices: [
    {
      id: 'inspire_city',
      label: 'Lead the relief (Charm check, DC 17)',
      check: {
        stat: 'charm',
        dc: 17,
        success: {
          text: 'You climb onto a cart and speak to the crowd. They believe you. Bread and medicine start to reach every street.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_plague', atLeast: 1 }, then: [{ kind: 'narrate', text: 'All the kindness you showed before pays off now. People trust you, because you earned it.' }], else: [] },
          ],
          goto: 'colossus05_trial_grit',
        },
        failure: {
          text: 'Your words get lost in the fear. Nobody listens. You climb down, ashamed.',
          effects: [{ kind: 'stat', stat: 'charm', delta: -1 }],
          goto: 'colossus05_trial_grit',
        },
      },
    },
  ],
}

const colossus05_trial_grit: StoryCard = {
  id: 'colossus05_trial_grit',
  title: 'The Long Nights',
  body: [
    'Weeks pass. The grey fog will not lift. You spend every day in the sickrooms, handing out soup and blankets, and your gold melts away.',
    'A tired healer sits beside you. "Most people ran away," she says. "Why are you still here?"',
  ],
  choices: [
    {
      id: 'endure_plague',
      label: 'Keep going (Grit check, DC 18)',
      check: {
        stat: 'grit',
        dc: 18,
        success: {
          text: 'You find something stronger than gold inside yourself. No fog and no bad luck can ever take it away.',
          effects: [
            { kind: 'stat', stat: 'grit', delta: 2 },
            { kind: 'if', when: { kind: 'flag', id: 'investigated_plague', atLeast: 1 }, then: [{ kind: 'stat', stat: 'charm', delta: 1 }, { kind: 'narrate', text: 'The friends you made along the way carry you through the hardest nights.' }], else: [] },
          ],
          goto: 'colossus05_outcome',
        },
        failure: {
          text: 'It is too much. You go home, exhausted and sad. You made it, but it cost you.',
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
    ...enterChapter(6),
    { kind: 'queueCard', card: 'plague_aftermath' },
    { kind: 'narrate', text: 'The Plague drifts out to sea and fades away. Vessarin comes back to life, a little different, and so do you. Now you know what truly matters.' },
  ],
  body: [
    'Months later, the grey fog lifts. The sun comes out. The city survives, and people remember your name.',
    'Ships return to the harbour. Stalls open again, one by one. But something inside you has changed.',
    'Gold is only a tool. The world can take it away at any moment. What matters is what you do with it while you have it.',
  ],
  choices: [{ id: 'continue_after_plague', label: 'Move forward', effects: [] }],
}

export const colossus05Cards: StoryCard[] = [
  colossus05_start,
  colossus05_trial_charm,
  colossus05_trial_grit,
  colossus05_outcome,
]
