// Dangers and penalties - scale with game progression and Colossi defeats
import type { StoryCard } from '../../engine/types'
import { favour } from '../standings'

export const dangerCards: StoryCard[] = [
  // EARLY GAME DANGERS (small losses, educational)
  {
    id: 'petty_theft',
    title: 'Petty Theft at the Market',
    body: ['A pickpocket works the crowd. Your purse is lighter by the time you notice. Such is life in the lower quarters.'],
    storyPhase: 'early_game',
    weight: 10,
    choices: [
      {
        id: 'accept_loss',
        label: 'Accept the loss',
        effects: [
          { kind: 'gold', delta: -20 },
          { kind: 'narrate', text: 'You lose 20 gold to a skilled thief. A lesson in vigilance.' },
        ],
      },
    ],
  },

  {
    id: 'spoiled_shipment',
    title: 'A Shipment Spoils',
    body: ['The goods you invested in have rotted in transit. The merchant shrugs apologetically. "Such is the risk of trade," he says.'],
    storyPhase: 'early_game',
    weight: 9,
    requires: [{ kind: 'anyOf', of: [{ kind: 'flag', id: 'has_commodities', atLeast: 1 }] }],
    choices: [
      {
        id: 'accept_spoilage',
        label: 'Accept the loss',
        effects: [
          { kind: 'gold', delta: -25 },
          { kind: 'narrate', text: 'You lose 25 gold to spoilage. A reminder that commerce has risks.' },
        ],
      },
    ],
  },

  {
    id: 'creditor_pressure',
    title: 'A Creditor Presses Hard',
    body: ['A debtor demands payment before schedule. "Times are tough," they say, "and I need my money back." You have to choose.'],
    storyPhase: 'climbing',
    weight: 11,
    choices: [
      {
        id: 'pay_early',
        label: 'Pay them back early (lose 40g)',
        effects: [
          { kind: 'gold', delta: -40 },
          { kind: 'narrate', text: 'You pay back 40 gold early to satisfy an impatient creditor.' },
        ],
      },
      {
        id: 'refuse_creditor',
        label: 'Refuse (gain reputation debt)',
        effects: [
          { kind: 'flag', id: 'creditor_anger', delta: 1 },
          { kind: 'narrate', text: 'You refuse. The creditor leaves muttering threats.' },
        ],
      },
    ],
  },

  {
    id: 'competition_undercutting',
    title: 'A Competitor Undercuts You',
    body: ['A rival merchant starts selling goods cheaper than you can. Your profits shrink as customers flock to the better price.'],
    storyPhase: 'climbing',
    weight: 10,
    choices: [
      {
        id: 'absorb_loss',
        label: 'Absorb the loss',
        effects: [
          { kind: 'gold', delta: -35 },
          { kind: 'narrate', text: 'You lose 35 gold to undercutting competitors. Business is brutal.' },
        ],
      },
      {
        id: 'cut_prices',
        label: 'Cut your prices to match',
        effects: [
          { kind: 'expense', delta: 5 },
          { kind: 'narrate', text: 'You cut prices, hurting your margin by 5 gold per month.' },
        ],
      },
    ],
  },

  // MID-GAME DANGERS (moderate losses, asset risk)
  {
    id: 'fire_at_warehouse',
    title: 'Fire at Your Warehouse',
    body: ['Flames consume your warehouse! Goods are destroyed, investments go up in smoke. "It started in the lamp oil," they say.'],
    storyPhase: 'climbing',
    weight: 8,
    requires: [
      {
        kind: 'anyOf',
        of: [
          { kind: 'flag', id: 'has_assets', atLeast: 1 },
          { kind: 'flag', id: 'has_warehouse', atLeast: 1 },
        ],
      },
    ],
    choices: [
      {
        id: 'lose_asset',
        label: 'Lose a major investment',
        effects: [
          { kind: 'gold', delta: -75 },
          { kind: 'narrate', text: 'Fire claims 75 gold worth of goods and investment. The warehouse is a total loss.' },
        ],
      },
      {
        id: 'pay_insurance',
        label: 'You had insurance! Pay a claim fee',
        effects: [
          { kind: 'gold', delta: -25 },
          { kind: 'narrate', text: 'The insurance company demands 25 gold to process the claim. Better than total loss.' },
        ],
      },
    ],
  },

  {
    id: 'betrayal_by_partner',
    title: 'Your Partner Betrays You',
    body: ['Your business partner has fled with half the inventory and vanished. You discover the betrayal too late. "He seemed so honest," says the guard.'],
    weight: 9,
    requires: [{ kind: 'colossiAtLeast', count: 1 }], // was gated on the never-entered 'entangled' phase: a mid-game danger
    choices: [
      {
        id: 'accept_betrayal',
        label: 'Accept the loss',
        effects: [
          { kind: 'gold', delta: -100 },
          { kind: 'narrate', text: 'You lose 100 gold to your partner\'s betrayal. Trust is expensive.' },
        ],
      },
    ],
  },

  {
    id: 'market_crash_danger',
    title: 'The Market Crashes',
    body: ['Word from the capital: trade wars have begun. Prices plummet overnight. Your investments are worth a fraction of what they were.'],
    storyPhase: 'climbing',
    weight: 7,
    choices: [
      {
        id: 'ride_out_crash',
        label: 'Ride it out (lose 80g in value)',
        effects: [
          { kind: 'gold', delta: -80 },
          { kind: 'narrate', text: 'Your assets depreciate by 80 gold as the market crashes. You hope prices recover.' },
        ],
      },
      {
        id: 'panic_sell',
        label: 'Panic sell and cut losses',
        effects: [
          { kind: 'gold', delta: -120 },
          { kind: 'narrate', text: 'You sell desperately at terrible prices, losing 120 gold. But you preserve some capital.' },
        ],
      },
    ],
  },

  // LATE-GAME DANGERS (major losses, existential threat)
  {
    id: 'extortion_racket',
    title: 'The Mob Wants a Cut',
    body: [
      'Dark figures visit your businesses. "We provide protection. The fee is 15% of monthly profits. Or bad things happen." You have to choose.',
    ],
    weight: 10,
    once: true,
    // Once you pay protection the mob stops asking, so the cost can't stack.
    requires: [{ kind: 'colossiAtLeast', count: 2 }, { kind: 'not', of: { kind: 'flag', id: 'paying_protection', atLeast: 1 } }],
    choices: [
      {
        id: 'pay_protection',
        label: 'Pay the protection racket',
        effects: [
          { kind: 'expense', delta: 15 },
          { kind: 'flag', id: 'paying_protection', set: 1 },
          { kind: 'narrate', text: 'You pay 15 gold per month for "protection." Welcome to the criminal economy.' },
        ],
      },
      {
        id: 'refuse_mob',
        label: 'Refuse (dangerous)',
        effects: [
          { kind: 'flag', id: 'mob_anger', delta: 1 },
          { kind: 'narrate', text: 'You refuse. The figures smile coldly and leave. You know this isn\'t over.' },
        ],
      },
    ],
  },

  {
    id: 'noble_seizure',
    title: 'A Noble Claims Your Assets',
    body: [
      'A powerful noble decides your warehouse is the perfect location for their new palace. They offer "compensation" far below its worth, and soldiers back the offer.',
    ],
    weight: 8,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'surrender_asset',
        label: 'Surrender the property',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'You lose 150 gold and a key asset to noble seizure. Power wins.' },
        ],
      },
      {
        id: 'fight_seizure',
        label: 'Fight legally (costly)',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'You hire the best lawyers and fight for 200 gold. It\'s not worth it. You lose anyway.' },
        ],
      },
      favour('crown', {
        id: 'petition_crown',
        label: 'Petition the Crown',
        effects: [{ kind: 'narrate', text: 'A royal clerk reviews the noble\'s claim and finds it wanting. Your property stays yours.' }],
      }),
    ],
  },

  {
    id: 'sabotaged_supply',
    title: 'Your Supply Chain Is Sabotaged',
    body: [
      'Competitors have poisoned wells, burned fields, and destroyed shipments. Your supply of goods vanishes overnight. Economic warfare.',
    ],
    weight: 9,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 3 }],
    choices: [
      {
        id: 'rebuild_supply',
        label: 'Rebuild from scratch',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'You spend 200 gold rebuilding your supply chain. Business is war.' },
        ],
      },
      {
        id: 'seek_revenge',
        label: 'Seek revenge (risky)',
        effects: [
          { kind: 'flag', id: 'vendetta', delta: 1 },
          { kind: 'gold', delta: -50 },
          { kind: 'narrate', text: 'You hire thugs for 50 gold to sabotage the competitors back. This won\'t end well.' },
        ],
      },
    ],
  },

  {
    id: 'economic_downturn',
    title: 'Economic Downturn Hits',
    body: ['The city\'s economy contracts. Trade dries up. Nobles stop spending. Merchants struggle to survive. Your income plummets.'],
    weight: 10,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'weather_downturn',
        label: 'Weather the downturn',
        effects: [
          { kind: 'wages', delta: -10 },
          { kind: 'narrate', text: 'Your monthly income drops by 10 gold as the economy contracts.' },
        ],
      },
      {
        id: 'liquidate_assets',
        label: 'Liquidate assets for cash',
        effects: [
          { kind: 'gold', delta: -100 },
          { kind: 'narrate', text: 'You sell assets at fire-sale prices, losing 100 gold but gaining liquidity.' },
        ],
      },
    ],
  },

  {
    id: 'debt_collector_violence',
    title: 'Debt Collectors Turn Violent',
    body: [
      'Your creditors have sent enforcers. They break your storefront and rough up your workers. "Pay up or this gets worse," they growl.',
    ],
    weight: 11,
    once: true,
    // Once you've hired guards the collectors stop coming, so the cost can't stack.
    requires: [{ kind: 'colossiAtLeast', count: 4 }, { kind: 'not', of: { kind: 'flag', id: 'hired_guards', atLeast: 1 } }],
    choices: [
      {
        id: 'pay_extortion',
        label: 'Pay double (immediate)',
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'narrate', text: 'You pay 250 gold to make the enforcers go away. For now.' },
        ],
      },
      {
        id: 'organize_defense',
        label: 'Hire guards (ongoing cost)',
        effects: [
          { kind: 'expense', delta: 20 },
          { kind: 'flag', id: 'hired_guards', set: 1 },
          { kind: 'narrate', text: 'You hire guards for 20 gold per month. Your safety has a price.' },
        ],
      },
      favour('underworld', {
        id: 'call_in_underworld',
        label: 'Have friends in low places lean on them',
        effects: [{ kind: 'narrate', text: 'A quiet word in the right tavern. The enforcers apologise for the mess and never come back.' }],
      }),
    ],
  },

  {
    id: 'supply_plague',
    title: 'Plague Strikes Your Supply Routes',
    body: [
      'Disease ravages the regions where your goods come from. Entire villages are quarantined. Your suppliers are dead or dying. Supply halts.',
    ],
    weight: 9,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 5 }],
    choices: [
      {
        id: 'reroute_supply',
        label: 'Find alternative suppliers',
        effects: [
          { kind: 'gold', delta: -300 },
          { kind: 'narrate', text: 'You spend 300 gold establishing new supply routes through plague-free regions.' },
        ],
      },
      {
        id: 'wait_it_out',
        label: 'Wait for plague to pass',
        effects: [
          { kind: 'wages', delta: -15 },
          { kind: 'narrate', text: 'You halt operations and lose 15 gold monthly income while waiting.' },
        ],
      },
    ],
  },

  {
    id: 'lawsuit_catastrophe',
    title: 'A Lawsuit Destroys Your Credibility',
    body: [
      'A disgruntled customer sues for damages. The case is high-profile. Even if you win, the damage to your reputation is catastrophic.',
    ],
    weight: 8,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 3 }],
    choices: [
      {
        id: 'settle_lawsuit',
        label: 'Settle out of court',
        effects: [
          { kind: 'gold', delta: -180 },
          { kind: 'narrate', text: 'You settle for 180 gold to make this go away quietly.' },
        ],
      },
      {
        id: 'fight_lawsuit',
        label: 'Fight in court (expensive)',
        effects: [
          { kind: 'gold', delta: -400 },
          { kind: 'narrate', text: 'Legal fees and damages total 400 gold. Justice is expensive.' },
        ],
      },
      favour('guilds', {
        id: 'guild_arbitration',
        label: 'Ask the guild to arbitrate (-40g fee)',
        effects: [{ kind: 'gold', delta: -40 }, { kind: 'narrate', text: 'The guild hears the case in a back room. Your fellow merchants find for you, and the plaintiff takes a token settlement.' }],
      }),
    ],
  },

  {
    id: 'warehouse_hostage',
    title: 'Your Warehouse Is Taken Hostage',
    body: [
      'Criminals seize your warehouse and demand ransom. "Pay 300 gold or we burn everything inside." They\'re serious. Your inventory could be destroyed.',
    ],
    weight: 10,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 4 }],
    choices: [
      {
        id: 'pay_ransom',
        label: 'Pay the ransom',
        effects: [
          { kind: 'gold', delta: -300 },
          { kind: 'narrate', text: 'You pay 300 gold ransom. Your warehouse and goods are returned, for now.' },
        ],
      },
      {
        id: 'call_guard',
        label: 'Call the city guard',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'The guard intervenes but demands 150 gold for "assistance." Corruption runs deep.' },
        ],
      },
      favour('folk', {
        id: 'neighbourhood_rallies',
        label: 'Call on the neighbourhood',
        effects: [{ kind: 'narrate', text: 'Half the street turns out with lanterns and cudgels. The thieves slip away before dawn, empty-handed.' }],
      }),
    ],
  },
]
