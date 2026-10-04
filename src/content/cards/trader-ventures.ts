import type { StoryCard } from '../../engine/types'
import { standing, STANDING_THRESHOLD, standingAtLeast } from '../standings'
import { venture } from './factories'

// THE TRADER'S LADDER
// Every chapter offers honest trade at every price point, so buying in is always
// an option and the player visibly grows from market stall to world-spanning
// exchange. Each chapter has:
//   - two cheap entries (~25-35% of the chapter's big deals) to restart after a reckoning
//   - a mid-sized venture
//   - a premium, high-return venture, shown locked behind a stat until earned
// Honest trade never adds heat and earns Guild standing. The criminal deals in
// the chapter decks pay a little better per gold - and draw the Colossi's attention.

export const chapter2TraderVentures: StoryCard[] = [
  venture({
    id: 'ch2_market_stall_lease',
    weight: 4,
    title: 'A Stall at the Night Market',
    body: ['Lanterns bob above the night market, and the crowds never go home. An old weaver pats her striped stall. "I\'m off to the hills, dear. 50 gold, and my regulars are yours."'],
    asset: { id: 'ch2_market_stall', label: 'Night Market Stall', cost: 50, monthlyCashflow: 15, sector: 'trade' },
    accept: { id: 'lease_stall', label: 'Take over the stall (50g, +15g/month)', effects: [{ kind: 'narrate', text: 'Lanterns, haggling, and a cashbox that fills a little every night. Honest work in a sneaky city.' }, standing('guilds', 1)] },
    decline: { id: 'pass_stall', label: 'Let someone else have it', text: 'By morning, a stranger\'s lantern hangs from her awning.' },
  }),
  venture({
    id: 'ch2_porter_crew',
    weight: 4,
    title: 'Dockside Porter Crew',
    body: ['6 broad-shouldered porters stand around a broken cart. Their foreman ran off with the gangs. "Buy us new ropes and carts," says the biggest, "and we\'ll haul for you. Fair and square."'],
    asset: { id: 'ch2_porter_crew', label: 'Dockside Porter Crew', cost: 70, monthlyCashflow: 21, sector: 'trade' },
    accept: { id: 'hire_porters', label: 'Equip the crew (70g, +21g/month)', effects: [{ kind: 'narrate', text: 'Your porters are the only crew on the docks nobody has to bribe. Soon, everyone wants them.' }, standing('guilds', 1)] },
    decline: { id: 'pass_porters', label: 'Not now', text: 'The porters shoulder their broken cart and trudge away.' },
  }),
  venture({
    id: 'ch2_spice_kiosk_chain',
    weight: 3,
    title: 'A Chain of Tea Kiosks',
    body: ['A copper kettle whistles on the corner. Everyone buys spiced tea after dark, even the Watch. The tea seller grins. "Help me open kiosks in 3 districts, and we split the takings."'],
    asset: { id: 'ch2_tea_kiosks', label: 'Tea Kiosk Chain', cost: 140, monthlyCashflow: 42, sector: 'spice' },
    accept: { id: 'fund_kiosks', label: 'Fund the kiosks (140g, +42g/month)', effects: [{ kind: 'narrate', text: '3 districts, 1 recipe, and steam rising from your kiosks all night long.' }, standing('guilds', 1)] },
    decline: { id: 'pass_kiosks', label: 'Wish her luck', text: 'She finds a rich cousin instead. The kettles whistle without you.' },
  }),
  venture({
    id: 'ch2_harbour_warehouse_syndicate',
    weight: 3,
    title: 'The Harbour Warehouse Syndicate',
    body: ['The great harbour warehouses are for sale, all in one block. Whoever owns them decides what every ship pays to store its cargo. The sellers want a buyer who really understands a ledger.'],
    asset: { id: 'ch2_harbour_warehouses', label: 'Harbour Warehouse Syndicate', cost: 300, monthlyCashflow: 135, sector: 'trade' },
    accept: {
      id: 'buy_warehouses',
      label: 'Buy the warehouse block (300g, +135g/month)',
      requires: [{ kind: 'statAtLeast', stat: 'savvy', value: 4 }],
      showLockedAs: 'Needs Savvy 4 and 300g',
      effects: [{ kind: 'narrate', text: 'Every crate that lands in Vessarin now pays you rent. Even the gangs store their goods with you.' }, standing('guilds', 1)],
    },
    decline: { id: 'pass_warehouses', label: 'Too big a bite for now', text: 'The warehouses sit empty a while longer. They will not wait forever.' },
  }),
]

