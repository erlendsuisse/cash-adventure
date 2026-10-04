import type { StoryCard } from '../../engine/types'
import { favour } from '../standings'
import { heat, venture } from './factories'

// CHAPTER 3 EXPANDED: Warfare & Conflict
// War profiteering, military ventures, refugee economies, supply chains, military politics, escape routes

export const chapter3MilitaryVentureCards: StoryCard[] = [
  venture({
    id: 'ch3_weapons_smuggling',
    weight: 4,
    title: 'Selling to Both Sides',
    body: [
      'A sly trader taps his nose. "Both armies need swords and shields. Why pick a side? We sell to both! Put in 350 gold, and we split the profit."',
    ],
    asset: { id: 'ch3_weapons_smuggle', label: 'Two-Sided Arms Trade', cost: 350, monthlyCashflow: 120, sector: 'military' },
    accept: {
      id: 'smuggle_weapons',
      label: 'Sell arms to both armies (350g)',
      effects: [{ kind: 'flag', id: 'arms_dealer', set: 1 }, { kind: 'narrate', text: 'Your wagons slip to both armies. The money pours in. You try not to think about what it pays for.' }, heat('war')],
    },
    decline: { id: 'refuse_weapons', label: 'Refuse: that\'s too far', text: 'He taps his nose again and goes looking for someone less fussy.' },
  }),
  venture({
    id: 'ch3_medical_supplies_smuggle',
    weight: 3,
    title: 'Bandages for Both Armies',
    body: ['A healer with a satchel of herbs makes an offer. "Both armies need bandages and medicine. They\'ll pay a lot. Help me sell to them."'],
    asset: { id: 'ch3_medical_supplies', label: 'Military Medical Supply Network', cost: 280, monthlyCashflow: 85, sector: 'military' },
    accept: {
      id: 'sell_medical',
      label: 'Sell the medicine (280g)',
      effects: [{ kind: 'stat', stat: 'charm', delta: 1 }, { kind: 'narrate', text: 'Your medicine helps soldiers on both sides get better. And it pays well.' }],
    },
    decline: { id: 'refuse_medical', label: 'Not today', text: 'The healer finds another partner.' },
  }),
  venture({
    id: 'ch3_military_food_contract',
    weight: 3,
    title: 'Soup for the Soldiers',
    body: ['A round quartermaster pats his belly. "War or no war, soldiers get hungry! Supply my kitchens, and I pay every month. 320 gold gets you started."'],
    asset: { id: 'ch3_food_supplier', label: 'Military Food Supplier', cost: 320, monthlyCashflow: 95, sector: 'military' },
    accept: {
      id: 'food_contract',
      label: 'Supply the kitchens (320g)',
      effects: [{ kind: 'narrate', text: 'Big pots of soup bubble in every camp. Your wagons keep them full.' }],
    },
    decline: { id: 'refuse_food', label: 'Not today', text: 'The quartermaster finds another supplier.' },
  }),
  venture({
    id: 'ch3_intelligence_selling',
    weight: 2,
    title: 'Buying Your Ears',
    body: ['Two men in long coats corner you. "You travel a lot," says one. "You hear things. We\'d pay well to hear them too."'],
    asset: { id: 'ch3_intel_broker', label: 'Military Intelligence Broker', cost: 290, monthlyCashflow: 70, sector: 'military' },
    accept: {
      id: 'sell_intelligence',
      label: 'Trade in secrets (290g to set up)',
      effects: [{ kind: 'flag', id: 'spy_network', set: 1 }, { kind: 'narrate', text: 'Secrets are your new trade now. Get one wrong, and people could get hurt.' }, heat('war')],
    },
    decline: { id: 'refuse_intel', label: 'Keep your ears to yourself', text: 'They tip their hats and vanish into the crowd.' },
  }),
  venture({
    id: 'ch3_transport_logistics',
    weight: 3,
    title: 'Wagons for the Army',
    body: ['The army needs wagons to carry supplies between camps, far behind the lines. "Safe roads, good pay," says the sergeant. "310 gold buys the wagons."'],
    asset: { id: 'ch3_transport', label: 'Military Transport Service', cost: 310, monthlyCashflow: 80, sector: 'military' },
    accept: {
      id: 'transport_service',
      label: 'Buy the wagons (310g)',
      effects: [{ kind: 'narrate', text: 'Your wagons rumble between the camps all day. Safe, steady work.' }],
    },
    decline: { id: 'refuse_transport', label: 'Not today', text: 'The sergeant finds someone else with wagons.' },
  }),
]

