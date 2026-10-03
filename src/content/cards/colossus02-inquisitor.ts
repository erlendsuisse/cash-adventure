import type { StoryCard } from '../../engine/types'

const colossus02_start: StoryCard = {
  id: 'colossus02_start',
  title: 'The Inquisitor Arrives',
  body: [
    'Shadows lengthen in the market square. The temple bells toll wrongly—not the hour, but a summons.',
    'The Inquisitor steps from the fog. This is the second Colossus. Where the Ledger-Wyrm examines your books, the Inquisitor examines your soul. He is not a mortal bureaucrat—his eyes see into the deepest recesses of conscience.',
    'He has come because a whisper reached the temple—that you have made compromises, kept secrets, dealt with the forbidden. The faithful are uneasy. The Inquisitor seeks judgment not just upon your actions, but upon your moral character.',
    'The Inquisitor does not arrest. He judges. And judgment, in Vessarin, is permanent. You will either prove yourself absolved of sin, or accept the weight of penance for all your days.',
    'Stand before him. The trial of conscience begins.',
  ],
  choices: [{ id: 'face_judgment', label: 'Submit to the Judgment', goto: 'colossus02_trial_charm' }],
}

const colossus02_trial_charm: StoryCard = {
  id: 'colossus02_trial_charm',
  title: 'The Charm of Innocence',
  body: [
    'The Inquisitor sits across from you in the temple chamber, candlelight flickering between you. He asks of your dealings, your partnerships, your midnight transactions.',
    '"Convince me," he says, "that your gold was earned with a clean conscience."',
  ],
  choices: [
    {
      id: 'convince_innocence',
      label: 'Persuade him of your purity (Charm check, DC 14)',
      check: {
        stat: 'charm',
        dc: 14,
        success: {
          text: 'Your words ring true. The Inquisitor nods slowly, doubt flickering in his eyes.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_inquisitor', atLeast: 1 }, then: [{ kind: 'narrate', text: 'Your honesty cuts deep—you remember the priestess\'s words. "An honest heart," the Inquisitor muses, seeing through pretense to genuine remorse.' }], else: [] },
          ],
          goto: 'colossus02_trial_savvy',
        },
        failure: {
          text: 'He sees through you. A sin confessed is a sin halved—but the price of concealment is dear.',
          effects: [{ kind: 'gold', delta: -20 }],
          goto: 'colossus02_trial_savvy',
        },
      },
    },
  ],
}

const colossus02_trial_savvy: StoryCard = {
  id: 'colossus02_trial_savvy',
  title: 'The Ledger of Truth',
  body: [
    'The Inquisitor opens a ledger—not his, but one of your own accounting that somehow came into his hands.',
    '"These entries are curious," he murmurs. "Entries that do not match your guild filings. Goods listed under false names. Payments to people who do not officially exist."',
    'He looks up. "Explain this discrepancy. Is it error, or intent?"',
  ],
  choices: [
    {
      id: 'defend_ledgers',
      label: 'Argue the ledger is forged or misread (Savvy check, DC 15)',
      check: {
        stat: 'savvy',
        dc: 15,
        success: {
          text: 'You dissect the ledger line by line, finding inconsistencies in the handwriting, errors in the sums. The Inquisitor\'s confidence wavers.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_inquisitor', atLeast: 1 }, then: [{ kind: 'stat', stat: 'charm', delta: 1 }, { kind: 'narrate', text: 'Your self-awareness and preparation impress even the Inquisitor. He grants you his blessing—a rare gift.' }], else: [] },
          ],
          goto: 'colossus02_outcome',
        },
        failure: {
          text: 'Your defense crumbles under scrutiny. The Inquisitor\'s eyes harden. The church will need... reparations.',
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
    { kind: 'queueCard', card: 'wanted_poster' },
    { kind: 'narrate', text: 'The Inquisitor rises. "You are neither saint nor monster," he says. "You are merely human, with a human\'s appetites and a human\'s desperate compromises. The temple forgives you—but not without cost. Go, and sin less." He disappears as mysteriously as he came, leaving only the scent of incense.' },
  ],
  body: [
    'You emerge from the temple chamber changed. Your assets have been seized as penance, your wages are halved by tithe obligations, but you live.',
    'More importantly: you have the Inquisitor\'s grace. In Vessarin, that is worth more than gold.',
  ],
  choices: [{ id: 'continue', label: 'Continue', effects: [] }],
}

export const colossus02Cards: StoryCard[] = [
  colossus02_start,
  colossus02_trial_charm,
  colossus02_trial_savvy,
  colossus02_outcome,
]
