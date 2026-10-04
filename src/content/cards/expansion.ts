import type { StoryCard } from '../../engine/types'

// ===== ADVENTURE & DUNGEON ENCOUNTERS =====
// These cards feature D&D-style encounters where you can build stats

const ancient_ruins: StoryCard = {
  id: 'ancient_ruins',
  title: 'Ruins on the Cliffs',
  weight: 2,
  body: [
    'On the windy cliffs beyond Vessarin, you find a crumbling stone doorway half-hidden by ivy.',
    'Strange carvings cover the walls inside. Treasure hunters peek in every day, but few dare go deep. They say the best treasures lie in the darkest rooms.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'explore_ruins_brave',
      label: 'Go deep alone (Nerve check, DC 14)',
      check: {
        stat: 'nerve',
        dc: 14,
        success: {
          text: 'In the deepest room, your lantern glints on a bronze mirror inlaid with silver. A collector pays 180 gold for it!',
          effects: [{ kind: 'gold', delta: 180 }, { kind: 'stat', stat: 'nerve', delta: 1 }],
          goto: 'ancient_ruins_aftermath',
        },
        failure: {
          text: 'The ceiling groans and dust trickles down. You run for it, empty-handed, but safe.',
          effects: [{ kind: 'stat', stat: 'nerve', delta: 1 }],
          goto: 'ancient_ruins_aftermath',
        },
      },
    },
    {
      id: 'hire_salvage_team',
      label: 'Hire a salvage team',
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'gold', delta: 200 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
      goto: 'ancient_ruins_aftermath',
    },
    { id: 'skip_ruins', label: 'Leave it to the treasure hunters', effects: [] },
  ],
}

const ancient_ruins_aftermath: StoryCard = {
  id: 'ancient_ruins_aftermath',
  title: 'Ruins Explored',
  body: ['You climb back into the sunlight with dusty clothes and a great story. Soon everyone in town is telling it.'],
  choices: [{ id: 'continue_after_ruins', label: 'Continue', effects: [] }],
}

const monster_contract: StoryCard = {
  id: 'monster_contract',
  title: 'Crocodiles in the Marsh',
  weight: 2,
  body: [
    'A nervous fur trader waves a poster at you. Giant crocodiles have moved into the northern marsh, and they snap at anyone who passes at night!',
    'The city will pay 250 gold to whoever drives them away. It will mean muddy boots, and very big teeth.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'hunt_monsters',
      label: 'Drive them out yourself (Grit check, DC 13)',
      check: {
        stat: 'grit',
        dc: 13,
        success: {
          text: '3 muddy days later, the crocodiles have fled downriver. You collect the reward to cheers!',
          effects: [{ kind: 'gold', delta: 250 }, { kind: 'stat', stat: 'grit', delta: 2 }],
          goto: 'monster_aftermath',
        },
        failure: {
          text: 'You sink to your knees in mud and a crocodile nearly gets your boot. You escape, with no reward.',
          effects: [{ kind: 'stat', stat: 'grit', delta: 1 }],
          goto: 'monster_aftermath',
        },
      },
    },
    {
      id: 'subcontract_hunters',
      label: 'Hire hunters to do it',
      effects: [{ kind: 'gold', delta: -50 }, { kind: 'gold', delta: 200 }],
      goto: 'monster_aftermath',
    },
    { id: 'decline_contract', label: 'Stay well away from the marsh', effects: [] },
  ],
}

const monster_aftermath: StoryCard = {
  id: 'monster_aftermath',
  title: 'A Quiet Marsh',
  body: ['The marsh is quiet now, and travellers cross it safely. Everyone knows who made it so.'],
  choices: [{ id: 'continue_after_monsters', label: 'Continue', effects: [] }],
}

