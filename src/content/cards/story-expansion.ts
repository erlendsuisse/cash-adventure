import type { StoryCard } from '../../engine/types'

// ===== RECURRING NPCs =====
// These characters appear multiple times with evolving relationships

const captain_vex_intro: StoryCard = {
  id: 'captain_vex_intro',
  title: 'Captain Vex at the Harbor',
  weight: 2,
  storyPhase: 'climbing',
  body: [
    'A boot thumps onto the crate beside you. Captain Vex: eye patch, salt-white beard, and a grin full of gold teeth. Everyone on the docks knows his name.',
    'His crew would sail into a storm for him. His enemies would rather not talk about him at all.',
    '"I need a merchant with nerve," he growls, "who can keep a secret. Fancy getting rich the fast way?"',
  ],
  choices: [
    {
      id: 'vex_accept',
      label: 'Shake the captain\'s hand',
      effects: [
        { kind: 'flag', id: 'vex_relationship', set: 1 },
        { kind: 'wages', delta: 10 },
      ],
    },
    { id: 'vex_decline', label: 'Turn him down', effects: [] },
  ],
}

const captain_vex_heist: StoryCard = {
  id: 'captain_vex_heist',
  title: 'A Risky Cargo Run',
  weight: 1,
  requires: [{ kind: 'flag', id: 'vex_relationship', atLeast: 1 }],
  storyPhase: 'climbing',
  body: [
    'Vex unrolls a bolt of shimmering silk. "A whole hold of this," he says, "and the city guards must never see it."',
    '"Get it past the checkpoint, and 200 gold is yours. If the guards ask questions," he winks, "answer well."',
  ],
  choices: [
    {
      id: 'vex_cargo_honest',
      label: 'Charm the guards (Charm check, DC 14)',
      check: {
        stat: 'charm',
        dc: 14,
        success: {
          text: 'You chat with the guards about their children and the weather. They wave the cart through! Vex roars with laughter.',
          effects: [
            { kind: 'gold', delta: 200 },
            { kind: 'flag', id: 'vex_relationship', delta: 1 },
            { kind: 'stat', stat: 'charm', delta: 1 },
          ],
          goto: 'vex_heist_success',
        },
        failure: {
          text: 'The guards start poking at the crates. You barely get away, empty-handed. Vex is not pleased.',
          effects: [
            { kind: 'flag', id: 'vex_relationship', delta: -1 },
            { kind: 'flag', id: 'heat_level', delta: 1 },
          ],
          goto: 'vex_heist_failure',
        },
      },
    },
    {
      id: 'vex_cargo_nerve',
      label: 'Sneak past the guards (Nerve check, DC 16)',
      check: {
        stat: 'nerve',
        dc: 16,
        success: {
          text: 'You slip through in the fog without a sound. Vex claps you on the back. "Now that\'s a partner!"',
          effects: [
            { kind: 'gold', delta: 300 },
            { kind: 'flag', id: 'vex_relationship', delta: 2 },
            { kind: 'stat', stat: 'nerve', delta: 2 },
          ],
          goto: 'vex_heist_success',
        },
        failure: {
          text: 'A guard spots you! You escape, but the silk is lost, and so is Vex\'s trust.',
          effects: [
            { kind: 'flag', id: 'vex_relationship', set: 0 },
            { kind: 'flag', id: 'heat_level', delta: 2 },
          ],
          goto: 'vex_heist_failure',
        },
      },
    },
    { id: 'vex_refuse_cargo', label: 'Refuse the job', effects: [{ kind: 'flag', id: 'vex_relationship', delta: -1 }] },
  ],
}

const vex_heist_success: StoryCard = {
  id: 'vex_heist_success',
  title: 'One of the Crew',
  body: [
    'Vex pours two mugs of hot cider and slides one to you. "You\'ve got salt in your blood," he says. "There\'s a place in my crew for you."',
    'Regular work means regular coin. It also means the Watch will be watching you more closely.',
  ],
  choices: [{ id: 'continue_vex', label: 'Raise your mug', effects: [] }],
}

const vex_heist_failure: StoryCard = {
  id: 'vex_heist_failure',
  title: 'A Cold Shoulder',
  body: ['The silk is gone, and Vex barely looks at you now. Trust, once lost, takes a long time to win back.'],
  choices: [{ id: 'continue_failed', label: 'Move on', effects: [] }],
}

// ===== QUEST CHAINS =====
// Multi-card sequences that unfold over time

