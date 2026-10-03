import type { StoryCard } from '../../engine/types'

export const chapter7CommodityCards: StoryCard[] = [
  {
    id: 'ch7_artifact_collection',
    chapter: 7,
    weight: 5,
    storyPhase: 'reckoning',
    title: 'Ancient Artifact Collection',
    body: ['A collector of forbidden artifacts offers to sell you access to reality-warping items. "These objects transcend commerce. 400 gold buys entry to the impossible."'],
    choices: [
      {
        id: 'collect_artifacts',
        label: 'Buy artifact collection (400g)',
        requires: [{ kind: 'goldAtLeast', amount: 400 }],
        effects: [
          { kind: 'gold', delta: -400 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch7_artifacts', label: 'Forbidden Artifact Collection', cost: 400, monthlyCashflow: 150, sector: 'transcendence' },
          },
          { kind: 'stat', stat: 'nerve', delta: 2 },
          { kind: 'narrate', text: 'You touch forces beyond mortal understanding. The artifacts whisper secrets.' },
        ],
      },
      { id: 'refuse_artifacts', label: 'Refuse (fear the unknown)', effects: [{ kind: 'narrate', text: 'Some knowledge is better left unknown.' }] },
    ],
  },

  {
    id: 'ch7_dimensional_trade',
    chapter: 7,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Dimensional Trade Route',
    body: ['A merchant claims to traffic goods from alternate dimensions. "Impossible goods at impossible prices. 380 gold opens the gateway."'],
    choices: [
      {
        id: 'open_gateway',
        label: 'Open the dimensional gateway (380g)',
        requires: [{ kind: 'goldAtLeast', amount: 380 }],
        effects: [
          { kind: 'gold', delta: -380 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch7_gateway', label: 'Dimensional Trade Gateway', cost: 380, monthlyCashflow: 140, sector: 'transcendence' },
          },
          { kind: 'flag', id: 'dimensional_trader', set: 1 },
          { kind: 'narrate', text: 'Reality bends around your warehouse. Goods from impossible places now flow through your hands.' },
        ],
      },
      { id: 'stay_mundane', label: 'Stay in your dimension', effects: [{ kind: 'narrate', text: 'Perhaps this is safer.' }] },
    ],
  },

  {
    id: 'ch7_consciousness_trade',
    chapter: 7,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Trade in Consciousness Itself',
    body: ['A transcendent being offers to teach you consciousness trading. "Minds are currency at this level. 420 gold for enlightenment and profit."'],
    choices: [
      {
        id: 'trade_consciousness',
        label: 'Learn consciousness trading (420g)',
        requires: [{ kind: 'goldAtLeast', amount: 420 }],
        effects: [
          { kind: 'gold', delta: -420 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch7_consciousness', label: 'Consciousness Trading Network', cost: 420, monthlyCashflow: 160, sector: 'transcendence' },
          },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'flag', id: 'transcendent_being', set: 1 },
          { kind: 'narrate', text: 'Your mind expands. You trade in concepts that defy description.' },
        ],
      },
      { id: 'stay_human', label: 'Remain human', effects: [{ kind: 'narrate', text: 'Humanity has limits. Perhaps that\'s good.' }] },
    ],
  },
]

export const chapter7MarketCards: StoryCard[] = [
  {
    id: 'ch7_reality_fractures',
    chapter: 7,
    weight: 5,
    storyPhase: 'reckoning',
    title: 'Reality Begins to Fracture',
    body: ['The very fabric of reality tears. Multiple dimensions bleed into each other. Time, space, and economics cease to function normally.'],
    choices: [
      {
        id: 'ride_wave',
        label: 'Ride the reality wave (+500g)',
        effects: [
          { kind: 'gold', delta: 500 },
          { kind: 'marketShift', sector: 'transcendence', delta: 50 },
          { kind: 'stat', stat: 'nerve', delta: 2 },
          { kind: 'narrate', text: 'You surf the edge of chaos. Reality-shattering profits await.' },
        ],
      },
      {
        id: 'seek_refuge',
        label: 'Seek refuge in stability (-300g)',
        effects: [
          { kind: 'gold', delta: -300 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'You save others. The profit is secondary to survival.' },
        ],
      },
    ],
  },

  {
    id: 'ch7_time_market_chaos',
    chapter: 7,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Time Market Collapses',
    body: ['Markets exist in multiple time-streams simultaneously. Past, present, and future transactions conflict. Fortunes materialize and vanish instantly.'],
    choices: [
      {
        id: 'time_arbitrage',
        label: 'Exploit time arbitrage (+450g)',
        effects: [
          { kind: 'gold', delta: 450 },
          { kind: 'marketShift', sector: 'transcendence', delta: 40 },
          { kind: 'narrate', text: 'You trade across time itself. The profits defy explanation.' },
        ],
      },
      {
        id: 'abandon_market',
        label: 'Abandon temporal markets (-250g)',
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'advanceDays', days: 5 },
          { kind: 'narrate', text: 'You step out of time. Safety, but at a cost.' },
        ],
      },
    ],
  },

  {
    id: 'ch7_cosmic_event',
    chapter: 7,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Cosmic Event Reshapes Economy',
    body: ['A cosmic force sweeps through space-time. The old economy is dead. Something new emerges from the chaos.'],
    choices: [
      {
        id: 'embrace_new_order',
        label: 'Lead the new economy (+550g)',
        effects: [
          { kind: 'gold', delta: 550 },
          { kind: 'marketShift', sector: 'transcendence', delta: 60 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'You lead humanity into a new era. Your wealth is incomprehensible.' },
        ],
      },
      {
        id: 'transcend_wealth',
        label: 'Transcend the need for wealth',
        effects: [
          { kind: 'gold', delta: -1000 },
          { kind: 'stat', stat: 'charm', delta: 3 },
          { kind: 'narrate', text: 'You give away everything. Enlightenment cannot be bought, only discovered.' },
        ],
      },
    ],
  },
]

