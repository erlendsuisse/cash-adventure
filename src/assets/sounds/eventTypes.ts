// Sound event types and registry

export type SoundEventType =
  | 'card-enter' // Card appears with fade animation
  | 'choice-hover' // Hover over a button
  | 'choice-click' // Select a choice
  | 'stat-increase' // Stat goes up
  | 'stat-decrease' // Stat goes down
  | 'gold-gain' // Gain gold
  | 'gold-spend' // Lose gold
  | 'debt-incur' // Debt increases
  | 'freedom-achieved' // Passive income >= expenses
  | 'colossus-appear' // Colossus encounter
  | 'check-roll' // Skill check resolves
  | 'check-success' // Check passes
  | 'check-failure' // Check fails
  | 'asset-acquire' // Acquire asset
  | 'asset-sell' // Sell asset

export interface SoundAsset {
  eventType: SoundEventType
  path: string // path relative to public/sounds/
  volume?: number // 0-1, default 1.0
  delay?: number // delay before playing in ms, for timing effects
}

/**
 * Mapping of event types to sound files
 * Paths are relative to public/sounds/
 */
export const SOUND_MAP: Record<SoundEventType, SoundAsset> = {
  'card-enter': {
    eventType: 'card-enter',
    path: 'ui/card-flip.mp3',
    volume: 0.6,
    delay: 500, // Play 0.5s after card appears for effect timing
  },
  'choice-hover': {
    eventType: 'choice-hover',
    path: 'ui/choice-hover.mp3',
    volume: 0.4,
  },
  'choice-click': {
    eventType: 'choice-click',
    path: 'ui/choice-click.mp3',
    volume: 0.5,
  },
  'stat-increase': {
    eventType: 'stat-increase',
    path: 'ui/stat-gain.mp3',
    volume: 0.6,
  },
  'stat-decrease': {
    eventType: 'stat-decrease',
    path: 'ui/stat-loss.mp3',
    volume: 0.6,
  },
  'gold-gain': {
    eventType: 'gold-gain',
    path: 'events/gold-gain.mp3',
    volume: 0.7,
  },
  'gold-spend': {
    eventType: 'gold-spend',
    path: 'events/gold-spend.mp3',
    volume: 0.6,
  },
  'debt-incur': {
    eventType: 'debt-incur',
    path: 'events/debt-incur.mp3',
    volume: 0.7,
  },
  'freedom-achieved': {
    eventType: 'freedom-achieved',
    path: 'events/freedom-achieved.mp3',
    volume: 0.8,
  },
  'colossus-appear': {
    eventType: 'colossus-appear',
    path: 'events/colossus-appear.mp3',
    volume: 0.9,
  },
  'check-roll': {
    eventType: 'check-roll',
    path: 'ui/check-roll.mp3',
    volume: 0.5,
  },
  'check-success': {
    eventType: 'check-success',
    path: 'events/check-success.mp3',
    volume: 0.7,
  },
  'check-failure': {
    eventType: 'check-failure',
    path: 'events/check-failure.mp3',
    volume: 0.7,
  },
  'asset-acquire': {
    eventType: 'asset-acquire',
    path: 'events/asset-acquire.mp3',
    volume: 0.6,
  },
  'asset-sell': {
    eventType: 'asset-sell',
    path: 'events/asset-sell.mp3',
    volume: 0.6,
  },
}

/**
 * Get sound asset by event type
 */
export function getSoundAsset(eventType: SoundEventType): SoundAsset | undefined {
  return SOUND_MAP[eventType]
}

/**
 * Get all sound assets (for preloading)
 */
export function getAllSoundAssets(): SoundAsset[] {
  return Object.values(SOUND_MAP)
}
