#!/usr/bin/env node

/**
 * Generate artwork for expanded Chapter 2-3 cards via Stability.ai
 * Chapter 2: Underworld expansion (19 cards)
 * Chapter 3: Warfare expansion (17 cards)
 */

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const apiKey = process.env.STABILITY_API_KEY
const outputDir = path.join(__dirname, '../public/assets/artwork')

if (!apiKey) {
  console.error('Error: STABILITY_API_KEY environment variable not set')
  process.exit(1)
}

// Chapter 2 (Underworld) - dark, criminal, shadowy, tense
const chapter2Cards = [
  { id: 'ch2_protection_racket_start', prompt: 'Dark shadowy street at night, intimidating figures in silhouettes, money changing hands in darkness, film noir style, criminal underworld aesthetic' },
  { id: 'ch2_gambling_house_invest', prompt: 'Underground gambling den, flickering lights, poker tables, stacks of gold coins and chips, smoke-filled dim room, vintage casino atmosphere' },
  { id: 'ch2_counterfeiting_operation', prompt: 'Secret counterfeiting workshop, printing press machinery, fake currency on tables, dim candlelight, dangerous underground operation, antique printing equipment' },
  { id: 'ch2_brothel_investment', prompt: 'Ornate velvet curtains, dim lantern lighting, luxurious decadent interior, shadowy figures, red and gold colors, vice establishment atmosphere' },
  { id: 'ch2_drug_house_landlord', prompt: 'Dark warehouse, crates and barrels, criminal dealing, dim shadows, dangerous transaction, underworld commerce, noir atmosphere' },
  { id: 'ch2_fence_stolen_goods', prompt: 'Black market trader warehouse, stolen goods piled high, jewels and artifacts, merchant haggling over contraband, shadowy alley vendor stall' },
  { id: 'ch2_racket_extortion', prompt: 'Menacing street gang, protection money collection, intimidation and threat, dark urban alley, criminal power display, film noir' },
  { id: 'ch2_street_hustler_friend', prompt: 'Street urchin and hustler character, urban alley background, rough street life, leather jackets, gritty neighborhood setting' },
  { id: 'ch2_gang_initiation_offer', prompt: 'Gang hideout interior, rough members gathered, initiation ritual, street gang aesthetic, dramatic lighting, urban criminal world' },
  { id: 'ch2_informant_recruitment', prompt: 'Secretive meeting in shadows, whispered conversation, spy-like exchange of information, dark corner meeting, shadowy figures' },
  { id: 'ch2_rival_merchant_cooperation', prompt: 'Two powerful merchant figures negotiating, business deal discussion, tense partnership, underground economy, shadowy business meeting' },
  { id: 'ch2_police_crackdown', prompt: 'Police raid, officers with weapons, criminal being arrested, chaos and emergency, flashing lights, dangerous law enforcement action' },
  { id: 'ch2_supply_drought', prompt: 'Empty warehouse, sparse inventory, economic collapse indicators, abandoned marketplace, scarcity and crisis, desolate commerce' },
  { id: 'ch2_gang_war_opportunity', prompt: 'Two rival gangs facing off, street warfare, territorial conflict, urban violence, dangerous gang confrontation, explosive tension' },
  { id: 'ch2_gang_enforcer_visit', prompt: 'Intimidating gang enforcer in leather and weapons, menacing presence, extortion visit, threatening figure, underworld violence' },
  { id: 'ch2_betrayal_by_partner', prompt: 'Two figures in conflict, betrayal moment, stabbing in the back, dramatic betrayal scene, dark emotional intensity, noir crime drama' },
  { id: 'ch2_witness_to_murder', prompt: 'Dark crime scene, dead body, murder investigation, blood and violence, shocked witness, dramatic crime moment, noir tragedy' },
  { id: 'ch2_kidnapping_threat', prompt: 'Person bound and threatened, kidnapping scenario, hostage situation, rope and restraints, intense danger and fear' },
  { id: 'ch2_safe_house_refuge', prompt: 'Hidden safe house interior, dimly lit shelter, protective sanctuary, safe escape location, underground hideaway, comfort in shadows' },
]