export const chapter7DangerCards: StoryCard[] = [
  {
    id: 'ch7_entity_confrontation',
    chapter: 7,
    weight: 5,
    storyPhase: 'reckoning',
    title: 'Ancient Entity Demands Reckoning',
    body: ['An entity older than civilization confronts you. "You have accumulated power beyond your understanding. Now you must answer for it."'],
    choices: [
      {
        id: 'negotiate_entity',
        label: 'Negotiate with the entity (Charm check, DC 18)',
        check: {
          stat: 'charm',
          dc: 18,
          success: { text: 'You reason with an ancient mind. A truce is reached.', effects: [{ kind: 'stat', stat: 'charm', delta: 3 }] },
          failure: { text: 'Your words are meaningless. The entity consumes your wealth.', effects: [{ kind: 'gold', delta: -1000 }] },
        },
      },
      {
        id: 'fight_entity',
        label: 'Fight the entity (Epic battle)',
        effects: [
          { kind: 'advanceDays', days: 7 },
          { kind: 'stat', stat: 'grit', delta: 2 },
          { kind: 'stat', stat: 'nerve', delta: 2 },
          { kind: 'narrate', text: 'You battle a cosmic force. You survive, but barely.' },
        ],
      },
    ],
  },

  {
    id: 'ch7_mind_unraveling',
    chapter: 7,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Your Mind Begins to Unravel',
    body: ['The knowledge you\'ve accumulated breaks your sanity. Reality and illusion blur. You see truths humans should not know.'],
    choices: [
      {
        id: 'embrace_madness',
        label: 'Embrace the madness',
        effects: [
          { kind: 'stat', stat: 'nerve', delta: 3 },
          { kind: 'stat', stat: 'charm', delta: -2 },
          { kind: 'stat', stat: 'savvy', delta: -2 },
          { kind: 'narrate', text: 'You accept the madness. Sanity was just a chain anyway.' },
        ],
      },
      {
        id: 'resist_madness',
        label: 'Fight to stay sane (Grit check, DC 16)',
        check: {
          stat: 'grit',
          dc: 16,
          success: { text: 'You cling to sanity through sheer will.', effects: [{ kind: 'stat', stat: 'grit', delta: 3 }] },
          failure: { text: 'The madness claims you. You become a shell.', effects: [{ kind: 'end', status: 'won', summary: 'You achieved ultimate wealth but lost your mind in the process.' }] },
        },
      },
    ],
  },

  {
    id: 'ch7_final_choice',
    chapter: 7,
    weight: 5,
    storyPhase: 'reckoning',
    title: 'The Final Choice: Ascension or Legacy',
    body: ['You stand at the precipice. You can ascend beyond humanity, or return to help your species. You cannot do both. Choose.'],
    choices: [
      {
        id: 'ascend',
        label: 'Ascend beyond humanity',
        effects: [
          { kind: 'stat', stat: 'nerve', delta: 2 },
          { kind: 'stat', stat: 'savvy', delta: 2 },
          { kind: 'end', status: 'won', summary: 'You transcended. You became something more than human. The world was left behind.' },
        ],
      },
      {
        id: 'return_legacy',
        label: 'Return to build a legacy',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 3 },
          { kind: 'gold', delta: 500 },
          { kind: 'end', status: 'won', summary: 'You returned with knowledge to transform your world. Your legacy will guide humanity.' },
        ],
      },
      {
        id: 'reject_both',
        label: 'Reject the choice and live quietly',
        effects: [
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'gold', delta: -1000 },
          { kind: 'end', status: 'won', summary: 'You walked away from power. Some say that was the wisest choice of all.' },
        ],
      },
    ],
  },
]
