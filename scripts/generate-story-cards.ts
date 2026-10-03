#!/usr/bin/env node

/**
 * Generate backgrounds for all story expansion cards
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

const STORY_CARDS: Record<string, { title: string; description: string }> = {
  // Captain Vex storyline
  captain_vex_intro: {
    title: 'Captain Vex at the Harbor',
    description: 'Grizzled smuggler captain at the docks with cargo ships. Weathered sailor with sharp eyes. Harbor bustling with activity, ropes and crates, sea breeze. Dangerous but charming.',
  },
  captain_vex_heist: {
    title: 'A Risky Cargo Run',
    description: 'Tense cargo smuggling scene. Merchants with wrapped goods, city guard checkpoints in distance. Dark alleys, tension in the air. Risk and reward hanging in balance.',
  },
  vex_heist_success: {
    title: 'Partnership Forged',
    description: 'Victorious meeting between merchant and captain. Celebrating successful trade. Mutual respect established. Trust and partnership forming.',
  },
  vex_heist_failure: {
    title: 'Failed Cargo',
    description: 'Failed cargo run aftermath. Disappointed faces, lost goods. Market aftermath of failed venture. Lessons learned.',
  },

  // Lord Aldric quest
  lord_aldric_intro: {
    title: 'A Noble\'s Dilemma',
    description: 'Noble merchant in guild hall offering payment. Ledgers on table, private conversation. Wealth and power displayed. Temptation and intrigue.',
  },
  aldric_investigation: {
    title: 'Following the Trail',
    description: 'Detective work in markets and shops. Merchants being questioned, documents reviewed. Investigation and discovery. Truth-seeking.',
  },
  aldric_honest_ending: {
    title: 'Truth and Respect',
    description: 'Honest resolution. Noble merchant respecting your integrity. Business built on trust. Reputation improvement.',
  },
  aldric_lie_ending: {
    title: 'Convenient Lies',
    description: 'Deceptive resolution. Gold exchanged for false information. Moral weight visible. Easy profit with hidden cost.',
  },

  // Hidden encounters
  scholar_sage: {
    title: 'A Merchant Scholar\'s Secret',
    description: 'Scholarly merchant in private study surrounded by market analysis documents. Knowledge is wealth. Academic merchant at desk with charts and predictions.',
  },
  nerve_master: {
    title: 'The Confidence Game',
    description: 'High-stakes card game in elegant room. Wealthy gamblers at tables with chips and cards. Confidence on display. Risk and nerve required.',
  },

  // Moral dilemmas
  the_orphanage: {
    title: 'Children in Need',
    description: 'Orphanage interior with children and nun caretaker. Humble setting, poverty evident, hope in childrens eyes. Charity and compassion.',
  },
  corrupt_guard: {
    title: 'A Guard\'s Temptation',
    description: 'Corrupt guard in shadowy meeting. Bribery and extortion being proposed. Power and corruption. Moral crossroads.',
  },

  // Locations
  dockside_tavern: {
    title: 'The Anchor & Coin',
    description: 'Bustling tavern full of sailors and merchants. Dark wood, dimly lit, crowded tables. Back room visible. Opportunity and danger mixed.',
  },

  // Romance
  elegant_merchant: {
    title: 'A Charming Rival',
    description: 'Elegant merchant at market assembly. Attractive, confident, witty. Eye contact across crowded space. Attraction and competition.',
  },
  morgan_romance_night: {
    title: 'A Night With Morgan',
    description: 'Fine dining with elegant merchant. Candlelit dinner, fine wine and food. Romance and ambition intertwined. Future possibilities.',
  },

  // Seasonal
  winter_festival: {
    title: 'The Winter Festival',
    description: 'Winter market transformation. Festival decorations, rare goods, merchants celebrating. Snow and festive lights. Excess and opportunity.',
  },

  // Story expansion 2
  master_trader: {
    title: 'The Master\'s Lesson',
    description: 'Elderly master merchant offering wisdom. Decades of experience evident. Guild hall setting. Mentorship opportunity.',
  },
  mentor_wisdom: {
    title: 'Mentor\'s Wisdom',
    description: 'Study sessions with mentor. Learning and growth displayed. Books and ledgers. Transformation through guidance.',
  },
  childhood_friend: {
    title: 'A Face from the Past',
    description: 'Reunion in market with childhood friend. Recognition and emotion. Nostalgia mixed with present. History meeting present.',
  },
  friend_crisis: {
    title: 'A Friend in Trouble',
    description: 'Desperate friend seeking help. Distress and shame visible. Personal crisis moment. Loyalty being tested.',
  },
  ruthless_competitor: {
    title: 'A Ruthless Rival Emerges',
    description: 'Aggressive new merchant entering market. Undercutting prices, dominance displayed. Market battle beginning. Threat assessment.',
  },
  rival_showdown: {
    title: 'Competition Heats Up',
    description: 'Market price war in full swing. Both merchants competing fiercely. Negotiation tables and ledgers. Victory approaching.',
  },
  theft_offer: {
    title: 'A Tempting Crime',
    description: 'Shadowy figure proposing theft. Dark alley meeting. Crime being contemplated. Moral crossroads. Temptation.',
  },
  plague_outbreak: {
    title: 'Sickness Spreads',
    description: 'Illness spreading through poor quarters. Healer working, sick people in humble homes. Crisis and compassion. Life and death.',
  },
  guild_leadership: {
    title: 'A Seat on the Council',
    description: 'Guild council chamber with high-ranking merchants. Power and prestige on display. Important negotiation. Leadership opportunity.',
  },
  fortune_teller: {
    title: 'The Seer\'s Reading',
    description: 'Fortune teller with cards and mysterious atmosphere. Candlelit chamber. Fate and prophecy. Wisdom or superstition.',
  },
  presage_ledger_wyrm: {
    title: 'Disturbing Omens',
    description: 'Strange phenomena in merchant district. Missing ledgers, impossible breaches. Ominous atmosphere building. Warning signs.',
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
  const toGenerate = Object.entries(STORY_CARDS).filter(([id]) => !existing.has(id))

  console.log(`\n🎭 Generating ${toGenerate.length} Story Card Backgrounds`)
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
  console.log(`✨ Generated ${success}/${toGenerate.length} story card backgrounds`)
  console.log(`\n💡 Next: npm run build && npm run dev`)
}

main().catch(console.error)
