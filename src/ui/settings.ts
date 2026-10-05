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

// v3: the narrator is off until the player turns it on (it was on by default in
// v2). Older saved settings keep sound, music and tourDone, but not voice, so
// everyone starts with the narrator off once.
const STORAGE_KEY = 'cash-adventure:settings:v3'
const OLDER_KEYS = ['cash-adventure:settings:v2', 'cash-adventure:settings:v1']
const DEFAULTS: Settings = { sound: true, music: true, voice: false, tourDone: false }

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) }
    const older = OLDER_KEYS.map((key) => localStorage.getItem(key)).find((value) => value !== null)
    if (!older) return DEFAULTS
    const { sound, music, tourDone } = JSON.parse(older) as Partial<Settings>
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
