import type { StoryCard } from '../../engine/types'

// Market-triggered story events
// These cards appear when market conditions create narrative opportunities/crises

const spice_shortage_crisis: StoryCard = {
  id: 'spice_shortage_crisis',
  weight: 3,
  storyPhase: 'climbing',
  title: 'The Spice Routes Close',
  body: [
    'Bandits have attacked the spice caravans. No spice is getting through.',
    'Spice prices are skyrocketing. Anyone with spice is suddenly rich, and small cooks and bakers are desperate.',
    'You could make a fortune, or you could help.',
  ],
  choices: [
    {
      id: 'profit_spice_shortage',
      label: 'Sell at sky-high prices (+200g)',
      requires: [{ kind: 'ownsAsset', id: 'spice_guild_charter' }],
      effects: [
        { kind: 'gold', delta: 200 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'flag', id: 'profited_spice_shortage', set: 1 },
        { kind: 'narrate', text: 'You sell your spice at 3 times the usual price. Rich, but cold.' },
      ],
    },
    {
      id: 'help_spice_shortage',
      label: 'Sell to small traders at fair prices',
      requires: [{ kind: 'ownsAsset', id: 'spice_guild_charter' }],
      effects: [
        { kind: 'gold', delta: 50 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'helped_spice_shortage', set: 1 },
        { kind: 'narrate', text: 'You sell at fair prices. Less gold, but lots of new friends.' },
      ],
    },
    {
      id: 'weather_spice_shortage',
      label: 'Wait and see',
      effects: [{ kind: 'narrate', text: 'You hold your spice and wait. The market keeps lurching.' }],
    },
  ],
}

const iron_boom_opportunity: StoryCard = {
  id: 'iron_boom_market',
  weight: 3,
  storyPhase: 'climbing',
  title: 'The Crown Needs Iron',
  body: [
    'The crown is building a new fleet, and the navy needs 3 times more iron than before.',
    'Iron prices are soaring.',
    'A navy quartermaster offers a steady contract to anyone who can deliver.',
  ],
  choices: [
    {
      id: 'supply_military_iron',
      label: 'Supply the navy (+100g/month for 3 months)',
      requires: [{ kind: 'ownsAsset', id: 'prospector_iron' }],
      effects: [
        { kind: 'gold', delta: 100 },
        { kind: 'wages', delta: 50 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'flag', id: 'military_supplier', set: 1 },
        { kind: 'narrate', text: 'You sign the contract. Your iron will build the crown\'s new ships.' },
        { kind: 'advanceDays', days: 5 },
      ],
    },
    {
      id: 'decline_military_iron',
      label: 'Too risky',
      effects: [{ kind: 'narrate', text: 'Navy contracts pay well but bring trouble. You stay out of it.' }],
    },
  ],
}

const salt_glut_collapse: StoryCard = {
  id: 'salt_glut_collapse',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Too Much Salt',
  body: [
    'New salt works have opened everywhere, and the market is drowning in salt.',
    'Salt is almost worthless now. Anyone holding it is losing money.',
    'Even steady markets can change in a flash.',
  ],
  choices: [
    {
      id: 'dump_salt',
      label: 'Sell your salt before it drops more (-50g)',
      requires: [{ kind: 'ownsAsset', id: 'salt_caravan_share' }],
      effects: [
        { kind: 'sellAsset', id: 'salt_caravan_share', priceMultiplier: 0.7 },
        { kind: 'narrate', text: 'You sell your salt at a loss. At least you saved something.' },
        { kind: 'flag', id: 'salt_exit', set: 1 },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'hold_salt_long_term',
      label: 'Hold on: prices come back eventually',
      effects: [
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'You keep your salt. Time will tell.' },
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
    'A great merchant house collapses. The news spreads like wildfire.',
    'Everyone is selling in a panic, and every price is dropping.',
    'This is the real test of a merchant\'s nerve.',
  ],
  choices: [
    {
      id: 'panic_sell',
      label: 'Sell everything now (-25% loss)',
      effects: [
        { kind: 'gold', delta: -50 },
        { kind: 'narrate', text: 'You sell in a panic. You lose money, but at least you can sleep tonight.' },
        { kind: 'flag', id: 'panic_seller', set: 1 },
      ],
    },
    {
      id: 'buy_panic',
      label: 'Buy while it\'s cheap (Savvy check, DC 14)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      check: {
        stat: 'savvy',
        dc: 14,
        success: {
          text: 'You spot the bargains and buy at panic prices. When the market recovers, you make a fortune!',
          effects: [
            { kind: 'gold', delta: -100 },
            { kind: 'gold', delta: 250 },
            { kind: 'stat', stat: 'savvy', delta: 2 },
            { kind: 'flag', id: 'contrarian_investor', set: 1 },
          ],
        },
        failure: {
          text: 'You buy too early. The panic gets worse, and your new goods lose value straight away.',
          effects: [
            { kind: 'gold', delta: -100 },
            { kind: 'stat', stat: 'savvy', delta: -1 },
          ],
        },
      },
    },
    {
      id: 'weather_panic',
      label: 'Stay calm and wait',
      effects: [
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'You stay calm while others panic. People notice.' },
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
