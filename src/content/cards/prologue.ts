import type { StoryCard } from '../../engine/types'

export const prologueCards: StoryCard[] = [
  {
    id: 'prologue',
    title: 'The Port of Vessarin',
    storyPhase: 'early_game',
    // Kept short on purpose: the guide's tour (ui/components/GuideTour) explains the mechanics on screen.
    body: [
      'You arrive at the Port of Vessarin with 50 gold and a merchant\'s ledger.',
      'Somewhere beyond the guild towers, 7 Colossi are said to sleep. For now, you just need coin.',
    ],
    choices: [],
    next: 'job_offer',
  },
  {
    id: 'job_offer',
    title: 'A Counting-House Job',
    storyPhase: 'early_game',
    body: [
      'A clerk at the counting-house offers you a stool and a stack of tallies. The pay is thin, but it is pay.',
    ],
    choices: [
      {
        id: 'take_job',
        label: 'Take the clerk\'s job (+40 gold wages/mo, +10 lodging expense/mo)',
        effects: [
          { kind: 'wages', delta: 40 },
          { kind: 'expense', delta: 10 },
          { kind: 'advancePhase', to: 'climbing' },
          { kind: 'narrate', text: 'You take the stool. The tallies never end, but neither does the pay.' },
        ],
      },
      {
        id: 'skip_job',
        label: "Skip the job and chance the docks for opportunity",
        effects: [
          { kind: 'advancePhase', to: 'climbing' },
          { kind: 'narrate', text: 'You leave the counting-house behind and walk the docks instead.' },
        ],
      },
    ],
  },
]
