import type { ChapterNumber, Requirement, StatId, StoryCard } from '../../engine/types'
import { initial, LIVING_COST_RISE } from '../tuning'

// A WAY BACK UP
// When you're in the red (see inTrouble) - work finds you. These cards only appear in trouble, appear often,
// and pay in proportion to the chapter's cost of living, so a broke player can
// always earn their way back to buying ventures:
//   - odd jobs: quick cash for a few days' labour, as often as you need
//   - a steady position: a lasting wage rise, once per chapter
//   - a contract: a skill check that pays big, and still pays something on failure

/** In the red: gold below zero, or losing money every month with less than a
 *  month's living costs in hand. (A negative balance alone is normal while
 *  building up - it's only trouble once the savings can't cover it.) */
export function inTrouble(chapter: ChapterNumber): Requirement {
  return {
    kind: 'anyOf',
    of: [
      { kind: 'not', of: { kind: 'goldAtLeast', amount: 0 } },
      {
        kind: 'allOf',
        of: [
          { kind: 'not', of: { kind: 'netIncomeAtLeast', amount: 0 } },
          { kind: 'not', of: { kind: 'goldAtLeast', amount: chapterLivingCost(chapter) } },
        ],
      },
    ],
  }
}

/** Draw weight before the chapter-deck multiplier: high, so help comes quickly. */
const WORK_WEIGHT = 25

/** Typical monthly expenses in a chapter: the base plus every living-cost rise so far. */
export function chapterLivingCost(chapter: ChapterNumber): number {
  let cost = initial.finances.monthlyExpenses
  for (let n = 2; n <= chapter; n++) cost += LIVING_COST_RISE[n as Exclude<ChapterNumber, 1>]
  return Math.max(40, cost)
}

interface WorkFlavour {
  odd: { title: string; body: string; label: string }
  steady: { title: string; body: string; label: string }
  contract: { title: string; body: string; label: string; stat: StatId; success: string; failure: string }
}

const FLAVOUR: Record<ChapterNumber, WorkFlavour> = {
  1: {
    odd: { title: 'Hands Wanted at the Harbour', body: 'A ship has come in early and the harbourmaster is short of hands. Hauling crates is hard on the back, but the pay is in coin, today.', label: 'Haul crates for a few days' },
    steady: { title: 'A Clerk\'s Stool at the Counting-House', body: 'The counting-house needs someone who can add a column without dozing off. It is not glamorous, but it is steady.', label: 'Take the clerk\'s position' },
    contract: { title: 'Appraise a Cargo', body: 'A merchant suspects his supplier is cheating him and will pay well for an honest appraisal of the whole shipment.', label: 'Appraise the cargo', stat: 'savvy', success: 'You find the short weights and the merchant pays handsomely.', failure: 'You miss half the tricks, but the merchant pays you something for the effort.' },
  },
  2: {
    odd: { title: 'Errands for the Night Market', body: 'The night market always needs runners: lanterns to light, messages to carry, stalls to mind. Nobody asks questions.', label: 'Run errands for a few nights' },
    steady: { title: 'Night Watchman for the Warehouses', body: 'The warehouse owners have had enough of thieves. They want someone sharp-eyed on the docks every night, paid monthly.', label: 'Take the watchman\'s post' },
    contract: { title: 'A Thief\'s Hidden Stash', body: 'A widow\'s jewels were stolen and hidden somewhere in the old quarter. Find them before the thief comes back, and the reward is yours.', label: 'Hunt for the stash', stat: 'nerve', success: 'You find the jewels behind a loose brick and collect the full reward.', failure: 'The thief beat you to most of it, but you recover a few pieces for a smaller reward.' },
  },
  3: {
    odd: { title: 'Loading the Supply Wagons', body: 'The army\'s supply train leaves at dawn and the quartermaster pays by the wagon. There is always another wagon.', label: 'Load wagons for a few days' },
    steady: { title: 'Assistant to the Quartermaster', body: 'The quartermaster is drowning in ledgers. He needs an assistant who knows goods and prices - a merchant, ideally.', label: 'Join the quartermaster\'s staff' },
    contract: { title: 'An Urgent Dispatch', body: 'A sealed dispatch must reach the northern camp by tomorrow, across hard country. The courier who does it will be well paid.', label: 'Ride with the dispatch', stat: 'grit', success: 'You ride through the night and deliver it on time. The officers pay double.', failure: 'You arrive late and saddle-sore, but they pay you for the ride.' },
  },
  4: {
    odd: { title: 'Counting Coin at the Exchange', body: 'Quarter-day at the exchange, and the banks need extra hands to count, weigh and bag the coin.', label: 'Count coin for a few days' },
    steady: { title: 'A Junior Clerk\'s Desk', body: 'A respectable bank needs a junior clerk who understands trade. The salary is modest, but it arrives every month.', label: 'Take the clerk\'s desk' },
    contract: { title: 'A Bankrupt\'s Accounts', body: 'A merchant house has collapsed and its creditors need someone to untangle the accounts. They pay a share of whatever you recover.', label: 'Untangle the accounts', stat: 'savvy', success: 'You find hidden assets everywhere. Your share is generous.', failure: 'The books are a maze, but you recover enough to earn a fee.' },
  },
  5: {
    odd: { title: 'Water for the Wards', body: 'The plague wards need water carried, linen boiled and floors scrubbed. It is grim work, and the council pays in coin.', label: 'Work the wards for a few days' },
    steady: { title: 'Steward of a Relief Kitchen', body: 'The council is opening relief kitchens and needs stewards who can keep the stores honest and the queues moving.', label: 'Become a kitchen steward' },
    contract: { title: 'Medicine Through the Quarantine', body: 'A physician needs a crate of medicine carried through three quarantine checkpoints before nightfall.', label: 'Carry the medicine through', stat: 'grit', success: 'You make every checkpoint. The physician pays in full and then some.', failure: 'You are turned back at the last gate, but the physician pays for the attempt.' },
  },
  6: {
    odd: { title: 'Sealed Letters', body: 'In a city where nobody trusts a messenger, someone with a known face is worth hiring to carry sealed letters by hand.', label: 'Carry letters for a few days' },
    steady: { title: 'Steward to a Noble House', body: 'An old noble family has dismissed its steward for theft. They want someone new to run the household accounts - someone with nothing to gain from betraying them.', label: 'Become the household steward' },
    contract: { title: 'Mediate a Feud', body: 'Two partners who no longer trust each other will each pay a fee to a mediator who can split their business fairly.', label: 'Mediate between them', stat: 'charm', success: 'Both sides leave satisfied and both pay your fee.', failure: 'They part on bad terms, but one of them still pays.' },
  },
  7: {
    odd: { title: 'Cataloguing Strange Artifacts', body: 'The rift keeps spitting out objects nobody understands. The museum pays by the item to have them weighed, drawn and labelled.', label: 'Catalogue artifacts for a few days' },
    steady: { title: 'Clerk at the Rift Customs House', body: 'Goods from other worlds still owe duty. The new customs house needs clerks who won\'t faint at a talking crate.', label: 'Take the customs post' },
    contract: { title: 'Haggle with the Otherworldly', body: 'A merchant from beyond the rift wants to buy a whole warehouse of ordinary teapots. Somebody has to negotiate the price.', label: 'Negotiate the sale', stat: 'nerve', success: 'You hold your nerve and close the deal at a staggering price. Your commission is huge.', failure: 'You blink first, but even a poor deal pays a commission.' },
  },
}

