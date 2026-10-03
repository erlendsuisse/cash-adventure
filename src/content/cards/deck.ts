import type { StoryCard } from '../../engine/types'

const salt_caravan_pitch: StoryCard = {
  id: 'salt_caravan_pitch',
  weight: 3,
  storyPhase: 'climbing',
  title: 'A Broker\'s Pitch',
  body: [
    'A broker corners you near the salt exchange, waving a scroll. "Shares in a salt caravan," he says. "Two hundred gold, fifteen a month back to you. A rare opportunity."',
  ],
  choices: [
    {
      id: 'buy_blind',
      label: 'Buy in without asking questions (-200 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        {
          kind: 'acquireAsset',
          asset: { id: 'salt_caravan', label: 'Salt Caravan Share', cost: 200, monthlyCashflow: 15, sector: 'salt' },
        },
        { kind: 'narrate', text: 'You hand over the gold. The broker\'s smile is a little too wide.' },
      ],
    },
    {
      id: 'inspect',
      label: 'Inspect the manifests first (Savvy check, DC 13)',
      check: {
        stat: 'savvy',
        dc: 13,
        success: { text: 'The numbers don\'t add up - this caravan is worth less than he claims.', goto: 'salt_caravan_deal' },
        failure: { text: 'The manifests look convincing enough to you.', effects: [{ kind: 'flag', id: 'overpriced_salt', set: 1 }], goto: 'salt_caravan_deal' },
      },
    },
    {
      id: 'walk_away_salt',
      label: 'Walk away',
      effects: [{ kind: 'narrate', text: 'You leave the broker to find another mark.' }],
    },
  ],
}

const salt_caravan_deal: StoryCard = {
  id: 'salt_caravan_deal',
  title: 'Closing the Deal',
  body: [
    { if: { kind: 'flag', id: 'overpriced_salt', atLeast: 1 }, text: 'Certain of the value now, the broker won\'t budge below two hundred gold.' },
    { if: { kind: 'not', of: { kind: 'flag', id: 'overpriced_salt', atLeast: 1 } }, text: 'Caught out, the broker mutters and drops his price to one hundred fifty.' },
  ],
  choices: [
    {
      id: 'buy_discounted',
      label: 'Pay 150 gold for the share',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'overpriced_salt', atLeast: 1 } }, { kind: 'goldAtLeast', amount: 150 }],
      effects: [
        { kind: 'gold', delta: -150 },
        {
          kind: 'acquireAsset',
          asset: { id: 'salt_caravan', label: 'Salt Caravan Share', cost: 150, monthlyCashflow: 15, sector: 'salt' },
        },
      ],
    },
    {
      id: 'buy_full_price',
      label: 'Pay 200 gold for the share',
      requires: [{ kind: 'flag', id: 'overpriced_salt', atLeast: 1 }, { kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        {
          kind: 'acquireAsset',
          asset: { id: 'salt_caravan', label: 'Salt Caravan Share', cost: 200, monthlyCashflow: 15, sector: 'salt' },
        },
      ],
    },
    {
      id: 'decline_salt',
      label: 'Decline',
      effects: [{ kind: 'narrate', text: 'You keep your gold in your purse.' }],
    },
  ],
}

const iron_claim_pitch: StoryCard = {
  id: 'iron_claim_pitch',
  weight: 3,
  storyPhase: 'climbing',
  title: 'An Iron Claim',
  body: ['A prospector offers you a stake in an iron claim in the eastern hills: two hundred fifty gold for twenty a month.'],
  choices: [
    {
      id: 'buy_iron',
      label: 'Buy the claim (-250 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 250 }],
      effects: [
        { kind: 'gold', delta: -250 },
        { kind: 'acquireAsset', asset: { id: 'iron_claim', label: 'Iron Claim', cost: 250, monthlyCashflow: 20, sector: 'iron' } },
      ],
    },
    { id: 'pass_iron', label: 'Pass', effects: [{ kind: 'narrate', text: 'You leave the prospector to find another buyer.' }] },
  ],
}

const guild_quest_offer: StoryCard = {
  id: 'guild_quest_offer',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Caravan Guard Contract',
  body: ['The merchant guild needs a negotiator to secure a standing contract guarding their caravans. It could mean steady coin - if you can talk your way into it.'],
  choices: [
    {
      id: 'negotiate_contract',
      label: 'Negotiate the contract (Charm check, DC 14)',
      check: {
        stat: 'charm',
        dc: 14,
        success: { text: 'You talk your way into a standing contract.', effects: [{ kind: 'wages', delta: 20 }] },
        failure: { text: 'The guild factor is unmoved. No deal today.' },
      },
    },
    { id: 'decline_contract', label: 'Decline', effects: [{ kind: 'narrate', text: 'You leave the guild hall without the contract.' }] },
  ],
}

