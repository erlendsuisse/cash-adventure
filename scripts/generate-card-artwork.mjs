#!/usr/bin/env node
// Generates card artwork via Stability for cards listed in PROMPTS, in the same
// hand-painted fantasy-cartoon style and 16:9 framing as the Chapter 1
// backgrounds (artwork fills the screen behind the card). Then run
// `node scripts/optimize-artwork.mjs` to convert the PNGs.
//
// Usage: STABILITY_API_KEY=... node scripts/generate-card-artwork.mjs [options]
//   --chapter N       only cards in chapter N
//   --only a,b        only these card ids
//   --force           regenerate even if the card already has art
//   --model core|ultra  Stable Image model (default core; ultra costs ~2.5x)
//
// Prompt rules that keep moderation happy - and the tone friendly: show the
// setting, objects and aftermath; never violence, bodies, fire, weapons in use,
// drugs or restraints. Words like "ransom" get flagged even in innocent prompts.
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

// Condensed from the Chapter 1 master style guide (scripts/generate-backgrounds.ts).
const STYLE =
  'detailed hand-painted cartoon game art, whimsical fantasy merchant world with Victorian steampunk touches, ' +
  'warm golds, earth browns and teal accents, lantern and sunlight glow, lively and adventurous mood, cinematic 16:9 composition'
const NEGATIVE =
  'photograph, photorealistic, 3D render, anime, grayscale, sepia engraving, modern clothing, modern military uniforms, helmets, ' +
  'guns, rifles, explosions, fire, smoke, blood, gore, corpses, violence, paper money, banknotes, dollar bills, text, watermark, blurry'

