// Dangers and penalties - scale with game progression and Colossi defeats
import type { StoryCard } from '../../engine/types'
import { favour } from '../standings'

export const dangerCards: StoryCard[] = [
  // EARLY GAME DANGERS (small losses, educational)
  {
    id: 'petty_theft',
    title: 'Pickpocket!',
    body: ['Someone bumps into you in the crowd. "Sorry!" Moments later, your purse feels lighter. A pickpocket!'],
    storyPhase: 'early_game',
    weight: 10,
    choices: [
      {
        id: 'accept_loss',
        label: 'Grumble and move on',
        effects: [
          { kind: 'gold', delta: -20 },
          { kind: 'narrate', text: 'The thief got away with 20 gold. Next time, you keep a hand on your purse.' },
        ],
      },
    ],
  },

  {
    id: 'spoiled_shipment',
    title: 'A Crate of Rotten Fruit',
    body: ['You lift the lid of your new crate. Phew! The fruit has rotted on the voyage. The seller shrugs. "That\'s trade, friend."'],
    storyPhase: 'early_game',
    weight: 9,
    requires: [{ kind: 'anyOf', of: [{ kind: 'flag', id: 'has_commodities', atLeast: 1 }] }],
    choices: [
      {
        id: 'accept_spoilage',
        label: 'Hold your nose and move on',
        effects: [
          { kind: 'gold', delta: -25 },
          { kind: 'narrate', text: 'That rotten fruit cost you 25 gold. Trade always has its risks.' },
        ],
      },
    ],
  },

  {
    id: 'creditor_pressure',
    title: 'Pay Me Back Early!',
    body: ['A man you owe money bangs on your door. "Times are hard," he says. "I need my money back now, not later!"'],
    storyPhase: 'climbing',
    weight: 11,
    choices: [
      {
        id: 'pay_early',
        label: 'Pay him early (-40g)',
        effects: [
          { kind: 'gold', delta: -40 },
          { kind: 'narrate', text: 'You hand over 40 gold early. He stomps off, satisfied.' },
        ],
      },
      {
        id: 'refuse_creditor',
        label: 'Refuse (it may hurt your name)',
        effects: [
          { kind: 'flag', id: 'creditor_anger', delta: 1 },
          { kind: 'narrate', text: 'You refuse. He leaves, muttering darkly.' },
        ],
      },
    ],
  },

  {
    id: 'competition_undercutting',
    title: 'Cheaper Across the Street',
    body: ['A rival puts up a big sign: "EVERYTHING HALF PRICE!" Your customers start drifting across the street.'],
    storyPhase: 'climbing',
    weight: 10,
    choices: [
      {
        id: 'absorb_loss',
        label: 'Take the hit',
        effects: [
          { kind: 'gold', delta: -35 },
          { kind: 'narrate', text: 'You lose 35 gold to your rival\'s sale. Business can be tough.' },
        ],
      },
      {
        id: 'cut_prices',
        label: 'Cut your prices too',
        effects: [
          { kind: 'expense', delta: 5 },
          { kind: 'narrate', text: 'You lower your prices to match. You now earn 5 gold less every month.' },
        ],
      },
    ],
  },

  // MID-GAME DANGERS (moderate losses, asset risk)
  {
    id: 'fire_at_warehouse',
    title: 'Fire!',
    body: ['Bells clang in the night. Your warehouse is on fire! By morning, there is only smoke and ash. "A lamp tipped over," says the night guard.'],
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
        label: 'Count your losses',
        effects: [
          { kind: 'gold', delta: -75 },
          { kind: 'narrate', text: 'The fire took 75 gold of goods. The warehouse is gone.' },
        ],
      },
      {
        id: 'pay_insurance',
        label: 'You have insurance! Pay the claim fee',
        effects: [
          { kind: 'gold', delta: -25 },
          { kind: 'narrate', text: 'The insurance clerk wants 25 gold to handle the claim. Much better than losing it all!' },
        ],
      },
    ],
  },

  {
    id: 'betrayal_by_partner',
    title: 'Your Partner Vanishes',
    body: ['Your partner has vanished in the night, along with half your stock. "He seemed so honest," sighs the guard.'],
    weight: 9,
    requires: [{ kind: 'colossiAtLeast', count: 1 }], // was gated on the never-entered 'entangled' phase: a mid-game danger
    choices: [
      {
        id: 'accept_betrayal',
        label: 'Accept the loss',
        effects: [
          { kind: 'gold', delta: -100 },
          { kind: 'narrate', text: 'Your partner\'s betrayal cost you 100 gold. Trust can be expensive.' },
        ],
      },
    ],
  },

  {
    id: 'market_crash_danger',
    title: 'The Market Crashes',
    body: ['A rider gallops in from the capital: a trade war has started! Overnight, prices crash.'],
    storyPhase: 'climbing',
    weight: 7,
    choices: [
      {
        id: 'ride_out_crash',
        label: 'Ride it out (-80g in value)',
        effects: [
          { kind: 'gold', delta: -80 },
          { kind: 'narrate', text: 'Your goods lose 80 gold of value. You cross your fingers for better days.' },
        ],
      },
      {
        id: 'panic_sell',
        label: 'Sell everything in a panic',
        effects: [
          { kind: 'gold', delta: -120 },
          { kind: 'narrate', text: 'You sell at terrible prices and lose 120 gold. At least you saved something.' },
        ],
      },
    ],
  },

  // LATE-GAME DANGERS (major losses, existential threat)
  {
    id: 'extortion_racket',
    title: 'The Gang Wants a Cut',
    body: [
      'Three figures in dark coats stroll into your shop. "Nice place," says one. "Shame if something broke. Pay us every month, and nothing will."',
    ],
    weight: 10,
    once: true,
    // Once you pay protection the mob stops asking, so the cost can't stack.
    requires: [{ kind: 'colossiAtLeast', count: 2 }, { kind: 'not', of: { kind: 'flag', id: 'paying_protection', atLeast: 1 } }],
    choices: [
      {
        id: 'pay_protection',
        label: 'Pay them',
        effects: [
          { kind: 'expense', delta: 15 },
          { kind: 'flag', id: 'paying_protection', set: 1 },
          { kind: 'narrate', text: 'You now pay 15 gold every month for "protection". They tip their hats and leave.' },
        ],
      },
      {
        id: 'refuse_mob',
        label: 'Refuse (dangerous)',
        effects: [
          { kind: 'flag', id: 'mob_anger', delta: 1 },
          { kind: 'narrate', text: 'You refuse. They smile coldly and leave. This isn\'t over.' },
        ],
      },
    ],
  },

  {
    id: 'noble_seizure',
    title: 'A Duke Wants Your Warehouse',
    body: [
      'A duke in a feathered hat points at your warehouse. "My new palace goes there," he announces. His soldiers hand you a tiny purse of "compensation".',
    ],
    weight: 8,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'surrender_asset',
        label: 'Give up the warehouse',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'The duke\'s builders move in. It costs you 150 gold and your warehouse.' },
        ],
      },
      {
        id: 'fight_seizure',
        label: 'Fight him in court (costly)',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'You spend 200 gold on lawyers. The judge is the duke\'s cousin. You lose anyway.' },
        ],
      },
      favour('crown', {
        id: 'petition_crown',
        label: 'Ask the Crown for help',
        effects: [{ kind: 'narrate', text: 'A royal clerk reads the duke\'s claim and tears it in half. The warehouse stays yours!' }],
      }),
    ],
  },

  {
    id: 'sabotaged_supply',
    title: 'Sabotage!',
    body: [
      'Your rivals have struck in the night. Wagons overturned, bridges blocked, crates smashed. Your supplies are gone.',
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
          { kind: 'narrate', text: 'It costs 200 gold to get your supplies flowing again.' },
        ],
      },
      {
        id: 'seek_revenge',
        label: 'Get revenge (risky)',
        effects: [
          { kind: 'flag', id: 'vendetta', delta: 1 },
          { kind: 'gold', delta: -50 },
          { kind: 'narrate', text: 'You pay 50 gold for some rough types to strike back. This won\'t end well.' },
        ],
      },
    ],
  },

  {
    id: 'economic_downturn',
    title: 'Hard Times',
    body: ['Hard times have come to Vessarin. Nobles stop buying. Shops close. Everyone is pinching their pennies.'],
    weight: 10,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'weather_downturn',
        label: 'Tighten your belt',
        effects: [
          { kind: 'wages', delta: -10 },
          { kind: 'narrate', text: 'Your monthly income drops by 10 gold until times get better.' },
        ],
      },
      {
        id: 'liquidate_assets',
        label: 'Sell things for cash',
        effects: [
          { kind: 'gold', delta: -100 },
          { kind: 'narrate', text: 'You sell things cheap and lose 100 gold, but now you have coins in hand.' },
        ],
      },
    ],
  },

  {
    id: 'debt_collector_violence',
    title: 'The Debt Collectors Get Rough',
    body: [
      'Your lenders have sent their toughest men. They smash your shop window and frighten your workers. "Pay up," they growl, "or next time is worse."',
    ],
    weight: 11,
    once: true,
    // Once you've hired guards the collectors stop coming, so the cost can't stack.
    requires: [{ kind: 'colossiAtLeast', count: 4 }, { kind: 'not', of: { kind: 'flag', id: 'hired_guards', atLeast: 1 } }],
    choices: [
      {
        id: 'pay_extortion',
        label: 'Pay double, right now',
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'narrate', text: 'You pay 250 gold. They leave, for now.' },
        ],
      },
      {
        id: 'organize_defense',
        label: 'Hire guards (ongoing cost)',
        effects: [
          { kind: 'expense', delta: 20 },
          { kind: 'flag', id: 'hired_guards', set: 1 },
          { kind: 'narrate', text: 'You hire guards for 20 gold every month. Safety has a price.' },
        ],
      },
      favour('underworld', {
        id: 'call_in_underworld',
        label: 'Ask your underworld friends for help',
        effects: [{ kind: 'narrate', text: 'A quiet word in the right tavern. The thugs come back to apologise, and sweep up the glass.' }],
      }),
    ],
  },

  {
    id: 'supply_plague',
    title: 'Sickness on the Supply Roads',
    body: [
      'A sickness has spread through the villages where your goods come from. Whole villages are closed off. Nothing is coming through.',
    ],
    weight: 9,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 5 }],
    choices: [
      {
        id: 'reroute_supply',
        label: 'Find new suppliers',
        effects: [
          { kind: 'gold', delta: -300 },
          { kind: 'narrate', text: 'You spend 300 gold finding new suppliers in healthy lands.' },
        ],
      },
      {
        id: 'wait_it_out',
        label: 'Wait for it to pass',
        effects: [
          { kind: 'wages', delta: -15 },
          { kind: 'narrate', text: 'You pause your trade and earn 15 gold less every month while you wait.' },
        ],
      },
    ],
  },

  {
    id: 'lawsuit_catastrophe',
    title: 'Taken to Court',
    body: [
      'An angry customer takes you to court, and the whole town is gossiping about it. Even if you win, your good name will suffer.',
    ],
    weight: 8,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 3 }],
    choices: [
      {
        id: 'settle_lawsuit',
        label: 'Settle quietly',
        effects: [
          { kind: 'gold', delta: -180 },
          { kind: 'narrate', text: 'You pay 180 gold, and the whole thing goes away quietly.' },
        ],
      },
      {
        id: 'fight_lawsuit',
        label: 'Fight it in court (expensive)',
        effects: [
          { kind: 'gold', delta: -400 },
          { kind: 'narrate', text: 'Lawyers and fines cost 400 gold. Courts are expensive.' },
        ],
      },
      favour('guilds', {
        id: 'guild_arbitration',
        label: 'Ask the guild to settle it (-40g fee)',
        effects: [{ kind: 'gold', delta: -40 }, { kind: 'narrate', text: 'The guild hears the case in a back room. Your fellow merchants side with you, and the customer settles for a small sum.' }],
      }),
    ],
  },

  {
    id: 'warehouse_hostage',
    title: 'Thieves Take Your Warehouse',
    body: [
      'Thieves have barred themselves inside your warehouse. A note flutters from the door: "Pay 300 gold, or we smash everything inside."',
    ],
    weight: 10,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 4 }],
    choices: [
      {
        id: 'pay_ransom',
        label: 'Pay them',
        effects: [
          { kind: 'gold', delta: -300 },
          { kind: 'narrate', text: 'You pay 300 gold. The thieves slip away, and your goods are safe, for now.' },
        ],
      },
      {
        id: 'call_guard',
        label: 'Call the Watch',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'The Watch chases the thieves off, then asks for 150 gold for their "trouble".' },
        ],
      },
      favour('folk', {
        id: 'neighbourhood_rallies',
        label: 'Call on your neighbours',
        effects: [{ kind: 'narrate', text: 'Half the street turns out with lanterns and broomsticks. The thieves flee before dawn, empty-handed!' }],
      }),
    ],
  },
]
