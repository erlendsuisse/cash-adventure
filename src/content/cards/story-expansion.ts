import type { StoryCard } from '../../engine/types'

// ===== RECURRING NPCs =====
// These characters appear multiple times with evolving relationships

const captain_vex_intro: StoryCard = {
  id: 'captain_vex_intro',
  title: 'Captain Vex at the Harbor',
  weight: 2,
  storyPhase: 'climbing',
  body: [
    'At the docks, you meet Captain Vex, a grizzled smuggler who runs cargo between Vessarin and distant ports.',
    'His reputation is mixed—loyal to his crew, ruthless to enemies. He eyes you with interest.',
    '"I need a reliable merchant," he says. "Someone with nerve and discretion. Interested in getting rich the fast way?"',
  ],
  choices: [
    {
      id: 'vex_accept',
      label: 'Work with Captain Vex',
      effects: [
        { kind: 'flag', id: 'vex_relationship', set: 1 },
        { kind: 'wages', delta: 10 },
      ],
    },
    { id: 'vex_decline', label: 'Decline his offer', effects: [] },
  ],
}

const captain_vex_heist: StoryCard = {
  id: 'captain_vex_heist',
  title: 'A Risky Cargo Run',
  weight: 1,
  requires: [{ kind: 'flag', id: 'vex_relationship', atLeast: 1 }],
  storyPhase: 'climbing',
  body: [
    'Captain Vex has a lucrative job: smuggle high-value textiles past the city guard checkpoints.',
    'The pay is generous, but if caught, the consequences are severe. He needs someone trustworthy.',
    '"I can cut you in for 200 gold if you handle the city-side delivery. The guards might ask questions—how you answer matters."',
  ],
  choices: [
    {
      id: 'vex_cargo_honest',
      label: 'Bribe the guards with charm (Charm check, DC 14)',
      check: {
        stat: 'charm',
        dc: 14,
        success: {
          text: 'You smooth-talk the guards. They look the other way. Vex is impressed.',
          effects: [
            { kind: 'gold', delta: 200 },
            { kind: 'flag', id: 'vex_relationship', delta: 1 },
            { kind: 'stat', stat: 'charm', delta: 1 },
          ],
          goto: 'vex_heist_success',
        },
        failure: {
          text: 'The guards get suspicious. You barely escape, empty-handed. Vex is disappointed.',
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
      label: 'Run the cargo past guards (Nerve check, DC 16)',
      check: {
        stat: 'nerve',
        dc: 16,
        success: {
          text: 'You dart through checkpoints undetected. Vex gains a valuable, fearless partner.',
          effects: [
            { kind: 'gold', delta: 300 },
            { kind: 'flag', id: 'vex_relationship', delta: 2 },
            { kind: 'stat', stat: 'nerve', delta: 2 },
          ],
          goto: 'vex_heist_success',
        },
        failure: {
          text: 'The guards catch you. You escape but lose the cargo and any trust with Vex.',
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
  title: 'Partnership Forged',
  body: [
    'Captain Vex now sees you as an equal—someone who understands the game. "You\'ve got a future with my crew if you want it," he says.',
    'Regular work means regular coin. The heat level rises, but so does your potential.',
  ],
  choices: [{ id: 'continue_vex', label: 'Continue', effects: [] }],
}

const vex_heist_failure: StoryCard = {
  id: 'vex_heist_failure',
  title: 'Failed Cargo',
  body: ['The cargo run didn\'t go as planned. Vex seems less interested in you now. Perhaps trust can be rebuilt.'],
  choices: [{ id: 'continue_failed', label: 'Continue', effects: [] }],
}

// ===== QUEST CHAINS =====
// Multi-card sequences that unfold over time

const lord_aldric_intro: StoryCard = {
  id: 'lord_aldric_intro',
  title: 'A Noble\'s Dilemma',
  weight: 2,
  storyPhase: 'climbing',
  body: [
    'A well-dressed nobleman approaches you in the guild hall—Lord Aldric, a merchant of considerable means.',
    '"I have a problem," he says quietly. "My import business is being undercut by someone. I need to know who, and how to eliminate their advantage. Legally, of course."',
    'He slides a pouch of gold across the table. "Investigate for me. The answer is worth another 150 gold."',
  ],
  choices: [
    {
      id: 'aldric_accept',
      label: 'Accept the investigation',
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
  title: 'Following the Trail',
  weight: 1,
  requires: [{ kind: 'flag', id: 'aldric_quest', equals: 1 }],
  storyPhase: 'climbing',
  body: [
    'You begin investigating Aldric\'s competitors. Your sources point to a merchant named Careth—aggressive, ambitious, but honest.',
    'You discover Careth simply found a better supply line. There\'s no wrongdoing, just better business.',
    'Now you have a choice: tell Aldric the truth and disappoint him, or fabricate a story to earn the full payment?',
  ],
  choices: [
    {
      id: 'aldric_honest',
      label: 'Report the truth (honesty)',
      effects: [
        { kind: 'gold', delta: 100 },
        { kind: 'flag', id: 'aldric_quest', set: 2 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
      ],
      goto: 'aldric_honest_ending',
    },
    {
      id: 'aldric_lie',
      label: 'Fabricate evidence (deception)',
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
  title: 'Truth and Respect',
  body: [
    'Aldric is disappointed but respects your honesty. "At least I know who to trust," he says.',
    'Word spreads that you\'re a merchant of integrity. Your reputation in ethical circles improves.',
  ],
  choices: [{ id: 'continue_aldric', label: 'Continue', effects: [] }],
}

const aldric_lie_ending: StoryCard = {
  id: 'aldric_lie_ending',
  title: 'Convenient Lies',
  body: [
    'Aldric believes your fabrication and moves to sabotage Careth\'s supply lines.',
    'You pocket the full payment, but you know the truth. The weight of the lie sits heavy—but the gold spends just the same.',
  ],
  choices: [{ id: 'continue_lie', label: 'Continue', effects: [] }],
}

// ===== HIDDEN/SECRET ENCOUNTERS =====
// Gated by stat requirements or specific conditions

const scholar_sage: StoryCard = {
  id: 'scholar_sage',
  title: 'A Merchant Scholar\'s Secret',
  weight: 1,
  requires: [{ kind: 'statAtLeast', stat: 'savvy', value: 5 }],
  storyPhase: 'climbing',
  body: [
    'A scholarly merchant notices your sharp financial mind. "You understand something most don\'t," she says.',
    '"The real wealth isn\'t in goods—it\'s in information. I trade in knowledge of market movements before they happen."',
    '"Interested in learning the art?"',
  ],
  choices: [
    {
      id: 'scholar_training',
      label: 'Train in market prediction (150 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 150 }],
      effects: [
        { kind: 'gold', delta: -150 },
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'grantBoon', boon: 'market_insider' },
      ],
    },
    { id: 'scholar_decline', label: 'Decline', effects: [] },
  ],
}

const nerve_master: StoryCard = {
  id: 'nerve_master',
  title: 'The Confidence Game',
  weight: 1,
  requires: [{ kind: 'statAtLeast', stat: 'nerve', value: 5 }],
  storyPhase: 'climbing',
  body: [
    'A mysterious figure in a high-end card room studies you. "You\'ve got the look," they say.',
    '"Ever thought about playing bigger games? The real fortunes are made by people who can bluff with their lives on the line."',
    '"I can teach you—if you\'ve got the nerve."',
  ],
  choices: [
    {
      id: 'nerve_training',
      label: 'Master the bluff (200 gold)',
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
  title: 'Children in Need',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'A nun from the city\'s orphanage finds you. "We need 100 gold to keep our doors open for another month. The children have nowhere else to go."',
    'She looks at you with desperate hope. "I know you\'re a merchant. I know you understand that every coin matters. Can you help us?"',
    'You have that amount. The choice is yours.',
  ],
  choices: [
    {
      id: 'orphanage_donate',
      label: 'Donate 100 gold to the orphanage',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: -100 },
        { kind: 'flag', id: 'charity_given', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
    {
      id: 'orphanage_deflect',
      label: 'Offer sympathies but keep your coin',
      effects: [{ kind: 'flag', id: 'moral_hardness', delta: 1 }],
    },
  ],
}

const corrupt_guard: StoryCard = {
  id: 'corrupt_guard',
  title: 'A Guard\'s Temptation',
  weight: 1,
  storyPhase: 'climbing',
  body: [
    'A city guard approaches you privately. "I\'ve noticed your... business ventures," he says meaningfully.',
    '"I can keep the constables away from your operations for a price. 200 gold monthly, and you\'ll never see a uniform."',
    '"Or I can report what I\'ve seen. Your choice."',
    'This is extortion, but he\'s a powerful man.',
  ],
  choices: [
    {
      id: 'pay_guard',
      label: 'Pay for protection (recurring -200g/month)',
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
      label: 'Refuse and expose him (Nerve check, DC 15)',
      check: {
        stat: 'nerve',
        dc: 15,
        success: {
          text: 'You report him to his superiors. The guard is arrested. You\'re now a target, but you\'re clean.',
          effects: [
            { kind: 'flag', id: 'guard_enemy', set: 1 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
          ],
        },
        failure: {
          text: 'He sees through your bluff. Now you\'re both enemies and marked.',
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
    'The Anchor & Coin is the tavern where sailors, smugglers, and merchants intersect.',
    'The air is thick with opportunity—and danger. The bartender knows everyone. The back room hosts high-stakes games.',
    '"What\'ll it be?" the bartender asks with a knowing smile.',
  ],
  choices: [
    {
      id: 'tavern_rumors',
      label: 'Gather rumors and trade gossip',
      effects: [{ kind: 'stat', stat: 'savvy', delta: 1 }, { kind: 'flag', id: 'tavern_patron', set: 1 }],
    },
    {
      id: 'tavern_game',
      label: 'Join a high-stakes card game (Nerve check, DC 14)',
      check: {
        stat: 'nerve',
        dc: 14,
        success: {
          text: 'You play brilliantly and win big. 150 gold richer, and the regulars respect you.',
          effects: [
            { kind: 'gold', delta: 150 },
            { kind: 'flag', id: 'tavern_patron', set: 2 },
          ],
        },
        failure: {
          text: 'You lose badly. 100 gold gone, but you\'ve learned a lesson.',
          effects: [{ kind: 'gold', delta: -100 }],
        },
      },
    },
    { id: 'tavern_skip', label: 'Leave without getting involved', effects: [] },
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
    'Winter has come to Vessarin. The city transforms—markets overflow with rare goods, travelers flood the streets, and the guild throws its grandest celebration.',
    'It\'s a time of excess and opportunity. Prices are high, but so are profits.',
    '"The festival only comes once a year," a trader says. "Make your moves now."',
  ],
  choices: [
    {
      id: 'festival_trade',
      label: 'Buy rare goods and resell (invest 120 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 120 }],
      effects: [
        { kind: 'gold', delta: -120 },
        { kind: 'gold', delta: 250 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
      ],
    },
    {
      id: 'festival_celebrate',
      label: 'Enjoy the festivities',
      effects: [
        { kind: 'gold', delta: -50 },
        { kind: 'stat', stat: 'charm', delta: 1 },
      ],
    },
    { id: 'festival_work', label: 'Focus on regular business', effects: [] },
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
