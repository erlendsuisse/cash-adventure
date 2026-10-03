import type { StoryCard } from '../../engine/types'

// CHAPTER 3 EXPANDED: Warfare & Conflict
// War profiteering, military ventures, refugee economies, supply chains, military politics, escape routes

export const chapter3MilitaryVentureCards: StoryCard[] = [
  {
    id: 'ch3_weapons_smuggling',
    chapter: 3,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Weapons Smuggling Operation',
    body: ['A black market weapons dealer needs distribution. "Both armies need supplies they can\'t get officially. We supply both sides. 350g investment."'],
    choices: [
      {
        id: 'smuggle_weapons',
        label: 'Start weapons smuggling (350g)',
        requires: [{ kind: 'goldAtLeast', amount: 350 }],
        effects: [
          { kind: 'gold', delta: -350 },
          { kind: 'acquireAsset', asset: { id: 'ch3_weapons_smuggle', label: 'Weapons Smuggling Network', cost: 350, monthlyCashflow: 120, sector: 'military' } },
          { kind: 'flag', id: 'arms_dealer', set: 1 },
          { kind: 'narrate', text: 'You smuggle weapons to both sides. Profit from bloodshed.' },
        ],
      },
      { id: 'refuse_weapons', label: 'Decline', effects: [{ kind: 'narrate', text: 'The dealer finds another distributor.' }] },
    ],
  },
  {
    id: 'ch3_medical_supplies_smuggle',
    chapter: 3,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Medical Supply Operation',
    body: ['A healer offers to sell medical supplies to both armies. "They pay premium prices. We profit from their desperation to save wounded soldiers."'],
    choices: [
      {
        id: 'sell_medical',
        label: 'Sell medical supplies (280g)',
        requires: [{ kind: 'goldAtLeast', amount: 280 }],
        effects: [
          { kind: 'gold', delta: -280 },
          { kind: 'acquireAsset', asset: { id: 'ch3_medical_supplies', label: 'Military Medical Supply Network', cost: 280, monthlyCashflow: 85, sector: 'military' } },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'You save lives for a profit. Money and morality intertwine.' },
        ],
      },
      { id: 'refuse_medical', label: 'Decline', effects: [{ kind: 'narrate', text: 'Someone else will profit from necessity.' }] },
    ],
  },
  {
    id: 'ch3_military_food_contract',
    chapter: 3,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Military Food Supply Contract',
    body: ['The army quartermaster offers a standing contract. "Soldiers eat even during war. Consistent demand, consistent payment. 320g advance."'],
    choices: [
      {
        id: 'food_contract',
        label: 'Accept food contract (320g)',
        requires: [{ kind: 'goldAtLeast', amount: 320 }],
        effects: [
          { kind: 'gold', delta: -320 },
          { kind: 'acquireAsset', asset: { id: 'ch3_food_supplier', label: 'Military Food Supplier', cost: 320, monthlyCashflow: 95, sector: 'military' } },
          { kind: 'narrate', text: 'You feed the army. Steady money from hunger.' },
        ],
      },
      { id: 'refuse_food', label: 'Decline', effects: [{ kind: 'narrate', text: 'They find another supplier.' }] },
    ],
  },
  {
    id: 'ch3_intelligence_selling',
    chapter: 3,
    weight: 2,
    storyPhase: 'reckoning',
    title: 'Sell Military Intelligence',
    body: ['Spies want to buy intelligence from you. "You move around. You hear things. We pay well for information."'],
    choices: [
      {
        id: 'sell_intelligence',
        label: 'Become an intelligence broker (290g setup)',
        requires: [{ kind: 'goldAtLeast', amount: 290 }],
        effects: [
          { kind: 'gold', delta: -290 },
          { kind: 'acquireAsset', asset: { id: 'ch3_intel_broker', label: 'Military Intelligence Broker', cost: 290, monthlyCashflow: 70, sector: 'military' } },
          { kind: 'flag', id: 'spy_network', set: 1 },
          { kind: 'narrate', text: 'Information is your new trade. Lives depend on your accuracy.' },
        ],
      },
      { id: 'refuse_intel', label: 'Decline', effects: [{ kind: 'narrate', text: 'The spies move on.' }] },
    ],
  },
  {
    id: 'ch3_transport_logistics',
    chapter: 3,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Military Transport Service',
    body: ['The army needs civilians to move supplies between bases. "Safe work. Good pay. 310g to get established."'],
    choices: [
      {
        id: 'transport_service',
        label: 'Start transport service (310g)',
        requires: [{ kind: 'goldAtLeast', amount: 310 }],
        effects: [
          { kind: 'gold', delta: -310 },
          { kind: 'acquireAsset', asset: { id: 'ch3_transport', label: 'Military Transport Service', cost: 310, monthlyCashflow: 80, sector: 'military' } },
          { kind: 'narrate', text: 'You move the gears of war. Safe money from logistics.' },
        ],
      },
      { id: 'refuse_transport', label: 'Decline', effects: [{ kind: 'narrate', text: 'They find another transporter.' }] },
    ],
  },
]

