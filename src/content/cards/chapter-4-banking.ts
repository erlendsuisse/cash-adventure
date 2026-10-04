import type { StoryCard } from '../../engine/types'
import { favour } from '../standings'
import { heat, venture } from './factories'

export const chapter4CommodityCards: StoryCard[] = [
  venture({
    id: 'ch4_banking_charter',
    weight: 5,
    title: 'Royal Banking Charter',
    body: [
      'A high-ranking banker offers exclusive access to royal banking privileges. "With our charter, you move money like the crown does. 300 gold for unlimited leverage."',
    ],
    asset: { id: 'ch4_banking_charter', label: 'Royal Banking Charter', cost: 300, monthlyCashflow: 80, sector: 'banking' },
    accept: {
      id: 'accept_banking_charter',
      label: 'Accept the charter (300g)',
      effects: [{ kind: 'narrate', text: 'You become a royal banker. Gold flows to you like it flows to the crown.' }],
    },
    decline: { id: 'refuse_charter', label: 'Decline the privilege', text: 'The banker smiles. "Someone else will take this opportunity."' },
  }),

  venture({
    id: 'ch4_government_bond_scheme',
    weight: 4,
    title: 'Government Bond Scheme',
    body: ['A financial advisor whispers of a sure thing: government bonds backed by the crown\'s treasury. "Guaranteed returns. 250 gold gets you in."'],
    asset: { id: 'ch4_gov_bonds', label: 'Government Bond Portfolio', cost: 250, monthlyCashflow: 60, sector: 'banking' },
    accept: {
      id: 'invest_bonds',
      label: 'Invest in bonds (250g)',
      effects: [{ kind: 'narrate', text: 'You invest in the crown\'s future. Hopefully it pays.' }],
    },
    decline: { id: 'avoid_bonds', label: 'Avoid the investment', text: 'Too risky. You keep your gold.' },
  }),

  venture({
    id: 'ch4_insurance_monopoly',
    weight: 4,
    title: 'Insurance Monopoly Opportunity',
    body: ['An insurance magnate offers partnership. "Control the market on merchant insurance. Everyone needs it. We split the premiums."'],
    asset: { id: 'ch4_insurance', label: 'Insurance Monopoly Share', cost: 280, monthlyCashflow: 90, sector: 'banking' },
    accept: {
      id: 'partner_insurance',
      label: 'Partner in insurance (280g)',
      effects: [{ kind: 'narrate', text: 'You profit from everyone\'s fear. Steady, reliable gold.' }],
    },
    decline: { id: 'decline_insurance', label: 'Decline', text: 'They find another partner.' },
  }),
]

export const chapter4MarketCards: StoryCard[] = [
  {
    id: 'ch4_banking_collapse',
    weight: 5,
    title: 'Banking House Collapses',
    body: ['A major banking house fails spectacularly. Credit freezes. Markets panic. Fortunes are made and lost in hours.'],
    choices: [
      {
        id: 'short_market',
        label: 'Short the falling assets (+400g)',
        effects: [
          { kind: 'gold', delta: 400 },
          { kind: 'marketShift', sector: 'iron', delta: -40 },
          { kind: 'narrate', text: 'You profit from the collapse. Ruthless, but profitable.' },
          heat('banking'),
        ],
      },
      {
        id: 'buy_dip',
        label: 'Buy the dip for recovery (+200g)',
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'marketShift', sector: 'iron', delta: 15 },
          { kind: 'narrate', text: 'You buy crashed assets hoping for recovery.' },
        ],
      },
    ],
  },

  {
    id: 'ch4_crown_devalues_currency',
    weight: 4,
    once: true,
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
          heat('banking'),
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
    weight: 3,
    once: true,
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
    weight: 4,
    once: true,
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
          heat('banking'),
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
      favour('guilds', {
        id: 'guild_vouches_books',
        label: 'Have guild accountants vouch for your books',
        effects: [{ kind: 'narrate', text: '3 guild masters sign off on your ledgers. The auditors take their word and leave by lunchtime.' }],
      }),
    ],
  },

  {
    id: 'ch4_loan_foreclosure',
    weight: 4,
    once: true,
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
          success: { text: 'They grant an extension. You have 6 more months.', effects: [{ kind: 'stat', stat: 'charm', delta: 1 }] },
          failure: { text: 'They refuse. Assets seized. You lose everything.', effects: [{ kind: 'gold', delta: -600 }] },
        },
      },
    ],
  },

  {
    id: 'ch4_market_manipulation_caught',
    weight: 3,
    once: true,
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
          success: { text: 'You convince them. No evidence, no conviction.', effects: [{ kind: 'stat', stat: 'nerve', delta: 2 }, heat('banking')] },
          failure: { text: 'They press charges. You pay 400g in legal fees and fines.', effects: [{ kind: 'gold', delta: -400 }, heat('banking')] },
        },
      },
    ],
  },
]
