import type { StoryCard } from '../../engine/types'
import { favour } from '../standings'
import { heat, venture } from './factories'

// CHAPTER 2 EXPANDED: Underworld Rising
// Organized ventures, street hustles, criminal networks, black market deals, gang politics, corruption

export const chapter2VentureCards: StoryCard[] = [
  venture({
    id: 'ch2_protection_racket_start',
    weight: 4,
    title: 'The "Protection" Business',
    body: [
      'A gang boss leans on your counter. "Shops have accidents," he says. "Windows break. Carts tip over. Merchants pay us to keep the accidents away. Want a share?"',
    ],
    asset: { id: 'ch2_protection_racket', label: 'Protection Racket', cost: 120, monthlyCashflow: 45, sector: 'underworld' },
    accept: {
      id: 'start_protection_racket',
      label: 'Join his "protection" business (120g)',
      effects: [{ kind: 'narrate', text: 'Shopkeepers pay you to keep the "accidents" away. They do not look happy about it.' }, heat('mafia')],
    },
    decline: { id: 'refuse_racket', label: 'Say no', text: 'The boss shrugs. "Your loss."' },
  }),
  venture({
    id: 'ch2_gambling_house_invest',
    weight: 3,
    title: 'The Gambling Den',
    body: ['Dice clatter and cards slap down in a smoky cellar. The owner flashes a gold tooth. "The house always wins, friend. Help me grow, and we split the winnings."'],
    asset: { id: 'ch2_gambling_den', label: 'Underground Casino', cost: 160, monthlyCashflow: 55, sector: 'underworld' },
    accept: {
      id: 'fund_gambling',
      label: 'Buy a share of the den (160g)',
      effects: [{ kind: 'narrate', text: 'You own a piece of the house now. Somebody else always loses.' }, heat('mafia')],
    },
    decline: { id: 'refuse_gambling', label: 'Walk back up the stairs', text: 'The owner shrugs and deals another hand.' },
  }),
  venture({
    id: 'ch2_counterfeiting_operation',
    weight: 3,
    title: 'The Fake Coin Workshop',
    body: ['A forger in a leather apron needs hidden workshops. "We fill the market with fake coins," she says, "and buy everything cheap when prices fall. Clever, isn\'t it?"'],
    asset: { id: 'ch2_counterfeiting', label: 'Counterfeiting Operation', cost: 140, monthlyCashflow: 60, sector: 'underworld' },
    accept: {
      id: 'run_counterfeiting',
      label: 'Hide her workshops (140g)',
      effects: [
        { kind: 'flag', id: 'counterfeiter', set: 1 },
        { kind: 'narrate', text: 'Hammers tap all night in your hidden workshops. If the Watch finds out, you are in deep trouble.' },
        heat('police'),
      ],
    },
    decline: { id: 'skip_counterfeiting', label: 'Too dangerous', text: 'She wipes her hands on her apron and finds another partner.' },
  }),
  venture({
    id: 'ch2_brothel_investment',
    weight: 2,
    title: 'The Velvet Card Club',
    body: ['Behind velvet curtains, rich merchants play cards until dawn. The club\'s hostess smiles at the door. "Rich people love to lose money in style. Invest with me, darling."'],
    asset: { id: 'ch2_brothel', label: 'Sex Work Enterprise', cost: 170, monthlyCashflow: 50, sector: 'underworld' },
    accept: {
      id: 'fund_brothel',
      label: 'Invest in the club (170g)',
      effects: [
        { kind: 'stat', stat: 'charm', delta: -1 },
        { kind: 'narrate', text: 'The club fills every night. The money is good, but some players lose far more than they can afford.' },
      ],
    },
    decline: { id: 'refuse_brothel', label: 'Not your kind of place', text: 'The hostess nods and draws the velvet curtain closed.' },
  }),
  venture({
    id: 'ch2_drug_house_landlord',
    weight: 3,
    title: 'Rooms for Smugglers',
    body: ['Smugglers need quiet houses to hide their goods. A landlord jingles a ring of keys. "Rent them these old townhouses. They pay double, and never ask for repairs."'],
    asset: { id: 'ch2_drug_landlord', label: 'Drug House Landlord', cost: 110, monthlyCashflow: 42, sector: 'underworld' },
    accept: {
      id: 'rent_to_dealers',
      label: 'Rent to the smugglers (110g)',
      effects: [
        { kind: 'flag', id: 'drug_landlord', set: 1 },
        { kind: 'narrate', text: 'Crates come and go at midnight. The rent is excellent. The neighbours are not happy.' },
        heat('mafia'),
      ],
    },
    decline: { id: 'refuse_dealers', label: 'Keep the keys', text: 'The smugglers find another landlord.' },
  }),
  venture({
    id: 'ch2_fence_stolen_goods',
    weight: 4,
    title: 'A Sack of Stolen Treasures',
    body: ['Two thieves tip a sack onto your table: silver spoons, a clock, a jewelled hairpin. "We find it, you sell it," says one. "We split it 60-40."'],
    asset: { id: 'ch2_fence', label: 'Stolen Goods Fence', cost: 95, monthlyCashflow: 38, sector: 'underworld' },
    accept: {
      id: 'become_fence',
      label: 'Sell their loot (95g to start)',
      effects: [{ kind: 'narrate', text: 'You sell their loot. Every spoon once belonged to someone who misses it.' }, heat('police')],
    },
    decline: { id: 'refuse_fence', label: 'Push the sack back', text: 'They sweep the loot back into the sack and slip away.' },
  }),
  venture({
    id: 'ch2_racket_extortion',
    weight: 3,
    title: 'A Bundle of Secrets',
    body: ['A con artist in a top hat unties a bundle of letters. "Rich people\'s secrets," he whispers. "They\'ll pay us well to keep them quiet."'],
    asset: { id: 'ch2_extortion', label: 'Extortion Scheme', cost: 105, monthlyCashflow: 48, sector: 'underworld' },
    accept: {
      id: 'run_extortion',
      label: 'Join his scheme (105g)',
      effects: [{ kind: 'flag', id: 'extortionist', set: 1 }, { kind: 'narrate', text: 'The rich pay up, red-faced. One day, someone will refuse.' }, heat('mafia')],
    },
    decline: { id: 'refuse_extortion', label: 'Refuse: that\'s cruel', text: 'He tucks the letters away and vanishes into the crowd.' },
  }),
]