const moneylenders_offer: StoryCard = {
  id: 'moneylenders_offer',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Moneylender',
  body: ['A moneylender offers you three hundred gold today, thirty a month against it for as long as it takes.'],
  choices: [
    {
      id: 'take_loan',
      label: 'Take the loan (+300 gold, +30/mo)',
      effects: [
        { kind: 'loan', principal: 300, monthlyPayment: 30 },
        { kind: 'narrate', text: 'Gold in hand, debt on the books.' },
      ],
    },
    { id: 'refuse_loan', label: 'Refuse', effects: [{ kind: 'narrate', text: 'You refuse the moneylender\'s terms.' }] },
  ],
}

const spice_market_rumor: StoryCard = {
  id: 'spice_market_rumor',
  weight: 3,
  storyPhase: 'climbing',
  title: 'A Rumor of Blockade',
  body: [
    { if: { kind: 'not', of: { kind: 'flag', id: 'spice_blockade_seen', atLeast: 1 } }, text: 'Word spreads of a blockade in the spice lanes. Merchant ships are being seized. Prices are climbing fast.' },
    { if: { kind: 'flag', id: 'spice_blockade_seen', atLeast: 1 }, text: 'You\'ve already heard this news.' },
  ],
  choices: [
    {
      id: 'buy_spice_assets',
      label: 'Buy cheap spice before prices spike (-100 gold)',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'spice_blockade_seen', atLeast: 1 } }, { kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'acquireAsset', asset: { id: 'spice_stockpile', label: 'Spice Stockpile', cost: 100, monthlyCashflow: 25, sector: 'spice' } },
        { kind: 'marketShift', sector: 'spice', delta: 15 },
        { kind: 'flag', id: 'spice_blockade_seen', set: 1 },
        { kind: 'flag', id: 'profited_spice_blockade', set: 1 },
        { kind: 'narrate', text: 'You stockpile spice at bargain prices. When the blockade tightens, you\'ll profit handsomely.' },
        { kind: 'queueCard', card: 'spice_blockade_tightens' },
      ],
    },
    {
      id: 'ignore_spice_rumor',
      label: 'Ignore the opportunity',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'spice_blockade_seen', atLeast: 1 } }],
      effects: [
        { kind: 'marketShift', sector: 'spice', delta: 10 },
        { kind: 'flag', id: 'spice_blockade_seen', set: 1 },
        { kind: 'narrate', text: 'Prices climb. You wonder if you should have acted.' },
      ],
    },
    {
      id: 'skip_old_spice_news',
      label: 'Move on',
      requires: [{ kind: 'flag', id: 'spice_blockade_seen', atLeast: 1 }],
      effects: [{ kind: 'narrate', text: 'You\'ve already heard this news.' }],
    },
  ],
}

const iron_mine_collapse: StoryCard = {
  id: 'iron_mine_collapse',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Mine Collapses',
  body: [
    { if: { kind: 'not', of: { kind: 'flag', id: 'iron_collapse_seen', atLeast: 1 } }, text: 'Terrible news arrives: a major iron mine collapsed, killing dozens. Supply will be scarce for months.' },
    { if: { kind: 'flag', id: 'iron_collapse_seen', atLeast: 1 }, text: 'You\'ve already heard about the collapse.' },
  ],
  choices: [
    {
      id: 'sell_iron_holdings',
      label: 'Sell iron holdings before prices crash (-40 gold cost, sell for profit)',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'iron_collapse_seen', atLeast: 1 } }],
      effects: [
        { kind: 'gold', delta: 120 },
        { kind: 'marketShift', sector: 'iron', delta: -20 },
        { kind: 'flag', id: 'iron_collapse_seen', set: 1 },
        { kind: 'flag', id: 'avoided_iron_crash', set: 1 },
        { kind: 'narrate', text: 'You liquidate your iron just before the market crashes. A lucky escape.' },
      ],
    },
    {
      id: 'hold_iron',
      label: 'Hold and wait for recovery',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'iron_collapse_seen', atLeast: 1 } }],
      effects: [
        { kind: 'marketShift', sector: 'iron', delta: -15 },
        { kind: 'flag', id: 'iron_collapse_seen', set: 1 },
        { kind: 'flag', id: 'riding_iron_recovery', set: 1 },
        { kind: 'narrate', text: 'You hold firm. Recovery will come—but at what cost?' },
        { kind: 'queueCard', card: 'iron_mine_recovery' },
      ],
    },
    {
      id: 'skip_collapse_news',
      label: 'Move on',
      requires: [{ kind: 'flag', id: 'iron_collapse_seen', atLeast: 1 }],
      effects: [{ kind: 'narrate', text: 'Old news.' }],
    },
  ],
}

