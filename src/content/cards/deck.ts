import type { StoryCard } from '../../engine/types'

const salt_caravan_pitch: StoryCard = {
  id: 'salt_caravan_pitch',
  weight: 3,
  storyPhase: 'climbing',
  title: 'A Broker with a Scroll',
  body: [
    'A man in a too-shiny coat blocks your path at the salt exchange. He waves a scroll under your nose. "Shares in a salt caravan! 200 gold now, 15 every month, forever." He winks. "Only for you."',
  ],
  choices: [
    {
      id: 'buy_blind',
      label: 'Buy in on the spot (-200g)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        {
          kind: 'acquireAsset',
          asset: { id: 'salt_caravan', label: 'Salt Caravan Share', cost: 200, monthlyCashflow: 15, sector: 'salt' },
        },
        { kind: 'narrate', text: 'You hand over the gold. His smile grows a little too wide.' },
      ],
    },
    {
      id: 'inspect',
      label: 'Check his papers first (Savvy check, DC 13)',
      check: {
        stat: 'savvy',
        dc: 13,
        success: { text: 'You spot it fast. The numbers don\'t add up. This caravan is worth far less than he claims.', goto: 'salt_caravan_deal' },
        failure: { text: 'You squint at the papers. They look honest enough to you.', effects: [{ kind: 'flag', id: 'overpriced_salt', set: 1 }], goto: 'salt_caravan_deal' },
      },
    },
    {
      id: 'walk_away_salt',
      label: 'Walk away',
      effects: [{ kind: 'narrate', text: 'You step around him. He is already waving at someone else.' }],
    },
  ],
}

const salt_caravan_deal: StoryCard = {
  id: 'salt_caravan_deal',
  title: 'Shaking on It',
  body: [
    { if: { kind: 'flag', id: 'overpriced_salt', atLeast: 1 }, text: 'The broker folds his arms. "200 gold. Not a coin less, friend."' },
    { if: { kind: 'not', of: { kind: 'flag', id: 'overpriced_salt', atLeast: 1 } }, text: 'Caught out, the broker turns pink. "Fine, fine. 150, and we never speak of this."' },
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
      label: 'Keep your coins',
      effects: [{ kind: 'narrate', text: 'Your purse stays heavy. The broker sighs and rolls up his scroll.' }],
    },
  ],
}

const iron_claim_pitch: StoryCard = {
  id: 'iron_claim_pitch',
  weight: 3,
  storyPhase: 'climbing',
  title: 'A Prospector\'s Claim',
  body: ['A dusty prospector drops a lump of rock on your table. It glints. "Iron, from my claim in the eastern hills. 250 gold buys you a share, and 20 a month comes back."'],
  choices: [
    {
      id: 'buy_iron',
      label: 'Buy into the claim (-250g)',
      requires: [{ kind: 'goldAtLeast', amount: 250 }],
      effects: [
        { kind: 'gold', delta: -250 },
        { kind: 'acquireAsset', asset: { id: 'iron_claim', label: 'Iron Claim', cost: 250, monthlyCashflow: 20, sector: 'iron' } },
      ],
    },
    { id: 'pass_iron', label: 'Hand back the rock', effects: [{ kind: 'narrate', text: 'He pockets his rock and trudges off to find another buyer.' }] },
  ],
}

const guild_quest_offer: StoryCard = {
  id: 'guild_quest_offer',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Contract at the Guild Hall',
  body: ['The guild hall smells of wax and old money. A stern factor needs guards for the guild caravans, and steady pay for whoever arranges it. You just have to talk your way in.'],
  choices: [
    {
      id: 'negotiate_contract',
      label: 'Win the factor over (Charm check, DC 14)',
      check: {
        stat: 'charm',
        dc: 14,
        success: { text: 'The factor cracks a smile and signs. Steady pay, every month.', effects: [{ kind: 'wages', delta: 20 }] },
        failure: { text: 'The factor does not even look up. "Next."' },
      },
    },
    { id: 'decline_contract', label: 'Leave the hall', effects: [{ kind: 'narrate', text: 'You slip out past the queue of hopefuls.' }] },
  ],
}

