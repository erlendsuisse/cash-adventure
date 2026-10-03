import type { StoryCard } from '../engine/types'

// Card artwork lives at src/assets/artwork/chapter{N}/{cardId}.webp
// (scripts/optimize-artwork.mjs puts it there). Globbing it lets Vite hash and
// emit only the files that exist, so cards without art never request a 404.
const urls = import.meta.glob<string>('../assets/artwork/chapter*/*.webp', { eager: true, query: '?url', import: 'default' })

const artworkByCardId = new Map(
  Object.entries(urls).map(([file, url]) => [file.slice(file.lastIndexOf('/') + 1, -'.webp'.length), url]),
)

/** The card's artwork URL, or null if no artwork has been generated for it. */
export function getCardArtworkPath(card: StoryCard): string | null {
  return artworkByCardId.get(card.id) ?? null
}
