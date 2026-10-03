# Card Artwork System

All story cards display thematic artwork based on their chapter and type.

## Artwork Organization

Artwork is organized by chapter in the following structure:

```
src/assets/artwork/
├── chapter2/          # Underworld theme (9 images)
├── chapter3/          # Warfare theme (9 images)
├── chapter4/          # Banking & Finance theme (9 images)
├── chapter5/          # Plague & Decay theme (9 images)
├── chapter6/          # Betrayal theme (9 images)
└── chapter7/          # Transcendence theme (9 images)
```

Each folder contains 9 PNG images (16:9 aspect ratio, ~3.7MB each):
- 3 Commodity/Opportunity cards
- 3 Market Event cards
- 3 Danger cards

**Total: 54 images across all chapters**

## File Naming Convention

Artwork files are named after their card ID:
- `ch2_spice_smuggling.png` for card `ch2_spice_smuggling`
- `ch3_war_profiteer_iron.png` for card `ch3_war_profiteer_iron`
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
1. `getCardArtworkPath()` checks if the card has a chapter number
2. If yes, it returns the path: `/assets/artwork/chapter{N}/{cardId}.png`
3. The image is loaded and displayed above the card title
4. If the image fails to load, the card displays without artwork

### Styling

Artwork images are:
- Max height: 300px
- Responsive width (100% of card)
- Object-fit: cover (maintains aspect ratio)
- Border-radius: 8px (rounded corners)
- Negative margins to extend to card edges

## Generating Artwork

### Automatic Generation (via Stability.ai)

Scripts for generating artwork:
- `scripts/generate-ch2-ch3-artwork.mjs` - Chapters 2-3
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
```

**Output:** PNG images saved to `src/assets/artwork/chapter{N}/`

### Custom Artwork

To add custom artwork:
1. Create PNG files (16:9 aspect ratio recommended)
2. Name them after the card ID: `{cardId}.png`
3. Place in correct chapter folder: `src/assets/artwork/chapter{N}/`
4. No code changes needed - artwork auto-displays if file exists

## Card Artwork Display

For a card to display artwork, it must:
1. Have a `chapter` field in the card definition (e.g., `chapter: 2`)
2. Have a corresponding artwork file in the correct folder

Chapter 1 cards (no chapter field) will not display artwork.

## Performance

- Each image: ~3.7MB PNG (16:9, full-color)
- Total for all 54 images: ~200MB
- Images load on-demand as cards are displayed
- Graceful fallback if image fails to load

## Future Enhancements

- [ ] Lazy loading for image optimization
- [ ] Image compression/optimization
- [ ] Alternative artwork themes (light, dark, stylized)
- [ ] Custom artwork submission system
- [ ] Artwork caching strategy