// Chapter 3 (Warfare) - military, conflict, chaos, red and brown tones
const chapter3Cards = [
  { id: 'ch3_weapons_smuggling', prompt: 'Black market weapons dealer, military arms cache, guns and ammunition, secret weapons depot, military contraband, warfare commerce' },
  { id: 'ch3_medical_supplies_smuggle', prompt: 'Military medical tent, bandages and supplies, wounded soldiers being treated, battlefield medicine, red cross symbols, wartime healing' },
  { id: 'ch3_military_food_contract', prompt: 'Military camp mess tent, soldiers eating rations, supply trucks, army logistics, wartime feeding operations, soldier dining' },
  { id: 'ch3_intelligence_selling', prompt: 'Military intelligence room, maps and secrets on table, spies exchanging documents, surveillance equipment, wartime espionage' },
  { id: 'ch3_transport_logistics', prompt: 'Military transport trucks on rough roads, soldiers loading supplies, convoy moving through war zone, logistics operation, wartime movement' },
  { id: 'ch3_soldier_deserter', prompt: 'Young soldier in uniform looking haunted, escape in darkness, fleeing the battlefield, desertion escape, tormented soldier, war trauma' },
  { id: 'ch3_refugee_family_encounter', prompt: 'Family fleeing war, packed belongings, desperate escape, bombed-out city background, refugee crisis, displaced people, humanitarian crisis' },
  { id: 'ch3_officer_proposition', prompt: 'Military officer in uniform, scheming and plotting, hidden meeting, military conspiracy, dangerous officer proposition, war crime planning' },
  { id: 'ch3_battle_witness', prompt: 'Massive battle scene, thousands of soldiers fighting, explosions and chaos, warfare carnage, military conflict intensity, dramatic warfare' },
  { id: 'ch3_armistice_threat', prompt: 'Peace negotiation table, military commanders meeting, treaty discussion, ceasefire negotiation, diplomatic meeting, war ending moment' },
  { id: 'ch3_enemy_territory_trade', prompt: 'Dangerous crossing at night, smuggler crossing enemy lines, border crossing tension, hostile territory, risky wartime trade' },
  { id: 'ch3_inflation_surge', prompt: 'Economic chaos marketplace, inflated prices, currency devaluation, market collapse, economic warfare, financial destruction, worthless money' },
  { id: 'ch3_army_requisition', prompt: 'Soldiers commandeering supplies, military seizure, army taking goods, forced requisition, soldiers with weapons taking property' },
  { id: 'ch3_caught_trading_enemies', prompt: 'Military court martial tribunal, accused traitor, judgment scene, military trial, treason accusation, wartime justice' },
  { id: 'ch3_ambush_on_supply_run', prompt: 'Ambush attack on military convoy, explosions and gunfire, supply trucks under attack, combat chaos, wartime ambush, dangerous supply mission' },
  { id: 'ch3_informant_demands', prompt: 'Spy making threats and blackmail demands, espionage extortion, dangerous informant, threatening conversation, wartime blackmail' },
  { id: 'ch3_neutral_city_escape', prompt: 'Neutral city refuge, peaceful sanctuary away from war, safe harbor, rebuilt city, neutral ground safety, wartime peace' },
]

async function generateImage(cardId, prompt) {
  const filename = `${cardId}.png`
  const filePath = path.join(outputDir, cardId.startsWith('ch2_') ? 'chapter2' : 'chapter3', filename)

  // Check if already exists
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${cardId} already exists`)
    return true
  }

  // Create directory if needed
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  try {
    console.log(`Generating ${cardId}...`)
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
        ],
        cfg_scale: 7,
        clip_guidance_preset: 'FAST_BLUE',
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error(`✗ ${cardId} failed:`, error.message || response.statusText)
      if (error.message?.includes('content_policy_violation')) {
        console.log('  (Content moderation blocked this card)')
      }
      return false
    }

    const data = await response.json()
    if (!data.artifacts || !data.artifacts[0]) {
      console.error(`✗ ${cardId} - no image data returned`)
      return false
    }

    const base64Image = data.artifacts[0].base64
    const buffer = Buffer.from(base64Image, 'base64')
    fs.writeFileSync(filePath, buffer)
    console.log(`✓ ${cardId} generated`)
    return true
  } catch (error) {
    console.error(`✗ ${cardId} error:`, error.message)
    return false
  }
}

async function main() {
  console.log('Generating expanded Chapter 2-3 card artwork...\n')

  let successCount = 0
  let failureCount = 0

  // Generate Chapter 2
  console.log('=== CHAPTER 2: Underworld ===')
  for (const card of chapter2Cards) {
    const success = await generateImage(card.id, card.prompt)
    if (success) successCount++
    else failureCount++
    // Rate limit: 10 requests per second
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log('')

  // Generate Chapter 3
  console.log('=== CHAPTER 3: Warfare ===')
  for (const card of chapter3Cards) {
    const success = await generateImage(card.id, card.prompt)
    if (success) successCount++
    else failureCount++
    // Rate limit: 10 requests per second
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log(`\nDone! Generated: ${successCount}, Failed/Blocked: ${failureCount} (total: ${successCount + failureCount})`)
}

main().catch(console.error)
