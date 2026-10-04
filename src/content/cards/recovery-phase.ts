import type { StoryCard } from '../../engine/types'

// ===== MAFIA PATH (Ledger-Wyrm) =====
// After the Ledger-Wyrm, the criminal underworld takes notice

const mafia_notice: StoryCard = {
  id: 'mafia_notice',
  // Queue-only: its Colossus outcome plays it; never a random draw.
  storyPhase: 'recovery',
  title: 'The Underworld Takes Notice',
  body: [
    'Word spreads through the back alleys: you survived a Colossus! The underworld wants to meet you. "A survivor like that could be useful," they whisper.',
  ],
  choices: [
    {
      id: 'embrace_underworld',
      label: 'Meet them (Nerve check, DC 12)',
      check: {
        stat: 'nerve',
        dc: 12,
        success: {
          text: 'You stay calm and bargain well. They offer protection and cheap goods. A risky friendship begins.',
          effects: [
            { kind: 'flag', id: 'underworld_ally', set: 1 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'advanceDays', days: 3 },
          ],
        },
        failure: {
          text: 'Your knees knock. They decide you are not worth their time.',
          effects: [{ kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'avoid_underworld',
      label: 'Stay away from them',
      effects: [
        { kind: 'narrate', text: 'You lie low in the countryside until they lose interest.' },
        { kind: 'flag', id: 'underworld_ignored', set: 1 },
        { kind: 'advanceDays', days: 2 },
      ],
    },
  ],
}

const refugee_crisis: StoryCard = {
  id: 'refugee_crisis',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Refugees Flood the City',
  body: [
    'After the Colossus, homeless families fill the streets. Some are skilled craftspeople. Some are troublemakers. Most are just hungry.',
  ],
  choices: [
    {
      id: 'hire_refugees',
      label: 'Give them fair work (-80g)',
      requires: [{ kind: 'goldAtLeast', amount: 80 }],
      effects: [
        { kind: 'gold', delta: -80 },
        { kind: 'wages', delta: 15 },
        { kind: 'flag', id: 'refugee_workers', set: 1 },
        { kind: 'narrate', text: 'Your new workers are grateful and work hard. Your little business hums.' },
        { kind: 'advanceDays', days: 4 },
      ],
    },
    {
      id: 'exploit_refugees',
      label: 'Work them hard for little pay',
      effects: [
        { kind: 'gold', delta: 120 },
        { kind: 'stat', stat: 'charm', delta: -1 },
        { kind: 'flag', id: 'exploited_refugees', set: 1 },
        { kind: 'narrate', text: 'You make a lot of money. It doesn\'t feel good.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'ignore_crisis',
      label: 'Not your problem',
      effects: [
        { kind: 'narrate', text: 'You keep your head down and your coins close.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
  ],
}

// ===== POLICE PATH (Inquisitor) =====
// After the Inquisitor, paranoia and surveillance plague the city

const wanted_poster: StoryCard = {
  id: 'wanted_poster',
  // Queue-only: its Colossus outcome plays it; never a random draw.
  storyPhase: 'recovery',
  title: 'Your Face on a Wanted Poster',
  body: [
    'Your face is on posters all over town! The council blames you for the damage the Inquisitor caused. There is a big reward for your capture.',
  ],
  choices: [
    {
      id: 'flee_city',
      label: 'Flee the city',
      effects: [
        { kind: 'narrate', text: 'You slip away from Vessarin with nothing but a bag. A new start, far away.' },
        { kind: 'advanceDays', days: 15 },
        { kind: 'flag', id: 'fled_city', set: 1 },
      ],
    },
    {
      id: 'hide_and_rebuild',
      label: 'Hide and rebuild in secret (Savvy check, DC 14)',
      check: {
        stat: 'savvy',
        dc: 14,
        success: {
          text: 'You run your business from a hidden cellar. Nobody finds you, and the business grows.',
          effects: [
            { kind: 'stat', stat: 'savvy', delta: 2 },
            { kind: 'wages', delta: 20 },
            { kind: 'flag', id: 'shadow_merchant', set: 1 },
            { kind: 'advanceDays', days: 8 },
          ],
        },
        failure: {
          text: 'The Watch nearly catches you. You escape over the rooftops by a whisker.',
          effects: [
            { kind: 'flag', id: 'authorities_hunting', set: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
      },
    },
    {
      id: 'clear_name',
      label: 'Prove you\'re innocent (Charm check, DC 15)',
      check: {
        stat: 'charm',
        dc: 15,
        success: {
          text: 'Witnesses speak up for you, and the posters come down. Freedom tastes sweet!',
          effects: [
            { kind: 'stat', stat: 'charm', delta: 2 },
            { kind: 'flag', id: 'name_cleared', set: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
        failure: {
          text: 'Nobody believes you over the council.',
          effects: [{ kind: 'advanceDays', days: 3 }],
        },
      },
    },
  ],
}

// ===== WAR PATH (Tide) =====
// After the Tide, the kingdom reorients toward war

const war_contracts: StoryCard = {
  id: 'war_contracts',
  // Queue-only: its Colossus outcome plays it; never a random draw.
  storyPhase: 'recovery',
  title: 'The Crown Needs Supplies',
  body: [
    'After the Tide, the crown is preparing for trouble. The army needs food, horses and supplies. Suppliers could get very rich, or lose everything.',
  ],
  choices: [
    {
      id: 'supply_crown',
      label: 'Supply the crown (-150g, big risk)',
      requires: [{ kind: 'goldAtLeast', amount: 150 }],
      check: {
        stat: 'grit',
        dc: 13,
        success: {
          text: 'Your wagons reach the army camps. The crown pays you handsomely.',
          effects: [
            { kind: 'gold', delta: 300 },
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'flag', id: 'crown_supplier', set: 1 },
            { kind: 'advanceDays', days: 10 },
          ],
        },
        failure: {
          text: 'Bandits steal your wagons, and the crown wants its money back.',
          effects: [
            { kind: 'gold', delta: -250 },
            { kind: 'advanceDays', days: 8 },
          ],
        },
      },
    },
    {
      id: 'trade_both_sides',
      label: 'Sell to both sides (Savvy check, DC 15)',
      check: {
        stat: 'savvy',
        dc: 15,
        success: {
          text: 'You sell to both sides without getting caught. Gold pours in, but you make dangerous enemies.',
          effects: [
            { kind: 'gold', delta: 400 },
            { kind: 'stat', stat: 'savvy', delta: 2 },
            { kind: 'flag', id: 'war_profiteer', set: 1 },
            { kind: 'advanceDays', days: 12 },
          ],
        },
        failure: {
          text: 'You are found out! Now both sides call you a traitor.',
          effects: [
            { kind: 'flag', id: 'hunted_traitor', set: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
      },
    },
    {
      id: 'stay_neutral',
      label: 'Stay out of it',
      effects: [
        { kind: 'narrate', text: 'You watch from the sidelines as fortunes are won and lost.' },
        { kind: 'advanceDays', days: 4 },
      ],
    },
  ],
}

// ===== BANKING PATH (Machine) =====
// After the Machine, the market transforms

const market_collapse: StoryCard = {
  id: 'market_collapse',
  // Queue-only: its Colossus outcome plays it; never a random draw.
  storyPhase: 'recovery',
  title: 'The Market Transforms',
  body: [
    'The Machine has turned the market upside down. Some merchants change with it. Some fight it. A few spot chances in the chaos.',
  ],
  choices: [
    {
      id: 'embrace_machines',
      label: 'Learn the new machine trade',
      effects: [
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'wages', delta: 25 },
        { kind: 'flag', id: 'machine_adapted', set: 1 },
        { kind: 'narrate', text: 'You get the hang of the new ways quickly. Your profits soar.' },
        { kind: 'advanceDays', days: 7 },
      ],
    },
    {
      id: 'resist_machines',
      label: 'Unite the merchants (Charm check, DC 13)',
      check: {
        stat: 'charm',
        dc: 13,
        success: {
          text: 'You bring the merchants together. United, you win much better terms.',
          effects: [
            { kind: 'stat', stat: 'charm', delta: 2 },
            { kind: 'flag', id: 'merchant_leader', set: 1 },
            { kind: 'advanceDays', days: 9 },
          ],
        },
        failure: {
          text: 'Your group falls apart. The Machine is too strong.',
          effects: [
            { kind: 'wages', delta: -10 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
      },
    },
    {
      id: 'exploit_transition',
      label: 'Profit from the confusion (-100g to invest)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: 250 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'flag', id: 'transition_profiteer', set: 1 },
        { kind: 'narrate', text: 'While others panic, your fortune grows.' },
        { kind: 'advanceDays', days: 8 },
      ],
    },
  ],
}

// ===== SHARED RECOVERY CARDS =====

const old_mentor_returns: StoryCard = {
  id: 'old_mentor_returns',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Old Tobias Returns',
  body: [
    'Old Tobias leans on your counter, eyes twinkling under his big hat. "I heard you stood up to a Colossus," he says. "Not many survive. Fewer still keep their wits."',
  ],
  choices: [
    {
      id: 'accept_guidance',
      label: 'Ask for his advice',
      effects: [
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'mentor_allied', set: 1 },
        { kind: 'narrate', text: 'His advice helps you get back on your feet much faster.' },
        { kind: 'advanceDays', days: 5 },
      ],
    },
    {
      id: 'forge_own_path',
      label: 'Thank him, but find your own way',
      effects: [
        { kind: 'stat', stat: 'grit', delta: 1 },
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'Tobias chuckles. "Good. You don\'t need me anymore."' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
  ],
}

const ambitious_rival: StoryCard = {
  id: 'ambitious_rival',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Your Rival Strikes',
  body: [
    'While you faced the Colossus, your rival stole your best customers. "Nothing personal," she says, with a smile that says otherwise.',
  ],
  choices: [
    {
      id: 'compete_fiercely',
      label: 'Win them back (Savvy check, DC 14)',
      check: {
        stat: 'savvy',
        dc: 14,
        success: {
          text: 'You win back every customer, and more. Your rival slinks away.',
          effects: [
            { kind: 'stat', stat: 'savvy', delta: 1 },
            { kind: 'wages', delta: 20 },
            { kind: 'flag', id: 'rival_defeated', set: 1 },
            { kind: 'advanceDays', days: 8 },
          ],
        },
        failure: {
          text: 'She is better prepared than you thought. You lose a lot.',
          effects: [
            { kind: 'gold', delta: -100 },
            { kind: 'flag', id: 'lost_to_rival', set: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
      },
    },
    {
      id: 'form_partnership',
      label: 'Suggest working together (Charm check, DC 12)',
      check: {
        stat: 'charm',
        dc: 12,
        success: {
          text: 'You team up, and you both do better than before.',
          effects: [
            { kind: 'stat', stat: 'charm', delta: 1 },
            { kind: 'wages', delta: 15 },
            { kind: 'flag', id: 'rival_partner', set: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
        failure: {
          text: 'She thinks you\'re weak, and takes even more.',
          effects: [{ kind: 'advanceDays', days: 3 }],
        },
      },
    },
  ],
}

export const recoveryPhaseCards: StoryCard[] = [
  mafia_notice,
  refugee_crisis,
  wanted_poster,
  war_contracts,
  market_collapse,
  old_mentor_returns,
  ambitious_rival,
]
