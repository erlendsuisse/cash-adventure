import type { StoryCard } from '../../engine/types'

export const chapter4CommodityCards: StoryCard[] = [
  {
    id: 'ch4_banking_charter',
    chapter: 4,
    weight: 5,
    storyPhase: 'reckoning',
    title: 'Royal Banking Charter',
    body: ['A high-ranking banker offers exclusive access to royal banking privileges. "With our charter, you move money like the crown does. 300 gold for unlimited leverage."'],
    choices: [
      {
        id: 'accept_banking_charter',
        label: 'Accept the charter (300g)',
        requires: [{ kind: 'goldAtLeast', amount: 300 }],
        effects: [
          { kind: 'gold', delta: -300 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch4_banking_charter', label: 'Royal Banking Charter', cost: 300, monthlyCashflow: 80, sector: 'banking' },
          },
          { kind: 'narrate', text: 'You become a royal banker. Gold flows to you like it flows to the crown.' },
        ],
      },
      { id: 'refuse_charter', label: 'Decline the privilege', effects: [{ kind: 'narrate', text: 'The banker smiles. "Someone else will take this opportunity."' }] },
    ],
  },

  {
    id: 'ch4_government_bond_scheme',
    chapter: 4,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Government Bond Scheme',
    body: ['A financial advisor whispers of a sure thing: government bonds backed by the crown\'s treasury. "Guaranteed returns. 250 gold gets you in."'],
    choices: [
      {
        id: 'invest_bonds',
        label: 'Invest in bonds (250g)',
        requires: [{ kind: 'goldAtLeast', amount: 250 }],
        effects: [
          { kind: 'gold', delta: -250 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch4_gov_bonds', label: 'Government Bond Portfolio', cost: 250, monthlyCashflow: 60, sector: 'banking' },
          },
          { kind: 'narrate', text: 'You invest in the crown\'s future. Hopefully it pays.' },
        ],
      },
      { id: 'avoid_bonds', label: 'Avoid the investment', effects: [{ kind: 'narrate', text: 'Too risky. You keep your gold.' }] },
    ],
  },

  {
    id: 'ch4_insurance_monopoly',
    chapter: 4,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Insurance Monopoly Opportunity',
    body: ['An insurance magnate offers partnership. "Control the market on merchant insurance. Everyone needs it. We split the premiums."'],
    choices: [
      {
        id: 'partner_insurance',
        label: 'Partner in insurance (280g)',
        requires: [{ kind: 'goldAtLeast', amount: 280 }],
        effects: [
          { kind: 'gold', delta: -280 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch4_insurance', label: 'Insurance Monopoly Share', cost: 280, monthlyCashflow: 90, sector: 'banking' },
          },
          { kind: 'narrate', text: 'You profit from everyone\'s fear. Steady, reliable gold.' },
        ],
      },
      { id: 'decline_insurance', label: 'Decline', effects: [{ kind: 'narrate', text: 'They find another partner.' }] },
    ],
  },
]

export const chapter4MarketCards: StoryCard[] = [
  {
    id: 'ch4_banking_collapse',
    chapter: 4,
    weight: 5,
    storyPhase: 'reckoning',
    title: 'Banking House Collapses',
    body: ['A major banking house fails spectacularly. Credit freezes. Markets panic. Fortunes are made and lost in hours.'],
    choices: [
      {
        id: 'short_market',
        label: 'Short the falling assets (+400g)',
        effects: [
          { kind: 'gold', delta: 400 },
          { kind: 'marketShift', sector: 'banking', delta: -40 },
          { kind: 'narrate', text: 'You profit from the collapse. Ruthless, but profitable.' },
        ],
      },
      {
        id: 'buy_dip',
        label: 'Buy the dip for recovery (+200g)',
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'marketShift', sector: 'banking', delta: 15 },
          { kind: 'narrate', text: 'You buy crashed assets hoping for recovery.' },
        ],
      },
    ],
  },

  {
    id: 'ch4_crown_devalues_currency',
    chapter: 4,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Crown Devalues Currency',
    body: ['The crown secretly devalues the currency to pay war debts. Those in the know profit enormously. Everyone else loses.'],
    choices: [
      {
        id: 'insider_trade',
        label: 'Trade on insider knowledge (+350g)',
        effects: [
          { kind: 'gold', delta: 350 },
          { kind: 'flag', id: 'insider_trader', set: 1 },
          { kind: 'narrate', text: 'You profit from the currency manipulation. Is this justice or crime?' },
        ],
      },
      {
        id: 'lose_with_masses',
        label: 'Stay ignorant like everyone else (-150g)',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'Your savings lose value with the devaluation.' },
        ],
      },
    ],
  },

  {
    id: 'ch4_tax_amnesty',
    chapter: 4,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Royal Tax Amnesty Announced',
    body: ['The crown announces a tax amnesty for the wealthy. Political favor can get you on the list. It costs gold upfront.'],
    choices: [
      {
        id: 'buy_amnesty',
        label: 'Buy your way onto amnesty list (200g)',
        requires: [{ kind: 'goldAtLeast', amount: 200 }],
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'flag', id: 'tax_amnesty', set: 1 },
          { kind: 'narrate', text: 'You bribe your way to tax freedom. A small price for larger gains.' },
        ],
      },
      {
        id: 'ignore_amnesty',
        label: 'Ignore it',
        effects: [{ kind: 'narrate', text: 'You pay taxes like everyone else.' }],
      },
    ],
  },
]