const iron_boom: StoryCard = {
  id: 'iron_market_boom',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Iron Boom',
  body: [
    { if: { kind: 'not', of: { kind: 'flag', id: 'iron_boom_seen', atLeast: 1 } }, text: 'The crown announces a massive new fleet to be built. Iron demand surges overnight. Shipwrights are offering premium prices.' },
    { if: { kind: 'flag', id: 'iron_boom_seen', atLeast: 1 }, text: 'You\'ve already heard of the crown\'s fleet contract.' },
  ],
  choices: [
    {
      id: 'invest_iron_boom',
      label: 'Invest in iron production (-150 gold)',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'iron_boom_seen', atLeast: 1 } }, { kind: 'goldAtLeast', amount: 150 }],
      effects: [
        { kind: 'gold', delta: -150 },
        { kind: 'acquireAsset', asset: { id: 'iron_foundry', label: 'Iron Foundry', cost: 150, monthlyCashflow: 40, sector: 'iron' } },
        { kind: 'marketShift', sector: 'iron', delta: 20 },
        { kind: 'flag', id: 'iron_boom_seen', set: 1 },
        { kind: 'flag', id: 'funded_iron_boom', set: 1 },
        { kind: 'narrate', text: 'You establish an iron foundry. The crown\'s fleet will be built with your iron.' },
        { kind: 'queueCard', card: 'iron_boom_success' },
      ],
    },
    {
      id: 'profit_from_boom',
      label: 'Buy and resell iron for quick profit',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'iron_boom_seen', atLeast: 1 } }, { kind: 'goldAtLeast', amount: 80 }],
      effects: [
        { kind: 'gold', delta: 200 },
        { kind: 'marketShift', sector: 'iron', delta: 18 },
        { kind: 'flag', id: 'iron_boom_seen', set: 1 },
        { kind: 'flag', id: 'quick_iron_profit', set: 1 },
        { kind: 'narrate', text: 'You flip iron for quick profit. Easy money while it lasts.' },
        { kind: 'advanceDays', days: 5 },
      ],
    },
    {
      id: 'watch_boom',
      label: 'Watch from the sidelines',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'iron_boom_seen', atLeast: 1 } }],
      effects: [
        { kind: 'flag', id: 'iron_boom_seen', set: 1 },
        { kind: 'narrate', text: 'Your purse is too thin to ride this one. You watch others grow rich on the crown\'s iron.' },
      ],
    },
    {
      id: 'skip_boom_news',
      label: 'Move on',
      requires: [{ kind: 'flag', id: 'iron_boom_seen', atLeast: 1 }],
      effects: [{ kind: 'narrate', text: 'Old news now.' }],
    },
  ],
}

const tavern_doodad: StoryCard = {
  id: 'tavern_doodad',
  weight: 3,
  storyPhase: 'climbing',
  title: 'A Velvet Cloak',
  body: ['A tailor displays a fine velvet cloak in his window. Merchants who wear such things are taken more seriously, he claims.'],
  choices: [
    {
      id: 'buy_cloak',
      label: 'Buy the velvet cloak (-40 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 40 }],
      effects: [
        { kind: 'gold', delta: -40 },
        { kind: 'flag', id: 'vain', delta: 1 },
        { kind: 'narrate', text: 'You look magnificent. Your purse disagrees.' },
      ],
    },
    { id: 'skip_cloak', label: 'Save your coin', effects: [{ kind: 'narrate', text: 'You walk past the tailor\'s window.' }] },
  ],
}

const jeweler_wares: StoryCard = {
  id: 'jeweler_wares',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Signet Ring',
  body: ['A jeweler displays an ornate signet ring. "Merchants of standing wear these," she says with a knowing smile. "Fifty gold - it will pay for itself in trust."'],
  choices: [
    {
      id: 'buy_ring',
      label: 'Buy the signet ring (-50 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 50 }],
      effects: [
        { kind: 'gold', delta: -50 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'The weight of authority sits well on your hand.' },
      ],
    },
    { id: 'skip_ring', label: 'Walk on', effects: [{ kind: 'narrate', text: 'You admire the ring but keep walking.' }] },
  ],
}

