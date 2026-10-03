#!/usr/bin/env node

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
Lighting: Atmospheric with lanterns, gas lamps, showing recovery and rebuilding
Art Direction: Rule of thirds composition, clear focal points, showing transformation
Level of Detail: High - intricate textures, ambient objects, environmental storytelling
Mood: Rebuilding, strategic, hopeful yet uncertain, showing progress
Composition: 16:9 aspect ratio, leave headroom for UI card overlay
Quality: Cinematic, immersive, game-ready professional artwork
Avoid: Photographs, 3D renders, anime/manga style, modern elements, focused faces, visible text
`

const RECOVERY_DECK_CARDS: Record<string, { title: string; description: string }> = {
  rebuilding_investor: {
    title: 'A Patient Investor',
    description: 'Wealthy investor meeting with recovering merchant. Negotiation in an elegant room. Capital and opportunity. Trust and partnership forming. Both figures showing determination to rebuild.',
  },
  black_market_contact: {
    title: 'The Black Market Offers',
    description: 'Shadowy underground marketplace. Black market contact approaching merchant in secret meeting. Danger and profit intertwined. Moral choice visible in the atmosphere. Urban underworld setting.',
  },
  skilled_refugee: {
    title: 'A Master Craftsperson',
    description: 'Master craftsperson seeking work, showing their skills. Tools and craftsmanship visible. Merchant assessing their value. Hope and opportunity in a humble setting. Connection being made.',
  },
  political_opportunity: {
    title: 'A Political Rising',
    description: 'Political rising figure negotiating with merchants. Power consolidation visible. City governance transformation. Both figures showing calculation and ambition. Backroom negotiation scene.',
  },
  salvage_opportunity: {
    title: 'Salvage from the Ruins',
    description: 'Ruins of destruction with salvage teams working. Merchants examining salvageable goods. Chaos turned to opportunity. Rebuilt city visible in background. Work and progress shown.',
  },
  knowledge_broker: {
    title: 'Secrets Are Worth Gold',
    description: 'Information broker meeting with merchant. Secrets and intelligence being exchanged. Hushed, tense negotiation. City underworld and networks visible. Knowledge as currency.',
  },
  artisan_collective: {
    title: 'Artisans United',
    description: 'Artisans and craftspeople forming collective. Workshop setting showing various crafts. Unity and strength in numbers. New cooperative being built. Hope for future prosperity.',
  },
  city_relief_effort: {
    title: 'The City Rebuilds',
    description: 'City-wide relief effort coordinated. Multiple groups working together. Rebuilding infrastructure. Merchants contributing to the city. Collective progress and reconstruction.',
  },
  old_guild_faction: {
    title: 'The Old Guard Resists',
    description: 'Old guild faction plotting resistance. Secret meeting of traditionalists. Power and history at stake. Tension between old and new order. Determination to preserve past.',
  },
  debt_collector: {
    title: 'Debts Come Due',
    description: 'Debt collector confronting merchant over owed gold. Difficult negotiation. Past obligations catching up. Tension and financial pressure visible. Merchant facing difficult choices.',
  },
}

function buildPrompt(description: string, title: string): string {
  return `Scene: ${description}

Card: "${title}"

Style Guide:
${MASTER_STYLE_GUIDE}

Generate a cohesive fantasy steampunk recovery phase scene matching this narrative.`
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
  const toGenerate = Object.entries(RECOVERY_DECK_CARDS).filter(([id]) => !existing.has(id))

  console.log(`\n🏗️  Generating ${toGenerate.length} Recovery Deck Backgrounds`)
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
  console.log(`✨ Generated ${success}/${toGenerate.length} recovery deck backgrounds`)
  console.log(`\n💡 Next: npm run build && npm run dev`)
}

main().catch(console.error)
