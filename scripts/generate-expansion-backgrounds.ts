#!/usr/bin/env node

/**
 * Generate individual backgrounds for 14 expansion cards
 * Each has a specific D&D-style visual description
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const STABILITY_API_KEY = process.env.STABILITY_API_KEY
const STABILITY_API_URL = `https://api.stability.ai/v2beta/stable-image/generate/ultra`

const MASTER_STYLE_GUIDE = `
Artistic Style: Detailed realistic cartoon (hand-painted digital art aesthetic)
Aesthetic: Fantasy steampunk with Victorian-era merchant architecture
Color Palette: Warm golds, earth browns, teal/turquoise accents, candlelit oranges
Lighting: Atmospheric with lanterns, gas lamps, natural sunlight creating mood
Art Direction: Rule of thirds composition, clear focal points, populated with NPCs
Level of Detail: High - intricate textures, ambient objects, environmental storytelling
Mood: Adventurous, mercantile, atmospheric, slightly mysterious
Composition: 16:9 aspect ratio, leave headroom for UI card overlay
Quality: Cinematic, immersive, game-ready professional artwork
Avoid: Photographs, 3D renders, anime/manga style, modern elements, focused faces, visible text
`

const EXPANSION_CARDS = [
  {
    id: 'ancient_ruins',
    title: 'Ancient Ruins',
    description: 'Crumbling stone structures on coastal cliffs, half-buried in earth. Mysterious glyphs carved into weathered walls. Moss and vines reclaim ancient architecture. Bronze artifacts glinting in shadows. Explorers in distance.',
  },
  {
    id: 'monster_contract',
    title: 'Marshland Monster Hunt',
    description: 'Murky marshlands with still water reflecting moonlight. Crocodile silhouettes in the reeds. Experienced hunters with torches and spears at the water\'s edge. Ancient twisted trees, thick fog, atmospheric danger.',
  },
  {
    id: 'wizard_offer',
    title: 'The Arcanist Scholar',
    description: 'Dimly lit study filled with books and strange instruments. An elderly woman with ink-stained hands poring over ancient texts. Magical symbols glowing on papers. Bookshelves reaching high. Mystical atmosphere of forbidden knowledge.',
  },
  {
    id: 'guild_charter',
    title: 'Merchant Guild Hall',
    description: 'Grand guild hall interior with soaring wooden beams. Merchant banners hanging from walls. Contract tables with ledgers and seals. Wealthy traders in fine clothes discussing business. Ornate braziers warming the space.',
  },
  {
    id: 'trade_route',
    title: 'Mountain Trade Pass',
    description: 'Dramatic mountain pass with cleared road. Merchant caravans with wagons and pack animals winding through towering peaks. Snow-capped mountains in distance. Trading posts at the summit. Clear morning light illuminating the route.',
  },
  {
    id: 'property_deed',
    title: 'Merchant Warehouse',
    description: 'Substantial stone warehouse building in merchant district. Large doors for cargo. Windows with security bars. Bustling dock area nearby with traders examining goods. Weathered signage. Valuable and well-maintained.',
  },
  {
    id: 'dueling_school',
    title: 'Fencing Academy',
    description: 'Elegant dueling academy interior. Wooden floors, tall windows. Mirrors on walls. Fencers in period clothing practicing with rapiers. Weapons racks lining the walls. Disciplined martial atmosphere.',
  },
  {
    id: 'philosophy_circle',
    title: 'Scholarly Meeting Hall',
    description: 'Intimate circular meeting room with reading materials on tables. Merchants and scholars seated in discussion. Wine and fine food served. Warm lamplight. Relaxed intellectual atmosphere with comfortable furnishings.',
  },
  {
    id: 'charm_school',
    title: 'Court Etiquette School',
    description: 'Refined salon with elegant furnishings and mirrors. A distinguished woman teaching deportment to students. Fine clothing being fitted. Candlelit and sophisticated. Aristocratic atmosphere.',
  },
  {
    id: 'market_crash',
    title: 'Market in Turmoil',
    description: 'Bustling market square with merchants in panic. Price boards being frantically updated. Iron ingots stacked in market. Concerned traders examining merchandise. Chaos and opportunity mixed in crowded marketplace.',
  },
  {
    id: 'spice_windfall',
    title: 'Spice Market Frenzy',
    description: 'Vibrant spice market with exotic colors everywhere. Colorful goods piled high. Merchants shouting prices. Buyers crowding stalls eagerly. Fragrant atmosphere. High energy and valuable opportunities.',
  },
  {
    id: 'black_market',
    title: 'Underground Black Market',
    description: 'Shadowy underground chamber lit by few torches. Hooded figures conducting secret trades in shadows. Illicit goods displayed on tables. Dangerous atmosphere with armed guards. Tension and opportunity.',
  },
  {
    id: 'ancient_ruins_aftermath',
    title: 'Ruins Explored',
    description: 'Aftermath of exploration. Explorers emerging from ruins with artifacts and treasures. Bronze mirror and treasures visible. Celebration and storytelling of successful venture. Satisfied adventurers.',
  },
  {
    id: 'monster_aftermath',
    title: 'Marsh Conquest',
    description: 'Quieted marshlands after creature elimination. Hunters and merchants celebrating. Pelts and trophies visible. Peaceful water reflecting moonlight. Sense of danger overcome.',
  },
]

function buildPrompt(description: string, title: string): string {
  return `Scene: ${description}

Card: "${title}"

Style Guide:
${MASTER_STYLE_GUIDE}

Generate a cohesive fantasy steampunk environment matching this narrative scene.`
}

async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    console.log(`  🎨 Generating image...`)

    const formData = new FormData()
    formData.append('prompt', prompt)
    formData.append('negative_prompt', 'blurry, low quality, distorted, ugly')
    formData.append('aspect_ratio', '16:9')
    formData.append('output_format', 'webp')
    formData.append('seed', '0')

    const response = await fetch(STABILITY_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'image/*',
        Authorization: `Bearer ${STABILITY_API_KEY}`,
      },
      body: formData as any,
    } as any)

    if (!response.ok) {
      const text = await response.text()
      console.error(`    ❌ API Error (${response.status}): ${text}`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error(`    ❌ Generation failed: ${error}`)
    return null
  }
}

async function convertToWebP(buffer: Buffer): Promise<Buffer | null> {
  try {
    const sharp = await import('sharp')
    return await sharp.default(buffer)
      .webp({ quality: 80 })
      .toBuffer()
  } catch {
    console.warn('    ⚠️  sharp not installed, keeping as is')
    return buffer
  }
}

function saveImage(id: string, buffer: Buffer): string {
  const outputDir = path.join(__dirname, '../public/backgrounds')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const filename = `${id}.webp`
  const filepath = path.join(outputDir, filename)
  fs.writeFileSync(filepath, buffer)
  console.log(`  ✅ Saved: ${filepath}`)
  return filepath
}

function updateMetadata(id: string, title: string): void {
  const metadataPath = path.join(__dirname, '../src/assets/backgrounds/metadata.ts')
  let content = fs.readFileSync(metadataPath, 'utf-8')

  const newEntry = `  '${id}': { id: '${id}', cardId: '${id}', url: '/backgrounds/${id}.webp', alt: '${title}', aspectRatio: 16 / 9 },`

  // Add to BACKGROUND_MAP before the closing brace
  const mapEndIdx = content.indexOf('}\n\nexport const BACKGROUND_FALLBACKS')
  if (mapEndIdx !== -1) {
    content =
      content.slice(0, mapEndIdx) + newEntry + '\n' + content.slice(mapEndIdx)
    fs.writeFileSync(metadataPath, content)
    console.log(`  📝 Registered in metadata.ts`)
  }
}

async function main() {
  if (!STABILITY_API_KEY) {
    console.error('❌ STABILITY_API_KEY not set')
    process.exit(1)
  }

  console.log('\n🎨 Generating 14 Expansion Card Backgrounds')
  console.log('=========================================\n')

  let success = 0

  for (const card of EXPANSION_CARDS) {
    console.log(`\n📌 ${card.id}`)
    console.log(`   "${card.title}"`)

    try {
      const prompt = buildPrompt(card.description, card.title)
      const buffer = await generateImage(prompt)

      if (!buffer) continue

      const webp = await convertToWebP(buffer)
      if (!webp) continue

      saveImage(card.id, webp)
      updateMetadata(card.id, card.title)
      success++

      // Rate limit
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`  ❌ Failed: ${error}`)
    }
  }

  console.log(`\n✨ Generated ${success}/${EXPANSION_CARDS.length} backgrounds`)
  if (success > 0) {
    console.log('\n💡 Next: npm run build && npm run dev')
  }
}

main().catch(console.error)