const moneylenders_offer: StoryCard = {
  id: 'moneylenders_offer',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Moneylender\'s Offer',
  body: ['A moneylender with rings on every finger counts coins onto the table. "300 gold, today. You pay me 30 a month until it\'s paid back." The coins look very shiny.'],
  choices: [
    {
      id: 'take_loan',
      label: 'Take the loan (+300g, +30g/month to repay)',
      effects: [
        { kind: 'loan', principal: 300, monthlyPayment: 30 },
        { kind: 'narrate', text: 'The gold is yours. So is the debt.' },
      ],
    },
    { id: 'refuse_loan', label: 'Push the coins back', effects: [{ kind: 'narrate', text: 'The moneylender shrugs, and his rings clink as he sweeps the coins away.' }] },
  ],
}

const spice_market_rumor: StoryCard = {
  id: 'spice_market_rumor',
  weight: 3,
  storyPhase: 'climbing',
  title: 'Blockade in the Spice Lanes',
  body: [
    { if: { kind: 'not', of: { kind: 'flag', id: 'spice_blockade_seen', atLeast: 1 } }, text: 'A sailor bursts into the tavern. "Blockade in the spice lanes! They\'re turning ships back!" By noon, spice prices are climbing.' },
    { if: { kind: 'flag', id: 'spice_blockade_seen', atLeast: 1 }, text: 'The blockade news is old by now. Everyone is still talking about it.' },
  ],
  choices: [
    {
      id: 'buy_spice_assets',
      label: 'Buy spice before prices jump (-100g)',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'spice_blockade_seen', atLeast: 1 } }, { kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'acquireAsset', asset: { id: 'spice_stockpile', label: 'Spice Stockpile', cost: 100, monthlyCashflow: 25, sector: 'spice' } },
        { kind: 'marketShift', sector: 'spice', delta: 15 },
        { kind: 'flag', id: 'spice_blockade_seen', set: 1 },
        { kind: 'flag', id: 'profited_spice_blockade', set: 1 },
        { kind: 'narrate', text: 'You fill a storeroom with spice at today\'s prices. If the blockade holds, it will be worth a lot more.' },
        { kind: 'queueCard', card: 'spice_blockade_tightens' },
      ],
    },
    {
      id: 'ignore_spice_rumor',
      label: 'Let it pass',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'spice_blockade_seen', atLeast: 1 } }],
      effects: [
        { kind: 'marketShift', sector: 'spice', delta: 10 },
        { kind: 'flag', id: 'spice_blockade_seen', set: 1 },
        { kind: 'narrate', text: 'Prices keep climbing. You can\'t help checking them every day.' },
      ],
    },
    {
      id: 'skip_old_spice_news',
      label: 'Move on',
      requires: [{ kind: 'flag', id: 'spice_blockade_seen', atLeast: 1 }],
      effects: [{ kind: 'narrate', text: 'You shrug. Old news is old news.' }],
    },
  ],
}

