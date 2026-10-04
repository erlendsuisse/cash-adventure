import type { StoryCard } from '../../engine/types'
import { prologueContinues } from './class-openings'

export const prologueCards: StoryCard[] = [
  {
    id: 'prologue',
    title: 'The Port of Vessarin',
    storyPhase: 'early_game',
    // Kept short on purpose: the guide's tour (ui/components/GuideTour) explains the mechanics on screen.
    body: [
      'Gulls scream as your boat bumps against the dock. You step onto the Port of Vessarin with 50 gold and an empty ledger.',
      'Somewhere beyond the guild towers, they say, 7 Colossi sleep. But that is a worry for another day. Right now, you need coin.',
    ],
    // Each hero goes on to their class's own first day (cards/class-openings.ts)
    choices: prologueContinues,
  },
  {
    id: 'job_offer',
    title: 'A Stool at the Counting-House',
    storyPhase: 'early_game',
    body: [
      'A tired clerk peers at you over a mountain of papers. "Can you add up? Then the stool by the window is yours." The pay is small, but it comes every month.',
    ],
    choices: [
      {
        id: 'take_job',
        label: 'Take the job (+40g wages/month, +10g rent/month)',
        effects: [
          { kind: 'wages', delta: 40 },
          { kind: 'expense', delta: 10 },
          { kind: 'advancePhase', to: 'climbing' },
          { kind: 'narrate', text: 'You climb onto the stool. The sums never end, but neither does the pay.' },
        ],
      },
      {
        id: 'skip_job',
        label: "Try your luck on the docks instead",
        effects: [
          { kind: 'advancePhase', to: 'climbing' },
          { kind: 'narrate', text: 'You leave the papers behind and head for the busy, noisy docks.' },
        ],
      },
    ],
  },
]