export const chapter3TraderVentures: StoryCard[] = [
  venture({
    id: 'ch3_sutlers_wagon',
    weight: 4,
    title: 'A Wagon That Follows the Army',
    body: ['Soldiers on the march are tired of army biscuits. They will pay for figs, thread and boot polish. A woman with a painted wagon wants to sell it, and her place behind the army.'],
    asset: { id: 'ch3_sutlers_wagon', label: 'Sutler\'s Wagon', cost: 80, monthlyCashflow: 26, sector: 'trade' },
    accept: { id: 'buy_wagon', label: 'Buy the wagon (80g, +26g/month)', effects: [{ kind: 'narrate', text: 'Your wagon trundles behind the army. Tired soldiers queue up for a little comfort.' }, standing('guilds', 1)] },
    decline: { id: 'pass_wagon', label: 'Let it roll on', text: 'The painted wagon rolls off with a new owner at the reins.' },
  }),
  venture({
    id: 'ch3_linen_supply',
    weight: 4,
    title: 'Linen and Bandages',
    body: ['Clack, clack, clack. A widow works 2 looms as fast as she can, but the army hospitals always need more bandages. "Buy me yarn," she says, "and I\'ll weave day and night."'],
    asset: { id: 'ch3_linen_supply', label: 'Bandage Linen Supply', cost: 110, monthlyCashflow: 33, sector: 'health' },
    accept: { id: 'fund_linen', label: 'Fund the looms (110g, +33g/month)', effects: [{ kind: 'narrate', text: 'Your linen bandages soldiers on both banks of the river. Good money, and good work.' }, standing('guilds', 1)] },
    decline: { id: 'pass_linen', label: 'Not today', text: 'The clacking slows, and then the looms fall quiet.' },
  }),
  venture({
    id: 'ch3_remount_contract',
    weight: 3,
    title: 'Horses for the Cavalry',
    body: ['The cavalry needs fresh horses, always. A horse trader with hay in her hair offers you a share in her farm. "The quartermaster buys every horse we raise," she says.'],
    asset: { id: 'ch3_remount_farm', label: 'Remount Farm Share', cost: 220, monthlyCashflow: 66, sector: 'military' },
    accept: { id: 'buy_remounts', label: 'Buy into the farm (220g, +66g/month)', effects: [{ kind: 'narrate', text: 'Every spring your foals trot off to the army, and the crown pays for every one.' }, standing('guilds', 1)] },
    decline: { id: 'pass_remounts', label: 'Not today', text: 'The quartermaster buys his horses from someone else.' },
  }),
  venture({
    id: 'ch3_royal_victualling_charter',
    weight: 3,
    title: 'Feeding the Whole Army',
    body: ['One merchant will win the right to feed the whole northern army: bread, cheese, salt pork, the lot. The Lord Commissary will choose over dinner. He picks whoever he likes best.'],
    asset: { id: 'ch3_victualling_charter', label: 'Royal Victualling Charter', cost: 450, monthlyCashflow: 200, sector: 'military' },
    accept: {
      id: 'win_charter',
      label: 'Win the charter (450g, +200g/month)',
      requires: [{ kind: 'anyOf', of: [{ kind: 'statAtLeast', stat: 'charm', value: 4 }, standingAtLeast('crown', STANDING_THRESHOLD)] }],
      showLockedAs: `Needs 450g and Charm 4 or Crown standing ${STANDING_THRESHOLD}`,
      effects: [{ kind: 'narrate', text: 'The Commissary raises his glass to you. 40,000 soldiers now eat your bread, and the crown pays the bill.' }, standing('guilds', 1)],
    },
    decline: { id: 'pass_charter', label: 'Not this time', text: 'The charter goes to a merchant with better manners and deeper pockets.' },
  }),
]

