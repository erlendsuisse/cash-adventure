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

const CHAPTER_4_CARDS = [
  { id: 'ch4_banking_charter', title: 'Royal Banking Charter', description: 'A high-ranking banker offering exclusive access to royal banking privileges', type: 'opportunity', chapter: 4 },
  { id: 'ch4_government_bond_scheme', title: 'Government Bond Scheme', description: 'Financial advisor whispering of guaranteed government bonds backed by crown treasury', type: 'opportunity', chapter: 4 },
  { id: 'ch4_insurance_monopoly', title: 'Insurance Monopoly Opportunity', description: 'Insurance magnate offering partnership to control the merchant insurance market', type: 'opportunity', chapter: 4 },
  { id: 'ch4_banking_collapse', title: 'Banking House Collapses', description: 'Major banking house fails spectacularly, credit freezes, markets panic', type: 'market', chapter: 4 },
  { id: 'ch4_crown_devalues_currency', title: 'Crown Devalues Currency', description: 'Crown secretly devalues currency to pay war debts, inside traders profit', type: 'market', chapter: 4 },
  { id: 'ch4_tax_amnesty', title: 'Royal Tax Amnesty Announced', description: 'Crown announces tax amnesty for the wealthy through political favor', type: 'market', chapter: 4 },
  { id: 'ch4_financial_audit', title: 'Royal Financial Audit', description: 'Crown auditors arrive demanding examination of all merchant finances', type: 'danger', chapter: 4 },
  { id: 'ch4_loan_foreclosure', title: 'Loan Foreclosure Threat', description: 'Creditors demand full payment immediately or seize all assets', type: 'danger', chapter: 4 },
  { id: 'ch4_market_manipulation_caught', title: 'Caught Market Manipulating', description: 'Securities regulators investigate suspicious trading patterns and market manipulation', type: 'danger', chapter: 4 },
]

const CHAPTER_5_CARDS = [
  { id: 'ch5_plague_medicine', title: 'Plague Medicine Monopoly', description: 'Alchemist offering exclusive distribution rights for plague cure ingredients', type: 'opportunity', chapter: 5 },
  { id: 'ch5_infection_prevention', title: 'Infection Prevention Network', description: 'Healer network offering protection from plague corruption for a price', type: 'opportunity', chapter: 5 },
  { id: 'ch5_grave_robbing_artifacts', title: 'Grave Robbing Opportunity', description: 'Gravediggers offering to split profits from artifacts found in mass graves', type: 'opportunity', chapter: 5 },
  { id: 'ch5_plague_spreads', title: 'Plague Spreads Rapidly', description: 'Plague accelerates, half the city infected, society collapses, commerce fails', type: 'market', chapter: 5 },
  { id: 'ch5_quarantine_economy', title: 'Quarantine Zones Form', description: 'Cities partition into quarantine zones, trade forbidden, black market smuggling explodes', type: 'market', chapter: 5 },
  { id: 'ch5_mass_death_discount', title: 'Massive Deflation from Death', description: 'So many deaths that estates flood market, property and goods become absurdly cheap', type: 'market', chapter: 5 },
  { id: 'ch5_infection_risk', title: 'Infection Risk Strikes You', description: 'You fall ill with plague symptoms, fever and weakness threaten your life', type: 'danger', chapter: 5 },
  { id: 'ch5_plague_riot', title: 'Desperate Mob Attacks', description: 'Desperate plague victims attack your storehouse searching for medicine', type: 'danger', chapter: 5 },
  { id: 'ch5_healer_betrayal', title: 'Your Healer Betrays You', description: 'The healer you trusted intentionally spreads plague to your household', type: 'danger', chapter: 5 },
]

const CHAPTER_6_CARDS = [
  { id: 'ch6_intelligence_trade', title: 'Intelligence Trading Network', description: 'Spymaster offering to sell intelligence on your rivals for exclusive access', type: 'opportunity', chapter: 6 },
  { id: 'ch6_conspiracy_network', title: 'Conspiracy Network Partnership', description: 'Conspirators offering a seat at their table to topple governments and profit', type: 'opportunity', chapter: 6 },
  { id: 'ch6_blackmail_operation', title: 'Blackmail Operation', description: 'Criminal offering blackmail operation where secrets are collected and sold', type: 'opportunity', chapter: 6 },
  { id: 'ch6_faction_war', title: 'Faction War Erupts', description: 'Political factions war openly for control, alliances crumble, market chaos ensues', type: 'market', chapter: 6 },
  { id: 'ch6_trust_collapses', title: 'Market Trust Collapses', description: 'Evidence of widespread fraud rocks market, contracts mean nothing', type: 'market', chapter: 6 },
  { id: 'ch6_political_upheaval', title: 'Government Overthrown', description: 'Government falls in a coup, new regime takes power, old alliances become death sentences', type: 'market', chapter: 6 },
  { id: 'ch6_assassination_contract', title: 'Assassination Contract on You', description: 'Someone has hired assassins to kill you, you have one night to prepare', type: 'danger', chapter: 6 },
  { id: 'ch6_trusted_friend_betrays', title: 'Closest Friend Betrays You', description: 'Your oldest trusted friend reveals they have been spying on you the whole time', type: 'danger', chapter: 6 },
  { id: 'ch6_poison_conspiracy', title: 'Poisoning Conspiracy Discovered', description: 'You discover a poisoning conspiracy against you by multiple conspirators', type: 'danger', chapter: 6 },
]