const args = process.argv.slice(2)
const arg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined }
const onlyChapter = arg('--chapter') ? Number(arg('--chapter')) : undefined
const onlyIds = arg('--only')?.split(',')
const force = args.includes('--force')
const model = arg('--model') ?? 'core'

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
  // Chapter 3 - war, as a storybook: camps, wagons, markets and quartermasters, never combat (regenerated 2026-10-04)
  [3, 'syndicate_muscle', 'Two burly but friendly-looking bodyguards in long coats standing either side of a merchant house door at dusk, lanterns glowing'],
  [3, 'black_market_supplier', 'A cosy hidden cellar market lit by lanterns, stalls of unlabelled crates and curious bottles, cloaked shoppers browsing'],
  [3, 'crime_boss_lieutenant', 'A plush private study with a big oak desk and a crackling fireplace, a portly boss in a fine waistcoat gesturing to an empty chair'],
  [3, 'counterfeiter_partnership', 'A cluttered engraver workshop, a bespectacled craftsman inspecting a shiny gold coin under a magnifier, tools and candle'],
  [3, 'ch3_war_profiteer_iron', 'A bustling forge yard stacked with iron ingots and horseshoes, a quartermaster in a plumed hat haggling with the merchant'],
  [3, 'ch3_military_supply_contract', 'A grand general with a magnificent moustache in a colourful tent, unrolling a supply contract on a map table, crates of salt and spice outside'],
  [3, 'ch3_refugee_trade', 'Travellers with carts of household goods at a town gate market, a merchant weighing their wares, hopeful faces, soft morning light'],
  [3, 'ch3_battle_disrupts_supply', 'A trade road blocked by a fallen bridge in green hills, banners on a distant ridge, a merchant caravan waiting with worried drivers'],
  [3, 'ch3_refugees_flood_market', 'A crowded colourful market square full of travellers selling pots, rugs and furniture, merchants bargaining under bunting'],
  [3, 'ch3_military_convoy_raid', 'Overturned supply cart outside a merchant warehouse, scattered apples and crates, guards running down the street, comic chaos'],
  [3, 'ch3_conscription_notice', 'A town crier on a barrel reading a royal proclamation to a crowd of surprised merchants in a sunny square, banners'],
  [3, 'ch3_soldier_demands_goods', 'A cheerful but pushy squad of soldiers in bright tabards at a shop counter pointing at sacks of flour, a frowning shopkeeper'],
  [3, 'ch3_spy_recruitment', 'A mysterious figure in a wide-brimmed hat whispering to a merchant in a lantern-lit tavern booth, folded note on the table'],
  [3, 'ch3_weapons_smuggling', 'Long wooden crates being loaded onto a barge at a misty river dock at night, lanterns, a lookout on the pier'],
  [3, 'ch3_medical_supplies_smuggle', 'A healer stacking bundles of herbs and clean bandages onto a small cart behind an apothecary shop, warm lamplight'],
  [3, 'ch3_military_food_contract', 'A busy army field kitchen with huge cooking pots, bread loaves and barrels, cooks in aprons and a quartermaster with a ledger'],
  [3, 'ch3_intelligence_selling', 'A merchant passing a sealed letter to a hooded courier in a quiet library corner, candles and tall bookshelves'],
  [3, 'ch3_transport_logistics', 'A long line of ox wagons with colourful canvas covers rolling along a country road between army camps, sunny sky'],
  [3, 'ch3_soldier_deserter', 'A tired young soldier in a muddy cloak knocking at a warehouse back door at night, a lantern in the window, quiet street'],
  [3, 'ch3_refugee_family_encounter', 'A family with a handcart and a little dog at a merchant doorway in the rain, the merchant holding the door open, warm light inside'],
  [3, 'ch3_officer_proposition', 'A sly officer with a curled moustache in a candlelit tent offering a sealed letter across a map table, conspiratorial grin'],
  [3, 'ch3_battle_witness', 'A merchant on a hilltop watching colourful toy-like armies with banners on a distant plain, a general on horseback approaching, sunset'],
  [3, 'ch3_armistice_threat', 'Diplomats in ornate robes signing a treaty at a long table in a grand hall, a nervous merchant peeking from behind a pillar'],
  [3, 'ch3_enemy_territory_trade', 'A small rowing boat loaded with crates crossing a moonlit river between two castles flying different banners'],
  [3, 'ch3_inflation_surge', 'A market stall where a shopkeeper keeps raising price tags on a chalkboard, customers with overflowing coin purses gasping'],
  [3, 'ch3_army_requisition', 'Soldiers in bright livery loading sacks and barrels from a merchant warehouse onto ox carts, a quartermaster writing a receipt'],
  [3, 'ch3_caught_trading_enemies', 'A stern magistrate in a tall wig in a wood-panelled courtroom, a nervous merchant in the dock clutching a ledger'],
  [3, 'ch3_ambush_on_supply_run', 'An overturned supply wagon on a misty forest road, spilled crates and grain sacks, broken wheel, quiet aftermath'],
  [3, 'ch3_informant_demands', 'Two figures in a dim tavern corner, one sliding a folded letter across the table, nervous glances, hooded cloaks'],
  [3, 'ch3_neutral_city_escape', 'A peaceful walled city with white banners on a hill, merchants and travellers streaming through its open gate at golden hour'],
  [3, 'ch3_sutlers_wagon', 'A covered sutler wagon full of goods beside a cheerful army camp, soldiers buying small comforts, tents and banners'],
  [3, 'ch3_linen_supply', 'Two wooden looms in a sunlit workshop weaving white linen, stacks of folded cloth ready for a field hospital'],
  [3, 'ch3_remount_contract', 'A green horse farm with paddocks of cavalry horses, a horse trader and a quartermaster shaking hands by the fence'],
  [3, 'ch3_royal_victualling_charter', 'A lavish candlelit banquet in a grand war tent, a royal charter with a wax seal on the table, an officer raising a glass'],
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
  if (!force && (fs.existsSync(path.join(dir, `${id}.webp`)) || fs.existsSync(path.join(dir, `${id}.png`)))) return 'skipped'
  const form = new FormData()
  form.append('prompt', `${prompt}. ${STYLE}`)
  form.append('negative_prompt', NEGATIVE)
  form.append('aspect_ratio', '16:9')
  form.append('output_format', 'png')
  const response = await fetch(`https://api.stability.ai/v2beta/stable-image/generate/${model}`, {
    method: 'POST',
    headers: { Accept: 'image/*', Authorization: `Bearer ${apiKey}` },
    body: form,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    return `failed: ${error.errors?.join('; ') ?? error.message ?? response.statusText}`
  }
  // A filtered prompt can still come back 200 with a blurred image - don't keep it.
  if (response.headers.get('finish-reason') === 'CONTENT_FILTERED') return 'failed: content filter (blurred result discarded)'
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, `${id}.png`), Buffer.from(await response.arrayBuffer()))
  return 'generated'
}

const results = { generated: 0, skipped: 0, failed: 0 }
for (const [chapter, id, prompt] of PROMPTS) {
  if (onlyChapter !== undefined && chapter !== onlyChapter) continue
  if (onlyIds && !onlyIds.includes(id)) continue
  const result = await generate(chapter, id, prompt)
  results[result.startsWith('failed') ? 'failed' : result]++
  if (result !== 'skipped') console.log(`${result === 'generated' ? '✓' : '✗'} ch${chapter} ${id}${result === 'generated' ? '' : ` - ${result}`}`)
}
console.log(`\nGenerated ${results.generated}, skipped ${results.skipped}, failed ${results.failed}`)
if (results.generated) console.log('Next: node scripts/optimize-artwork.mjs')