const wizard_offer: StoryCard = {
  id: 'wizard_offer',
  title: 'The Scholar of Giants',
  weight: 2,
  body: [
    'An old scholar with ink on her fingers finds you at the guild hall. She has spent her life studying the Colossi. Her research is not cheap.',
    '"Pay for my work," she says, "and when the giants come, you\'ll know things nobody else does."',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'fund_research',
      label: 'Fund her research (100g)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'flag', id: 'arcanist_favor', set: 1 },
        { kind: 'grantBoon', boon: 'forbidden_knowledge' },
      ],
    },
    { id: 'decline_research', label: 'Politely decline', effects: [] },
  ],
}

// ===== BUSINESS & INVESTMENT OPPORTUNITIES =====

const guild_charter: StoryCard = {
  id: 'guild_charter',
  title: 'The Spice Guild\'s New Warehouse',
  weight: 2,
  body: [
    'The Spice Guild is building a grand new warehouse by the harbour. They need investors.',
    'Put in 150 gold, and you could earn 25 gold every month if it goes well.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'invest_guild',
      label: 'Invest with the guild',
      requires: [{ kind: 'goldAtLeast', amount: 150 }],
      effects: [
        { kind: 'gold', delta: -150 },
        {
          kind: 'acquireAsset',
          asset: {
            id: 'guild_share',
            label: 'Spice Guild Charter',
            cost: 150,
            monthlyCashflow: 25,
            sector: 'spice',
          },
        },
      ],
    },
    { id: 'pass_guild_invest', label: 'Let others invest', effects: [] },
  ],
}

const trade_route: StoryCard = {
  id: 'trade_route',
  title: 'The Mountain Pass Opens',
  weight: 2,
  body: [
    'The crown\'s workers have cleared the snowy mountain pass. Now caravans can travel straight to the rich eastern lands.',
    'A licence to use it costs 200 gold, and promises good prices on eastern goods.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'buy_license',
      label: 'Buy the licence',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        {
          kind: 'acquireAsset',
          asset: {
            id: 'eastern_license',
            label: 'Eastern Trade License',
            cost: 200,
            monthlyCashflow: 30,
            sector: 'spice',
          },
        },
      ],
    },
    { id: 'pass_license', label: 'Let it go', effects: [] },
  ],
}

const property_deed: StoryCard = {
  id: 'property_deed',
  title: 'A Little Warehouse for Sale',
  weight: 2,
  body: [
    'A neat little warehouse near the market has a FOR SALE sign. The owner wants a quick sale: 180 gold.',
    'Other traders would rent it for about 20 gold a month.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'buy_warehouse',
      label: 'Buy the warehouse',
      requires: [{ kind: 'goldAtLeast', amount: 180 }],
      effects: [
        { kind: 'gold', delta: -180 },
        {
          kind: 'acquireAsset',
          asset: {
            id: 'warehouse',
            label: 'Merchant Warehouse',
            cost: 180,
            monthlyCashflow: 20,
            sector: 'salt',
          },
        },
      ],
    },
    { id: 'skip_warehouse', label: 'Keep looking', effects: [] },
  ],
}

// ===== SKILL-BUILDING CHALLENGES =====

