#!/usr/bin/env node

/**
 * Automated background image generation for Cash Adventure
 * Reads story cards, generates prompts, creates images via Stability AI
 * Automatically saves and registers in metadata.ts
 *
 * Usage:
 *   npx ts-node scripts/generate-backgrounds.ts --cards prologue,colossus01_start
 *   npx ts-node scripts/generate-backgrounds.ts --all
 *
 * Requires:
 *   STABILITY_API_KEY environment variable
 *   https://platform.stability.ai/account/billing/overview
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const STABILITY_API_KEY = process.env.STABILITY_API_KEY
const STABILITY_API_URL = `https://api.stability.ai/v2beta/stable-image/generate/ultra`

/**
 * MASTER STYLE GUIDE - Ensures visual consistency across all backgrounds
 * Applied to every generated image for coherent art direction
 */
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

function buildPrompt(sceneDescription: string, cardTitle: string): string {
  return `Scene: ${sceneDescription}

Card: "${cardTitle}"

Style Guide:
${MASTER_STYLE_GUIDE}

Generate a cohesive fantasy steampunk environment that matches the narrative context.`
}

if (!STABILITY_API_KEY) {
  console.error(
    '❌ STABILITY_API_KEY not set. Get one at https://platform.stability.ai/\n' +
      'Set it: export STABILITY_API_KEY="sk-..."'
  )
  process.exit(1)
}

interface CardRef {
  id: string
  title?: string
  body?: string[]
}

interface GenerationOptions {
  cardIds?: string[]
  all?: boolean
  dryRun?: boolean
  outputDir?: string
}

/**
 * Load story cards from campaign
 */