export const chapter3WarScenarioCards: StoryCard[] = [
  {
    id: 'ch3_soldier_deserter',
    weight: 3,
    once: true,
    title: 'A Runaway Soldier',
    body: ['A young soldier stumbles into your shop, shaking. "I can\'t go back to the war," he whispers. "Please, help me get away. I have 60 gold."'],
    choices: [
      {
        id: 'help_deserter',
        label: 'Help him get away',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'flag', id: 'soldier_helped', set: 1 },
          { kind: 'narrate', text: 'You hide him in a hay cart heading south. He mouths "thank you" as it rolls away.' },
        ],
      },
      {
        id: 'turn_in_deserter',
        label: 'Turn him in (+150g reward)',
        effects: [
          { kind: 'gold', delta: 150 },
          { kind: 'stat', stat: 'charm', delta: -2 },
          { kind: 'flag', id: 'deserter_informant', set: 1 },
          { kind: 'narrate', text: 'The guards drag him away. They hand you a reward. It feels heavy in your hand.' },
        ],
      },
    ],
  },
  {
    id: 'ch3_refugee_family_encounter',
    weight: 2,
    once: true,
    title: 'A Family at Your Door',
    body: ['A tired family knocks at your door in the rain: a mother, a father, and 2 small children. "We have 30 gold," says the mother. "Is that enough for a roof?"'],
    choices: [
      {
        id: 'shelter_refugees',
        label: 'Let them in for free',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'flag', id: 'refugee_harborer', set: 1 },
          { kind: 'narrate', text: 'The children fall asleep by your fire. In times like these, kindness is brave.' },
        ],
      },
      {
        id: 'exploit_refugees',
        label: 'Let them in for 80 gold',
        requires: [{ kind: 'goldAtLeast', amount: 50 }],
        effects: [
          { kind: 'gold', delta: 80 },
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'narrate', text: 'They scrape together the gold. They are safe, but they have nothing left.' },
          heat('war'),
        ],
      },
    ],
  },
  {
    id: 'ch3_officer_proposition',
    weight: 2,
    once: true,
    title: 'The Officer\'s Secret Plan',
    body: ['An officer with shiny buttons leans close. "I\'m running away with the army\'s pay chest," he whispers. "I need someone to hide the gold. You\'ll get a share."'],
    choices: [
      {
        id: 'help_officer',
        label: 'Hide the gold for him',
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'flag', id: 'officer_partner', set: 1 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'You help him steal the army\'s pay. The risk is huge. So is your share.' },
        ],
      },
      {
        id: 'refuse_officer',
        label: 'Refuse',
        effects: [{ kind: 'narrate', text: 'He storms off, red-faced. You have made a powerful enemy.' }],
      },
    ],
  },
  {
    id: 'ch3_battle_witness',
    weight: 3,
    once: true,
    title: 'What Did You See?',
    body: ['From a hilltop, you watched the great battle below: smoke, banners, and a terrible mess. Now the winning general rides up. "You saw it all," he says. "What will you tell people?"'],
    choices: [
      {
        id: 'tell_truth',
        label: 'Tell the truth',
        effects: [
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'flag', id: 'truth_teller', set: 1 },
          { kind: 'narrate', text: 'You tell everyone what really happened. The general is not pleased.' },
        ],
      },
      {
        id: 'tell_propaganda',
        label: 'Tell his version (+120g)',
        effects: [
          { kind: 'gold', delta: 120 },
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'flag', id: 'propaganda_spreader', set: 1 },
          { kind: 'narrate', text: 'You tell his heroic version instead. He pays well. The truth fades away.' },
        ],
      },
    ],
  },
]

