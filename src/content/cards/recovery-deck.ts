import type { StoryCard } from '../../engine/types'

// Recovery phase deck: entirely new opportunities, challenges, and NPCs
// These replace the climbing phase deck during recovery

const rebuilding_investor: StoryCard = {
  id: 'rebuilding_investor',
  weight: 4,
  storyPhase: 'recovery',
  title: 'A Patient Investor',
  body: [
    'An investor approaches you with a curious proposal. "You\'ve survived something. That means you have something worth investing in. What do you need to rebuild?"',
  ],
  choices: [
    {
      id: 'accept_investment',
      label: 'Accept investment (get 200g, owe 30/month)',
      effects: [
        { kind: 'gold', delta: 200 },
        { kind: 'loan', principal: 200, monthlyPayment: 30 },
        { kind: 'narrate', text: 'Capital flows in. With it comes hope.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'refuse_investor',
      label: 'Rebuild alone',
      effects: [{ kind: 'narrate', text: 'You choose independence over speed.' }],
    },
  ],
}

const black_market_contact: StoryCard = {
  id: 'black_market_contact',
  weight: 4,
  storyPhase: 'recovery',
  title: 'The Black Market Offers',
  body: [
    'A contact from the underground markets finds you. "The old systems are broken. The new ones haven\'t solidified. Right now, we operate in the cracks. You could too—if you\'re willing."',
  ],
  choices: [
    {
      id: 'black_market_partnership',
      label: 'Partner with black market (Nerve check, DC 12)',
      check: {
        stat: 'nerve',
        dc: 12,
        success: {
          text: 'You move between legal and illegal seamlessly. Profit flows from both worlds.',
          effects: [
            { kind: 'wages', delta: 25 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'flag', id: 'black_market_partner', set: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
        failure: {
          text: 'You\'re not cut out for this world. They sense it and move on.',
          effects: [{ kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'stay_legitimate',
      label: 'Stay legitimate',
      effects: [{ kind: 'narrate', text: 'You choose the harder path: rebuilding legally.' }],
    },
  ],
}

const skilled_refugee: StoryCard = {
  id: 'skilled_refugee',
  weight: 4,
  storyPhase: 'recovery',
  title: 'A Master Craftsperson',
  body: [
    'A refugee with rare skills seeks work. They were a master before displacement. "I can work. I can create value. All I need is a chance."',
  ],
  choices: [
    {
      id: 'hire_craftsperson',
      label: 'Hire and train them (-50 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 50 }],
      effects: [
        { kind: 'gold', delta: -50 },
        { kind: 'wages', delta: 20 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'skilled_workers', set: 1 },
        { kind: 'narrate', text: 'A new partnership begins. They work with hunger and skill.' },
        { kind: 'advanceDays', days: 4 },
      ],
    },
    {
      id: 'decline_craftsperson',
      label: 'You cannot afford it',
      effects: [{ kind: 'narrate', text: 'They move on to find another patron.' }],
    },
  ],
}

const political_opportunity: StoryCard = {
  id: 'political_opportunity',
  weight: 4,
  storyPhase: 'recovery',
  title: 'A Political Rising',
  body: [
    'The old order is fractured. New powers are consolidating. A politician approaches: "The city needs merchants who remember the old ways but embrace the new. Help me rebuild governance, and you\'ll profit handsomely."',
  ],
  choices: [
    {
      id: 'support_politician',
      label: 'Support their rise (Charm check, DC 13)',
      check: {
        stat: 'charm',
        dc: 13,
        success: {
          text: 'You become close to power. Contracts flow. Barriers dissolve.',
          effects: [
            { kind: 'wages', delta: 30 },
            { kind: 'stat', stat: 'charm', delta: 1 },
            { kind: 'flag', id: 'political_ally', set: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
        failure: {
          text: 'Your support proves insufficient. The politician\'s rival wins. You\'ve made an enemy.',
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
      effects: [{ kind: 'narrate', text: 'You focus on rebuilding your trade, not the city\'s governance.' }],
    },
  ],
}

const salvage_opportunity: StoryCard = {
  id: 'salvage_opportunity',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Salvage from the Ruins',
  body: [
    'The colossus left wreckage. Merchants\' warehouses destroyed, assets scattered. Salvage teams are picking through the ruins. "There\'s gold in this wreckage if you\'re willing to get your hands dirty."',
  ],
  choices: [
    {
      id: 'lead_salvage',
      label: 'Lead a salvage operation (-80 gold investment)',
      requires: [{ kind: 'goldAtLeast', amount: 80 }],
      check: {
        stat: 'grit',
        dc: 13,
        success: {
          text: 'You unearth valuable goods worth nearly twice your investment.',
          effects: [
            { kind: 'gold', delta: 150 },
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
        failure: {
          text: 'The salvage yields less than expected. You break even at best.',
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
  title: 'Secrets Are Worth Gold',
  body: [
    'Information is currency in a broken city. A broker approaches: "People will pay for knowledge. Contracts, movements, alliances. I collect information. You could help—and profit."',
  ],
  choices: [
    {
      id: 'become_informant',
      label: 'Gather intelligence (Savvy check, DC 12)',
      check: {
        stat: 'savvy',
        dc: 12,
        success: {
          text: 'You become a node in the information network. Knowledge and gold flow through you.',
          effects: [
            { kind: 'gold', delta: 100 },
            { kind: 'stat', stat: 'savvy', delta: 1 },
            { kind: 'flag', id: 'information_broker', set: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
        failure: {
          text: 'You gather poor intelligence. The broker is unimpressed.',
          effects: [{ kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'avoid_information',
      label: 'Knowledge is too dangerous',
      effects: [{ kind: 'narrate', text: 'You prefer to trade in goods, not secrets.' }],
    },
  ],
}

const artisan_collective: StoryCard = {
  id: 'artisan_collective',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Artisans United',
  body: [
    'Displaced craftspeople are forming collectives. "Together we\'re strong. Alone we\'re obsolete. Join us, and we build something new."',
  ],
  choices: [
    {
      id: 'join_collective',
      label: 'Invest in the collective (-100 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'acquireAsset', asset: { id: 'artisan_collective_share', label: 'Artisan Collective Share', cost: 100, monthlyCashflow: 18, sector: 'craft' } },
        { kind: 'flag', id: 'collective_member', set: 1 },
        { kind: 'narrate', text: 'You become part of something larger than yourself.' },
        { kind: 'advanceDays', days: 4 },
      ],
    },
    {
      id: 'avoid_collective',
      label: 'You prefer to work alone',
      effects: [{ kind: 'narrate', text: 'Independence has its costs.' }],
    },
  ],
}

const city_relief_effort: StoryCard = {
  id: 'city_relief_effort',
  weight: 4,
  storyPhase: 'recovery',
  title: 'The City Rebuilds',
  body: [
    'The city is organizing relief efforts. They\'re looking for merchants to supply food, shelter, medicine. "Help us rebuild, and you\'ll be remembered when the city remembers itself."',
  ],
  choices: [
    {
      id: 'major_relief_effort',
      label: 'Major contribution (-150 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 150 }],
      effects: [
        { kind: 'gold', delta: -150 },
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'flag', id: 'city_hero', set: 1 },
        { kind: 'narrate', text: 'Your name becomes synonymous with the city\'s recovery.' },
        { kind: 'advanceDays', days: 8 },
      ],
    },
    {
      id: 'small_relief_effort',
      label: 'Small contribution (-30 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 30 }],
      effects: [
        { kind: 'gold', delta: -30 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'Every bit helps.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'no_relief',
      label: 'Focus on your own recovery',
      effects: [{ kind: 'narrate', text: 'You rebuild in silence.' }],
    },
  ],
}

const old_guild_faction: StoryCard = {
  id: 'old_guild_faction',
  weight: 4,
  storyPhase: 'recovery',
  title: 'The Old Guard Resists',
  body: [
    'The old guild faction refuses to accept the new order. They\'re plotting to restore the way things were. "We need merchants with spine. Join us, and we\'ll reclaim what\'s ours."',
  ],
  choices: [
    {
      id: 'join_old_guard',
      label: 'Join the restoration effort (Grit check, DC 14)',
      check: {
        stat: 'grit',
        dc: 14,
        success: {
          text: 'You become a leader in the resistance. Gold and power flow to those who lead.',
          effects: [
            { kind: 'gold', delta: 120 },
            { kind: 'stat', stat: 'grit', delta: 2 },
            { kind: 'flag', id: 'old_guard_leader', set: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
        failure: {
          text: 'You\'re not ruthless enough for their cause. They see you as weak.',
          effects: [
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'advanceDays', days: 3 },
          ],
        },
      },
    },
    {
      id: 'avoid_old_guard',
      label: 'The past is past',
      effects: [{ kind: 'narrate', text: 'You focus forward, not backward.' }],
    },
  ],
}

const debt_collector: StoryCard = {
  id: 'debt_collector',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Debts Come Due',
  body: [
    'A debt collector arrives. "You owe money from before the chaos. The creditors remember. They want their gold back—with interest."',
  ],
  choices: [
    {
      id: 'pay_debt_full',
      label: 'Pay the full debt (-100 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'flag', id: 'debt_cleared', set: 1 },
        { kind: 'narrate', text: 'You clear the past. Freedom has a price.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'negotiate_debt',
      label: 'Negotiate a settlement (Charm check, DC 13)',
      check: {
        stat: 'charm',
        dc: 13,
        success: {
          text: 'The collector agrees to reduce the debt by half. You pay -50g and move on.',
          effects: [
            { kind: 'gold', delta: -50 },
            { kind: 'flag', id: 'debt_negotiated', set: 1 },
            { kind: 'advanceDays', days: 3 },
          ],
        },
        failure: {
          text: 'They demand the full amount. You have no choice.',
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