function loadCampaignCards(): Record<string, CardRef> {
  // Complete story card library with scene descriptions for consistent visual generation
  return {
    // Prologue sequence
    prologue: { id: 'prologue', title: 'The Port of Vessarin', body: ['Harbor city of Vessarin at dusk. Guild towers loom over merchant docks. Golden lantern-lit atmosphere with sailing ships and bustling waterfront.'] },

    // Tutorial sequence
    tutorial_goal: { id: 'tutorial_goal', title: 'Understanding Your Goal', body: ['Merchant studying ledger and coin in a study chamber. Golden coins stacked, ledgers open, charts showing profit growth, goal achievement visualized through wealth accumulation and building toward freedom.'] },
    tutorial_sidebar: { id: 'tutorial_sidebar', title: 'Reading Your Status', body: ['Merchant interior study room with visible stat sheet and character dashboard. Detailed stats display (Grit, Savvy, Charm, Nerve) visible on desk, gold counter, financial metrics, atmospheric scholar workspace with candlelit scholarly atmosphere.'] },
    tutorial_choices: { id: 'tutorial_choices', title: 'Making Choices Matter', body: ['Merchant at crossroads facing multiple path options. Branching decisions visualized, two different paths forward, consequence indicators glowing, choice moment with visible outcomes branching left and right, dramatic decision point.'] },
    tutorial_colossi: { id: 'tutorial_colossi', title: 'The Seven Colossi', body: ['Seven towering Colossi looming over merchant district. Ominous monumental figures arranged in sequence, each representing a trial, gothic architectural towers, threatening and majestic, merchant beneath looking up at vast challenges ahead.'] },

    job_offer: { id: 'job_offer', title: 'A Counting-House Job', body: ['Interior of a busy counting-house. Clerks at desks with ledgers, wooden furniture, candlelit chaos of mercantile record-keeping.'] },

    // Trading deck cards
    salt_caravan_pitch: { id: 'salt_caravan_pitch', title: 'A Broker\'s Pitch', body: ['Merchant broker in market square presenting a business proposal. Wooden trade carts and salt sacks visible.'] },
    salt_caravan: { id: 'salt_caravan', title: 'The Salt Caravan', body: ['Desert trade route with merchant caravan, camels, wagons loaded with salt. Sunset atmosphere, oasis town in distance.'] },
    iron_claim_pitch: { id: 'iron_claim_pitch', title: 'An Iron Claim', body: ['Mining broker in an inn, discussing iron mining rights. Medieval tavern setting with tables and oil lamps.'] },
    iron_mine_collapse: { id: 'iron_mine_collapse', title: 'A Mine Collapses', body: ['Underground mining operation in chaos. Wooden mine shafts, lanterns, disaster unfolding in the darkness.'] },
    tavern_doodad: { id: 'tavern_doodad', title: 'A Velvet Cloak', body: ['Luxurious tavern interior. Wealthy merchants displaying fine goods, velvet fabrics, steampunk aesthetic.'] },
    spice_market_rumor: { id: 'spice_market_rumor', title: 'Market Rumors', body: ['Bustling spice market at day. Colorful stalls, merchants haggling, exotic goods piled high, vibrant marketplace energy.'] },
    gambling_den: { id: 'gambling_den', title: 'A Game of Chance', body: ['Underground gambling den. Dice tables, cloaked figures, smoke-filled basement tavern with dim candlelight.'] },
    bandit_toll: { id: 'bandit_toll', title: 'A Toll on the Road', body: ['Mountain pass road with bandits. Dramatic cliffside merchant route, outlaws stopping trade caravan.'] },

    // Investigation cards for Colossi preparation
    investigate_ledger_wyrm: { id: 'investigate_ledger_wyrm', title: 'Warnings of the Auditors', body: ['Old weathered merchant warning about the Ledger-Wyrm threat. Candlelit meeting in marketplace corner, concerned faces, urgent advice about survival through clean books and impeccable records.'] },
    investigate_inquisitor: { id: 'investigate_inquisitor', title: 'Whispers of the Inquisition', body: ['Priestess in temple district offering guidance about the Inquisitor. Spiritual setting with temple architecture, serious conversation about honesty and moral preparation.'] },
    investigate_tide: { id: 'investigate_tide', title: 'The Old Sailor\'s Wisdom', body: ['Ancient sailor in harbor tavern sharing wisdom about the Tide. Weathered mariner at table with drink, explaining diversification strategy and survival through anchored stability.'] },
    investigate_machine: { id: 'investigate_machine', title: 'A Mechanic\'s Warning', body: ['Factory worker approaching with fearful warning about the Machine. Industrial setting with early machines visible, tense conversation about adaptation and staying valuable in automated world.'] },
    investigate_plague: { id: 'investigate_plague', title: 'A Healer\'s Preparation', body: ['Physician offering guidance about plague preparation. Healer\'s workshop with medicine and herbs, discussing survival through community bonds and compassion.'] },
    investigate_betrayal: { id: 'investigate_betrayal', title: 'A Fixer\'s Advice', body: ['Shady underworld figure in shadows offering network knowledge. Dark alley meeting, crime syndicate discussion, learning hidden rules and obligations.'] },
    investigate_mirror: { id: 'investigate_mirror', title: 'A Philosopher\'s Warning', body: ['Philosopher in street offering existential guidance. Thoughtful meeting, discussion of self-knowledge and preparation through introspection and reflection.'] },

    // Colossus encounters
    colossus01_start: { id: 'colossus01_start', title: 'The First Reckoning', body: ['Ledger-Wyrm emerges - a towering amalgamation of gold, ledgers, and scales in a merchant guild hall. Terrifying financial judgment.'] },
    colossus01_outcome: { id: 'colossus01_outcome', title: 'The Reckoning Resolved', body: ['Guild hall aftermath. Wreckage of ledgers and gold, merchant standing victorious amid the chaos.'] },
    colossus02_start: { id: 'colossus02_start', title: 'The Inquisitor Arrives', body: ['The Inquisitor - stern official figure with badge of authority in ornate judgement chamber. Interrogation room with formal power dynamics.'] },
    colossus02_outcome: { id: 'colossus02_outcome', title: 'The Judgment', body: ['Official chambers after judgment. Character walking away from inquisitorial authority, city streets beyond.'] },
    colossus03_start: { id: 'colossus03_start', title: 'The Market Turns', body: ['The Tide - chaotic market during financial storm. Waves of economic chaos crashing through merchant district. Dramatic uncontrollable forces.'] },
    colossus03_outcome: { id: 'colossus03_outcome', title: 'The Tide Recedes', body: ['Market district after the chaos. Merchants recovering, rebuilding stalls, calming waters returning to normal.'] },
    colossus04_start: { id: 'colossus04_start', title: 'The Machine Arrives', body: ['The Machine - mechanical automation arriving in market. Steampunk industrial revolution disrupting trade. Gears, steam, advancement.'] },
    colossus04_outcome: { id: 'colossus04_outcome', title: 'The New Order', body: ['Market district transformed by mechanization. Hybrid old and new, merchants adapting to automated future.'] },
    colossus05_start: { id: 'colossus05_start', title: 'The Plague Arrives', body: ['The Plague - disease spreading through city streets. Sickness and desperation. Merchants closing stalls, people suffering, markets collapsing, survival and compassion tested.'] },
    colossus05_outcome: { id: 'colossus05_outcome', title: 'The Plague Breaks', body: ['City recovering from plague aftermath. Streets returning to life, survivors emerging, merchant rebuilding from crisis, hope and renewal visible.'] },
    colossus06_start: { id: 'colossus06_start', title: 'The Conspiracy Revealed', body: ['The Betrayal - dark syndicate meeting exposed. Underworld figures, letter revealing secrets, moral debts calling in, dangerous obligations becoming real.'] },
    colossus06_outcome: { id: 'colossus06_outcome', title: 'The Reckoning', body: ['After confronting syndicate. Character having survived negotiation, city streets showing merchant renewed, debts partially resolved, freedom partially recovered.'] },
    colossus07_start: { id: 'colossus07_start', title: 'The Mirror Appears', body: ['The Mirror - final Colossus appears as reflection of self. Merchant facing their own image made manifest, all choices echoing back, ultimate self-confrontation and judgment.'] },
    colossus07_outcome: { id: 'colossus07_outcome', title: 'The Final Reckoning', body: ['After Mirror trial. Merchant transformed, looking toward future with eyes open, understanding themselves fully, broken chains of illusion, true freedom achieved.'] },

    // System cards
    sys_market_day: { id: 'sys_market_day', title: 'Market Day', body: ['Grand market day in Vessarin. Crowded marketplace with dozens of stalls, merchants, customers trading. Peak commercial activity.'] },

    // End game
    final_freedom: { id: 'final_freedom', title: 'Freedom at Last', body: ['Peaceful merchant retirement. Character overlooking successful trading empire from comfortable merchant house, sunset on city.'] },
    consequence_mafia: { id: 'consequence_mafia', title: 'The Mafia Calls', body: ['Dark alley meeting with criminal organization. Shadowy figures, pressure, extortion schemes in urban underworld.'] },
    consequence_police: { id: 'consequence_police', title: 'The Law Catches Up', body: ['Merchant arrested by city guard. Dramatic confrontation in marketplace, authority asserting power over merchant.'] },
    consequence_war: { id: 'consequence_war', title: 'War and Chaos', body: ['City at war. Streets in conflict, militia fighting, buildings burning, merchants hiding in chaos and destruction.'] },
    consequence_banking: { id: 'consequence_banking', title: 'Banking Crisis', body: ['Financial collapse. Bank runs, panic in streets, crumbling financial institutions, economic devastation in merchant district.'] },
  }
}