const iron_mine_collapse: StoryCard = {
  id: 'iron_mine_collapse',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Great Mine Caves In',
  body: [
    { if: { kind: 'not', of: { kind: 'flag', id: 'iron_collapse_seen', atLeast: 1 } }, text: 'A messenger gallops in, mud to the knees. The great iron mine has caved in. The miners got out, but no iron will come out for months.' },
    { if: { kind: 'flag', id: 'iron_collapse_seen', atLeast: 1 }, text: 'Everyone has heard about the mine by now. Iron traders look nervous.' },
  ],
  choices: [
    {
      id: 'sell_iron_holdings',
      label: 'Sell your iron before the panic (-40g cost, sell for profit)',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'iron_collapse_seen', atLeast: 1 } }],
      effects: [
        { kind: 'gold', delta: 120 },
        { kind: 'marketShift', sector: 'iron', delta: -20 },
        { kind: 'flag', id: 'iron_collapse_seen', set: 1 },
        { kind: 'flag', id: 'avoided_iron_crash', set: 1 },
        { kind: 'narrate', text: 'You sell your iron just before the market tumbles. A narrow escape!' },
      ],
    },
    {
      id: 'hold_iron',
      label: 'Hold on and wait',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'iron_collapse_seen', atLeast: 1 } }],
      effects: [
        { kind: 'marketShift', sector: 'iron', delta: -15 },
        { kind: 'flag', id: 'iron_collapse_seen', set: 1 },
        { kind: 'flag', id: 'riding_iron_recovery', set: 1 },
        { kind: 'narrate', text: 'You hold on tight. Prices will recover one day. You hope.' },
        { kind: 'queueCard', card: 'iron_mine_recovery' },
      ],
    },
    {
      id: 'skip_collapse_news',
      label: 'Move on',
      requires: [{ kind: 'flag', id: 'iron_collapse_seen', atLeast: 1 }],
      effects: [{ kind: 'narrate', text: 'Old news. You move on.' }],
    },
  ],
}

const iron_boom: StoryCard = {
  id: 'iron_market_boom',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Crown Wants Ships',
  body: [
    { if: { kind: 'not', of: { kind: 'flag', id: 'iron_boom_seen', atLeast: 1 } }, text: 'Trumpets blare in the square. The crown will build a mighty new fleet! By morning, every shipwright in Vessarin is shouting for iron.' },
    { if: { kind: 'flag', id: 'iron_boom_seen', atLeast: 1 }, text: 'The fleet is still the talk of the town. Hammers ring from every shipyard.' },
  ],
  choices: [
    {
      id: 'invest_iron_boom',
      label: 'Build an iron foundry (-150g)',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'iron_boom_seen', atLeast: 1 } }, { kind: 'goldAtLeast', amount: 150 }],
      effects: [
        { kind: 'gold', delta: -150 },
        { kind: 'acquireAsset', asset: { id: 'iron_foundry', label: 'Iron Foundry', cost: 150, monthlyCashflow: 40, sector: 'iron' } },
        { kind: 'marketShift', sector: 'iron', delta: 20 },
        { kind: 'flag', id: 'iron_boom_seen', set: 1 },
        { kind: 'flag', id: 'funded_iron_boom', set: 1 },
        { kind: 'narrate', text: 'Your foundry roars to life. The crown\'s new ships will sail on your iron.' },
        { kind: 'queueCard', card: 'iron_boom_success' },
      ],
    },
    {
      id: 'profit_from_boom',
      label: 'Buy iron cheap, sell it dear',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'iron_boom_seen', atLeast: 1 } }, { kind: 'goldAtLeast', amount: 80 }],
      effects: [
        { kind: 'gold', delta: 200 },
        { kind: 'marketShift', sector: 'iron', delta: 18 },
        { kind: 'flag', id: 'iron_boom_seen', set: 1 },
        { kind: 'flag', id: 'quick_iron_profit', set: 1 },
        { kind: 'narrate', text: 'You buy at dawn and sell by dusk. Quick coins, while the fever lasts.' },
        { kind: 'advanceDays', days: 5 },
      ],
    },
    {
      id: 'watch_boom',
      label: 'Watch from the sidelines',
      requires: [{ kind: 'not', of: { kind: 'flag', id: 'iron_boom_seen', atLeast: 1 } }],
      effects: [
        { kind: 'flag', id: 'iron_boom_seen', set: 1 },
        { kind: 'narrate', text: 'Your purse is too thin for this one. You watch others grow rich on the crown\'s iron.' },
      ],
    },
    {
      id: 'skip_boom_news',
      label: 'Move on',
      requires: [{ kind: 'flag', id: 'iron_boom_seen', atLeast: 1 }],
      effects: [{ kind: 'narrate', text: 'Old news now. You move on.' }],
    },
  ],
}