const CHAPTER_7_CARDS = [
  { id: 'ch7_artifact_collection', title: 'Ancient Artifact Collection', description: 'Collector of forbidden artifacts offering access to reality-warping items', type: 'opportunity', chapter: 7 },
  { id: 'ch7_dimensional_trade', title: 'Dimensional Trade Route', description: 'Merchant claiming to traffic goods from alternate dimensions at impossible prices', type: 'opportunity', chapter: 7 },
  { id: 'ch7_consciousness_trade', title: 'Trade in Consciousness Itself', description: 'Transcendent being teaching consciousness trading where minds are currency', type: 'opportunity', chapter: 7 },
  { id: 'ch7_reality_fractures', title: 'Reality Begins to Fracture', description: 'The fabric of reality tears, multiple dimensions bleed into each other', type: 'market', chapter: 7 },
  { id: 'ch7_time_market_chaos', title: 'Time Market Collapses', description: 'Markets exist in multiple time-streams, past and future transactions conflict', type: 'market', chapter: 7 },
  { id: 'ch7_cosmic_event', title: 'Cosmic Event Reshapes Economy', description: 'A cosmic force sweeps through space-time, old economy dead, new emerges', type: 'market', chapter: 7 },
  { id: 'ch7_entity_confrontation', title: 'Ancient Entity Demands Reckoning', description: 'An entity older than civilization confronts you about accumulated power', type: 'danger', chapter: 7 },
  { id: 'ch7_mind_unraveling', title: 'Your Mind Begins to Unravel', description: 'Knowledge breaks your sanity, reality and illusion blur, forbidden truths seen', type: 'danger', chapter: 7 },
  { id: 'ch7_final_choice', title: 'The Final Choice: Ascension or Legacy', description: 'Choose to ascend beyond humanity or return to help your species, cannot do both', type: 'danger', chapter: 7 },
]

function buildPrompt(card) {
  const baseStyle = 'digital art, game card illustration, fantasy medieval setting, professional quality'
  const chapterTheme = getChapterTheme(card.chapter)
  const typeModifier = getTypeModifier(card.type)
  return `${card.title}: ${card.description}. ${chapterTheme}. ${typeModifier}. ${baseStyle}. Cinematic lighting, high detail, 16:9 aspect ratio.`
}

function getChapterTheme(chapter) {
  const themes = {
    4: 'governmental power, grand halls, gold and marble, banking institutions, corruption and privilege',
    5: 'plague and decay, dark forests, sickness, ominous clouds, societal collapse, rotting buildings',
    6: 'betrayal and deception, twisted architecture, mirrors and shadows, espionage, paranoia',
    7: 'cosmic horror, reality breaking, otherworldly, transcendent beings, dimensional rifts, unreality',
  }
  return themes[chapter] || 'fantasy medieval setting'
}

function getTypeModifier(type) {
  const modifiers = {
    opportunity: 'tempting offer, hopeful ambition, character succeeding, profitable moment',
    danger: 'threatening, high stakes, tension, ominous, character in peril',
    market: 'economic chaos, market turmoil, trading activity, bustling action',
  }
  return modifiers[type] || 'dramatic scene'
}

async function generateArtwork(card, outputDir) {
  if (fs.existsSync(path.join(outputDir, `${card.id}.webp`))) {
    console.log(`✓ ${card.id} already has artwork, skipping`)
    return
  }
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
  console.log('🎨 Generating Chapter 4-7 Artwork...\n')
  console.log(`Using Stability.ai API: ${API_URL}`)

  const chapter4Dir = path.join(__dirname, '../src/assets/artwork/chapter4')
  const chapter5Dir = path.join(__dirname, '../src/assets/artwork/chapter5')
  const chapter6Dir = path.join(__dirname, '../src/assets/artwork/chapter6')
  const chapter7Dir = path.join(__dirname, '../src/assets/artwork/chapter7')

  console.log('\n📍 CHAPTER 4: BANKING & FINANCE (9 images)')
  console.log('='.repeat(50))
  for (const card of CHAPTER_4_CARDS) {
    await generateArtwork(card, chapter4Dir)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  console.log('\n📍 CHAPTER 5: PLAGUE & DECAY (9 images)')
  console.log('='.repeat(50))
  for (const card of CHAPTER_5_CARDS) {
    await generateArtwork(card, chapter5Dir)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  console.log('\n📍 CHAPTER 6: BETRAYAL (9 images)')
  console.log('='.repeat(50))
  for (const card of CHAPTER_6_CARDS) {
    await generateArtwork(card, chapter6Dir)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  console.log('\n📍 CHAPTER 7: TRANSCENDENCE (9 images)')
  console.log('='.repeat(50))
  for (const card of CHAPTER_7_CARDS) {
    await generateArtwork(card, chapter7Dir)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  console.log('\n✓ Artwork generation complete!')
  console.log(`Generated 36 images total (Chapters 4-7)`)
  console.log(`Chapter 4 artwork: ${chapter4Dir}`)
  console.log(`Chapter 5 artwork: ${chapter5Dir}`)
  console.log(`Chapter 6 artwork: ${chapter6Dir}`)
  console.log(`Chapter 7 artwork: ${chapter7Dir}`)
}

main().then(() => console.log('\nNext: node scripts/optimize-artwork.mjs (converts new PNGs to WebP)')).catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