const lord_aldric_intro: StoryCard = {
  id: 'lord_aldric_intro',
  title: 'Lord Aldric\'s Problem',
  weight: 2,
  storyPhase: 'climbing',
  body: [
    'In the guild hall, a nobleman in a velvet coat taps your shoulder with a silver-topped cane. Lord Aldric, one of the richest merchants in Vessarin.',
    '"Someone is selling cheaper than me," he says, lips tight. "I want to know who, and how. Legally, of course."',
    'He drops a jingling pouch on the table. "Find out for me, and there\'s 150 more."',
  ],
  choices: [
    {
      id: 'aldric_accept',
      label: 'Take the job',
      effects: [
        { kind: 'gold', delta: 50 },
        { kind: 'flag', id: 'aldric_quest', set: 1 },
      ],
    },
    { id: 'aldric_decline', label: 'Politely decline', effects: [] },
  ],
}

const aldric_investigation: StoryCard = {
  id: 'aldric_investigation',
  title: 'The Truth About Careth',
  weight: 1,
  requires: [{ kind: 'flag', id: 'aldric_quest', equals: 1 }],
  storyPhase: 'climbing',
  body: [
    'Your questions lead you to a young merchant named Careth. She works hard and plays fair.',
    'Her secret? She found a better supplier. No tricks at all, just good business.',
    'Lord Aldric will not like that answer. You could tell him the truth, or make up a story that earns the full reward.',
  ],
  choices: [
    {
      id: 'aldric_honest',
      label: 'Tell him the truth',
      effects: [
        { kind: 'gold', delta: 100 },
        { kind: 'flag', id: 'aldric_quest', set: 2 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
      ],
      goto: 'aldric_honest_ending',
    },
    {
      id: 'aldric_lie',
      label: 'Make up a story about Careth',
      effects: [
        { kind: 'gold', delta: 150 },
        { kind: 'flag', id: 'aldric_quest', set: 3 },
        { kind: 'flag', id: 'moral_compromise', delta: 1 },
      ],
      goto: 'aldric_lie_ending',
    },
  ],
}

const aldric_honest_ending: StoryCard = {
  id: 'aldric_honest_ending',
  title: 'The Honest Answer',
  body: [
    'Aldric frowns, then slowly nods. "Not what I wanted to hear," he says. "But now I know who I can trust."',
    'Word spreads that you tell the truth, even when it costs you.',
  ],
  choices: [{ id: 'continue_aldric', label: 'Continue', effects: [] }],
}

const aldric_lie_ending: StoryCard = {
  id: 'aldric_lie_ending',
  title: 'A Convenient Lie',
  body: [
    'Aldric believes every word. He sets out to ruin Careth\'s supply line.',
    'You pocket the full reward. The gold spends just the same, but the lie sits heavy in your chest.',
  ],
  choices: [{ id: 'continue_lie', label: 'Continue', effects: [] }],
}

// ===== HIDDEN/SECRET ENCOUNTERS =====
// Gated by stat requirements or specific conditions

const scholar_sage: StoryCard = {
  id: 'scholar_sage',
  title: 'The Scholar\'s Secret',
  weight: 1,
  requires: [{ kind: 'statAtLeast', stat: 'savvy', value: 5 }],
  storyPhase: 'climbing',
  body: [
    'A merchant with ink-stained fingers watches you count your coins. "You have a quick mind," she says.',
    '"Real wealth isn\'t in goods. It\'s in knowing what prices will do next. I can teach you to see it coming."',
  ],
  choices: [
    {
      id: 'scholar_training',
      label: 'Learn to read the market (150g)',
      requires: [{ kind: 'goldAtLeast', amount: 150 }],
      effects: [
        { kind: 'gold', delta: -150 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'grantBoon', boon: 'market_insider' },
      ],
    },
    { id: 'scholar_decline', label: 'Not today', effects: [] },
  ],
}

const nerve_master: StoryCard = {
  id: 'nerve_master',
  title: 'The Stage Magician',
  weight: 1,
  requires: [{ kind: 'statAtLeast', stat: 'nerve', value: 5 }],
  storyPhase: 'climbing',
  body: [
    'Backstage at the theatre, a famous stage magician with a calm, unreadable face studies you. "You\'ve got the look," she says.',
    '"The best deals go to people who can keep a straight face, even when their heart is pounding."',
    '"I can teach you. If you\'ve got the nerve."',
  ],
  choices: [
    {
      id: 'nerve_training',
      label: 'Learn to keep a straight face (200g)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'stat', stat: 'nerve', delta: 2 },
        { kind: 'grantBoon', boon: 'master_bluffer' },
      ],
    },
    { id: 'nerve_decline', label: 'Walk away', effects: [] },
  ],
}

// ===== MORAL DILEMMAS =====
// High-stakes choices with real consequences