export const chapter2StoryCards: StoryCard[] = [
  {
    id: 'ch2_street_hustler_friend',
    weight: 3,
    once: true,
    title: 'An Old Friend',
    body: ['A face from your past appears at your stall, thinner and tired. "Remember me? We both had nothing once," your old friend says quietly. "Could you help me out?"'],
    choices: [
      {
        id: 'help_friend',
        label: 'Give your friend 80 gold',
        requires: [{ kind: 'goldAtLeast', amount: 80 }],
        effects: [
          { kind: 'gold', delta: -80 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'flag', id: 'street_friend_helped', set: 1 },
          { kind: 'narrate', text: 'Your friend\'s eyes fill with tears. "I\'ll never forget this."' },
        ],
      },
      {
        id: 'refuse_friend',
        label: 'Turn your friend away',
        effects: [
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'narrate', text: 'Your friend nods, hurt but not surprised, and walks away.' },
        ],
      },
    ],
  },
  {
    id: 'ch2_gang_initiation_offer',
    weight: 3,
    once: true,
    title: 'An Invitation from the Gang',
    body: ['The gang leader rolls a coin across her knuckles. "You\'re making real money now. Join us. You\'ll get protection, friends, and a cut of everything."'],
    choices: [
      {
        id: 'join_gang',
        label: 'Join the gang',
        effects: [
          { kind: 'flag', id: 'gang_member', set: 1 },
          { kind: 'stat', stat: 'nerve', delta: 2 },
          { kind: 'narrate', text: 'She flips you the coin. You belong to the gang now, for better or worse.' },
          heat('mafia'),
        ],
      },
      {
        id: 'stay_independent',
        label: 'Stay your own boss',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'You stay free. But now the gang sees you as a rival.' },
        ],
      },
    ],
  },
  {
    id: 'ch2_informant_recruitment',
    weight: 2,
    once: true,
    title: 'A Guard Who Talks',
    body: ['A young guard grabs your sleeve. "I know when the ships come and go," he whispers. "I\'ll tell you everything. I just need 50 gold. Please."'],
    choices: [
      {
        id: 'hire_informant',
        label: 'Pay him (50g)',
        requires: [{ kind: 'goldAtLeast', amount: 50 }],
        effects: [
          { kind: 'gold', delta: -50 },
          { kind: 'flag', id: 'has_informant', set: 1 },
          { kind: 'narrate', text: 'Now you have eyes at the harbour. You hear the news before anyone else.' },
        ],
      },
      { id: 'refuse_informant', label: 'Shake him off', effects: [{ kind: 'narrate', text: 'He lets go and hurries off to ask someone else.' }] },
    ],
  },
  {
    id: 'ch2_rival_merchant_cooperation',
    weight: 2,
    once: true,
    title: 'An Offer from Your Rival',
    body: ['Your feathered rival comes to you, hat in hand. "We keep fighting, and we both lose," he sighs. "What if we worked together instead?"'],
    choices: [
      {
        id: 'partner_rival',
        label: 'Shake his hand',
        effects: [
          { kind: 'flag', id: 'rival_partner', set: 1 },
          { kind: 'stat', stat: 'savvy', delta: 1 },
          { kind: 'narrate', text: 'You shake hands. Your old enemy is now your partner, and the street is quieter for it.' },
        ],
      },
      {
        id: 'crush_rival',
        label: 'Crush him instead',
        effects: [
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'narrate', text: 'You drive him out of business. Winning feels strangely empty.' },
        ],
      },
    ],
  },
]

