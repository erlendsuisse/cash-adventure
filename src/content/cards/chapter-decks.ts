// Chapter intro decks - the first themed cards each chapter adds. Exports are named by the
// chapter they belong to (chapter N unlocks after N-1 Colossi); chapterDecks.ts stamps `chapter`.
import type { StoryCard } from '../../engine/types'
import { heat } from './factories'

export const chapter2IntroCards: StoryCard[] = [
  // After Colossus 1: The underworld begins to notice you
  {
    id: 'mob_protection_offer',
    title: 'The Syndicate Comes Calling',
    body: [
      'A woman in a silver-buttoned coat slides into the seat across from you. "You\'re getting noticed," she purrs. "We can keep trouble away. For a small fee, of course."',
    ],
    weight: 12,
    requires: [{ kind: 'colossiAtLeast', count: 1 }],
    choices: [
      {
        id: 'accept_mob_protection',
        label: 'Pay for protection (110g)',
        requires: [{ kind: 'goldAtLeast', amount: 110 }],
        effects: [
          { kind: 'gold', delta: -110 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'mob_protection',
              label: 'Mob Protection',
              cost: 110,
              monthlyCashflow: 8,
              sector: 'underworld',
            },
          },
          { kind: 'flag', id: 'mob_ally', set: 1 },
          { kind: 'narrate', text: 'She shakes your hand with a cold, firm grip. You belong to the syndicate now.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_mob',
        label: 'Turn her down',
        effects: [{ kind: 'narrate', text: 'She smiles without warmth and melts into the crowd. You have made an enemy.' }],
      },
    ],
  },

  {
    id: 'criminal_informant',
    title: 'The Whisperer',
    body: [
      'A thin man with darting eyes sidles up. "I know whose ships come in, and when," he whispers. "90 gold, and you\'ll know too."',
    ],
    weight: 11,
    requires: [{ kind: 'colossiAtLeast', count: 1 }],
    choices: [
      {
        id: 'hire_informant',
        label: 'Pay for his secrets (90g)',
        requires: [{ kind: 'goldAtLeast', amount: 90 }],
        effects: [
          { kind: 'gold', delta: -90 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'criminal_informant',
              label: 'Criminal Informant',
              cost: 90,
              monthlyCashflow: 12,
              sector: 'underworld',
            },
          },
          { kind: 'narrate', text: 'Every week, a folded note slips under your door. You always seem to know first.' },
        ],
      },
      {
        id: 'decline_informant',
        label: 'Send him away',
        effects: [{ kind: 'narrate', text: 'He shrugs and slips off to whisper to someone else.' }],
      },
    ],
  },

  {
    id: 'stolen_goods_fence',
    title: 'Goods That Fell Off a Cart',
    body: [
      'A cheerful man pats a pile of crates. "Found these," he says with a wink. "You sell them, I find more, we split it 50-50. Nobody asks where they came from."',
    ],
    weight: 10,
    requires: [{ kind: 'colossiAtLeast', count: 1 }],
    choices: [
      {
        id: 'partner_fence',
        label: 'Go into business with him (100g)',
        requires: [{ kind: 'goldAtLeast', amount: 100 }],
        effects: [
          { kind: 'gold', delta: -100 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'stolen_goods_fence',
              label: 'Stolen Goods Network',
              cost: 100,
              monthlyCashflow: 25,
              sector: 'underworld',
            },
          },
          { kind: 'flag', id: 'criminal_network', set: 1 },
          { kind: 'narrate', text: 'The "found" goods sell fast. So far, nobody has asked any questions.' },
          heat('police'),
        ],
      },
      {
        id: 'refuse_fence',
        label: 'Stay honest',
        effects: [{ kind: 'narrate', text: 'He grunts and wheels his crates away.' }],
      },
    ],
  },

  {
    id: 'loan_shark_capital',
    title: 'The Loan Shark',
    body: [
      'A big man cracks his knuckles, one by one. "150 gold, right now. You pay back 30 every month. And you pay on time." He smiles. "Everyone pays on time."',
    ],
    weight: 9,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }],
    choices: [
      {
        id: 'borrow_shark',
        label: 'Borrow the gold (+150g, 30g/month to repay)',
        effects: [
          { kind: 'loan', principal: 150, monthlyPayment: 30 },
          { kind: 'narrate', text: 'The gold is in your hand. His knuckles stay in your memory.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_shark',
        label: 'Back away slowly',
        effects: [{ kind: 'narrate', text: 'He shrugs. "Your loss. Next!"' }],
      },
    ],
  },

  {
    id: 'smuggler_partnership',
    title: 'A Captain with a Fast Boat',
    body: [
      'A captain with a gold tooth leans on a sleek black boat. "Nothing outruns her," she grins. "Partner with me, and we skip the harbour tax. High risk, high reward."',
    ],
    weight: 10,
    requires: [{ kind: 'colossiAtLeast', count: 1 }],
    choices: [
      {
        id: 'partner_smuggler',
        label: 'Join her smuggling runs (120g)',
        requires: [{ kind: 'goldAtLeast', amount: 120 }],
        effects: [
          { kind: 'gold', delta: -120 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'smuggling_route',
              label: 'Smuggling Route',
              cost: 120,
              monthlyCashflow: 30,
              sector: 'underworld',
            },
          },
          { kind: 'narrate', text: 'Her boat slips out on moonless nights. It always comes back heavier.' },
          heat('police'),
        ],
      },
      {
        id: 'refuse_smuggler',
        label: 'Stay on dry land',
        effects: [{ kind: 'narrate', text: 'She tips her hat and sails off into the fog.' }],
      },
    ],
  },
]

