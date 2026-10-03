import { useEffect, useState } from 'react'
import { getBackground } from '../../../assets/backgrounds/metadata'
import type { ChapterNumber } from '../../../engine/types'
import styles from './Background.module.css'

interface BackgroundProps {
  cardId: string
  /** The card's own chapter, if it belongs to a chapter deck. */
  chapter?: ChapterNumber
  mood?: 'neutral' | 'tense' | 'triumphant' | 'fearful'
}

/**
 * Background image layer for cards with fade-in animation
 * Loads image and fades in, allowing card to appear after 0.5s
 */
export function Background({ cardId, chapter, mood = 'neutral' }: BackgroundProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const chapterTheme = chapter ? `ch${chapter}` : 'default'

  const backgroundAsset = getBackground(cardId)

  useEffect(() => {
    if (!backgroundAsset) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const img = new Image()

    img.onload = () => {
      // Trigger card reveal animation after image loads
      // The card will appear 0.5s after the image starts fading in
      setImageUrl(backgroundAsset.url)
      setIsLoading(false)
    }

    img.onerror = () => {
      console.warn(`Failed to load background: ${backgroundAsset.url}`)
      // Still show the card even if background fails to load
      setImageUrl(null)
      setIsLoading(false)
    }

    img.src = backgroundAsset.url
  }, [backgroundAsset])

  return (
    <div className={`${styles.background} ${styles[`mood-${mood}`]} ${styles[`theme-${chapterTheme}`]}`}>
      {/* Fallback gradient when no image loaded - themed by chapter */}
      <div className={`${styles.fallback} ${styles[`fallback-${chapterTheme}`]}`} />

      {/* Background image with fade-in animation (0.8s) */}
      {/* Card appears 0.5s after image starts fading in */}
      {imageUrl && <img src={imageUrl} alt={backgroundAsset?.alt} className={styles.image} />}

      {/* Mood-based overlay/vignette for visual enhancement */}
      <div className={`${styles.overlay} ${styles[`overlay-${mood}`]}`} />

      {/* Loading indicator while background loads */}
      {isLoading && <div className={styles.loading_spinner} />}
    </div>
  )
}
