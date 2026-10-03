/**
 * Central asset registry for Cash Adventure visuals
 * Re-exports all asset metadata and provides unified preloading/access APIs
 */

export * from './backgrounds/metadata'
export * from './characters/equipmentMetadata'
export * from './sounds/eventTypes'

/**
 * Asset preloading utilities
 * These will be used by React hooks to prefetch resources
 */

export interface PreloadConfig {
  backgrounds?: boolean
  sounds?: boolean
  equipment?: boolean
}

/**
 * Preload all assets of specified types
 * Returns a promise that resolves when preloading is complete
 */
export async function preloadAssets(config: PreloadConfig = { backgrounds: true, sounds: true }): Promise<void> {
  const promises: Promise<void>[] = []

  if (config.backgrounds) {
    // Preload all background images
    // This will be used by React hooks in the UI layer
  }

  if (config.sounds) {
    // Preload all sound files
    // This will be used by the audio manager hook
  }

  await Promise.all(promises)
}

/**
 * Check if all required assets exist (for validation)
 */
export function validateAssets(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Add validation logic here
  // This can be run during game startup to catch missing asset registrations

  return {
    isValid: errors.length === 0,
    errors,
  }
}
