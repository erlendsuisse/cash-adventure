#!/usr/bin/env node
// Generates card artwork via Stability (SDXL) for any card listed in PROMPTS
// that doesn't have src/assets/artwork/chapter{N}/{id}.webp yet, then run
// `node scripts/optimize-artwork.mjs` to convert the PNGs.
//
// Usage: STABILITY_API_KEY=... node scripts/generate-card-artwork.mjs
//
// Prompt rules that keep moderation happy: show the setting, objects and
// aftermath - never violence, bodies, drugs, restraints or crime in progress.
// Words like "ransom" get flagged even in innocent prompts.
// Flagged requests are refused and not charged.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outRoot = path.join(root, 'src/assets/artwork')
const apiKey = process.env.STABILITY_API_KEY
if (!apiKey) {
  console.error('STABILITY_API_KEY is not set')
  process.exit(1)
}

const STYLE = 'detailed painterly illustration, medieval fantasy merchant world, rich colour, cinematic lighting'

/** [chapter, cardId, prompt] */
const PROMPTS = [
  // Chapter 2 - trader's ladder
  [2, 'ch2_market_stall_lease', 'A cosy night market stall under a striped awning, hanging lanterns, bolts of woven cloth, a cashbox on the counter, bustling medieval port street at night'],
  [2, 'ch2_porter_crew', 'A crew of sturdy dock porters with handcarts and coiled ropes on a busy medieval harbour quay at dawn, crates and barrels, tall ships behind'],
  [2, 'ch2_spice_kiosk_chain', 'A small wooden tea kiosk with steaming copper kettles and jars of spices on a lantern-lit street corner at night, customers warming their hands'],
  [2, 'ch2_harbour_warehouse_syndicate', 'A row of grand stone harbour warehouses with tall arched doors, cranes hoisting cargo, a merchant with a ledger surveying them at golden hour'],
  // Chapter 2 - intro deck
  [2, 'mob_protection_offer', 'An elegant figure in an expensive dark coat in a quiet tavern corner, offering a handshake across a candlelit table, smoky noir atmosphere'],
  [2, 'criminal_informant', 'A hooded informant whispering beside a merchant in a narrow alley, a small purse changing hands, lantern light, rain-slicked cobbles'],
  [2, 'stolen_goods_fence', 'A cramped back room crowded with mismatched treasures, candlesticks, paintings and chests, a sly dealer behind a counter, flickering candles'],
  [2, 'loan_shark_capital', 'A cold counting room with a heavy iron strongbox, stacks of coins and a stern moneylender writing in a ledger, harsh single lamp'],
  [2, 'smuggler_partnership', 'A sleek fast sailing boat moored in a hidden cove at dusk, crates being unloaded onto the beach by lantern light'],
  // Chapter 3 - trader's ladder
  [3, 'ch3_sutlers_wagon', 'A covered sutler wagon full of goods following a marching army column along a country road, soldiers buying small comforts'],
  [3, 'ch3_linen_supply', 'Two wooden looms in a sunlit workshop weaving white linen, stacks of folded bandage cloth ready for a field hospital'],
  [3, 'ch3_remount_contract', 'A green horse farm with paddocks of cavalry horses, a horse trader and a quartermaster shaking hands by the fence'],
  [3, 'ch3_royal_victualling_charter', 'A lavish candlelit banquet in a war tent, a royal charter with a wax seal on the table, an army quartermaster raising a glass'],
  // Chapter 3 - intro deck
  [3, 'syndicate_muscle', 'Two imposing well-dressed guards standing at the door of a merchant house at night, lanterns, an air of quiet menace'],
  [3, 'black_market_supplier', 'A hidden underground market in a torchlit cellar, stalls of unlabelled crates and sealed jars, cloaked buyers'],
  [3, 'crime_boss_lieutenant', 'An opulent private study with a grand desk, a powerful figure in silhouette before a fireplace, an empty chair waiting'],
  [3, 'counterfeiter_partnership', 'A secretive engraver at a workbench examining a gleaming coin with a loupe, tools and metal blanks, candlelight'],
  // Chapter 4 - trader's ladder
  [4, 'ch4_money_changer_booth', 'A money changer booth on grand stone steps, brass scales and touchstones, coins of many nations in neat stacks, travellers queueing'],
  [4, 'ch4_bills_courier', 'A courier on horseback galloping along a country road with a leather satchel of sealed letters, dawn light'],
  [4, 'ch4_merchant_credit_union', 'A modest wooden counting house full of small traders depositing coins, a clerk recording in a large ledger, warm lamplight'],
  [4, 'ch4_letters_of_credit_house', 'A magnificent marble banking hall with clerks at long desks, a letter of credit with a large red seal in the foreground'],
  // Chapter 4 - intro deck
  [4, 'assassin_contract_broker', 'A dim private room with a single candle, a sealed envelope and a pile of gold coins on a dark wooden table, ominous mood'],
  [4, 'human_trafficking_opportunity', 'A dark empty harbour pier at night, an empty ship hold lit by one lantern, a merchant turning away, sombre ominous mood'],
  [4, 'drug_empire_partnership', 'A shadowy apothecary storeroom with shelves of unlabelled glass bottles and dried poppies, a cloaked figure counting coins'],
  // Chapter 5 - trader's ladder
  [5, 'ch5_herb_garden_plots', 'Lush herb garden plots outside old city walls, rows of sage and feverfew, a gardener with a basket, misty morning'],
  [5, 'ch5_bread_deliveries', 'A bread cart with fresh loaves left at the gate of a quiet sealed street, townsfolk waving from upper windows'],
  [5, 'ch5_vinegar_lime_works', 'A busy distillery converted to vinegar works, large copper vats, barrels and sacks of lime, workers in aprons'],
  [5, 'ch5_physicians_underwriting', 'A merchant with a lantern and a ledger walking through a calm candlelit hospital ward with physicians in long robes'],
  // Chapter 5 - intro deck
  [5, 'government_corruption', 'A city official in fine robes sliding a sealed permit across a polished desk, a velvet purse beside it, candlelit office'],
  [5, 'escape_boat', 'A small ship waiting at a foggy dock at night, a captain holding a lantern, a single trunk on the gangplank'],
  // Chapter 6 - trader's ladder
  [6, 'ch6_pigeon_loft', 'A rooftop pigeon loft over a medieval city, homing pigeons with small message tubes, a keeper releasing a bird at sunrise'],
  [6, 'ch6_sealed_ledger_notary', 'A notary office with two ledgers bound in wax seals on a desk, a quill and stamp, two rival merchants seated apart'],
  [6, 'ch6_bonded_escrow_warehouse', 'A guarded bonded warehouse with iron-bound doors, tagged crates on both sides of a dividing rail, clerks checking manifests'],
  [6, 'ch6_neutral_exchange', 'A grand trading floor under a glass dome, merchants of rival factions in different colours trading, a chair on a dais above them'],
  // Chapter 6 - remaining deck
  [6, 'ch6_assassination_contract', 'A merchant at a candlelit window at night, shutters half closed, the long shadow of a stranger on the wall, tense waiting'],
  [6, 'ch6_trusted_friend_betrays', 'Two old friends at a table, one quietly sliding a stack of secret letters to a stranger in the background, betrayal mood'],
  [6, 'ch6_poison_conspiracy', 'An ornate goblet of wine on a banquet table, cloaked figures whispering in the shadows behind, suspicious candlelight'],
  // Chapter 7 - trader's ladder
  [7, 'ch7_star_chart_almanacs', 'A printing workshop with freshly printed star charts showing strange new constellations, an astronomer with a brass telescope'],
  [7, 'ch7_dreamweaver_looms', 'A loom weaving shimmering cloth that glows with dreamlike images, a weaver in a moonlit attic, magical atmosphere'],
  [7, 'ch7_tidewell_of_moments', 'An ancient stone well in an old quarter overflowing with glowing hourglass sand and floating clock faces at high tide'],
  [7, 'ch7_exchange_between_worlds', 'A merchant standing in a glowing rift in the sky bartering with tall serene otherworldly traders, floating market stalls'],
  // Chapter 7 - remaining deck
  [7, 'ch7_artifact_collection', 'A collector cabinet of strange glowing artifacts, crystal orbs and impossible geometric objects, candlelit study'],
  [7, 'ch7_dimensional_trade', 'A caravan emerging from a shimmering portal onto a desert trade road, goods from another world on its wagons'],
  [7, 'ch7_consciousness_trade', 'A luminous ethereal being offering a glowing orb of thought to a merchant in a starlit temple'],
  [7, 'ch7_reality_fractures', 'A medieval city street splitting into shards of different worlds and skies, merchants staring in awe'],
  [7, 'ch7_time_market_chaos', 'A marketplace where clocks melt and merchants appear in several ages at once, swirling golden light'],
  [7, 'ch7_cosmic_event', 'A vast cosmic aurora sweeping over a merchant city, the whole sky changing colour, people on rooftops watching'],
  [7, 'ch7_entity_confrontation', 'An immense ancient stone figure with glowing eyes looming over a lone merchant in a ruined temple'],
  [7, 'ch7_mind_unraveling', 'A merchant at a desk surrounded by swirling papers and dissolving surreal patterns, fractured mirror reflections'],
  [7, 'ch7_final_choice', 'A lone merchant standing before a tall ornate mirror showing three different glowing futures, mystical hall'],
]