export const chapter4DangerCards: StoryCard[] = [
  {
    id: 'ch4_financial_audit',
    chapter: 4,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Royal Financial Audit',
    body: ['Crown auditors arrive at your door. "We\'re examining all major merchants. Cooperation is mandatory."'],
    choices: [
      {
        id: 'pay_off_auditors',
        label: 'Bribe the auditors (-250g)',
        requires: [{ kind: 'goldAtLeast', amount: 250 }],
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'narrate', text: 'The audit concludes favorably. Corruption has its price.' },
        ],
      },
      {
        id: 'honest_audit',
        label: 'Submit to honest audit (Savvy check, DC 15)',
        check: {
          stat: 'savvy',
          dc: 15,
          success: { text: 'Your records are impeccable. They find nothing.', effects: [{ kind: 'stat', stat: 'savvy', delta: 2 }] },
          failure: { text: 'They find discrepancies. You pay heavy fines.', effects: [{ kind: 'gold', delta: -400 }] },
        },
      },
    ],
  },

  {
    id: 'ch4_loan_foreclosure',
    chapter: 4,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Loan Foreclosure Threat',
    body: ['Your creditors come calling. "Your debt is due. Full payment now, or we seize your assets."'],
    choices: [
      {
        id: 'pay_full_debt',
        label: 'Pay full debt in gold (-500g)',
        requires: [{ kind: 'goldAtLeast', amount: 500 }],
        effects: [
          { kind: 'gold', delta: -500 },
          { kind: 'narrate', text: 'You pay and remain solvent. For now.' },
        ],
      },
      {
        id: 'negotiate_extension',
        label: 'Negotiate for time (Charm check, DC 14)',
        check: {
          stat: 'charm',
          dc: 14,
          success: { text: 'They grant an extension. You have six more months.', effects: [{ kind: 'stat', stat: 'charm', delta: 1 }] },
          failure: { text: 'They refuse. Assets seized. You lose everything.', effects: [{ kind: 'gold', delta: -600 }] },
        },
      },
    ],
  },

  {
    id: 'ch4_market_manipulation_caught',
    chapter: 4,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Caught Market Manipulating',
    body: ['Securities regulators investigate suspicious trading patterns. They suspect you of market manipulation.'],
    choices: [
      {
        id: 'confess_pay_fine',
        label: 'Confess and pay fine (-300g)',
        requires: [{ kind: 'goldAtLeast', amount: 300 }],
        effects: [
          { kind: 'gold', delta: -300 },
          { kind: 'flag', id: 'market_manipulator', set: 1 },
          { kind: 'narrate', text: 'You pay the fine and promise to reform. They believe nothing.' },
        ],
      },
      {
        id: 'deny_and_fight',
        label: 'Deny everything (Nerve check, DC 16)',
        check: {
          stat: 'nerve',
          dc: 16,
          success: { text: 'You convince them. No evidence, no conviction.', effects: [{ kind: 'stat', stat: 'nerve', delta: 2 }] },
          failure: { text: 'They press charges. You pay 400g in legal fees and fines.', effects: [{ kind: 'gold', delta: -400 }] },
        },
      },
    ],
  },
]