export const chapter3WarScenarioCards: StoryCard[] = [
  {
    id: 'ch3_soldier_deserter',
    chapter: 3,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'A Deserting Soldier Seeks Your Help',
    body: ['A young soldier, fleeing the war, finds you. "I can\'t kill anymore. Will you help me escape? I have 60g."'],
    choices: [
      {
        id: 'help_deserter',
        label: 'Help them escape',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'flag', id: 'soldier_helped', set: 1 },
          { kind: 'narrate', text: 'You help them disappear. One less killer, one more refugee.' },
        ],
      },
      {
        id: 'turn_in_deserter',
        label: 'Turn them in to authorities (+150g reward)',
        effects: [
          { kind: 'gold', delta: 150 },
          { kind: 'stat', stat: 'charm', delta: -2 },
          { kind: 'flag', id: 'deserter_informant', set: 1 },
          { kind: 'narrate', text: 'You profit from their death. The authorities thank you.' },
        ],
      },
    ],
  },
  {
    id: 'ch3_refugee_family_encounter',
    chapter: 3,
    weight: 2,
    storyPhase: 'reckoning',
    title: 'Refugee Family Needs Shelter',
    body: ['A family of refugees seeks shelter from the war. "We have 30g. Will that buy us safety?"'],
    choices: [
      {
        id: 'shelter_refugees',
        label: 'Give them shelter for free',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'flag', id: 'refugee_harborer', set: 1 },
          { kind: 'narrate', text: 'You save a family. In war, that is an act of rebellion.' },
        ],
      },
      {
        id: 'exploit_refugees',
        label: 'Shelter them, demand 80g total',
        requires: [{ kind: 'goldAtLeast', amount: 50 }],
        effects: [
          { kind: 'gold', delta: 80 },
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'narrate', text: 'You profit from their desperation. They survive, but barely.' },
        ],
      },
    ],
  },
  {
    id: 'ch3_officer_proposition',
    chapter: 3,
    weight: 2,
    storyPhase: 'reckoning',
    title: 'Military Officer Proposition',
    body: ['A high-ranking officer approaches. "I\'m planning to desert with my regiment\'s treasury. Need a trustworthy partner to hide the gold."'],
    choices: [
      {
        id: 'help_officer',
        label: 'Partner with the officer',
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'flag', id: 'officer_partner', set: 1 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'You help steal from an army. The risk is enormous. So is the reward.' },
        ],
      },
      {
        id: 'refuse_officer',
        label: 'Refuse',
        effects: [{ kind: 'narrate', text: 'The officer leaves, insulted. You\'ve made a powerful enemy.' }],
      },
    ],
  },
  {
    id: 'ch3_battle_witness',
    chapter: 3,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'You Witness a Battle',
    body: ['You see a major battle play out—thousands dying. The winning general approaches. "You saw what happened here. What will you tell people?"'],
    choices: [
      {
        id: 'tell_truth',
        label: 'Tell the truth',
        effects: [
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'flag', id: 'truth_teller', set: 1 },
          { kind: 'narrate', text: 'You testify to the carnage. The general is displeased.' },
        ],
      },
      {
        id: 'tell_propaganda',
        label: 'Spread propaganda (+120g)',
        effects: [
          { kind: 'gold', delta: 120 },
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'flag', id: 'propaganda_spreader', set: 1 },
          { kind: 'narrate', text: 'You lie for profit. The truth becomes whatever the general wants.' },
        ],
      },
    ],
  },
]

