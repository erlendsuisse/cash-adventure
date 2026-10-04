import type { ChapterNumber, ConsequencePath, Effect, OwnedAsset, Requirement, StoryCard } from '../../engine/types'
import { chapterTitleCardId } from '../chapters'
import { CHAPTER_DRAW_WEIGHT, consequenceTuning, LIVING_COST_RISE, STATION_WAGE_SHARE } from '../tuning'

// Authoring helpers for the card shapes that repeat across chapter decks.
// They only build plain StoryCard data - nothing here survives past module load.

/** Draws attention from one of the consequence paths. Enough heat on a path
 *  (consequenceTuning threshold) pulls the next Colossus forward early. */
export function heat(path: ConsequencePath): Effect {
  return { kind: 'flag', id: consequenceTuning[path].flagId, delta: 1 }
}

/** Stamps `chapter` onto every card so chapter decks never hand-write it
 *  (and can't drift from the deck they're registered in), and scales draw
 *  weights by CHAPTER_DRAW_WEIGHT so the chapter's own cards dominate its draws.
 *  Author weights relative to each other within the deck. */
export function defineChapterDeck(chapter: ChapterNumber, cards: StoryCard[]): StoryCard[] {
  return cards.map((card) => ({ ...card, chapter, ...(card.weight !== undefined ? { weight: card.weight * CHAPTER_DRAW_WEIGHT } : {}) }))
}

/** For a Colossus outcome, as the next chapter opens:
 *  - your station rises: it costs more to keep and pays somewhat better, so
 *    freedom needs more passive income but the rebuild stays affordable;
 *  - the Colossus has judged you, so heat on every consequence path clears;
 *  - the new chapter's title card plays, saying what the chapter is about. */
export function enterChapter(chapter: Exclude<ChapterNumber, 1>): Effect[] {
  const expense = LIVING_COST_RISE[chapter]
  const wages = Math.round(expense * STATION_WAGE_SHARE)
  return [
    { kind: 'expense', delta: expense },
    { kind: 'wages', delta: wages },
    ...Object.values(consequenceTuning).map(({ flagId }): Effect => ({ kind: 'flag', id: flagId, set: 0 })),
    // Show the chapter's title card next (before the Colossus aftermath card queued after this).
    { kind: 'queueCard', card: chapterTitleCardId(chapter) },
    { kind: 'narrate', text: `Your station has risen: it costs +${expense}g/month more to keep, and pays +${wages}g/month more in wages.` },
  ]
}

export interface VentureSpec extends Omit<StoryCard, 'choices' | 'chapter'> {
  asset: OwnedAsset
  /** Buying in: costs `asset.cost` gold and requires holding that much, plus any
   *  extra `requires` (e.g. a stat gate). With `showLockedAs` the choice stays
   *  visible but disabled until it's met - a goal to work toward. */
  accept: { id: string; label: string; requires?: Requirement[]; showLockedAs?: string; effects?: Effect[] }
  decline: { id: string; label: string; text: string }
}

/** The classic "pay X gold, gain an asset paying Y a month, or walk away" card. */
export function venture({ asset, accept, decline, ...card }: VentureSpec): StoryCard {
  return {
    ...card,
    choices: [
      {
        id: accept.id,
        label: accept.label,
        requires: [{ kind: 'goldAtLeast', amount: asset.cost }, ...(accept.requires ?? [])],
        ...(accept.showLockedAs ? { showLockedAs: accept.showLockedAs } : {}),
        effects: [{ kind: 'gold', delta: -asset.cost }, { kind: 'acquireAsset', asset }, ...(accept.effects ?? [])],
      },
      { id: decline.id, label: decline.label, effects: [{ kind: 'narrate', text: decline.text }] },
    ],
  }
}
