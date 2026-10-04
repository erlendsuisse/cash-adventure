import type { StoryCard } from '../../engine/types'

// Consequence cards that appear immediately after Colossus 5, 6, 7

const plague_aftermath: StoryCard = {
  id: 'plague_aftermath',
  // Queue-only: its Colossus outcome plays it; never a random draw.
  storyPhase: 'recovery',
  title: 'The City Rebuilds',
  body: [
    'The city is bruised, but alive. Markets open again, one stall at a time.',
    'People remember that you helped. Doors open for you everywhere.',
    'Healers want you as a partner. The council wants your advice. Even your rivals tip their hats.',
  ],
  choices: [
    {
      id: 'become_healer_patron',
      label: 'Build a healing house (-200g, +20g/month)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'acquireAsset', asset: { id: 'healing_house', label: 'Healing House', cost: 200, monthlyCashflow: 20, sector: 'charity' } },
        { kind: 'narrate', text: 'You build a healing house with a bright blue door. It becomes a place of hope for the whole city.' },
      ],
    },
    {
      id: 'stay_humble',
      label: 'Thank them, and stay independent',
      effects: [
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'noble_reputation', set: 1 },
      ],
    },
  ],
}

const betrayal_aftermath: StoryCard = {
  id: 'betrayal_aftermath',
  // Queue-only: its Colossus outcome plays it; never a random draw.
  storyPhase: 'recovery',
  title: 'New Friends, Old Enemies',
  body: [
    'The underworld respects you now. You are not their enemy. You are their equal.',
    'The Syndicate wants you as a partner. "You know how the game works," says the boss. "Work with us. The profits are enormous."',
    'But the city council wants you too. They want your help to fight crime.',
    'Which side will you choose?',
  ],
  choices: [
    {
      id: 'work_with_syndicate',
      label: 'Join the Syndicate (+50g wages, -2 Charm)',
      effects: [
        { kind: 'wages', delta: 50 },
        { kind: 'stat', stat: 'charm', delta: -2 },
        { kind: 'flag', id: 'syndicate_partner', set: 1 },
        { kind: 'narrate', text: 'You become a Syndicate partner. Rich, but people trust you a little less.' },
      ],
    },
    {
      id: 'work_with_government',
      label: 'Help the council fight crime (+25g/month, +Charm)',
      effects: [
        { kind: 'wages', delta: 25 },
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'flag', id: 'government_agent', set: 1 },
        { kind: 'narrate', text: 'You help the council catch crooks. It is dangerous, but you sleep well at night.' },
      ],
    },
  ],
}

const legacy_choice: StoryCard = {
  id: 'legacy_choice',
  // Queue-only: its Colossus outcome plays it; never a random draw.
  storyPhase: 'recovery',
  title: 'Your Legacy Begins',
  body: [
    'You have faced every Colossus, and looked into the Mirror. You made it.',
    'Now comes the biggest question of all: what will you do with everything you built?',
    'One day, people won\'t remember your gold. They will remember what you did with it.',
  ],
  choices: [
    {
      id: 'establish_dynasty',
      label: 'Build a trading house that lasts',
      requires: [{ kind: 'goldAtLeast', amount: 500 }],
      effects: [
        { kind: 'gold', delta: -500 },
        { kind: 'flag', id: 'dynasty_founder', set: 1 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'narrate', text: 'Your trading house will stand for a hundred years. Your name means fair trade, everywhere.' },
      ],
    },
    {
      id: 'fund_education',
      label: 'Build schools for poor children',
      requires: [{ kind: 'goldAtLeast', amount: 400 }],
      effects: [
        { kind: 'gold', delta: -400 },
        { kind: 'flag', id: 'education_founder', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'narrate', text: 'Thousands of children learn to read and count because of you. Your name means a fresh start.' },
      ],
    },
    {
      id: 'retire_quietly',
      label: 'Retire to a little house by the sea',
      effects: [
        { kind: 'flag', id: 'quiet_retirement', set: 1 },
        { kind: 'stat', stat: 'grit', delta: 1 },
        { kind: 'narrate', text: 'You watch the gulls from your little garden. Peace, it turns out, is worth more than any fortune.' },
      ],
    },
  ],
}

export const colossuAftermath: StoryCard[] = [
  plague_aftermath,
  betrayal_aftermath,
  legacy_choice,
]
