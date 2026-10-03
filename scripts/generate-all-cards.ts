#!/usr/bin/env node

/**
 * Generate backgrounds for ALL cards in the game that don't have them yet
 * Includes expansion cards, deck cards, and story branches
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

// All card descriptions for comprehensive coverage
const ALL_CARDS: Record<string, { title: string; description: string }> = {
  // Prologue
  prologue: {
    title: 'The Port of Vessarin',
    description: 'Harbor city at dusk with guild towers overlooking merchant docks. Golden lantern-lit atmosphere, sailing ships, bustling waterfront.',
  },
  job_offer: {
    title: 'A Counting-House Job',
    description: 'Interior of busy counting-house. Clerks at desks with ledgers, wooden furniture, candlelit chaos of mercantile record-keeping.',
  },

  // Trading deck - main paths
  salt_caravan_pitch: {
    title: 'A Broker\'s Pitch',
    description: 'Merchant broker in market square presenting business proposal. Wooden trade carts, salt sacks, negotiation in progress.',
  },
  salt_caravan: {
    title: 'The Salt Caravan',
    description: 'Desert trade route with merchant caravan, camels, wagons loaded with salt. Sunset atmosphere, oasis town in distance.',
  },
  salt_caravan_deal: {
    title: 'Salt Caravan Deal',
    description: 'Successful conclusion of salt caravan negotiation. Merchants and traders celebrating agreement, contracts being sealed.',
  },

  iron_claim_pitch: {
    title: 'An Iron Claim',
    description: 'Mining broker in an inn discussing iron mining rights. Medieval tavern setting with tables and oil lamps.',
  },
  iron_mine_collapse: {
    title: 'A Mine Collapses',
    description: 'Underground mining operation in chaos. Wooden mine shafts, lanterns, disaster unfolding in the darkness.',
  },

  tavern_doodad: {
    title: 'A Velvet Cloak',
    description: 'Luxurious tavern interior. Wealthy merchants displaying fine goods, velvet fabrics, steampunk aesthetic.',
  },
  spice_market_rumor: {
    title: 'Market Rumors',
    description: 'Bustling spice market at day. Colorful stalls, merchants haggling, exotic goods piled high, vibrant marketplace energy.',
  },
  gambling_den: {
    title: 'A Game of Chance',
    description: 'Underground gambling den. Dice tables, cloaked figures, smoke-filled basement tavern with dim candlelight.',
  },
  bandit_toll: {
    title: 'A Toll on the Road',
    description: 'Mountain pass road with bandits. Dramatic cliffside merchant route, outlaws stopping trade caravan.',
  },

  // Market day
  sys_market_day: {
    title: 'Market Day',
    description: 'Grand market day in Vessarin. Crowded marketplace with dozens of stalls, merchants, customers trading. Peak commercial activity.',
  },

  // Consequence paths
  consequence_mafia: {
    title: 'The Mafia Calls',
    description: 'Dark alley meeting with criminal organization. Shadowy figures, pressure, extortion schemes in urban underworld.',
  },
  consequence_police: {
    title: 'The Law Catches Up',
    description: 'Merchant arrested by city guard. Dramatic confrontation in marketplace, authority asserting power.',
  },
  consequence_war: {
    title: 'War and Chaos',
    description: 'City at war. Streets in conflict, militia fighting, buildings burning, merchants hiding in chaos.',
  },
  consequence_banking: {
    title: 'Banking Crisis',
    description: 'Financial collapse. Bank runs, panic in streets, crumbling financial institutions, economic devastation.',
  },

  // End game
  final_freedom: {
    title: 'Freedom at Last',
    description: 'Peaceful merchant retirement. Character overlooking successful trading empire from comfortable merchant house, sunset on city.',
  },

  // Additional trading opportunity cards
  moneylenders_offer: {
    title: 'The Moneylender',
    description: 'Moneylender in office offering loans. Ledgers and contracts on desk, stern face, business proposition.',
  },
  tailor_shop: {
    title: 'A Tailor\'s Offer',
    description: 'Fine tailor shop with elegant fabrics and finished garments. Rich clients being fitted for clothes. Sophisticated craftsmanship.',
  },
  prospector_iron: {
    title: 'An Iron Prospector',
    description: 'Rugged prospector in tavern discussing iron mining opportunity. Maps on table, rough characters, speculative venture.',
  },

  // Skill check outcomes (aftermath cards)
  ack_iron_boom: {
    title: 'Iron Market Boom',
    description: 'Iron market flourishing. Miners celebrating, merchants buying, prices rising, economic prosperity.',
  },
  ack_iron_collapse: {
    title: 'Iron Market Collapse',
    description: 'Iron market crashed. Abandoned mines, disappointed miners, worthless stock, economic disaster.',
  },
  ack_market_day: {
    title: 'Market Day Results',
    description: 'Market day aftermath. Traders counting profits or losses, goods being packed, marketplace quieting.',
  },
  ack_spice: {
    title: 'Spice Endeavor',
    description: 'Spice trading conclusion. Merchants with spice goods, negotiation completed, market activity.',
  },
}

function buildPrompt(description: string, title: string): string {
  return `Scene: ${description}

Card: "${title}"

Style Guide:
${MASTER_STYLE_GUIDE}

Generate a cohesive fantasy steampunk environment matching this narrative scene.`
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

    if (!response.ok) {
      const text = await response.text()
      console.error(`    ❌ API Error (${response.status})`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error(`    ❌ Generation failed`)
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

  // Check if already exists
  if (content.includes(`'${id}':`)) {
    return
  }

  // Add to BACKGROUND_MAP before the closing brace
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
  const toGenerate = Object.entries(ALL_CARDS).filter(([id]) => !existing.has(id))

  console.log(`\n🎨 Generating ${toGenerate.length} Card Backgrounds`)
  console.log('='.repeat(50))
  console.log(`Total cards: ${Object.keys(ALL_CARDS).length}`)
  console.log(`Already have: ${existing.size}`)
  console.log(`To generate: ${toGenerate.length}\n`)

  let success = 0
  let skipped = 0

  for (const [id, { title, description }] of toGenerate) {
    process.stdout.write(`📌 ${id}... `)

    try {
      const prompt = buildPrompt(description, title)
      const buffer = await generateImage(prompt)

      if (!buffer) {
        console.log('❌')
        skipped++
        continue
      }

      const webp = await convertToWebP(buffer)
      if (!webp) {
        console.log('❌')
        skipped++
        continue
      }

      saveImage(id, webp)
      updateMetadata(id, title)
      console.log('✅')
      success++

      // Rate limit
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.log('❌')
      skipped++
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`✨ Generated ${success}/${toGenerate.length}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`\n💡 Next: npm run build && npm run dev`)
}

main().catch(console.error)