export const chapter2MoreMarketCards: StoryCard[] = [
  {
    id: 'ch2_police_crackdown',
    weight: 4,
    once: true,
    title: 'The Watch Cracks Down',
    body: ['A new captain of the Watch arrives with a loud voice and 100 new guards. Smugglers flee. Shady stalls close. With fewer goods around, prices jump.'],
    choices: [
      {
        id: 'lay_low',
        label: 'Lie low until it passes (+100g eventually)',
        effects: [
          { kind: 'gold', delta: 100 },
          { kind: 'advanceDays', days: 15 },
          { kind: 'narrate', text: 'You keep your head down. When the noise dies away, you are still standing.' },
        ],
      },
      {
        id: 'bribe_police',
        label: 'Bribe the Watch (-250g)',
        requires: [{ kind: 'goldAtLeast', amount: 250 }],
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'flag', id: 'police_corrupt', set: 1 },
          { kind: 'narrate', text: 'The guards suddenly find something very interesting to look at, far away from you.' },
          heat('police'),
        ],
      },
    ],
  },
  {
    id: 'ch2_supply_drought',
    weight: 3,
    once: true,
    title: 'The Border Closes',
    body: ['Soldiers now guard every road and river crossing. No smuggled goods can get through. Their prices soar, while honest goods get cheaper.'],
    choices: [
      {
        id: 'invest_smuggling',
        label: 'Find a secret new route (+200g)',
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'flag', id: 'smuggler_investor', set: 1 },
          { kind: 'narrate', text: 'You find a hidden goat track over the hills. Everyone wants to use it, and pays you for it.' },
        ],
      },
      {
        id: 'wait_out_drought',
        label: 'Wait for the roads to open',
        effects: [{ kind: 'narrate', text: 'The roads reopen at last, but someone else got there first.' }],
      },
    ],
  },
  {
    id: 'ch2_gang_war_opportunity',
    weight: 3,
    once: true,
    title: 'The Quiet Street Between the Gangs',
    body: ['2 big gangs are feuding over the harbour. Between them lies one quiet street that neither gang dares to claim. Brave traders could do well there.'],
    choices: [
      {
        id: 'claim_neutral_zone',
        label: 'Set up shop on the quiet street (+150g)',
        effects: [
          { kind: 'gold', delta: 150 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'You trade right between the two gangs. Every day, you watch your step very carefully.' },
          heat('mafia'),
        ],
      },
      {
        id: 'stay_away',
        label: 'Stay well away',
        effects: [{ kind: 'narrate', text: 'You stay safe, but you miss your chance.' }],
      },
    ],
  },
]

