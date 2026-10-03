import type { StoryCard } from '../../engine/types'
import { venture } from './factories'

// THE TRADER'S LADDER
// Every chapter offers honest trade at every price point, so buying in is always
// an option and the player visibly grows from market stall to world-spanning
// exchange. Each chapter has:
//   - two cheap entries (~25-35% of the chapter's big deals) to restart after a reckoning
//   - a mid-sized venture
//   - a premium, high-return venture, shown locked behind a stat until earned
// Honest trade never adds heat. The criminal deals in the chapter decks pay a
// little better per gold - and draw the Colossi's attention.

export const chapter2TraderVentures: StoryCard[] = [
  venture({
    id: 'ch2_market_stall_lease',
    weight: 4,
    title: 'A Stall at the Night Market',
    body: ['The night market never closes, and neither do its customers. A weaver retiring to the hills offers you her stall, awning and all. "Fifty gold, and the regulars come with it."'],
    asset: { id: 'ch2_market_stall', label: 'Night Market Stall', cost: 50, monthlyCashflow: 15, sector: 'trade' },
    accept: { id: 'lease_stall', label: 'Take over the stall (50g, +15g/month)', effects: [{ kind: 'narrate', text: 'Lanterns, haggling, and a cashbox that fills a little every night. Honest work in a dishonest city.' }] },
    decline: { id: 'pass_stall', label: 'Pass', text: 'Someone else hangs their lantern from her awning by morning.' },
  }),
  venture({
    id: 'ch2_porter_crew',
    weight: 4,
    title: 'Dockside Porter Crew',
    body: ['Six broad-shouldered porters have lost their foreman to the gangs. "Buy our ropes and carts and we\'ll haul for you. Fair wages, fair cut - none of that protection business."'],
    asset: { id: 'ch2_porter_crew', label: 'Dockside Porter Crew', cost: 70, monthlyCashflow: 21, sector: 'trade' },
    accept: { id: 'hire_porters', label: 'Equip the crew (70g, +21g/month)', effects: [{ kind: 'narrate', text: 'Your porters become the only crew on the docks nobody has to bribe. Business follows.' }] },
    decline: { id: 'pass_porters', label: 'Not now', text: 'The porters drift off to find another backer.' },
  }),
  venture({
    id: 'ch2_spice_kiosk_chain',
    weight: 3,
    title: 'A Chain of Tea Kiosks',
    body: ['Spiced tea sells on every corner after dark - to dockhands, gamblers, even the watch. A tea merchant wants a partner to open kiosks across three districts.'],
    asset: { id: 'ch2_tea_kiosks', label: 'Tea Kiosk Chain', cost: 140, monthlyCashflow: 42, sector: 'spice' },
    accept: { id: 'fund_kiosks', label: 'Fund the kiosks (140g, +42g/month)', effects: [{ kind: 'narrate', text: 'Three districts, one recipe, and steam rising from your kiosks all night long.' }] },
    decline: { id: 'pass_kiosks', label: 'Decline', text: 'The tea merchant finds a cousin to bankroll her.' },
  }),
  venture({
    id: 'ch2_harbour_warehouse_syndicate',
    weight: 3,
    title: 'The Harbour Warehouse Syndicate',
    body: ['The old harbour warehouses are for sale as one block - too big for the gangs to squeeze, too valuable to sit empty. Whoever controls them sets storage prices for the whole port. The sellers only deal with someone who can read a ledger.'],
    asset: { id: 'ch2_harbour_warehouses', label: 'Harbour Warehouse Syndicate', cost: 300, monthlyCashflow: 135, sector: 'trade' },
    accept: {
      id: 'buy_warehouses',
      label: 'Buy the warehouse block (300g, +135g/month)',
      requires: [{ kind: 'statAtLeast', stat: 'savvy', value: 4 }],
      showLockedAs: 'Needs Savvy 4 and 300g',
      effects: [{ kind: 'narrate', text: 'Every crate that lands in the port now pays you rent. Even the gangs store their goods with you.' }],
    },
    decline: { id: 'pass_warehouses', label: 'Too big a bite for now', text: 'The block sits empty a while longer. It will not wait forever.' },
  }),
]

