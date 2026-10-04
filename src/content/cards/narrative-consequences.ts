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
    'The spice ships are sailing again. Prices settle down, and people remember how everyone behaved during the shortage.',
  ],
  choices: [
    {
      id: 'spice_reputation_profit',
      label: 'Profit from your reputation (you sold high in the shortage)',
      requires: [{ kind: 'flag', id: 'profited_spice_shortage', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 100 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'Merchants remember how much you made. They don\'t like you, but they respect you, and bring you deals.' },
      ],
    },
    {
      id: 'spice_reputation_loyalty',
      label: 'Be repaid for your kindness (you helped in the shortage)',
      requires: [{ kind: 'flag', id: 'helped_spice_shortage', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 80 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'The merchants you helped remember. They send customers your way to say thank you.' },
      ],
    },
    {
      id: 'spice_neutral_recovery',
      label: 'You stayed out of it',
      effects: [{ kind: 'narrate', text: 'The spice market calms down. You weren\'t involved either way.' }],
    },
  ],
}

const military_contract_followup: StoryCard = {
  id: 'military_contract_recovery',
  weight: 2,
  storyPhase: 'recovery',
  title: 'Royal Favor',
  body: [
    'The army has all the iron it ordered, and the crown is very pleased.',
  ],
  choices: [
    {
      id: 'military_favor_bonus',
      label: 'Enjoy the crown\'s favour (you supplied the army)',
      requires: [{ kind: 'flag', id: 'military_supplier', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 150 },
        { kind: 'wages', delta: 30 },
        { kind: 'narrate', text: 'The crown sends you more orders. You are now the army\'s trusted supplier.' },
      ],
    },
    {
      id: 'no_military_connection',
      label: 'You didn\'t supply the army',
      effects: [{ kind: 'narrate', text: 'The army\'s orders went to others. You stuck to ordinary trade.' }],
    },
  ],
}

const contrarian_success: StoryCard = {
  id: 'contrarian_recovery',
  weight: 1,
  storyPhase: 'recovery',
  title: 'Brave When Others Panicked',
  body: [
    'The market has bounced back. Those who bought when everyone else was selling are now rich.',
  ],
  choices: [
    {
      id: 'contrarian_windfall',
      label: 'Collect your reward (you bought in the panic)',
      requires: [{ kind: 'flag', id: 'contrarian_investor', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 200 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'narrate', text: 'Your brave bet paid off brilliantly. Now other merchants ask for your advice.' },
      ],
    },
    {
      id: 'stayed_calm_respect',
      label: 'Earn respect (you stayed calm in the panic)',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'contrarian_investor', atLeast: 1 } }],
      effects: [
        { kind: 'gold', delta: 50 },
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'People remember how calm you stayed. They come to you for advice.' },
      ],
    },
  ],
}

const old_mentor_connection: StoryCard = {
  id: 'mentor_legacy',
  weight: 2,
  storyPhase: 'recovery',
  title: 'Your Teacher\'s Good Name',
  body: [
    'Your old teacher is famous in Vessarin, and people remember you were their student.',
  ],
  choices: [
    {
      id: 'mentor_legacy_bonus',
      label: 'Use your teacher\'s good name (you had a mentor)',
      requires: [{ kind: 'flag', id: 'mentor_trader', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 75 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'Doors open when you mention your teacher. Their good name is now yours too.' },
      ],
    },
    {
      id: 'no_mentor',
      label: 'You made your own way',
      effects: [{ kind: 'narrate', text: 'You built your name all by yourself.' }],
    },
  ],
}

const rival_reckoning: StoryCard = {
  id: 'rival_consequence',
  weight: 2,
  storyPhase: 'recovery',
  title: 'What Your Rival Did',
  body: [
    'While you struggled, your rival was busy. Things have changed.',
  ],
  choices: [
    {
      id: 'outmaneuvered_rival',
      label: 'Your rival got ahead of you',
      requires: [{ kind: 'flag', id: 'ruthless_competitor', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'narrate', text: 'While you recovered, your rival grabbed your chances. Time to rebuild faster.' },
      ],
    },
    {
      id: 'rival_downfall',
      label: 'Your rival fell flat',
      requires: [{ kind: 'flag', id: 'rival_emerges', atLeast: 1 }],
      effects: [
        { kind: 'gold', delta: 120 },
        { kind: 'narrate', text: 'Your rival grabbed too much and fell. Now their business is up for sale.' },
      ],
    },
    {
      id: 'no_rival',
      label: 'You had no real rival',
      effects: [{ kind: 'narrate', text: 'You played fair and made no enemies.' }],
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