const tavern_doodad: StoryCard = {
  id: 'tavern_doodad',
  weight: 3,
  storyPhase: 'climbing',
  title: 'The Velvet Cloak',
  body: ['A deep red velvet cloak hangs in the tailor\'s window. He swoops out to meet you. "Wear this, and every merchant in Vessarin will take you seriously!"'],
  choices: [
    {
      id: 'buy_cloak',
      label: 'Buy the cloak (-40g)',
      requires: [{ kind: 'goldAtLeast', amount: 40 }],
      effects: [
        { kind: 'gold', delta: -40 },
        { kind: 'flag', id: 'vain', delta: 1 },
        { kind: 'narrate', text: 'You look magnificent. Your purse looks a lot thinner.' },
      ],
    },
    { id: 'skip_cloak', label: 'Save your coins', effects: [{ kind: 'narrate', text: 'You give the cloak one last look and walk on.' }] },
  ],
}

const jeweler_wares: StoryCard = {
  id: 'jeweler_wares',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Signet Ring',
  body: ['A jeweler holds up a gold signet ring. "Important merchants wear these," she says. "50 gold, and people will trust you on sight."'],
  choices: [
    {
      id: 'buy_ring',
      label: 'Buy the ring (-50g)',
      requires: [{ kind: 'goldAtLeast', amount: 50 }],
      effects: [
        { kind: 'gold', delta: -50 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'It sits heavy on your finger. Nobody seems to notice it.' },
      ],
    },
    { id: 'skip_ring', label: 'Walk on', effects: [{ kind: 'narrate', text: 'You admire the ring, then keep walking.' }] },
  ],
}

const cobbler_pitch: StoryCard = {
  id: 'cobbler_pitch',
  weight: 2,
  storyPhase: 'climbing',
  title: 'Hand-Stitched Boots',
  body: ['A cobbler taps on his window and holds up shiny hand-stitched boots. "Boots for a merchant who is going places!"'],
  choices: [
    {
      id: 'buy_boots',
      label: 'Buy the boots (-45g)',
      requires: [{ kind: 'goldAtLeast', amount: 45 }],
      effects: [
        { kind: 'gold', delta: -45 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'They squeak with every step. Very grand. Very squeaky.' },
      ],
    },
    { id: 'skip_boots', label: 'Keep your old boots', effects: [{ kind: 'narrate', text: 'Your old boots will do. Your coins stay where they are.' }] },
  ],
}

const scribe_ledger: StoryCard = {
  id: 'scribe_ledger',
  weight: 2,
  storyPhase: 'climbing',
  title: 'The Leather Ledger',
  body: ['A scribe strokes a leather-bound ledger with gold corners. "The finest account book in Vessarin," she says. "Serious merchants deserve serious books."'],
  choices: [
    {
      id: 'buy_ledger',
      label: 'Buy the ledger (-55g)',
      requires: [{ kind: 'goldAtLeast', amount: 55 }],
      effects: [
        { kind: 'gold', delta: -55 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'Your sums look beautiful in it. They are the same sums as before.' },
      ],
    },
    { id: 'decline_ledger', label: 'Your old notebook will do', effects: [{ kind: 'narrate', text: 'You pat your scruffy notebook. It has never let you down.' }] },
  ],
}

const spice_merchant: StoryCard = {
  id: 'spice_merchant',
  weight: 2,
  storyPhase: 'climbing',
  title: 'A Box of Rare Spices',
  body: ['A spice seller opens a carved box. Saffron, cinnamon and pepper fill the air. "Give these as gifts," he winks, "and every trading house will open its doors."'],
  choices: [
    {
      id: 'buy_spices',
      label: 'Buy the spice box (-35g)',
      requires: [{ kind: 'goldAtLeast', amount: 35 }],
      effects: [
        { kind: 'gold', delta: -35 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'It smells wonderful. No doors open, but your kitchen is very happy.' },
      ],
    },
    { id: 'pass_spices', label: 'Too pricey for a present', effects: [{ kind: 'narrate', text: 'You breathe in the cinnamon one last time and walk on.' }] },
  ],
}

