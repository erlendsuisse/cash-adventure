import type { ChapterNumber, StoryCard } from '../../engine/types'
import { CHAPTERS, chapterTitleCardId } from '../chapters'

// A title card for each chapter after the first (Chapter I opens with the
// prologue). enterChapter() queues it as the Colossus outcome plays, so every
// chapter begins by saying what it's about and what to do.
export const chapterTitleCards: StoryCard[] = ([2, 3, 4, 5, 6, 7] as ChapterNumber[]).map((n) => {
  const chapter = CHAPTERS[n]
  return {
    id: chapterTitleCardId(n),
    title: `Chapter ${chapter.numeral}: ${chapter.name}`,
    body: [chapter.theme, chapter.hint],
    choices: [{ id: 'begin_chapter', label: `Begin Chapter ${chapter.numeral}` }],
  }
})