const cobbler_pitch: StoryCard = {
  id: 'cobbler_pitch',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Fine Merchant Boots',
  body: ['A cobbler catches your eye with a pair of hand-stitched boots in his window. "These are for merchants who walk in circles of power," he says.'],
  choices: [
    {
      id: 'buy_boots',
      label: 'Buy the boots (-45 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 45 }],
      effects: [
        { kind: 'gold', delta: -45 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'With every step, you feel more the merchant.' },
      ],
    },
    { id: 'skip_boots', label: 'Skip it', effects: [{ kind: 'narrate', text: 'Good boots or good coin - you choose coin.' }] },
  ],
}

const scribe_ledger: StoryCard = {
  id: 'scribe_ledger',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Master Ledger',
  body: ['A scribe displays an ornate account book bound in leather. "Organized merchants keep meticulous records," she says. "This one never loses a calculation."'],
  choices: [
    {
      id: 'buy_ledger',
      label: 'Buy the ledger (-55 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 55 }],
      effects: [
        { kind: 'gold', delta: -55 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'Your accounts will never be questioned now.' },
      ],
    },
    { id: 'decline_ledger', label: 'Your memory suffices', effects: [{ kind: 'narrate', text: 'You trust your own wits.' }] },
  ],
}

const spice_merchant: StoryCard = {
  id: 'spice_merchant',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Exotic Spice Gift Set',
  body: ['A spice merchant offers you a carefully curated gift set. "These rarities open doors in the trading houses," he says with a wink.'],
  choices: [
    {
      id: 'buy_spices',
      label: 'Buy the spice set (-35 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 35 }],
      effects: [
        { kind: 'gold', delta: -35 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'The finest gifts often cost the least in the end.' },
      ],
    },
    { id: 'pass_spices', label: 'Too expensive for sentiment', effects: [{ kind: 'narrate', text: 'You walk past the display.' }] },
  ],
}

const quillwright: StoryCard = {
  storyPhase: 'climbing',
  id: 'quillwright',
  weight: 2,
  title: 'Fine Writing Quills',
  body: ['A quillwright shows you a set of the finest quills money can buy. "Write your contracts with authority," she says.'],
  choices: [
    {
      id: 'buy_quills',
      label: 'Buy the quill set (-40 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 40 }],
      effects: [
        { kind: 'gold', delta: -40 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'Your signatures will carry weight.' },
      ],
    },
    { id: 'decline_quills', label: 'Plain quills work fine', effects: [{ kind: 'narrate', text: 'You keep your gold.' }] },
  ],
}

const silk_merchant: StoryCard = {
  storyPhase: 'climbing',
  id: 'silk_merchant',
  weight: 2,
  title: 'Silk Handkerchiefs',
  body: ['A silk merchant displays embroidered handkerchiefs. "These mark a person of refinement. Carry one visibly and every negotiation improves."'],
  choices: [
    {
      id: 'buy_silk',
      label: 'Buy a handkerchief (-30 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 30 }],
      effects: [
        { kind: 'gold', delta: -30 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'You tuck it into your pocket with a smile.' },
      ],
    },
    { id: 'skip_silk', label: 'Save your coin', effects: [{ kind: 'narrate', text: 'You move on.' }] },
  ],
}

const cartographer: StoryCard = {
  storyPhase: 'climbing',
  id: 'cartographer',
  weight: 2,
  title: 'A Brass Compass',
  body: ['An old cartographer sells you a brass compass. "Every merchant needs to know which direction leads to profit," he says.'],
  choices: [
    {
      id: 'buy_compass',
      label: 'Buy the compass (-50 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 50 }],
      effects: [
        { kind: 'gold', delta: -50 },
        { kind: 'stat', stat: 'grit', delta: 1 },
        { kind: 'narrate', text: 'You have a direction now.' },
      ],
    },
    { id: 'refuse_compass', label: 'I know my way', effects: [{ kind: 'narrate', text: 'You leave the compass behind.' }] },
  ],
}

const jeweler_pendant: StoryCard = {
  storyPhase: 'climbing',
  id: 'jeweler_pendant',
  weight: 2,
  title: 'A Silver Pendant',
  body: ['A jeweler shows you a pendant etched with merchant marks. "This tells other traders you\'re serious business," she says.'],
  choices: [
    {
      id: 'buy_pendant',
      label: 'Buy the pendant (-45 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 45 }],
      effects: [
        { kind: 'gold', delta: -45 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'It catches the light with every handshake.' },
      ],
    },
    { id: 'skip_pendant', label: 'I don\'t need jewelry', effects: [{ kind: 'narrate', text: 'You have no need for such trinkets.' }] },
  ],
}