export const chapter3WarEconomyCards: StoryCard[] = [
  {
    id: 'ch3_armistice_threat',
    weight: 4,
    once: true,
    title: 'Peace Is Coming',
    body: ['Church bells ring out: peace talks have begun! Everyone cheers. But if the war ends, your war contracts end too.'],
    choices: [
      {
        id: 'liquidate_assets',
        label: 'Sell your war business now (+300g)',
        effects: [
          { kind: 'gold', delta: 300 },
          { kind: 'narrate', text: 'You sell before the peace arrives. Clever, if a little cold.' },
        ],
      },
      {
        id: 'sabotage_peace',
        label: 'Pay to spoil the peace talks (-180g)',
        requires: [{ kind: 'goldAtLeast', amount: 180 }],
        effects: [
          { kind: 'gold', delta: -180 },
          { kind: 'flag', id: 'war_profiteer', set: 1 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'narrate', text: 'You pay troublemakers to wreck the peace talks. The war drags on, and so does the suffering.' },
          heat('war'),
        ],
      },
    ],
  },
  {
    id: 'ch3_enemy_territory_trade',
    weight: 3,
    once: true,
    title: 'Across the Lines',
    body: ['Both armies want things only the other side has. A secret path through the marshes could carry them across, for anyone brave enough to try.'],
    choices: [
      {
        id: 'smuggle_enemy',
        label: 'Make the secret run (+220g)',
        effects: [
          { kind: 'gold', delta: 220 },
          { kind: 'stat', stat: 'nerve', delta: 1 },
          { kind: 'flag', id: 'enemy_smuggler', set: 1 },
          { kind: 'narrate', text: 'You creep through the marsh at night and back again. Your heart is pounding, but your purse is full.' },
          heat('war'),
        ],
      },
      {
        id: 'stay_safe',
        label: 'Too dangerous',
        effects: [{ kind: 'narrate', text: 'Someone braver takes the risk, and the reward.' }],
      },
    ],
  },
  {
    id: 'ch3_inflation_surge',
    weight: 3,
    once: true,
    title: 'Prices Go Wild',
    body: ['A loaf of bread cost 1 coin last week. Today it costs 3! The war has made money worth less and less. Things you can touch, like goods and buildings, are what hold their value now.'],
    choices: [
      {
        id: 'invest_goods',
        label: 'Turn your gold into goods (+250g profit)',
        requires: [{ kind: 'goldAtLeast', amount: 100 }],
        effects: [
          { kind: 'gold', delta: 250 },
          { kind: 'stat', stat: 'savvy', delta: 1 },
          { kind: 'narrate', text: 'You buy goods before your gold shrinks any further. Smart move!' },
        ],
      },
      {
        id: 'keep_gold',
        label: 'Keep your gold (it buys less each day)',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'Your gold buys less and less each week. A costly mistake.' },
        ],
      },
    ],
  },
]

