import { getSoundAsset, type SoundEventType } from '../../assets/sounds/eventTypes'

/**
 * Simple HTML5 audio system for game events
 * No Web Audio API complexity - just plays sounds on demand
 */

class AudioSystem {
  private audioElements: Map<string, HTMLAudioElement> = new Map()
  private masterVolume: number = 0.8
  private muted: boolean = false

  constructor() {
    // Initialize audio elements for common sounds
    this.initializeAudio()
  }

  /**
   * Pre-create audio elements for instant playback
   */
  private initializeAudio() {
    const soundIds: SoundEventType[] = [
      'gold-gain',
      'gold-spend',
      'stat-increase',
      'card-enter',
      'check-success',
      'check-failure',
    ]

    for (const soundId of soundIds) {
      const sound = getSoundAsset(soundId)
      if (sound) {
        const audio = new Audio(`/public/${sound.path}`)
        audio.volume = (sound.volume ?? 1.0) * this.masterVolume
        this.audioElements.set(soundId, audio)
      }
    }
  }

  /**
   * Play a sound by ID with optional volume override
   */
  play(soundId: string, volumeModifier: number = 1): void {
    if (this.muted) return

    let audio = this.audioElements.get(soundId)

    if (!audio) {
      const sound = getSoundAsset(soundId as SoundEventType)
      if (!sound) {
        console.warn(`Sound not found: ${soundId}`)
        return
      }
      audio = new Audio(`/public/${sound.path}`)
      this.audioElements.set(soundId, audio)
    }

    const sound = getSoundAsset(soundId as SoundEventType)
    if (sound) {
      audio.volume = (sound.volume ?? 1.0) * volumeModifier * this.masterVolume
    }

    // Clone and play to allow overlapping sounds
    const clone = audio.cloneNode() as HTMLAudioElement
    clone.play().catch(() => {
      // Audio might not be allowed to play, ignore
    })
  }

  /**
   * Stop all sounds
   */
  stopAll(): void {
    for (const audio of this.audioElements.values()) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  /**
   * Set master volume (0-1)
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    for (const audio of this.audioElements.values()) {
      audio.volume = (audio.volume / (this.masterVolume || 0.8)) * this.masterVolume
    }
  }

  /**
   * Mute/unmute all sounds
   */
  setMuted(muted: boolean): void {
    this.muted = muted
  }

  /**
   * Get current mute state
   */
  isMuted(): boolean {
    return this.muted
  }
}

// Singleton instance
export const audioSystem = new AudioSystem()

/**
 * Hook-like helper to play sounds from components
 * Usage: playSound('gold-gained')
 */
export function playSound(soundId: string, volumeModifier?: number) {
  audioSystem.play(soundId, volumeModifier)
}