const leatherworker: StoryCard = {
  storyPhase: 'climbing',
  id: 'leatherworker',
  weight: 2,
  title: 'Fine Leather Gloves',
  body: ['A leatherworker offers you a pair of supple merchant gloves. "These protect your hands and announce your status," he says.'],
  choices: [
    {
      id: 'buy_gloves',
      label: 'Buy the gloves (-38 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 38 }],
      effects: [
        { kind: 'gold', delta: -38 },
        { kind: 'stat', stat: 'grit', delta: 1 },
        { kind: 'narrate', text: 'You admire your hands in your new gloves.' },
      ],
    },
    { id: 'skip_gloves', label: 'Keep my hands free', effects: [{ kind: 'narrate', text: 'You leave empty-handed.' }] },
  ],
}

const perfumer: StoryCard = {
  storyPhase: 'climbing',
  id: 'perfumer',
  weight: 2,
  title: 'Rare Merchant Perfume',
  body: ['A perfumer offers you a vial of rare scent. "This announces a person of wealth and taste before they even speak," she says.'],
  choices: [
    {
      id: 'buy_perfume',
      label: 'Buy the perfume (-42 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 42 }],
      effects: [
        { kind: 'gold', delta: -42 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'You smell success.' },
      ],
    },
    { id: 'skip_perfume', label: 'Too frivolous', effects: [{ kind: 'narrate', text: 'You keep your coin.' }] },
  ],
}

const gambling_den: StoryCard = {
  storyPhase: 'climbing',
  id: 'gambling_den',
  weight: 2,
  title: 'The Dice Den',
  body: ['A dice den in the harbor quarter offers a game of chance. The stakes are thirty gold.'],
  choices: [
    {
      id: 'wager_dice',
      label: 'Wager 30 gold at dice (Nerve check, DC 12)',
      requires: [{ kind: 'goldAtLeast', amount: 30 }],
      check: {
        stat: 'nerve',
        dc: 12,
        critSuccess: { text: 'The house is stunned. You walk out with double your wager.', effects: [{ kind: 'gold', delta: 60 }] },
        success: { text: 'Luck is with you tonight.', effects: [{ kind: 'gold', delta: 30 }] },
        failure: { text: 'The dice turn against you.', effects: [{ kind: 'gold', delta: -30 }] },
        critFailure: {
          text: 'You are caught palming a die. It costs you dearly.',
          effects: [{ kind: 'gold', delta: -60 }, { kind: 'flag', id: 'bad_reputation', delta: 1 }],
        },
      },
    },
    { id: 'skip_dice', label: 'Not tonight', effects: [{ kind: 'narrate', text: 'You keep your coin and your dignity.' }] },
  ],
}

const bandit_toll: StoryCard = {
  storyPhase: 'climbing',
  id: 'bandit_toll',
  weight: 2,
  title: 'A Toll on the Road',
  body: ['Bandits block the coast road, demanding a toll of twenty gold to pass unharmed.'],
  choices: [
    {
      id: 'pay_toll',
      label: 'Pay the toll (-20 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 20 }],
      effects: [{ kind: 'gold', delta: -20 }, { kind: 'narrate', text: 'You pay and pass without trouble.' }],
    },
    {
      id: 'bluff_bandits',
      label: 'Bluff your way through (Nerve check, DC 13)',
      check: {
        stat: 'nerve',
        dc: 13,
        success: { text: 'You talk yourself past them without paying a coin.' },
        failure: { text: 'They see through you and take thirty gold anyway.', effects: [{ kind: 'gold', delta: -30 }] },
      },
    },
  ],
}

export const deckCards: StoryCard[] = [
  salt_caravan_pitch,
  salt_caravan_deal,
  iron_claim_pitch,
  guild_quest_offer,
  moneylenders_offer,
  spice_market_rumor,
  iron_mine_collapse,
  iron_boom,
  tavern_doodad,
  jeweler_wares,
  cobbler_pitch,
  scribe_ledger,
  spice_merchant,
  quillwright,
  silk_merchant,
  cartographer,
  jeweler_pendant,
  leatherworker,
  perfumer,
  gambling_den,
  bandit_toll,
]
