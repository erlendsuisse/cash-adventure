import type { StoryCard } from '../../engine/types'

// D&D-style adventure cards for climbing phase
// Real quests, challenges, mysteries, and discoveries

const temple_discovery: StoryCard = {
  id: 'temple_discovery',
  weight: 5,
  storyPhase: 'climbing',
  title: 'Ancient Temple Discovered',
  body: [
    'Exploring beyond the city, you stumble upon an overgrown temple. Locals speak of it in hushed tones. "Treasure is said to rest there," one says, "but also curses."',
  ],
  choices: [
    {
      id: 'explore_temple',
      label: 'Enter and explore (Grit check, DC 14)',
      check: {
        stat: 'grit',
        dc: 14,
        success: {
          text: 'You navigate the ancient halls. You find valuable artifacts worth 200 gold.',
          effects: [
            { kind: 'gold', delta: 200 },
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
        failure: {
          text: 'The temple is more dangerous than expected. You escape with your life, barely.',
          effects: [{ kind: 'advanceDays', days: 3 }],
        },
      },
    },
    {
      id: 'avoid_temple',
      label: 'Leave it undisturbed',
      effects: [{ kind: 'narrate', text: 'Some mysteries are better left unsolved.' }],
    },
  ],
}

const bandit_encounter: StoryCard = {
  id: 'bandit_encounter',
  weight: 5,
  storyPhase: 'climbing',
  title: 'Bandits on the Road',
  body: [
    'A gang of bandits blocks your path. Their leader steps forward, scarred and dangerous. "Your purse or your blood," he growls.',
  ],
  choices: [
    {
      id: 'fight_bandits',
      label: 'Stand and fight (Nerve check, DC 15)',
      check: {
        stat: 'nerve',
        dc: 15,
        success: {
          text: 'You draw steel. The bandits hesitate. Your confidence shakes them. They scatter.',
          effects: [
            { kind: 'stat', stat: 'nerve', delta: 2 },
            { kind: 'flag', id: 'proved_courage', set: 1 },
            { kind: 'advanceDays', days: 2 },
          ],
        },
        failure: {
          text: 'They overpower you. You lose 100 gold but escape with your life.',
          effects: [
            { kind: 'gold', delta: -100 },
            { kind: 'advanceDays', days: 3 },
          ],
        },
      },
    },
    {
      id: 'negotiate_bandits',
      label: 'Negotiate (Charm check, DC 13)',
      check: {
        stat: 'charm',
        dc: 13,
        success: {
          text: 'You talk them into letting you pass. You even sell them supplies at profit.',
          effects: [
            { kind: 'gold', delta: 80 },
            { kind: 'stat', stat: 'charm', delta: 1 },
            { kind: 'advanceDays', days: 2 },
          ],
        },
        failure: {
          text: 'They take 50 gold as a tax for safe passage.',
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
        { kind: 'narrate', text: 'You pay the toll and continue your journey.' },
        { kind: 'advanceDays', days: 1 },
      ],
    },
  ],
}

const mystery_murder: StoryCard = {
  id: 'mystery_murder',
  weight: 5,
  storyPhase: 'climbing',
  title: 'A Murder in the Guild',
  body: [
    'A prominent merchant has been murdered. The city guard is baffled. The merchant\'s widow approaches you: "You have a sharp mind. Find my husband\'s killer, and I\'ll reward you handsomely."',
  ],
  choices: [
    {
      id: 'solve_murder',
      label: 'Investigate the murder (Savvy check, DC 15)',
      check: {
        stat: 'savvy',
        dc: 15,
        success: {
          text: 'You piece together the clues. The killer was a business rival. Justice served, the widow pays 250 gold.',
          effects: [
            { kind: 'gold', delta: 250 },
            { kind: 'stat', stat: 'savvy', delta: 2 },
            { kind: 'flag', id: 'solved_murder', set: 1 },
            { kind: 'advanceDays', days: 8 },
          ],
        },
        failure: {
          text: 'The case remains unsolved. The widow is disappointed.',
          effects: [{ kind: 'advanceDays', days: 4 }],
        },
      },
    },
    {
      id: 'decline_murder',
      label: 'Decline to investigate',
      effects: [{ kind: 'narrate', text: 'You have enough problems of your own.' }],
    },
  ],
}

const dragon_sighting: StoryCard = {
  id: 'dragon_sighting',
  weight: 5,
  storyPhase: 'climbing',
  title: 'Dragon Sighting',
  body: [
    'Panicked reports arrive: a dragon has been seen in the mountains near the city. Trade routes are closing. Merchants are hiring adventurers for protection.',
  ],
  choices: [
    {
      id: 'hire_dragon_hunters',
      label: 'Hire dragon hunters (-200 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'wages', delta: 30 },
        { kind: 'narrate', text: 'With the dragon threat contained, trade flourishes.' },
        { kind: 'advanceDays', days: 10 },
      ],
    },
    {
      id: 'wait_dragon',
      label: 'Wait for the dragon to pass',
      effects: [
        { kind: 'narrate', text: 'You stay put. Eventually the creature moves on.' },
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
    'A drunk sailor sells you a crumpled map for 10 gold. "X marks the spot," he slurs. The map shows an island, marked with a skull and crossbones. It might be worthless—or it might be a fortune.',
  ],
  choices: [
    {
      id: 'fund_expedition',
      label: 'Fund a treasure expedition (-150 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 150 }],
      check: {
        stat: 'nerve',
        dc: 13,
        success: {
          text: 'Against the odds, the expedition succeeds. Gold, jewels, and artifacts are recovered. You profit 400 gold.',
          effects: [
            { kind: 'gold', delta: 400 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'advanceDays', days: 20 },
          ],
        },
        failure: {
          text: 'The expedition fails. The map was false. You lose the 150 gold investment.',
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
      effects: [{ kind: 'narrate', text: 'You toss the map aside. Some people learn the hard way.' }],
    },
  ],
}

const haunted_house: StoryCard = {
  id: 'haunted_house',
  weight: 5,
  storyPhase: 'climbing',
  title: 'A Haunted Manor',
  body: [
    'A noble offers to sell you a grand manor—suspiciously cheap. "People say it\'s haunted," they admit nervously. "But it could be worth a fortune to someone brave."',
  ],
  choices: [
    {
      id: 'investigate_haunting',
      label: 'Spend a night investigating (Nerve check, DC 12)',
      check: {
        stat: 'nerve',
        dc: 12,
        success: {
          text: 'You discover the "haunting" is just an old mechanism. You buy the manor at a steal for 300 gold.',
          effects: [
            { kind: 'acquireAsset', asset: { id: 'manor_estate', label: 'Manor Estate', cost: 300, monthlyCashflow: 35, sector: 'property' } },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'advanceDays', days: 4 },
          ],
        },
        failure: {
          text: 'The terrors you witness convince you the manor is truly cursed. You leave, shaken.',
          effects: [{ kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'avoid_manor',
      label: 'Too risky',
      effects: [{ kind: 'narrate', text: 'Some deals are too dangerous, no matter the profit.' }],
    },
  ],
}

const dragon_rider: StoryCard = {
  id: 'dragon_rider_ally',
  weight: 5,
  storyPhase: 'climbing',
  title: 'A Dragon Rider',
  body: [
    'A mysterious figure rides into the city on a dragon. They seek merchants willing to hire them as protectors. "My mount is magnificent. We keep bandits and beasts at bay."',
  ],
  choices: [
    {
      id: 'hire_dragon_rider',
      label: 'Hire them (-120 gold/month)',
      effects: [
        { kind: 'expense', delta: 120 },
        { kind: 'flag', id: 'dragon_rider_ally', set: 1 },
        { kind: 'narrate', text: 'With a dragon at your back, the roads feel safer.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'decline_dragon',
      label: 'Too expensive',
      effects: [{ kind: 'narrate', text: 'You watch them ride away, wondering if you made a mistake.' }],
    },
  ],
}

const plague_quest: StoryCard = {
  id: 'plague_cure',
  weight: 5,
  storyPhase: 'climbing',
  title: 'A Plague Cure',
  body: [
    'A healer claims to have discovered a cure for a spreading plague. They need 200 gold to produce it. "Help me save this city, and history will remember your name."',
  ],
  choices: [
    {
      id: 'fund_cure',
      label: 'Fund the cure (-200 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'flag', id: 'city_savior', set: 1 },
        { kind: 'narrate', text: 'The city is saved. Your name becomes legend.' },
        { kind: 'advanceDays', days: 12 },
      ],
    },
    {
      id: 'ignore_plague',
      label: 'Not your concern',
      effects: [{ kind: 'narrate', text: 'You focus on profit, not charity.' }],
    },
  ],
}

const ancient_tome: StoryCard = {
  id: 'ancient_tome',
  weight: 5,
  storyPhase: 'climbing',
  title: 'An Ancient Tome',
  body: [
    'A scholar offers you an ancient book filled with knowledge and prophecies. "This could reveal the nature of the Colossi," they say. "But it costs 120 gold."',
  ],
  choices: [
    {
      id: 'buy_tome',
      label: 'Buy the tome (-120 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 120 }],
      effects: [
        { kind: 'gold', delta: -120 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'flag', id: 'knows_colossus_lore', set: 1 },
        { kind: 'narrate', text: 'The tome\'s secrets fill you with understanding and dread.' },
        { kind: 'advanceDays', days: 5 },
      ],
    },
    {
      id: 'skip_tome',
      label: 'Knowledge has its price',
      effects: [{ kind: 'narrate', text: 'You save your gold and remain ignorant.' }],
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
