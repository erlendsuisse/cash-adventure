import type { ChapterNumber } from '../engine/types'

// Display metadata only. Which chapter is active is engine logic: see
// currentChapter() in engine/selectors.ts.

export interface ChapterDefinition {
  number: ChapterNumber
  numeral: string
  name: string
  /** One line: what this chapter is about. */
  theme: string
  /** One or two lines: what to actually do here. */
  hint: string
  /** How the salt/spice/iron market behaves this chapter (see MARKET_REGIMES). */
  market: string
  requiredColossiDefeated: number
}

export const CHAPTERS: Record<ChapterNumber, ChapterDefinition> = {
  1: {
    number: 1,
    numeral: 'I',
    name: 'Merchant City',
    theme: 'Gulls, salt wind and a thousand stalls. Vessarin welcomes anyone with a little gold and a lot of nerve.',
    hint: 'Take a job to get started. Then buy ventures until they pay more each month than you spend. Stay free for 3 weeks, and the first Colossus will come for you.',
    market: 'Prices stay steady. A good time to learn how buying and selling works.',
    requiredColossiDefeated: 0,
  },
  2: {
    number: 2,
    numeral: 'II',
    name: 'Underworld Rising',
    theme: 'Your success has caught the eye of the city\'s gangs, smugglers and tricksters. Shady money comes fast.',
    hint: 'Rebuild with cheap, honest ventures, or take the underworld\'s quicker gold. But shady deals fill your Attention meter and bring the next Colossus early.',
    market: 'Smuggled spice floods in and gets cheap. Untaxed salt sells for a lot in the back alleys.',
    requiredColossiDefeated: 1,
  },
  3: {
    number: 3,
    numeral: 'III',
    name: 'Warfare & Conflict',
    theme: 'War comes to the kingdom. Armies need bread, boots and horses, and they pay for every one.',
    hint: 'Supply the army: wagons, bandages, horses and contracts all pay well. Living costs have gone up, so you need more venture income than before.',
    market: 'The army buys iron and salt at almost any price. Spice becomes a treat nobody can afford.',
    requiredColossiDefeated: 2,
  },
  4: {
    number: 4,
    numeral: 'IV',
    name: 'Banking & Finance',
    theme: 'Gold turns into paper. Banks, bonds and paper promises now rule the city.',
    hint: 'Money businesses pay better than ever. Raise your Savvy to open a House of Golden Letters, and beware deals that sound too good to be true.',
    market: 'Greedy traders chase spice up and down. Expect wild swings: buy when it drops, sell when it peaks.',
    requiredColossiDefeated: 3,
  },
  5: {
    number: 5,
    numeral: 'V',
    name: 'Plague & Decay',
    theme: 'A fever grips the city. Herbs, bread and medicine are now worth more than silk.',
    hint: 'Everyday needs keep you afloat. Helping the sick wins the Common Folk\'s loyalty, and they never forget who stood by them.',
    market: 'Spice is medicine and salt keeps food fresh, so both soar. Nobody is building, so iron crashes.',
    requiredColossiDefeated: 4,
  },
  6: {
    number: 6,
    numeral: 'VI',
    name: 'Betrayal',
    theme: 'Trust is the rarest treasure now. Friends turn, families scheme, and every partner is a risk.',
    hint: 'Ventures built on trust do well: sealed books, honest warehouses, a fair exchange. Your reputation decides who helps you when trouble comes.',
    market: 'Trade roads are cut and nobody trusts anybody. Everything costs more, and prices lurch.',
    requiredColossiDefeated: 5,
  },
  7: {
    number: 7,
    numeral: 'VII',
    name: 'Transcendence',
    theme: 'The sky has split open. Time, dreams and whole worlds are now for sale.',
    hint: 'Strange and wonderful ventures await. Become free one last time to face the final Colossus: the Mirror.',
    market: 'Even reality is wobbly now. Prices swing wildly, and fortunes are won and lost on a single market day.',
    requiredColossiDefeated: 6,
  },
}

/** The card shown when a chapter opens (queued by enterChapter). */
export function chapterTitleCardId(chapter: ChapterNumber): string {
  return `chapter${chapter}_title`
}