async function generate(chapter, id, prompt) {
  const dir = path.join(outRoot, `chapter${chapter}`)
  if (fs.existsSync(path.join(dir, `${id}.webp`)) || fs.existsSync(path.join(dir, `${id}.png`))) return 'skipped'
  const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ text_prompts: [{ text: `${prompt}, ${STYLE}`, weight: 1 }], cfg_scale: 7, height: 1024, width: 1024, samples: 1, steps: 30 }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    return `failed: ${error.message ?? response.statusText}`
  }
  const artifact = (await response.json()).artifacts?.[0]
  if (!artifact) return 'failed: no image returned'
  // A filtered prompt can still come back 200 with a blurred image - don't keep it.
  if (artifact.finishReason === 'CONTENT_FILTERED') return 'failed: content filter (blurred result discarded)'
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, `${id}.png`), Buffer.from(artifact.base64, 'base64'))
  return 'generated'
}

const results = { generated: 0, skipped: 0, failed: 0 }
for (const [chapter, id, prompt] of PROMPTS) {
  const result = await generate(chapter, id, prompt)
  results[result.startsWith('failed') ? 'failed' : result]++
  if (result !== 'skipped') console.log(`${result === 'generated' ? '✓' : '✗'} ch${chapter} ${id}${result === 'generated' ? '' : ` - ${result}`}`)
}
console.log(`\nGenerated ${results.generated}, skipped ${results.skipped}, failed ${results.failed}`)
if (results.generated) console.log('Next: node scripts/optimize-artwork.mjs')