export const chapter4TraderVentures: StoryCard[] = [
  venture({
    id: 'ch4_money_changer_booth',
    weight: 4,
    title: 'A Money-Changer\'s Booth',
    body: ['Travellers crowd the counting-house steps with 12 kinds of coin. They all need to swap. A money-changer\'s booth is for sale, brass scales included.'],
    asset: { id: 'ch4_changer_booth', label: 'Money-Changer\'s Booth', cost: 100, monthlyCashflow: 32, sector: 'banking' },
    accept: { id: 'buy_booth', label: 'Buy the booth (100g, +32g/month)', effects: [{ kind: 'narrate', text: 'A tiny slice of every swap is yours. Small coins, but they never stop.' }, standing('guilds', 1)] },
    decline: { id: 'pass_booth', label: 'Let it go', text: 'The booth is sold by noon.' },
  }),
  venture({
    id: 'ch4_bills_courier',
    weight: 4,
    title: 'Riders with Paper Gold',
    body: ['Nobody carries gold on the roads anymore. They carry paper promises instead, much lighter to steal. A courier service needs fast horses and honest riders to carry them.'],
    asset: { id: 'ch4_bills_courier', label: 'Bills of Exchange Courier', cost: 140, monthlyCashflow: 45, sector: 'trade' },
    accept: { id: 'fund_courier', label: 'Fund the courier service (140g, +45g/month)', effects: [{ kind: 'narrate', text: 'Your riders gallop between cities with fortunes in their satchels. You earn a fee for every one.' }, standing('guilds', 1)] },
    decline: { id: 'pass_courier', label: 'Not today', text: 'The riders sign on with a rival bank.' },
  }),
  venture({
    id: 'ch4_merchant_credit_union',
    weight: 3,
    title: 'A Bank for Small Traders',
    body: ['The big banks laugh at small traders. A fruit seller has a plan: everyone saves together, and borrows from the pot at fair rates. "We just need someone to start it," she says.'],
    asset: { id: 'ch4_credit_union', label: 'Merchant Credit Union', cost: 260, monthlyCashflow: 85, sector: 'banking' },
    accept: { id: 'found_union', label: 'Found the union (260g, +85g/month)', effects: [{ kind: 'narrate', text: 'Stall-keepers who once begged for loans now bank with you. They never forget who helped.' }, standing('guilds', 1)] },
    decline: { id: 'pass_union', label: 'Not today', text: 'The traders go back to borrowing from loan sharks.' },
  }),
  venture({
    id: 'ch4_letters_of_credit_house',
    weight: 3,
    title: 'A House of Golden Letters',
    body: ['Imagine a letter with your seal that works like gold, anywhere from the salt flats to the spice isles. Starting such a house takes a fortune, and a very sharp mind.'],
    asset: { id: 'ch4_credit_house', label: 'House of Letters of Credit', cost: 600, monthlyCashflow: 270, sector: 'banking' },
    accept: {
      id: 'found_credit_house',
      label: 'Found the house (600g, +270g/month)',
      requires: [{ kind: 'statAtLeast', stat: 'savvy', value: 8 }],
      showLockedAs: 'Needs Savvy 8 and 600g',
      effects: [{ kind: 'narrate', text: 'Your seal is as good as gold. Merchants on 3 continents trust a paper because your name is on it.' }, standing('guilds', 1)],
    },
    decline: { id: 'pass_credit_house', label: 'Not yet', text: 'The idea will keep. First, you need the fortune.' },
  }),
]

export const chapter5TraderVentures: StoryCard[] = [
  venture({
    id: 'ch5_herb_garden_plots',
    weight: 4,
    title: 'The Forgotten Herb Gardens',
    body: ['Sage, mint and feverfew: the healers cannot get enough. Outside the walls, old garden plots lie forgotten under weeds. They are cheap, if someone will dig.'],
    asset: { id: 'ch5_herb_gardens', label: 'Herb Garden Plots', cost: 110, monthlyCashflow: 36, sector: 'health' },
    accept: { id: 'plant_herbs', label: 'Plant the gardens (110g, +36g/month)', effects: [{ kind: 'narrate', text: 'Green shoots push up while the city is sick. The healers buy every bundle you grow.' }, standing('guilds', 1)] },
    decline: { id: 'pass_herbs', label: 'Leave them to the weeds', text: 'The weeds win. The gardens stay forgotten.' },
  }),
  venture({
    id: 'ch5_bread_deliveries',
    weight: 4,
    title: 'Bread for the Closed Streets',
    body: ['Some streets are closed while the sickness passes, but people inside still need bread. The bakers will pay well for carts that leave fresh loaves at the gates.'],
    asset: { id: 'ch5_bread_rounds', label: 'Quarantine Bread Rounds', cost: 150, monthlyCashflow: 50, sector: 'trade' },
    accept: { id: 'run_bread_rounds', label: 'Set up the rounds (150g, +50g/month)', effects: [{ kind: 'narrate', text: 'Your carts rattle through the quiet streets. Windows open, and people wave as they pass.' }, standing('guilds', 1)] },
    decline: { id: 'pass_bread', label: 'Not today', text: 'The bakers find braver runners.' },
  }),
  venture({
    id: 'ch5_vinegar_lime_works',
    weight: 3,
    title: 'Vinegar and Lime Works',
    body: ['The doctors say vinegar keeps the sickness away. Now every home wants a bottle. An old, empty distillery could make barrels of it.'],
    asset: { id: 'ch5_vinegar_works', label: 'Vinegar & Lime Works', cost: 300, monthlyCashflow: 100, sector: 'craft' },
    accept: { id: 'convert_distillery', label: 'Convert the distillery (300g, +100g/month)', effects: [{ kind: 'narrate', text: 'The whole district smells of your vinegar, and the whole district thanks you for it.' }, standing('guilds', 1)] },
    decline: { id: 'pass_vinegar', label: 'Not today', text: 'The old distillery stays dark and dusty.' },
  }),
  venture({
    id: 'ch5_physicians_underwriting',
    weight: 3,
    title: 'Keep the Healers Going',
    body: ['The healers\' guild is running out of money helping the poor. Back them, and the city will pay you for every sickroom kept open. But you must visit the sickrooms yourself, to check the books.'],
    asset: { id: 'ch5_physicians_bond', label: 'Physicians\' Guild Underwriting', cost: 700, monthlyCashflow: 320, sector: 'health' },
    accept: {
      id: 'underwrite_physicians',
      label: 'Underwrite the guild (700g, +320g/month)',
      requires: [{ kind: 'statAtLeast', stat: 'grit', value: 6 }],
      showLockedAs: 'Needs Grit 6 and 700g',
      effects: [{ kind: 'narrate', text: 'You walk the sickrooms with a lantern and a ledger. They stay open, and the city pays.' }, standing('guilds', 1)],
    },
    decline: { id: 'pass_physicians', label: 'Not now', text: 'The healers struggle on without you.' },
  }),
]

