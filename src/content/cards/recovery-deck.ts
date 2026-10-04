import type { StoryCard } from '../../engine/types'

// Recovery phase deck: entirely new opportunities, challenges, and NPCs
// These replace the climbing phase deck during recovery

const rebuilding_investor: StoryCard = {
  id: 'rebuilding_investor',
  weight: 4,
  storyPhase: 'recovery',
  title: 'A Patient Investor',
  body: [
    'A calm woman in a grey coat finds you among the wreckage. "You survived a Colossus," she says. "That makes you worth betting on. What do you need to rebuild?"',
  ],
  choices: [
    {
      id: 'accept_investment',
      label: 'Take her money (+200g, repay 30g/month)',
      effects: [
        { kind: 'gold', delta: 200 },
        { kind: 'loan', principal: 200, monthlyPayment: 30 },
        { kind: 'narrate', text: 'Gold arrives, and with it, hope.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'refuse_investor',
      label: 'Rebuild on your own',
      effects: [{ kind: 'narrate', text: 'Slower, but all yours. You thank her and get to work.' }],
    },
  ],
}

const black_market_contact: StoryCard = {
  id: 'black_market_contact',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Trading in the Cracks',
  body: [
    'A sly trader leans out of a doorway. "The old rules are broken, and the new ones aren\'t ready," she grins. "Right now, there\'s money in the cracks. Want some?"',
  ],
  choices: [
    {
      id: 'black_market_partnership',
      label: 'Trade in the cracks (Nerve check, DC 12)',
      check: {
        stat: 'nerve',
        dc: 12,
        success: {
          text: 'You slip between honest and shady deals like a cat. Gold flows from both.',
          effects: [
            { kind: 'wages', delta: 25 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'flag', id: 'black_market_partner', set: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
        failure: {
          text: 'Your nerves show. She shakes her head and disappears.',
          effects: [{ kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'stay_legitimate',
      label: 'Stay honest',
      effects: [{ kind: 'narrate', text: 'You choose the harder road: rebuilding honestly.' }],
    },
  ],
}

const skilled_refugee: StoryCard = {
  id: 'skilled_refugee',
  weight: 4,
  storyPhase: 'recovery',
  title: 'A Master Without a Workshop',
  body: [
    'A traveller with clever hands knocks on your door. He was a master clockmaker before he lost his home. "I can make wonderful things," he says. "I just need a chance."',
  ],
  choices: [
    {
      id: 'hire_craftsperson',
      label: 'Give him a chance (-50g)',
      requires: [{ kind: 'goldAtLeast', amount: 50 }],
      effects: [
        { kind: 'gold', delta: -50 },
        { kind: 'wages', delta: 20 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'skilled_workers', set: 1 },
        { kind: 'narrate', text: 'He gets to work with tiny tools and a big smile. A new partnership begins.' },
        { kind: 'advanceDays', days: 4 },
      ],
    },
    {
      id: 'decline_craftsperson',
      label: 'You can\'t afford it right now',
      effects: [{ kind: 'narrate', text: 'He nods sadly and moves on.' }],
    },
  ],
}

const political_opportunity: StoryCard = {
  id: 'political_opportunity',
  weight: 4,
  storyPhase: 'recovery',
  title: 'A Rising Politician',
  body: [
    'A young councillor with big plans shakes your hand. "The city needs merchants who remember the old days but welcome the new. Back me, and you\'ll do very well."',
  ],
  choices: [
    {
      id: 'support_politician',
      label: 'Back the councillor (Charm check, DC 13)',
      check: {
        stat: 'charm',
        dc: 13,
        success: {
          text: 'Your councillor wins! Suddenly, every door opens for you.',
          effects: [
            { kind: 'wages', delta: 30 },
            { kind: 'stat', stat: 'charm', delta: 1 },
            { kind: 'flag', id: 'political_ally', set: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
        failure: {
          text: 'Your councillor loses. The winner remembers whose side you were on.',
          effects: [
            { kind: 'flag', id: 'political_enemy', delta: 1 },
            { kind: 'advanceDays', days: 4 },
          ],
        },
      },
    },
    {
      id: 'stay_neutral_politics',
      label: 'Stay out of politics',
      effects: [{ kind: 'narrate', text: 'You leave the speeches to others and focus on your trade.' }],
    },
  ],
}

const salvage_opportunity: StoryCard = {
  id: 'salvage_opportunity',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Treasure in the Wreckage',
  body: [
    'The Colossus left smashed warehouses everywhere. Salvage crews pick through the rubble. "There\'s treasure in here," says one, "if you don\'t mind dirty hands."',
  ],
  choices: [
    {
      id: 'lead_salvage',
      label: 'Lead a salvage crew (-80g)',
      requires: [{ kind: 'goldAtLeast', amount: 80 }],
      check: {
        stat: 'grit',
        dc: 13,
        success: {
          text: 'You dig up goods worth almost twice what you paid!',
          effects: [
            { kind: 'gold', delta: 150 },
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
        failure: {
          text: 'Mostly broken crates. You barely get your money back.',
          effects: [
            { kind: 'gold', delta: -20 },
            { kind: 'advanceDays', days: 4 },
          ],
        },
      },
    },
    {
      id: 'avoid_salvage',
      label: 'Too risky',
      effects: [{ kind: 'narrate', text: 'You focus on what you can control.' }],
    },
  ],
}

const knowledge_broker: StoryCard = {
  id: 'knowledge_broker',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Secrets for Sale',
  body: [
    'A woman with a notebook full of names smiles at you. "In a city this muddled, people pay well to know things," she says. "Help me gather secrets, and share the profit."',
  ],
  choices: [
    {
      id: 'become_informant',
      label: 'Gather secrets (Savvy check, DC 12)',
      check: {
        stat: 'savvy',
        dc: 12,
        success: {
          text: 'Soon, every secret in town passes through your hands, and so does a lot of gold.',
          effects: [
            { kind: 'gold', delta: 100 },
            { kind: 'stat', stat: 'savvy', delta: 1 },
            { kind: 'flag', id: 'information_broker', set: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
        failure: {
          text: 'Your secrets turn out to be old gossip. She is not impressed.',
          effects: [{ kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'avoid_information',
      label: 'Secrets are too dangerous',
      effects: [{ kind: 'narrate', text: 'You would rather trade in things you can hold.' }],
    },
  ],
}

const artisan_collective: StoryCard = {
  id: 'artisan_collective',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Craftspeople Together',
  body: [
    'Weavers, potters and smiths who lost their workshops are joining together. "Alone we\'re nothing," says a potter. "Together we can build something new. Join us!"',
  ],
  choices: [
    {
      id: 'join_collective',
      label: 'Join them (-100g)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'acquireAsset', asset: { id: 'artisan_collective_share', label: 'Artisan Collective Share', cost: 100, monthlyCashflow: 18, sector: 'craft' } },
        { kind: 'flag', id: 'collective_member', set: 1 },
        { kind: 'narrate', text: 'You become part of something bigger than yourself. It feels good.' },
        { kind: 'advanceDays', days: 4 },
      ],
    },
    {
      id: 'avoid_collective',
      label: 'Work on your own',
      effects: [{ kind: 'narrate', text: 'Going it alone is harder, but it\'s your choice.' }],
    },
  ],
}

const city_relief_effort: StoryCard = {
  id: 'city_relief_effort',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Helping the City Rebuild',
  body: [
    'The city is rebuilding, and it needs food, blankets and medicine. A volunteer with a clipboard asks: "Can you help? People will remember who did."',
  ],
  choices: [
    {
      id: 'major_relief_effort',
      label: 'Give a lot (-150g)',
      requires: [{ kind: 'goldAtLeast', amount: 150 }],
      effects: [
        { kind: 'gold', delta: -150 },
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'flag', id: 'city_hero', set: 1 },
        { kind: 'narrate', text: 'When people talk about how the city came back, they say your name.' },
        { kind: 'advanceDays', days: 8 },
      ],
    },
    {
      id: 'small_relief_effort',
      label: 'Give a little (-30g)',
      requires: [{ kind: 'goldAtLeast', amount: 30 }],
      effects: [
        { kind: 'gold', delta: -30 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'Every little bit helps.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'no_relief',
      label: 'Focus on your own recovery',
      effects: [{ kind: 'narrate', text: 'You quietly rebuild your own business.' }],
    },
  ],
}

const old_guild_faction: StoryCard = {
  id: 'old_guild_faction',
  weight: 4,
  storyPhase: 'recovery',
  title: 'The Old Guard',
  body: [
    'The old guild masters refuse to accept how things have changed. In a dusty hall, they plot to bring the old days back. "Join us," says their leader, "and we\'ll take back what\'s ours."',
  ],
  choices: [
    {
      id: 'join_old_guard',
      label: 'Join the old guard (Grit check, DC 14)',
      check: {
        stat: 'grit',
        dc: 14,
        success: {
          text: 'You become one of their leaders. Gold and power follow.',
          effects: [
            { kind: 'gold', delta: 120 },
            { kind: 'stat', stat: 'grit', delta: 2 },
            { kind: 'flag', id: 'old_guard_leader', set: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
        failure: {
          text: 'They think you\'re too soft for their plans, and show you the door.',
          effects: [
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'advanceDays', days: 3 },
          ],
        },
      },
    },
    {
      id: 'avoid_old_guard',
      label: 'Look forward, not back',
      effects: [{ kind: 'narrate', text: 'The old days are gone. You look ahead.' }],
    },
  ],
}

const debt_collector: StoryCard = {
  id: 'debt_collector',
  weight: 4,
  storyPhase: 'recovery',
  title: 'An Old Debt',
  body: [
    'A collector with a pointy nose taps an old ledger. "You owed money before all the chaos," he sniffs. "My masters want it back. With interest."',
  ],
  choices: [
    {
      id: 'pay_debt_full',
      label: 'Pay it all (-100g)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'flag', id: 'debt_cleared', set: 1 },
        { kind: 'narrate', text: 'Your old debt is cleared. The past is behind you.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'negotiate_debt',
      label: 'Bargain him down (Charm check, DC 13)',
      check: {
        stat: 'charm',
        dc: 13,
        success: {
          text: 'He sighs and agrees to half. You pay 50 gold and move on.',
          effects: [
            { kind: 'gold', delta: -50 },
            { kind: 'flag', id: 'debt_negotiated', set: 1 },
            { kind: 'advanceDays', days: 3 },
          ],
        },
        failure: {
          text: 'He won\'t budge. You pay the full amount.',
          effects: [
            { kind: 'gold', delta: -100 },
            { kind: 'advanceDays', days: 2 },
          ],
        },
      },
    },
  ],
}

export const recoveryDeckCards: StoryCard[] = [
  rebuilding_investor,
  black_market_contact,
  skilled_refugee,
  political_opportunity,
  salvage_opportunity,
  knowledge_broker,
  artisan_collective,
  city_relief_effort,
  old_guild_faction,
  debt_collector,
]
