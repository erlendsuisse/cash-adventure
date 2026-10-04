import type { StoryCard } from '../../engine/types'
import { favour } from '../standings'
import { heat, venture } from './factories'

export const chapter4CommodityCards: StoryCard[] = [
  venture({
    id: 'ch4_banking_charter',
    weight: 5,
    title: 'The Royal Banking Charter',
    body: [
      'A banker in a silk waistcoat unrolls a scroll with the crown\'s seal. "A royal banking charter," he purrs. "Move money like the king himself. Only 300 gold."',
    ],
    asset: { id: 'ch4_banking_charter', label: 'Royal Banking Charter', cost: 300, monthlyCashflow: 80, sector: 'banking' },
    accept: {
      id: 'accept_banking_charter',
      label: 'Buy the charter (300g)',
      effects: [{ kind: 'narrate', text: 'The royal seal hangs on your wall now. Gold flows to you just as it flows to the crown.' }],
    },
    decline: { id: 'refuse_charter', label: 'Politely decline', text: 'He rolls up the scroll. "Someone else will snap this up."' },
  }),

  venture({
    id: 'ch4_government_bond_scheme',
    weight: 4,
    title: 'Crown Bonds',
    body: ['A clerk with tiny spectacles leans in. "Lend the crown 250 gold," he whispers, "and the crown pays you back a little every month. What could be safer?"'],
    asset: { id: 'ch4_gov_bonds', label: 'Government Bond Portfolio', cost: 250, monthlyCashflow: 60, sector: 'banking' },
    accept: {
      id: 'invest_bonds',
      label: 'Lend to the crown (250g)',
      effects: [{ kind: 'narrate', text: 'You now own a piece of the crown\'s debt. You hope the king pays his bills.' }],
    },
    decline: { id: 'avoid_bonds', label: 'Keep your gold', text: 'You keep your gold close. Even kings run out of money.' },
  }),

  venture({
    id: 'ch4_insurance_monopoly',
    weight: 4,
    title: 'Selling Peace of Mind',
    body: ['A woman with a jewelled cane taps your desk. "Ships sink. Warehouses flood. Merchants pay us a little every month, and we pay if disaster strikes. Join me."'],
    asset: { id: 'ch4_insurance', label: 'Insurance Monopoly Share', cost: 280, monthlyCashflow: 90, sector: 'banking' },
    accept: {
      id: 'partner_insurance',
      label: 'Become her partner (280g)',
      effects: [{ kind: 'narrate', text: 'Merchants sleep better, and you get paid every month. Steady, reliable gold.' }],
    },
    decline: { id: 'decline_insurance', label: 'Not today', text: 'She taps her cane and goes looking for another partner.' },
  }),
]

export const chapter4MarketCards: StoryCard[] = [
  {
    id: 'ch4_banking_collapse',
    weight: 5,
    title: 'The Great Bank Falls',
    body: ['Crowds hammer on the doors of the House of Merrow. The great bank is empty! Panic spreads street by street. Fortunes will be won and lost before sunset.'],
    choices: [
      {
        id: 'short_market',
        label: 'Bet on prices falling (+400g)',
        effects: [
          { kind: 'gold', delta: 400 },
          { kind: 'marketShift', sector: 'iron', delta: -40 },
          { kind: 'narrate', text: 'You bet against the falling bank, and win big. Ruthless, but rich.' },
          heat('banking'),
        ],
      },
      {
        id: 'buy_dip',
        label: 'Buy cheap and wait (+200g)',
        effects: [
          { kind: 'gold', delta: 200 },
          { kind: 'marketShift', sector: 'iron', delta: 15 },
          { kind: 'narrate', text: 'You buy what others are throwing away, and wait for calmer days.' },
        ],
      },
    ],
  },

  {
    id: 'ch4_crown_devalues_currency',
    weight: 4,
    once: true,
    title: 'The King\'s Thinner Coins',
    body: ['A friend at the mint whispers a secret: the king is putting less gold in each new coin. Soon every coin will be worth less. Whoever knows first can protect their savings.'],
    choices: [
      {
        id: 'insider_trade',
        label: 'Use the secret (+350g)',
        effects: [
          { kind: 'gold', delta: 350 },
          { kind: 'flag', id: 'insider_trader', set: 1 },
          { kind: 'narrate', text: 'You swap your coins for goods before anyone else knows. Clever, but was it fair?' },
          heat('banking'),
        ],
      },
      {
        id: 'lose_with_masses',
        label: 'Pretend you never heard (-150g)',
        effects: [
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'The thin coins arrive, and your savings shrink like everyone else\'s.' },
        ],
      },
    ],
  },

  {
    id: 'ch4_tax_amnesty',
    weight: 3,
    once: true,
    title: 'A List of Lucky Names',
    body: ['The crown has a list. Rich merchants on it pay no taxes this year. A palace clerk says he can add your name, for 200 gold.'],
    choices: [
      {
        id: 'buy_amnesty',
        label: 'Get on the list (200g)',
        requires: [{ kind: 'goldAtLeast', amount: 200 }],
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'flag', id: 'tax_amnesty', set: 1 },
          { kind: 'narrate', text: 'Your name goes on the list. No taxes this year. It is not quite fair, but it pays.' },
        ],
      },
      {
        id: 'ignore_amnesty',
        label: 'Pay your taxes like everyone else',
        effects: [{ kind: 'narrate', text: 'You pay your taxes like everyone else, and sleep soundly.' }],
      },
    ],
  },
]

