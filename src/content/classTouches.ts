import type { CardId, Choice, Effect, Outcome, StatId, StoryCard } from '../engine/types'
import { HERO_CLASSES } from './heroes'
import { standing } from './standings'

// CLASS TOUCHES
// Shared cards stay shared, but each class notices different things and has
// its own way out: a line of story only that class reads, and a choice only
// that class sees. Added here, at campaign build, so card files stay as they
// are. Other classes never see these (no locked hint), to keep cards tidy.

interface Touch {
  classId: string
  /** One sentence added to the card's story, for this class only */
  line: string
  choice: Omit<Choice, 'id'>
}

const gold = (delta: number): Effect => ({ kind: 'gold', delta })
const say = (text: string): Effect => ({ kind: 'narrate', text })
const check = (stat: StatId, dc: number, success: Outcome, failure: Outcome): Choice['check'] => ({ stat, dc, success, failure })

export const CLASS_TOUCHES: Record<CardId, Touch> = {
  // ---------------- Caravan Guard ----------------
  bandit_toll: { classId: 'guard', line: 'You know this trick: three bandits, one log, and nobody behind them.', choice: { label: 'Stare them down (Grit check, DC 11)', check: check('grit', 11, { text: 'You plant your shield on the road and wait. One by one, they shuffle off into the trees.' }, { text: 'They don\'t budge. You pay up, grumbling.', effects: [gold(-20)] }) } },
  bandit_encounter: { classId: 'guard', line: 'Their leader holds his sword all wrong. These are farmers, not fighters.', choice: { label: 'Show them a real guard (Grit check, DC 12: +40g)', check: check('grit', 12, { text: 'You disarm the leader with one move. The gang hands over the coins they stole from the last traveller.', effects: [gold(40)] }, { text: 'There are too many of them. You toss them 50 gold and walk on.', effects: [gold(-50)] }) } },
  ch3_ambush_on_supply_run: { classId: 'guard', line: 'You saw the cut ropes on that tree a mile back. You were half expecting this.', choice: { label: 'Form the wagons into a ring (Grit check, DC 13: +80g)', check: check('grit', 13, { text: 'The wagons circle, shields up. The bandits find nothing to grab and flee. The army pays a bonus for the safe delivery.', effects: [gold(80)] }, { text: 'They break through the ring and take some crates.', effects: [gold(-120)] }) } },
  ch2_gang_enforcer_visit: { classId: 'guard', line: 'You have guarded tougher doors than this one.', choice: { label: 'Fold your arms and block the door (Grit check, DC 13)', check: check('grit', 13, { text: 'Two big people, one doorway. After a long minute he blinks first and leaves.' }, { text: 'He shoves past you and helps himself to 200 gold.', effects: [gold(-200)] }) } },
  extortion_racket: { classId: 'guard', line: 'You recognise one of them. He once ran from you on the coast road.', choice: { label: 'Remind him of the coast road', effects: [say('His face goes pale. "Oh. It\'s you." The three of them leave, and never come back.')] } },
  ch2_protection_racket_squeeze: { classId: 'guard', line: 'You are the one who should be selling protection here.', choice: { label: 'Offer to guard the street yourself (+60g, +1 Common Folk)', effects: [gold(60), standing('folk', 1), say('The shopkeepers pay you instead. The syndicate finds the street suddenly very well guarded.')] } },
  warehouse_hostage: { classId: 'guard', line: 'Every warehouse has a back door. You guarded this one once.', choice: { label: 'Slip in the back way (Grit check, DC 13)', check: check('grit', 13, { text: 'You burst in through the back. The thieves tumble out the front, straight into the Watch.' }, { text: 'They hear you coming and smash half the goods as they flee.', effects: [gold(-150)] }) } },
  ch3_military_convoy_raid: { classId: 'guard', line: 'The soldiers chase the wrong way. You saw where the bandits really went.', choice: { label: 'Lead the soldiers to the bandits (+90g, +1 Crown)', effects: [gold(90), standing('crown', 1), say('You point the way, and the soldiers catch every bandit. Their captain pays you a reward.')] } },
  guild_quest_offer: { classId: 'guard', line: 'Guarding caravans is exactly what you do.', choice: { label: 'Show them your guard record (+20g wages)', effects: [{ kind: 'wages', delta: 20 }, say('The factor reads your record and signs at once. "Finally, someone who knows the roads."')] } },
  ch6_assassination_contract: { classId: 'guard', line: 'You have kept watch through a hundred dangerous nights.', choice: { label: 'Keep watch all night yourself (Grit check, DC 15)', check: check('grit', 15, { text: 'You stand at the door with a lantern until dawn. The thugs take one look and go home.' }, { text: 'You nod off just before dawn. They wreck the shop and run.', effects: [gold(-300)] }) } },
  debt_collector_violence: { classId: 'guard', line: 'These are bullies. You have handled bullies before.', choice: { label: 'Stand between them and your workers (Grit check, DC 14)', check: check('grit', 14, { text: 'You do not move an inch. The enforcers grumble and leave you a month to pay.' }, { text: 'They push past you. You pay them to go.', effects: [gold(-250)] }) } },
  dragon_sighting: { classId: 'guard', line: 'Caravans will need a brave guard to get past the mountains now.', choice: { label: 'Escort the caravans past the dragon (+120g)', effects: [gold(120), say('You lead caravan after caravan the long way round. The dragon never sees you, and the merchants pay well.')] } },

  // ---------------- Smuggler ----------------
  spice_market_rumor: { classId: 'smuggler', line: 'Blockades are just walls with holes in them, if you know where to look.', choice: { label: 'Sneak a boatload of spice past the blockade (Nerve check, DC 13: +90g)', check: check('nerve', 13, { text: 'You slip through the blockade by moonlight and sell the spice at triple price.', effects: [gold(90)] }, { text: 'A patrol boat spots you. You dump the cargo and row for it.', effects: [gold(-30)] }) } },
  ch2_supply_drought: { classId: 'smuggler', line: 'You already know three secret routes nobody else does.', choice: { label: 'Open your secret routes (+250g)', effects: [gold(250), say('Your old goat tracks and hidden coves are suddenly worth a fortune.')] } },
  ch3_enemy_territory_trade: { classId: 'smuggler', line: 'Crossing lines at night is the oldest trick in your book.', choice: { label: 'Make the run your way (Nerve check, DC 12: +260g)', check: check('nerve', 12, { text: 'In and out without a sound. Both sides pay, and neither ever saw you.', effects: [gold(260)] }, { text: 'You get there, but have to leave half the goods behind.', effects: [gold(80)] }) } },
  ch5_quarantine_economy: { classId: 'smuggler', line: 'The canals under the closed districts are your old smuggling roads.', choice: { label: 'Ferry food through the canals (+250g, +1 Common Folk)', effects: [gold(250), standing('folk', 1), say('Your boats glide under the ropes every night. Families inside call you the Canal Ghost.')] } },
  ch2_police_shakedown: { classId: 'smuggler', line: 'You know this alley has a second way out.', choice: { label: 'Vanish down the side alley', effects: [say('You step left, duck right, and they are clubbing at empty air.')] } },
  black_market: { classId: 'smuggler', line: 'You have dealt with this hooded woman before. She owes you a favour.', choice: { label: 'Call in her favour (Nerve check, DC 12: +200g)', check: check('nerve', 12, { text: 'She gives you a dealer\'s price. You resell the lot for 200 gold profit.', effects: [gold(200)] }, { text: 'She has forgotten the favour. Nothing lost, nothing gained.' }) } },
  ch2_police_crackdown: { classId: 'smuggler', line: 'A crackdown is just a new puzzle for a good smuggler.', choice: { label: 'Fill the gap the crackdown left (Nerve check, DC 14: +200g)', check: check('nerve', 14, { text: 'With the big gangs hiding, your quiet boats carry everything. Profit!', effects: [gold(200)] }, { text: 'The Watch is everywhere. You lie low after all.' }) } },
  spice_shortage_crisis: { classId: 'smuggler', line: 'The bandits blocked the road. They forgot the river.', choice: { label: 'Bring spice down the river (+120g, +1 Common Folk)', effects: [gold(120), standing('folk', 1), say('Your river boats bring spice to the cooks and bakers at a fair price.')] } },
  captain_vex_heist: { classId: 'smuggler', line: 'Vex grins. He has heard of you. "A real smuggler! This will be easy."', choice: { label: 'Do it the smuggler\'s way (Nerve check, DC 12)', check: check('nerve', 12, { text: 'You hide the silk under a cart of smelly fish. No guard looks twice.', goto: 'vex_heist_success' }, { text: 'Even the fish trick fails today.', goto: 'vex_heist_failure' }) } },
  ch3_caught_trading_enemies: { classId: 'smuggler', line: 'You always keep a fast boat ready for exactly this moment.', choice: { label: 'Escape on your fast boat (-100g)', effects: [gold(-100), say('You sail away by night, and come back weeks later when everyone has forgotten.')] } },
  corrupt_guard: { classId: 'smuggler', line: 'You know this guard. He takes bribes from three different gangs.', choice: { label: 'Tell him what you know about him (Nerve check, DC 12)', check: check('nerve', 12, { text: 'His face goes white. "I never saw you," he says quickly, and walks away.' }, { text: 'He laughs it off. You will have to deal with him another way.' }) } },
  treasure_map_quest: { classId: 'smuggler', line: 'You know that island. Smugglers used to hide loot there.', choice: { label: 'Sail there yourself (Nerve check, DC 13: +300g)', check: check('nerve', 13, { text: 'You dig under the old smugglers\' tree and find a chest of coins!', effects: [gold(300)] }, { text: 'Someone got there first. Only an empty chest remains.' }) } },

  // ---------------- Alchemist ----------------
  cursed_artifact: { classId: 'alchemist', line: 'You notice a faint green crust on the statue. That is not a curse. That is copper.', choice: { label: 'Clean it with your reagents (+160g)', effects: [gold(160), say('A drop of vinegar, a little polish, and the "cursed" statue gleams. A museum buys it happily.')] } },
  plague_cure: { classId: 'alchemist', line: 'You read her notes. The recipe is good, but the dose is wrong.', choice: { label: 'Fix the recipe together (Savvy check, DC 12: +100g)', check: check('savvy', 12, { text: 'With your fix, the cure works perfectly. The city pays you both a reward.', effects: [gold(100), standing('folk', 2)] }, { text: 'The fix doesn\'t work. Back to the drawing board.' }) } },
  ancient_tome: { classId: 'alchemist', line: 'You can read the old alchemist\'s code in the margins.', choice: { label: 'Decode the margins (Savvy check, DC 12)', check: check('savvy', 12, { text: 'The margins hold a recipe for a fine golden ink. You sell it to the scribes\' guild.', effects: [gold(120)] }, { text: 'The code is too old to crack. Still a lovely book.' }) } },
  ch5_plague_medicine: { classId: 'alchemist', line: 'You could brew this medicine yourself, at a fraction of the price.', choice: { label: 'Brew it cheaply for everyone (+200g, +2 Common Folk)', effects: [gold(200), standing('folk', 2), say('Your cheap medicine reaches every street. The city loves you, and it still pays.')] } },
  ch5_infection_risk: { classId: 'alchemist', line: 'You know three remedies for this fever. One of them might even taste nice.', choice: { label: 'Brew your own remedy (Savvy check, DC 13)', check: check('savvy', 13, { text: 'Your own remedy works. You are back on your feet in 2 days.' }, { text: 'Your remedy only half works. You need the healer after all.', effects: [gold(-200)] }) } },
  market_crash: { classId: 'alchemist', line: 'You did the sums last night. Iron will bounce back within the year.', choice: { label: 'Trust your sums and buy (+150g)', effects: [gold(150), say('Your maths was right. When iron recovers, you sell for a fine profit.')] } },
  expert_tip: { classId: 'alchemist', line: 'His tip matches your own calculations exactly.', choice: { label: 'Act on both (Savvy check, DC 12: +150g)', check: check('savvy', 12, { text: 'Your numbers and his gossip agree. The trade pays off beautifully.', effects: [gold(150)] }, { text: 'The market wobbles the wrong way first. You break even.' }) } },
  ch4_crown_devalues_currency: { classId: 'alchemist', line: 'You can test a coin\'s gold just by its weight. You noticed the change last week.', choice: { label: 'Swap your coins for goods early (+300g)', effects: [gold(300), say('You moved your savings into goods days ago. When the thin coins arrive, you are ready.')] } },
  ch4_financial_audit: { classId: 'alchemist', line: 'Numbers are your favourite thing. You almost look forward to this.', choice: { label: 'Explain every sum with a smile (Savvy check, DC 13)', check: check('savvy', 13, { text: 'You walk the auditors through every page. They leave impressed, and slightly dizzy.' }, { text: 'One tiny mistake slipped through. A small fine.', effects: [gold(-80)] }) } },
  haunted_house: { classId: 'alchemist', line: 'Strange glowing lights? Probably marsh gas. You have bottled it before.', choice: { label: 'Prove it is just marsh gas (+250g)', effects: [gold(250), say('You catch the "ghost" in a jar: glowing marsh gas. You buy the manor for a song.')] } },
  ch7_artifact_collection: { classId: 'alchemist', line: 'You recognise the clock. Professor Quill made it.', choice: { label: 'Tell the collector who made it (+200g)', effects: [gold(200), say('The collector gasps. "Quill\'s work? Then you must have it." He pays you to take care of it.')] } },
  wizard_offer: { classId: 'alchemist', line: 'She studied with Professor Quill too. You are practically family.', choice: { label: 'Share your notes instead of gold (+1 Savvy)', effects: [{ kind: 'stat', stat: 'savvy', delta: 1 }, say('You swap notes all evening. Both of you learn something new.')] } },

  // ---------------- Silver Tongue ----------------
  salt_caravan_pitch: { classId: 'silverTongue', line: 'You know a fellow performer when you see one. He is acting.', choice: { label: 'Out-talk him (Charm check, DC 12)', check: check('charm', 12, { text: 'You tease the truth out of him with a song and a smile. He drops his price to 150.', goto: 'salt_caravan_deal' }, { text: 'He sticks to his story.', effects: [{ kind: 'flag', id: 'overpriced_salt', set: 1 }], goto: 'salt_caravan_deal' }) } },
  dockside_tavern: { classId: 'silverTongue', line: 'The fiddler waves at you. They have been hoping you would come.', choice: { label: 'Sing for your supper (+70g)', effects: [gold(70), say('You sing three songs and the hat comes back heavy with coins.')] } },
  traveling_bard: { classId: 'silverTongue', line: 'He is singing the third verse wrong.', choice: { label: 'Join in with the right verse (+40g, +1 Common Folk)', effects: [gold(40), standing('folk', 1), say('You take the harmony and the tavern roars. The bard shares the coins with you.')] } },
  rival_emerges: { classId: 'silverTongue', line: 'Rivals are just friends you have not charmed yet.', choice: { label: 'Charm her into a partnership (Charm check, DC 12: +80g)', check: check('charm', 12, { text: 'By the end of the evening you are laughing together, and splitting customers fairly.', effects: [gold(80)] }, { text: 'She is not in the mood for charm today.' }) } },
  ch2_rival_merchant: { classId: 'silverTongue', line: 'A crowd is gathering. You love a crowd.', choice: { label: 'Make the crowd laugh at him (+1 Guilds)', effects: [standing('guilds', 1), say('One joke about his feathered hat and the whole street is giggling. He slinks away.')] } },
  creditor_pressure: { classId: 'silverTongue', line: 'He looks worried. Worried people need cheering up.', choice: { label: 'Cheer him up and buy time (Charm check, DC 11)', check: check('charm', 11, { text: 'You make him laugh so hard he forgets why he came. He gives you another month.' }, { text: 'He is not in a laughing mood. You pay up.', effects: [gold(-40)] }) } },
  moneylenders_offer: { classId: 'silverTongue', line: 'Moneylenders love flattery. This one especially.', choice: { label: 'Flatter him into better terms (+300g, +20g/month to repay)', effects: [{ kind: 'loan', principal: 300, monthlyPayment: 20 }, say('A few compliments about his rings, and the payments drop to 20 a month.')] } },
  ch4_loan_foreclosure: { classId: 'silverTongue', line: 'Lenders are people too. Very grumpy people.', choice: { label: 'Talk them into a long payment plan (Charm check, DC 12)', check: check('charm', 12, { text: 'You charm all three lenders into a gentle payment plan. Crisis over.' }, { text: 'Not today. They take some of your things.', effects: [gold(-250)] }) } },
  noble_seizure: { classId: 'silverTongue', line: 'You once sang at the duke\'s wedding. He cried.', choice: { label: 'Remind the duke of that song (+1 Crown)', effects: [standing('crown', 1), say('You hum the first notes. The duke wipes a tear and picks a different spot for his palace.')] } },
  lawsuit_catastrophe: { classId: 'silverTongue', line: 'A courtroom is just a stage with a grumpy audience.', choice: { label: 'Win over the court (Charm check, DC 13)', check: check('charm', 13, { text: 'Your speech is so good the judge applauds. Case dismissed!' }, { text: 'The judge is not a music lover. You settle quietly.', effects: [gold(-180)] }) } },
  guild_leadership: { classId: 'silverTongue', line: 'The guild master loves your songs.', choice: { label: 'Charm your way to a smaller gift (-300g)', requires: [{ kind: 'goldAtLeast', amount: 300 }], showLockedAs: 'Needs 300g', effects: [gold(-300), standing('guilds', 2), say('A song at the guild dinner, and suddenly the gift is only 300 gold. Welcome to the council!')] } },
  ch6_political_upheaval: { classId: 'silverTongue', line: 'New rulers always want a song about how wonderful they are.', choice: { label: 'Write them a victory song (+150g, +1 Crown)', effects: [gold(150), standing('crown', 1), say('Your song is sung at the new rulers\' feast. They decide you are a very good friend indeed.')] } },
  trader_bulk_purchase: { classId: 'silverTongue', line: 'He is a big man with a big laugh. You can work with that.', choice: { label: 'Haggle with a song (Charm check, DC 11)', check: check('charm', 11, { text: 'He laughs so hard at your haggling song that he pays 50% above market.', effects: [{ kind: 'sellStock', type: 'spice', priceMultiplier: 1.5 }, { kind: 'sellStock', type: 'salt', priceMultiplier: 1.5 }, { kind: 'sellStock', type: 'iron', priceMultiplier: 1.5 }] }, { text: 'He enjoys the song, but pays market price.', effects: [{ kind: 'sellStock', type: 'spice', priceMultiplier: 1 }, { kind: 'sellStock', type: 'salt', priceMultiplier: 1 }, { kind: 'sellStock', type: 'iron', priceMultiplier: 1 }] }) } },

  // ---------------- Healer ----------------
  plague_warning: { classId: 'healer', line: 'You know this cough. Caught early, it is easy to treat.', choice: { label: 'Go and treat the families yourself (+2 Common Folk)', effects: [standing('folk', 2), say('You go door to door with your herbs. The sickness stops before it can spread.')] } },
  plague_outbreak: { classId: 'healer', line: 'You don\'t need to pay a healer. You are one.', choice: { label: 'Nurse them back to health yourself', effects: [say('You sit by their bed for three nights with your best herbs. They get well, and hug you tight.')] } },
  ch3_refugee_family_encounter: { classId: 'healer', line: 'The little one has a fever. You can help right now.', choice: { label: 'Take them in and treat the child (+2 Common Folk)', effects: [standing('folk', 2), say('By morning the fever has broken. The mother cannot stop thanking you.')] } },
  ch3_soldier_deserter: { classId: 'healer', line: 'He is not a coward. He is hurt, and he is exhausted.', choice: { label: 'Treat him and sign him off as wounded (+1 Crown)', effects: [standing('crown', 1), say('You write him an honest healer\'s note. The army sends him home to rest.')] } },
  ch5_plague_riot: { classId: 'healer', line: 'You see faces in the crowd you have healed before.', choice: { label: 'Open a treatment line right there (Charm check, DC 12)', check: check('charm', 12, { text: 'You set up a table and start treating people. The torches go out one by one.', effects: [standing('folk', 1)] }, { text: 'Some listen, some don\'t. You lose a few crates, but nobody gets hurt.', effects: [gold(-80)] }) } },
  the_orphanage: { classId: 'healer', line: 'Half these children have colds. You can help more than gold can.', choice: { label: 'Look after the children for a week (+2 Common Folk)', effects: [standing('folk', 2), say('A week of soup, herbs and bedtime stories. The children are healthy, and the nuns are amazed.')] } },
  supply_plague: { classId: 'healer', line: 'Those villages need a healer more than a buyer.', choice: { label: 'Go and treat the villages (Charm check, DC 13)', check: check('charm', 13, { text: 'The villages recover quickly, and your suppliers send their first shipment as a thank-you.', effects: [gold(100), standing('folk', 1)] }, { text: 'It takes weeks, but the villages recover. Trade starts again slowly.', effects: [{ kind: 'expense', delta: 5 }] }) } },
  friend_crisis: { classId: 'healer', line: 'Your friend is shaking. First things first: a cup of calming tea.', choice: { label: 'Calm them and make a plan together', effects: [say('Over tea you make a plan. Your friend talks to the lenders calmly, and pays them back slowly.')] } },
  refugee_crisis: { classId: 'healer', line: 'Hungry people get sick. You can stop that before it starts.', choice: { label: 'Run a healing kitchen (-40g, +2 Common Folk)', requires: [{ kind: 'goldAtLeast', amount: 40 }], showLockedAs: 'Needs 40g', effects: [gold(-40), standing('folk', 2), say('Soup, bandages and kind words. The streets feel safer within a week.')] } },
  ch5_healer_betrayal: { classId: 'healer', line: 'You can make better medicine than he ever sold.', choice: { label: 'Brew new medicine yourself (+1 Common Folk)', effects: [standing('folk', 1), say('By nightfall you have brewed a fresh batch. Your workers are well by the end of the week.')] } },
  ch5_infection_prevention: { classId: 'healer', line: 'You could teach these healers a thing or two, and run the network yourself.', choice: { label: 'Run the network yourself (200g, +50g/month)', requires: [{ kind: 'goldAtLeast', amount: 200 }], showLockedAs: 'Needs 200g', effects: [gold(-200), { kind: 'acquireAsset', asset: { id: 'ch5_prevention', label: 'Infection Prevention Network', cost: 200, monthlyCashflow: 50, sector: 'health' } }, say('You train the masked healers yourself. Cheaper, cleaner, and the fever stays outside.')] } },
  ch2_witness_to_murder: { classId: 'healer', line: 'The merchant on the ground is hurt. That comes first.', choice: { label: 'Help the merchant up and treat him (+1 Guilds)', effects: [standing('guilds', 1), say('The robbers run off, and you bandage the merchant\'s head. He turns out to be very rich, and very grateful.'), gold(60)] } },

  // ---------------- Prospector ----------------
  treasure_map: { classId: 'prospector', line: 'You know those mountains like the back of your hand.', choice: { label: 'Go straight to the X (Grit check, DC 12: +200g)', check: check('grit', 12, { text: 'You find the spot in one day, and the ruins are full of old coins!', effects: [gold(200)] }, { text: 'Wrong valley. Close, but no treasure this time.' }) } },
  iron_claim_pitch: { classId: 'prospector', line: 'You lick the rock. Good iron, but this claim is smaller than he says.', choice: { label: 'Bargain with what you know (-180g, +20g/month)', requires: [{ kind: 'goldAtLeast', amount: 180 }], showLockedAs: 'Needs 180g', effects: [gold(-180), { kind: 'acquireAsset', asset: { id: 'iron_claim', label: 'Iron Claim', cost: 180, monthlyCashflow: 20, sector: 'iron' } }, say('He sighs. "You know your rocks." You get the claim for 180.')] } },
  iron_mine_collapse: { classId: 'prospector', line: 'You know an old side tunnel into that mine.', choice: { label: 'Help dig out the side tunnel (+100g, +1 Common Folk)', effects: [gold(100), standing('folk', 1), say('Your side tunnel gets the mine working again weeks early. The owners pay you a reward.')] } },
  ancient_ruins: { classId: 'prospector', line: 'Those walls lean the way old walls do when there is a cellar underneath.', choice: { label: 'Look for the hidden cellar (Grit check, DC 12: +220g)', check: check('grit', 12, { text: 'Under a loose flagstone: a cellar full of old silver!', effects: [gold(220)] }, { text: 'Just an empty cellar, and a lot of spiders.' }) } },
  temple_discovery: { classId: 'prospector', line: 'Every old temple has a builders\' tunnel. You know where to look.', choice: { label: 'Use the builders\' tunnel (+200g)', effects: [gold(200), say('You skip every trap through the old builders\' tunnel and come out with the temple treasure.')] } },
  lost_caravan: { classId: 'prospector', line: 'You can read wheel tracks the way others read books.', choice: { label: 'Track the caravan (+180g)', effects: [gold(180), say('The tracks lead you straight to the ravine. The merchant pays a big reward.')] } },
  iron_market_boom: { classId: 'prospector', line: 'You know three iron seams nobody has touched yet.', choice: { label: 'Sell the location of a seam (+150g)', effects: [gold(150), say('A shipwright pays well to know where your secret seam is.')] } },
  mining_syndicate_offer: { classId: 'prospector', line: 'You have seen that mine. It is better than the letter says.', choice: { label: 'Buy two shares (-300g, +60g/month)', requires: [{ kind: 'goldAtLeast', amount: 300 }], showLockedAs: 'Needs 300g', effects: [gold(-300), { kind: 'acquireAsset', asset: { id: 'mining_syndicate_share_double', label: 'Mining Syndicate Shares (2)', cost: 300, monthlyCashflow: 60, sector: 'iron' } }, say('You know a good mine when you see one. Two shares, double the dividends.')] } },
  scrap_iron_collection: { classId: 'prospector', line: 'Half that "scrap" is good iron. The shipyard has no idea.', choice: { label: 'Pick out the good iron (+60g)', effects: [gold(60), say('You sort the heap and sell the best pieces to a blacksmith straight away.')] } },
  salt_harvest: { classId: 'prospector', line: 'You know where the old salt caves are. Salt keeps forever in there.', choice: { label: 'Store cheap salt in the caves (+80g)', effects: [gold(80), say('You buy cheap salt and store it in the cool caves. Months later, you sell it at a good price.')] } },
  monster_contract: { classId: 'prospector', line: 'Crocodiles love warm mud. You know exactly where they will be.', choice: { label: 'Track them to their mud bank (Grit check, DC 12)', check: check('grit', 12, { text: 'You find their nest in an hour and herd them downriver. Full bounty!', effects: [gold(250)] }, { text: 'They have moved on. You collect a small fee for the map you drew.', effects: [gold(50)] }) } },
  iron_boom: { classId: 'prospector', line: 'Every builder in town wants iron, and you know where to dig it.', choice: { label: 'Dig and sell fresh iron (+120g)', effects: [gold(120), say('You dig out a cartload in a week and sell it to the builders at top price.')] } },
}

