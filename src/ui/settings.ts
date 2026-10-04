import { useSyncExternalStore } from 'react'

// Player preferences for this browser only (sound, music, narration, whether
// the guide's tour has been seen). Stored in localStorage when it's available;
// the game works the same without it.
export interface Settings {
  sound: boolean
  music: boolean
  voice: boolean
  tourDone: boolean
}

// v2: the narrator became on-by-default. v1 saved voice: false for everyone
// who'd seen the tour, so only sound, music and tourDone carry over from it.
const STORAGE_KEY = 'cash-adventure:settings:v2'
const V1_KEY = 'cash-adventure:settings:v1'
const DEFAULTS: Settings = { sound: true, music: true, voice: true, tourDone: false }

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) }
    const v1 = localStorage.getItem(V1_KEY)
    if (!v1) return DEFAULTS
    const { sound, music, tourDone } = JSON.parse(v1) as Partial<Settings>
    return { ...DEFAULTS, ...(sound !== undefined && { sound }), ...(music !== undefined && { music }), ...(tourDone !== undefined && { tourDone }) }
  } catch {
    return DEFAULTS
  }
}

let current = load()
const listeners = new Set<() => void>()

export function getSettings(): Settings {
  return current
}

export function updateSettings(patch: Partial<Settings>) {
  current = { ...current, ...patch }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // Private mode or blocked storage: keep the setting for this visit only
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, getSettings, getSettings)
}

/** True when the player's device asks for less motion; animations should be skipped. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}
