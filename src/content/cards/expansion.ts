import type { StoryCard } from '../../engine/types'

// ===== ADVENTURE & DUNGEON ENCOUNTERS =====
// These cards feature D&D-style encounters where you can build stats

const ancient_ruins: StoryCard = {
  id: 'ancient_ruins',
  title: 'Ancient Ruins Discovery',
  weight: 2,
  body: [
    'While exploring the coastal cliffs beyond Vessarin, you stumble upon crumbling stone structures half-swallowed by time.',
    'Salvagers mark these ruins daily, but most lack the nerve to venture deep. Inside, strange glyphs cover the walls - and if rumors are true, valuable artifacts lie hidden in the deepest chambers.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'explore_ruins_brave',
      label: 'Venture deep alone (Nerve check, DC 14)',
      check: {
        stat: 'nerve',
        dc: 14,
        success: {
          text: 'Deep in the chambers, you find an intact bronze mirror inlaid with silver. A collector pays 180 gold for it.',
          effects: [{ kind: 'gold', delta: 180 }, { kind: 'stat', stat: 'nerve', delta: 1 }],
          goto: 'ancient_ruins_aftermath',
        },
        failure: {
          text: 'The ceiling groans. You flee with nothing, but live to tell the tale.',
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
    { id: 'skip_ruins', label: 'Leave it to the tomb robbers', effects: [] },
  ],
}

const ancient_ruins_aftermath: StoryCard = {
  id: 'ancient_ruins_aftermath',
  title: 'Ruins Explored',
  body: ['You emerge from the venture with new stories to tell. Word spreads of your bravery - or cunning.'],
  choices: [{ id: 'continue_after_ruins', label: 'Continue', effects: [] }],
}

const monster_contract: StoryCard = {
  id: 'monster_contract',
  title: 'Monster Hunting Contract',
  weight: 2,
  body: [
    'A furrier approaches with an unusual proposition: the marshlands north of the city have been infested with large freshwater crocodiles that hunt at night.',
    'The city guard wants them culled. The contract pays 250 gold - but requires tracking and confronting dangerous creatures.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'hunt_monsters',
      label: 'Hunt the creatures (Grit check, DC 13)',
      check: {
        stat: 'grit',
        dc: 13,
        success: {
          text: '3 days of tracking through the marsh. You organize hunters and secure the bounty. Glory and coin.',
          effects: [{ kind: 'gold', delta: 250 }, { kind: 'stat', stat: 'grit', delta: 2 }],
          goto: 'monster_aftermath',
        },
        failure: {
          text: 'The marshlands prove treacherous. You barely escape with your life. No payment.',
          effects: [{ kind: 'stat', stat: 'grit', delta: 1 }],
          goto: 'monster_aftermath',
        },
      },
    },
    {
      id: 'subcontract_hunters',
      label: 'Subcontract the job to hunters',
      effects: [{ kind: 'gold', delta: -50 }, { kind: 'gold', delta: 200 }],
      goto: 'monster_aftermath',
    },
    { id: 'decline_contract', label: 'Decline', effects: [] },
  ],
}

const monster_aftermath: StoryCard = {
  id: 'monster_aftermath',
  title: 'Marsh Crossing',
  body: ['The marshlands grow quieter each night. Your name is known now - for better or worse.'],
  choices: [{ id: 'continue_after_monsters', label: 'Continue', effects: [] }],
}

const wizard_offer: StoryCard = {
  id: 'wizard_offer',
  title: 'The Arcanist\'s Bargain',
  weight: 2,
  body: [
    'An elderly scholar with ink-stained fingers seeks you out at the guild hall. She claims to know secrets of the Colossi - but her research is expensive.',
    '"Fund my work," she says, "and when the trials come, you\'ll have knowledge others lack."',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'fund_research',
      label: 'Fund her research (100 gold)',
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
  title: 'A Merchant Charter Opportunity',
  weight: 2,
  body: [
    'The Spice Merchants\' Guild is expanding. They seek investors for a new warehouse and trading network.',
    'Minimum investment: 150 gold. Projected returns: 25 gold per month if the venture succeeds.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'invest_guild',
      label: 'Invest in the guild',
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
  title: 'A New Trade Route Opens',
  weight: 2,
  body: [
    'Mountain passes have been cleared by the crown. A new direct route to the eastern provinces is now possible - but only established merchants can secure early access.',
    'An exclusive trade license costs 200 gold and guarantees favorable terms on goods from the east.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'buy_license',
      label: 'Buy the trade license',
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
    { id: 'pass_license', label: 'Pass on the opportunity', effects: [] },
  ],
}

const property_deed: StoryCard = {
  id: 'property_deed',
  title: 'A Warehouse for Sale',
  weight: 2,
  body: [
    'A small but well-located warehouse in the merchant district is on the market. The seller is motivated - 180 gold buys it outright.',
    'Renting it to other traders generates steady income. Current market rate: 20 gold per month.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'buy_warehouse',
      label: 'Purchase the warehouse',
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
    { id: 'skip_warehouse', label: 'Look elsewhere', effects: [] },
  ],
}

// ===== SKILL-BUILDING CHALLENGES =====

const dueling_school: StoryCard = {
  id: 'dueling_school',
  title: 'Lessons at the Fencing Academy',
  weight: 2,
  body: [
    'The master of the local fencing academy notices your bearing. She offers to train you in the art of negotiation through physical presence.',
    '6 weeks of intensive training costs 80 gold. By the end, you\'ll carry yourself with more confidence in any deal.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'take_lessons',
      label: 'Enroll in fencing lessons',
      requires: [{ kind: 'goldAtLeast', amount: 80 }],
      effects: [
        { kind: 'gold', delta: -80 },
        { kind: 'stat', stat: 'nerve', delta: 2 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
    { id: 'skip_lessons', label: 'Decline politely', effects: [] },
  ],
}

const philosophy_circle: StoryCard = {
  id: 'philosophy_circle',
  title: 'A Scholarly Circle',
  weight: 2,
  body: [
    'You\'re invited to join a circle of merchants and scholars who meet weekly to discuss economics, ethics, and the nature of wealth.',
    'Membership: 60 gold per season. The insights gained will sharpen your financial acumen.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'join_circle',
      label: 'Join the circle',
      requires: [{ kind: 'goldAtLeast', amount: 60 }],
      effects: [
        { kind: 'gold', delta: -60 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
      ],
    },
    { id: 'skip_circle', label: 'Stay independent', effects: [] },
  ],
}

const charm_school: StoryCard = {
  id: 'charm_school',
  title: 'Etiquette at Court',
  weight: 2,
  body: [
    'An older merchant takes you aside. "You\'ve got potential, but you dress and speak like a dock worker. Let me fix that."',
    'She offers lessons in the arts of courtly persuasion and fine manners. Cost: 90 gold. Duration: 2 months.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'study_etiquette',
      label: 'Learn courtly manners',
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
  title: 'The Iron Market Crashes',
  weight: 2,
  body: [
    'News arrives: a massive iron deposit has been discovered in the western territories. The market price for iron plummets overnight.',
    'Iron: was 100, now 40. Bad news for holders, but an opportunity for buyers if you believe the market will recover.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'buy_iron_dip',
      label: 'Buy iron at the dip (spend 120 gold for materials)',
      requires: [{ kind: 'goldAtLeast', amount: 120 }],
      effects: [
        { kind: 'gold', delta: -120 },
        { kind: 'marketShift', sector: 'iron', delta: 30 },
      ],
    },
    { id: 'wait_iron', label: 'Wait and see what happens', effects: [] },
  ],
}

const spice_windfall: StoryCard = {
  id: 'spice_windfall',
  title: 'Spice Prices Soar',
  weight: 2,
  body: [
    'A storm has devastated spice plantations across the southern provinces. Prices are climbing daily as supplies run low.',
    'Spice: was 100, now 160. A trader with current stock can make a killing selling now, or hold for even higher prices.',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'sell_spice',
      label: 'Sell any spice holdings (sell at 160)',
      effects: [
        { kind: 'gold', delta: 160 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
      ],
    },
    { id: 'hold_spice', label: 'Hold for higher prices', effects: [] },
  ],
}

const black_market: StoryCard = {
  id: 'black_market',
  title: 'A Shadowy Offer',
  weight: 1,
  body: [
    'A figure in dark clothes finds you. They mention prohibited goods - expensive, high-demand items that never appear on official ledgers.',
    '"Easy coin," they say, "but the risks are... substantial. Constables have been cracking down."',
  ],
  storyPhase: 'climbing',
  choices: [
    {
      id: 'black_market_yes',
      label: 'Deal in contraband (Nerve check, DC 16)',
      check: {
        stat: 'nerve',
        dc: 16,
        success: {
          text: 'You navigate the black market with surprising skill. The profit is 200 gold, but you\'ve made enemies.',
          effects: [
            { kind: 'gold', delta: 200 },
            { kind: 'flag', id: 'heat_level', delta: 1 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
          ],
        },
        failure: {
          text: 'Constables raid the deal. You escape, but barely, and lose the entire investment.',
          effects: [
            { kind: 'flag', id: 'heat_level', delta: 2 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
          ],
        },
      },
    },
    { id: 'reject_black', label: 'Refuse the offer', effects: [] },
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
