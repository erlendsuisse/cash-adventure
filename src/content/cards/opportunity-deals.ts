// Business deals and opportunities - core gameplay for asset collection
import type { StoryCard } from '../../engine/types'

export const opportunityDealCards: StoryCard[] = [
  // Early game opportunities (cheap, 50-150g)
  {
    id: 'tavern_investment',
    title: 'A Share of the Anchor & Coin',
    body: [
      'The jolly owner of the Anchor & Coin wipes the bar and grins. "I\'m retiring, friend. 100 gold buys a share. You\'ll earn it back in a few months."',
    ],
    storyPhase: 'early_game',
    weight: 12,
    requires: [{ kind: 'goldAtLeast', amount: 100 }],
    choices: [
      {
        id: 'buy_tavern',
        label: 'Buy a share (100g)',
        effects: [
          { kind: 'gold', delta: -100 },
          {
            kind: 'acquireAsset',
            asset: { id: 'tavern_stake', label: 'Tavern Stake', cost: 100, monthlyCashflow: 15, sector: 'property' },
          },
          { kind: 'narrate', text: 'You own part of the Anchor & Coin now. The fiddles play, the mugs clink, and the gold keeps coming.' },
        ],
      },
      {
        id: 'decline_tavern',
        label: 'Not today',
        effects: [{ kind: 'narrate', text: 'He shrugs and goes back to polishing mugs.' }],
      },
    ],
  },

  {
    id: 'workshop_partnership',
    title: 'The Woodcarver\'s Workshop',
    body: [
      'A woodcarver shows you a chair so beautiful it looks alive. "Give me 80 gold for tools and wood," she says, "and we split the profits."',
    ],
    storyPhase: 'early_game',
    weight: 11,
    requires: [{ kind: 'goldAtLeast', amount: 80 }],
    choices: [
      {
        id: 'fund_workshop',
        label: 'Fund the workshop (80g)',
        effects: [
          { kind: 'gold', delta: -80 },
          {
            kind: 'acquireAsset',
            asset: { id: 'workshop_partnership', label: 'Workshop Partnership', cost: 80, monthlyCashflow: 18, sector: 'craft' },
          },
          { kind: 'narrate', text: 'Her clever hands turn your gold into furniture fit for nobles. Business is booming.' },
        ],
      },
      {
        id: 'decline_workshop',
        label: 'Not today',
        effects: [{ kind: 'narrate', text: 'She finds another partner and gets carving.' }],
      },
    ],
  },

  {
    id: 'fishing_fleet_share',
    title: 'A Share in a Fishing Boat',
    body: [
      'Dockworkers are chipping in to buy a fishing boat called the Lucky Herring. "75 gold buys you a share of every catch," says one.',
    ],
    storyPhase: 'early_game',
    weight: 11,
    requires: [{ kind: 'goldAtLeast', amount: 75 }],
    choices: [
      {
        id: 'buy_fishing_share',
        label: 'Buy a share (75g)',
        effects: [
          { kind: 'gold', delta: -75 },
          {
            kind: 'acquireAsset',
            asset: { id: 'fishing_boat_share', label: 'Fishing Boat Share', cost: 75, monthlyCashflow: 16, sector: 'trade' },
          },
          { kind: 'narrate', text: 'The Lucky Herring comes home every evening, full of fish. A little gold comes to you every month.' },
        ],
      },
      {
        id: 'decline_fishing',
        label: 'Not for you',
        effects: [{ kind: 'narrate', text: 'The dockworkers keep collecting coins for their boat.' }],
      },
    ],
  },

  {
    id: 'brewery_venture',
    title: 'The Cider Press',
    body: [
      'A brewer offers you a cup of her famous spiced cider. It\'s delicious! "150 gold buys a bigger press," she says, "and the whole city will be drinking it."',
    ],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 150 }],
    choices: [
      {
        id: 'fund_brewery',
        label: 'Fund the cider press (150g)',
        effects: [
          { kind: 'gold', delta: -150 },
          {
            kind: 'acquireAsset',
            asset: { id: 'brewery_stake', label: 'Brewery Stake', cost: 150, monthlyCashflow: 28, sector: 'trade' },
          },
          { kind: 'narrate', text: 'Soon half the taverns in Vessarin serve your spiced cider.' },
        ],
      },
      {
        id: 'decline_brewery',
        label: 'Too risky',
        effects: [{ kind: 'narrate', text: 'She offers a cup to the next merchant along.' }],
      },
    ],
  },

  {
    id: 'vineyard_opportunity',
    title: 'The Sunny Vineyard',
    body: [
      'An old vineyard owner stands among rows of fat purple grapes. "I\'m retiring," he says. "200 gold, and most of it is yours. It pays a little more every year."',
    ],
    storyPhase: 'climbing',
    weight: 9,
    requires: [{ kind: 'goldAtLeast', amount: 200 }],
    choices: [
      {
        id: 'buy_vineyard',
        label: 'Buy into the vineyard (200g)',
        effects: [
          { kind: 'gold', delta: -200 },
          {
            kind: 'acquireAsset',
            asset: { id: 'vineyard_stake', label: 'Vineyard Stake', cost: 200, monthlyCashflow: 24, sector: 'property' },
          },
          { kind: 'narrate', text: 'Your vines grow fat grapes every summer, and gold every season.' },
        ],
      },
      {
        id: 'decline_vineyard',
        label: 'Not now',
        effects: [{ kind: 'narrate', text: 'Another buyer snaps up the vineyard.' }],
      },
    ],
  },

  {
    id: 'bookbinder_deal',
    title: 'The Bookbinder',
    body: [
      'A bookbinder hands you a leather journal that smells of cedar. "60 gold, and we\'re partners," he says. "I make them, you sell them."',
    ],
    storyPhase: 'early_game',
    weight: 12,
    requires: [{ kind: 'goldAtLeast', amount: 60 }],
    choices: [
      {
        id: 'partner_bookbinder',
        label: 'Partner with him (60g)',
        effects: [
          { kind: 'gold', delta: -60 },
          {
            kind: 'acquireAsset',
            asset: { id: 'bookbinder_partnership', label: 'Bookbinder Partnership', cost: 60, monthlyCashflow: 14, sector: 'craft' },
          },
          { kind: 'narrate', text: 'Every merchant in town wants one of your journals. They sell as fast as he can stitch them.' },
        ],
      },
      {
        id: 'decline_bookbinder',
        label: 'Not today',
        effects: [{ kind: 'narrate', text: 'He finds another seller for his books.' }],
      },
    ],
  },

  {
    id: 'perfumer_investment',
    title: 'The Perfume Workshop',
    body: [
      'A perfumer opens a tiny bottle. The whole room smells of summer roses. "Nobles will fight over this," she says. "90 gold makes you my partner."',
    ],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 90 }],
    choices: [
      {
        id: 'invest_perfumer',
        label: 'Invest in the perfume (90g)',
        effects: [
          { kind: 'gold', delta: -90 },
          {
            kind: 'acquireAsset',
            asset: { id: 'perfume_business', label: 'Perfume Business Share', cost: 90, monthlyCashflow: 20, sector: 'trade' },
          },
          { kind: 'narrate', text: 'The perfume sells faster than she can make it. Your investment smells like success!' },
        ],
      },
      {
        id: 'decline_perfumer',
        label: 'Not today',
        effects: [{ kind: 'narrate', text: 'She corks the bottle and goes looking for another partner.' }],
      },
    ],
  },

  {
    id: 'bakery_chain',
    title: 'A Second Bakery',
    body: [
      'A floury baker hands you a warm cinnamon bun. "110 gold, and we open a second bakery," he says. "Bread sells itself!"',
    ],
    storyPhase: 'climbing',
    weight: 11,
    requires: [{ kind: 'goldAtLeast', amount: 110 }],
    choices: [
      {
        id: 'fund_bakery_expansion',
        label: 'Fund the second bakery (110g)',
        effects: [
          { kind: 'gold', delta: -110 },
          {
            kind: 'acquireAsset',
            asset: { id: 'bakery_chain', label: 'Bakery Chain', cost: 110, monthlyCashflow: 19, sector: 'trade' },
          },
          { kind: 'narrate', text: 'Now two ovens fill the streets with the smell of fresh bread, and profit.' },
        ],
      },
      {
        id: 'decline_bakery',
        label: 'Not today',
        effects: [{ kind: 'narrate', text: 'He finds another partner, and keeps baking.' }],
      },
    ],
  },

  {
    id: 'stable_investment',
    title: 'The Riding Stables',
    body: [
      'A stable keeper strokes a glossy black horse. "Nobles always need horses," she says. "140 gold buys you a share of my stables."',
    ],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 140 }],
    choices: [
      {
        id: 'buy_stable_stake',
        label: 'Buy a share (140g)',
        effects: [
          { kind: 'gold', delta: -140 },
          {
            kind: 'acquireAsset',
            asset: { id: 'horse_stable', label: 'Horse Stable', cost: 140, monthlyCashflow: 21, sector: 'property' },
          },
          { kind: 'narrate', text: 'Nobles trot in every day to hire horses. The stables thrive.' },
        ],
      },
      {
        id: 'decline_stable',
        label: 'Not today',
        effects: [{ kind: 'narrate', text: 'She looks for another partner.' }],
      },
    ],
  },

  {
    id: 'library_endowment',
    title: 'The City\'s First Library',
    body: [
      'A scholar dreams of building Vessarin\'s first real library. "170 gold, and it carries your name," he says. "People pay to copy books, too."',
    ],
    storyPhase: 'climbing',
    weight: 9,
    requires: [{ kind: 'goldAtLeast', amount: 170 }],
    choices: [
      {
        id: 'endow_library',
        label: 'Fund the library (170g)',
        effects: [
          { kind: 'gold', delta: -170 },
          {
            kind: 'acquireAsset',
            asset: { id: 'library_endowment', label: 'Library Endowment', cost: 170, monthlyCashflow: 22, sector: 'property' },
          },
          { kind: 'narrate', text: 'Students and scholars flock to your library. Every copied page earns you a coin.' },
        ],
      },
      {
        id: 'decline_library',
        label: 'Not for you',
        effects: [{ kind: 'narrate', text: 'He goes looking for another patron.' }],
      },
    ],
  },

  {
    id: 'mill_partnership',
    title: 'The Old Water Mill',
    body: [
      'The great wheel of the water mill turns and splashes. "130 gold, and you\'re my partner," says the miller. "Grain goes in, gold comes out!"',
    ],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 130 }],
    choices: [
      {
        id: 'partner_mill',
        label: 'Partner with the miller (130g)',
        effects: [
          { kind: 'gold', delta: -130 },
          {
            kind: 'acquireAsset',
            asset: { id: 'mill_partnership', label: 'Mill Partnership', cost: 130, monthlyCashflow: 20, sector: 'trade' },
          },
          { kind: 'narrate', text: 'The wheel turns and the stones grind. Steady as the river, the gold comes in.' },
        ],
      },
      {
        id: 'decline_mill',
        label: 'Not today',
        effects: [{ kind: 'narrate', text: 'The miller finds another partner.' }],
      },
    ],
  },
]