const quillwright: StoryCard = {
  storyPhase: 'climbing',
  id: 'quillwright',
  weight: 2,
  title: 'Swan-Feather Quills',
  body: ['A quill maker fans out a set of swan-feather quills. "Sign your contracts with these," she says, "and nobody will dare argue."'],
  choices: [
    {
      id: 'buy_quills',
      label: 'Buy the quills (-40g)',
      requires: [{ kind: 'goldAtLeast', amount: 40 }],
      effects: [
        { kind: 'gold', delta: -40 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'Your signature has never looked so curly.' },
      ],
    },
    { id: 'decline_quills', label: 'Plain quills write just fine', effects: [{ kind: 'narrate', text: 'You keep your gold and your plain old quill.' }] },
  ],
}

const silk_merchant: StoryCard = {
  storyPhase: 'climbing',
  id: 'silk_merchant',
  weight: 2,
  title: 'The Silk Handkerchief',
  body: ['A silk seller flutters an embroidered handkerchief at you. "Wave this at a deal," he says, "and the deal goes your way!"'],
  choices: [
    {
      id: 'buy_silk',
      label: 'Buy the handkerchief (-30g)',
      requires: [{ kind: 'goldAtLeast', amount: 30 }],
      effects: [
        { kind: 'gold', delta: -30 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'You tuck it in your pocket with a flourish. It is very soft.' },
      ],
    },
    { id: 'skip_silk', label: 'Save your coins', effects: [{ kind: 'narrate', text: 'You smile politely and move on.' }] },
  ],
}

const cartographer: StoryCard = {
  storyPhase: 'climbing',
  id: 'cartographer',
  weight: 2,
  title: 'The Brass Compass',
  body: ['An old map-maker presses a brass compass into your hand. "It points to profit," he whispers. "Well. It points north. Profit is often north."'],
  choices: [
    {
      id: 'buy_compass',
      label: 'Buy the compass (-50g)',
      requires: [{ kind: 'goldAtLeast', amount: 50 }],
      effects: [
        { kind: 'gold', delta: -50 },
        { kind: 'stat', stat: 'grit', delta: 1 },
        { kind: 'narrate', text: 'It points north, very firmly. You are still not sure where profit is.' },
      ],
    },
    { id: 'refuse_compass', label: 'You know your way', effects: [{ kind: 'narrate', text: 'You hand the compass back. The old man chuckles.' }] },
  ],
}

const jeweler_pendant: StoryCard = {
  storyPhase: 'climbing',
  id: 'jeweler_pendant',
  weight: 2,
  title: 'The Silver Pendant',
  body: ['A jeweler dangles a silver pendant stamped with merchant marks. "Wear this," she says, "and traders will know you mean business."'],
  choices: [
    {
      id: 'buy_pendant',
      label: 'Buy the pendant (-45g)',
      requires: [{ kind: 'goldAtLeast', amount: 45 }],
      effects: [
        { kind: 'gold', delta: -45 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'It flashes in the sun with every handshake. The deals stay the same.' },
      ],
    },
    { id: 'skip_pendant', label: 'Skip the jewellery', effects: [{ kind: 'narrate', text: 'You leave the shiny things for someone else.' }] },
  ],
}

