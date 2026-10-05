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
  [4, 'drug_empire_partnership', 'A shadowy apothecary storeroom with shelves of mysterious glass bottles, a cloaked figure counting coins by candlelight'],
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
  // Restyle batch (2026-10-04): work, market and title cards, and the rest of Chapters 2 and 4-7
  [1, 'ch1_work_odd_jobs', 'Cheerful dock workers hauling crates and barrels off a tall ship onto a sunny harbour quay, seagulls'],
  [1, 'ch1_work_steady', 'A cosy counting-house with clerks on tall stools at slanted desks, ledgers and quills, warm window light'],
  [1, 'ch1_work_contract', 'A merchant with a magnifying glass inspecting sacks and crates of cargo on a busy dock, a worried trader beside him'],
  [2, 'ch2_spice_smuggling', 'Barrels of colourful spices hidden under a trapdoor in a lantern-lit tavern cellar, a sly smuggler winking'],
  [2, 'ch2_salt_black_market', 'A shadowy back-alley stall stacked with salt sacks under a tarpaulin, a dealer in a wide hat, night lanterns'],
  [2, 'ch2_iron_theft_fence', 'A crooked trader in a dim warehouse uncovering a cart of iron bars under a sheet, glancing over his shoulder'],
  [2, 'ch2_turf_war_spike', 'Two rival gangs in colourful coats glaring at each other across a market square, merchants hurrying away with goods, comic tension'],
  [2, 'ch2_protection_racket_squeeze', 'A smug gang boss in a fur-collared coat tapping a ledger on a merchant counter, the shopkeeper sighing'],
  [2, 'ch2_informant_tip', 'A street urchin whispering to a merchant beside a fruit cart, pointing toward ships arriving in the harbour'],
  [2, 'ch2_rival_merchant', 'Two merchants in fancy hats squaring off nose to nose in a crowded market street, onlookers grinning'],
  [2, 'ch2_police_shakedown', 'A pompous city watchman with a big moustache holding out his hand to a merchant on a lantern-lit street'],
  [2, 'ch2_loan_collector', 'A tall thin debt collector in black with a huge ledger standing at a merchant door at dusk'],
  [2, 'ch2_protection_racket_start', 'A charming gang boss in a velvet coat offering a handshake to shopkeepers on a busy evening street'],
  [2, 'ch2_gambling_house_invest', 'A lively candlelit gambling hall with card tables, dice and cheering patrons, gold coins on green felt'],
  [2, 'ch2_counterfeiting_operation', 'Hidden cellar workshop lit by candles, coin dies and a small hand press on a workbench, trays of shiny coins'],
  [2, 'ch2_brothel_investment', 'The elegant lantern-lit facade of a velvet-curtained pleasure house on a busy evening street, a well-dressed hostess at the door'],
  [2, 'ch2_drug_house_landlord', 'A row of shabby rented townhouses at night with shuttered windows, a landlord holding a ring of keys'],
  [2, 'ch2_fence_stolen_goods', 'Cluttered back room of a pawnbroker shop, shelves of silverware, jewellery boxes and tapestries, lantern light'],
  [2, 'ch2_racket_extortion', 'A con artist in a top hat showing a merchant a bundle of letters with wax seals in a candlelit tavern booth'],
  [2, 'ch2_street_hustler_friend', 'A ragged but cheerful old friend in a patched coat greeting a well-dressed merchant on a busy street corner'],
  [2, 'ch2_gang_initiation_offer', 'A gang leader in a feathered hat welcoming a merchant into a smoky clubhouse full of rough but friendly characters'],
  [2, 'ch2_informant_recruitment', 'A nervous guard in a tabard whispering to a merchant behind a stack of crates, coins changing hands'],
  [2, 'ch2_rival_merchant_cooperation', 'Two rival merchants shaking hands over a table of maps and goods, their assistants looking relieved'],
  [2, 'ch2_police_crackdown', 'City watch guards in tabards marching down a cobbled market street at night with lanterns, shuttered stalls'],
  [2, 'ch2_supply_drought', 'Empty market stalls and a closed city gate with border guards, merchants waiting with empty carts'],
  [2, 'ch2_gang_war_opportunity', 'An empty market square between two gang hideouts at dusk, a bold merchant setting up a stall in the middle'],
  [2, 'ch2_gang_enforcer_visit', 'A burly enforcer in a dark coat standing in a merchant doorway, arms folded, ledger on the counter, candlelit'],
  [2, 'ch2_betrayal_by_partner', 'An empty strongbox and an open window in a merchant office at dawn, papers blowing, footprints in the dust'],
  [2, 'ch2_witness_to_murder', 'Rain-soaked alley at night, a dropped lantern and scattered coins on the cobblestones, a startled onlooker hiding behind a barrel'],
  [2, 'ch2_kidnapping_threat', 'A sealed letter with a black wax seal fixed to the wooden door of a merchant house at night, a candle glowing in the window'],
  [2, 'ch2_safe_house_refuge', 'A cosy hidden attic room with a warm fire, a cot and a pot of stew, a friendly old associate pouring tea'],
  [2, 'ch2_work_odd_jobs', 'A busy night market with lantern-lighters and errand runners darting between colourful stalls'],
  [2, 'ch2_work_steady', 'A watchman with a lantern and a dog patrolling moonlit harbour warehouses'],
  [2, 'ch2_work_contract', 'A merchant with a lantern finding a jewellery box hidden behind a loose brick in an old quarter alley'],
  [2, 'ch2_market_shipment_1', 'A smuggler ship hold full of spice sacks lit by lanterns, a captain gesturing to hurry, harbour at night'],
  [2, 'ch2_market_shipment_2', 'A closing blacksmith forge with stacks of iron bars for sale, the smith packing his tools sadly'],
  [2, 'ch2_market_buyer_1', 'A black-market dealer weighing salt sacks on brass scales in a hidden courtyard, a purse of coins ready'],
  [2, 'ch2_market_buyer_2', 'A gang armourer in a leather apron inspecting iron bars in a locksmith workshop full of locks and keys'],
  [3, 'ch3_work_odd_jobs', 'Workers loading sacks and barrels onto army supply wagons at dawn beside a colourful camp'],
  [3, 'ch3_work_steady', 'A quartermaster tent piled with ledgers, a merchant assistant sorting papers by lamplight'],
  [3, 'ch3_work_contract', 'A courier on horseback galloping across green hills with a sealed dispatch, a distant army camp with banners'],
  [3, 'ch3_market_shipment_1', 'An officers mess tent with fine spice jars and tins laid out for sale, an officer counting coins'],
  [3, 'ch3_market_shipment_2', 'Sunny coastal salt pans with white salt heaps, a carter loading sacks onto a wagon'],
  [3, 'ch3_market_buyer_1', 'A cheerful army armourer at a forge with horseshoes and cookpots, iron bars stacked high'],
  [3, 'ch3_market_buyer_2', 'A quartermaster in a field kitchen pointing at empty salt barrels, cooks salting pork'],
  [4, 'ch4_banking_charter', 'A grand marble banking hall with a royal charter on a velvet cushion, a banker in fine robes bowing'],
  [4, 'ch4_government_bond_scheme', 'A smooth adviser in a silk coat presenting elegant bond certificates with royal seals at a polished desk'],
  [4, 'ch4_insurance_monopoly', 'An insurance office with ship models, ledgers and a big map of trade routes, a magnate in a top hat'],
  [4, 'ch4_banking_collapse', 'Crowds of anxious townsfolk queueing outside a grand bank with its doors shut, papers blowing in the wind'],
  [4, 'ch4_crown_devalues_currency', 'A royal mint with workers stamping coins, a minister secretly adding copper to the melting pot'],
  [4, 'ch4_tax_amnesty', 'A herald reading a royal proclamation in a grand courtyard to well-dressed wealthy merchants'],
  [4, 'ch4_financial_audit', 'Stern royal auditors in powdered wigs going through stacks of ledgers in a merchant office'],
  [4, 'ch4_loan_foreclosure', 'Bailiffs with an inventory list at a merchant warehouse door, a banker holding a contract'],
  [4, 'ch4_market_manipulation_caught', 'An exchange hall where officials point at a big chalkboard of prices, a nervous merchant mid-trade'],
  [4, 'ch4_work_odd_jobs', 'Clerks counting, weighing and bagging piles of coins at long tables in a busy exchange hall'],
  [4, 'ch4_work_steady', 'A neat junior clerk desk in a respectable bank with brass lamps and ledgers'],
  [4, 'ch4_work_contract', 'A merchant untangling mountains of ledgers and receipts in a dusty abandoned counting-house'],
  [4, 'ch4_market_shipment_1', 'A bankrupt merchant warehouse full of salt sacks with a for-sale sign, creditors with notices'],
  [4, 'ch4_market_shipment_2', 'A flustered speculator selling spice jars cheaply on the exchange steps, a crowd watching'],
  [4, 'ch4_market_buyer_1', 'A greedy speculator in a top hat buying spice barrels with bags of gold on a busy exchange floor'],
  [4, 'ch4_market_buyer_2', 'A royal mint workshop with new coin presses and vault doors being built, iron bars delivered'],
  [5, 'ch5_plague_medicine', 'An alchemist laboratory with bubbling flasks and herb bundles, an alchemist offering a medicine bottle'],
  [5, 'ch5_infection_prevention', 'Healers in beaked masks and long coats hanging herb bundles and lighting incense along a quiet street'],
  [5, 'ch5_grave_robbing_artifacts', 'A misty old churchyard at night with a lantern and a small chest of trinkets, two shifty gravediggers'],
  [5, 'ch5_plague_spreads', 'A quiet city street with shuttered windows marked with chalk, a lone healer with a lantern, misty evening'],
  [5, 'ch5_quarantine_economy', 'A wooden quarantine barrier across a street with guards, people passing baskets over it'],
  [5, 'ch5_mass_death_discount', 'An auction house overflowing with furniture, paintings and estate goods, few bidders, low prices'],
  [5, 'ch5_infection_risk', 'A merchant in bed with a cold compress being tended by a kind healer, herbal tea on the table'],
  [5, 'ch5_plague_riot', 'A crowd of desperate townsfolk with torches outside a warehouse at night, a merchant at the door with a lantern'],
  [5, 'ch5_healer_betrayal', 'A sly healer pocketing gold behind an apothecary counter, bottles of dubious tonics on the shelves'],
  [5, 'ch5_work_odd_jobs', 'Volunteers carrying water buckets and boiling linen in a courtyard of a plague hospital'],
  [5, 'ch5_work_steady', 'A busy relief kitchen with big soup pots and bread, a steward handing out bowls to a queue'],
  [5, 'ch5_work_contract', 'A merchant carrying a medicine crate past a quarantine checkpoint with friendly guards at dusk'],
  [5, 'ch5_market_shipment_1', 'A quiet idle foundry with cold furnaces and stacks of iron bars for sale, a sad foundry master'],
  [5, 'ch5_market_shipment_2', 'A carter driving a salt wagon along a country road to the city walls at sunrise'],
  [5, 'ch5_market_buyer_1', 'An apothecary guild hall with shelves of jars, apothecaries eagerly weighing spices'],
  [5, 'ch5_market_buyer_2', 'A council storehouse full of salted meats and barrels, clerks counting salt sacks'],
  [6, 'ch6_intelligence_trade', 'A spymaster in a dark study surrounded by maps and pinned letters, offering a sealed dossier'],
  [6, 'ch6_conspiracy_network', 'Masked conspirators around a candlelit round table in a hidden cellar, an empty chair waiting'],
  [6, 'ch6_blackmail_operation', 'A cluttered desk covered in letters, wax seals and portraits, a sly figure sorting secrets by candlelight'],
  [6, 'ch6_faction_war', 'Rival factions with banners facing off in a grand city square, merchants scurrying with carts'],
  [6, 'ch6_trust_collapses', 'A chaotic exchange hall with merchants arguing, torn contracts on the floor, suspicious glances'],
  [6, 'ch6_political_upheaval', 'A new banner being raised over the palace, crowds gathered in the square, nobles hurrying away with trunks'],
  [6, 'ch6_work_odd_jobs', 'A merchant carrying a satchel of sealed letters through busy city streets'],
  [6, 'ch6_work_steady', 'A grand noble household study with account books, a steward at work, servants passing by'],
  [6, 'ch6_work_contract', 'A merchant mediating between two partners across a table, a fair split of goods laid out between them'],
  [6, 'ch6_market_shipment_1', 'A cellar full of salt sacks, a merchant in a travelling cloak hastily handing over the keys'],
  [6, 'ch6_market_shipment_2', 'An empty armoury with racks of iron bars and fittings, a caretaker with a lantern'],
  [6, 'ch6_market_buyer_1', 'Busy cooks in a grand feast kitchen, a steward buying spice jars from a merchant'],
  [6, 'ch6_market_buyer_2', 'Locksmiths and smiths fitting iron gates and bars to a noble house, buyers bidding for iron'],
  [7, 'ch7_work_odd_jobs', 'A museum workroom full of strange glowing artifacts being weighed and labelled by clerks'],
  [7, 'ch7_work_steady', 'A whimsical customs house where clerks inspect crates from other worlds, one crate with a curious face'],
  [7, 'ch7_work_contract', 'A merchant negotiating with a tall serene otherworldly trader over a warehouse full of teapots'],
  [7, 'ch7_market_shipment_1', 'Otherworldly traders at glowing stalls selling sparkling spices to amazed merchants'],
  [7, 'ch7_market_shipment_2', 'A scavenger with a cart of glowing iron chunks under a shimmering rift in the night sky'],
  [7, 'ch7_market_buyer_1', 'Graceful otherworldly beings delightedly tasting salt from a merchant open sack'],
  [7, 'ch7_market_buyer_2', 'An otherworldly merchant with many arms happily buying spice jars at a market stall'],
  [2, 'chapter2_title', 'A sweeping view of a lantern-lit port city at night, gangs, smugglers and fences in the busy streets below'],
  [3, 'chapter3_title', 'A storybook view of a kingdom at war: colourful army camps, supply wagons and banners across green hills'],
  [4, 'chapter4_title', 'A grand financial district with marble banks, an exchange hall and a royal mint under golden light'],
  [5, 'chapter5_title', 'A quiet misty city with healers in long coats, herb gardens and relief kitchens, a hopeful dawn'],
  [6, 'chapter6_title', 'A city of intrigue at dusk: masked nobles on balconies, whispering factions and secret letters'],
  [7, 'chapter7_title', 'A merchant city under a torn glowing sky with floating islands, rifts and otherworldly markets'],
  // Side stories (cards/side-stories.ts)
  [1, 'side_guard_ch1', 'A grumpy old wagon master beside a covered wagon loaded with salt crates on a sunny coast road, a single red feather caught in the wagon wheel'],
  [2, 'side_guard_ch2', 'A red feather pinned to a warehouse door on lantern-lit harbour docks at night, fog rolling in, crates stacked high'],
  [3, 'side_guard_ch3', 'A long line of families with carts and bundles walking along a country road at dawn, led by a guard with a round shield, gentle hills'],
  [4, 'side_guard_ch4', 'A sturdy coach covered in riveted iron plates pulled by six horses outside a grand bank with marble columns, a banker in a tall hat'],
  [5, 'side_guard_ch5', 'A wagon full of medicine crates climbing a snowy mountain road toward a monastery, warm lanterns, pine trees'],
  [6, 'side_guard_ch6', 'An old wagon master sitting sadly on his wagon seat holding a bundle of red feathers, a sunset sky, a small girl\'s ribbon on the seat'],
  [7, 'side_guard_ch7', 'A smiling bandit queen in a red-feathered hat sitting on a throne of stolen crates in a lantern-lit hideout cave, friendly mischievous mood'],
  [1, 'side_smuggler_ch1', 'A skinny cheerful lad with a gold earring peeking out from behind stacks of fishing nets on a busy harbour quay'],
  [2, 'side_smuggler_ch2', 'A cracked carved mermaid ship figurehead leaning against a wall in a cluttered back room full of curiosities, candlelight'],
  [3, 'side_smuggler_ch3', 'A small fast sailboat slipping between jagged black rocks at night, distant warships with lanterns on the horizon, moonlight'],
  [4, 'side_smuggler_ch4', 'A sailing ship hidden in a private dock behind tall iron gates, a bank clerk with spectacles whispering, evening light'],
  [5, 'side_smuggler_ch5', 'A rowing boat full of medicine crates gliding under a stone bridge through an old water gate at night, moonlight on the canal'],
  [6, 'side_smuggler_ch6', 'A pompous harbourmaster in a fancy coat in his office full of maps and model ships, a circled map on his desk'],
  [7, 'side_smuggler_ch7', 'A beautiful old sailing ship with white sails in a forgotten dock beside a glowing magical rift in the sky, a woman captain waving from the crow\'s nest'],
  [1, 'side_alchemist_ch1', 'An empty alchemist workshop with bubbling flasks and a singed open notebook on the workbench, sunlight through dusty windows'],
  [2, 'side_alchemist_ch2', 'A forger in a leather apron rubbing her hands in a dim workshop with shiny fake gold coins and a torn notebook page'],
  [3, 'side_alchemist_ch3', 'An army camp at night lit by dozens of warm glowing lamps, tents and soldiers warming their hands, cosy mood'],
  [4, 'side_alchemist_ch4', 'An alchemist testing a gold bar with a magnifying glass at a bank counter, a nervous stranger in a cloak, brass scales'],
  [5, 'side_alchemist_ch5', 'A glowing silver remedy bubbling in a glass flask surrounded by moonflowers in an alchemist laboratory, soft blue light'],
  [6, 'side_alchemist_ch6', 'A ransacked alchemist workshop with papers scattered everywhere and a single grey glove on the floor, moonlight'],
  [7, 'side_alchemist_ch7', 'A delighted old professor with a white beard stepping out of a glowing golden rift of starlight, giant glass jars catching the light'],
  [1, 'side_silverTongue_ch1', 'A lively tavern song contest, a vain bard with golden curls and a silver lute on a small stage, cheering crowd, warm lantern light'],
  [2, 'side_silverTongue_ch2', 'A loud birthday party for a burly gang boss in a candlelit cellar, a big cake, a bard performing, laughing guests'],
  [3, 'side_silverTongue_ch3', 'A travelling show on a wooden stage in an army camp, jugglers and a clever dog performing for cheering soldiers'],
  [4, 'side_silverTongue_ch4', 'A town crier ringing a bell in front of a grand bank, people humming along, banners, sunny city square'],
  [5, 'side_silverTongue_ch5', 'A bard singing in a quiet street at dusk, windows opening one by one with people leaning out to listen, warm candlelight'],
  [6, 'side_silverTongue_ch6', 'A worried bard with golden curls reading a letter by candlelight, an old blind fiddler\'s violin on the table'],
  [7, 'side_silverTongue_ch7', 'A grand magical bazaar of colourful tents beside a glowing rift in the sky, starry-eyed traders listening to a singing bard'],
  [1, 'side_healer_ch1', 'A kind young healer bandaging a dockhand\'s foot on a busy harbour quay, an old nun watching with a gentle smile'],
  [2, 'side_healer_ch2', 'A healer stitching a man\'s arm by candlelight at a kitchen table at midnight, a nun holding a lantern'],
  [3, 'side_healer_ch3', 'A neat field hospital tent with clean beds and steaming soup pots, nurses in aprons, warm afternoon light'],
  [4, 'side_healer_ch4', 'An old bakery with big windows for sale on a sunny street, a healer and a nun looking at it with hope'],
  [5, 'side_healer_ch5', 'A busy healing house full of beds and helpful volunteers, sunlight through big windows, herbs hanging from the ceiling'],
  [6, 'side_healer_ch6', 'A shifty apothecary in a dark coat swapping jars of herbs on a shelf at night, moonlight through a window'],
  [7, 'side_healer_ch7', 'A grand healing house with a glowing herb garden under a starlit sky, a happy old nun laughing among the plants'],
  [1, 'side_prospector_ch1', 'A cackling old woman prospector panning for gold in a sparkling river, a torn old map on a rock beside her, sunny meadow'],
  [2, 'side_prospector_ch2', 'A torchlit old mine tunnel full of smugglers\' crates, a sleeping cat carved into the rock wall'],
  [3, 'side_prospector_ch3', 'Carts of iron ore rolling down a mountain shaped like a sleeping cat, miners and a quartermaster with a clipboard'],
  [4, 'side_prospector_ch4', 'Eager bankers in top hats crowding around a prospector holding an old map in front of a mine entrance'],
  [5, 'side_prospector_ch5', 'A warm healing spring bubbling up in a crystal cave, villagers filling buckets, soft lantern light'],
  [6, 'side_prospector_ch6', 'Rival prospectors waving papers outside a mining camp at dawn, an old woman pulling a map out of her boot'],
  [7, 'side_prospector_ch7', 'A great glowing door in a mountain opening onto a sparkling cave of gold and humming star crystals, an old woman prospector with happy tears'],
  // Class openings (cards/class-openings.ts)
  [1, 'opening_guard', 'A GUARDS WANTED notice flapping on a stone harbour gate, a tired friendly caravan boss beside covered wagons, morning sun, gulls'],
  [1, 'opening_smuggler', 'An old boatman in a small rowing boat at a quiet harbour at night, lantern glow on dark water, moonlight, ships in the distance'],
  [1, 'opening_alchemist', 'A rickety wooden tonic cart full of colourful clinking bottles on a cobbled market street, an old apothecary leaning on a cane'],
  [1, 'opening_silverTongue', 'A cosy noisy tavern full of sailors, a small empty stage with a stool, a cheerful landlady behind the bar, warm lantern light'],
  [1, 'opening_healer', 'A small busy harbour infirmary with three beds, a tired kind doctor, bunches of herbs hanging from the beams, sunlight through a window'],
  [1, 'opening_prospector', 'A cluttered assay office with scales, rocks and gold nuggets on the counter, an old woman assayer with a magnifying glass'],
  // Build your hero: mentors and training, one each per chapter (2026-10-05)
  [1, 'mentor_ch1', 'A tiny bespectacled schoolmistress with chalk on her nose beside a big chalkboard of sums in a cosy harbour-side counting school, abacuses on desks'],
  [1, 'training_ch1', 'A cheerful harbour festival with bunting, a barrel race on the quay and people climbing a tall greased ship mast to ring a bell, sunny day'],
  [2, 'mentor_ch2', 'A grey-whiskered old woman in a dark cloak crouching on moonlit rooftops above a lantern-lit night market, chimneys and stars'],
  [2, 'training_ch2', 'An old fencing hall behind a red door, fencing masks hanging on the wall, students practising footwork on a polished wooden floor, lantern glow'],
  [3, 'mentor_ch3', 'A drill sergeant with a moustache like a broom beside a muddy obstacle course of ropes and wooden walls at an army camp, bright morning'],
  [3, 'training_ch3', 'A quartermaster tent full of ledgers, sacks and barrels, a long column of supply wagons outside rolling past green hills'],
  [4, 'mentor_ch4', 'An elegant lady banker with a silver cane in a grand marble bank hall with brass clockwork, polished counters and tall windows'],
  [4, 'training_ch4', 'A steam-powered gymnasium hall full of brass machines, a giant spinning wheel and clockwork calculating engines, clerks training'],
  [5, 'mentor_ch5', 'A kind old herb healer kneeling in a walled garden of mint and lavender, drying herbs hanging from a cottage porch, soft golden light'],
  [5, 'training_ch5', 'A calm bright hospital ward with clean beds, nurses in white aprons and a helper carrying a tray of tea, sunlight through tall windows'],
  [6, 'mentor_ch6', 'A wise old judge with spectacles at a carved desk in a candlelit study, an enormous open book of names, quill and inkpot'],
  [6, 'training_ch6', 'A secret back room with a card table, a hidden coin under one of three cups, an old spymaster with an eyepatch smiling, candlelight'],
  [7, 'mentor_ch7', 'A merchant woman in a coat full of twinkling stars stepping out of a glowing violet rift in a market square, amazed townsfolk'],
  [7, 'training_ch7', 'A great brass telescope in a domed observatory pointed at a shimmering violet rift in the night sky, astronomers with star charts'],
  // Skill challenges for chapters 2 and 3 (2026-10-05)
  [2, 'ch2_skill_card_sharp', 'A sly card sharp in a velvet waistcoat shuffling cards at a lantern-lit table in a bustling night market, curious crowd watching'],
  [2, 'ch2_skill_stolen_ledger', 'A cosy rowdy harbour tavern called the Rusty Anchor, a thick leather ledger on a table between dice-playing sailors, warm firelight'],
  [2, 'ch2_skill_counterfeit', 'Close view of a market counter with a scatter of silver coins, one coin glinting oddly, a merchant squinting through a magnifying glass, lanterns'],
  [2, 'ch2_skill_runaway_cart', 'A cart of spice barrels rolling fast down a steep cobbled hill street lined with lantern shops, people jumping aside, comic storybook action'],
  [2, 'ch2_skill_smugglers_riddle', 'A grinning smuggler queen on a throne of crates in a hidden cave market full of lanterns, holding up a finger as if asking a riddle'],
  [2, 'ch2_skill_watch_patrol', 'A Watch sergeant with a lantern stopping a merchant with a satchel in a narrow misty alley at night, cobbles shining'],
  [3, 'ch3_skill_supply_audit', 'An army depot with long rows of empty wooden racks and stacked crates, a colonel and a merchant studying a ledger by lamplight'],
  [3, 'ch3_skill_peace_talks', 'Two rival captains in colourful coats sitting at a little table with a teapot inside a big empty warehouse, a merchant pouring tea between them'],
  [3, 'ch3_skill_river_crossing', 'A covered wagon loaded with salt sacks at the edge of a swollen rushing river ford, rain clouds, an army camp with tents on the far bank'],
  [3, 'ch3_skill_spy', 'A busy market street where a trader in suspiciously shiny new boots peers at army wagons, a merchant watching him from behind a stall'],
  [3, 'ch3_skill_war_horse', 'A magnificent wild black horse rearing in a sunny cavalry paddock, a stable master with a bucket and soldiers leaning on the fence'],
  [3, 'ch3_skill_recruiter', 'A jolly recruiting sergeant thumping a table outside a tent in a sunny town square, banners and a small cheering crowd'],
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
