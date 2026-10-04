import { useEffect, useRef, useState } from 'react'
import type { GameState } from '../../engine/types'
import { currentChapter } from '../../engine/selectors'
import { playlistForChapter } from '../music'
import { useSpeaking } from '../voice'

const VOLUME = 0.5
const DUCKED_VOLUME = 0.15 // while the narrator reads a card
const FADE_STEP_MS = 50
const CHAPTER_FADE_OUT_MS = 2000
const CHAPTER_FADE_IN_MS = 3000
const NEXT_TRACK_FADE_IN_MS = 1500

/**
 * Background music by chapter (see ui/music.ts). A chapter's tracks play one
 * after another and loop; the music only changes when a new chapter starts,
 * with a slow fade out and in. Browsers block audio until the player clicks or
 * presses a key, so playback starts on the first interaction.
 */
export function useBackgroundMusic(state: GameState, enabled: boolean = true) {
  const chapter = currentChapter(state)
  const [unlocked, setUnlocked] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playlistRef = useRef<string[]>([])
  const indexRef = useRef(0)
  const failuresRef = useRef(0)
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const speaking = useSpeaking()
  const volumeRef = useRef(VOLUME)
  volumeRef.current = speaking ? DUCKED_VOLUME : VOLUME

  // These only touch refs, so the copies captured by audio callbacks never go stale.
  function stopFade() {
    if (fadeRef.current) clearInterval(fadeRef.current)
    fadeRef.current = null
  }

  function fadeTo(target: number, durationMs: number, done?: () => void) {
    const audio = audioRef.current
    if (!audio) return
    stopFade()
    const from = audio.volume
    const started = Date.now()
    fadeRef.current = setInterval(() => {
      const progress = Math.min(1, (Date.now() - started) / durationMs)
      audio.volume = Math.min(1, Math.max(0, from + (target - from) * progress))
      if (progress >= 1) {
        stopFade()
        done?.()
      }
    }, FADE_STEP_MS)
  }

  function startTrack(fadeInMs: number) {
    const audio = audioRef.current
    const track = playlistRef.current[indexRef.current]
    if (!audio || !track) return
    stopFade()
    audio.src = track
    audio.volume = 0
    audio.play().then(
      () => fadeTo(volumeRef.current, fadeInMs),
      (error: unknown) => {
        // Autoplay refused: forget the playlist so the next interaction starts it again
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          playlistRef.current = []
          setUnlocked(false)
        }
      },
    )
  }

  function playNextTrack() {
    if (playlistRef.current.length === 0) return
    indexRef.current = (indexRef.current + 1) % playlistRef.current.length
    startTrack(NEXT_TRACK_FADE_IN_MS)
  }

  // One audio element for as long as the play screen is open
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.onplaying = () => {
      failuresRef.current = 0
    }
    audio.onended = playNextTrack
    audio.onerror = () => {
      // Skip a track that won't load, but give up once every track has failed
      failuresRef.current++
      if (failuresRef.current < playlistRef.current.length) playNextTrack()
      else console.warn('[Music] No track in this chapter could be played')
    }
    audioRef.current = audio
    return () => {
      stopFade()
      audio.onended = audio.onerror = audio.onplaying = null
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
      playlistRef.current = []
    }
  }, [])

  useEffect(() => {
    if (unlocked) return
    const unlock = () => setUnlocked(true)
    document.addEventListener('click', unlock)
    document.addEventListener('keydown', unlock)
    return () => {
      document.removeEventListener('click', unlock)
      document.removeEventListener('keydown', unlock)
    }
  }, [unlocked])

  // Duck under the narrator, and come back up when it stops
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || audio.paused || playlistRef.current.length === 0) return
    fadeTo(volumeRef.current, 500)
  }, [speaking])

  // Switch playlists only when the chapter changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !unlocked) return

    if (!enabled) {
      playlistRef.current = []
      fadeTo(0, CHAPTER_FADE_OUT_MS, () => audio.pause())
      return
    }

    const playlist = playlistForChapter(chapter)
    if (playlist === playlistRef.current) return
    const wasPlaying = playlistRef.current.length > 0 && !audio.paused
    playlistRef.current = playlist
    indexRef.current = 0
    failuresRef.current = 0

    if (wasPlaying) fadeTo(0, CHAPTER_FADE_OUT_MS, () => startTrack(CHAPTER_FADE_IN_MS))
    else startTrack(CHAPTER_FADE_IN_MS)
  }, [chapter, enabled, unlocked])
}
