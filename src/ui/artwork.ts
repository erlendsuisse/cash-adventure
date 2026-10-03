import type { StoryCard } from '../engine/types'

/**
 * Get the artwork path for a card based on its ID
 * Artwork is organized by chapter: /assets/artwork/chapter{N}/{cardId}.png
 */
export function getCardArtworkPath(card: StoryCard): string | null {
  // Only cards with chapter numbers have artwork
  if (!card.chapter) return null

  return `/assets/artwork/chapter${card.chapter}/${card.id}.png`
}

/**
 * Check if artwork exists for a card (attempts to load it)
 */
export async function hasCardArtwork(card: StoryCard): Promise<boolean> {
  const path = getCardArtworkPath(card)
  if (!path) return false

  try {
    const response = await fetch(path, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}
