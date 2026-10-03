/**
 * Character state selectors
 * These functions derive visual character state from GameState
 * This layer keeps game logic separate from visual rendering
 */

import { getFinancialStatus } from '../assets/characters/equipmentMetadata'
import type { EquipmentSlot, GameState } from './types'

export type CharacterMood = 'neutral' | 'tense' | 'triumphant' | 'fearful'
export type FinancialStatus = 'poor' | 'moderate' | 'wealthy'

/**
 * Determine character mood based on game state
 */
export function getCharacterMood(state: GameState): CharacterMood {
  const { finances, progress } = state

  // Triumphant after defeating a colossus
  if (progress.colossiDefeated > 0) return 'triumphant'

  // Fearful with high debt
  if (finances.debt > finances.gold * 0.5) return 'fearful'

  // Tense if in debt at all
  if (finances.debt > 0) return 'tense'

  // Neutral otherwise
  return 'neutral'
}

/**
 * Determine financial status based on net worth
 */
export function getCharacterFinancialStatus(state: GameState): FinancialStatus {
  return getFinancialStatus(state.finances.gold, state.finances.monthlyExpenses, state.finances.debt)
}

/**
 * Get recommended equipment for financial status
 * (Can be overridden by explicit equipment slots in character state)
 */
export function getRecommendedEquipment(financialStatus: FinancialStatus): Record<EquipmentSlot, string> {
  const presets = {
    poor: { headgear: 'bare-head', clothing: 'rags', accessories: 'none' },
    moderate: { headgear: 'simple-hat', clothing: 'simple-clothes', accessories: 'none' },
    wealthy: { headgear: 'fine-hat', clothing: 'fine-clothes', accessories: 'gold-ring' },
  }
  return presets[financialStatus]
}

/**
 * Get the current character appearance
 * Combines explicit equipment slots with financial status defaults
 */
export function getCharacterAppearance(state: GameState): Record<EquipmentSlot, string | null> {
  const financialStatus = getCharacterFinancialStatus(state)
  const recommended = getRecommendedEquipment(financialStatus)

  return {
    headgear: state.character.equipmentSlots.headgear ?? recommended.headgear,
    clothing: state.character.equipmentSlots.clothing ?? recommended.clothing,
    accessories: state.character.equipmentSlots.accessories ?? recommended.accessories,
  }
}

/**
 * Check if equipment changed between two states
 */
export function didEquipmentChange(prevState: GameState | undefined, newState: GameState): boolean {
  if (!prevState) return false

  const prev = getCharacterAppearance(prevState)
  const next = getCharacterAppearance(newState)

  return Object.entries(prev).some(([slot, equipment]) => equipment !== next[slot as EquipmentSlot])
}

/**
 * Get equipment that changed
 */
export function getEquipmentChanges(
  prevState: GameState | undefined,
  newState: GameState,
): Partial<Record<EquipmentSlot, { from: string | null; to: string | null }>> {
  if (!prevState) return {}

  const prev = getCharacterAppearance(prevState)
  const next = getCharacterAppearance(newState)
  const changes: Partial<Record<EquipmentSlot, { from: string | null; to: string | null }>> = {}

  for (const slot of ['headgear', 'clothing', 'accessories'] as const) {
    if (prev[slot] !== next[slot]) {
      changes[slot] = { from: prev[slot], to: next[slot] }
    }
  }

  return changes
}