export const chapter3TraderVentures: StoryCard[] = [
  venture({
    id: 'ch3_sutlers_wagon',
    weight: 4,
    title: 'A Sutler\'s Wagon',
    body: ['Soldiers on the march will pay for anything that isn\'t army rations: tobacco, thread, dried figs. A camp follower is selling her wagon and her place in the column.'],
    asset: { id: 'ch3_sutlers_wagon', label: 'Sutler\'s Wagon', cost: 80, monthlyCashflow: 26, sector: 'trade' },
    accept: { id: 'buy_wagon', label: 'Buy the wagon (80g, +26g/month)', effects: [{ kind: 'narrate', text: 'You follow the army at a respectful distance, and the army pays you for small comforts.' }] },
    decline: { id: 'pass_wagon', label: 'Pass', text: 'The wagon rolls off with a new owner at the reins.' },
  }),
  venture({
    id: 'ch3_linen_supply',
    weight: 4,
    title: 'Linen and Bandages',
    body: ['The field hospitals go through linen faster than the mills can weave it. A widow with two looms needs yarn money to keep up.'],
    asset: { id: 'ch3_linen_supply', label: 'Bandage Linen Supply', cost: 110, monthlyCashflow: 33, sector: 'health' },
    accept: { id: 'fund_linen', label: 'Fund the looms (110g, +33g/month)', effects: [{ kind: 'narrate', text: 'Your linen binds soldiers\' wounds on both banks of the river. It is good money, and good work.' }] },
    decline: { id: 'pass_linen', label: 'Decline', text: 'The looms fall quiet for want of yarn.' },
  }),
  venture({
    id: 'ch3_remount_contract',
    weight: 3,
    title: 'Remount Contract',
    body: ['The cavalry loses horses faster than it can breed them. A horse-coper offers you a share in a remount farm with a standing order from the quartermaster.'],
    asset: { id: 'ch3_remount_farm', label: 'Remount Farm Share', cost: 220, monthlyCashflow: 66, sector: 'military' },
    accept: { id: 'buy_remounts', label: 'Buy into the farm (220g, +66g/month)', effects: [{ kind: 'narrate', text: 'Every spring your foals go to war, and every quarter the crown pays for them.' }] },
    decline: { id: 'pass_remounts', label: 'Decline', text: 'The quartermaster signs with someone else.' },
  }),
  venture({
    id: 'ch3_royal_victualling_charter',
    weight: 3,
    title: 'Royal Victualling Charter',
    body: ['The crown will grant one merchant the charter to feed the entire northern army - salt pork, biscuit, beer, the lot. The Lord Commissary awards it over dinner, to whoever he likes best.'],
    asset: { id: 'ch3_victualling_charter', label: 'Royal Victualling Charter', cost: 450, monthlyCashflow: 200, sector: 'military' },
    accept: {
      id: 'win_charter',
      label: 'Win the charter (450g, +200g/month)',
      requires: [{ kind: 'statAtLeast', stat: 'charm', value: 4 }],
      showLockedAs: 'Needs Charm 4 and 450g',
      effects: [{ kind: 'narrate', text: 'The Commissary raises his glass to you. Forty thousand soldiers now eat at your table, and the crown settles the bill.' }],
    },
    decline: { id: 'pass_charter', label: 'Not this time', text: 'The charter goes to a merchant with better manners and deeper pockets.' },
  }),
]