/**
 * Generate an image prompt from card description
 * Uses MASTER_STYLE_GUIDE for consistency
 */
function generatePrompt(card: CardRef): string {
  const description = card.body?.[0] || card.title || card.id
  return buildPrompt(description, card.title || card.id)
}

/**
 * Call Stability AI API to generate image (v2beta endpoint)
 */
async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    console.log(`  🎨 Generating image...`)

    // Use FormData to send multipart form data (not JSON)
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

    // Response is binary image data
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error(`    ❌ Generation failed: ${error}`)
    return null
  }
}

/**
 * Convert PNG to WebP for better compression
 * Requires: npm install sharp
 */
async function convertToWebP(pngBuffer: Buffer): Promise<Buffer | null> {
  try {
    // Dynamic import to make it optional
    const sharp = await import('sharp')
    return await sharp.default(pngBuffer)
      .webp({ quality: 80 })
      .toBuffer()
  } catch {
    console.warn('    ⚠️  sharp not installed, keeping as PNG. Run: npm install sharp')
    return pngBuffer
  }
}

/**
 * Save image to assets directory
 */
function saveImage(cardId: string, imageBuffer: Buffer, extension: string = 'webp'): string {
  const outputDir = path.join(__dirname, '../src/assets/backgrounds/images')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const filename = `${cardId}.${extension}`
  const filepath = path.join(outputDir, filename)
  fs.writeFileSync(filepath, imageBuffer)
  console.log(`  ✅ Saved: ${filepath}`)
  return filepath
}