export const chapter2MoreDangerCards: StoryCard[] = [
  {
    id: 'ch2_gang_enforcer_visit',
    weight: 4,
    once: true,
    title: 'A Visitor in the Doorway',
    body: ['A huge man in a dark coat fills your doorway. He folds his arms. "We\'ve been keeping your shop safe," he rumbles. "That\'s 200 gold."'],
    choices: [
      {
        id: 'pay_gang',
        label: 'Pay him (-200g)',
        requires: [{ kind: 'goldAtLeast', amount: 200 }],
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'You pay. He nods and ducks back out the door. You are safe, for now.' },
        ],
      },
      {
        id: 'refuse_gang_extortion',
        label: 'Refuse to pay (Nerve check, DC 15)',
        check: {
          stat: 'nerve',
          dc: 15,
          success: { text: 'He looks at you for a long time. Then he laughs. "You\'ve got guts." He leaves without a coin.', effects: [{ kind: 'stat', stat: 'nerve', delta: 2 }] },
          failure: { text: 'He tips over your shelves and helps himself to 300 gold.', effects: [{ kind: 'gold', delta: -300 }, { kind: 'stat', stat: 'grit', delta: -1 }] },
        },
      },
      favour('underworld', {
        id: 'drop_a_name',
        label: 'Drop a name the gang respects',
        effects: [{ kind: 'narrate', text: 'He hears whose friend you are. He turns, and leaves without a word.' }],
      }),
    ],
  },
  {
    id: 'ch2_betrayal_by_partner',
    weight: 3,
    once: true,
    title: 'Your Partner Runs Off',
    body: ['You open the strongbox. It is empty. Your partner has vanished in the night, with 180 gold of your money.'],
    choices: [
      {
        id: 'hunt_partner',
        label: 'Chase your partner down (Nerve check, DC 14)',
        check: {
          stat: 'nerve',
          dc: 14,
          success: { text: 'You catch your partner boarding a ship and get every coin back!', effects: [{ kind: 'gold', delta: 180 }, { kind: 'stat', stat: 'nerve', delta: 1 }] },
          failure: { text: 'The ship has already sailed. Your gold sails with it.', effects: [{ kind: 'stat', stat: 'charm', delta: -1 }] },
        },
      },
      {
        id: 'accept_loss',
        label: 'Let it go',
        effects: [
          { kind: 'gold', delta: -180 },
          { kind: 'narrate', text: 'A hard lesson. Next time, you will keep the strongbox key yourself.' },
        ],
      },
    ],
  },
  {
    id: 'ch2_witness_to_murder',
    weight: 2,
    once: true,
    title: 'You See a Robbery',
    body: ['In a rainy alley, robbers knock down a rich merchant and grab his purse. A lantern rolls across the cobbles. Then they spot you. "You didn\'t see anything," one growls. "Did you?"'],
    choices: [
      {
        id: 'stay_silent',
        label: 'Say nothing',
        effects: [
          { kind: 'flag', id: 'silent_witness', set: 1 },
          { kind: 'narrate', text: 'You keep quiet. You stay safe, but you cannot stop thinking about the poor merchant.' },
        ],
      },
      {
        id: 'go_to_police',
        label: 'Tell the Watch (Grit check, DC 16)',
        check: {
          stat: 'grit',
          dc: 16,
          success: { text: 'You speak up. The robbers are caught! But the gangs now call you a snitch.', effects: [{ kind: 'stat', stat: 'grit', delta: 2 }, { kind: 'flag', id: 'police_informant', set: 1 }] },
          failure: { text: 'The robbers find out who told. You have to run for it, and only just get away.', effects: [{ kind: 'stat', stat: 'grit', delta: -1 }] },
        },
      },
    ],
  },
  {
    id: 'ch2_kidnapping_threat',
    weight: 2,
    once: true,
    title: 'A Letter with a Black Seal',
    body: ['A letter is nailed to your door, sealed with black wax. Inside, just one line: "Pay 220 gold, or you will lose everything you own."'],
    choices: [
      {
        id: 'pay_ransom',
        label: 'Pay what they ask (-220g)',
        requires: [{ kind: 'goldAtLeast', amount: 220 }],
        effects: [
          { kind: 'gold', delta: -220 },
          { kind: 'narrate', text: 'You pay. You are safe for now. But they know you will pay.' },
        ],
      },
      {
        id: 'hire_protection',
        label: 'Hire bodyguards (-150g)',
        requires: [{ kind: 'goldAtLeast', amount: 150 }],
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'Two big guards follow you everywhere now. You feel safer, if a little crowded.' },
        ],
      },
      {
        id: 'go_into_hiding',
        label: 'Go into hiding',
        effects: [
          { kind: 'advanceDays', days: 7 },
          { kind: 'stat', stat: 'nerve', delta: -1 },
          { kind: 'narrate', text: 'You hide in cellars for a week. The gang forgets you, but you jump at every shadow.' },
        ],
      },
    ],
  },
]

export const chapter2RecoveryCards: StoryCard[] = [
  {
    id: 'ch2_safe_house_refuge',
    weight: 2,
    once: true,
    title: 'A Safe Place to Rest',
    body: ['Things are getting too hot. An old friend opens a hidden door. Inside: a warm fire, a soft bed, and no questions.'],
    choices: [
      {
        id: 'hide_safety',
        label: 'Rest and recover',
        effects: [
          { kind: 'advanceDays', days: 10 },
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'narrate', text: 'You sleep for a whole day. When you wake, the city has forgotten all about you.' },
        ],
      },
    ],
  },
]