export const chapter3IntroCards: StoryCard[] = [
  // After Colossus 2: Deeper crime, syndicates consolidate power
  {
    id: 'syndicate_muscle',
    title: 'Muscle for Hire',
    body: [
      'The silver-buttoned woman is back, with two very large friends. "For 160 gold, these two work for you. Rivals stop bothering you. Problems simply go away."',
    ],
    weight: 12,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'hire_syndicate_muscle',
        label: 'Hire her friends (160g)',
        requires: [{ kind: 'goldAtLeast', amount: 160 }],
        effects: [
          { kind: 'gold', delta: -160 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'syndicate_muscle',
              label: 'Syndicate Muscle',
              cost: 160,
              monthlyCashflow: 15,
              sector: 'underworld',
            },
          },
          { kind: 'narrate', text: 'Two giants in dark coats now follow you around. Nobody argues with you anymore.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_muscle',
        label: 'Keep your distance',
        effects: [{ kind: 'narrate', text: 'Her smile vanishes. Saying no twice was not wise.' }],
      },
    ],
  },

  {
    id: 'black_market_supplier',
    title: 'The Hidden Market',
    body: [
      'Behind a secret door, a cellar glows with lanterns. Smuggled silk, forbidden maps, rare spices. A woman blocks the stairs. "Members only. Membership is 130 gold."',
    ],
    weight: 11,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'join_black_market',
        label: 'Become a member (130g)',
        requires: [{ kind: 'goldAtLeast', amount: 130 }],
        effects: [
          { kind: 'gold', delta: -130 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'black_market_access',
              label: 'Black Market Access',
              cost: 130,
              monthlyCashflow: 18,
              sector: 'underworld',
            },
          },
          { kind: 'narrate', text: 'The secret door now opens for you. Down here, anything can be bought.' },
          heat('police'),
        ],
      },
      {
        id: 'refuse_black_market',
        label: 'Stay up in the daylight',
        effects: [{ kind: 'narrate', text: 'She nods. "The door will still be here."' }],
      },
    ],
  },

  {
    id: 'crime_boss_lieutenant',
    title: 'The Boss Sends for You',
    body: [
      'A fire crackles in a velvet study. The city\'s crime boss points at an empty chair. "I need someone clever to run things for me. Buy in for 180 gold. The pay is excellent."',
    ],
    weight: 10,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'become_lieutenant',
        label: 'Take the chair (180g)',
        requires: [{ kind: 'goldAtLeast', amount: 180 }],
        effects: [
          { kind: 'gold', delta: -180 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'crime_lieutenant',
              label: 'Crime Lieutenant Position',
              cost: 180,
              monthlyCashflow: 50,
              sector: 'underworld',
            },
          },
          { kind: 'flag', id: 'crime_lord_ally', set: 1 },
          { kind: 'narrate', text: 'You sit down. From now on, the boss\'s business is your business. So is his danger.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_lieutenant',
        label: 'Stay standing',
        effects: [{ kind: 'narrate', text: 'The boss stops smiling. You may regret that.' }],
      },
    ],
  },

  {
    id: 'counterfeiter_partnership',
    title: 'The Coin Forger',
    body: [
      'A craftsman holds up two gold coins. You cannot tell them apart. One is fake. "140 gold," he says, "and you help me spend my coins."',
    ],
    weight: 9,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'distribute_counterfeit',
        label: 'Spend his coins for him (140g)',
        requires: [{ kind: 'goldAtLeast', amount: 140 }],
        effects: [
          { kind: 'gold', delta: -140 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'counterfeit_operation',
              label: 'Counterfeit Distribution',
              cost: 140,
              monthlyCashflow: 35,
              sector: 'underworld',
            },
          },
          { kind: 'narrate', text: 'Fake coins flow through your hands. If the Watch ever looks closely, you are in big trouble.' },
          heat('police'),
        ],
      },
      {
        id: 'refuse_counterfeit',
        label: 'Refuse: that\'s a crime',
        effects: [{ kind: 'narrate', text: 'He pockets both coins and vanishes into the shadows.' }],
      },
    ],
  },
]

