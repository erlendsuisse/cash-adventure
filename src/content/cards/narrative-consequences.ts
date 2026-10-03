import type { StoryCard } from '../../engine/types'

// Narrative consequence cards
// These cards carry the consequences of climbing-phase choices into recovery phases
// They make player decisions feel meaningful and persistent

const spice_shortage_followup: StoryCard = {
  id: 'spice_shortage_followup',
  weight: 2,
  storyPhase: 'recovery',
  title: 'The Spice Supply Stabilizes',
  body: [
    'The spice routes have reopened. Supply is returning to normal.',
  ],
  choices: [
    {
      id: 'spice_reputation_profit',
      label: 'Benefit from your greed (was profiting during shortage)',
      requires: [{ kind: 'flag', id: 'profited_spice_shortage', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 100 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'Merchants remember you profited during their crisis. They offer you opportunities—not out of friendship, but respect for ruthlessness.' },
      ],
    },
    {
      id: 'spice_reputation_loyalty',
      label: 'Benefit from your kindness (was helping during shortage)',
      requires: [{ kind: 'flag', id: 'helped_spice_shortage', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 80 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'The merchants you helped during the crisis remember. They send business your way as repayment.' },
      ],
    },
    {
      id: 'spice_neutral_recovery',
      label: 'No reputation consequences',
      effects: [{ kind: 'narrate', text: 'The spice market normalizes. You had no stake in the crisis.' }],
    },
  ],
}

const military_contract_followup: StoryCard = {
  id: 'military_contract_recovery',
  weight: 2,
  storyPhase: 'recovery',
  title: 'Royal Favor',
  body: [
    'Your military iron contracts have been fulfilled. The crown is satisfied.',
  ],
  choices: [
    {
      id: 'military_favor_bonus',
      label: 'Cash in on royal favor (was military supplier)',
      requires: [{ kind: 'flag', id: 'military_supplier', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 150 },
        { kind: 'wages', delta: 30 },
        { kind: 'narrate', text: 'The crown grants you additional contracts. You\'ve become a trusted supplier to the military.' },
      ],
    },
    {
      id: 'no_military_connection',
      label: 'You had no military involvement',
      effects: [{ kind: 'narrate', text: 'The military contracts went to others. You focused on civilian trade.' }],
    },
  ],
}

const contrarian_success: StoryCard = {
  id: 'contrarian_recovery',
  weight: 1,
  storyPhase: 'recovery',
  title: 'The Smart Play',
  body: [
    'Markets have recovered from the panic. Those who bought at the bottom are now wealthy.',
  ],
  choices: [
    {
      id: 'contrarian_windfall',
      label: 'Collect your contrarian profits (was brave during panic)',
      requires: [{ kind: 'flag', id: 'contrarian_investor', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 200 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'narrate', text: 'Your contrarian bet paid off spectacularly. Other merchants ask your advice now.' },
      ],
    },
    {
      id: 'stayed_calm_respect',
      label: 'Earn respect for steadiness (stayed calm during panic)',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'contrarian_investor', atLeast: 1 } }],
      effects: [
        { kind: 'gold', delta: 50 },
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'Your calm during the panic earned respect. Merchants seek your counsel.' },
      ],
    },
  ],
}

const old_mentor_connection: StoryCard = {
  id: 'mentor_legacy',
  weight: 2,
  storyPhase: 'recovery',
  title: 'Mentor\'s Shadow',
  body: [
    'Your mentor\'s influence echoes through the city. Those who knew them remember your association.',
  ],
  choices: [
    {
      id: 'mentor_legacy_bonus',
      label: 'Leverage your mentor\'s legacy (had mentor training)',
      requires: [{ kind: 'flag', id: 'mentor_trader', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 75 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'Doors open because of your mentor\'s name. You\'ve inherited their reputation.' },
      ],
    },
    {
      id: 'no_mentor',
      label: 'You forge your own path',
      effects: [{ kind: 'narrate', text: 'You built your reputation from scratch.' }],
    },
  ],
}

const rival_reckoning: StoryCard = {
  id: 'rival_consequence',
  weight: 2,
  storyPhase: 'recovery',
  title: 'The Rival\'s Gambit',
  body: [
    'Your rival has been making moves during your struggle. The landscape has changed.',
  ],
  choices: [
    {
      id: 'outmaneuvered_rival',
      label: 'You were outmaneuvered',
      requires: [{ kind: 'flag', id: 'ruthless_competitor', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'narrate', text: 'While you recovered, your rival seized your opportunities. You\'ll need to rebuild faster.' },
      ],
    },
    {
      id: 'rival_downfall',
      label: 'Your rival has fallen',
      requires: [{ kind: 'flag', id: 'rival_emerges', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 120 },
        { kind: 'narrate', text: 'Your rival overextended and fell. Their assets are available for acquisition.' },
      ],
    },
    {
      id: 'no_rival',
      label: 'You had no major rival',
      effects: [{ kind: 'narrate', text: 'You competed fairly and had no enemies in trade.' }],
    },
  ],
}

export const narrativeConsequenceCards: StoryCard[] = [
  spice_shortage_followup,
  military_contract_followup,
  contrarian_success,
  old_mentor_connection,
  rival_reckoning,
]