export const chapter3WarEconomyCards: StoryCard[] = [
  {
    id: 'ch3_armistice_threat',
    chapter: 3,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Peace Threatens Your Profits',
    body: ['Rumors of armistice talks spread. War profits will evaporate if peace comes. What do you do?'],
    choices: [
      {
        id: 'liquidate_assets',
        label: 'Liquidate war assets (+300g)',
        effects: [
          { kind: 'gold', delta: 300 },
          { kind: 'narrate', text: 'You cash out before peace kills the market. Smart, but cynical.' },
        ],
      },
      {
        id: 'sabotage_peace',
        label: 'Fund peace sabotage (-180g)',
        requires: [{ kind: 'goldAtLeast', amount: 180 }],
        effects: [
          { kind: 'gold', delta: -180 },
          { kind: 'flag', id: 'war_profiteer', set: 1 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'You fund extremists to keep the war going. More deaths. More profit.' },
        ],
      },
    ],
  },
  {
    id: 'ch3_enemy_territory_trade',
    chapter: 3,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Smuggle to Enemy Territory',
    body: ['Both sides need goods the other side has. You could smuggle contraband across enemy lines for huge profit. (+220g for one run)'],
    choices: [
      {
        id: 'smuggle_enemy',
        label: 'Run the smuggle route (+220g)',
        effects: [
          { kind: 'gold', delta: 220 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'flag', id: 'enemy_smuggler', set: 1 },
          { kind: 'narrate', text: 'You cross battle lines for profit. A dangerous game.' },
        ],
      },
      {
        id: 'stay_safe',
        label: 'Too dangerous',
        effects: [{ kind: 'narrate', text: 'Someone else takes the risk and the reward.' }],
      },
    ],
  },
  {
    id: 'ch3_inflation_surge',
    chapter: 3,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'War Inflation Surges',
    body: ['War spending creates massive inflation. Money in the bank becomes worthless. Goods appreciate. Time to invest in real assets.'],
    choices: [
      {
        id: 'invest_goods',
        label: 'Invest in goods and property (+250g profit)',
        requires: [{ kind: 'goldAtLeast', amount: 100 }],
        effects: [
          { kind: 'gold', delta: 250 },
          { kind: 'stat', stat: 'savvy', delta: 1 },
          { kind: 'narrate', text: 'You buy real goods before inflation destroys your money\'s value.' },
        ],
      },
      {
        id: 'keep_gold',
        label: 'Keep gold (inflation erodes it)',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'Your gold\'s purchasing power plummets. A costly mistake.' },
        ],
      },
    ],
  },
]

