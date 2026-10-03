import * as fs from 'fs'
import * as path from 'path'
import fetch from 'node-fetch'

const API_KEY = process.env.STABILITY_API_KEY
const API_URL = 'https://api.stability.ai/v2beta/stable-image/generate/core'

if (!API_KEY) {
  console.error('Error: STABILITY_API_KEY environment variable not set')
  process.exit(1)
}

interface CardMetadata {
  id: string
  title: string
  description: string
  type: 'opportunity' | 'danger' | 'story' | 'colossus' | 'recovery'
  chapter: number
  style?: string
}

async function generateArtwork(card: CardMetadata, outputDir: string): Promise<void> {
  if (fs.existsSync(path.join(outputDir, `${card.id}.webp`))) {
    console.log(`✓ ${card.id} already has artwork, skipping`)
    return
  }
  const prompt = buildPrompt(card)
  console.log(`Generating artwork for ${card.id}...`)
  console.log(`Prompt: ${prompt}`)

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
      body: formData as any,
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
    console.error(`✗ Failed to generate ${card.id}:`, error)
    throw error
  }
}

function buildPrompt(card: CardMetadata): string {
  const baseStyle = 'digital art, game card illustration, fantasy medieval setting'
  const chapterTheme = getChapterTheme(card.chapter)
  const typeModifier = getTypeModifier(card.type)

  return `${card.title}: ${card.description}. ${chapterTheme}. ${typeModifier}. ${baseStyle}. High quality, 16:9 aspect ratio, detailed, atmospheric lighting.`
}

function getChapterTheme(chapter: number): string {
  const themes: Record<number, string> = {
    1: 'merchant city streets, market stalls, trading post aesthetic, warm earth tones',
    2: 'criminal underworld, shadowy alleyways, dim lantern light, dark atmosphere',
    3: 'dangerous warfare, battlefields, chaos, red and grey tones',
    4: 'corruption and power, grand halls, gold and marble, governmental buildings',
    5: 'plague and decay, sickness, dark forests, ominous clouds',
    6: 'betrayal and deception, twisted architecture, mirrors and shadows',
    7: 'transcendent horror, cosmic elements, reality breaking, otherworldly',
  }
  return themes[chapter] || 'fantasy medieval setting'
}

function getTypeModifier(type: string): string {
  const modifiers: Record<string, string> = {
    opportunity: 'hopeful, opportunity-focused, character achieving success',
    danger: 'dangerous, threatening, high stakes, tension',
    story: 'narrative moment, character interaction, drama',
    colossus: 'epic boss battle, massive creature, heroic confrontation',
    recovery: 'healing, recovery, peaceful, resolution',
  }
  return modifiers[type] || 'dramatic scene'
}

async function main() {
  const chapter = parseInt(process.argv[2] || '1')
  const outputDir = path.join(process.cwd(), 'src/assets/artwork', `chapter${chapter}`)

  // Example cards to generate - replace with real card metadata
  const sampleCards: CardMetadata[] = [
    {
      id: 'merchant_gambit',
      title: 'Merchant Gambit',
      description: 'A seasoned merchant with a proposition, rare goods and profitable trades await',
      type: 'opportunity',
      chapter,
    },
    {
      id: 'petty_theft',
      title: 'Petty Theft',
      description: 'A street thief steals from your merchant stand, costing you dearly',
      type: 'danger',
      chapter,
    },
  ]

  console.log(`Generating artwork for Chapter ${chapter}...`)
  for (const card of sampleCards) {
    await generateArtwork(card, outputDir)
  }
  console.log('✓ Artwork generation complete')
}

main().then(() => console.log('\nNext: node scripts/optimize-artwork.mjs (converts new PNGs to WebP)')).catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