const leatherworker: StoryCard = {
  storyPhase: 'climbing',
  id: 'leatherworker',
  weight: 2,
  title: 'Soft Leather Gloves',
  body: ['A leatherworker holds out a pair of buttery-soft gloves. "Proper merchants never shake hands bare," he says.'],
  choices: [
    {
      id: 'buy_gloves',
      label: 'Buy the gloves (-38g)',
      requires: [{ kind: 'goldAtLeast', amount: 38 }],
      effects: [
        { kind: 'gold', delta: -38 },
        { kind: 'stat', stat: 'grit', delta: 1 },
        { kind: 'narrate', text: 'You wiggle your fingers. Very fine. Very warm. Very expensive.' },
      ],
    },
    { id: 'skip_gloves', label: 'Keep your hands as they are', effects: [{ kind: 'narrate', text: 'You leave with bare hands and a full purse.' }] },
  ],
}

const perfumer: StoryCard = {
  storyPhase: 'climbing',
  id: 'perfumer',
  weight: 2,
  title: 'A Bottle of Rare Perfume',
  body: ['A perfumer sprays a cloud of roses and amber. "Wear this," she says, "and people will know you are rich before you say a word."'],
  choices: [
    {
      id: 'buy_perfume',
      label: 'Buy the perfume (-42g)',
      requires: [{ kind: 'goldAtLeast', amount: 42 }],
      effects: [
        { kind: 'gold', delta: -42 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'You smell like a rose garden. Your purse smells of nothing at all.' },
      ],
    },
    { id: 'skip_perfume', label: 'Too fancy for you', effects: [{ kind: 'narrate', text: 'You sneeze, smile, and keep your coins.' }] },
  ],
}

const gambling_den: StoryCard = {
  storyPhase: 'climbing',
  id: 'gambling_den',
  weight: 2,
  title: 'The Dice Den',
  body: ['Down a lantern-lit alley, dice rattle on a barrel top. A grinning sailor slides them toward you. "30 gold a throw. Feeling lucky?"'],
  choices: [
    {
      id: 'wager_dice',
      label: 'Throw the dice for 30 gold (Nerve check, DC 12)',
      requires: [{ kind: 'goldAtLeast', amount: 30 }],
      check: {
        stat: 'nerve',
        dc: 12,
        critSuccess: { text: 'The house is stunned. You walk out with double your wager.', effects: [{ kind: 'gold', delta: 60 }] },
        success: { text: 'Double sixes! The sailor groans as you scoop up the coins.', effects: [{ kind: 'gold', delta: 30 }] },
        failure: { text: 'Snake eyes. The sailor grins and scoops up your gold.', effects: [{ kind: 'gold', delta: -30 }] },
        critFailure: {
          text: 'You are caught palming a die. It costs you dearly.',
          effects: [{ kind: 'gold', delta: -60 }, { kind: 'flag', id: 'bad_reputation', delta: 1 }],
        },
      },
    },
    { id: 'skip_dice', label: 'Not tonight', effects: [{ kind: 'narrate', text: 'You walk back into the lantern light, purse still full.' }] },
  ],
}

const bandit_toll: StoryCard = {
  storyPhase: 'climbing',
  id: 'bandit_toll',
  weight: 2,
  title: 'A Toll on the Coast Road',
  body: ['A log lies across the coast road. Three bandits lean on it, grinning. "Road tax," says the tallest. "20 gold, and you pass nice and easy."'],
  choices: [
    {
      id: 'pay_toll',
      label: 'Pay the toll (-20g)',
      requires: [{ kind: 'goldAtLeast', amount: 20 }],
      effects: [{ kind: 'gold', delta: -20 }, { kind: 'narrate', text: 'You pay. They roll the log aside and wave you through.' }],
    },
    {
      id: 'bluff_bandits',
      label: 'Bluff your way past (Nerve check, DC 13)',
      check: {
        stat: 'nerve',
        dc: 13,
        success: { text: 'You claim the Watch is right behind you. They scatter like startled crows.' },
        failure: { text: 'They laugh at your bluff and take 30 gold for the trouble.', effects: [{ kind: 'gold', delta: -30 }] },
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