/**
 * Update metadata.ts with new background entry
 */
function updateMetadata(cardId: string, card: CardRef): void {
  const metadataPath = path.join(__dirname, '../src/assets/backgrounds/metadata.ts')
  let content = fs.readFileSync(metadataPath, 'utf-8')

  const newEntry = `  '${cardId}': {
    id: '${cardId}',
    cardId: '${cardId}',
    url: '/backgrounds/${cardId}.webp',
    alt: '${card.title || 'Story scene'}',
    aspectRatio: 16 / 9,
  },`

  // Insert before the closing brace of BACKGROUND_MAP
  const mapEndIndex = content.indexOf('}\n\n// Pre-defined')
  if (mapEndIndex !== -1) {
    content =
      content.slice(0, mapEndIndex) + newEntry + '\n' + content.slice(mapEndIndex)
    fs.writeFileSync(metadataPath, content)
    console.log(`  📝 Updated metadata.ts`)
  }
}

/**
 * Main generation workflow
 */
async function generateBackgrounds(options: GenerationOptions): Promise<void> {
  console.log('\n🎬 Cash Adventure Background Generator')
  console.log('=====================================\n')

  const cards = loadCampaignCards()
  let targetCards = Object.values(cards)

  if (options.cardIds && options.cardIds.length > 0) {
    targetCards = options.cardIds
      .map((id) => cards[id])
      .filter((c) => c !== undefined)
  }

  if (targetCards.length === 0) {
    console.log('⚠️  No cards to generate. Try:')
    console.log('  npx ts-node scripts/generate-backgrounds.ts -- --cards prologue,colossus01_start')
    return
  }

  console.log(`📋 Generating for ${targetCards.length} card(s)\n`)

  let successCount = 0
  let failureCount = 0

  for (const card of targetCards) {
    console.log(`\n📌 ${card.id}`)
    console.log(`   "${card.title || 'Untitled'}"`)

    if (options.dryRun) {
      console.log(`   🧪 [DRY RUN]`)
      const prompt = generatePrompt(card)
      console.log(`   Prompt: ${prompt.substring(0, 100)}...`)
      continue
    }

    try {
      const prompt = generatePrompt(card)
      const imageBuffer = await generateImage(prompt)

      if (!imageBuffer) {
        failureCount++
        continue
      }

      const webpBuffer = await convertToWebP(imageBuffer)
      if (!webpBuffer) {
        failureCount++
        continue
      }

      saveImage(card.id, webpBuffer)
      updateMetadata(card.id, card)
      successCount++

      // Rate limiting - Stability AI has limits
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`  ❌ Failed: ${error}`)
      failureCount++
    }
  }

  console.log(`\n✨ Generation complete!`)
  console.log(`  ✅ Success: ${successCount}`)
  console.log(`  ❌ Failed: ${failureCount}`)

  if (successCount > 0) {
    console.log(
      `\n💡 Next: Review generated images in src/assets/backgrounds/images/`
    )
    console.log(
      `   Then run: npm run build && npm run dev`
    )
  }
}

// Parse CLI arguments
const args = process.argv.slice(2)

const options: GenerationOptions = {
  dryRun: args.includes('--dry-run'),
  all: args.includes('--all'),
  cardIds: [],
}

// Support both --cards=foo,bar and --cards foo bar
const cardsEqIdx = args.findIndex((a) => a.startsWith('--cards='))
if (cardsEqIdx !== -1) {
  options.cardIds = args[cardsEqIdx].replace('--cards=', '').split(',')
} else {
  const cardsIdx = args.indexOf('--cards')
  if (cardsIdx !== -1 && cardsIdx + 1 < args.length) {
    options.cardIds = args[cardsIdx + 1].split(',')
  }
}

generateBackgrounds(options).catch(console.error)
