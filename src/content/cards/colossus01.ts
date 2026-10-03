import type { StoryCard } from '../../engine/types'
import { enterChapter } from './factories'

const colossus01_start: StoryCard = {
  id: 'colossus01_start',
  title: 'The First Reckoning',
  body: [
    'Your passive income has outpaced your expenses for weeks now. Freedom is close—you can feel it. But the city does not surrender its power so easily.',
    'It notices you. The Ledger-Wyrm rises from the vaults beneath the guild towers - not a creature, but a force. It is the accumulated weight of every debt, every tax, every obligation you owe to the systems that govern Vessarin.',
    'This is the first of seven trials. Seven Colossi stand between you and true freedom. Each represents a force you must overcome: not monsters, but the consequences of your own choices and the city\'s judgment upon you.',
    'The Ledger-Wyrm embodies fiscal accountability. It will examine every transaction, every asset, every gold piece. You must either prove your books are perfect, or accept punishment. There is no hiding.',
    'There is no running from it.',
  ],
  choices: [{ id: 'stand_ground', label: 'Stand your ground', goto: 'colossus01_trial_grit' }],
}

const colossus01_trial_grit: StoryCard = {
  id: 'colossus01_trial_grit',
  title: 'The Weight of Scrutiny',
  body: ['The Wyrm\'s coils are crown inspectors, auditors, men with warrants. They descend on your every ledger at once.'],
  choices: [
    {
      id: 'endure_scrutiny',
      label: 'Endure the scrutiny (Grit check, DC 13)',
      check: {
        stat: 'grit',
        dc: 13,
        success: {
          text: 'You hold your composure through every audit.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_ledger_wyrm', atLeast: 1 }, then: [{ kind: 'narrate', text: 'Your preparation paid off. You remember the old merchant\'s advice and catch a technical error in their own audit. Impressed, the lead auditor nods.' }], else: [] },
          ],
          goto: 'colossus01_trial_savvy',
        },
        failure: {
          text: 'The pressure cracks you. A fine is levied against your future earnings.',
          effects: [{ kind: 'expense', delta: 10 }],
          goto: 'colossus01_trial_savvy',
        },
      },
    },
    {
      id: 'flee_auditors',
      label: 'Flee (moves to next trial)',
      effects: [{ kind: 'narrate', text: 'You abandon your post.' }],
      goto: 'colossus01_outcome',
    },
  ],
}

const colossus01_trial_savvy: StoryCard = {
  id: 'colossus01_trial_savvy',
  title: 'Out-Arguing the Auditors',
  body: ['One inspector remains, certain your books hide something. She will not leave without a confession or a correction.'],
  choices: [
    {
      id: 'argue_books',
      label: 'Argue your books are sound (Savvy check, DC 14)',
      check: {
        stat: 'savvy',
        dc: 14,
        success: {
          text: 'Your ledger is spotless. She has nothing to take.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_ledger_wyrm', atLeast: 1 }, then: [{ kind: 'stat', stat: 'savvy', delta: 1 }, { kind: 'narrate', text: 'Your careful preparation—the knowledge you gained earlier—shines through. She leaves, grudgingly respecting your diligence.' }], else: [] },
          ],
          goto: 'colossus01_outcome',
        },
        failure: {
          text: 'She finds a discrepancy - real or invented, it does not matter now.',
          effects: [{ kind: 'flag', id: 'harsh_reckoning', set: 1 }],
          goto: 'colossus01_outcome',
        },
      },
    },
  ],
}

const colossus01_outcome: StoryCard = {
  id: 'colossus01_outcome',
  title: 'The Reckoning',
  onEnter: [
    { kind: 'grantBoon', boon: 'ledger_wyrm_scale' },
    { kind: 'reckoning' },
    { kind: 'advancePhase', to: 'recovery' },
    ...enterChapter(2),
    { kind: 'queueCard', card: 'mafia_notice' },
    { kind: 'narrate', text: 'The Ledger-Wyrm sinks back into the vaults. Your holdings are stripped to pay for its passing - but you are still standing, and you have earned its scale as a boon.' },
  ],
  body: [
    'You have survived the First Reckoning. Your assets are gone, your wages halved, and the road to freedom starts again - but you are no longer the merchant who arrived at Vessarin with fifty gold and nothing else.',
  ],
  choices: [{ id: 'rebuild', label: 'Rebuild and continue', effects: [] }],
  next: undefined, // Let it draw from pending or random deck
}

export const colossus01Cards: StoryCard[] = [
  colossus01_start,
  colossus01_trial_grit,
  colossus01_trial_savvy,
  colossus01_outcome,
]
