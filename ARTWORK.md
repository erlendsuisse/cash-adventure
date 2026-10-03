# Card Artwork System

All story cards display thematic artwork based on their chapter and type.

## Artwork Organization

Artwork is organized by chapter in the following structure:

```
src/assets/artwork/
├── chapter2/          # Underworld theme
├── chapter3/          # Warfare theme
├── chapter4/          # Banking & Finance theme
├── chapter5/          # Plague & Decay theme
├── chapter6/          # Betrayal theme
└── chapter7/          # Transcendence theme
```

Images are WebP, at most 1200px wide, roughly 100KB each. `src/ui/artwork.test.ts`
fails if a file isn't WebP or doesn't match a card in that chapter.

## File Naming Convention

Artwork files are named after their card ID:
- `ch2_spice_smuggling.webp` for card `ch2_spice_smuggling`
- `ch3_war_profiteer_iron.webp` for card `ch3_war_profiteer_iron`
- etc.

## Theme Guidelines

### Chapter 2: Underworld
- Dark shadowy alleyways, dim lantern lighting
- Criminal activity, organized crime atmosphere
- Cloaked figures, brick and stone architecture

### Chapter 3: Warfare
- Battlefields in chaos, soldiers marching
- Red and grey color palette, smoke and fire
- Fortifications, military camps

### Chapter 4: Banking & Finance
- Governmental power, grand halls and marble
- Gold and corruption, financial institutions
- Wealth symbols, bureaucratic settings

### Chapter 5: Plague & Decay
- Dark forests, sickness and decay
- Ominous clouds, rotting buildings
- Desperation, societal collapse

### Chapter 6: Betrayal
- Twisted architecture, mirrors and shadows
- Espionage and paranoia themes
- Hidden figures, dangerous meetings

### Chapter 7: Transcendence
- Cosmic horror, reality breaking
- Otherworldly and dimensional rifts
- Unreality and cosmic elements

## UI Integration

The artwork display is implemented in:
- `src/ui/artwork.ts` - Helper functions for artwork paths
- `src/ui/components/EncounterCard.tsx` - Card display component
- `src/ui/components/EncounterCard.module.css` - Artwork styling

### How It Works

When a card is displayed:
1. `getCardArtworkPath()` looks the card id up in an `import.meta.glob` of `src/assets/artwork`
2. If a file exists, Vite serves it under a hashed URL; otherwise it returns null and nothing is requested
3. Cards without artwork fall back to their chapter's gradient background (Background.tsx)

### Styling

Artwork images are:
- Max height: 300px
- Responsive width (100% of card)
- Object-fit: cover (maintains aspect ratio)
- Border-radius: 8px (rounded corners)
- Negative margins to extend to card edges

## Generating Artwork

### Automatic Generation (via Stability.ai)

Scripts for generating artwork (each skips cards that already have a `.webp`):
- `scripts/generate-ch2-ch3-artwork.mjs` - Chapters 2-3, original decks
- `scripts/generate-expanded-ch2-ch3-artwork.mjs` - Chapters 2-3, expanded decks
- `scripts/generate-ch4-ch7-artwork.mjs` - Chapters 4-7

**Requirements:**
- Set `STABILITY_API_KEY` environment variable
- API key stored in `.env` file

**Run:**
```bash
export STABILITY_API_KEY=$(grep STABILITY_API_KEY .env | cut -d'=' -f2)
node scripts/generate-ch2-ch3-artwork.mjs
# or
node scripts/generate-ch4-ch7-artwork.mjs
node scripts/optimize-artwork.mjs   # converts the new PNGs to WebP, deletes the PNGs
```

**Output:** PNGs in `src/assets/artwork/chapter{N}/`, which `optimize-artwork.mjs` turns into WebP.

**Moderation blocks:** Stability rejects prompts that describe violence or crime in
progress. Describe the setting, objects or aftermath instead (a ransom note on a
door, not a bound hostage). Cards without art still get the chapter gradient.

### Custom Artwork

To add custom artwork:
1. Create PNG or JPG files (16:9 aspect ratio recommended)
2. Name them after the card ID: `{cardId}.png`
3. Place in correct chapter folder: `src/assets/artwork/chapter{N}/`
4. Run `node scripts/optimize-artwork.mjs` - no code changes needed

## Card Artwork Display

For a card to display artwork, it must:
1. Be registered in a chapter deck in `src/content/chapterDecks.ts` (which stamps its `chapter`)
2. Have a corresponding artwork file in that chapter's folder

## Performance

- Artwork is bundled by Vite with hashed filenames (cache-friendly) and loads per card
- No requests are made for cards without artwork