export const chapter3WarDangerCards: StoryCard[] = [
  {
    id: 'ch3_army_requisition',
    chapter: 3,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Army Requisitions Your Goods',
    body: ['Soldiers arrive and seize your supplies for military use. "Wartime requisition. Your country needs this."'],
    choices: [
      {
        id: 'comply_seizure',
        label: 'Accept the loss',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'Your goods feed soldiers. You receive nothing in return.' },
        ],
      },
      {
        id: 'hide_goods',
        label: 'Hide goods (Savvy check, DC 14)',
        check: {
          stat: 'savvy',
          dc: 14,
          success: { text: 'You successfully hide your best supplies. Soldiers take the rest.', effects: [{ kind: 'stat', stat: 'savvy', delta: 1 }] },
          failure: { text: 'They find everything and punish you for resistance.', effects: [{ kind: 'gold', delta: -400 }] },
        },
      },
    ],
  },
  {
    id: 'ch3_caught_trading_enemies',
    chapter: 3,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Caught Trading with the Enemy',
    body: ['Your government discovers you\'ve been selling to the enemy side. Treason is a capital offense.'],
    choices: [
      {
        id: 'bribe_judges',
        label: 'Bribe judges for acquittal (-350g)',
        requires: [{ kind: 'goldAtLeast', amount: 350 }],
        effects: [
          { kind: 'gold', delta: -350 },
          { kind: 'flag', id: 'traitor_bought_freedom', set: 1 },
          { kind: 'narrate', text: 'Money buys your freedom. Justice is for the poor.' },
        ],
      },
      {
        id: 'flee_country',
        label: 'Flee the country',
        effects: [
          { kind: 'flag', id: 'political_exile', set: 1 },
          { kind: 'gold', delta: -200 },
          { kind: 'advanceDays', days: 30 },
          { kind: 'narrate', text: 'You abandon everything and flee. You live, but with nothing.' },
        ],
      },
    ],
  },
  {
    id: 'ch3_ambush_on_supply_run',
    chapter: 3,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Ambushed During Supply Run',
    body: ['Bandits ambush your supply convoy. "Stand down or we kill everyone."'],
    choices: [
      {
        id: 'surrender_supplies',
        label: 'Surrender the supplies (-250g)',
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'narrate', text: 'You lose everything but keep your life.' },
        ],
      },
      {
        id: 'fight_back',
        label: 'Fight back (Grit check, DC 15)',
        check: {
          stat: 'grit',
          dc: 15,
          success: { text: 'You fight off the bandits.', effects: [{ kind: 'stat', stat: 'grit', delta: 2 }] },
          failure: { text: 'You lose the battle, the supplies, and several people.', effects: [{ kind: 'stat', stat: 'grit', delta: -1 }, { kind: 'gold', delta: -400 }] },
        },
      },
    ],
  },
  {
    id: 'ch3_informant_demands',
    chapter: 3,
    weight: 2,
    storyPhase: 'reckoning',
    title: 'Informant Threatens Exposure',
    body: ['An informant you paid demands more money or they expose your dealings to authorities. "Pay up or lose everything."'],
    choices: [
      {
        id: 'pay_blackmail',
        label: 'Pay blackmail (-150g)',
        requires: [{ kind: 'goldAtLeast', amount: 150 }],
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'You pay. But informants never stop demanding.' },
        ],
      },
      {
        id: 'silence_informant',
        label: 'Silence them permanently (Nerve check, DC 16)',
        check: {
          stat: 'nerve',
          dc: 16,
          success: { text: 'They disappear. Your secret is safe.', effects: [{ kind: 'stat', stat: 'nerve', delta: 2 }, { kind: 'flag', id: 'murderer', set: 1 }] },
          failure: { text: 'The attempt fails and they go to authorities anyway.', effects: [{ kind: 'flag', id: 'political_exile', set: 1 }] },
        },
      },
    ],
  },
]

export const chapter3RecoveryCards: StoryCard[] = [
  {
    id: 'ch3_neutral_city_escape',
    chapter: 3,
    weight: 2,
    storyPhase: 'reckoning',
    title: 'Escape to Neutral City',
    body: ['War-torn but still standing, a neutral city offers refuge. "Here, neither side has control. You can breathe."'],
    choices: [
      {
        id: 'escape_neutral',
        label: 'Escape and recover',
        effects: [
          { kind: 'advanceDays', days: 15 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'In neutral ground, you find brief peace. It won\'t last.' },
        ],
      },
    ],
  },
]
