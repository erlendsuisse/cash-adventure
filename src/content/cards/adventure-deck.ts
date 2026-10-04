import type { StoryCard } from '../../engine/types'

// D&D-style adventure cards for climbing phase
// Real quests, challenges, mysteries, and discoveries

const temple_discovery: StoryCard = {
  id: 'temple_discovery',
  weight: 5,
  storyPhase: 'climbing',
  title: 'The Overgrown Temple',
  body: [
    'Deep in the woods, you find a temple wrapped in vines. A woodcutter whispers: "Treasure sleeps in there. So do curses."',
  ],
  choices: [
    {
      id: 'explore_temple',
      label: 'Explore inside (Grit check, DC 14)',
      check: {
        stat: 'grit',
        dc: 14,
        success: {
          text: 'Through dusty halls and spider webs, you find golden treasures worth 200 gold!',
          effects: [
            { kind: 'gold', delta: 200 },
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
        failure: {
          text: 'Floors crumble and doors slam shut. You only just escape.',
          effects: [{ kind: 'advanceDays', days: 3 }],
        },
      },
    },
    {
      id: 'avoid_temple',
      label: 'Leave it alone',
      effects: [{ kind: 'narrate', text: 'Some mysteries are better left alone.' }],
    },
  ],
}

const bandit_encounter: StoryCard = {
  id: 'bandit_encounter',
  weight: 5,
  storyPhase: 'climbing',
  title: 'Bandits on the Road',
  body: [
    'Bandits jump out onto the road. Their leader, with an eye patch and a nasty grin, holds out his hand. "Your purse," he growls. "Or else."',
  ],
  choices: [
    {
      id: 'fight_bandits',
      label: 'Stand your ground (Nerve check, DC 15)',
      check: {
        stat: 'nerve',
        dc: 15,
        success: {
          text: 'You raise your walking stick and roar. The bandits look at each other, then scatter into the trees!',
          effects: [
            { kind: 'stat', stat: 'nerve', delta: 2 },
            { kind: 'flag', id: 'proved_courage', set: 1 },
            { kind: 'advanceDays', days: 2 },
          ],
        },
        failure: {
          text: 'They grab you and take 100 gold. At least you get away.',
          effects: [
            { kind: 'gold', delta: -100 },
            { kind: 'advanceDays', days: 3 },
          ],
        },
      },
    },
    {
      id: 'negotiate_bandits',
      label: 'Talk your way out (Charm check, DC 13)',
      check: {
        stat: 'charm',
        dc: 13,
        success: {
          text: 'You talk them round, and even sell them some supplies at a profit!',
          effects: [
            { kind: 'gold', delta: 80 },
            { kind: 'stat', stat: 'charm', delta: 1 },
            { kind: 'advanceDays', days: 2 },
          ],
        },
        failure: {
          text: 'They take 50 gold as a "road tax".',
          effects: [
            { kind: 'gold', delta: -50 },
            { kind: 'advanceDays', days: 2 },
          ],
        },
      },
    },
    {
      id: 'pay_bandits',
      label: 'Pay them 100 gold and move on',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'narrate', text: 'You pay, and continue on your way.' },
        { kind: 'advanceDays', days: 1 },
      ],
    },
  ],
}

const mystery_murder: StoryCard = {
  id: 'mystery_murder',
  weight: 5,
  storyPhase: 'climbing',
  title: 'The Locked-Room Mystery',
  body: [
    'The richest merchant in the guild has been robbed, from a room locked on the inside! The Watch is baffled. His daughter comes to you. "You\'re clever," she says. "Find the thief, and I\'ll reward you well."',
  ],
  choices: [
    {
      id: 'solve_murder',
      label: 'Solve the mystery (Savvy check, DC 15)',
      check: {
        stat: 'savvy',
        dc: 15,
        success: {
          text: 'A loose window latch, a muddy footprint, a rival\'s missing button. You solve it! She pays you 250 gold.',
          effects: [
            { kind: 'gold', delta: 250 },
            { kind: 'stat', stat: 'savvy', delta: 2 },
            { kind: 'flag', id: 'solved_murder', set: 1 },
            { kind: 'advanceDays', days: 8 },
          ],
        },
        failure: {
          text: 'The clues lead nowhere. She thanks you, disappointed.',
          effects: [{ kind: 'advanceDays', days: 4 }],
        },
      },
    },
    {
      id: 'decline_murder',
      label: 'Leave it to the Watch',
      effects: [{ kind: 'narrate', text: 'You have enough mysteries of your own.' }],
    },
  ],
}

const dragon_sighting: StoryCard = {
  id: 'dragon_sighting',
  weight: 5,
  storyPhase: 'climbing',
  title: 'A Dragon in the Mountains',
  body: [
    'Shepherds run into town, white as sheets. A dragon has been seen in the mountains! Caravans refuse to travel, and merchants are hiring adventurers.',
  ],
  choices: [
    {
      id: 'hire_dragon_hunters',
      label: 'Hire dragon hunters (-200g)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'wages', delta: 30 },
        { kind: 'narrate', text: 'The hunters chase the dragon far away. Caravans roll again, and trade booms.' },
        { kind: 'advanceDays', days: 10 },
      ],
    },
    {
      id: 'wait_dragon',
      label: 'Wait for it to fly away',
      effects: [
        { kind: 'narrate', text: 'You wait. One morning, the dragon flies off over the sea.' },
        { kind: 'advanceDays', days: 12 },
      ],
    },
  ],
}

