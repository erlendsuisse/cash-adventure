import type { StoryCard } from '../../engine/types'
import { enterChapter } from './factories'

const colossus03_start: StoryCard = {
  id: 'colossus03_start',
  title: 'The Market Turns',
  body: [
    'The sky turns black at noon. Lightning splits the clouds, and a storm no fortune-teller saw coming roars across the harbour.',
    'The third Colossus rises from the sea: the Tide, a giant made of waves, with ships tangled in its hair. Wherever it walks, prices crash and fortunes wash away.',
    'Your ships are swept out to sea. Prices tumble like a house of cards. The market you thought you understood is suddenly a wild, roaring ocean.',
  ],
  choices: [{ id: 'weather_storm', label: 'Face the storm', goto: 'colossus03_trial_nerve' }],
}

const colossus03_trial_nerve: StoryCard = {
  id: 'colossus03_trial_nerve',
  title: 'Sell or Hold?',
  body: [
    'Your broker shouts over the thunder: "Sell! Sell now, before it gets worse!"',
    'Your old advisor whispers: "Hold on. Storms always pass."',
    'Your gold will last 1 week, maybe 2. After that, you must sell everything.',
  ],
  choices: [
    {
      id: 'hold_nerve',
      label: 'Hold your nerve and wait (Nerve check, DC 15)',
      check: {
        stat: 'nerve',
        dc: 15,
        success: {
          text: '3 days pass. The storm breaks, and prices bounce back! You held on while others panicked.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_tide', atLeast: 1 }, then: [{ kind: 'narrate', text: 'The old sailor\'s words echo in your head: never risk it all. Your patience pays off.' }], else: [] },
          ],
          goto: 'colossus03_trial_savvy',
        },
        failure: {
          text: 'The storm gets worse. You panic and sell everything, right at the very bottom.',
          effects: [{ kind: 'gold', delta: -50 }],
          goto: 'colossus03_trial_savvy',
        },
      },
    },
  ],
}

const colossus03_trial_savvy: StoryCard = {
  id: 'colossus03_trial_savvy',
  title: 'A Risky Offer in the Storm',
  body: [
    'The worst has passed, but the market still lurches like a ship at sea.',
    'A spice merchant grabs your arm. "The storm flattened 3 rival warehouses! If we buy everything now, we rule the market. It\'ll cost everything you have left."',
    'Is this your big chance, or a trap?',
  ],
  choices: [
    {
      id: 'read_market',
      label: 'Think it through (Savvy check, DC 16)',
      check: {
        stat: 'savvy',
        dc: 16,
        success: {
          text: 'You spot the trap. One more storm, and you would lose everything. So you risk just a little. Smart!',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_tide', atLeast: 1 }, then: [{ kind: 'stat', stat: 'nerve', delta: 1 }, { kind: 'narrate', text: 'You remember the lesson: never put all your eggs in one basket. You steer through the storm with confidence.' }], else: [] },
          ],
          goto: 'colossus03_outcome',
        },
        failure: {
          text: 'You bet big on a quick recovery. It comes much slower than promised.',
          effects: [{ kind: 'gold', delta: -40 }],
          goto: 'colossus03_outcome',
        },
      },
    },
  ],
}

const colossus03_outcome: StoryCard = {
  id: 'colossus03_outcome',
  title: 'The Tide Recedes',
  onEnter: [
    { kind: 'grantBoon', boon: 'tide_survivor' },
    { kind: 'reckoning' },
    { kind: 'advancePhase', to: 'recovery' },
    ...enterChapter(4),
    { kind: 'queueCard', card: 'war_contracts' },
    { kind: 'narrate', text: 'The Tide sinks back beneath the waves. The sky clears and the gulls return. You are soaked, and poorer, but you are still standing. Against the Tide, that is a victory.' },
  ],
  body: [
    'Weeks pass. The sea grows calm. Many merchants never recover from the storm, but you do.',
    'Now you understand what old traders know: fortune is a tide, not a treasure. You can ride it, but you can never own it.',
  ],
  choices: [{ id: 'rebuild', label: 'Rebuild', effects: [] }],
}

export const colossus03Cards: StoryCard[] = [
  colossus03_start,
  colossus03_trial_nerve,
  colossus03_trial_savvy,
  colossus03_outcome,
]
