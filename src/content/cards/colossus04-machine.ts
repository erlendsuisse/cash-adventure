import type { StoryCard } from '../../engine/types'
import { enterChapter } from './factories'

const colossus04_start: StoryCard = {
  id: 'colossus04_start',
  title: 'The Machine Arrives',
  body: [
    'One morning, chimneys appear on the edge of town, belching black smoke. Iron wheels clank. Steam hisses.',
    'The fourth Colossus has arrived: the Machine, a walking factory of brass and fire. It makes in 1 hour what a craftsman makes in a week.',
    'Salt makers, spinners and smiths watch their trades vanish in days. The old ways are being crushed under its wheels. You must change, or be crushed too.',
  ],
  choices: [{ id: 'face_machine', label: 'Face the Machine', goto: 'colossus04_trial_savvy' }],
}

const colossus04_trial_savvy: StoryCard = {
  id: 'colossus04_trial_savvy',
  title: 'How Does It Work?',
  body: [
    'A factory owner with oil-black gloves looks you up and down.',
    '"Your old ways are finished," he says. "Learn how my machines think, and you can profit. Refuse, and you will be left behind."',
    'You watch the gears turn and the belts whir. The machines aren\'t evil. They are just very, very fast.',
  ],
  choices: [
    {
      id: 'understand_machines',
      label: 'Figure out the machines (Savvy check, DC 17)',
      check: {
        stat: 'savvy',
        dc: 17,
        success: {
          text: 'Slowly, it clicks. You see how each machine feeds the next. You may not love this new world, but you understand it.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_machine', atLeast: 1 }, then: [{ kind: 'narrate', text: 'You remember the mechanic\'s warning, and you came prepared. The owner raises an eyebrow, impressed.' }], else: [] },
          ],
          goto: 'colossus04_trial_charm',
        },
        failure: {
          text: 'The gears spin too fast to follow. You fall behind, and others race ahead.',
          effects: [{ kind: 'stat', stat: 'savvy', delta: -1 }],
          goto: 'colossus04_trial_charm',
        },
      },
    },
  ],
}

const colossus04_trial_charm: StoryCard = {
  id: 'colossus04_trial_charm',
  title: 'What Will You Give Up?',
  body: [
    'The factory owner leans back. "I like people who change," he says. "But change costs something. What will you give up?"',
    'Many of your workers will not be needed. The old crafts that made you rich will soon be worthless.',
    '"Join me," he says, "but the old world stays behind."',
  ],
  choices: [
    {
      id: 'negotiate_terms',
      label: 'Strike a deal (Charm check, DC 16)',
      check: {
        stat: 'charm',
        dc: 16,
        success: {
          text: 'You talk his language: profit, speed, the future. He makes you a junior partner. A step down, but not a fall.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_machine', atLeast: 1 }, then: [{ kind: 'stat', stat: 'savvy', delta: 1 }, { kind: 'narrate', text: 'Your preparation makes you too useful to waste. He offers you a better deal than he planned.' }], else: [] },
          ],
          goto: 'colossus04_outcome',
        },
        failure: {
          text: 'He thinks you care too much about your workers and the old ways. You can join, but only at the very bottom.',
          effects: [{ kind: 'wages', delta: -20 }],
          goto: 'colossus04_outcome',
        },
      },
    },
  ],
}

const colossus04_outcome: StoryCard = {
  id: 'colossus04_outcome',
  title: 'The New Order',
  onEnter: [
    { kind: 'grantBoon', boon: 'machine_sponsor' },
    { kind: 'reckoning' },
    { kind: 'advancePhase', to: 'recovery' },
    ...enterChapter(5),
    { kind: 'queueCard', card: 'market_collapse' },
    { kind: 'narrate', text: 'The Machine clanks on. Your old ventures are worthless now, and your wages are cut. But you changed with the times. In a world of machines, that is how you win.' },
  ],
  body: [
    'Months pass. The old Vessarin is gone. Chimneys smoke where market stalls once stood.',
    'You are smaller now. But you are not left behind. You have learned to think like the Machine, and that keeps you going.',
  ],
  choices: [{ id: 'endure', label: 'Step into the new age', effects: [] }],
}

export const colossus04Cards: StoryCard[] = [
  colossus04_start,
  colossus04_trial_savvy,
  colossus04_trial_charm,
  colossus04_outcome,
]