export const chapter6TraderVentures: StoryCard[] = [
  venture({
    id: 'ch6_pigeon_loft',
    weight: 4,
    title: 'The Pigeon Loft',
    body: ['Nobody trusts messengers anymore. But a pigeon cannot be bribed! An old bird-keeper wants to sell his rooftop loft, full of cooing birds.'],
    asset: { id: 'ch6_pigeon_loft', label: 'Courier Pigeon Loft', cost: 130, monthlyCashflow: 45, sector: 'trade' },
    accept: { id: 'buy_loft', label: 'Buy the loft (130g, +45g/month)', effects: [{ kind: 'narrate', text: 'Secret messages flap from your rooftop to every city on the coast. Nobody peeks.' }, standing('guilds', 1)] },
    decline: { id: 'pass_loft', label: 'Shoo', text: 'The pigeons coo goodbye and go to a new keeper.' },
  }),
  venture({
    id: 'ch6_sealed_ledger_notary',
    weight: 4,
    title: 'The Keeper of Sealed Books',
    body: ['Partners who don\'t trust each other still need to trade. Someone has to keep their account books locked up safe, where neither can cheat. That someone gets paid by both.'],
    asset: { id: 'ch6_notary', label: 'Sealed Ledger Notary', cost: 170, monthlyCashflow: 58, sector: 'trade' },
    accept: { id: 'open_notary', label: 'Open the notary office (170g, +58g/month)', effects: [{ kind: 'narrate', text: 'Your wax seal is the one thing rival merchants agree on. They pay well for it.' }, standing('guilds', 1)] },
    decline: { id: 'pass_notary', label: 'Not today', text: 'The partners go on glaring at each other.' },
  }),
  venture({
    id: 'ch6_bonded_escrow_warehouse',
    weight: 3,
    title: 'The Honest Warehouse',
    body: ['Nobody hands over goods first anymore. They want someone honest to hold them until both sides pay. A guarded warehouse with a good name could be the busiest place in town.'],
    asset: { id: 'ch6_escrow_warehouse', label: 'Bonded Escrow Warehouse', cost: 380, monthlyCashflow: 130, sector: 'trade' },
    accept: { id: 'build_escrow', label: 'Build the warehouse (380g, +130g/month)', effects: [{ kind: 'narrate', text: 'Buyers and sellers who would never shake hands both trust their goods to you.' }, standing('guilds', 1)] },
    decline: { id: 'pass_escrow', label: 'Not today', text: 'A rival takes the idea. His warehouse is not quite so honest.' },
  }),
  venture({
    id: 'ch6_neutral_exchange',
    weight: 3,
    title: 'The Neutral Exchange',
    body: ['Every group in the city wants to trade, but none will trade with the others. A neutral exchange could fix that, with one fair person in charge. They must all like you, though.'],
    asset: { id: 'ch6_neutral_exchange', label: 'The Neutral Exchange', cost: 800, monthlyCashflow: 380, sector: 'trade' },
    accept: {
      id: 'chair_exchange',
      label: 'Found and chair the exchange (800g, +380g/month)',
      requires: [{ kind: 'anyOf', of: [{ kind: 'statAtLeast', stat: 'charm', value: 5 }, standingAtLeast('guilds', STANDING_THRESHOLD)] }],
      showLockedAs: `Needs 800g and Charm 5 or Guilds standing ${STANDING_THRESHOLD}`,
      effects: [{ kind: 'narrate', text: 'Sworn enemies bow to you from opposite ends of the trading floor. All of them pay the fee.' }, standing('guilds', 1)],
    },
    decline: { id: 'pass_exchange', label: 'Not yet', text: 'The rivals go back to trading through smugglers.' },
  }),
]

