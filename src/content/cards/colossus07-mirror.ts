import type { StoryCard } from '../../engine/types'

const colossus07_start: StoryCard = {
  id: 'colossus07_start',
  title: 'The Mirror Appears',
  body: [
    'You have beaten 6 Colossi. You are richer than you ever dreamed. People bow when you pass.',
    'Then, in the great square, a giant mirror rises out of the cobbles. It is as tall as a tower, and it shows your face.',
    'The seventh and final Colossus steps out of the glass. It looks exactly like you. "I am every choice you ever made," it says, in your own voice.',
    '"You beat the Wyrm, the Inquisitor, the Tide, the Machine, the Plague and the Betrayal," it says. "But can you face yourself?"',
  ],
  choices: [{ id: 'face_mirror', label: 'Look into the Mirror', goto: 'colossus07_trial_truth' }],
}

const colossus07_trial_truth: StoryCard = {
  id: 'colossus07_trial_truth',
  title: 'What the Mirror Shows',
  body: [
    'The Mirror shows you everything. Every person you hurt for profit. Every person you could have helped, but didn\'t.',
    'Then it shows you yourself on the day you arrived, with 50 gold, big dreams and a good heart.',
    '"What have you done with your life?" it asks.',
  ],
  choices: [
    {
      id: 'embrace_true_self',
      label: 'Accept who you are, and do better',
      check: {
        stat: 'savvy',
        dc: 20,
        success: {
          text: 'You see it all clearly: the good and the bad. You are human. You accept it, and promise to do better.',
          effects: [
            { kind: 'stat', stat: 'savvy', delta: 1 },
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'stat', stat: 'charm', delta: 1 },
            { kind: 'if', when: { kind: 'flag', id: 'investigated_mirror', atLeast: 1 }, then: [{ kind: 'narrate', text: 'All that time thinking about who you are pays off. You meet the Mirror like an old friend.' }], else: [] },
          ],
          goto: 'colossus07_outcome',
        },
        failure: {
          text: 'You look away and make excuses. You get through, but the Mirror knows you haven\'t really changed.',
          effects: [{ kind: 'gold', delta: -300 }],
          goto: 'colossus07_outcome',
        },
      },
    },
  ],
}

const colossus07_outcome: StoryCard = {
  id: 'colossus07_outcome',
  title: 'The Last Colossus Falls',
  onEnter: [
    { kind: 'grantBoon', boon: 'mirror_survivor' },
    { kind: 'reckoning' },
    { kind: 'advancePhase', to: 'recovery' },
    { kind: 'queueCard', card: 'legacy_choice' },
    { kind: 'narrate', text: 'The Mirror shatters into a thousand sparkling pieces. In each one, you see someone you could still become. The last Colossus is beaten. You are free!' },
  ],
  body: [
    'The square is silent. The giant mirror stands still.',
    'Every choice you ever made rests on your shoulders.',
    'But you are still standing.',
    'You know who you are, and what you have done. And you choose to keep going.',
  ],
  choices: [{ id: 'begin_legacy', label: 'Claim your victory', effects: [] }],
}

export const colossus07Cards: StoryCard[] = [
  colossus07_start,
  colossus07_trial_truth,
  colossus07_outcome,
]
