// Chapter intro decks - the first themed cards each chapter adds. Exports are named by the
// chapter they belong to (chapter N unlocks after N-1 Colossi); chapterDecks.ts stamps `chapter`.
import type { StoryCard } from '../../engine/types'
import { heat } from './factories'

export const chapter2IntroCards: StoryCard[] = [
  // After Colossus 1: The underworld begins to notice you
  {
    id: 'mob_protection_offer',
    title: 'The Syndicate Makes an Offer',
    body: [
      'A sleek figure in an expensive coat finds you in a quiet corner. "You\'re making noise in our city. We could work together. Protection, favors, connections - all yours. Cost? A small cut of your business."',
    ],
    weight: 12,
    requires: [{ kind: 'colossiAtLeast', count: 1 }],
    choices: [
      {
        id: 'accept_mob_protection',
        label: 'Accept mob protection (110g)',
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
          { kind: 'narrate', text: 'You shake hands with the syndicate. Welcome to the underworld.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_mob',
        label: 'Refuse their offer',
        effects: [{ kind: 'narrate', text: 'The figure smiles coldly and vanishes. You\'ve made an enemy.' }],
      },
    ],
  },

  {
    id: 'criminal_informant',
    title: 'A Criminal Informant',
    body: [
      'A shady figure offers you information for sale. "I know who\'s moving what, when they\'re vulnerable. That\'s worth 90 gold to someone smart."',
    ],
    weight: 11,
    requires: [{ kind: 'colossiAtLeast', count: 1 }],
    choices: [
      {
        id: 'hire_informant',
        label: 'Hire the informant (90g)',
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
          { kind: 'narrate', text: 'Knowledge is power. Your informant gives you an edge on every deal.' },
        ],
      },
      {
        id: 'decline_informant',
        label: 'Decline',
        effects: [{ kind: 'narrate', text: 'The informant moves on to a more interested buyer.' }],
      },
    ],
  },

  {
    id: 'stolen_goods_fence',
    title: 'A Fence Needs a Partner',
    body: [
      'A dealer in "found merchandise" approaches. "I need someone to move goods. You provide the network, I provide the goods. We split profits 50-50."',
    ],
    weight: 10,
    requires: [{ kind: 'colossiAtLeast', count: 1 }],
    choices: [
      {
        id: 'partner_fence',
        label: 'Partner with the fence (100g)',
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
          { kind: 'narrate', text: 'You join the criminal underworld. The profits are excellent but so are the risks.' },
          heat('police'),
        ],
      },
      {
        id: 'refuse_fence',
        label: 'Stay legitimate',
        effects: [{ kind: 'narrate', text: 'The fence grunts and finds another partner.' }],
      },
    ],
  },

  {
    id: 'loan_shark_capital',
    title: 'A Loan Shark Offers Capital',
    body: [
      'A dangerous figure makes a simple offer. "150 gold at 20% monthly interest. Fast approval, no questions, but be warned - we collect on time. Every time."',
    ],
    weight: 9,
    requires: [{ kind: 'colossiAtLeast', count: 1 }],
    choices: [
      {
        id: 'borrow_shark',
        label: 'Borrow 150g (30g/month to repay)',
        effects: [
          { kind: 'loan', principal: 150, monthlyPayment: 30 },
          { kind: 'narrate', text: 'You borrow from a loan shark. The interest is brutal, but so is the capital.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_shark',
        label: 'Refuse (too risky)',
        effects: [{ kind: 'narrate', text: 'The loan shark shrugs. "Your loss. Next!"' }],
      },
    ],
  },

  {
    id: 'smuggler_partnership',
    title: 'A Smuggler Seeks Partnership',
    body: [
      'A captain with a fast boat and no morals offers you a deal. "Partners in smuggling. High risk, high reward. We could make 200 gold worth of deals happen."',
    ],
    weight: 10,
    requires: [{ kind: 'colossiAtLeast', count: 1 }],
    choices: [
      {
        id: 'partner_smuggler',
        label: 'Partner with the smuggler (120g)',
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
          { kind: 'narrate', text: 'You enter the smuggling game. Contraband and coin flow freely.' },
          heat('police'),
        ],
      },
      {
        id: 'refuse_smuggler',
        label: 'Decline',
        effects: [{ kind: 'narrate', text: 'The smuggler sails on without you.' }],
      },
    ],
  },
]

