# Cash Adventure Visual Asset System

This document explains how the visual asset system works and how to add new backgrounds, character equipment, and sounds.

## Architecture Overview

The asset system is organized into three main categories:

### 1. Backgrounds (`src/assets/backgrounds/`)

Background images that set the mood for story cards.

**Files:**
- `metadata.ts` - Central registry mapping `cardId` → `BackgroundAsset`
- `images/` - WebP background images (1920x1440 recommended)

**Adding a Background:**

1. Generate or create a background image for your story card
   - Style: Detailed realistic cartoon, fantasy/steampunk aesthetic
   - Dimensions: 1920x1440 (16:9 aspect ratio)
   - Format: WebP at 80% quality for best file size
   - Place in `src/assets/backgrounds/images/{cardId}.webp`

2. Register in `src/assets/backgrounds/metadata.ts`:
   ```typescript
   'your-card-id': {
     id: 'unique-bg-id',
     cardId: 'your-card-id',
     url: '/backgrounds/your-card-id.webp',
     alt: 'A description of the scene for accessibility',
     aspectRatio: 16 / 9,
     // Optional: blurHash for blur-up placeholder
   },
   ```

3. Add optional visual metadata to your story card in `src/content/campaign.ts`:
   ```typescript
   {
     id: 'your-card-id',
     title: 'Card Title',
     body: [...],
     visual: {
       backgroundId: 'your-card-id',
       characterMood: 'neutral', // 'neutral' | 'tense' | 'triumphant' | 'fearful'
     },
   }
   ```

### 2. Character Equipment (`src/assets/characters/`)

Character appearance is built from layered SVG components representing different equipment slots.

**Directory Structure:**
```
characters/
├── base/
│   └── merchant-base.svg          # Base character body
├── equipment/
│   ├── headgear/
│   │   ├── bare-head.svg
│   │   ├── simple-hat.svg
│   │   ├── fine-hat.svg
│   │   ├── crown.svg
│   │   ├── hood.svg
│   │   └── helm.svg
│   ├── clothing/
│   │   ├── rags.svg
│   │   ├── simple-clothes.svg
│   │   ├── fine-clothes.svg
│   │   ├── leather-armor.svg
│   │   ├── plate-armor.svg
│   │   └── cloak.svg
│   └── accessories/
│       ├── none.svg
│       ├── gold-ring.svg
│       ├── jewelry.svg
│       ├── pocket-watch.svg
│       ├── weapon.svg
│       └── tools.svg
└── equipmentMetadata.ts           # Equipment definitions
```

**Equipment Metadata Structure** (`equipmentMetadata.ts`):
```typescript
export interface EquipmentVariant {
  id: string                    // Unique ID (e.g., 'fine-hat')
  slot: EquipmentSlot          // 'headgear' | 'clothing' | 'accessories'
  label: string                // Display name
  visualAssetPath: string      // SVG fragment path
  description: string          // Flavor text
  assetId?: string             // Links to OwnedAsset ID if game-tied
}
```

**Adding New Equipment:**

1. Create SVG file for the equipment piece
   - Location: `src/assets/characters/equipment/{slot}/{id}.svg`
   - Size: Approximately 200x300px
   - Style: Match existing character art style
   - Transparency: Use alpha transparency for blending

2. Add variant definition to `equipmentMetadata.ts`:
   ```typescript
   // In EQUIPMENT_VARIANTS['clothing']
   {
     id: 'royal-robes',
     slot: 'clothing',
     label: 'Royal Robes',
     visualAssetPath: 'characters/equipment/clothing/royal-robes.svg',
     description: 'Purple silk robes with gold embroidery',
     assetId: 'royal_robes_asset', // Optional: link to OwnedAsset
   }
   ```

3. If the equipment is tied to an in-game asset (e.g., acquiring armor from a vendor):
   - Update the `OwnedAsset` definition in your campaign content
   - Add `visualEffect: 'clothing'` to the asset
   - When the asset is acquired, the character will automatically wear it

### 3. Sounds (`src/assets/sounds/`)

Sound effects for UI interactions and game events.

**Files:**
- `eventTypes.ts` - Sound event registry mapping event types → audio files
- `ui/` - UI interaction sounds (hover, click, card flip)
- `events/` - Game event sounds (stat changes, gold, debt, victories)
- `ambient/` - Optional looping ambient tracks

