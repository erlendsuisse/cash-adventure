// Music registry mapping story phases to background tracks

import type { StoryPhase, ConsequencePath } from '../../engine/types'

export interface MusicTrack {
  id: string
  fileName: string
  phase: 'early_game' | 'climbing' | 'mid_entangled' | 'boss_entangled' | 'freedom' | 'consequence'
  description: string
}

export const MUSIC_TRACKS: Record<string, MusicTrack> = {
  'optimistic-venture': {
    id: 'optimistic-venture',
    fileName: '/sounds/music/optimistic-venture.mp3',
    phase: 'early_game',
    description: 'Hopeful, curious energy for early game exploration',
  },
  'merchant-gambit': {
    id: 'merchant-gambit',
    fileName: '/sounds/music/merchant-gambit.mp3',
    phase: 'climbing',
    description: 'Energetic, adventurous merchant trading phase',
  },
  'merchant-gambit-alt': {
    id: 'merchant-gambit-alt',
    fileName: '/sounds/music/merchant-gambit-alt.mp3',
    phase: 'climbing',
    description: 'Variation of merchant trading theme',
  },
  'exploration-calm': {
    id: 'exploration-calm',
    fileName: '/sounds/music/exploration-calm.mp3',
    phase: 'climbing',
    description: 'Peaceful exploration during safe ventures',
  },
  'tension-rising': {
    id: 'tension-rising',
    fileName: '/sounds/music/tension-rising.mp3',
    phase: 'climbing',
    description: 'Building tension for risky deals and ventures',
  },
  'rising-dread': {
    id: 'rising-dread',
    fileName: '/sounds/music/rising-dread.mp3',
    phase: 'boss_entangled',
    description: 'Ominous, building tension for colossus encounters',
  },
  'danger-imminent': {
    id: 'danger-imminent',
    fileName: '/sounds/music/danger-imminent.mp3',
    phase: 'boss_entangled',
    description: 'Intense danger during colossus battles',
  },
  'dark-reckoning': {
    id: 'dark-reckoning',
    fileName: '/sounds/music/dark-reckoning.mp3',
    phase: 'consequence',
    description: 'Dark, dangerous music for consequence paths',
  },
  'victory-peace': {
    id: 'victory-peace',
    fileName: '/sounds/music/victory-peace.mp3',
    phase: 'freedom',
    description: 'Peaceful, triumphant music for freedom endings',
  },
  'victory-celebration': {
    id: 'victory-celebration',
    fileName: '/sounds/music/victory-celebration.mp3',
    phase: 'freedom',
    description: 'Celebratory music after major victories',
  },
}

/**
 * Determine which music track should play based on story state
 * Cycles through available tracks for continuous musical variety
 * Returns track ID or null if music should stop
 */
export function getTracksForPhase(
  storyPhase: StoryPhase,
  colossiDefeated: number,
  currentPath: ConsequencePath | undefined
): string[] {
  // If currently facing/just defeated a colossus
  if (colossiDefeated > 0) {
    if (currentPath) {
      return ['dark-reckoning']
    }
    return ['rising-dread']
  }

  // Early game: Rotate through early tracks
  if (storyPhase === 'early_game') {
    return ['optimistic-venture', 'exploration-calm']
  }

  // Climbing: Cycle through all 4 climbing tracks for variety
  if (storyPhase === 'climbing') {
    return [
      'merchant-gambit',
      'merchant-gambit-alt',
      'exploration-calm',
      'tension-rising',
    ]
  }

  // Entangled: Merchant themes
  if (storyPhase === 'entangled') {
    return ['merchant-gambit', 'merchant-gambit-alt', 'tension-rising']
  }

  // Reckoning: Dread tracks
  if (storyPhase === 'reckoning') {
    return ['rising-dread']
  }

  // Recovery: Victory or consequence
  if (storyPhase === 'recovery') {
    if (currentPath) {
      return ['dark-reckoning']
    } else {
      return ['victory-peace']
    }
  }

  return []
}

export function selectMusicTrack(
  storyPhase: StoryPhase,
  colossiDefeated: number,
  currentPath: ConsequencePath | undefined
): string | null {
  const tracks = getTracksForPhase(storyPhase, colossiDefeated, currentPath)
  return tracks.length > 0 ? tracks[0]! : null
}
