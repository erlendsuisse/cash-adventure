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
Color Palette: Warm golds, earth browns, teal/turquoise accents, candlelit oranges, adventure greens
Lighting: Atmospheric with lanterns, gas lamps, natural sunlight creating dramatic mood
Art Direction: Rule of thirds composition, clear focal points, action and adventure emphasized
Level of Detail: High - intricate textures, ambient objects, environmental storytelling
Mood: Adventurous, thrilling, heroic, mysterious, dangerous, rewarding
Composition: 16:9 aspect ratio, leave headroom for UI card overlay
Quality: Cinematic, immersive, game-ready professional artwork
Avoid: Photographs, 3D renders, anime/manga style, modern elements, focused faces, visible text
`

const ADVENTURE_CARDS: Record<string, { title: string; description: string }> = {
  temple_discovery: {
    title: 'Ancient Temple Discovered',
    description: 'Explorer discovering ancient overgrown temple in jungle. Stone ruins, vines, mysterious architecture. Adventure and danger. Torch light illuminating ancient symbols. Sense of discovery.',
  },
  bandit_encounter: {
    title: 'Bandits on the Road',
    description: 'Dangerous bandits blocking forest road. Scarred leader stepping forward menacingly. Caravan defending itself. Tense confrontation. Weapons drawn. High stakes.',
  },
  mystery_murder: {
    title: 'A Murder in the Guild',
    description: 'Investigation scene in guild hall. Dead merchant, clues scattered, detective examining evidence. Wealthy surroundings. Mystery and intrigue. Candlelit chamber.',
  },
  dragon_sighting: {
    title: 'Dragon Sighting',
    description: 'Dragon flying over mountain village and trade routes. People panicking below. Massive scale. Fire and smoke. Terror and awe. Medieval city below.',
  },
  treasure_map_quest: {
    title: 'A Treasure Map',
    description: 'Drunk sailor showing crumpled treasure map. Tavern setting. X marks the spot on island. Skull symbols. Adventure waiting. Fortune to be found.',
  },
  haunted_house: {
    title: 'A Haunted Manor',
    description: 'Grand abandoned manor on hillside. Mysterious lights in windows. Gothic architecture. Dark clouds overhead. Secrets hidden inside. Spooky but inviting.',
  },
  dragon_rider_ally: {
    title: 'A Dragon Rider',
    description: 'Mysterious rider on black dragon entering city gates. Crowd parting in awe. Dragon magnificent and powerful. Protective. Ally and protection offered.',
  },
  plague_quest: {
    title: 'A Plague Cure',
    description: 'Healer in laboratory working on plague cure. Medical instruments, bottles, research. Desperate patients waiting outside. Hope and science. Life-saving work.',
  },
  ancient_tome: {
    title: 'An Ancient Tome',
    description: 'Elderly scholar displaying ancient book filled with prophecies. Glowing runes and symbols visible. Ancient knowledge. Colossus hints within pages. Wisdom and dread.',
  },
}

function buildPrompt(description: string, title: string): string {
  return `Scene: ${description}

Card: "${title}"

Style Guide:
${MASTER_STYLE_GUIDE}

Generate a cohesive fantasy steampunk adventure scene matching this narrative.`
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
  const toGenerate = Object.entries(ADVENTURE_CARDS).filter(([id]) => !existing.has(id))

  console.log(`\n⚔️  Generating ${toGenerate.length} Adventure Card Backgrounds`)
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
  console.log(`✨ Generated ${success}/${toGenerate.length} adventure card backgrounds`)
  console.log(`\n💡 Next: npm run build && npm run dev`)
}

main().catch(console.error)