**Sound Event Types:**
```typescript
type SoundEventType =
  | 'card-enter'        // Card appears
  | 'choice-hover'      // Hover over button
  | 'choice-click'      // Click button
  | 'stat-increase'     // Stat goes up
  | 'stat-decrease'     // Stat goes down
  | 'gold-gain'         // Gain gold
  | 'gold-spend'        // Lose gold
  | 'debt-incur'        // Debt increases
  | 'freedom-achieved'  // Passive income >= expenses
  | 'colossus-appear'   // Colossus encounter
  | 'check-roll'        // Skill check
  | 'check-success'     // Check passes
  | 'check-failure'     // Check fails
  | 'asset-acquire'     // Acquire asset
  | 'asset-sell'        // Sell asset
```

**Adding Sound Effects:**

1. Create or generate audio file
   - Format: MP3 (16-bit, 44.1kHz)
   - Duration: Keep short (< 2 seconds)
   - Location: `public/sounds/{category}/{name}.mp3`

2. Register in `src/assets/sounds/eventTypes.ts`:
   ```typescript
   'card-enter': {
     eventType: 'card-enter',
     path: 'sounds/ui/card-flip.mp3',
     volume: 0.6,           // 0-1
     delay: 500,            // Optional: delay in ms
   }
   ```

## Financial Status and Character Appearance

Character appearance automatically updates based on financial status:

**Poor** (gold < expenses):
- Clothing: Rags
- Headgear: Bare head
- Accessories: None

**Moderate** (expenses ≤ gold < 3× expenses):
- Clothing: Simple clothes
- Headgear: Simple hat
- Accessories: None

**Wealthy** (gold ≥ 3× expenses):
- Clothing: Fine clothes
- Headgear: Fine hat
- Accessories: Gold ring

Override defaults by setting explicit equipment in character state.

## Character Mood Indicators

Mood affects visual feedback (glow colors, animations):

- **Neutral**: Default appearance
- **Triumphant**: Victory glow after defeating colossus
- **Tense**: Slight tension aura when in debt
- **Fearful**: Dark aura when debt > 50% of gold

## Image Generation Guide

### Backgrounds

When generating a background image, use a prompt like:

```
A detailed realistic cartoon scene of [scene description from card].
Fantasy/steampunk aesthetic with atmospheric lighting.
Composition: [description of camera angle and focus].
Aspect ratio: 16:9 with headroom for UI card overlay.
Style: Detailed but not photorealistic, with defined edges and subtle colors.
Lighting: [time of day, mood, light sources].
```

**Example for a harbor scene:**
```
A detailed realistic cartoon harbor at dawn. Fantasy steampunk aesthetic with 
wooden docks, merchant ships, and distant cliffs. Soft golden sunlight creates 
warm shadows. Aspect ratio 16:9. Style: detailed cartoon with defined edges.
```

### Character Equipment

For SVG equipment pieces, consider:
- Layering: Create as SVG groups that can be composited
- Sizing: Design for ~200px height
- Transparency: Use alpha for blending with base character
- Color range: 6-8 main colors for consistency
- Details: Add 2-3 texture details for visual richness

## Preloading and Performance

The UI automatically preloads backgrounds for:
- Current story card
- Next 1-2 cards in the queue
- Upcoming colossus encounters

Sounds are loaded on-demand with lazy loading.

## Testing Your Assets

1. **Check background aspect ratio:**
   ```bash
   identify src/assets/backgrounds/images/your-card.webp
   ```

2. **Verify metadata registration:**
   ```typescript
   import { getBackground } from '../assets/backgrounds/metadata'
   const bg = getBackground('your-card-id')
   console.assert(bg !== undefined, 'Background not registered!')
   ```

3. **Test character rendering:**
   Run the app and verify character appears correctly with equipment variants.

4. **Test sounds:**
   Play each sound in the browser DevTools console:
   ```javascript
   const audio = new Audio('/sounds/ui/choice-hover.mp3')
   audio.play()
   ```

## Content Creator Workflow

1. **Identify a story card** needing a background
2. **Write a 1-2 sentence scene description** based on card text
3. **Generate image** using Claude, Midjourney, or DALL-E (see prompt template above)
4. **Optimize and save** as WebP to `src/assets/backgrounds/images/`
5. **Register in metadata** with card ID and description
6. **Test in-game** to verify timing and appearance
7. **Optional: Create equipment variants** for acquired assets
8. **Optional: Record sound effects** for important events

## Future Enhancements

- **Blur-up placeholders**: Generate blurhash values for faster perceived loading
- **Asset pipeline**: Automated WebP conversion, optimization, and validation
- **Character customization**: Player-selected appearance options
- **Lighting variations**: Time-of-day based character shadows and color shifts
- **Equipment animations**: Equipment changes trigger brief animations
- **Music system**: Phase-specific background tracks

---

For questions about the visual system, refer to the implementation plan in the main project documentation.