export const chapter4TraderVentures: StoryCard[] = [
  venture({
    id: 'ch4_money_changer_booth',
    weight: 4,
    title: 'A Money-Changer\'s Booth',
    body: ['Twelve currencies cross the counting-house steps every day, and every traveller needs the right coin. A money-changer\'s booth is for sale, scales and touchstone included.'],
    asset: { id: 'ch4_changer_booth', label: 'Money-Changer\'s Booth', cost: 100, monthlyCashflow: 32, sector: 'banking' },
    accept: { id: 'buy_booth', label: 'Buy the booth (100g, +32g/month)', effects: [{ kind: 'narrate', text: 'A sliver of every exchange is yours. Small coins, but they never stop coming.' }] },
    decline: { id: 'pass_booth', label: 'Pass', text: 'The booth sells by noon.' },
  }),
  venture({
    id: 'ch4_bills_courier',
    weight: 4,
    title: 'Bills of Exchange Courier',
    body: ['Merchants won\'t carry gold on the roads any more - they carry paper. A courier service that moves bills of exchange between cities needs horses and trusted riders.'],
    asset: { id: 'ch4_bills_courier', label: 'Bills of Exchange Courier', cost: 140, monthlyCashflow: 45, sector: 'trade' },
    accept: { id: 'fund_courier', label: 'Fund the courier service (140g, +45g/month)', effects: [{ kind: 'narrate', text: 'Your riders carry fortunes in their satchels, and a fee for every one.' }] },
    decline: { id: 'pass_courier', label: 'Decline', text: 'The riders sign on with a rival house.' },
  }),
  venture({
    id: 'ch4_merchant_credit_union',
    weight: 3,
    title: 'A Merchant Credit Union',
    body: ['Small traders can\'t get credit from the great houses. Pool their savings, lend it back at fair rates, and take a share of the interest - if someone puts up the founding capital.'],
    asset: { id: 'ch4_credit_union', label: 'Merchant Credit Union', cost: 260, monthlyCashflow: 85, sector: 'banking' },
    accept: { id: 'found_union', label: 'Found the union (260g, +85g/month)', effects: [{ kind: 'narrate', text: 'Stall-keepers who once begged for loans now bank with you. They remember who helped them.' }] },
    decline: { id: 'pass_union', label: 'Decline', text: 'The traders go on borrowing from loan sharks.' },
  }),
  venture({
    id: 'ch4_letters_of_credit_house',
    weight: 3,
    title: 'A House of Letters of Credit',
    body: ['A letter of credit with your seal on it could be honoured from the salt flats to the spice isles. Founding such a house takes capital - and a mind that can keep a hundred accounts balanced at once.'],
    asset: { id: 'ch4_credit_house', label: 'House of Letters of Credit', cost: 600, monthlyCashflow: 270, sector: 'banking' },
    accept: {
      id: 'found_credit_house',
      label: 'Found the house (600g, +270g/month)',
      requires: [{ kind: 'statAtLeast', stat: 'savvy', value: 8 }],
      showLockedAs: 'Needs Savvy 8 and 600g',
      effects: [{ kind: 'narrate', text: 'Your seal becomes a currency of its own. Merchants on three continents trust paper because it bears your name.' }],
    },
    decline: { id: 'pass_credit_house', label: 'Not yet', text: 'The idea will keep. The capital will have to be found.' },
  }),
]

export const chapter5TraderVentures: StoryCard[] = [
  venture({
    id: 'ch5_herb_garden_plots',
    weight: 4,
    title: 'Herb Garden Plots',
    body: ['Feverfew, sage, wormwood - the apothecaries can\'t get enough. Abandoned garden plots outside the walls can be had for a song, if someone will tend them.'],
    asset: { id: 'ch5_herb_gardens', label: 'Herb Garden Plots', cost: 110, monthlyCashflow: 36, sector: 'health' },
    accept: { id: 'plant_herbs', label: 'Plant the gardens (110g, +36g/month)', effects: [{ kind: 'narrate', text: 'Green things grow where the city is dying. The apothecaries buy every bundle.' }] },
    decline: { id: 'pass_herbs', label: 'Pass', text: 'The plots go back to weeds.' },
  }),
  venture({
    id: 'ch5_bread_deliveries',
    weight: 4,
    title: 'Quarantine Bread Rounds',
    body: ['Sealed streets still need bread. The baker\'s guild will pay well for anyone willing to run deliveries to the quarantine gates and leave the loaves on the step.'],
    asset: { id: 'ch5_bread_rounds', label: 'Quarantine Bread Rounds', cost: 150, monthlyCashflow: 50, sector: 'trade' },
    accept: { id: 'run_bread_rounds', label: 'Set up the rounds (150g, +50g/month)', effects: [{ kind: 'narrate', text: 'Your carts are the only thing moving in the sealed streets. Windows open to wave as they pass.' }] },
    decline: { id: 'pass_bread', label: 'Decline', text: 'The guild finds braver - or more desperate - runners.' },
  }),
  venture({
    id: 'ch5_vinegar_lime_works',
    weight: 3,
    title: 'Vinegar and Lime Works',
    body: ['The physicians say vinegar and quicklime keep the sickness from spreading. Every household wants both. A failing distillery could be turned to the work.'],
    asset: { id: 'ch5_vinegar_works', label: 'Vinegar & Lime Works', cost: 300, monthlyCashflow: 100, sector: 'craft' },
    accept: { id: 'convert_distillery', label: 'Convert the distillery (300g, +100g/month)', effects: [{ kind: 'narrate', text: 'The whole district smells of your vinegar, and the whole district is grateful for it.' }] },
    decline: { id: 'pass_vinegar', label: 'Decline', text: 'The distillery stays shuttered.' },
  }),
  venture({
    id: 'ch5_physicians_underwriting',
    weight: 3,
    title: 'Underwrite the Physicians\' Guild',
    body: ['The Physicians\' Guild is going broke treating the poor. Underwrite them, and the city council will pay you a standing fee for every ward kept open. It means walking the plague wards yourself to see the books are honest.'],
    asset: { id: 'ch5_physicians_bond', label: 'Physicians\' Guild Underwriting', cost: 700, monthlyCashflow: 320, sector: 'health' },
    accept: {
      id: 'underwrite_physicians',
      label: 'Underwrite the guild (700g, +320g/month)',
      requires: [{ kind: 'statAtLeast', stat: 'grit', value: 6 }],
      showLockedAs: 'Needs Grit 6 and 700g',
      effects: [{ kind: 'narrate', text: 'You walk the wards with a lantern and a ledger. The wards stay open, and the council pays without argument.' }],
    },
    decline: { id: 'pass_physicians', label: 'Not now', text: 'The guild limps on without you.' },
  }),
]

