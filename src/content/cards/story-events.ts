import type { StoryCard } from '../../engine/types'

const tavern_rumor: StoryCard = {
  storyPhase: 'climbing',
  id: 'tavern_rumor',
  weight: 4,
  title: 'Whispers in the Tavern',
  body: [
    'Over drinks, merchants speak in hushed tones of bandits on the northern road. One claims to have seen them. Another says it\'s just speculation. A third insists the guards know but don\'t act.',
  ],
  choices: [
    {
      id: 'investigate_bandits',
      label: 'Investigate the rumor (Savvy check, DC 12)',
      check: {
        stat: 'savvy',
        dc: 12,
        success: {
          text: 'You learn the bandits are real but avoiding the main trade routes. Useful intelligence.',
          effects: [
            { kind: 'flag', id: 'knows_bandit_routes', set: 1 },
            { kind: 'advanceDays', days: 2 },
          ],
        },
        failure: {
          text: 'The merchants close ranks. You learn nothing concrete.',
          effects: [{ kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'ignore_rumor',
      label: 'Ignore the speculation',
      effects: [
        { kind: 'narrate', text: 'You finish your drink and move on.' },
        { kind: 'advanceDays', days: 1 },
      ],
    },
  ],
}

const lost_caravan: StoryCard = {
  storyPhase: 'climbing',
  id: 'lost_caravan',
  weight: 4,
  title: 'A Merchant in Distress',
  body: [
    'A bedraggled merchant approaches you in the marketplace, desperate. "My caravan never arrived. The goods are worth hundreds of gold. If you can find them, I\'ll pay for the recovery."',
  ],
  choices: [
    {
      id: 'search_caravan',
      label: 'Organize a search (Grit check, DC 14)',
      requires: [{ kind: 'goldAtLeast', amount: 50 }],
      check: {
        stat: 'grit',
        dc: 14,
        success: {
          text: 'You track the caravan to a ravine. The merchant pays 200 gold reward.',
          effects: [
            { kind: 'gold', delta: 200 },
            { kind: 'flag', id: 'merchant_favor', delta: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
        failure: {
          text: 'Your search turns up nothing but wasted time and coin.',
          effects: [
            { kind: 'gold', delta: -50 },
            { kind: 'advanceDays', days: 4 },
          ],
        },
      },
    },
    {
      id: 'decline_search',
      label: 'Too risky for you',
      effects: [{ kind: 'narrate', text: 'You wish them luck and leave.' }],
    },
  ],
}

const cursed_artifact: StoryCard = {
  storyPhase: 'climbing',
  id: 'cursed_artifact',
  weight: 4,
  title: 'An Antique of Questionable Origin',
  body: [
    'A nervous collector offers you an ancient relic at an incredibly low price. "I need it gone," he whispers. "Three owners before me—all lost their fortune within a year."',
  ],
  choices: [
    {
      id: 'examine_artifact',
      label: 'Examine it carefully (Savvy check, DC 13)',
      check: {
        stat: 'savvy',
        dc: 13,
        success: {
          text: 'You recognize the craftsmanship as masterful but harmless. You resell it for 150 gold profit.',
          effects: [{ kind: 'gold', delta: 150 }, { kind: 'advanceDays', days: 3 }],
        },
        failure: {
          text: 'You buy it. The first week brings nothing but problems.',
          effects: [
            { kind: 'gold', delta: -80 },
            { kind: 'flag', id: 'bad_luck', delta: 1 },
            { kind: 'advanceDays', days: 1 },
          ],
        },
      },
    },
    {
      id: 'walk_away_relic',
      label: 'Stay away from curses',
      effects: [{ kind: 'narrate', text: 'You leave the cursed thing where it sits.' }],
    },
  ],
}

const guard_problem: StoryCard = {
  storyPhase: 'climbing',
  id: 'guard_problem',
  weight: 4,
  title: 'A Guard\'s Dilemma',
  body: [
    'A city guard confides in you: bandits have been raiding merchant caravans, but the city refuses to fund more patrols. "If I could get a merchant to back a private caravan guard contract, it would be legitimate."',
  ],
  choices: [
    {
      id: 'back_guard_contract',
      label: 'Fund the private guard contract (-100 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      check: {
        stat: 'charm',
        dc: 12,
        success: {
          text: 'Your backing is accepted. The roads become safer. Word spreads—your reputation grows.',
          effects: [
            { kind: 'gold', delta: -100 },
            { kind: 'stat', stat: 'charm', delta: 1 },
            { kind: 'flag', id: 'city_patron', delta: 1 },
            { kind: 'advanceDays', days: 7 },
          ],
        },
        failure: {
          text: 'Politics interfere. The guard contract falls through. Your gold is wasted.',
          effects: [{ kind: 'gold', delta: -100 }, { kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'refuse_guard',
      label: 'Not your problem',
      effects: [{ kind: 'narrate', text: 'The guard leaves disappointed.' }],
    },
  ],
}

const fortune_teller: StoryCard = {
  storyPhase: 'climbing',
  id: 'seers_warning',
  weight: 4,
  title: 'The Seer\'s Warning',
  body: [
    'A fortune teller stops you in the street. "I see great danger and greater opportunity ahead. The cards show a choice that will change everything."',
  ],
  choices: [
    {
      id: 'heed_warning',
      label: 'Ask for clarity (Nerve check, DC 11)',
      check: {
        stat: 'nerve',
        dc: 11,
        success: {
          text: 'The seer\'s words crystallize: "Trust those with steady hands and sharp minds." You feel strangely prepared.',
          effects: [
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'flag', id: 'seer_blessed', set: 1 },
            { kind: 'advanceDays', days: 1 },
          ],
        },
        failure: {
          text: 'The seer\'s cryptic words confuse more than enlighten. You leave troubled.',
          effects: [{ kind: 'advanceDays', days: 1 }],
        },
      },
    },
    {
      id: 'dismiss_seer',
      label: 'Move on',
      effects: [{ kind: 'narrate', text: 'You dismiss the seer as a charlatan.' }],
    },
  ],
}

const traveling_bard: StoryCard = {
  storyPhase: 'climbing',
  id: 'traveling_bard',
  weight: 4,
  title: 'Tales of the Colossi',
  body: [
    'A traveling bard regales patrons with stories of the four great Colossi—ancient entities that rose when Vessarin\'s wealth reached its peak. "The legends say only those of true merit can stand against them."',
  ],
  choices: [
    {
      id: 'listen_bard',
      label: 'Listen to the full tale',
      effects: [
        { kind: 'narrate', text: 'The bard\'s words stir something in you. The world feels larger, full of hidden power.' },
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'ignore_bard',
      label: 'Ignore the storyteller',
      effects: [{ kind: 'narrate', text: 'You have no time for tales.' }],
    },
  ],
}

const midnight_arrival: StoryCard = {
  storyPhase: 'climbing',
  id: 'midnight_arrival',
  weight: 4,
  title: 'Mysterious Strangers',
  body: [
    'Late at night, three cloaked figures arrive in town asking about a merchant of great wealth and cunning. They leave by dawn. Word spreads. Others begin asking who they seek.',
  ],
  choices: [
    {
      id: 'ask_questions',
      label: 'Investigate who they were (Savvy check, DC 14)',
      check: {
        stat: 'savvy',
        dc: 14,
        success: {
          text: 'You learn they were agents of the banking guild, seeking someone who defrauded them. You now know who to avoid—or approach carefully.',
          effects: [
            { kind: 'flag', id: 'guild_wary', set: 1 },
            { kind: 'advanceDays', days: 3 },
          ],
        },
        failure: {
          text: 'Your questions raise suspicion. The guild notices your interest.',
          effects: [
            { kind: 'flag', id: 'under_scrutiny', delta: 1 },
            { kind: 'advanceDays', days: 2 },
          ],
        },
      },
    },
    {
      id: 'stay_quiet',
      label: 'Keep your head down',
      effects: [
        { kind: 'narrate', text: 'You remain anonymous.' },
        { kind: 'advanceDays', days: 1 },
      ],
    },
  ],
}

const plague_warning: StoryCard = {
  storyPhase: 'climbing',
  id: 'plague_warning',
  weight: 1,
  title: 'Sickness Spreads',
  body: [
    'A healer comes to you with grim news: illness has struck the poor districts. If it spreads, trade will halt and prices will spike. But so will desperation.',
  ],
  choices: [
    {
      id: 'help_healer',
      label: 'Donate to the healer (-75 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 75 }],
      effects: [
        { kind: 'gold', delta: -75 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'community_hero', delta: 1 },
        { kind: 'narrate', text: 'Your charity saves lives. The city remembers.' },
        { kind: 'advanceDays', days: 5 },
      ],
    },
    {
      id: 'wait_and_profit',
      label: 'Wait to profit from higher prices',
      effects: [
        { kind: 'narrate', text: 'You calculate the profit opportunity.' },
        { kind: 'flag', id: 'morally_compromised', delta: 1 },
        { kind: 'advanceDays', days: 7 },
      ],
    },
  ],
}

const scholar_encounter: StoryCard = {
  storyPhase: 'climbing',
  id: 'scholar_encounter',
  weight: 4,
  title: 'A Learned Merchant',
  body: [
    'An elderly scholar-merchant offers to share knowledge. "I have spent forty years studying market patterns and the nature of wealth. Most merchants die rich but ignorant. You could be different."',
  ],
  choices: [
    {
      id: 'study_merchant',
      label: 'Accept the mentorship',
      effects: [
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'flag', id: 'mentor_found', set: 1 },
        { kind: 'narrate', text: 'The scholar\'s wisdom becomes your compass.' },
        { kind: 'advanceDays', days: 10 },
      ],
    },
    {
      id: 'decline_mentor',
      label: 'You prefer to learn by doing',
      effects: [{ kind: 'narrate', text: 'You trust your instincts over theories.' }],
    },
  ],
}

const rival_emerges: StoryCard = {
  storyPhase: 'climbing',
  id: 'rival_emerges',
  weight: 4,
  title: 'A Rival Takes Notice',
  body: [
    'A new merchant arrives in town, underselling everyone. They eye you with particular interest. "I\'ve heard of you," they say coldly. "We should settle who belongs in this market."',
  ],
  choices: [
    {
      id: 'challenge_rival',
      label: 'Accept the rivalry (Nerve check, DC 13)',
      check: {
        stat: 'nerve',
        dc: 13,
        success: {
          text: 'You stand your ground. The rival respects your mettle. Competition drives you both to greater success.',
          effects: [
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'flag', id: 'has_rival', set: 1 },
            { kind: 'advanceDays', days: 8 },
          ],
        },
        failure: {
          text: 'You falter. The rival takes advantage, underselling you repeatedly.',
          effects: [
            { kind: 'flag', id: 'losing_ground', delta: 1 },
            { kind: 'advanceDays', days: 4 },
          ],
        },
      },
    },
    {
      id: 'cooperate_rival',
      label: 'Suggest cooperation',
      effects: [
        { kind: 'narrate', text: 'You extend an unexpected hand.' },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'has_ally', set: 1 },
        { kind: 'advanceDays', days: 5 },
      ],
    },
  ],
}

const treasure_map: StoryCard = {
  storyPhase: 'climbing',
  id: 'treasure_map',
  weight: 4,
  title: 'A Faded Map',
  body: [
    'An old prospector sells you a weathered map for 20 gold. It shows X marked in mountains east of the city. "There\'s something there," they say. "Whether treasure or trouble, only time tells."',
  ],
  choices: [
    {
      id: 'follow_map',
      label: 'Organize an expedition (Grit check, DC 15)',
      requires: [{ kind: 'goldAtLeast', amount: 150 }],
      check: {
        stat: 'grit',
        dc: 15,
        critSuccess: {
          text: 'You find an ancient cache of coins and jewelry worth 400 gold. Fortune favors the bold.',
          effects: [
            { kind: 'gold', delta: 400 },
            { kind: 'stat', stat: 'grit', delta: 2 },
            { kind: 'advanceDays', days: 14 },
          ],
        },
        success: {
          text: 'You find ruins and salvageable goods worth 200 gold.',
          effects: [
            { kind: 'gold', delta: 200 },
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'advanceDays', days: 14 },
          ],
        },
        failure: {
          text: 'The expedition finds nothing but danger and expense.',
          effects: [{ kind: 'gold', delta: -150 }, { kind: 'advanceDays', days: 10 }],
        },
      },
    },
    {
      id: 'ignore_map',
      label: 'Too uncertain',
      effects: [{ kind: 'narrate', text: 'You keep the map as a curiosity.' }],
    },
  ],
}

const ancient_contract: StoryCard = {
  storyPhase: 'climbing',
  id: 'ancient_contract',
  weight: 1,
  title: 'A Debt Comes Due',
  body: [
    'A collector approaches you with an ancient contract bearing your family name. "This debt was never paid," they say. "I\'ve tracked it down after thirty years. It\'s time to settle."',
  ],
  choices: [
    {
      id: 'pay_debt',
      label: 'Pay the debt (-200 gold)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'flag', id: 'honor_restored', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'Your family\'s honor is restored. The city takes notice.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'contest_debt',
      label: 'Challenge the contract (Savvy check, DC 15)',
      check: {
        stat: 'savvy',
        dc: 15,
        success: {
          text: 'You find legal flaws. The contract is void. You walk free.',
          effects: [
            { kind: 'stat', stat: 'savvy', delta: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
        failure: {
          text: 'Your challenge fails. You must pay 250 gold instead.',
          effects: [
            { kind: 'gold', delta: -250 },
            { kind: 'advanceDays', days: 4 },
          ],
        },
      },
    },
  ],
}

const spice_blockade_tightens: StoryCard = {
  storyPhase: 'climbing',
  weight: 2,
  id: 'spice_blockade_tightens',
  title: 'The Blockade Tightens',
  body: [
    'The blockade has worsened. Spice prices have tripled. Your stockpile is worth a fortune now. Merchants are desperate, offering premium prices.',
  ],
  choices: [
    {
      id: 'sell_spice_hoard',
      label: 'Sell your stockpile (+300 gold)',
      effects: [
        { kind: 'gold', delta: 300 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'Your spice investment has paid off handsomely. You\'ve proven yourself a true merchant.' },
      ],
    },
    {
      id: 'hold_spice',
      label: 'Hold for even higher prices',
      effects: [
        { kind: 'narrate', text: 'You keep your hoard, gambling on scarcity.' },
        { kind: 'advanceDays', days: 10 },
      ],
    },
  ],
}

const iron_mine_recovery: StoryCard = {
  storyPhase: 'climbing',
  weight: 2,
  id: 'iron_mine_recovery',
  title: 'Iron Begins to Flow Again',
  body: [
    'The eastern provinces are opening new iron mines to replace the collapsed one. Supply is returning. Prices are stabilizing after months of volatility.',
  ],
  choices: [
    {
      id: 'sell_on_recovery',
      label: 'Sell your iron holdings for solid profit (+150 gold)',
      effects: [
        { kind: 'gold', delta: 150 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'Your patience paid off. The recovery was worth the wait.' },
      ],
    },
    {
      id: 'keep_iron_long',
      label: 'Hold for the long term',
      effects: [
        { kind: 'narrate', text: 'You believe iron will be valuable for years to come.' },
        { kind: 'advanceDays', days: 15 },
      ],
    },
  ],
}

const iron_boom_success: StoryCard = {
  storyPhase: 'climbing',
  weight: 2,
  id: 'iron_boom_success',
  title: 'The Crown\'s Fleet Rises',
  body: [
    'The royal fleet is being built. Your foundry is thriving, supplying iron to shipwrights. The crown takes notice of your contribution to the kingdom\'s strength.',
  ],
  choices: [
    {
      id: 'accept_crown_honor',
      label: 'Accept the crown\'s recognition',
      effects: [
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'flag', id: 'crown_favor', set: 1 },
        { kind: 'narrate', text: 'You are invited to royal audiences. Doors open that were previously closed.' },
      ],
    },
    {
      id: 'stay_humble',
      label: 'Keep a low profile',
      effects: [
        { kind: 'narrate', text: 'You continue your business quietly, letting the profits speak.' },
      ],
    },
  ],
}

export const storyEventCards: StoryCard[] = [
  tavern_rumor,
  lost_caravan,
  cursed_artifact,
  guard_problem,
  fortune_teller,
  traveling_bard,
  midnight_arrival,
  plague_warning,
  scholar_encounter,
  rival_emerges,
  treasure_map,
  ancient_contract,
  spice_blockade_tightens,
  iron_mine_recovery,
  iron_boom_success,
]
