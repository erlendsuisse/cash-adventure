# Automated Background Image Generation

This guide explains how to automatically generate and register background images for Cash Adventure using the Stability AI API.

## Quick Start (5 minutes)

### 1. Get a Stability AI API Key

1. Go to [Stability AI Platform](https://platform.stability.ai/)
2. Sign up (free tier includes ~100 credits)
3. Go to Account → API Keys
4. Copy your API key
5. Set environment variable:
   ```bash
   export STABILITY_API_KEY="sk-..." 
   ```

### 2. Install Dependencies

```bash
npm install node-fetch
# Optional, for WebP conversion (recommended for better compression):
npm install sharp
```

### 3. Generate Images

**Dry run first** (no API calls, just shows what would happen):
```bash
npx ts-node scripts/generate-backgrounds.ts --cards prologue,colossus01_start --dry-run
```

**Generate single cards:**
```bash
npx ts-node scripts/generate-backgrounds.ts --cards prologue,job_offer,first_market
```

**Generate all cards with backgrounds:**
```bash
npx ts-node scripts/generate-backgrounds.ts --all
```

### 4. Review & Deploy

1. Check generated images in `src/assets/backgrounds/images/`
2. Images are auto-registered in `src/assets/backgrounds/metadata.ts`
3. Build and test:
   ```bash
   npm run build && npm run dev
   ```
4. Open http://localhost:5173 and verify backgrounds appear

## How It Works

```
┌─────────────────────────────────────────┐
│ 1. Read story cards from campaign.ts    │
├─────────────────────────────────────────┤
│ 2. Extract scene descriptions           │
├─────────────────────────────────────────┤
│ 3. Generate AI prompts (with context)   │
├─────────────────────────────────────────┤
│ 4. Call Stability AI API                │
├─────────────────────────────────────────┤
│ 5. Convert PNG → WebP (80% quality)     │
├─────────────────────────────────────────┤
│ 6. Save to assets/backgrounds/images/   │
├─────────────────────────────────────────┤
│ 7. Auto-register in metadata.ts         │
└─────────────────────────────────────────┘
```

## Stability AI API Pricing

| Tier | Cost | Monthly Limit | Speed |
|------|------|---------------|-------|
| Free | $0 | 100 credits (~10 images) | 30s per image |
| Pro | $10/month | Unlimited | 30s per image |
| Professional | $20+/month | Prioritized queue | 20s per image |

**Cost Example:**
- 10 images × $0.08 = $0.80 (free tier)
- 50 images × $0.08 = $4.00
- 100 images × $0.08 = $8.00 (one Pro month)

## Advanced: Customizing Prompts

### Current System
The script generates basic prompts from card text:
```
"You stand at the threshold of opportunity..."
+ [standard fantasy/steampunk style guide]
```

### Recommended: Use Claude to Generate Better Prompts

Modify `generatePrompt()` to call Claude (requires Anthropic API):

```typescript
import Anthropic from '@anthropic-ai/sdk'

async function generatePromptWithClaude(card: CardRef): Promise<string> {
  const client = new Anthropic()
  const response = await client.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `Generate an image prompt for Stable Diffusion based on this story scene:

Story: ${card.body?.[0] || card.title}

Requirements:
- Detailed realistic cartoon style
- Fantasy/steampunk aesthetic
- 1920x1440 aspect ratio
- Atmospheric lighting
- No people's faces (keep distant or obscured)

Return only the prompt, no explanation.`,
      },
    ],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}
```

## Troubleshooting

### "STABILITY_API_KEY not set"
```bash
# Make it permanent:
echo 'export STABILITY_API_KEY="sk-..."' >> ~/.zshrc
source ~/.zshrc
```

### "sharp not installed"
```bash
npm install sharp
# Or keep as PNG (larger files, same visual quality)
```

### "API Error: Insufficient credits"
- Free tier has ~100 credits
- Each generation costs ~0.9 credits
- Upgrade to Pro at https://platform.stability.ai/account/billing/overview

### Images look low quality
- Increase `steps` in script (default 30, try 50)
- Use `stable-diffusion-xl-1024-v1-0` (higher quality, 2x cost)
- Use `negative_prompt` to exclude unwanted elements

### Generated images don't match metadata.ts
- Check `src/assets/backgrounds/images/` folder exists
- Run script with `--dry-run` first to debug
- Check metadata.ts wasn't corrupted (backup before running!)

## Manual Workflow (If Not Using Automation)

If you prefer to generate images manually:

1. **Write a prompt** based on the story card text (see examples below)
2. **Generate via Stability AI web UI** at https://dreamstudio.ai/
3. **Export as WebP** (Settings → Format: WebP, Quality: 80)
4. **Save to** `src/assets/backgrounds/images/{cardId}.webp`
5. **Register in** `src/assets/backgrounds/metadata.ts`:
   ```typescript
   'your-card-id': {
     id: 'your-card-id',
     cardId: 'your-card-id',
     url: '/backgrounds/your-card-id.webp',
     alt: 'Brief scene description',
     aspectRatio: 16 / 9,
   },
   ```

## Example Prompts

### Harbor Scene
```
A merchant harbor at dawn with wooden docks, sailing ships, and distant cliffs. 
Fantasy steampunk aesthetic with soft golden sunlight creating warm shadows. 
Aspect ratio 16:9. Style: detailed realistic cartoon with defined edges.
```

### Temple Interior
```
Grand temple interior with columns and archways, lit by candlelight and stained glass.
Rich fantasy steampunk aesthetic with intricate stone carvings.
Aspect ratio 16:9. Style: detailed realistic cartoon.
```

### Market Square
```
Busy fantasy market square with merchant stalls, crowds, and colorful banners.
Steampunk aesthetic with brass fixtures and gas lamps.
Midday sunlight creates sharp shadows and vibrant colors.
Aspect ratio 16:9. Style: detailed realistic cartoon.
```

### Character Portrait
```
Weathered merchant character in simple clothing, holding a ledger.
Fantasy steampunk style. Soft lighting, neutral background.
Aspect ratio 16:9. Style: detailed realistic cartoon character illustration.
```

## Performance Tips

1. **Batch generation**: Generate 10+ images at once to warm up the API
2. **Off-peak hours**: Faster responses during non-peak times
3. **Lower resolution first**: Test with 1024×768, then upscale
4. **Cache prompts**: Reuse proven prompts across similar scenes
5. **Monitor costs**: Check https://platform.stability.ai/account/billing/usage

## Next Steps

1. ✅ Set up Stability AI API key
2. ✅ Run `npm install node-fetch` (and `npm install sharp` if wanted)
3. ✅ Test with `--dry-run` flag
4. ✅ Generate your first batch of backgrounds
5. ⏭️ Continue with Phase 2: Background rendering component

---

**Questions?** Check `docs/ASSET_SYSTEM.md` for broader asset workflow context.