export const chapter6TraderVentures: StoryCard[] = [
  venture({
    id: 'ch6_pigeon_loft',
    weight: 4,
    title: 'A Courier Pigeon Loft',
    body: ['In a city where no one trusts a messenger, a bird can\'t be bribed. A pigeon-fancier is selling his loft and his best homing lines.'],
    asset: { id: 'ch6_pigeon_loft', label: 'Courier Pigeon Loft', cost: 130, monthlyCashflow: 45, sector: 'trade' },
    accept: { id: 'buy_loft', label: 'Buy the loft (130g, +45g/month)', effects: [{ kind: 'narrate', text: 'Sealed messages fly from your rooftop to every city on the coast. Nobody reads them but the recipient.' }] },
    decline: { id: 'pass_loft', label: 'Pass', text: 'The birds go to a new keeper.' },
  }),
  venture({
    id: 'ch6_sealed_ledger_notary',
    weight: 4,
    title: 'Sealed Ledger Notary',
    body: ['Partners who don\'t trust each other still need to do business. A notary who keeps both sides\' ledgers under seal - and is trusted by neither - is worth a fee to everyone.'],
    asset: { id: 'ch6_notary', label: 'Sealed Ledger Notary', cost: 170, monthlyCashflow: 58, sector: 'trade' },
    accept: { id: 'open_notary', label: 'Open the notary office (170g, +58g/month)', effects: [{ kind: 'narrate', text: 'Your seal is the one thing rival merchants agree on. They pay handsomely for it.' }] },
    decline: { id: 'pass_notary', label: 'Decline', text: 'The partners go on suspecting each other, unwitnessed.' },
  }),
  venture({
    id: 'ch6_bonded_escrow_warehouse',
    weight: 3,
    title: 'A Bonded Escrow Warehouse',
    body: ['Goods held in neutral hands until both sides pay: it\'s the only way trade happens now. A guarded warehouse with a reputation for honesty would be the busiest building in the city.'],
    asset: { id: 'ch6_escrow_warehouse', label: 'Bonded Escrow Warehouse', cost: 380, monthlyCashflow: 130, sector: 'trade' },
    accept: { id: 'build_escrow', label: 'Build the warehouse (380g, +130g/month)', effects: [{ kind: 'narrate', text: 'Buyers and sellers who would never shake hands both hand their goods to you.' }] },
    decline: { id: 'pass_escrow', label: 'Decline', text: 'The idea goes to a rival - one with fewer scruples.' },
  }),
  venture({
    id: 'ch6_neutral_exchange',
    weight: 3,
    title: 'The Neutral Exchange',
    body: ['Every faction in the city is ready to trade - but never through each other. A neutral exchange, chaired by someone all of them can stomach, would carry the city\'s whole commerce. They will only accept a chair they like.'],
    asset: { id: 'ch6_neutral_exchange', label: 'The Neutral Exchange', cost: 800, monthlyCashflow: 380, sector: 'trade' },
    accept: {
      id: 'chair_exchange',
      label: 'Found and chair the exchange (800g, +380g/month)',
      requires: [{ kind: 'statAtLeast', stat: 'charm', value: 5 }],
      showLockedAs: 'Needs Charm 5 and 800g',
      effects: [{ kind: 'narrate', text: 'Sworn enemies bow to you from opposite ends of the trading floor. All of them pay the exchange fee.' }],
    },
    decline: { id: 'pass_exchange', label: 'Not yet', text: 'The factions go on trading through smugglers.' },
  }),
]

