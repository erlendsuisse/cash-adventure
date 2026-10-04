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
    theme: 'The port of Vessarin is open to anyone with a little gold and a lot of nerve.',
    hint: 'Take work to get started, then buy ventures until their monthly income covers your expenses. Stay free for 3 weeks and the first Colossus comes for you.',
    market: 'Prices hold steady around their usual level - a good time to learn the trade.',
    requiredColossiDefeated: 0,
  },
  2: {
    number: 2,
    numeral: 'II',
    name: 'Underworld Rising',
    theme: 'Your success has caught the eye of the city\'s gangs, fences and smugglers. Crime pays fast.',
    hint: 'Rebuild with cheap honest ventures, or take the underworld\'s faster money - but crime fills your Attention meter and brings the next Colossus early.',
    market: 'Smuggled spice floods in and gets cheap; untaxed salt sells dear on the black market.',
    requiredColossiDefeated: 1,
  },
  3: {
    number: 3,
    numeral: 'III',
    name: 'Warfare & Conflict',
    theme: 'War comes to the kingdom. Armies march on their stomachs, and everything they need has a price.',
    hint: 'Supply the war: wagons, linen, remounts and army contracts pay well. Living costs have risen, so aim for more passive income than before.',
    market: 'The army buys iron and salt at almost any price. Spice becomes a luxury nobody can afford.',
    requiredColossiDefeated: 2,
  },
  4: {
    number: 4,
    numeral: 'IV',
    name: 'Banking & Finance',
    theme: 'Gold becomes paper. Banks, bonds and letters of credit now rule the city.',
    hint: 'Financial ventures offer the best returns yet. Raise your Savvy to unlock the House of Letters of Credit, and beware deals that look too good.',
    market: 'Speculators chase spice up and down. Expect wild swings - buy the dips, sell the peaks.',
    requiredColossiDefeated: 3,
  },
  5: {
    number: 5,
    numeral: 'V',
    name: 'Plague & Decay',
    theme: 'A plague grips the city. Herbs, bread and medicine become worth more than silk.',
    hint: 'Essentials keep you afloat. Helping the sick earns the Common Folk\'s loyalty - and they remember who stood by them.',
    market: 'Spice is medicine and salt preserves food: both soar. Nobody is building, so iron collapses.',
    requiredColossiDefeated: 4,
  },
  6: {
    number: 6,
    numeral: 'VI',
    name: 'Betrayal',
    theme: 'Trust is the rarest currency. Friends turn, factions scheme, and every partner is a risk.',
    hint: 'Ventures built on trust - notaries, escrow, a neutral exchange - thrive. Your reputation decides who helps you when the knives come out.',
    market: 'Trade routes are cut and nobody is trusted: everything costs more, and prices lurch.',
    requiredColossiDefeated: 5,
  },
  7: {
    number: 7,
    numeral: 'VII',
    name: 'Transcendence',
    theme: 'The sky has torn open. Time, dreams and whole worlds are now for sale.',
    hint: 'Strange, lucrative ventures await. Become free one last time to face the final Colossus: the Mirror.',
    market: 'Reality itself is unstable. Prices swing wildly - fortunes are made and lost on a single market day.',
    requiredColossiDefeated: 6,
  },
}

/** The card shown when a chapter opens (queued by enterChapter). */
export function chapterTitleCardId(chapter: ChapterNumber): string {
  return `chapter${chapter}_title`
}
