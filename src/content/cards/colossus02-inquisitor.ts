import type { StoryCard } from '../../engine/types'
import { enterChapter } from './factories'

const colossus02_start: StoryCard = {
  id: 'colossus02_start',
  title: 'The Inquisitor Arrives',
  body: [
    'The temple bells ring at the wrong hour. Bong. Bong. Bong. The whole market falls silent.',
    'Out of the fog strides the Inquisitor, the second Colossus. He is as tall as a church door, in robes of white and gold. The Wyrm checked your books. The Inquisitor checks your heart.',
    'He has heard whispers about your deals and your secrets. "Every merchant cuts corners," he says, his voice like a cold bell. "Let us see how many you have cut."',
  ],
  choices: [{ id: 'face_judgment', label: 'Face his judgment', goto: 'colossus02_trial_charm' }],
}

const colossus02_trial_charm: StoryCard = {
  id: 'colossus02_trial_charm',
  title: 'Across the Candle',
  body: [
    'A single candle flickers between you in the temple chamber. The Inquisitor asks about your deals, your partners, your midnight meetings.',
    '"Convince me," he says softly, "that your gold was earned honestly."',
  ],
  choices: [
    {
      id: 'convince_innocence',
      label: 'Convince him you\'re honest (Charm check, DC 14)',
      check: {
        stat: 'charm',
        dc: 14,
        success: {
          text: 'Your words ring true. The Inquisitor slowly nods.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_inquisitor', atLeast: 1 }, then: [{ kind: 'narrate', text: 'You remember the priestess\'s advice and hide nothing. "An honest heart," the Inquisitor murmurs. "How rare."' }], else: [] },
          ],
          goto: 'colossus02_trial_savvy',
        },
        failure: {
          text: 'He sees right through you. "Hidden things cost the most," he says. The price is high.',
          effects: [{ kind: 'gold', delta: -20 }],
          goto: 'colossus02_trial_savvy',
        },
      },
    },
  ],
}

const colossus02_trial_savvy: StoryCard = {
  id: 'colossus02_trial_savvy',
  title: 'Your Own Secret Ledger',
  body: [
    'The Inquisitor opens a ledger, and your stomach drops. It is your own secret book. How did he get it?',
    '"Curious," he murmurs. "Goods with false names. Payments to people who do not exist."',
    'He looks up. "Was this a mistake? Or a trick?"',
  ],
  choices: [
    {
      id: 'defend_ledgers',
      label: 'Explain away the ledger (Savvy check, DC 15)',
      check: {
        stat: 'savvy',
        dc: 15,
        success: {
          text: 'You go through it line by line. You show him the wrong handwriting and the sums that don\'t match. His certainty wobbles.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_inquisitor', atLeast: 1 }, then: [{ kind: 'stat', stat: 'charm', delta: 1 }, { kind: 'narrate', text: 'Your honesty and preparation impress even the Inquisitor. He raises his hand and gives you his blessing. A rare gift!' }], else: [] },
          ],
          goto: 'colossus02_outcome',
        },
        failure: {
          text: 'Your story falls apart. His eyes go cold. "The temple will need... payment."',
          effects: [{ kind: 'gold', delta: -30 }, { kind: 'flag', id: 'inquisitor_debt', set: 1 }],
          goto: 'colossus02_outcome',
        },
      },
    },
  ],
}

const colossus02_outcome: StoryCard = {
  id: 'colossus02_outcome',
  title: 'The Judgment',
  onEnter: [
    { kind: 'grantBoon', boon: 'inquisitor_grace' },
    { kind: 'reckoning' },
    { kind: 'advancePhase', to: 'recovery' },
    ...enterChapter(3),
    { kind: 'queueCard', card: 'wanted_poster' },
    { kind: 'narrate', text: 'The Inquisitor rises. "You are no saint, and no monster," he says. "Just a merchant, doing your best. Go, and do better." Then he is gone, leaving only the smell of incense.' },
  ],
  body: [
    'You step out of the temple, blinking in the daylight. Your ventures were taken as payment, and your wages are halved. But you made it through.',
    'And you have the Inquisitor\'s grace. In Vessarin, that is worth more than gold.',
  ],
  choices: [{ id: 'continue', label: 'Start again, wiser', effects: [] }],
}

export const colossus02Cards: StoryCard[] = [
  colossus02_start,
  colossus02_trial_charm,
  colossus02_trial_savvy,
  colossus02_outcome,
]
