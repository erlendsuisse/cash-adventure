#!/usr/bin/env node

/**
 * Generate backgrounds for recovery phase cards
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
Aesthetic: Fantasy steampunk with Victorian-era merchant architecture, darkened and more complex
Color Palette: Burnt oranges, deep purples, dark teals, gold accents, candlelit shadows
Lighting: Dramatic, showing consequence and recovery - survivor's perspective
Art Direction: Rule of thirds composition, showing transformation and hardship
Level of Detail: High - intricate textures, worn objects, environmental storytelling of a changed world
Mood: Serious, recovering, transformed, strategic
Composition: 16:9 aspect ratio, leave headroom for UI card overlay
Quality: Cinematic, immersive, game-ready professional artwork
Avoid: Photographs, 3D renders, anime/manga style, modern elements, focused faces, visible text
`

const RECOVERY_CARDS: Record<string, { title: string; description: string }> = {
  mafia_notice: {
    title: 'The Underworld Stirs',
    description: 'Dark criminal underworld meeting. Shadowy figures in a dimly-lit tavern back room. Danger and opportunity intertwined. Merchant protagonist surrounded by dangerous men in cloaks and scarves. Atmosphere of power dynamics shifting.',
  },
  refugee_crisis: {
    title: 'Refugees Flood the City',
    description: 'City streets crowded with desperate refugees. Makeshift camps near the harbor. Merchant assessing potential workers. Mix of hardship and opportunity. Urban transformation. Worn, tired faces showing resilience and desperation.',
  },
  wanted_poster: {
    title: 'Your Face on a Wanted Poster',
    description: 'Wanted posters plastered on city walls. Merchant seeing their own face posted. Dark alleys and shadows. Paranoia and fear. Authority presence in the background. Atmospheric tension of being hunted.',
  },
  war_contracts: {
    title: 'The Crown Needs Supplies',
    description: 'Military camp with soldiers and supply wagons. Merchant negotiating with officers. Tents and war materials. Strategic opportunity amid conflict. Power and wealth shifting to those who can supply the war effort.',
  },
  market_collapse: {
    title: 'The Market Transforms',
    description: 'Market square changing and transforming. Old wooden merchant stalls beside new industrial machinery. Clash of old and new. Workers and merchants struggling with change. Dramatic sky showing transformation. Chaos and opportunity.',
  },
  old_mentor_returns: {
    title: 'An Old Mentor Reappears',
    description: 'Reunion scene between merchant and elderly mentor in a quiet study or private room. Books and ledgers visible. Wisdom and experience shown in the mentor figure. Warm candlelight. Moment of connection and learning.',
  },
  ambitious_rival: {
    title: 'Your Rival Strikes',
    description: 'Confrontation between rival merchants. Tension and competition visible. Market or negotiation setting. Power struggle. Both merchants showing determination. Stakes high. Business conflict portrayed dramatically.',
  },
}

function buildPrompt(description: string, title: string): string {
  return `Scene: ${description}

Card: "${title}"

Style Guide:
${MASTER_STYLE_GUIDE}

Generate a cohesive fantasy steampunk recovery/consequence scene matching this narrative.`
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
  const toGenerate = Object.entries(RECOVERY_CARDS).filter(([id]) => !existing.has(id))

  console.log(`\n🏆 Generating ${toGenerate.length} Recovery Phase Backgrounds`)
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
  console.log(`✨ Generated ${success}/${toGenerate.length} recovery phase backgrounds`)
  console.log(`\n💡 Next: npm run build && npm run dev`)
}

main().catch(console.error)