// The Colossi: each class meets every trial with its own strength. The class
// option is the trial's main check, made with the class's best stat and a
// little easier, leading to the same places.
interface TrialTouch {
  label: string
  success: string
  failure: string
}

export const COLOSSUS_TOUCHES: Record<CardId, Record<string, TrialTouch>> = {
  colossus01_trial_grit: {
    guard: { label: 'Stand guard over your own books', success: 'You stand at your ledger like it is a city gate. Not one inspector gets past you without a proper answer.', failure: 'Even a guard tires in the end. They find a page to fine you for.' },
    smuggler: { label: 'Hide the messy pages before they look', success: 'Quick hands! The scruffiest pages vanish before any inspector sees them.', failure: 'An inspector spots the page tucked in your boot.' },
    alchemist: { label: 'Recalculate every sum in front of them', success: 'Your numbers are perfect. The inspectors watch, open-mouthed.', failure: 'One sum, one tiny mistake. That is all the Wyrm needs.' },
    silverTongue: { label: 'Charm the inspectors with tea and stories', success: 'By the third pot of tea, the inspectors are laughing and closing their books.', failure: 'They drink your tea, and fine you anyway.' },
    healer: { label: 'Show them how your gold helped people', success: 'Your books are full of medicine for the poor. Even the Wyrm\'s inspectors soften.', failure: 'Kindness does not balance a ledger. They fine you.' },
    prospector: { label: 'Dig through the paperwork like a mine', success: 'You dig through every box until you find the receipts that prove you right.', failure: 'You dig and dig, but one receipt is lost forever.' },
  },
  colossus02_trial_charm: {
    guard: { label: 'Speak plainly, like a guard on duty', success: 'No tricks, no fancy words. The Inquisitor respects a plain, honest answer.', failure: 'Plain words are not enough. He wants more.' },
    smuggler: { label: 'Confess your smuggling, every bit', success: 'You tell him everything, even the fish trick. He almost smiles. "Honesty from a smuggler. Rare."', failure: 'You leave out one crate. He notices.' },
    alchemist: { label: 'Explain your work with honest numbers', success: 'Every coin is accounted for. The Inquisitor nods slowly.', failure: 'Numbers do not move him. He wants your heart, not your sums.' },
    silverTongue: { label: 'Sing him a song of honest regret', success: 'Your song fills the chamber. The Inquisitor closes his eyes. "You mean it," he says.', failure: 'He thinks it is a performance. Maybe it was.' },
    healer: { label: 'Tell him about the people you healed', success: 'You speak of every family you helped. The Inquisitor bows his head.', failure: 'He wonders if you did it for love, or for gold.' },
    prospector: { label: 'Show him your honest muddy hands', success: 'Muddy hands, honest work. The Inquisitor sees no lie in you.', failure: 'Mud cannot hide everything.' },
  },
  colossus03_trial_nerve: {
    guard: { label: 'Hold the line like a shield wall', success: 'You hold firm while the storm rages. When it passes, you are still standing.', failure: 'Even a shield wall breaks in a big enough storm.' },
    smuggler: { label: 'Use Nell\'s map to ride out the storm', success: 'Nell\'s map shows a sheltered cove. Your goods ride out the storm safe and dry.', failure: 'The cove floods too. You sell in a hurry.' },
    alchemist: { label: 'Calculate exactly when prices will turn', success: 'Your sums say three days. On day three, prices turn. You held at just the right time.', failure: 'Your sums say three days. The storm says five.' },
    silverTongue: { label: 'Keep everyone calm with songs', success: 'You sing in the market every night. Nobody panics, and prices hold.', failure: 'Even your songs cannot calm this storm.' },
    healer: { label: 'Stay calm and help the frightened', success: 'While others panic, you stay calm and help. By the time the storm passes, you are better off than anyone.', failure: 'You help others so much you forget your own business.' },
    prospector: { label: 'Wait it out like a long winter dig', success: 'You have waited out mountain winters. A storm is nothing. Prices bounce back.', failure: 'This storm is longer than any winter.' },
  },
  colossus04_trial_savvy: {
    guard: { label: 'Offer to guard the factories', success: 'Every factory needs a guard. The owner hires your whole crew.', failure: 'He already has guards. Machine-made ones.' },
    smuggler: { label: 'Find what the factories cannot make', success: 'Factories make plates, not rare spices. You carry what machines cannot.', failure: 'The factories seem to make everything now.' },
    alchemist: { label: 'Improve the machines with your formulas', success: 'Your oil makes the gears run twice as fast. The owner begs you to join him.', failure: 'Your formula gums up the gears. Oops.' },
    silverTongue: { label: 'Sell the factory\'s goods with a jingle', success: 'Your jingle sells more plates in a week than the factory made all month.', failure: 'Nobody hums a jingle about plates.' },
    healer: { label: 'Care for the factory workers', success: 'Healthy workers make more. The owner pays you to keep them well.', failure: 'The owner does not care about his workers. Yet.' },
    prospector: { label: 'Sell the factories your iron', success: 'Machines eat iron, and you have the best seam in the kingdom. Deal!', failure: 'They found cheaper iron somewhere else.' },
  },
  colossus05_trial_charm: {
    guard: { label: 'Guard the medicine carts', success: 'You guard every cart through every street. Medicine reaches everyone.', failure: 'There are more streets than guards.' },
    smuggler: { label: 'Smuggle medicine into every closed street', success: 'Your boats and secret tunnels carry medicine everywhere. The city cheers.', failure: 'Some streets stay out of reach.' },
    alchemist: { label: 'Brew medicine for the whole city', success: 'Your vats bubble day and night. There is enough medicine for everyone.', failure: 'You run out of moonflower halfway.' },
    silverTongue: { label: 'Lift the city with songs of hope', success: 'Your songs echo down every street. People stop being afraid and start helping each other.', failure: 'The fog swallows your songs.' },
    healer: { label: 'Lead the healers', success: 'You were born for this. Every healer in the city follows your lead.', failure: 'Even you cannot be everywhere.' },
    prospector: { label: 'Bring water from your healing spring', success: 'Barrels of spring water roll into the city. The fever begins to fade.', failure: 'The spring cannot fill enough barrels.' },
  },
  colossus06_trial_savvy: {
    guard: { label: 'Gather loyal guards around you', success: 'Your loyal guards stand with you. The Syndicate decides you are too well protected to bully.', failure: 'Some of your guards were Syndicate all along.' },
    smuggler: { label: 'Use your old crew\'s secrets', success: 'Pip knows every Syndicate secret. You use them to bargain your way free.', failure: 'The Syndicate already changed their secrets.' },
    alchemist: { label: 'Map the web of debts on paper', success: 'You draw the whole web on one big sheet, and find the thread that unravels it all.', failure: 'The web is too tangled, even for you.' },
    silverTongue: { label: 'Talk each boss against the others', success: 'A word here, a rumour there. Soon the bosses are too busy arguing to bother you.', failure: 'They see what you are doing.' },
    healer: { label: 'Call on everyone you ever healed', success: 'Half the city owes you their health. They stand by you, and the Syndicate backs down.', failure: 'Gratitude only goes so far.' },
    prospector: { label: 'Offer them a share of the mine', success: 'A share of the mine, honestly offered, buys your freedom from every debt.', failure: 'They want the whole mine.' },
  },
  colossus07_trial_truth: {
    guard: { label: 'See the guard who protected others', success: 'The Mirror shows every traveller you kept safe. You stand a little taller.', failure: 'The Mirror shows the ones you didn\'t.' },
    smuggler: { label: 'See the friend who found their crew', success: 'The Mirror shows Pip and Nell laughing on the Seraphina. You were never alone.', failure: 'The Mirror shows every rule you broke.' },
    alchemist: { label: 'See the student who became a master', success: 'The Mirror shows the young student you were, now a master. Quill would be proud.', failure: 'The Mirror shows the experiments that went wrong.' },
    silverTongue: { label: 'See the singer who brought joy', success: 'The Mirror shows every face that smiled at your songs. That was the real treasure.', failure: 'The Mirror shows every time you sang for gold, not joy.' },
    healer: { label: 'See the healer who never gave up', success: 'The Mirror shows every life you touched. It glows warm and golden.', failure: 'The Mirror shows the ones you couldn\'t save.' },
    prospector: { label: 'See the dreamer who found the legend', success: 'The Mirror shows a dreamer who never stopped digging. You found your treasure, inside and out.', failure: 'The Mirror shows the years spent alone in the mud.' },
  },
}

