# Stability.ai Artwork Generation Guide

## Setup

Your Stability.ai API key is stored in `.env.local` (never committed to git).

## Generating Artwork

### Quick Test
Test the API connection:
```bash
node scripts/test-stability.mjs  # Generates a sample merchant image
```

### Generate Card Artwork

```bash
npx ts-node scripts/generate-artwork.ts [chapter]
```

Examples:
```bash
npx ts-node scripts/generate-artwork.ts 1  # Generate Chapter 1 artwork
npx ts-node scripts/generate-artwork.ts 2  # Generate Chapter 2 artwork
```

## How It Works

The generator creates themed artwork based on:
- **Card type**: opportunity, danger, story, colossus, recovery
- **Chapter**: Each chapter has distinct visual themes
  - Chapter 1: Merchant city, market stalls, warm earth tones
  - Chapter 2: Criminal underworld, shadowy alleyways, dark atmosphere
  - Chapter 3: Warfare, battlefields, chaos, red/grey tones
  - Chapter 4: Corruption, grand halls, gold/marble, governmental
  - Chapter 5: Plague, decay, sickness, dark forests
  - Chapter 6: Betrayal, twisted architecture, mirrors/shadows
  - Chapter 7: Cosmic horror, reality breaking, otherworldly

## Output

Generated images are saved to:
```
src/assets/artwork/chapter{N}/{cardId}.png
```

Example:
```
src/assets/artwork/chapter1/merchant_gambit.png
src/assets/artwork/chapter2/mob_protection_offer.png
```

## Integrating with Card Metadata

After generating, cards can reference artwork via visual metadata:

```typescript
const card: StoryCard = {
  id: 'merchant_gambit',
  title: 'Merchant Gambit',
  // ... other card data
  visualMetadata: {
    backgroundId: 'chapter1/merchant_gambit',
  }
}
```

## Cost Estimate

Each image costs ~0.03 credits on Stability.ai free tier.

## Troubleshooting

If you get "API error":
1. Check `STABILITY_API_KEY` in `.env.local`
2. Ensure it starts with `sk-`
3. Verify key is active at https://platform.stability.ai/
4. Check if your free tier credits have expired

## Important Security Note

⚠️ **After this session, rotate your Stability.ai API key** at https://platform.stability.ai/account/keys since it was shared in this conversation.