export const chapter4DangerCards: StoryCard[] = [
  {
    id: 'ch4_financial_audit',
    weight: 4,
    once: true,
    title: 'The Auditors Arrive',
    body: ['Three grey-faced auditors arrive with an enormous abacus. "We are checking every big merchant\'s books," says the eldest. "Yours are next."'],
    choices: [
      {
        id: 'pay_off_auditors',
        label: 'Bribe the auditors (-250g)',
        requires: [{ kind: 'goldAtLeast', amount: 250 }],
        effects: [
          { kind: 'gold', delta: -250 },
          { kind: 'narrate', text: 'The auditors find nothing at all. Funny, that.' },
          heat('banking'),
        ],
      },
      {
        id: 'honest_audit',
        label: 'Let them check everything (Savvy check, DC 15)',
        check: {
          stat: 'savvy',
          dc: 15,
          success: { text: 'Your books are perfect. They click the abacus for hours and find nothing wrong.', effects: [{ kind: 'stat', stat: 'savvy', delta: 2 }] },
          failure: { text: 'They find a few sums that don\'t add up. The fines are heavy.', effects: [{ kind: 'gold', delta: -400 }] },
        },
      },
      favour('guilds', {
        id: 'guild_vouches_books',
        label: 'Have guild accountants vouch for you',
        effects: [{ kind: 'narrate', text: '3 guild masters vouch for your books. The auditors take their word and leave by lunchtime.' }],
      }),
    ],
  },

  {
    id: 'ch4_loan_foreclosure',
    weight: 4,
    once: true,
    title: 'The Lenders Come Knocking',
    body: ['Three lenders stand on your doorstep, holding your loan papers. "Your debt is due," says one. "Pay it all, now, or we take your things."'],
    choices: [
      {
        id: 'pay_full_debt',
        label: 'Pay it all (-500g)',
        requires: [{ kind: 'goldAtLeast', amount: 500 }],
        effects: [
          { kind: 'gold', delta: -500 },
          { kind: 'narrate', text: 'You count out every coin. You are free of them, for now.' },
        ],
      },
      {
        id: 'negotiate_extension',
        label: 'Ask for more time (Charm check, DC 14)',
        check: {
          stat: 'charm',
          dc: 14,
          success: { text: 'They grumble, but agree. You have 6 more months.', effects: [{ kind: 'stat', stat: 'charm', delta: 1 }] },
          failure: { text: 'They refuse. Men carry your things out of the door, one by one.', effects: [{ kind: 'gold', delta: -600 }] },
        },
      },
    ],
  },

  {
    id: 'ch4_market_manipulation_caught',
    weight: 3,
    once: true,
    title: 'Questions About Your Trades',
    body: ['Two stern inspectors from the Exchange spread your trades across a table. "These look very odd," says one. "Have you been tricking the market?"'],
    choices: [
      {
        id: 'confess_pay_fine',
        label: 'Confess and pay the fine (-300g)',
        requires: [{ kind: 'goldAtLeast', amount: 300 }],
        effects: [
          { kind: 'gold', delta: -300 },
          { kind: 'flag', id: 'market_manipulator', set: 1 },
          { kind: 'narrate', text: 'You pay and promise to behave. They do not believe a word.' },
        ],
      },
      {
        id: 'deny_and_fight',
        label: 'Deny everything (Nerve check, DC 16)',
        check: {
          stat: 'nerve',
          dc: 16,
          success: { text: 'You stay calm and explain every trade. They have no proof, and they let it go.', effects: [{ kind: 'stat', stat: 'nerve', delta: 2 }, heat('banking')] },
          failure: { text: 'They don\'t believe you. Lawyers and fines cost you 400 gold.', effects: [{ kind: 'gold', delta: -400 }, heat('banking')] },
        },
      },
    ],
  },
]