const treasure_map: StoryCard = {
  id: 'treasure_map_quest',
  weight: 5,
  storyPhase: 'climbing',
  title: 'A Treasure Map',
  body: [
    'A sailor who smells of seaweed sells you a crumpled map for 10 gold. "X marks the spot," he winks. It shows an island with a skull and crossbones. Junk, or a fortune?',
  ],
  choices: [
    {
      id: 'fund_expedition',
      label: 'Send a treasure ship (-150g)',
      requires: [{ kind: 'goldAtLeast', amount: 150 }],
      check: {
        stat: 'nerve',
        dc: 13,
        success: {
          text: 'Your ship returns with a real treasure chest: gold, jewels and a crown! You profit 400 gold.',
          effects: [
            { kind: 'gold', delta: 400 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'advanceDays', days: 20 },
          ],
        },
        failure: {
          text: 'The island is just sand and one confused parrot. You lose the 150 gold.',
          effects: [
            { kind: 'gold', delta: -150 },
            { kind: 'advanceDays', days: 15 },
          ],
        },
      },
    },
    {
      id: 'ignore_map',
      label: 'It\'s probably fake',
      effects: [{ kind: 'narrate', text: 'You toss the map in a drawer. Probably for the best.' }],
    },
  ],
}

const haunted_house: StoryCard = {
  id: 'haunted_house',
  weight: 5,
  storyPhase: 'climbing',
  title: 'The Haunted Manor',
  body: [
    'A nervous noble offers you a grand old manor, very cheap. "People say it\'s haunted," he admits, glancing over his shoulder. "But it\'s worth a fortune to someone brave."',
  ],
  choices: [
    {
      id: 'investigate_haunting',
      label: 'Spend a night there (Nerve check, DC 12)',
      check: {
        stat: 'nerve',
        dc: 12,
        success: {
          text: 'The "ghost" is just an old clockwork organ in the attic! You buy the manor for a steal, 300 gold.',
          effects: [
            { kind: 'acquireAsset', asset: { id: 'manor_estate', label: 'Manor Estate', cost: 300, monthlyCashflow: 35, sector: 'property' } },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'advanceDays', days: 4 },
          ],
        },
        failure: {
          text: 'Doors creak, candles flicker, and something moans in the walls. You run out before midnight.',
          effects: [{ kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'avoid_manor',
      label: 'No thank you',
      effects: [{ kind: 'narrate', text: 'Some bargains are too spooky, whatever the price.' }],
    },
  ],
}

const dragon_rider: StoryCard = {
  id: 'dragon_rider_ally',
  weight: 5,
  storyPhase: 'climbing',
  title: 'The Dragon Rider',
  body: [
    'The crowd gasps as a rider lands in the square on a shimmering green dragon. "We guard caravans," she calls. "No bandit dares come near us!"',
  ],
  choices: [
    {
      id: 'hire_dragon_rider',
      label: 'Hire her (-120g/month)',
      effects: [
        { kind: 'expense', delta: 120 },
        { kind: 'flag', id: 'dragon_rider_ally', set: 1 },
        { kind: 'narrate', text: 'With a dragon flying over your wagons, the roads have never felt safer.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'decline_dragon',
      label: 'Too expensive',
      effects: [{ kind: 'narrate', text: 'You watch the dragon soar away. Maybe you made a mistake.' }],
    },
  ],
}

const plague_quest: StoryCard = {
  id: 'plague_cure',
  weight: 5,
  storyPhase: 'climbing',
  title: 'A Cure for the Fever',
  body: [
    'A young healer holds up a glowing green vial. "I think I\'ve found a cure for the fever!" she says. "I need 200 gold to make more. Help me save the city!"',
  ],
  choices: [
    {
      id: 'fund_cure',
      label: 'Fund the cure (-200g)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'flag', id: 'city_savior', set: 1 },
        { kind: 'narrate', text: 'It works! The city is saved, and your name becomes a legend.' },
        { kind: 'advanceDays', days: 12 },
      ],
    },
    {
      id: 'ignore_plague',
      label: 'Not your problem',
      effects: [{ kind: 'narrate', text: 'You keep your gold and hope someone else helps.' }],
    },
  ],
}

const ancient_tome: StoryCard = {
  id: 'ancient_tome',
  weight: 5,
  storyPhase: 'climbing',
  title: 'The Ancient Book',
  body: [
    'A scholar shows you a huge, crackly old book with a lock on the cover. "It tells the secrets of the Colossi," she whispers. "120 gold."',
  ],
  choices: [
    {
      id: 'buy_tome',
      label: 'Buy the book (-120g)',
      requires: [{ kind: 'goldAtLeast', amount: 120 }],
      effects: [
        { kind: 'gold', delta: -120 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'flag', id: 'knows_colossus_lore', set: 1 },
        { kind: 'narrate', text: 'You read late into the night. The secrets are fascinating, and a little frightening.' },
        { kind: 'advanceDays', days: 5 },
      ],
    },
    {
      id: 'skip_tome',
      label: 'Too pricey',
      effects: [{ kind: 'narrate', text: 'You keep your gold. The secrets stay locked.' }],
    },
  ],
}

export const adventureDeckCards: StoryCard[] = [
  temple_discovery,
  bandit_encounter,
  mystery_murder,
  dragon_sighting,
  treasure_map,
  haunted_house,
  dragon_rider,
  plague_quest,
  ancient_tome,
]
