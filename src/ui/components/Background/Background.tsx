import { useEffect, useRef, useState } from 'react'
import { getBackground } from '../../../assets/backgrounds/metadata'
import type { ChapterNumber } from '../../../engine/types'
import { AmbientLife } from './AmbientLife'
import styles from './Background.module.css'

type Mood = 'neutral' | 'tense' | 'triumphant' | 'fearful'

interface BackgroundProps {
  cardId: string
  /** The card's own chapter, if it belongs to a chapter deck. */
  chapter?: ChapterNumber
  /** The chapter the player is in, for the ambient particles. */
  ambientChapter?: ChapterNumber
  mood?: Mood
  /** Chapter card artwork; takes priority over the cardId background registry. */
  artworkUrl?: string | null
}

interface Layer {
  url: string
  alt: string
  camera: string
}

// A slow documentary-style camera move on every picture. Good news pulls the
// camera out, tension pushes it in, and calm cards drift in one of a few
// directions, picked from the card id so a card always moves the same way.
const CALM_MOVES = ['kbDriftLeft', 'kbDriftRight', 'kbPullOut', 'kbDriftUp']

function cameraFor(cardId: string, mood: Mood): string {
  if (mood === 'triumphant') return 'kbPullOut'
  if (mood === 'tense' || mood === 'fearful') return 'kbPushIn'
  let hash = 0
  for (let i = 0; i < cardId.length; i++) hash = (hash * 31 + cardId.charCodeAt(i)) | 0
  return CALM_MOVES[Math.abs(hash) % CALM_MOVES.length]!
}

const CROSSFADE_MS = 1200

/** The scene behind the card: the picture (crossfading between cards, always
 *  slowly moving), ambient life for the chapter, and a mood tint. */
export function Background({ cardId, chapter, ambientChapter, mood = 'neutral', artworkUrl }: BackgroundProps) {
  const [layers, setLayers] = useState<Layer[]>([])
  const chapterTheme = chapter ? `ch${chapter}` : 'default'
  const cleanup = useRef<ReturnType<typeof setTimeout> | null>(null)

  const registered = getBackground(cardId)
  const url = artworkUrl ?? registered?.url ?? null
  const alt = artworkUrl ? '' : (registered?.alt ?? '')
  const camera = cameraFor(cardId, mood)

  useEffect(() => {
    if (!url) {
      // No art for this card: fade to the chapter's gradient instead of leaving the old picture up
      setLayers([])
      return
    }
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      // Keep the previous picture underneath while the new one fades in, then drop it
      setLayers((prev) => [...prev.filter((l) => l.url !== url).slice(-1), { url, alt, camera }])
      if (cleanup.current) clearTimeout(cleanup.current)
      cleanup.current = setTimeout(() => setLayers((prev) => prev.slice(-1)), CROSSFADE_MS)
    }
    img.onerror = () => {
      if (!cancelled) setLayers([])
    }
    img.src = url
    return () => {
      cancelled = true
    }
    // camera follows the card, which url already tracks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  useEffect(
    () => () => {
      if (cleanup.current) clearTimeout(cleanup.current)
    },
    [],
  )

  return (
    <div className={`${styles.background} ${styles[`mood-${mood}`]} ${styles[`theme-${chapterTheme}`]}`}>
      {/* Chapter-themed gradient, seen when a card has no picture */}
      <div className={`${styles.fallback} ${styles[`fallback-${chapterTheme}`]}`} />

      {layers.map((layer) => (
        <div key={layer.url} className={styles.layer}>
          <img src={layer.url} alt={layer.alt} className={`${styles.image} ${styles[layer.camera]}`} />
        </div>
      ))}

      <AmbientLife chapter={ambientChapter ?? chapter ?? 1} />

      {/* Mood-based overlay/vignette */}
      <div className={`${styles.overlay} ${styles[`overlay-${mood}`]}`} />
    </div>
  )
}
