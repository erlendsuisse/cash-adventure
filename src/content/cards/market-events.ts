import type { StoryCard } from '../../engine/types'

// Market-triggered story events
// These cards appear when market conditions create narrative opportunities/crises

const spice_shortage_crisis: StoryCard = {
  id: 'spice_shortage_crisis',
  weight: 3,
  storyPhase: 'climbing',
  title: 'The Spice Routes Close',
  body: [
    'A crisis: the spice caravans have been attacked by bandits. The supply lines are cut.',
    'Spice prices are skyrocketing. The market is in chaos. Merchants who hold spice stock are suddenly wealthy. Merchants who need spice are desperate.',
    'This is your opportunity—if you have the nerve to capitalize on others\' misfortune.',
  ],
  choices: [
    {
      id: 'profit_spice_shortage',
      label: 'Sell spice at premium prices (+200g)',
      requires: [{ kind: 'ownsAsset', id: 'spice_guild_charter' }],
      effects: [
        { kind: 'gold', delta: 200 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'flag', id: 'profited_spice_shortage', set: 1 },
        { kind: 'narrate', text: 'You sell your spice holdings at triple the usual price. Profitable, but cold-blooded.' },
      ],
    },
    {
      id: 'help_spice_shortage',
      label: 'Supply poor merchants at fair prices',
      requires: [{ kind: 'ownsAsset', id: 'spice_guild_charter' }],
      effects: [
        { kind: 'gold', delta: 50 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'helped_spice_shortage', set: 1 },
        { kind: 'narrate', text: 'You sell spice at fair prices. Less profit, but you\'ve made friends.' },
      ],
    },
    {
      id: 'weather_spice_shortage',
      label: 'Wait and see how it resolves',
      effects: [{ kind: 'narrate', text: 'You hold your spice and wait. The market remains volatile.' }],
    },
  ],
}

const iron_boom_opportunity: StoryCard = {
  id: 'iron_boom_market',
  weight: 3,
  storyPhase: 'climbing',
  title: 'The Crown Needs Iron',
  body: [
    'Word spreads: the crown is building a new fleet. Military demand for iron has tripled.',
    'Iron prices are soaring. If you control iron supply, you\'re in a position of power.',
    'The military quartermaster is offering premium prices for reliable suppliers.',
  ],
  choices: [
    {
      id: 'supply_military_iron',
      label: 'Contract with military (+100g/month for 3 months)',
      requires: [{ kind: 'ownsAsset', id: 'prospector_iron' }],
      effects: [
        { kind: 'gold', delta: 100 },
        { kind: 'wages', delta: 50 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'flag', id: 'military_supplier', set: 1 },
        { kind: 'narrate', text: 'You secure a military contract. Your iron will arm the crown\'s new fleet.' },
        { kind: 'advanceDays', days: 5 },
      ],
    },
    {
      id: 'decline_military_iron',
      label: 'Decline—too risky',
      effects: [{ kind: 'narrate', text: 'Military contracts are lucrative but dangerous. You stay neutral.' }],
    },
  ],
}

const salt_glut_collapse: StoryCard = {
  id: 'salt_glut_collapse',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Salt Market Floods',
  body: [
    'Too much salt. New harvesters have flooded the market. Prices have collapsed.',
    'Salt is nearly worthless now. Anyone holding salt stock is facing losses.',
    'This is a warning: even seemingly stable markets can shift violently.',
  ],
  choices: [
    {
      id: 'dump_salt',
      label: 'Liquidate salt before prices drop further (-50g)',
      requires: [{ kind: 'ownsAsset', id: 'salt_caravan_share' }],
      effects: [
        { kind: 'sellAsset', id: 'salt_caravan_share', priceMultiplier: 0.7 },
        { kind: 'narrate', text: 'You sell your salt at a loss. At least you recover something.' },
        { kind: 'flag', id: 'salt_exit', set: 1 },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'hold_salt_long_term',
      label: 'Hold—markets recover eventually',
      effects: [
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'You hold your salt stock. Time will tell if you\'re right.' },
      ],
    },
  ],
}

const merchant_panic: StoryCard = {
  id: 'merchant_panic',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Market Panic Spreads',
  body: [
    'A major merchant house collapses. The news sends shockwaves through the city.',
    'Panic selling. Prices dropping across all sectors. Merchants are liquidating holdings at any price.',
    'In chaos, fortunes are made and destroyed. This is the real test of a merchant\'s nerve.',
  ],
  choices: [
    {
      id: 'panic_sell',
      label: 'Sell everything while you can (-25% loss)',
      effects: [
        { kind: 'gold', delta: -50 },
        { kind: 'narrate', text: 'You panic and sell. You lose money, but you sleep tonight.' },
        { kind: 'flag', id: 'panic_seller', set: 1 },
      ],
    },
    {
      id: 'buy_panic',
      label: 'Buy depressed assets (Savvy check, DC 14)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      check: {
        stat: 'savvy',
        dc: 14,
        success: {
          text: 'You see the opportunity. You buy undervalued assets at panic prices. When the market recovers, you profit hugely.',
          effects: [
            { kind: 'gold', delta: -100 },
            { kind: 'gold', delta: 250 },
            { kind: 'stat', stat: 'savvy', delta: 2 },
            { kind: 'flag', id: 'contrarian_investor', set: 1 },
          ],
        },
        failure: {
          text: 'You try to buy at the bottom, but the panic deepens. Your purchases lose value immediately.',
          effects: [
            { kind: 'gold', delta: -100 },
            { kind: 'stat', stat: 'savvy', delta: -1 },
          ],
        },
      },
    },
    {
      id: 'weather_panic',
      label: 'Stay calm and do nothing',
      effects: [
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'You hold steady while others panic. Your calm demeanor impresses observers.' },
      ],
    },
  ],
}

export const marketEventCards: StoryCard[] = [
  spice_shortage_crisis,
  iron_boom_opportunity,
  salt_glut_collapse,
  merchant_panic,
]