export const chapter4IntroCards: StoryCard[] = [
  // After Colossus 3: Desperation, true survival mode
  {
    id: 'assassin_contract_broker',
    title: 'The Broker of Dirty Tricks',
    body: [
      'A smiling man with ink-stained fingers offers a nasty trade. "Rivals pay me to ruin each other. Spoiled cargo, sunk deals, nasty rumours. 200 gold buys you a share."',
    ],
    weight: 11,
    requires: [{ kind: 'colossiAtLeast', count: 3 }],
    choices: [
      {
        id: 'become_contract_broker',
        label: 'Buy into his dirty tricks (200g)',
        requires: [{ kind: 'goldAtLeast', amount: 200 }],
        effects: [
          { kind: 'gold', delta: -200 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'assassination_broker',
              label: 'Assassination Broker Network',
              cost: 200,
              monthlyCashflow: 40,
              sector: 'underworld',
            },
          },
          { kind: 'narrate', text: 'The money is excellent. You try not to think about the merchants you are ruining.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_assassin',
        label: 'Refuse: you play fair',
        effects: [{ kind: 'narrate', text: 'His smile freezes. "A mistake," he says softly.' }],
      },
    ],
  },

  {
    id: 'human_trafficking_opportunity',
    title: 'The Cruel Mill Owner',
    body: [
      'A mill owner in a top hat offers you a share of his profits. His secret? He makes orphans work for him all day, for nothing but scraps. "Big profits," he says. "Interested?"',
    ],
    weight: 8,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 3 }],
    choices: [
      {
        id: 'refuse_slaver',
        label: 'Refuse, and mean it',
        effects: [{ kind: 'narrate', text: 'Some lines you will never cross. Not for all the gold in Vessarin.' }],
      },
    ],
  },

  {
    id: 'drug_empire_partnership',
    title: 'The Miracle Tonic',
    body: [
      'A man in a tall hat shakes a bottle of green tonic. "It cures nothing," he whispers, "but people believe it cures everything. 200 gold gets you a share."',
    ],
    weight: 10,
    requires: [{ kind: 'colossiAtLeast', count: 3 }],
    choices: [
      {
        id: 'become_drug_distributor',
        label: 'Sell the fake tonic (200g)',
        requires: [{ kind: 'goldAtLeast', amount: 200 }],
        effects: [
          { kind: 'gold', delta: -200 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'drug_distribution',
              label: 'Drug Distribution Network',
              cost: 200,
              monthlyCashflow: 60,
              sector: 'underworld',
            },
          },
          { kind: 'narrate', text: 'The bottles fly off the shelves. People get sicker, and angrier, and the Watch starts asking questions.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_drugs',
        label: 'Refuse: it\'s a cruel trick',
        effects: [{ kind: 'narrate', text: 'He shrugs and goes looking for someone less fussy.' }],
      },
    ],
  },
]

export const chapter5IntroCards: StoryCard[] = [
  // After Colossus 4+: Endgame, corruption complete or escape begins
  {
    id: 'government_corruption',
    title: 'The Official Who Can Be Bought',
    body: [
      'A crown official leans close, his chain of office clinking. "250 gold, and every permit you want is stamped. Every inspector looks the other way."',
    ],
    weight: 10,
    requires: [{ kind: 'colossiAtLeast', count: 4 }],
    choices: [
      {
        id: 'bribe_official',
        label: 'Pay the official (250g)',
        requires: [{ kind: 'goldAtLeast', amount: 250 }],
        effects: [
          { kind: 'gold', delta: -250 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'government_corruption',
              label: 'Government Corruption Network',
              cost: 250,
              monthlyCashflow: 45,
              sector: 'underworld',
            },
          },
          { kind: 'narrate', text: 'Stamped papers arrive whenever you ask. The crown\'s own officials now work for you.' },
          heat('police'),
        ],
      },
      {
        id: 'refuse_corruption',
        label: 'Refuse: too dangerous',
        effects: [{ kind: 'narrate', text: 'His smile turns cold. Officials do not forget people who say no.' }],
      },
    ],
  },

  {
    id: 'escape_boat',
    title: 'A Ship for a Rainy Day',
    body: [
      'An old captain taps his pipe. "If it all goes wrong, you\'ll need a way out. 180 gold, and my ship is ready for you, any night, no questions."',
    ],
    weight: 9,
    requires: [{ kind: 'colossiAtLeast', count: 4 }],
    choices: [
      {
        id: 'buy_escape_route',
        label: 'Buy a way out (180g)',
        requires: [{ kind: 'goldAtLeast', amount: 180 }],
        effects: [
          { kind: 'gold', delta: -180 },
          {
            kind: 'acquireAsset',
            asset: {
              id: 'escape_route',
              label: 'Escape Route',
              cost: 180,
              monthlyCashflow: 5,
              sector: 'trade',
            },
          },
          { kind: 'narrate', text: 'Now you have a secret way out. If everything falls apart, you can vanish.' },
        ],
      },
      {
        id: 'decline_escape',
        label: 'You won\'t need it',
        effects: [{ kind: 'narrate', text: 'No escape plan. The only way out is forward.' }],
      },
    ],
  },
]
