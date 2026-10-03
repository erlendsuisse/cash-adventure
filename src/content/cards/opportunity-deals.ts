// Business deals and opportunities - core gameplay for asset collection
import type { StoryCard } from '../../engine/types'

export const opportunityDealCards: StoryCard[] = [
  // Early game opportunities (cheap, 50-150g)
  {
    id: 'tavern_investment',
    title: 'A Tavern Investment',
    body: [
      'The owner of The Anchor & Coin is retiring. The tavern is profitable and well-located. "I\'ll sell you a stake for 100 gold," he says. "You\'ll make it back in a few months."',
    ],
    storyPhase: 'early_game',
    weight: 12,
    requires: [{ kind: 'goldAtLeast', amount: 100 }],
    choices: [
      {
        id: 'buy_tavern',
        label: 'Buy a stake in the tavern (100g)',
        effects: [
          { kind: 'gold', delta: -100 },
          {
            kind: 'acquireAsset',
            asset: { id: 'tavern_stake', label: 'Tavern Stake', cost: 100, monthlyCashflow: 15, sector: 'property' },
          },
          { kind: 'narrate', text: 'You become part owner of The Anchor & Coin. The drinks keep flowing and the gold keeps coming.' },
        ],
      },
      {
        id: 'decline_tavern',
        label: 'Decline',
        effects: [{ kind: 'narrate', text: 'The owner shrugs and looks for another investor.' }],
      },
    ],
  },

  {
    id: 'workshop_partnership',
    title: 'A Craftsperson\'s Partnership',
    body: [
      'A master craftsperson approaches you. "I need working capital to expand. Give me 80 gold, and we\'ll split profits 50-50." The craftsmanship is exceptional.',
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
          { kind: 'narrate', text: 'Your capital multiplies through skilled hands. The partnership thrives.' },
        ],
      },
      {
        id: 'decline_workshop',
        label: 'Pass',
        effects: [{ kind: 'narrate', text: 'The craftsperson finds another backer.' }],
      },
    ],
  },

  {
    id: 'fishing_fleet_share',
    title: 'A Fishing Fleet Share',
    body: [
      'Dockworkers are pooling money to buy a fishing boat. "It\'s a solid investment - 75 gold gets you a share of the catch profits." Simple, steady income.',
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
          { kind: 'narrate', text: 'Your money is tied up in a boat that brings in steady catches and steady gold.' },
        ],
      },
      {
        id: 'decline_fishing',
        label: 'Not interested',
        effects: [{ kind: 'narrate', text: 'The dockworkers continue gathering investors.' }],
      },
    ],
  },

  {
    id: 'brewery_venture',
    title: 'A Brewery Proposition',
    body: [
      'A brewer with a famous recipe needs capital to scale. "150 gold and we\'ll make something the whole city talks about." Their ales are already legendary.',
    ],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 150 }],
    choices: [
      {
        id: 'fund_brewery',
        label: 'Fund the brewery (150g)',
        effects: [
          { kind: 'gold', delta: -150 },
          {
            kind: 'acquireAsset',
            asset: { id: 'brewery_stake', label: 'Brewery Stake', cost: 150, monthlyCashflow: 28, sector: 'trade' },
          },
          { kind: 'narrate', text: 'Your gold turns into a brewery that supplies half the taverns in Vessarin.' },
        ],
      },
      {
        id: 'decline_brewery',
        label: 'Too risky',
        effects: [{ kind: 'narrate', text: 'The brewer tries the next potential investor.' }],
      },
    ],
  },

  {
    id: 'vineyard_opportunity',
    title: 'A Vineyard Investment',
    body: [
      'A vineyard owner is retiring. The vines are mature, the wine ages naturally. "200 gold for a controlling stake. Wine ages to gold." A long-term play.',
    ],
    storyPhase: 'climbing',
    weight: 9,
    requires: [{ kind: 'goldAtLeast', amount: 200 }],
    choices: [
      {
        id: 'buy_vineyard',
        label: 'Buy the vineyard stake (200g)',
        effects: [
          { kind: 'gold', delta: -200 },
          {
            kind: 'acquireAsset',
            asset: { id: 'vineyard_stake', label: 'Vineyard Stake', cost: 200, monthlyCashflow: 24, sector: 'property' },
          },
          { kind: 'narrate', text: 'You own vines that produce liquid gold, season after season.' },
        ],
      },
      {
        id: 'decline_vineyard',
        label: 'Not now',
        effects: [{ kind: 'narrate', text: 'The vineyard goes to another buyer.' }],
      },
    ],
  },

  {
    id: 'bookbinder_deal',
    title: 'A Bookbinder\'s Opportunity',
    body: [
      'A master bookbinder has crafted the most beautiful ledgers and journals the city has seen. "60 gold for a partnership. I\'ll make them, you sell them." Low cost, quick returns.',
    ],
    storyPhase: 'early_game',
    weight: 12,
    requires: [{ kind: 'goldAtLeast', amount: 60 }],
    choices: [
      {
        id: 'partner_bookbinder',
        label: 'Partner with the bookbinder (60g)',
        effects: [
          { kind: 'gold', delta: -60 },
          {
            kind: 'acquireAsset',
            asset: { id: 'bookbinder_partnership', label: 'Bookbinder Partnership', cost: 60, monthlyCashflow: 14, sector: 'craft' },
          },
          { kind: 'narrate', text: 'Beautiful books and steady profits flow from this partnership.' },
        ],
      },
      {
        id: 'decline_bookbinder',
        label: 'Pass',
        effects: [{ kind: 'narrate', text: 'The bookbinder\'s goods find another distributor.' }],
      },
    ],
  },

  {
    id: 'perfumer_investment',
    title: 'A Perfumer\'s Gambit',
    body: [
      'A perfumer has created fragrances that nobles crave. "90 gold gets you in on the ground floor. This will be everywhere." Luxurious and profitable.',
    ],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 90 }],
    choices: [
      {
        id: 'invest_perfumer',
        label: 'Invest in the perfumery (90g)',
        effects: [
          { kind: 'gold', delta: -90 },
          {
            kind: 'acquireAsset',
            asset: { id: 'perfume_business', label: 'Perfume Business Share', cost: 90, monthlyCashflow: 20, sector: 'trade' },
          },
          { kind: 'narrate', text: 'Your investment smells like success. The fragrance sells faster than it can be made.' },
        ],
      },
      {
        id: 'decline_perfumer',
        label: 'Decline',
        effects: [{ kind: 'narrate', text: 'The perfumer moves on to find capital elsewhere.' }],
      },
    ],
  },

  {
    id: 'bakery_chain',
    title: 'A Bakery Chain',
    body: [
      'A successful baker wants to expand. "110 gold and we\'ll open a second location. Bread sells itself." Steady, reliable business.',
    ],
    storyPhase: 'climbing',
    weight: 11,
    requires: [{ kind: 'goldAtLeast', amount: 110 }],
    choices: [
      {
        id: 'fund_bakery_expansion',
        label: 'Fund the expansion (110g)',
        effects: [
          { kind: 'gold', delta: -110 },
          {
            kind: 'acquireAsset',
            asset: { id: 'bakery_chain', label: 'Bakery Chain', cost: 110, monthlyCashflow: 19, sector: 'trade' },
          },
          { kind: 'narrate', text: 'Bread and pastries from multiple ovens fill the city with the smell of profit.' },
        ],
      },
      {
        id: 'decline_bakery',
        label: 'Not interested',
        effects: [{ kind: 'narrate', text: 'The baker finds another investor.' }],
      },
    ],
  },

  {
    id: 'stable_investment',
    title: 'A Horse Stable',
    body: [
      'A stable keeper wants to expand. "140 gold gets you a stake in a thriving horse business. Nobles always need mounts." Reliable nobility keeps them buying.',
    ],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 140 }],
    choices: [
      {
        id: 'buy_stable_stake',
        label: 'Buy a stake (140g)',
        effects: [
          { kind: 'gold', delta: -140 },
          {
            kind: 'acquireAsset',
            asset: { id: 'horse_stable', label: 'Horse Stable', cost: 140, monthlyCashflow: 21, sector: 'property' },
          },
          { kind: 'narrate', text: 'Hoofbeats echo profits. The stable thrives with noble business.' },
        ],
      },
      {
        id: 'decline_stable',
        label: 'Decline',
        effects: [{ kind: 'narrate', text: 'The stable keeper looks for other investors.' }],
      },
    ],
  },

  {
    id: 'library_endowment',
    title: 'A Library Endowment',
    body: [
      'A scholar wants to build the city\'s first proper library. "170 gold buys you naming rights and profits from copying fees. Knowledge is valuable." Steady, prestigious returns.',
    ],
    storyPhase: 'climbing',
    weight: 9,
    requires: [{ kind: 'goldAtLeast', amount: 170 }],
    choices: [
      {
        id: 'endow_library',
        label: 'Endow the library (170g)',
        effects: [
          { kind: 'gold', delta: -170 },
          {
            kind: 'acquireAsset',
            asset: { id: 'library_endowment', label: 'Library Endowment', cost: 170, monthlyCashflow: 22, sector: 'property' },
          },
          { kind: 'narrate', text: 'Scholars and students flock to your library, and gold flows from every page copied.' },
        ],
      },
      {
        id: 'decline_library',
        label: 'Too intellectual',
        effects: [{ kind: 'narrate', text: 'The scholar seeks another patron.' }],
      },
    ],
  },

  {
    id: 'mill_partnership',
    title: 'A Mill Partnership',
    body: [
      'A miller wants a partner with capital. "130 gold and we grind profits. Grain flows in, gold flows out." Steady as a waterwheel.',
    ],
    storyPhase: 'climbing',
    weight: 10,
    requires: [{ kind: 'goldAtLeast', amount: 130 }],
    choices: [
      {
        id: 'partner_mill',
        label: 'Partner with the mill (130g)',
        effects: [
          { kind: 'gold', delta: -130 },
          {
            kind: 'acquireAsset',
            asset: { id: 'mill_partnership', label: 'Mill Partnership', cost: 130, monthlyCashflow: 20, sector: 'trade' },
          },
          { kind: 'narrate', text: 'The mill grinds steadily, turning grain and effort into reliable profits.' },
        ],
      },
      {
        id: 'decline_mill',
        label: 'Pass',
        effects: [{ kind: 'narrate', text: 'The miller finds another partner.' }],
      },
    ],
  },
]