export const chapter7TraderVentures: StoryCard[] = [
  venture({
    id: 'ch7_star_chart_almanacs',
    weight: 4,
    title: 'Star-Chart Almanacs',
    body: ['Since the sky changed, every sailor needs new charts. An astronomer has mapped the new constellations and wants a printer and a partner.'],
    asset: { id: 'ch7_almanacs', label: 'Star-Chart Almanacs', cost: 150, monthlyCashflow: 55, sector: 'transcendence' },
    accept: { id: 'print_almanacs', label: 'Print the almanacs (150g, +55g/month)', effects: [{ kind: 'narrate', text: 'Every ship in the harbour now steers by stars you sold them.' }] },
    decline: { id: 'pass_almanacs', label: 'Pass', text: 'The astronomer goes looking for another patron.' },
  }),
  venture({
    id: 'ch7_dreamweaver_looms',
    weight: 4,
    title: 'Dreamweaver Looms',
    body: ['A weaver has learned to weave cloth that remembers dreams. Nobles pay absurd sums for a single bolt. She needs looms - and someone who will not ask too many questions.'],
    asset: { id: 'ch7_dream_looms', label: 'Dreamweaver Looms', cost: 220, monthlyCashflow: 80, sector: 'craft' },
    accept: { id: 'fund_looms', label: 'Fund the looms (220g, +80g/month)', effects: [{ kind: 'narrate', text: 'Silk shimmers with other people\'s dreams. The nobles cannot get enough of it.' }] },
    decline: { id: 'pass_looms', label: 'Decline', text: 'The weaver\'s dreams stay unwoven.' },
  }),
  venture({
    id: 'ch7_tidewell_of_moments',
    weight: 3,
    title: 'The Tidewell of Moments',
    body: ['A well in the old quarter fills, at high tide, with spare moments - an hour here, a morning there. Merchants in a hurry will pay to borrow them.'],
    asset: { id: 'ch7_tidewell', label: 'Tidewell of Moments', cost: 450, monthlyCashflow: 165, sector: 'transcendence' },
    accept: { id: 'buy_tidewell', label: 'Buy the well (450g, +165g/month)', effects: [{ kind: 'narrate', text: 'You sell time by the bucket. Somehow, the accounts still balance.' }] },
    decline: { id: 'pass_tidewell', label: 'Decline', text: 'The tide comes in, and the moments drain away unsold.' },
  }),
  venture({
    id: 'ch7_exchange_between_worlds',
    weight: 3,
    title: 'The Exchange Between Worlds',
    body: ['Where the sky tore open, traders from somewhere else have set up stalls. They will trade with this world through a single broker - one with nerve enough to stand in the rift and haggle.'],
    asset: { id: 'ch7_world_exchange', label: 'Exchange Between Worlds', cost: 900, monthlyCashflow: 450, sector: 'transcendence' },
    accept: {
      id: 'broker_worlds',
      label: 'Stand in the rift and broker (900g, +450g/month)',
      requires: [{ kind: 'statAtLeast', stat: 'nerve', value: 8 }],
      showLockedAs: 'Needs Nerve 8 and 900g',
      effects: [{ kind: 'narrate', text: 'You haggle with things that have no faces, and win. Two worlds now trade through your hands.' }],
    },
    decline: { id: 'pass_worlds', label: 'Not yet', text: 'The rift hums, patient. It will still be there.' },
  }),
]
