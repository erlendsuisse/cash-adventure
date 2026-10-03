import { useEffect, useRef, useState } from 'react'
import type { GameState } from '../../engine/types'
import { selectMusicTrack, MUSIC_TRACKS, getTracksForPhase } from '../../assets/sounds/musicMetadata'

interface AudioState {
  current: string | null
  fadingOut: string | null
  trackIndex: number // Track position in current phase's playlist
}

export function useBackgroundMusic(state: GameState, enabled: boolean = true) {
  const [userInteracted, setUserInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const stateRef = useRef<AudioState>({ current: null, fadingOut: null, trackIndex: 0 })
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!enabled || !userInteracted) return

    // Get first track when story phase changes
    const tracks = getTracksForPhase(
      state.progress.storyPhase,
      state.progress.colossiDefeated,
      state.progress.currentPath
    )

    if (tracks.length === 0) return

    // Reset to first track when phase changes
    stateRef.current.trackIndex = 0
    const currentTrack = tracks[0]

    console.log('[Music] Phase changed to:', state.progress.storyPhase, 'Playing:', currentTrack)

    // Stop any existing fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    // If switching to a different track, fade out current and fade in new
    if (stateRef.current.current && currentTrack !== stateRef.current.current) {
      fadeOutThenPlayNew(currentTrack)
    } else if (!stateRef.current.current && currentTrack) {
      // Starting music for the first time
      playTrack(currentTrack)
    }
  }, [state.progress.storyPhase, state.progress.colossiDefeated, state.progress.currentPath, enabled, userInteracted])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  function playTrack(trackId: string) {
    const track = MUSIC_TRACKS[trackId]
    if (!track || !audioRef.current) {
      console.log('[Music] Track not found or audio element missing:', trackId)
      return
    }

    console.log('[Music] Playing track:', trackId, 'from', track.fileName)
    audioRef.current.src = track.fileName
    audioRef.current.volume = 0.5 // Start at 50% volume for ambient
    audioRef.current.loop = false

    // When track ends, play next in rotation
    audioRef.current.onended = () => {
      console.log('[Music] Track ended, playing next in rotation')
      const tracks = getTracksForPhase(
        state.progress.storyPhase,
        state.progress.colossiDefeated,
        state.progress.currentPath
      )
      if (tracks.length > 0) {
        stateRef.current.trackIndex = (stateRef.current.trackIndex + 1) % tracks.length
        const nextTrack = tracks[stateRef.current.trackIndex]
        playTrack(nextTrack)
      }
    }

    audioRef.current.play().then(() => {
      console.log('[Music] Playback started successfully')
    }).catch((e) => {
      console.warn('[Music] Playback failed:', e)
    })

    stateRef.current.current = trackId
    stateRef.current.fadingOut = null
  }

  function fadeOutThenPlayNew(nextTrackId: string) {
    if (!audioRef.current || !stateRef.current.current) return

    stateRef.current.fadingOut = stateRef.current.current
    const startVolume = audioRef.current.volume
    const fadeDuration = 800 // 800ms fade out
    const steps = 40 // 40 steps = 20ms per step
    let step = 0

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return

      step++
      const progress = step / steps
      audioRef.current.volume = startVolume * (1 - progress)

      if (step >= steps) {
        clearInterval(fadeIntervalRef.current!)
        fadeIntervalRef.current = null

        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }

        playTrack(nextTrackId)

        // Fade in new track
        if (audioRef.current) {
          audioRef.current.volume = 0
          fadeInTrack()
        }
      }
    }, fadeDuration / steps)
  }

  function fadeInTrack() {
    if (!audioRef.current || !stateRef.current.current) return

    const fadeDuration = 1200 // 1.2s fade in
    const steps = 40
    let step = 0

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return

      step++
      const progress = step / steps
      audioRef.current.volume = 0.5 * progress // Fade to 50%

      if (step >= steps) {
        clearInterval(fadeIntervalRef.current!)
        fadeIntervalRef.current = null
        if (audioRef.current) {
          audioRef.current.volume = 0.5
        }
      }
    }, fadeDuration / steps)
  }

  // Create/get audio element (hidden) and set up user interaction listener
  useEffect(() => {
    if (!audioRef.current) {
      const audio = document.createElement('audio')
      audio.id = 'background-music'
      audio.style.display = 'none'
      document.body.appendChild(audio)
      audioRef.current = audio
    }

    // Listen for first user interaction to enable audio playback
    const handleInteraction = () => {
      if (!userInteracted) {
        console.log('[Music] User interaction detected, audio enabled')
        setUserInteracted(true)
      }
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('keydown', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  return {
    currentTrack: stateRef.current.current,
    play: playTrack,
    stop: () => {
      if (audioRef.current) {
        audioRef.current.pause()
        stateRef.current.current = null
      }
    },
  }
}
