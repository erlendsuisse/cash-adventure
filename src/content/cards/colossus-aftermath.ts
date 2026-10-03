import type { StoryCard } from '../../engine/types'

// Consequence cards that appear immediately after Colossus 5, 6, 7

const plague_aftermath: StoryCard = {
  id: 'plague_aftermath',
  weight: 4,
  storyPhase: 'recovery',
  title: 'The City Rebuilds',
  body: [
    'The city is scarred but living. Markets reopen slowly. Trade resumes cautiously.',
    'You are remembered as someone who helped. This reputation opens doors.',
    'Healers approach you offering partnership. The city council wants your counsel. Even your competitors acknowledge your sacrifice.',
  ],
  choices: [
    {
      id: 'become_healer_patron',
      label: 'Fund a healing house (+20g/mo passive, -200g)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'acquireAsset', asset: { id: 'healing_house', label: 'Healing House', cost: 200, monthlyCashflow: 20, sector: 'charity' } },
        { kind: 'narrate', text: 'You build a healing house. It becomes a beacon of hope in the recovering city.' },
      ],
    },
    {
      id: 'stay_humble',
      label: 'Refuse offers, keep your principles',
      effects: [
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'noble_reputation', set: 1 },
      ],
    },
  ],
}

const betrayal_aftermath: StoryCard = {
  id: 'betrayal_aftermath',
  weight: 4,
  storyPhase: 'recovery',
  title: 'New Alliances Form',
  body: [
    'The underworld respects you now. You are not their enemy—you are their equal.',
    'The Syndicate offers partnership. "You understand the game. Work with us, not against us. The profits are beyond measure."',
    'But you also receive discrete offers from the city\'s legitimate power brokers. They want to use your new connections for their own purposes.',
    'You stand at a crossroads: embrace the underworld, or help the city government?',
  ],
  choices: [
    {
      id: 'work_with_syndicate',
      label: 'Partner with the Syndicate (+50g/mo, -50 charm)',
      effects: [
        { kind: 'expense', delta: -50 },
        { kind: 'stat', stat: 'charm', delta: -2 },
        { kind: 'flag', id: 'syndicate_partner', set: 1 },
        { kind: 'narrate', text: 'You become a broker in the grey market. Profitable, but corrosive to your soul.' },
      ],
    },
    {
      id: 'work_with_government',
      label: 'Help the government counter crime (+25g/mo, +charm)',
      effects: [
        { kind: 'wages', delta: 25 },
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'flag', id: 'government_agent', set: 1 },
        { kind: 'narrate', text: 'You become an informant and ally to legitimate power. Dangerous, but redemptive.' },
      ],
    },
  ],
}

const legacy_choice: StoryCard = {
  id: 'legacy_choice',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Your Legacy Begins',
  body: [
    'You have survived every trial. You have faced every Colossus. You have looked into the Mirror and survived.',
    'Now comes the question that matters most: what do you do with what you\'ve built?',
    'You have enough wealth to rest. Enough power to dominate. Enough knowledge to manipulate.',
    'But what will define you when you\'re gone? What will people remember? Not your gold, but what you chose to do with it.',
  ],
  choices: [
    {
      id: 'establish_dynasty',
      label: 'Build a merchant empire for your heirs',
      requires: [{ kind: 'goldAtLeast', amount: 500 }],
      effects: [
        { kind: 'gold', delta: -500 },
        { kind: 'flag', id: 'dynasty_founder', set: 1 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'narrate', text: 'You create an institution that will outlive you. Your name becomes synonymous with merchant excellence.' },
      ],
    },
    {
      id: 'fund_education',
      label: 'Create schools for the poor',
      requires: [{ kind: 'goldAtLeast', amount: 400 }],
      effects: [
        { kind: 'gold', delta: -400 },
        { kind: 'flag', id: 'education_founder', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'narrate', text: 'Generations will be educated because of your choice. Your name becomes a symbol of opportunity.' },
      ],
    },
    {
      id: 'retire_quietly',
      label: 'Retire and live simply',
      effects: [
        { kind: 'flag', id: 'quiet_retirement', set: 1 },
        { kind: 'stat', stat: 'grit', delta: 1 },
        { kind: 'narrate', text: 'You leave it all behind. You discover that peace is worth more than any fortune.' },
      ],
    },
  ],
}

export const colossuAftermath: StoryCard[] = [
  plague_aftermath,
  betrayal_aftermath,
  legacy_choice,
]
