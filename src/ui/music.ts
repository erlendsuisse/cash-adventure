import type { ChapterNumber } from '../engine/types'

// Background music lives at src/assets/music/chapter{N}/*.mp3. Every track in a
// chapter's folder is in that chapter's playlist, so adding a song means
// dropping the file in. Globbing lets Vite hash and emit the files, so
// browsers cache them long-term.
const urls = import.meta.glob<string>('../assets/music/chapter*/*.mp3', { eager: true, query: '?url', import: 'default' })

/** Plays first when its chapter starts, if present; the rest follow in name order. */
const OPENING_TRACK = 'optimistic-venture'

export const CHAPTER_PLAYLISTS: Record<ChapterNumber, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }

for (const file of Object.keys(urls).sort()) {
  const match = /chapter(\d)\/([^/]+)\.mp3$/.exec(file)
  const chapter = Number(match?.[1]) as ChapterNumber
  if (!CHAPTER_PLAYLISTS[chapter]) continue
  if (match![2] === OPENING_TRACK) CHAPTER_PLAYLISTS[chapter].unshift(urls[file]!)
  else CHAPTER_PLAYLISTS[chapter].push(urls[file]!)
}

/** The tracks to rotate through in this chapter, falling back to Chapter 1's if its folder is empty. */
export function playlistForChapter(chapter: ChapterNumber): string[] {
  return CHAPTER_PLAYLISTS[chapter].length > 0 ? CHAPTER_PLAYLISTS[chapter] : CHAPTER_PLAYLISTS[1]
}
