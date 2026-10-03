#!/usr/bin/env node

/**
 * Generate 4 generic fallback backgrounds for cards without specific visuals
 * These rotate to provide variety without needing 100+ specific card backgrounds
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

const FALLBACK_SCENES = [
  {
    id: 'fallback_market',
    title: 'Generic Market',
    description: 'A bustling marketplace or trading post in a fantasy steampunk city. Multiple merchants, stalls with goods, people haggling and trading. Diverse composition with many points of interest.',
  },
  {
    id: 'fallback_tavern',
    title: 'Generic Tavern',
    description: 'Interior of a cozy tavern or inn. Wooden beams, tables with patrons, bartender behind counter, fireplace, warm lighting. Atmosphere of commerce and conversation.',
  },
  {
    id: 'fallback_street',
    title: 'Generic Street',
    description: 'A narrow merchant street or alleyway in a fantasy steampunk city. Buildings with shops, gas lamps, people conducting business. Atmospheric urban marketplace setting.',
  },
  {
    id: 'fallback_workshop',
    title: 'Generic Workshop',
    description: 'Interior of a craftsperson\'s workshop or factory. Tools, workbenches, steam pipes, mechanical equipment, workers. Steampunk aesthetic with industrial elements.',
  },
]

function buildPrompt(description: string, title: string): string {
  return `Scene: ${description}

Card: "${title}"

Style Guide:
${MASTER_STYLE_GUIDE}

Generate a cohesive fantasy steampunk environment. This is a generic fallback scene that should feel versatile and reusable for multiple cards.`
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
    console.warn('    ⚠️  sharp not installed, keeping as PNG')
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

function updateMetadata(): void {
  console.log(`  📝 Already registered in metadata.ts`)
}

async function main() {
  if (!STABILITY_API_KEY) {
    console.error('❌ STABILITY_API_KEY not set')
    process.exit(1)
  }

  console.log('\n🎨 Generating 4 Fallback Backgrounds')
  console.log('===================================\n')

  let success = 0

  for (const scene of FALLBACK_SCENES) {
    console.log(`\n📌 ${scene.id}`)
    console.log(`   "${scene.title}"`)

    try {
      const prompt = buildPrompt(scene.description, scene.title)
      const buffer = await generateImage(prompt)

      if (!buffer) continue

      const webp = await convertToWebP(buffer)
      if (!webp) continue

      saveImage(scene.id, webp)
      updateMetadata(scene.id, scene.title)
      success++

      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`  ❌ Failed: ${error}`)
    }
  }

  console.log(`\n✨ Generated ${success}/4 fallback backgrounds`)
}

main().catch(console.error)