export function workOpportunities(chapter: ChapterNumber): StoryCard[] {
  const cost = chapterLivingCost(chapter)
  const odd = Math.round(cost * 1.2)
  const wage = Math.round(cost * 0.35)
  const big = Math.round(cost * 2.5)
  const small = Math.round(cost * 0.6)
  const steadyFlag = `steady_work_ch${chapter}`
  const f = FLAVOUR[chapter]
  return [
    {
      id: `ch${chapter}_work_odd_jobs`,
      weight: WORK_WEIGHT,
      requires: [inTrouble(chapter)],
      title: f.odd.title,
      body: [f.odd.body],
      choices: [
        { id: 'take_odd_jobs', label: `${f.odd.label} (+${odd}g, a few days)`, effects: [{ kind: 'gold', delta: odd }, { kind: 'advanceDays', days: 4 }, { kind: 'narrate', text: 'Honest sweat, honest coin.' }] },
        { id: 'pass_odd_jobs', label: 'Not now', effects: [{ kind: 'narrate', text: 'You let the work go to someone else.' }] },
      ],
    },
    {
      id: `ch${chapter}_work_steady`,
      weight: WORK_WEIGHT,
      requires: [inTrouble(chapter), { kind: 'not', of: { kind: 'flag', id: steadyFlag, atLeast: 1 } }],
      title: f.steady.title,
      body: [f.steady.body],
      choices: [
        {
          id: 'take_steady_work',
          label: `${f.steady.label} (+${wage}g wages)`,
          effects: [{ kind: 'wages', delta: wage }, { kind: 'flag', id: steadyFlag, set: 1 }, { kind: 'narrate', text: 'A wage every month. Not freedom, but solid ground to build on.' }],
        },
        { id: 'pass_steady_work', label: 'Decline', effects: [{ kind: 'narrate', text: 'The position goes to someone else.' }] },
      ],
    },
    {
      id: `ch${chapter}_work_contract`,
      weight: WORK_WEIGHT,
      requires: [inTrouble(chapter)],
      title: f.contract.title,
      body: [f.contract.body],
      choices: [
        {
          id: 'take_contract',
          label: `${f.contract.label} (${f.contract.stat[0]!.toUpperCase()}${f.contract.stat.slice(1)} check, DC 12: +${big}g, or +${small}g if it goes badly)`,
          check: {
            stat: f.contract.stat,
            dc: 12,
            success: { text: f.contract.success, effects: [{ kind: 'gold', delta: big }] },
            failure: { text: f.contract.failure, effects: [{ kind: 'gold', delta: small }] },
          },
        },
        { id: 'pass_contract', label: 'Turn it down', effects: [{ kind: 'narrate', text: 'Someone else takes the contract.' }] },
      ],
    },
  ]
}
