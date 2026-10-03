import type { CharacterState } from '../../../engine/types'
import { getEquipmentVariant } from '../../../assets/characters/equipmentMetadata'
import styles from './Character.module.css'

interface CharacterProps {
  character: CharacterState
  financial_status: 'poor' | 'moderate' | 'wealthy'
  mood: 'neutral' | 'tense' | 'triumphant' | 'fearful'
}

/**
 * Character display - shows a stylized merchant character with
 * equipment layers that change based on owned assets.
 * Pure SVG for modularity and performance.
 */
export function Character({ character, financial_status, mood }: CharacterProps) {
  const headgear = character.equipmentSlots.headgear ? getEquipmentVariant(character.equipmentSlots.headgear) : null
  const clothing = character.equipmentSlots.clothing ? getEquipmentVariant(character.equipmentSlots.clothing) : null
  const accessories = character.equipmentSlots.accessories ? getEquipmentVariant(character.equipmentSlots.accessories) : null

  return (
    <div className={`${styles.character} ${styles[`mood-${mood}`]} ${styles[`status-${financial_status}`]}`}>
      <svg viewBox="0 0 200 300" className={styles.svg}>
        {/* Base body */}
        <g id="body">
          {/* Head */}
          <circle cx="100" cy="60" r="30" fill="#d4a574" />

          {/* Body */}
          <ellipse cx="100" cy="140" rx="35" ry="50" fill="#8b7355" />

          {/* Arms */}
          <rect x="65" y="110" width="15" height="60" fill="#d4a574" rx="7" />
          <rect x="120" y="110" width="15" height="60" fill="#d4a574" rx="7" />

          {/* Legs */}
          <rect x="85" y="190" width="12" height="60" fill="#5a4a3a" rx="6" />
          <rect x="103" y="190" width="12" height="60" fill="#5a4a3a" rx="6" />
        </g>

        {/* Equipment Layers */}
        {clothing && <EquipmentLayer equipmentId={clothing.id} />}
        {headgear && <EquipmentLayer equipmentId={headgear.id} />}
        {accessories && <EquipmentLayer equipmentId={accessories.id} />}

        {/* Mood indicator - subtle aura */}
        <circle cx="100" cy="140" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      </svg>

      {/* Equipment labels (when hovering) */}
      {(headgear || clothing || accessories) && (
        <div className={styles.equipment_labels}>
          {headgear && <span className={styles.label}>{headgear.label}</span>}
          {clothing && <span className={styles.label}>{clothing.label}</span>}
          {accessories && <span className={styles.label}>{accessories.label}</span>}
        </div>
      )}
    </div>
  )
}

interface EquipmentLayerProps {
  equipmentId: string
}

/**
 * Equipment SVG layer - renders specific equipment on the character
 * Lazy-loaded component references
 */
function EquipmentLayer({ equipmentId }: EquipmentLayerProps) {
  // In production, these would be dynamically imported
  // For now, return basic SVG shapes

  const components: Record<string, React.FC> = {
    SimpleHat: () => (
      <g id="simple-hat">
        <path d="M 75 35 Q 100 25 125 35 Q 120 40 100 45 Q 80 40 75 35" fill="#6b5344" />
        <line x1="75" y1="35" x2="70" y2="38" stroke="#8b7355" strokeWidth="2" />
        <line x1="125" y1="35" x2="130" y2="38" stroke="#8b7355" strokeWidth="2" />
      </g>
    ),
    MerchantCrown: () => (
      <g id="merchant-crown">
        <path d="M 70 30 L 100 15 L 130 30 Q 125 40 100 45 Q 75 40 70 30" fill="#d4af37" />
        <circle cx="100" cy="20" r="5" fill="#ff6b6b" />
        <circle cx="80" cy="32" r="3" fill="#4ecdc4" />
        <circle cx="120" cy="32" r="3" fill="#4ecdc4" />
      </g>
    ),
    RaggedCoat: () => (
      <g id="ragged-coat">
        <path d="M 65 110 Q 100 105 135 110 L 130 180 Q 100 185 70 180 Z" fill="#6b5344" opacity="0.8" />
        <path d="M 75 115 L 72 170" stroke="#5a4a3a" strokeWidth="1" opacity="0.5" />
        <path d="M 100 108 L 100 180" stroke="#5a4a3a" strokeWidth="1" opacity="0.5" />
        <path d="M 125 115 L 128 170" stroke="#5a4a3a" strokeWidth="1" opacity="0.5" />
      </g>
    ),
    MerchantCoat: () => (
      <g id="merchant-coat">
        <path d="M 65 110 Q 100 105 135 110 L 130 180 Q 100 185 70 180 Z" fill="#8b4513" />
        <circle cx="85" cy="130" r="4" fill="#d4af37" />
        <circle cx="100" cy="125" r="4" fill="#d4af37" />
        <circle cx="115" cy="130" r="4" fill="#d4af37" />
        <path d="M 70 115 L 75 175" stroke="#d4af37" strokeWidth="2" />
        <path d="M 130 115 L 125 175" stroke="#d4af37" strokeWidth="2" />
      </g>
    ),
    NobleVestments: () => (
      <g id="noble-vestments">
        <path d="M 65 110 Q 100 105 135 110 L 130 180 Q 100 185 70 180 Z" fill="#4a3f35" />
        <path d="M 70 115 L 80 175" stroke="#d4af37" strokeWidth="3" />
        <path d="M 130 115 L 120 175" stroke="#d4af37" strokeWidth="3" />
        <circle cx="100" cy="135" r="6" fill="#d4af37" />
        <rect x="95" y="150" width="10" height="20" fill="#d4af37" />
      </g>
    ),
    LeatherBelt: () => (
      <g id="leather-belt">
        <rect x="70" y="155" width="60" height="8" fill="#8b4513" rx="4" />
        <circle cx="100" cy="159" r="5" fill="#d4af37" />
      </g>
    ),
    GoldChain: () => (
      <g id="gold-chain">
        <circle cx="95" cy="125" r="4" fill="#d4af37" />
        <line x1="95" y1="130" x2="95" y2="160" stroke="#d4af37" strokeWidth="2" />
        <circle cx="95" cy="165" r="6" fill="#ffd700" />
      </g>
    ),
  }

  const Component = components[equipmentId]
  return Component ? <Component /> : null
}
