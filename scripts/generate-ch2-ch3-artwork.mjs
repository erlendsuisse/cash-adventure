import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const API_KEY = process.env.STABILITY_API_KEY
const API_URL = 'https://api.stability.ai/v2beta/stable-image/generate/core'

if (!API_KEY) {
  console.error('Error: STABILITY_API_KEY environment variable not set')
  process.exit(1)
}

const CHAPTER_2_CARDS = [
  {
    id: 'ch2_spice_smuggling',
    title: 'Underground Spice Network',
    description: 'A smuggler offering a dangerous cut of the spice trade through underground channels, high-margin profits without taxes',
    type: 'opportunity',
    chapter: 2,
  },
  {
    id: 'ch2_salt_black_market',
    title: 'Black Market Salt Supplier',
    description: 'Restricted goods dealer offering partnership on illegal salt distribution for premium prices',
    type: 'opportunity',
    chapter: 2,
  },
  {
    id: 'ch2_iron_theft_fence',
    title: 'Stolen Iron Fence',
    description: 'Criminal offering to sell stolen military-grade iron at a fraction of market price',
    type: 'opportunity',
    chapter: 2,
  },
  {
    id: 'ch2_turf_war_spike',
    title: 'Turf War Erupts',
    description: 'Two criminal syndicates clash over territory, causing market chaos and supply disruptions',
    type: 'market',
    chapter: 2,
  },
  {
    id: 'ch2_protection_racket_squeeze',
    title: 'Protection Money Squeeze',
    description: 'The syndicate demands increased payment for continued protection of your operations',
    type: 'danger',
    chapter: 2,
  },
  {
    id: 'ch2_informant_tip',
    title: 'A Timely Informant Tip',
    description: 'Your criminal informant tips you off about an incoming supply shipment for quick profit',
    type: 'opportunity',
    chapter: 2,
  },
  {
    id: 'ch2_rival_merchant',
    title: 'A Rival Merchant Challenges You',
    description: 'A competing merchant threatens you, demanding payment or a street confrontation',
    type: 'danger',
    chapter: 2,
  },
  {
    id: 'ch2_police_shakedown',
    title: 'Police Shakedown',
    description: 'Corrupt police officers demand an informal tax on your business',
    type: 'danger',
    chapter: 2,
  },
  {
    id: 'ch2_loan_collector',
    title: 'Aggressive Loan Collector',
    description: 'A loan shark collector demands payment with threats of asset seizure',
    type: 'danger',
    chapter: 2,
  },
]

const CHAPTER_3_CARDS = [
  {
    id: 'ch3_war_profiteer_iron',
    title: 'War Profiteering - Iron',
    description: 'Military contractor buying iron at inflated prices for the kingdom\'s war effort',
    type: 'opportunity',
    chapter: 3,
  },
  {
    id: 'ch3_military_supply_contract',
    title: 'Military Supply Contract',
    description: 'A general offering an exclusive contract to supply the army with spice, salt, and iron',
    type: 'opportunity',
    chapter: 3,
  },
  {
    id: 'ch3_refugee_trade',
    title: 'Trading with Refugees',
    description: 'Refugees fleeing war selling their possessions at desperate prices, moral choice between profit and compassion',
    type: 'opportunity',
    chapter: 3,
  },
  {
    id: 'ch3_battle_disrupts_supply',
    title: 'Battle Disrupts Trade Routes',
    description: 'Major battle closes northern trade routes, causing market prices to spike and crash',
    type: 'market',
    chapter: 3,
  },
  {
    id: 'ch3_refugees_flood_market',
    title: 'Refugees Flood the Market',
    description: 'Thousands of refugees sell possessions at rock-bottom prices, flooding commodity markets',
    type: 'market',
    chapter: 3,
  },
  {
    id: 'ch3_military_convoy_raid',
    title: 'Military Convoy Raided',
    description: 'Bandits raid a military supply convoy, causing chaos in the city streets',
    type: 'danger',
    chapter: 3,
  },
  {
    id: 'ch3_conscription_notice',
    title: 'Conscription Notice',
    description: 'The kingdom conscripts able-bodied merchants for military service or demands payment for exemption',
    type: 'danger',
    chapter: 3,
  },
  {
    id: 'ch3_soldier_demands_goods',
    title: 'Soldiers Demand Tribute',
    description: 'Military contingent arrives demanding supplies or threatening to take them by force',
    type: 'danger',
    chapter: 3,
  },
  {
    id: 'ch3_spy_recruitment',
    title: 'Spies Approach You',
    description: 'Government agent recruiting you as a spy to report on merchants, with threats if you refuse',
    type: 'danger',
    chapter: 3,
  },
]

function buildPrompt(card) {
  const baseStyle = 'digital art, game card illustration, fantasy medieval setting, professional quality'
  const chapterTheme = getChapterTheme(card.chapter)
  const typeModifier = getTypeModifier(card.type)

  return `${card.title}: ${card.description}. ${chapterTheme}. ${typeModifier}. ${baseStyle}. Cinematic lighting, high detail, 16:9 aspect ratio.`
}

function getChapterTheme(chapter) {
  const themes = {
    2: 'criminal underworld, dark shadowy alleyways, dim lantern light, narrow streets, dangerous atmosphere, cloaked figures, brick and stone',
    3: 'dangerous warfare, battlefields in chaos, red and grey color palette, soldiers marching, fortifications, smoke and fire, military camps',
  }
  return themes[chapter] || 'fantasy medieval setting'
}

function getTypeModifier(type) {
  const modifiers = {
    opportunity: 'tempting offer, hopeful ambition, character succeeding, profitable moment',
    danger: 'threatening, high stakes, tension, ominous, character in peril',
    story: 'dramatic narrative moment, character interaction, intense storytelling',
    market: 'economic chaos, market turmoil, trading activity, bustling action',
  }
  return modifiers[type] || 'dramatic scene'
}

async function generateArtwork(card, outputDir) {
  const prompt = buildPrompt(card)
  console.log(`\n🎨 Generating: ${card.title}`)

  try {
    const formData = new FormData()
    formData.append('prompt', prompt)
    formData.append('output_format', 'png')
    formData.append('aspect_ratio', '16:9')

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'image/*',
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API error: ${response.status} - ${error}`)
    }

    const buffer = await response.arrayBuffer()
    const outputPath = path.join(outputDir, `${card.id}.png`)

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, Buffer.from(buffer))
    console.log(`✓ Saved to ${outputPath}`)
  } catch (error) {
    console.error(`✗ Failed to generate ${card.id}:`, error.message)
    throw error
  }
}

async function main() {
  console.log('🎨 Generating Chapter 2 & 3 Artwork...\n')
  console.log(`Using Stability.ai API: ${API_URL}`)

  const chapter2Dir = path.join(__dirname, '../src/assets/artwork/chapter2')
  const chapter3Dir = path.join(__dirname, '../src/assets/artwork/chapter3')

  console.log('\n📍 CHAPTER 2: UNDERWORLD (9 cards)')
  console.log('='.repeat(50))
  for (const card of CHAPTER_2_CARDS) {
    await generateArtwork(card, chapter2Dir)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  console.log('\n📍 CHAPTER 3: WARFARE (9 cards)')
  console.log('='.repeat(50))
  for (const card of CHAPTER_3_CARDS) {
    await generateArtwork(card, chapter3Dir)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  console.log('\n✓ Artwork generation complete!')
  console.log(`Generated 18 images total`)
  console.log(`Chapter 2 artwork: ${chapter2Dir}`)
  console.log(`Chapter 3 artwork: ${chapter3Dir}`)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
