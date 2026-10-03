// Equipment variant definitions and character appearance system

import type { EquipmentSlot } from '../../engine/types'

export interface EquipmentVariant {
  id: string
  slot: EquipmentSlot
  label: string
  visualAssetPath: string // Path to SVG fragment in characters/equipment/{slot}/{id}.svg
  description: string
  assetId?: string // Links to OwnedAsset if equipment-tied to game content
}

/**
 * All available equipment variants organized by slot
 */
export const EQUIPMENT_VARIANTS: Record<EquipmentSlot, EquipmentVariant[]> = {
  headgear: [
    {
      id: 'bare-head',
      slot: 'headgear',
      label: 'Bare Head',
      visualAssetPath: 'characters/equipment/headgear/bare-head.svg',
      description: 'No headgear',
    },
    {
      id: 'simple-hat',
      slot: 'headgear',
      label: 'Simple Hat',
      visualAssetPath: 'characters/equipment/headgear/simple-hat.svg',
      description: 'Basic merchant hat',
    },
    {
      id: 'fine-hat',
      slot: 'headgear',
      label: 'Fine Hat',
      visualAssetPath: 'characters/equipment/headgear/fine-hat.svg',
      description: 'Ornate hat with gold trim',
    },
    {
      id: 'crown',
      slot: 'headgear',
      label: 'Crown',
      visualAssetPath: 'characters/equipment/headgear/crown.svg',
      description: 'Ornamental crown',
    },
    {
      id: 'hood',
      slot: 'headgear',
      label: 'Hood',
      visualAssetPath: 'characters/equipment/headgear/hood.svg',
      description: 'Dark hooded cloak',
    },
    {
      id: 'helm',
      slot: 'headgear',
      label: 'Helm',
      visualAssetPath: 'characters/equipment/headgear/helm.svg',
      description: 'Steel helm',
    },
  ],
  clothing: [
    {
      id: 'rags',
      slot: 'clothing',
      label: 'Rags',
      visualAssetPath: 'characters/equipment/clothing/rags.svg',
      description: 'Worn rags, torn and patched',
    },
    {
      id: 'simple-clothes',
      slot: 'clothing',
      label: 'Simple Clothes',
      visualAssetPath: 'characters/equipment/clothing/simple-clothes.svg',
      description: 'Plain merchant clothing',
    },
    {
      id: 'fine-clothes',
      slot: 'clothing',
      label: 'Fine Clothes',
      visualAssetPath: 'characters/equipment/clothing/fine-clothes.svg',
      description: 'Expensive silks and tailored garments',
    },
    {
      id: 'leather-armor',
      slot: 'clothing',
      label: 'Leather Armor',
      visualAssetPath: 'characters/equipment/clothing/leather-armor.svg',
      description: 'Reinforced leather armor',
    },
    {
      id: 'plate-armor',
      slot: 'clothing',
      label: 'Plate Armor',
      visualAssetPath: 'characters/equipment/clothing/plate-armor.svg',
      description: 'Full plate armor',
    },
    {
      id: 'cloak',
      slot: 'clothing',
      label: 'Cloak',
      visualAssetPath: 'characters/equipment/clothing/cloak.svg',
      description: 'Rich flowing cloak',
    },
  ],
  accessories: [
    {
      id: 'none',
      slot: 'accessories',
      label: 'None',
      visualAssetPath: 'characters/equipment/accessories/none.svg',
      description: 'No accessories',
    },
    {
      id: 'gold-ring',
      slot: 'accessories',
      label: 'Gold Ring',
      visualAssetPath: 'characters/equipment/accessories/gold-ring.svg',
      description: 'Signet ring in gold',
    },
    {
      id: 'jewelry',
      slot: 'accessories',
      label: 'Jewelry',
      visualAssetPath: 'characters/equipment/accessories/jewelry.svg',
      description: 'Fine jewelry and gems',
    },
    {
      id: 'pocket-watch',
      slot: 'accessories',
      label: 'Pocket Watch',
      visualAssetPath: 'characters/equipment/accessories/pocket-watch.svg',
      description: 'Ornate pocket watch on a chain',
    },
    {
      id: 'weapon',
      slot: 'accessories',
      label: 'Weapon',
      visualAssetPath: 'characters/equipment/accessories/weapon.svg',
      description: 'Sword or dagger',
    },
    {
      id: 'tools',
      slot: 'accessories',
      label: 'Tools',
      visualAssetPath: 'characters/equipment/accessories/tools.svg',
      description: 'Merchant tools and scales',
    },
  ],
}

/**
 * Map equipment ID to variant
 */
export function getEquipmentVariant(equipmentId: string): EquipmentVariant | undefined {
  for (const variants of Object.values(EQUIPMENT_VARIANTS)) {
    const found = variants.find((v) => v.id === equipmentId)
    if (found) return found
  }
  return undefined
}

/**
 * Get default equipment variant for a slot
 */
export function getDefaultEquipment(slot: EquipmentSlot): EquipmentVariant {
  const variants = EQUIPMENT_VARIANTS[slot]
  if (variants.length === 0) {
    throw new Error(`No equipment variants found for slot: ${slot}`)
  }
  return variants[0]!
}

/**
 * Financial status mapping to equipment appearance
 */
export type FinancialStatus = 'poor' | 'moderate' | 'wealthy'

export interface FinancialEquipmentPreset {
  clothing: string // clothing equipment ID
  headgear: string // headgear equipment ID
  accessories: string // accessories equipment ID
}

export const FINANCIAL_PRESETS: Record<FinancialStatus, FinancialEquipmentPreset> = {
  poor: {
    clothing: 'rags',
    headgear: 'bare-head',
    accessories: 'none',
  },
  moderate: {
    clothing: 'simple-clothes',
    headgear: 'simple-hat',
    accessories: 'none',
  },
  wealthy: {
    clothing: 'fine-clothes',
    headgear: 'fine-hat',
    accessories: 'gold-ring',
  },
}

/**
 * Determine financial status from gold and debt levels
 */
export function getFinancialStatus(gold: number, expenses: number, debt: number): FinancialStatus {
  const netWorth = gold - debt
  if (netWorth < expenses) return 'poor'
  if (netWorth < expenses * 3) return 'moderate'
  return 'wealthy'
}