export const chapter3IntroCards: StoryCard[] = [
  // After Colossus 2: Deeper crime, syndicates consolidate power
  {
    id: 'syndicate_muscle',
    title: 'The Syndicate Offers Muscle',
    body: [
      'The same sleek figure from before returns. "You\'ve been useful. We want to formalize this. For 160 gold, you get muscle on call. Competitors disappear. Problems vanish."',
    ],
    weight: 12,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'hire_syndicate_muscle',
        label: 'Hire the muscle (160g)',
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
          { kind: 'narrate', text: 'Bruisers in dark coats now answer your calls. Business becomes easier.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_muscle',
        label: 'Refuse (maintain distance)',
        effects: [{ kind: 'narrate', text: 'The syndicate frowns. Refusing again was not smart.' }],
      },
    ],
  },

  {
    id: 'black_market_supplier',
    title: 'A Black Market Supplier',
    body: [
      'Goods that don\'t exist officially. Weapons, poisons, secrets. A supplier offers you exclusive access. "130 gold membership. You\'ll never want for anything."',
    ],
    weight: 11,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'join_black_market',
        label: 'Join the black market (130g)',
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
          { kind: 'narrate', text: 'You access the true underworld. Anything can be bought or sold.' },
          heat('police'),
        ],
      },
      {
        id: 'refuse_black_market',
        label: 'Stay in the light',
        effects: [{ kind: 'narrate', text: 'The supplier nods. "Maybe next time."' }],
      },
    ],
  },

  {
    id: 'crime_boss_lieutenant',
    title: 'The Crime Boss Wants You',
    body: [
      'The crime boss himself summons you. "I need someone ambitious in my organization. Lieutenant position. 180 gold, and you run operations for me. Excellent salary guaranteed."',
    ],
    weight: 10,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'become_lieutenant',
        label: 'Become a crime lieutenant (180g)',
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
          { kind: 'narrate', text: 'You become a lieutenant in the criminal hierarchy. Power and danger in equal measure.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_lieutenant',
        label: 'Refuse (too far)',
        effects: [{ kind: 'narrate', text: 'The crime boss\'s smile fades. That was a mistake.' }],
      },
    ],
  },

  {
    id: 'counterfeiter_partnership',
    title: 'A Counterfeiter Offers Partnership',
    body: [
      'Money that looks real. A master counterfeiter wants a distributor. "140 gold and you move notes. Untraceable, undetectable."',
    ],
    weight: 9,
    requires: [{ kind: 'colossiAtLeast', count: 2 }],
    choices: [
      {
        id: 'distribute_counterfeit',
        label: 'Become a distributor (140g)',
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
          { kind: 'narrate', text: 'You deal in false gold. The risk is enormous, but so are the profits.' },
          heat('police'),
        ],
      },
      {
        id: 'refuse_counterfeit',
        label: 'Refuse (too illegal)',
        effects: [{ kind: 'narrate', text: 'The counterfeiter disappears back into the shadows.' }],
      },
    ],
  },
]

export const chapter4IntroCards: StoryCard[] = [
  // After Colossus 3: Desperation, true survival mode
  {
    id: 'assassin_contract_broker',
    title: 'An Assassin Contract Broker',
    body: [
      'Death for hire. A broker in blood offers you a percentage. "For 200 gold, you broker contracts between killers and those who want targets dead. Very profitable."',
    ],
    weight: 11,
    requires: [{ kind: 'colossiAtLeast', count: 3 }],
    choices: [
      {
        id: 'become_contract_broker',
        label: 'Broker assassinations (200g)',
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
          { kind: 'narrate', text: 'You broker death. The money is excellent. Your soul is another matter.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_assassin',
        label: 'Refuse (not a murderer)',
        effects: [{ kind: 'narrate', text: 'The broker studies you coldly. "A mistake."' }],
      },
    ],
  },

  {
    id: 'human_trafficking_opportunity',
    title: 'A Slaver Wants Your Help',
    body: [
      'The worst of the underworld. A slaver offers capital. "Help move merchandise. Desperate people willing to work for nothing. Big profits, bigger risks."',
    ],
    weight: 8,
    requires: [{ kind: 'colossiAtLeast', count: 3 }],
    choices: [
      {
        id: 'refuse_slaver',
        label: 'Refuse absolutely',
        effects: [{ kind: 'narrate', text: 'Some lines you will not cross. Even now.' }],
      },
    ],
  },

  {
    id: 'drug_empire_partnership',
    title: 'A Drug Lord Offers Partnership',
    body: [
      'The fastest way to wealth and death. A drug lord offers you a percentage. "200 gold gets you into distribution. Drugs sell themselves. So do addicts."',
    ],
    weight: 10,
    requires: [{ kind: 'colossiAtLeast', count: 3 }],
    choices: [
      {
        id: 'become_drug_distributor',
        label: 'Distribute drugs (200g)',
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
          { kind: 'narrate', text: 'You enter the drug trade. Wealth comes fast. Addiction, violence and death follow.' },
          heat('mafia'),
        ],
      },
      {
        id: 'refuse_drugs',
        label: 'Refuse (not that far)',
        effects: [{ kind: 'narrate', text: 'The drug lord shrugs. Others will take the offer.' }],
      },
    ],
  },
]

export const chapter5IntroCards: StoryCard[] = [
  // After Colossus 4+: Endgame, corruption complete or escape begins
  {
    id: 'government_corruption',
    title: 'A Corrupt Official',
    body: [
      'Power beyond power. A high-ranking official offers partnership. "250 gold. You provide bribes, I provide permits, licenses, and immunity. Endless profit."',
    ],
    weight: 10,
    requires: [{ kind: 'colossiAtLeast', count: 4 }],
    choices: [
      {
        id: 'bribe_official',
        label: 'Establish bribery network (250g)',
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
          { kind: 'narrate', text: 'You own government officials. The state works for you now.' },
          heat('police'),
        ],
      },
      {
        id: 'refuse_corruption',
        label: 'Refuse (danger)',
        effects: [{ kind: 'narrate', text: 'The official\'s smile turns dangerous. Betraying the state has consequences.' }],
      },
    ],
  },

  {
    id: 'escape_boat',
    title: 'A Captain Offers Escape',
    body: [
      'A ship captain with no allegiances. "I can get you out. Anywhere in the world, untraceable. 180 gold and you\'ve got passage for life if you need it. Insurance against apocalypse."',
    ],
    weight: 9,
    requires: [{ kind: 'colossiAtLeast', count: 4 }],
    choices: [
      {
        id: 'buy_escape_route',
        label: 'Buy escape insurance (180g)',
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
          { kind: 'narrate', text: 'You buy a way out. If everything falls apart, you can disappear.' },
        ],
      },
      {
        id: 'decline_escape',
        label: 'No escape for you',
        effects: [{ kind: 'narrate', text: 'You\'re committed now. No way out but forward.' }],
      },
    ],
  },
]