const dueling_school: StoryCard = {
  id: 'dueling_school',
  title: 'The Fencing Academy',
  weight: 2,
  body: [
    'The fencing master watches you walk by and calls out. "You slouch! Learn to stand tall, and every deal will go better."',
    '6 weeks of lessons cost 80 gold. You\'ll come out standing like a champion.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'take_lessons',
      label: 'Take fencing lessons',
      requires: [{ kind: 'goldAtLeast', amount: 80 }],
      effects: [
        { kind: 'gold', delta: -80 },
        { kind: 'stat', stat: 'nerve', delta: 2 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
    { id: 'skip_lessons', label: 'Politely decline', effects: [] },
  ],
}

const philosophy_circle: StoryCard = {
  id: 'philosophy_circle',
  title: 'The Thinking Club',
  weight: 2,
  body: [
    'Every week, merchants and scholars meet by the fire to talk about money, fairness and what makes a good life. They\'ve invited you!',
    'It costs 60 gold a season. The talk will sharpen your mind.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'join_circle',
      label: 'Join the club',
      requires: [{ kind: 'goldAtLeast', amount: 60 }],
      effects: [
        { kind: 'gold', delta: -60 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
      ],
    },
    { id: 'skip_circle', label: 'Think on your own', effects: [] },
  ],
}

const charm_school: StoryCard = {
  id: 'charm_school',
  title: 'Manners for the Palace',
  weight: 2,
  body: [
    'An elegant old merchant takes you aside. "You have promise, darling, but you talk like a fishmonger. Let me fix that."',
    'Her lessons in fine manners take 2 months and cost 90 gold.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'study_etiquette',
      label: 'Learn fine manners',
      requires: [{ kind: 'goldAtLeast', amount: 90 }],
      effects: [
        { kind: 'gold', delta: -90 },
        { kind: 'stat', stat: 'charm', delta: 2 },
      ],
    },
    { id: 'decline_etiquette', label: 'Stay as you are', effects: [] },
  ],
}

// ===== MARKET & TRADE INTERACTIONS =====

const market_crash: StoryCard = {
  id: 'market_crash',
  title: 'Iron Crashes',
  weight: 2,
  body: [
    'Huge news from the west: a mountain of iron has been found! Overnight, the price of iron collapses.',
    'Iron was 100, now it\'s 40. Terrible for sellers, but a bargain if you think prices will come back.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'buy_iron_dip',
      label: 'Buy cheap iron (-120g)',
      requires: [{ kind: 'goldAtLeast', amount: 120 }],
      effects: [
        { kind: 'gold', delta: -120 },
        { kind: 'marketShift', sector: 'iron', delta: 30 },
      ],
    },
    { id: 'wait_iron', label: 'Wait and see', effects: [] },
  ],
}

const spice_windfall: StoryCard = {
  id: 'spice_windfall',
  title: 'Spice Prices Soar',
  weight: 2,
  body: [
    'A great storm has flattened the spice farms in the south. Every day, spice gets rarer, and pricier.',
    'Spice was 100, now it\'s 160! Anyone with spice could sell now, or wait for even more.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'sell_spice',
      label: 'Sell your spice at 160',
      effects: [
        { kind: 'gold', delta: 160 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
      ],
    },
    { id: 'hold_spice', label: 'Hold out for more', effects: [] },
  ],
}

const black_market: StoryCard = {
  id: 'black_market',
  title: 'An Offer in the Shadows',
  weight: 1,
  body: [
    'A figure in a dark hood steps out of an alley. "Forbidden goods," she whispers. "Things everyone wants, and nobody is allowed to sell."',
    '"Easy money," she says. "But the Watch has been sniffing around lately."',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'black_market_yes',
      label: 'Make the deal (Nerve check, DC 16)',
      check: {
        stat: 'nerve',
        dc: 16,
        success: {
          text: 'You pull it off! 200 gold profit, but you made some enemies along the way.',
          effects: [
            { kind: 'gold', delta: 200 },
            { kind: 'flag', id: 'heat_level', delta: 1 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
          ],
        },
        failure: {
          text: 'The Watch bursts in! You escape over the rooftops, but lose everything you put in.',
          effects: [
            { kind: 'flag', id: 'heat_level', delta: 2 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
          ],
        },
      },
    },
    { id: 'reject_black', label: 'Walk away', effects: [] },
  ],
}

// Export all expansion cards
export const expansionCards: StoryCard[] = [
  ancient_ruins,
  ancient_ruins_aftermath,
  monster_contract,
  monster_aftermath,
  wizard_offer,
  guild_charter,
  trade_route,
  property_deed,
  dueling_school,
  philosophy_circle,
  charm_school,
  market_crash,
  spice_windfall,
  black_market,
]
