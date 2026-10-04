import type { StoryCard } from '../../engine/types'

const tavern_rumor: StoryCard = {
  storyPhase: 'climbing',
  id: 'tavern_rumor',
  weight: 4,
  title: 'Whispers in the Tavern',
  body: [
    'In the corner of the Salty Anchor, three merchants whisper about bandits on the northern road. One swears he saw them. One says it\'s nonsense. One says the guards know, but do nothing.',
  ],
  choices: [
    {
      id: 'investigate_bandits',
      label: 'Ask a few clever questions (Savvy check, DC 12)',
      check: {
        stat: 'savvy',
        dc: 12,
        success: {
          text: 'The bandits are real, but they keep off the main roads. Good to know!',
          effects: [
            { kind: 'flag', id: 'knows_bandit_routes', set: 1 },
            { kind: 'advanceDays', days: 2 },
          ],
        },
        failure: {
          text: 'The merchants go quiet and stare into their mugs. You learn nothing.',
          effects: [{ kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'ignore_rumor',
      label: 'Ignore the gossip',
      effects: [
        { kind: 'narrate', text: 'You finish your cider and head out into the night.' },
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
    'A muddy merchant rushes up, wringing his hands. "My caravan never arrived! It\'s carrying a fortune. Find it, and I\'ll pay you well!"',
  ],
  choices: [
    {
      id: 'search_caravan',
      label: 'Lead a search party (Grit check, DC 14)',
      requires: [{ kind: 'goldAtLeast', amount: 50 }],
      check: {
        stat: 'grit',
        dc: 14,
        success: {
          text: 'You follow wheel tracks to a hidden ravine, and there it is! The merchant pays you 200 gold.',
          effects: [
            { kind: 'gold', delta: 200 },
            { kind: 'flag', id: 'merchant_favor', delta: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
        failure: {
          text: 'Days of searching turn up nothing but sore feet and an empty purse.',
          effects: [
            { kind: 'gold', delta: -50 },
            { kind: 'advanceDays', days: 4 },
          ],
        },
      },
    },
    {
      id: 'decline_search',
      label: 'Wish him luck',
      effects: [{ kind: 'narrate', text: 'You wish him luck. He hurries off to ask someone else.' }],
    },
  ],
}

const cursed_artifact: StoryCard = {
  storyPhase: 'climbing',
  id: 'cursed_artifact',
  weight: 4,
  title: 'The Cursed Statue',
  body: [
    'A sweating collector pushes a little stone statue at you. Its eyes seem to follow you. "Take it, cheap!" he whispers. "3 owners before me all lost their fortunes."',
  ],
  choices: [
    {
      id: 'examine_artifact',
      label: 'Examine it closely (Savvy check, DC 13)',
      check: {
        stat: 'savvy',
        dc: 13,
        success: {
          text: 'No curse, just fine old carving! You sell it to a museum for 150 gold profit.',
          effects: [{ kind: 'gold', delta: 150 }, { kind: 'advanceDays', days: 3 }],
        },
        failure: {
          text: 'You buy it. That week, your roof leaks, your cart breaks, and your cat runs away.',
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
      effects: [{ kind: 'narrate', text: 'You back away slowly. The statue\'s eyes follow you all the way out.' }],
    },
  ],
}

const guard_problem: StoryCard = {
  storyPhase: 'climbing',
  id: 'guard_problem',
  weight: 4,
  title: 'The Guard Who Wants to Help',
  body: [
    'A young guard sighs into his tea. "Bandits keep raiding the caravans, and the city won\'t pay for more patrols. If a merchant paid for guards, we could stop them!"',
  ],
  choices: [
    {
      id: 'back_guard_contract',
      label: 'Pay for the guards (-100g)',
      requires: [{ kind: 'goldAtLeast', amount: 100 }],
      check: {
        stat: 'charm',
        dc: 12,
        success: {
          text: 'The new patrols scare the bandits away. Every merchant in town hears who paid for them.',
          effects: [
            { kind: 'gold', delta: -100 },
            { kind: 'stat', stat: 'charm', delta: 1 },
            { kind: 'flag', id: 'city_patron', delta: 1 },
            { kind: 'advanceDays', days: 7 },
          ],
        },
        failure: {
          text: 'The city council argues for weeks and nothing happens. Your gold is wasted.',
          effects: [{ kind: 'gold', delta: -100 }, { kind: 'advanceDays', days: 2 }],
        },
      },
    },
    {
      id: 'refuse_guard',
      label: 'Not your problem',
      effects: [{ kind: 'narrate', text: 'The guard finishes his tea and trudges off, disappointed.' }],
    },
  ],
}

const fortune_teller: StoryCard = {
  storyPhase: 'climbing',
  id: 'seers_warning',
  weight: 4,
  title: 'The Seer\'s Warning',
  body: [
    'A fortune teller with jangling bracelets grabs your hand. "I see great danger, and even greater luck! A choice is coming that will change everything."',
  ],
  choices: [
    {
      id: 'heed_warning',
      label: 'Ask what she means (Nerve check, DC 11)',
      check: {
        stat: 'nerve',
        dc: 11,
        success: {
          text: '"Trust steady hands and sharp minds," she says. Somehow, you feel ready for anything.',
          effects: [
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'flag', id: 'seer_blessed', set: 1 },
            { kind: 'advanceDays', days: 1 },
          ],
        },
        failure: {
          text: 'She mumbles about crows and teacups. You leave more confused than before.',
          effects: [{ kind: 'advanceDays', days: 1 }],
        },
      },
    },
    {
      id: 'dismiss_seer',
      label: 'Pull your hand away',
      effects: [{ kind: 'narrate', text: 'You pull your hand back. Fortune tellers! Honestly.' }],
    },
  ],
}

const traveling_bard: StoryCard = {
  storyPhase: 'climbing',
  id: 'traveling_bard',
  weight: 4,
  title: 'Tales of the Colossi',
  body: [
    'A bard leaps onto a tavern table and strums his lute. "Hear the tale of the 7 Colossi!" he sings. "Giants who wake when a merchant grows too rich, and only the worthy can beat them!"',
  ],
  choices: [
    {
      id: 'listen_bard',
      label: 'Listen to the whole song',
      effects: [
        { kind: 'narrate', text: 'The song gives you shivers. The world suddenly feels bigger, full of hidden wonders.' },
        { kind: 'stat', stat: 'nerve', delta: 1 },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'ignore_bard',
      label: 'Head home',
      effects: [{ kind: 'narrate', text: 'You have no time for songs tonight.' }],
    },
  ],
}

const midnight_arrival: StoryCard = {
  storyPhase: 'climbing',
  id: 'midnight_arrival',
  weight: 4,
  title: 'Strangers at Midnight',
  body: [
    'At midnight, 3 cloaked riders clatter into town. They ask about a rich and cunning merchant, then vanish before dawn. Now everyone is wondering who they were looking for.',
  ],
  choices: [
    {
      id: 'ask_questions',
      label: 'Find out who they were (Savvy check, DC 14)',
      check: {
        stat: 'savvy',
        dc: 14,
        success: {
          text: 'They were bank agents, hunting a cheat who stole from them. Now you know who to steer clear of.',
          effects: [
            { kind: 'flag', id: 'guild_wary', set: 1 },
            { kind: 'advanceDays', days: 3 },
          ],
        },
        failure: {
          text: 'Your questions get noticed. Now the bank is curious about you.',
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
        { kind: 'narrate', text: 'You keep quiet and stay out of it.' },
        { kind: 'advanceDays', days: 1 },
      ],
    },
  ],
}

const plague_warning: StoryCard = {
  storyPhase: 'climbing',
  id: 'plague_warning',
  weight: 1,
  title: 'A Cough in the Poor Quarter',
  body: [
    'A worried healer comes to your door. "A sickness has started in the poor quarter," she says. "If it spreads, trade will stop. I need money for medicine now."',
  ],
  choices: [
    {
      id: 'help_healer',
      label: 'Give her money for medicine (-75g)',
      requires: [{ kind: 'goldAtLeast', amount: 75 }],
      effects: [
        { kind: 'gold', delta: -75 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'flag', id: 'community_hero', delta: 1 },
        { kind: 'narrate', text: 'Your gift buys medicine for dozens of families. The city will remember.' },
        { kind: 'advanceDays', days: 5 },
      ],
    },
    {
      id: 'wait_and_profit',
      label: 'Wait, and profit when prices rise',
      effects: [
        { kind: 'narrate', text: 'You start working out what you could sell when things get worse.' },
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
  title: 'The Old Scholar',
  body: [
    'An old scholar peers at you over her spectacles. "I\'ve studied money for 40 years," she says. "Most merchants get rich but never understand why. I could teach you."',
  ],
  choices: [
    {
      id: 'study_merchant',
      label: 'Become her student',
      effects: [
        { kind: 'stat', stat: 'savvy', delta: 2 },
        { kind: 'flag', id: 'mentor_found', set: 1 },
        { kind: 'narrate', text: 'Her lessons change how you see every deal.' },
        { kind: 'advanceDays', days: 10 },
      ],
    },
    {
      id: 'decline_mentor',
      label: 'Learn by doing instead',
      effects: [{ kind: 'narrate', text: 'You thank her, and trust your own instincts.' }],
    },
  ],
}

const rival_emerges: StoryCard = {
  storyPhase: 'climbing',
  id: 'rival_emerges',
  weight: 4,
  title: 'A New Rival in Town',
  body: [
    'A sharp-eyed newcomer opens a shop across the street, selling everything cheaper than you. She stares at you through her window. "I\'ve heard of you," she says. "This market isn\'t big enough for both of us."',
  ],
  choices: [
    {
      id: 'challenge_rival',
      label: 'Take her on (Nerve check, DC 13)',
      check: {
        stat: 'nerve',
        dc: 13,
        success: {
          text: 'You hold your ground. She respects that, and the competition makes you both better.',
          effects: [
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'flag', id: 'has_rival', set: 1 },
            { kind: 'advanceDays', days: 8 },
          ],
        },
        failure: {
          text: 'You blink first. She cuts her prices again and again, and your customers drift away.',
          effects: [
            { kind: 'flag', id: 'losing_ground', delta: 1 },
            { kind: 'advanceDays', days: 4 },
          ],
        },
      },
    },
    {
      id: 'cooperate_rival',
      label: 'Offer to work together',
      effects: [
        { kind: 'narrate', text: 'You cross the street and offer your hand. She looks very surprised.' },
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
    'A gap-toothed prospector sells you a crumpled map for 20 gold. A big red X sits in the eastern mountains. "Something\'s there," she cackles. "Treasure or trouble!"',
  ],
  choices: [
    {
      id: 'follow_map',
      label: 'Go and find the X (Grit check, DC 15)',
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
          text: 'Under the X you find old ruins full of treasure, worth 200 gold!',
          effects: [
            { kind: 'gold', delta: 200 },
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'advanceDays', days: 14 },
          ],
        },
        failure: {
          text: 'You find rocks, rain and a very angry goat. The trip costs you dearly.',
          effects: [{ kind: 'gold', delta: -150 }, { kind: 'advanceDays', days: 10 }],
        },
      },
    },
    {
      id: 'ignore_map',
      label: 'Keep it as a souvenir',
      effects: [{ kind: 'narrate', text: 'You pin the map on your wall. One day, maybe.' }],
    },
  ],
}

const ancient_contract: StoryCard = {
  storyPhase: 'climbing',
  id: 'ancient_contract',
  weight: 1,
  title: 'A Debt Comes Due',
  body: [
    'A dusty old man unrolls a yellowed contract. Your family name is on it! "Your grandfather never paid this debt," he says. "I\'ve looked for 30 years. Time to settle up."',
  ],
  choices: [
    {
      id: 'pay_debt',
      label: 'Pay your grandfather\'s debt (-200g)',
      requires: [{ kind: 'goldAtLeast', amount: 200 }],
      effects: [
        { kind: 'gold', delta: -200 },
        { kind: 'flag', id: 'honor_restored', set: 1 },
        { kind: 'stat', stat: 'charm', delta: 1 },
        { kind: 'narrate', text: 'Your family name is clean again. People notice your honesty.' },
        { kind: 'advanceDays', days: 2 },
      ],
    },
    {
      id: 'contest_debt',
      label: 'Check the contract for mistakes (Savvy check, DC 15)',
      check: {
        stat: 'savvy',
        dc: 15,
        success: {
          text: 'The signature is wrong! The contract is worthless, and you owe nothing.',
          effects: [
            { kind: 'stat', stat: 'savvy', delta: 1 },
            { kind: 'advanceDays', days: 5 },
          ],
        },
        failure: {
          text: 'The contract is real. Now you owe 250 gold, with the extra fees.',
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
    'The blockade still holds, and spice prices have tripled! Merchants bang on your door, begging to buy your stockpile.',
  ],
  choices: [
    {
      id: 'sell_spice_hoard',
      label: 'Sell your spice (+300g)',
      effects: [
        { kind: 'gold', delta: 300 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'Your storeroom of spice pays off beautifully. You are a real merchant now!' },
      ],
    },
    {
      id: 'hold_spice',
      label: 'Wait for even higher prices',
      effects: [
        { kind: 'narrate', text: 'You lock the storeroom and wait for prices to climb even higher.' },
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
    'New iron mines have opened in the east. Carts of ore rumble into town again, and iron prices finally settle down.',
  ],
  choices: [
    {
      id: 'sell_on_recovery',
      label: 'Sell your iron for a solid profit (+150g)',
      effects: [
        { kind: 'gold', delta: 150 },
        { kind: 'stat', stat: 'savvy', delta: 1 },
        { kind: 'narrate', text: 'Your patience paid off. It was worth the wait!' },
      ],
    },
    {
      id: 'keep_iron_long',
      label: 'Keep it for the long run',
      effects: [
        { kind: 'narrate', text: 'You are sure iron will be valuable for years to come.' },
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
    'Proud new ships slide into the harbour, built with your iron. A royal messenger arrives with a golden invitation.',
  ],
  choices: [
    {
      id: 'accept_crown_honor',
      label: 'Accept the royal invitation',
      effects: [
        { kind: 'stat', stat: 'charm', delta: 2 },
        { kind: 'flag', id: 'crown_favor', set: 1 },
        { kind: 'narrate', text: 'You bow before the throne. From now on, palace doors open for you.' },
      ],
    },
    {
      id: 'stay_humble',
      label: 'Stay modest',
      effects: [
        { kind: 'narrate', text: 'You send polite thanks and keep working quietly. Your profits speak for you.' },
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
