import type { StoryCard } from '../../engine/types'

// ===== MAFIA PATH (Ledger-Wyrm) =====
// After the Ledger-Wyrm, the criminal underworld takes notice

const mafia_notice: StoryCard = {
  id: 'mafia_notice',
  weight: 4,
  storyPhase: 'recovery',
  title: 'The Underworld Stirs',
  body: [
    'Word spreads through the criminal networks: a merchant survived the guild\'s wrath and kept their head above water. The black markets want to meet you. "A survivor like that could be useful," they say.',
  ],
  choices: [
    {
      id: 'embrace_underworld',
      label: 'Meet with the underworld (Nerve check, DC 12)',
      check: {
        stat: 'nerve',
        dc: 12,
        success: {
          text: 'You negotiate carefully. They offer protection and black market goods at discounts. A dangerous alliance forms.',
          effects: [
            { kind: 'flag', id: 'underworld_ally', set: 1 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'advanceDays', days: 3 },
          ],
        },
        failure: {
          text: 'Your nerves betray you. They see you as weak. You leave empty-handed.',
          effects: [{ kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'avoid_underworld',
      label: 'Avoid the underworld',
      effects: [
        { kind: 'narrate', text: 'You slip out of the city to avoid their attention.' },
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
    'The guild\'s collapse triggered a refugee crisis. Desperate people crowd the streets. Some are skilled craftspeople. Some are dangerous. Some are just hungry.',
  ],
  choices: [
    {
      id: 'hire_refugees',
      label: 'Hire refugees as labor (-80 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 80 }],
      effects: [
        { kind: 'gold', delta: -80 },
        { kind: 'wages', delta: 15 },
        { kind: 'flag', id: 'refugee_workers', set: 1 },
        { kind: 'narrate', text: 'You build a small operation with grateful workers. Their productivity is fierce.' },
        { kind: 'advanceDays', days: 4 },
      ],
    },
    {
      id: 'exploit_refugees',
      label: 'Exploit them for maximum profit',
      effects: [
        { kind: 'gold', delta: 120 },
        { kind: 'stat', stat: 'charm', delta: -1 },
        { kind: 'flag', id: 'exploited_refugees', set: 1 },
        { kind: 'narrate', text: 'You profit greatly. Your conscience costs you.' },
        { kind: 'advanceDays', days: 3 },
      ],
    },
    {
      id: 'ignore_crisis',
      label: 'It\'s not your problem',
      effects: [
        { kind: 'narrate', text: 'You keep your head down and your coin close.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
  ],
}

// ===== POLICE PATH (Inquisitor) =====
// After the Inquisitor, paranoia and surveillance plague the city

const wanted_poster: StoryCard = {
  id: 'wanted_poster',
  weight: 4,
  storyPhase: 'recovery',
  title: 'Your Face on a Wanted Poster',
  body: [
    'The authorities blame you for the Inquisitor\'s rampage. Your face is plastered across the city. "Accessory to destruction of city property." The reward is substantial.',
  ],
  choices: [
    {
      id: 'flee_city',
      label: 'Flee the city entirely',
      effects: [
        { kind: 'narrate', text: 'You abandon Vessarin. A new start in a distant city awaits, but at what cost?' },
        { kind: 'advanceDays', days: 15 },
        { kind: 'flag', id: 'fled_city', set: 1 },
      ],
    },
    {
      id: 'hide_and_rebuild',
      label: 'Hide while rebuilding in shadow (Savvy check, DC 14)',
      check: {
        stat: 'savvy',
        dc: 14,
        success: {
          text: 'You disappear into the underground economy. Your business thrives hidden from the authorities.',
          effects: [
            { kind: 'stat', stat: 'savvy', delta: 2 },
            { kind: 'wages', delta: 20 },
            { kind: 'flag', id: 'shadow_merchant', set: 1 },
            { kind: 'advanceDays', days: 8 },
          ],
        },
        failure: {
          text: 'The authorities close in. You narrowly escape arrest.',
          effects: [
            { kind: 'flag', id: 'authorities_hunting', set: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
      },
    },
    {
      id: 'clear_name',
      label: 'Prove your innocence (Charm check, DC 15)',
      check: {
        stat: 'charm',
        dc: 15,
        success: {
          text: 'You convince witnesses to testify. The wanted poster comes down. Freedom tastes sweet.',
          effects: [
            { kind: 'stat', stat: 'charm', delta: 2 },
            { kind: 'flag', id: 'name_cleared', set: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
        failure: {
          text: 'No one believes a merchant over the authorities.',
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
  weight: 4,
  storyPhase: 'recovery',
  title: 'The Crown Needs Supplies',
  body: [
    'The Tide\'s emergence has convinced the crown to mobilize. The military needs food, weapons, horses, everything. Merchants willing to supply them could become wealthy beyond measure—or lose everything if they\'re caught trading with the enemy.',
  ],
  choices: [
    {
      id: 'supply_crown',
      label: 'Contract with the crown (-150 gold, major risk)',
      requires: [{ kind: 'goldAtLeast', amount: 150 }],
      check: {
        stat: 'grit',
        dc: 13,
        success: {
          text: 'Your supplies reach the front lines. The crown rewards you handsomely.',
          effects: [
            { kind: 'gold', delta: 300 },
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'flag', id: 'crown_supplier', set: 1 },
            { kind: 'advanceDays', days: 10 },
          ],
        },
        failure: {
          text: 'Bandits intercept your shipments. The crown demands compensation.',
          effects: [
            { kind: 'gold', delta: -250 },
            { kind: 'advanceDays', days: 8 },
          ],
        },
      },
    },
    {
      id: 'trade_both_sides',
      label: 'Trade with both sides (Savvy check, DC 15)',
      check: {
        stat: 'savvy',
        dc: 15,
        success: {
          text: 'You play both sides expertly. Gold flows from every direction. But you\'ve made dangerous enemies.',
          effects: [
            { kind: 'gold', delta: 400 },
            { kind: 'stat', stat: 'savvy', delta: 2 },
            { kind: 'flag', id: 'war_profiteer', set: 1 },
            { kind: 'advanceDays', days: 12 },
          ],
        },
        failure: {
          text: 'You\'re discovered. Both sides consider you a traitor.',
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
        { kind: 'narrate', text: 'You watch from the sidelines as fortunes are made and lost.' },
        { kind: 'advanceDays', days: 4 },
      ],
    },
  ],
}

// ===== BANKING PATH (Machine) =====
// After the Machine, the market transforms

const market_collapse: StoryCard = {
  id: 'market_collapse',
  weight: 4,
  storyPhase: 'recovery',
  title: 'The Market Transforms',
  body: [
    'The Machine\'s rise has shattered traditional trading. The old market structures crumble. Some merchants adapt to the new reality. Others fight it desperately. A few see opportunities in chaos.',
  ],
  choices: [
    {
      id: 'embrace_machines',
      label: 'Adapt to mechanized trading',
      effects: [
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'wages', delta: 25 },
        { kind: 'flag', id: 'machine_adapted', set: 1 },
        { kind: 'narrate', text: 'You master the new systems. Your profits soar.' },
        { kind: 'advanceDays', days: 7 },
      ],
    },
    {
      id: 'resist_machines',
      label: 'Rally merchants against the Machine (Charm check, DC 13)',
      check: {
        stat: 'charm',
        dc: 13,
        success: {
          text: 'You lead a merchant coalition. Together you\'re strong enough to negotiate new terms.',
          effects: [
            { kind: 'stat', stat: 'charm', delta: 2 },
            { kind: 'flag', id: 'merchant_leader', set: 1 },
            { kind: 'advanceDays', days: 9 },
          ],
        },
        failure: {
          text: 'Your resistance crumbles. The Machine is too powerful.',
          effects: [
            { kind: 'wages', delta: -10 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
      },
    },
    {
      id: 'exploit_transition',
      label: 'Exploit the confusion for profit (-100 gold to invest)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      effects: [
        { kind: 'gold', delta: 250 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'flag', id: 'transition_profiteer', set: 1 },
        { kind: 'narrate', text: 'While others panic, you accumulate fortunes.' },
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
  title: 'An Old Mentor Reappears',
  body: [
    'The person who first taught you about trading reappears after years away. "I heard you stood against a Colossus. Not many survive. Even fewer keep their wits."',
  ],
  choices: [
    {
      id: 'accept_guidance',
      label: 'Accept their guidance',
      effects: [
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'mentor_allied', set: 1 },
        { kind: 'narrate', text: 'Their wisdom accelerates your recovery.' },
        { kind: 'advanceDays', days: 5 },
      ],
    },
    {
      id: 'forge_own_path',
      label: 'Thank them but forge your own path',
      effects: [
        { kind: 'stat', stat: 'grit', delta: 1 },
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'narrate', text: 'You\'ve learned that independence matters.' },
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
    'While you were facing the Colossus, your rival seized the opportunity. They\'ve taken over several of your contracts and won new allies. "It\'s nothing personal," they say with a smile that suggests otherwise.',
  ],
  choices: [
    {
      id: 'compete_fiercely',
      label: 'Out-compete them (Savvy check, DC 14)',
      check: {
        stat: 'savvy',
        dc: 14,
        success: {
          text: 'You reclaim what\'s yours and then some. Your rival slinks away defeated.',
          effects: [
            { kind: 'stat', stat: 'savvy', delta: 1 },
            { kind: 'wages', delta: 20 },
            { kind: 'flag', id: 'rival_defeated', set: 1 },
            { kind: 'advanceDays', days: 8 },
          ],
        },
        failure: {
          text: 'They\'re better prepared than you expected. Your losses are substantial.',
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
      label: 'Propose a partnership (Charm check, DC 12)',
      check: {
        stat: 'charm',
        dc: 12,
        success: {
          text: 'You both benefit. Competition becomes collaboration.',
          effects: [
            { kind: 'stat', stat: 'charm', delta: 1 },
            { kind: 'wages', delta: 15 },
            { kind: 'flag', id: 'rival_partner', set: 1 },
            { kind: 'advanceDays', days: 6 },
          ],
        },
        failure: {
          text: 'They see it as weakness. They take more.',
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
