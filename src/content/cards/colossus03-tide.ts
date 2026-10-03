import type { StoryCard } from '../../engine/types'
import { enterChapter } from './factories'

const colossus03_start: StoryCard = {
  id: 'colossus03_start',
  title: 'The Market Turns',
  body: [
    'The sky splits open with no warning. A storm that the soothsayers did not predict—could not predict—tears across the harbor.',
    'The Tide is the third Colossus. It is chaos embodied—market collapse, unpredictable fortune, the force that reminds all merchants that they do not control the forces that make them wealthy.',
    'Your merchant fleet sinks in the deep. Sector prices collapse like houses of cards. The market, which you understood, reveals itself to be an ocean—and you, merely a merchant playing at gods.',
    'The Tide cannot be reasoned with. It cannot be negotiated with. It is pure uncertainty, pure risk. You survive by understanding risk itself: what you can protect, what you must abandon, when to hold and when to flee.',
    'Face the storm. Prove you can survive chaos.',
  ],
  choices: [{ id: 'weather_storm', label: 'Face the Storm', goto: 'colossus03_trial_nerve' }],
}

const colossus03_trial_nerve: StoryCard = {
  id: 'colossus03_trial_nerve',
  title: 'Cut the Losses',
  body: [
    'Your broker screams: "Sell! Sell now before prices fall further!"',
    'Your advisor whispers: "Hold. The market always recovers. Weather passes."',
    'Your ledger shows you have enough gold for one week, maybe two, before you must liquidate everything.',
    'The storm rages outside. Every hour, prices drop further. You must decide: gamble that recovery is coming, or accept losses now?',
  ],
  choices: [
    {
      id: 'hold_nerve',
      label: 'Hold your position and trust the recovery (Nerve check, DC 15)',
      check: {
        stat: 'nerve',
        dc: 15,
        success: {
          text: 'Three days pass. The storm breaks. Prices rebound. You held when others panicked.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_tide', atLeast: 1 }, then: [{ kind: 'narrate', text: 'The old sailor\'s wisdom echoes in your mind: never overcommit. You held steadily, and your patience is rewarded.' }], else: [] },
          ],
          goto: 'colossus03_trial_savvy',
        },
        failure: {
          text: 'The storm intensifies. Prices plummet further before recovering. You panic and sell at the bottom.',
          effects: [{ kind: 'gold', delta: -50 }],
          goto: 'colossus03_trial_savvy',
        },
      },
    },
  ],
}

const colossus03_trial_savvy: StoryCard = {
  id: 'colossus03_trial_savvy',
  title: 'Reading the Waters',
  body: [
    'The immediate crisis has passed, but the market remains volatile. Opportunity lurks in chaos—but so does ruin.',
    'A merchant from the spice quarter approaches with a proposition: "The storm has destroyed the warehouses of three competitors. We could corner the market if we act now. It will cost everything you have left."',
    'You must decide: is this the moment to double down, or to rebuild slowly and safely?',
  ],
  choices: [
    {
      id: 'read_market',
      label: 'Analyze the market wisely (Savvy check, DC 16)',
      check: {
        stat: 'savvy',
        dc: 16,
        success: {
          text: 'You see the trap. If you invest everything and another storm comes—you are ruined. Instead, you take a measured position. Smart.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_tide', atLeast: 1 }, then: [{ kind: 'stat', stat: 'nerve', delta: 1 }, { kind: 'narrate', text: 'Your earlier preparation—the diversification strategy you learned—saves you now. You navigate the chaos with confidence.' }], else: [] },
          ],
          goto: 'colossus03_outcome',
        },
        failure: {
          text: 'You misjudge the market. You invest heavily in a recovery that doesn\'t materialize as quickly as promised.',
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
    { kind: 'narrate', text: 'The Tide withdraws as mysteriously as it came. The sky clears. The harbor settles. But you have learned an ancient lesson: the ocean is older than gold, and no merchant truly commands it. You are still alive—scarred, diminished, but alive. That is the only victory the Tide permits.' },
  ],
  body: [
    'Weeks pass. The market stabilizes. Other merchants never recover from the storm, but you do.',
    'You understand now what the old traders knew: fortune is a tide, not a treasure. You ride it. You do not own it.',
  ],
  choices: [{ id: 'rebuild', label: 'Rebuild', effects: [] }],
}

export const colossus03Cards: StoryCard[] = [
  colossus03_start,
  colossus03_trial_nerve,
  colossus03_trial_savvy,
  colossus03_outcome,
]