const the_orphanage: StoryCard = {
  id: 'the_orphanage',
  title: 'The Orphanage',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'A tired nun from the orphanage stands at your door, a small girl holding her hand. "We need 100 gold to stay open another month," she says. "The children have nowhere else to go."',
    'The little girl looks up at you with big, hopeful eyes.',
  ],
  choices: [
    {
      id: 'orphanage_donate',
      label: 'Give the orphanage 100 gold',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'flag', id: 'charity_given', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
    {
      id: 'orphanage_deflect',
      label: 'Say sorry, but keep your coins',
      effects: [{ kind: 'flag', id: 'moral_hardness', delta: 1 }],
    },
  ],
}

const corrupt_guard: StoryCard = {
  id: 'corrupt_guard',
  title: 'The Crooked Guard',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'A guard with a crooked smile corners you in an alley. "I\'ve been watching your... business," he says.',
    '"Pay me 200 gold every month, and the Watch never bothers you."',
    '"Or I tell my captain everything I\'ve seen. Your choice."',
  ],
  choices: [
    {
      id: 'pay_guard',
      label: 'Pay him (-200g every month)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'expense', delta: 200 },
        { kind: 'flag', id: 'guard_corrupt', set: 1 },
        { kind: 'flag', id: 'moral_compromise', delta: 1 },
      ],
    },
    {
      id: 'refuse_guard',
      label: 'Refuse, and report him (Nerve check, DC 15)',
      check: {
        stat: 'nerve',
        dc: 15,
        success: {
          text: 'You march straight to his captain. The crooked guard is arrested! His friends glare at you now, but your name is clean.',
          effects: [
            { kind: 'flag', id: 'guard_enemy', set: 1 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
          ],
        },
        failure: {
          text: 'His captain believes him, not you. Now you have an enemy in the Watch.',
          effects: [
            { kind: 'flag', id: 'heat_level', delta: 2 },
            { kind: 'flag', id: 'guard_enemy', set: 1 },
          ],
        },
      },
    },
  ],
}

// ===== LOCATION EXPLORATION =====
// Themed areas with unique opportunities

const dockside_tavern: StoryCard = {
  id: 'dockside_tavern',
  title: 'The Anchor & Coin',
  weight: 2,
  storyPhase: 'climbing',
  body: [
    'Smoke, fiddle music and laughter spill out of the Anchor & Coin. Sailors, smugglers and merchants all drink here.',
    'The bartender knows everyone\'s business. In the back room, sailors hold an arm-wrestling championship, with a fat prize for the winner.',
    '"What\'ll it be?" she asks with a wink.',
  ],
  choices: [
    {
      id: 'tavern_rumors',
      label: 'Listen for gossip',
      effects: [{ kind: 'stat', stat: 'savvy', delta: 1 }, { kind: 'flag', id: 'tavern_patron', set: 1 }],
    },
    {
      id: 'tavern_game',
      label: 'Enter the arm-wrestling championship (Nerve check, DC 14)',
      check: {
        stat: 'nerve',
        dc: 14,
        success: {
          text: 'You beat the harbour champion! You walk out 150 gold richer, and the regulars raise their mugs to you.',
          effects: [
            { kind: 'gold', delta: 150 },
            { kind: 'flag', id: 'tavern_patron', set: 2 },
          ],
        },
        failure: {
          text: 'Your arm hits the table. The entry fee and side costs come to 100 gold. A lesson learned.',
          effects: [{ kind: 'gold', delta: -100 }],
        },
      },
    },
    { id: 'tavern_skip', label: 'Leave quietly', effects: [] },
  ],
}

// ===== SEASONAL / TIME-BASED =====
// Events that appear at specific times

const winter_festival: StoryCard = {
  id: 'winter_festival',
  title: 'The Winter Festival',
  weight: 2,
  storyPhase: 'climbing',
  body: [
    'Snow falls on Vessarin, and the Winter Festival begins! Lanterns hang over every street. Travellers pour in, and the markets overflow with rare goods.',
    'Prices are high, but so are the profits.',
    '"The festival only comes once a year," a trader grins. "Make your move!"',
  ],
  choices: [
    {
      id: 'festival_trade',
      label: 'Buy rare goods to resell (120g)',
      requires: [{ kind: 'goldAtLeast', amount: 120 }],
      effects: [
        { kind: 'gold', delta: -120 },
        { kind: 'gold', delta: 250 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
      ],
    },
    {
      id: 'festival_celebrate',
      label: 'Enjoy the festival',
      effects: [
        { kind: 'gold', delta: -50 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
    { id: 'festival_work', label: 'Stick to regular business', effects: [] },
  ],
}

// Export all story expansion cards
export const storyExpansionCards: StoryCard[] = [
  captain_vex_intro,
  captain_vex_heist,
  vex_heist_success,
  vex_heist_failure,
  lord_aldric_intro,
  aldric_investigation,
  aldric_honest_ending,
  aldric_lie_ending,
  scholar_sage,
  nerve_master,
  the_orphanage,
  corrupt_guard,
  dockside_tavern,
  winter_festival,
]
