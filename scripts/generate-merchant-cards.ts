#!/usr/bin/env node

/**
 * Generate backgrounds for merchant encounter cards
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
Mood: Mercantile, refined, tempting, persuasive
Composition: 16:9 aspect ratio, leave headroom for UI card overlay
Quality: Cinematic, immersive, game-ready professional artwork
Avoid: Photographs, 3D renders, anime/manga style, modern elements, focused faces, visible text
`

const MERCHANT_CARDS: Record<string, { title: string; description: string }> = {
  tavern_doodad: {
    title: 'A Velvet Cloak',
    description: 'Elegant tailor shop window with fine velvet cloak displayed on a dress form. Rich fabrics, warm lighting from oil lamps. Merchant tailors in background working. Luxury and craftsmanship.',
  },
  jeweler_wares: {
    title: 'A Signet Ring',
    description: 'Jeweler workshop with ornate signet rings displayed on velvet cushions. Jeweler examining rings with magnifying glass. Wealthy clients examining wares. Authority and status.',
  },
  cobbler_pitch: {
    title: 'Fine Merchant Boots',
    description: 'Cobbler shop with hand-stitched leather boots on display shelves. Master cobbler at workbench with tools. Leather quality prominently shown. Craftsmanship and elegance.',
  },
  scribe_ledger: {
    title: 'A Master Ledger',
    description: 'Scribe workshop with ornate leather-bound ledgers and account books. Scribe at desk writing carefully. Shelves of completed ledgers. Order and precision.',
  },
  spice_merchant: {
    title: 'Exotic Spice Gift Set',
    description: 'Spice merchant stall overflowing with colorful exotic spices. Fragrant jars and pouches displayed. Merchant arranging gift sets. Wealth of color and exotic appeal.',
  },
  quillwright: {
    title: 'Fine Writing Quills',
    description: 'Quill shop with displays of finest feather quills in decorative holders. Master quillwright selecting premium plumes. Writing samples displayed. Craftsmanship and precision.',
  },
  silk_merchant: {
    title: 'Silk Handkerchiefs',
    description: 'Silk merchant displaying embroidered handkerchiefs in rich colors. Rolls of fine silk fabric in background. Merchant showing delicate embroidery. Refinement and elegance.',
  },
  cartographer: {
    title: 'A Brass Compass',
    description: 'Cartographer shop with maps, globes, and brass instruments. Antique compass displayed prominently. Cartographer at work drafting routes. Adventure and knowledge.',
  },
  jeweler_pendant: {
    title: 'A Silver Pendant',
    description: 'Jeweler displaying silver pendant with merchant marks etched in metal. Jeweler showing craftsmanship up close. Wealthy clients admiring. Authority and connection.',
  },
  leatherworker: {
    title: 'Fine Leather Gloves',
    description: 'Leatherworker workshop displaying supple merchant gloves. Leatherworker shaping gloves at workbench. Racks of fine leather goods. Quality and skill.',
  },
  perfumer: {
    title: 'Rare Merchant Perfume',
    description: 'Perfumer shop with glass vials of rare scents arranged artfully. Exotic ingredients visible. Perfumer bottling rare essence. Luxury and sophistication.',
  },
}

function buildPrompt(description: string, title: string): string {
  return `Scene: ${description}

Card: "${title}"

Style Guide:
${MASTER_STYLE_GUIDE}

Generate a cohesive fantasy steampunk merchant environment matching this narrative scene.`
}

async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
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

    if (!response.ok) return null

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch {
    return null
  }
}

async function convertToWebP(buffer: Buffer): Promise<Buffer | null> {
  try {
    const sharp = await import('sharp')
    return await sharp.default(buffer).webp({ quality: 80 }).toBuffer()
  } catch {
    return buffer
  }
}

function saveImage(id: string, buffer: Buffer): boolean {
  const outputDir = path.join(__dirname, '../public/backgrounds')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const filepath = path.join(outputDir, `${id}.webp`)
  fs.writeFileSync(filepath, buffer)
  return true
}

function updateMetadata(id: string, title: string): void {
  const metadataPath = path.join(__dirname, '../src/assets/backgrounds/metadata.ts')
  let content = fs.readFileSync(metadataPath, 'utf-8')

  const newEntry = `  '${id}': { id: '${id}', cardId: '${id}', url: '/backgrounds/${id}.webp', alt: '${title}', aspectRatio: 16 / 9 },`

  if (content.includes(`'${id}':`)) return

  const mapEndIdx = content.indexOf('}\n\nexport const BACKGROUND_FALLBACKS')
  if (mapEndIdx !== -1) {
    content = content.slice(0, mapEndIdx) + newEntry + '\n' + content.slice(mapEndIdx)
    fs.writeFileSync(metadataPath, content)
  }
}

function getExistingBackgrounds(): Set<string> {
  const metadataPath = path.join(__dirname, '../src/assets/backgrounds/metadata.ts')
  const content = fs.readFileSync(metadataPath, 'utf-8')
  const matches = [...content.matchAll(/'([a-z_0-9]+)':\s*\{/g)]
  return new Set(matches.map((m) => m[1]))
}

async function main() {
  if (!STABILITY_API_KEY) {
    console.error('❌ STABILITY_API_KEY not set')
    process.exit(1)
  }

  const existing = getExistingBackgrounds()
  const toGenerate = Object.entries(MERCHANT_CARDS).filter(([id]) => !existing.has(id))

  console.log(`\n🛍️  Generating ${toGenerate.length} Merchant Card Backgrounds`)
  console.log('='.repeat(50))

  let success = 0

  for (const [id, { title, description }] of toGenerate) {
    process.stdout.write(`📌 ${id}... `)

    try {
      const prompt = buildPrompt(description, title)
      const buffer = await generateImage(prompt)

      if (!buffer) {
        console.log('❌')
        continue
      }

      const webp = await convertToWebP(buffer)
      if (!webp) {
        console.log('❌')
        continue
      }

      saveImage(id, webp)
      updateMetadata(id, title)
      console.log('✅')
      success++

      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch {
      console.log('❌')
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`✨ Generated ${success}/${toGenerate.length} merchant card backgrounds`)
  console.log(`\n💡 Next: npm run build && npm run dev`)
}

main().catch(console.error)