export const chapter7TraderVentures: StoryCard[] = [
  venture({
    id: 'ch7_star_chart_almanacs',
    weight: 4,
    title: 'Star-Chart Almanacs',
    body: ['The stars have moved! Sailors are lost without new charts. An astronomer with ink on her nose has mapped the new sky. "I need a printer," she says. "And a partner."'],
    asset: { id: 'ch7_almanacs', label: 'Star-Chart Almanacs', cost: 150, monthlyCashflow: 55, sector: 'transcendence' },
    accept: { id: 'print_almanacs', label: 'Print the almanacs (150g, +55g/month)', effects: [{ kind: 'narrate', text: 'Every ship in the harbour now steers by stars you sold them.' }, standing('guilds', 1)] },
    decline: { id: 'pass_almanacs', label: 'Not today', text: 'She rolls up her star maps and looks for another partner.' },
  }),
  venture({
    id: 'ch7_dreamweaver_looms',
    weight: 4,
    title: 'Dreamweaver Looms',
    body: ['A weaver shows you cloth that shimmers with dreams. Touch it, and you see flying ships. Nobles pay a fortune for a single roll. She needs looms, and a partner who won\'t ask how.'],
    asset: { id: 'ch7_dream_looms', label: 'Dreamweaver Looms', cost: 220, monthlyCashflow: 80, sector: 'craft' },
    accept: { id: 'fund_looms', label: 'Fund the looms (220g, +80g/month)', effects: [{ kind: 'narrate', text: 'Silk shimmers with other people\'s dreams. The nobles cannot get enough of it.' }, standing('guilds', 1)] },
    decline: { id: 'pass_looms', label: 'Not today', text: 'The weaver\'s dreams stay unwoven.' },
  }),
  venture({
    id: 'ch7_tidewell_of_moments',
    weight: 3,
    title: 'The Tidewell of Moments',
    body: ['At high tide, an old well fills with spare time. An hour here, a whole morning there. Busy merchants will pay anything to borrow a bucket of it.'],
    asset: { id: 'ch7_tidewell', label: 'Tidewell of Moments', cost: 450, monthlyCashflow: 165, sector: 'transcendence' },
    accept: { id: 'buy_tidewell', label: 'Buy the well (450g, +165g/month)', effects: [{ kind: 'narrate', text: 'You sell time by the bucket. Somehow, the sums still add up.' }, standing('guilds', 1)] },
    decline: { id: 'pass_tidewell', label: 'Not today', text: 'The tide comes in, and the spare moments drain away unsold.' },
  }),
  venture({
    id: 'ch7_exchange_between_worlds',
    weight: 3,
    title: 'The Exchange Between Worlds',
    body: ['Where the sky split open, strange traders with starry eyes have set up stalls. They will deal with just one person from Vessarin. Someone brave enough to stand in the glowing rift and haggle.'],
    asset: { id: 'ch7_world_exchange', label: 'Exchange Between Worlds', cost: 900, monthlyCashflow: 450, sector: 'transcendence' },
    accept: {
      id: 'broker_worlds',
      label: 'Stand in the rift and broker (900g, +450g/month)',
      requires: [{ kind: 'statAtLeast', stat: 'nerve', value: 8 }],
      showLockedAs: 'Needs Nerve 8 and 900g',
      effects: [{ kind: 'narrate', text: 'You haggle with starry-eyed strangers, and win. 2 worlds now trade through your hands.' }, standing('guilds', 1)],
    },
    decline: { id: 'pass_worlds', label: 'Not yet', text: 'The rift hums patiently. It will still be there.' },
  }),
]