export const chapter3WarDangerCards: StoryCard[] = [
  {
    id: 'ch3_army_requisition',
    weight: 4,
    once: true,
    title: 'The Army Takes Your Goods',
    body: ['Soldiers load your sacks and barrels onto ox carts. A quartermaster scribbles a receipt. "For the war," he says. "Your country thanks you."'],
    choices: [
      {
        id: 'comply_seizure',
        label: 'Let them take it',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'narrate', text: 'Your goods roll away to feed the army. The receipt is worth nothing.' },
        ],
      },
      {
        id: 'hide_goods',
        label: 'Hide your best goods (Savvy check, DC 14)',
        check: {
          stat: 'savvy',
          dc: 14,
          success: { text: 'Your best barrels stay hidden under the floorboards. The soldiers only take the rest.', effects: [{ kind: 'stat', stat: 'savvy', delta: 1 }] },
          failure: { text: 'They find the hidden barrels, and fine you for trying.', effects: [{ kind: 'gold', delta: -400 }] },
        },
      },
      favour('crown', {
        id: 'show_royal_papers',
        label: 'Show your royal papers',
        effects: [{ kind: 'narrate', text: 'The sergeant reads the royal seal, salutes, and moves on to the next warehouse.' }],
      }),
    ],
  },
  {
    id: 'ch3_caught_trading_enemies',
    weight: 3,
    once: true,
    title: 'Caught Red-Handed',
    body: ['Guards burst through your door. They know you\'ve been selling to the enemy. A judge in a tall wig wants to make an example of you.'],
    choices: [
      {
        id: 'bribe_judges',
        label: 'Bribe the judge (-350g)',
        requires: [{ kind: 'goldAtLeast', amount: 350 }],
        effects: [
          { kind: 'gold', delta: -350 },
          { kind: 'flag', id: 'traitor_bought_freedom', set: 1 },
          { kind: 'narrate', text: 'The judge pockets the gold and finds you innocent. It is not fair, but you are free.' },
        ],
      },
      {
        id: 'flee_country',
        label: 'Flee the country',
        effects: [
          { kind: 'flag', id: 'political_exile', set: 1 },
          { kind: 'gold', delta: -200 },
          { kind: 'advanceDays', days: 30 },
          { kind: 'narrate', text: 'You escape out the back window with only the clothes you wear.' },
        ],
      },
    ],
  },
  {
    id: 'ch3_ambush_on_supply_run',
    weight: 3,
    once: true,
    title: 'Ambush on the Forest Road',
    body: ['A tree crashes across the forest road. Bandits leap out from the bushes and surround your wagons. "Hand over the goods," their leader shouts, "and nobody gets hurt!"'],
    choices: [
      {
        id: 'surrender_supplies',
        label: 'Hand over the goods (-250g)',
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'narrate', text: 'They take every crate. But you and your drivers are safe.' },
        ],
      },
      {
        id: 'fight_back',
        label: 'Fight them off (Grit check, DC 15)',
        check: {
          stat: 'grit',
          dc: 15,
          success: { text: 'You and your drivers drive the bandits back into the trees!', effects: [{ kind: 'stat', stat: 'grit', delta: 2 }] },
          failure: { text: 'The bandits win. They take the goods, and several of your drivers are hurt.', effects: [{ kind: 'stat', stat: 'grit', delta: -1 }, { kind: 'gold', delta: -400 }] },
        },
      },
    ],
  },
  {
    id: 'ch3_informant_demands',
    weight: 2,
    once: true,
    title: 'The Informant Wants More',
    body: ['Your old informant slides a folded letter across the tavern table. "I know all your secrets," he says. "Pay me more, or the Watch will know them too."'],
    choices: [
      {
        id: 'pay_blackmail',
        label: 'Pay him (-150g)',
        requires: [{ kind: 'goldAtLeast', amount: 150 }],
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'You pay. But you know he will be back for more.' },
        ],
      },
      {
        id: 'silence_informant',
        label: 'Scare him out of town (Nerve check, DC 16)',
        check: {
          stat: 'nerve',
          dc: 16,
          success: { text: 'He takes the first ship out of Vessarin. Your secrets sail away with him.', effects: [{ kind: 'stat', stat: 'nerve', delta: 2 }, { kind: 'flag', id: 'murderer', set: 1 }] },
          failure: { text: 'He is not scared at all. He goes straight to the Watch.', effects: [{ kind: 'flag', id: 'political_exile', set: 1 }] },
        },
      },
    ],
  },
]

export const chapter3RecoveryCards: StoryCard[] = [
  {
    id: 'ch3_neutral_city_escape',
    weight: 2,
    once: true,
    title: 'The Peaceful City',
    body: ['Beyond the hills lies a city that refuses to take sides. Its gates open for you. "No war here," says the gatekeeper. "Rest a while."'],
    choices: [
      {
        id: 'escape_neutral',
        label: 'Rest and recover',
        effects: [
          { kind: 'advanceDays', days: 15 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'For a little while, there is peace. You know it cannot last, but it feels wonderful.' },
        ],
      },
    ],
  },
]
