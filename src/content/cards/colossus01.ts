import type { StoryCard } from '../../engine/types'
import { enterChapter } from './factories'

const colossus01_start: StoryCard = {
  id: 'colossus01_start',
  title: 'The First Reckoning',
  body: [
    'For weeks, your ventures have paid more than you spend. Freedom is so close you can taste it. Then the ground begins to shake.',
    'Under the guild towers, the vaults crack open. Out rises the Ledger-Wyrm, a dragon made of old ledgers and unpaid taxes. Its scales are bills. Its breath smells of ink and dust.',
    'This is the first of the 7 Colossi. The Wyrm wants every coin you owe, and it will check every page of your books. There is no hiding from it.',
  ],
  choices: [{ id: 'stand_ground', label: 'Stand your ground', goto: 'colossus01_trial_grit' }],
}

const colossus01_trial_grit: StoryCard = {
  id: 'colossus01_trial_grit',
  title: 'The Wyrm\'s Inspectors',
  body: ['The Wyrm shakes its coils, and out tumble a dozen grey inspectors with quills and magnifying glasses. They swarm over your ledgers, all at once, all day long.'],
  choices: [
    {
      id: 'endure_scrutiny',
      label: 'Keep calm and carry on (Grit check, DC 13)',
      check: {
        stat: 'grit',
        dc: 13,
        success: {
          text: 'Hour after hour, you answer every question. You do not crack.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_ledger_wyrm', atLeast: 1 }, then: [{ kind: 'narrate', text: 'You remember Old Tobias\'s advice and spot a mistake in their own sums! The chief inspector gives you a grudging nod.' }], else: [] },
          ],
          goto: 'colossus01_trial_savvy',
        },
        failure: {
          text: 'The questions never stop, and finally you stumble. They fine you from your future earnings.',
          effects: [{ kind: 'expense', delta: 10 }],
          goto: 'colossus01_trial_savvy',
        },
      },
    },
    {
      id: 'flee_auditors',
      label: 'Run for it (moves to the next trial)',
      effects: [{ kind: 'narrate', text: 'You bolt out the back door. The Wyrm only grins.' }],
      goto: 'colossus01_outcome',
    },
  ],
}

const colossus01_trial_savvy: StoryCard = {
  id: 'colossus01_trial_savvy',
  title: 'The Last Inspector',
  body: ['One inspector stays behind, tapping her quill. "Something is hiding in these books," she says. "And I will find it."'],
  choices: [
    {
      id: 'argue_books',
      label: 'Prove your books are right (Savvy check, DC 14)',
      check: {
        stat: 'savvy',
        dc: 14,
        success: {
          text: 'Line by line, you show her every sum. She has nothing to take.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_ledger_wyrm', atLeast: 1 }, then: [{ kind: 'stat', stat: 'savvy', delta: 1 }, { kind: 'narrate', text: 'All your careful preparation pays off. She snaps her book shut, impressed despite herself.' }], else: [] },
          ],
          goto: 'colossus01_outcome',
        },
        failure: {
          text: 'She jabs her quill at a page. "There!" Real mistake or not, it is enough.',
          effects: [{ kind: 'flag', id: 'harsh_reckoning', set: 1 }],
          goto: 'colossus01_outcome',
        },
      },
    },
  ],
}

const colossus01_outcome: StoryCard = {
  id: 'colossus01_outcome',
  title: 'The Wyrm Sleeps Again',
  onEnter: [
    { kind: 'grantBoon', boon: 'ledger_wyrm_scale' },
    { kind: 'reckoning' },
    { kind: 'advancePhase', to: 'recovery' },
    ...enterChapter(2),
    { kind: 'queueCard', card: 'mafia_notice' },
    { kind: 'narrate', text: 'The Ledger-Wyrm sinks back into its vaults, taking your ventures with it. But you are still standing, and one of its golden scales is yours to keep.' },
  ],
  body: [
    'You survived the first Colossus! Your ventures are gone and your wages are halved, so the climb starts again. But you are not the nervous newcomer who stepped off the boat with 50 gold anymore.',
  ],
  choices: [{ id: 'rebuild', label: 'Start rebuilding', effects: [] }],
  next: undefined, // Let it draw from pending or random deck
}

export const colossus01Cards: StoryCard[] = [
  colossus01_start,
  colossus01_trial_grit,
  colossus01_trial_savvy,
  colossus01_outcome,
]