/** A card with its class touches: the extra story line, the class-only choice,
 *  and on Colossus trials a class version of the trial's main check. */
export function withClassTouches(card: StoryCard): StoryCard {
  let out = card
  const touch = CLASS_TOUCHES[card.id]
  if (touch) {
    const only = { kind: 'heroClass' as const, id: touch.classId }
    out = {
      ...out,
      body: [...out.body, { if: only, text: touch.line }],
      choices: [...out.choices, { ...touch.choice, id: `class_${touch.classId}`, requires: [only, ...(touch.choice.requires ?? [])] }],
    }
  }
  const trial = COLOSSUS_TOUCHES[card.id]
  const main = card.choices.find((c) => c.check)
  if (trial && main?.check) {
    const extra = Object.entries(trial).map(([classId, t]): Choice => {
      const stat = HERO_CLASSES[classId]!.mainStat
      return {
        id: `class_${classId}`,
        label: `${t.label} (${stat[0]!.toUpperCase()}${stat.slice(1)} check, DC ${main.check!.dc - 2})`,
        requires: [{ kind: 'heroClass', id: classId }],
        check: { ...main.check!, stat, dc: main.check!.dc - 2, success: { ...main.check!.success, text: t.success }, failure: { ...main.check!.failure, text: t.failure } },
      }
    })
    out = { ...out, choices: [...out.choices, ...extra] }
  }
  return out
}
