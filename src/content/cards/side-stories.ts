import type { ChapterNumber, Choice, Effect, OwnedAsset, StoryCard } from '../../engine/types'
import { standing } from '../standings'

// SIDE STORIES
// Each class follows its own thread through the 7 chapters, one card per
// chapter, themed on that chapter. The main story and shared cards stay the
// same; these are what make a second hero feel like a new adventure. Every
// thread ends in a grand venture of its own.
//
//   Caravan Guard - the Red Feather gang and its mysterious queen
//   Smuggler      - the lost ship Seraphina and your old crew
//   Alchemist     - Professor Quill's missing Golden Formula
//   Silver Tongue - the rival bard Lucio Vane and the Grand Bazaar
//   Healer        - building the House of Hope
//   Prospector    - the Sunken Mine of Vess

const SIDE_WEIGHT = 12 // high: your own story should turn up early in every chapter

function side(classId: string, chapter: ChapterNumber, card: Omit<StoryCard, 'id' | 'weight' | 'once' | 'requires'>): StoryCard & { sideChapter: ChapterNumber } {
  return { ...card, id: `side_${classId}_ch${chapter}`, weight: SIDE_WEIGHT, once: true, requires: [{ kind: 'heroClass', id: classId }], sideChapter: chapter }
}

/** Buy a venture: pay its cost and own it. Shown locked until you can afford it. */
function buy(id: string, label: string, asset: Omit<OwnedAsset, 'id' | 'label'> & { label: string; id: string }, story: string): Choice {
  return {
    id,
    label: `${label} (${asset.cost}g, +${asset.monthlyCashflow}g/month)`,
    requires: [{ kind: 'goldAtLeast', amount: asset.cost }],
    showLockedAs: `Needs ${asset.cost}g`,
    effects: [{ kind: 'gold', delta: -asset.cost }, { kind: 'acquireAsset', asset }, { kind: 'narrate', text: story }],
  }
}

const say = (text: string): Effect => ({ kind: 'narrate', text })
const flag = (id: string): Effect => ({ kind: 'flag', id, set: 1 })

const CARDS = [
  // ---------------- CARAVAN GUARD: the Red Feather ----------------
  side('guard', 1, {
    title: 'A Wagon Needs a Guard',
    body: ['Old Merrit the wagon master thumps a crate of salt. "Bandits on the coast road," he grumbles. "They leave a red feather wherever they strike. Ride with my wagon and I\'ll pay you well."'],
    choices: [
      { id: 'guard_ride', label: 'Ride with the wagon (Grit check, DC 12: +90g)', check: { stat: 'grit', dc: 12, success: { text: 'Bandits leap out at the bend. You raise your shield, and they scatter like pigeons. Merrit pays you double!', effects: [{ kind: 'gold', delta: 90 }, flag('guard_merrit_friend')] }, failure: { text: 'The bandits grab a crate and vanish. One red feather flutters down onto the road. Merrit pays you half.', effects: [{ kind: 'gold', delta: 40 }] } } },
      { id: 'guard_hire', label: 'Help Merrit hire more guards (+1 Crown)', effects: [standing('crown', 1), flag('guard_merrit_friend'), say('You round up three tough friends. Merrit claps you on the back. "Now that\'s a proper escort!"')] },
      { id: 'guard_pass', label: 'Not this time', effects: [say('Merrit shrugs and rumbles off alone. You notice a red feather stuck in his wheel.')] },
    ],
  }),
  side('guard', 2, {
    title: 'Feathers at the Docks',
    body: ['A red feather is pinned to a warehouse door. The Red Feather gang has moved into the harbour, and they are smuggling stolen goods by night. Merrit wants a guard post on the docks.'],
    choices: [
      buy('guard_post', 'Open a guard post on the docks', { id: 'guard_dock_post', label: 'Dockside Guard Post', cost: 120, monthlyCashflow: 40, sector: 'trade' }, 'Your guard post opens with a shiny brass bell. Warehouse owners line up to pay for your protection.'),
      { id: 'guard_follow', label: 'Follow the feathers at night (Grit check, DC 13)', check: { stat: 'grit', dc: 13, success: { text: 'You track them to a hidden cellar full of stolen silk. The Watch pays you a reward!', effects: [{ kind: 'gold', delta: 70 }, flag('guard_found_cellar')] }, failure: { text: 'You lose them in the fog and bark your shin on a barrel. Ouch.' } } },
      { id: 'guard_leave', label: 'Leave it to the Watch', effects: [say('The feathers keep appearing, door after door.')] },
    ],
  }),
  side('guard', 3, {
    title: 'The Refugee Caravan',
    body: ['War has emptied the border villages. A long line of families needs safe passage to the city, and the Red Feather gang is watching the road. "Help us," begs an old farmer. "We can\'t pay much."'],
    choices: [
      { id: 'guard_escort', label: 'Escort them for free (+2 Common Folk)', effects: [standing('folk', 2), flag('guard_hero'), say('You march at the front, shield high. Not one bandit dares come near. The children cheer your name.')] },
      buy('guard_company', 'Start an escort company for the army roads', { id: 'guard_escort_company', label: 'Escort Company', cost: 180, monthlyCashflow: 60, sector: 'trade' }, 'Your escort company guards every supply road. Even the army hires you.'),
      { id: 'guard_skip', label: 'Point them to the main road', effects: [say('They thank you and trudge away. You hope they make it.')] },
    ],
  }),
  side('guard', 4, {
    title: 'Ironclad Coaches',
    body: ['The banks are moving gold between cities, and the Red Feather gang has robbed 3 coaches this month. A banker in a tall hat wants armoured coaches, and someone tough to run them.'],
    choices: [
      buy('guard_coaches', 'Build the ironclad coaches', { id: 'guard_ironclad', label: 'Ironclad Coach Line', cost: 260, monthlyCashflow: 90, sector: 'iron' }, 'Your coaches are covered in iron plates and pulled by 6 horses. No bandit has cracked one yet.'),
      { id: 'guard_trap', label: 'Set a trap for the gang (Grit check, DC 14: +150g)', check: { stat: 'grit', dc: 14, success: { text: 'The "gold coach" is full of guards! You catch 5 Red Feathers, and the bank pays a fat reward.', effects: [{ kind: 'gold', delta: 150 }, flag('guard_trap_sprung')] }, failure: { text: 'The gang smells the trap and never shows. The banker sniffs and pays for your time.', effects: [{ kind: 'gold', delta: 30 }] } } },
      { id: 'guard_no', label: 'Too risky', effects: [say('The banker tips his hat and finds someone else.')] },
    ],
  }),
  side('guard', 5, {
    title: 'Medicine on the Mountain Road',
    body: ['The city needs medicine from the mountain monasteries, but the road is steep and the Red Feathers still roam it. Merrit looks old and tired. "Will you take my wagon, friend? I can\'t make the climb anymore."'],
    choices: [
      { id: 'guard_medicine', label: 'Bring the medicine home (Grit check, DC 14)', check: { stat: 'grit', dc: 14, success: { text: 'Through snow and wind you bring the wagon home. The whole city lines the streets to thank you.', effects: [standing('folk', 2), { kind: 'gold', delta: 100 }] }, failure: { text: 'A rockfall blocks the road. You save half the medicine. It is still enough to help many families.', effects: [standing('folk', 1)] } } },
      { id: 'guard_hire_drivers', label: 'Pay drivers to go instead (-60g, +1 Common Folk)', requires: [{ kind: 'goldAtLeast', amount: 60 }], showLockedAs: 'Needs 60g', effects: [{ kind: 'gold', delta: -60 }, standing('folk', 1), say('Your drivers bring the medicine home safely.')] },
      { id: 'guard_stay', label: 'Stay in the city', effects: [say('Someone else makes the climb. Merrit says nothing, but he looks disappointed.')] },
    ],
  }),
  side('guard', 6, {
    title: 'The Feather in Merrit\'s Hat',
    body: [
      'You find a bundle of red feathers hidden under Merrit\'s wagon seat. Your old friend has been telling the gang which wagons to rob, all along.',
      { if: { kind: 'flag', id: 'guard_merrit_friend', atLeast: 1 }, text: '"They have my granddaughter," he whispers, tears in his eyes. "I had no choice."' },
    ],
    choices: [
      { id: 'guard_forgive', label: 'Help Merrit rescue her (Grit check, DC 15)', check: { stat: 'grit', dc: 15, success: { text: 'You storm the gang\'s hideout at dawn. Merrit\'s granddaughter runs into his arms. He will never forget this.', effects: [flag('guard_rescued'), standing('folk', 1), { kind: 'gold', delta: 80 }] }, failure: { text: 'The hideout is empty. The gang has moved on, deeper into the hills. But Merrit knows you tried.', effects: [flag('guard_tried')] } } },
      { id: 'guard_turn_in', label: 'Turn Merrit over to the Watch (+2 Crown)', effects: [standing('crown', 2), say('The Watch takes Merrit away. It is the law, but it does not feel good.')] },
    ],
  }),
  side('guard', 7, {
    title: 'The Bandit Queen',
    body: [
      'At last you meet her: the Red Feather Queen, sitting on a throne of stolen crates. "Clever guard," she smiles. "The world is falling apart. Robbing is getting boring. What if my gang guarded the roads with you instead?"',
      { if: { kind: 'flag', id: 'guard_rescued', atLeast: 1 }, text: 'Behind you, Merrit and his granddaughter nod. They trust you.' },
    ],
    choices: [
      buy('guard_wardens', 'Turn the gang into road wardens', { id: 'guard_road_wardens', label: 'The Road Wardens', cost: 550, monthlyCashflow: 240, sector: 'trade' }, 'Red feathers now mean safety. Your Road Wardens guard every road in the kingdom, and every merchant pays gladly.'),
      { id: 'guard_arrest', label: 'Arrest the queen (Grit check, DC 16: +300g)', check: { stat: 'grit', dc: 16, success: { text: 'You win the duel of wills. The queen is marched off in chains, and the crown pays a huge bounty!', effects: [{ kind: 'gold', delta: 300 }, standing('crown', 2)] }, failure: { text: 'She vanishes in a puff of red feathers, laughing. You will never catch her now.' } } },
    ],
  }),

  // ---------------- SMUGGLER: the lost ship Seraphina ----------------
  side('smuggler', 1, {
    title: 'An Old Shipmate',
    body: ['"Psst!" A skinny lad with a gold earring pulls you behind a stack of nets. It\'s Pip, from your old crew on the Seraphina. "The ship vanished last winter," he whispers. "Captain Nell too. Help me find them?"'],
    choices: [
      { id: 'smug_job', label: 'Do a quick run with Pip (Nerve check, DC 12: +80g)', check: { stat: 'nerve', dc: 12, success: { text: 'You slip a crate of untaxed tea past the harbour guard. Pip grins. "Just like old times!"', effects: [{ kind: 'gold', delta: 80 }, flag('smug_pip')] }, failure: { text: 'A guard whistles. You drop the crate in the harbour and run. Pip swims after it.', effects: [flag('smug_pip')] } } },
      { id: 'smug_ask', label: 'Ask around about the Seraphina', effects: [flag('smug_pip'), say('A sailor remembers seeing the Seraphina sail into the fog off the Black Rocks. Then nothing.')] },
      { id: 'smug_no', label: 'Leave the past behind', effects: [say('Pip looks hurt, but nods and slips away into the crowd.')] },
    ],
  }),
  side('smuggler', 2, {
    title: 'The Seraphina\'s Figurehead',
    body: ['In a fence\'s back room you find it: the Seraphina\'s carved mermaid figurehead, cracked and salty. "Found it floating near the Black Rocks," shrugs the fence. "Want it? 60 gold."'],
    choices: [
      { id: 'smug_buy_figure', label: 'Buy the figurehead (-60g)', requires: [{ kind: 'goldAtLeast', amount: 60 }], showLockedAs: 'Needs 60g', effects: [{ kind: 'gold', delta: -60 }, flag('smug_figurehead'), say('Behind the mermaid\'s ear, scratched into the wood, is a map. Captain Nell left you a clue!')] },
      buy('smug_cove', 'Set up a secret cove for night runs', { id: 'smug_secret_cove', label: 'Secret Smugglers\' Cove', cost: 120, monthlyCashflow: 42, sector: 'spice' }, 'Your hidden cove fills with quiet boats every moonless night. Each one pays its toll.'),
      { id: 'smug_walk', label: 'Walk away', effects: [say('The fence shrugs and goes back to counting spoons.')] },
    ],
  }),
  side('smuggler', 3, {
    title: 'Through the Blockade',
    body: ['Warships blockade the coast, and the city is running out of everything. Nell\'s map shows a secret channel through the Black Rocks. "Only a mad smuggler would try it," says Pip. "So... you?"'],
    choices: [
      { id: 'smug_run', label: 'Run the blockade (Nerve check, DC 14: +160g)', check: { stat: 'nerve', dc: 14, success: { text: 'You thread the rocks in the dark, cannons booming far behind. Your hold is full of flour, and the city cheers!', effects: [{ kind: 'gold', delta: 160 }, standing('folk', 1), flag('smug_channel')] }, failure: { text: 'A warship\'s lantern finds you. You dump the cargo and slip away, empty but free.' } } },
      buy('smug_runners', 'Buy a fleet of fast runner boats', { id: 'smug_blockade_runners', label: 'Blockade Runners', cost: 180, monthlyCashflow: 62, sector: 'salt' }, 'Your sleek boats dart through the blockade every week. No warship is fast enough.'),
      { id: 'smug_wait', label: 'Wait for the war to end', effects: [say('You stay in port. Pip paces the docks, restless.')] },
    ],
  }),
  side('smuggler', 4, {
    title: 'The Seraphina\'s Papers',
    body: ['A bank clerk lets slip a secret: the Seraphina is not lost at all. The House of Merrow bought her debts and hid her away in a private dock. "Pay her debts," the clerk says, "and she\'s yours."'],
    choices: [
      { id: 'smug_pay_debts', label: 'Pay the ship\'s debts (-200g)', requires: [{ kind: 'goldAtLeast', amount: 200 }], showLockedAs: 'Needs 200g', effects: [{ kind: 'gold', delta: -200 }, flag('smug_papers'), say('You hold the Seraphina\'s papers in your hand. Now you just need to find where they hid her.')] },
      { id: 'smug_steal_papers', label: 'Steal the papers from the vault (Nerve check, DC 15)', check: { stat: 'nerve', dc: 15, success: { text: 'In and out of the vault without a sound. The papers are yours, and the bank never noticed.', effects: [flag('smug_papers'), { kind: 'flag', id: 'banking_trigger', delta: 1 }] }, failure: { text: 'Alarm bells ring! You escape over the rooftops, empty-handed.', effects: [{ kind: 'flag', id: 'banking_trigger', delta: 2 }] } } },
      { id: 'smug_later', label: 'Not yet', effects: [say('You tuck the secret away for later.')] },
    ],
  }),
  side('smuggler', 5, {
    title: 'Medicine by Moonlight',
    body: ['The sick quarter is closed off by ropes and guards. Inside, families need medicine. "There\'s an old water gate under the bridge," Pip whispers. "A boat could slip through."'],
    choices: [
      { id: 'smug_medicine', label: 'Row the medicine in (Nerve check, DC 14)', check: { stat: 'nerve', dc: 14, success: { text: 'Night after night you row medicine through the water gate. The sick quarter calls you the Moonlight Smuggler.', effects: [standing('folk', 3)] }, failure: { text: 'A guard spots your boat. You get half the medicine through before you have to flee.', effects: [standing('folk', 1)] } } },
      buy('smug_ferry', 'Start a medicine ferry service', { id: 'smug_medicine_ferry', label: 'Medicine Ferry', cost: 260, monthlyCashflow: 88, sector: 'spice' }, 'Your little ferries carry medicine up and down the canals. The healers pay, and the city is grateful.'),
      { id: 'smug_too_risky', label: 'Too risky', effects: [say('You watch the closed streets from across the canal.')] },
    ],
  }),
  side('smuggler', 6, {
    title: 'Who Sold Out the Crew?',
    body: ['Pip bursts in, out of breath. "I know who betrayed the Seraphina! It was the harbourmaster. He sold her course to the bank." The harbourmaster is very rich now, and very well guarded.'],
    choices: [
      { id: 'smug_confront', label: 'Make him confess (Nerve check, DC 15)', check: { stat: 'nerve', dc: 15, success: { text: 'You corner him in his office. He spills everything, including where the Seraphina is hidden: the old dock beyond the rift.', effects: [flag('smug_location'), { kind: 'gold', delta: 100 }] }, failure: { text: 'His guards throw you out. But you saw a map on his desk with a circle near the rift.', effects: [flag('smug_location')] } } },
      { id: 'smug_expose', label: 'Tell the whole harbour what he did (+2 Underworld)', effects: [standing('underworld', 2), flag('smug_location'), say('Every sailor in Vessarin turns their back on him. One of them tells you where the Seraphina is hidden.')] },
    ],
  }),
  side('smuggler', 7, {
    title: 'The Seraphina Sails Again',
    body: [
      'Beyond the glowing rift, in a forgotten dock, she waits: the Seraphina, sails furled, and Captain Nell asleep in the crow\'s nest. She opens one eye. "Took you long enough," she grins.',
      { if: { kind: 'flag', id: 'smug_papers', atLeast: 1 }, text: 'You wave her papers. The ship is legally yours again.' },
    ],
    choices: [
      buy('smug_seraphina', 'Refit the Seraphina as a trading ship', { id: 'smug_the_seraphina', label: 'The Seraphina', cost: 560, monthlyCashflow: 245, sector: 'spice' }, 'The Seraphina sails between worlds now, with Nell at the wheel and Pip in the rigging. Every voyage comes home heavy with treasure.'),
      { id: 'smug_one_run', label: 'One last legendary run (Nerve check, DC 16: +320g)', check: { stat: 'nerve', dc: 16, success: { text: 'You sail the Seraphina through the rift and back with a hold full of starlight spice. A legendary run!', effects: [{ kind: 'gold', delta: 320 }] }, failure: { text: 'The rift spits you back out, cargo gone. But the crew is together again, and that is worth more.' } } },
    ],
  }),

  // ---------------- ALCHEMIST: the Golden Formula ----------------
  side('alchemist', 1, {
    title: 'Professor Quill\'s Notebook',
    body: ['Your old teacher, Professor Quill, has vanished. His workshop is empty except for a singed notebook. The first page reads: "The Golden Formula. Part one of seven." The rest has been torn out.'],
    choices: [
      { id: 'alch_remedies', label: 'Brew and sell tonics (Savvy check, DC 12: +80g)', check: { stat: 'savvy', dc: 12, success: { text: 'Your fizzy ginger tonic cures every sniffle in the harbour. They sell out by noon!', effects: [{ kind: 'gold', delta: 80 }, flag('alch_notebook')] }, failure: { text: 'Your tonic turns everyone\'s tongue blue for a day. Customers laugh, and pay a little anyway.', effects: [{ kind: 'gold', delta: 25 }, flag('alch_notebook')] } } },
      { id: 'alch_study', label: 'Study the notebook (+1 Savvy)', effects: [{ kind: 'stat', stat: 'savvy', delta: 1 }, flag('alch_notebook'), say('Late into the night you decode Quill\'s scribbles. Your mind feels sharper.')] },
    ],
  }),
  side('alchemist', 2, {
    title: 'The Forger\'s Offer',
    body: ['A forger in a leather apron has heard about you. "An alchemist who can make lead look like gold?" She rubs her hands. "We\'d be rich!" She has page two of Quill\'s notebook, and she won\'t give it up for free.'],
    choices: [
      { id: 'alch_refuse_forger', label: 'Refuse, and trick her out of the page (Savvy check, DC 13)', check: { stat: 'savvy', dc: 13, success: { text: 'You swap the page for a clever fake while she isn\'t looking. Page two is yours!', effects: [flag('alch_page2')] }, failure: { text: 'She catches you and throws you out. "Amateur!" she shouts.' } } },
      buy('alch_shop', 'Open an honest potion shop instead', { id: 'alch_potion_shop', label: 'Potion Shop', cost: 120, monthlyCashflow: 40, sector: 'spice' }, 'Bubbling bottles fill your window. People come from all over for your honest remedies.'),
      { id: 'alch_leave', label: 'Walk away', effects: [say('Some pages are not worth the trouble.')] },
    ],
  }),
  side('alchemist', 3, {
    title: 'Lamps That Never Go Out',
    body: ['The army camps are cold and dark at night. Quill\'s third page describes a lamp that burns for a year on a single drop of oil. The quartermaster wants hundreds of them.'],
    choices: [
      buy('alch_lamps', 'Build an everburning lamp workshop', { id: 'alch_lamp_works', label: 'Everburning Lamp Works', cost: 180, monthlyCashflow: 62, sector: 'iron' }, 'Your lamps glow in every camp and every cottage. The soldiers call them "little suns".'),
      { id: 'alch_prototype', label: 'Make one perfect lamp (Savvy check, DC 14: +150g)', check: { stat: 'savvy', dc: 14, success: { text: 'Your lamp glows warm and bright, and never flickers. The general buys the design on the spot!', effects: [{ kind: 'gold', delta: 150 }, flag('alch_page3')] }, failure: { text: 'Fwoomp! The lamp burns your eyebrows off. They will grow back.' } } },
      { id: 'alch_skip', label: 'Not now', effects: [say('The camps stay dark a while longer.')] },
    ],
  }),
  side('alchemist', 4, {
    title: 'The Bank\'s Gold Test',
    body: ['The House of Merrow is buying "alchemist\'s gold" from a smooth stranger, and they want an expert to test it. The stranger looks nervous. In his pocket, you spot a torn page from Quill\'s notebook.'],
    choices: [
      { id: 'alch_test', label: 'Test the gold properly (Savvy check, DC 14)', check: { stat: 'savvy', dc: 14, success: { text: 'Fake! Just painted lead. The bank pays you a big fee, and the stranger drops page four as he runs.', effects: [{ kind: 'gold', delta: 140 }, flag('alch_page4'), standing('guilds', 1)] }, failure: { text: 'The fake fools you too. The bank is not pleased when they find out.', effects: [standing('guilds', -1)] } } },
      buy('alch_assay', 'Open an assay office for the banks', { id: 'alch_assay_office', label: 'Assay Office', cost: 250, monthlyCashflow: 85, sector: 'banking' }, 'Every bank in town sends you its gold to test. Your stamp means the real thing.'),
    ],
  }),
  side('alchemist', 5, {
    title: 'A Remedy for the Fever',
    body: ['The fever spreads through the city. Page five of Quill\'s notebook, found tucked inside a library book, has a recipe for a remedy. It needs rare moonflower and a very steady hand.'],
    choices: [
      { id: 'alch_brew', label: 'Brew the remedy (Savvy check, DC 15)', check: { stat: 'savvy', dc: 15, success: { text: 'The remedy glows silver in the flask. It works! Healers queue at your door for every bottle.', effects: [standing('folk', 3), { kind: 'gold', delta: 120 }, flag('alch_page5')] }, failure: { text: 'The first batch fizzles. The second works, a little. It helps, but not as much as you hoped.', effects: [standing('folk', 1)] } } },
      buy('alch_apothecary', 'Build a moonflower greenhouse', { id: 'alch_greenhouse', label: 'Moonflower Greenhouse', cost: 300, monthlyCashflow: 100, sector: 'spice' }, 'Silver moonflowers bloom under your glass roof. Every healer in the city buys them.'),
    ],
  }),
  side('alchemist', 6, {
    title: 'The Thief in Grey',
    body: ['Your workshop has been broken into! Every page of Quill\'s notebook is gone. At the scene: a grey glove, with the crest of Magister Vorn, the city\'s most famous alchemist, and your bitter rival.'],
    choices: [
      { id: 'alch_outwit', label: 'Trick Vorn into giving them back (Savvy check, DC 15)', check: { stat: 'savvy', dc: 15, success: { text: 'You plant a rumour about a "missing page eight". Vorn comes to steal it, straight into your trap. Every page is back!', effects: [flag('alch_recovered'), { kind: 'gold', delta: 80 }] }, failure: { text: 'Vorn is too clever. But you memorised most of the formula anyway.', effects: [flag('alch_memorised')] } } },
      { id: 'alch_report', label: 'Report Vorn to the guild (+2 Guilds)', effects: [standing('guilds', 2), flag('alch_recovered'), say('The guild raids Vorn\'s tower and returns your pages. Vorn is banned from the guild forever.')] },
    ],
  }),
  side('alchemist', 7, {
    title: 'The Golden Formula',
    body: [
      'The sky has split open, and starlight pours down like honey. Page seven was never paper at all: it is the rift itself. Professor Quill steps out of the light, beaming. "You found it! Gold from starlight, my student. Shall we?"',
    ],
    choices: [
      buy('alch_lab', 'Build the Golden Laboratory with Quill', { id: 'alch_golden_lab', label: 'The Golden Laboratory', cost: 560, monthlyCashflow: 245, sector: 'banking' }, 'Your laboratory catches starlight in great glass jars and turns it into gold. Quill dances around the cauldrons, delighted.'),
      { id: 'alch_share', label: 'Share the formula with the world (+3 Common Folk, +300g)', effects: [standing('folk', 3), { kind: 'gold', delta: 300 }, say('You publish the formula for everyone. Gold becomes cheap, bread becomes plentiful, and people sing your name.')] },
    ],
  }),

  // ---------------- SILVER TONGUE: the Grand Bazaar ----------------
  side('silverTongue', 1, {
    title: 'The Tavern Song Contest',
    body: ['The Salty Anchor holds a song contest every spring. The favourite is Lucio Vane: golden curls, a silver lute, and a very big head. "You?" he laughs. "Against me?"'],
    choices: [
      { id: 'silver_sing', label: 'Sing your heart out (Charm check, DC 12: +80g)', check: { stat: 'charm', dc: 12, success: { text: 'The whole tavern stamps and cheers for your sea shanty. You win the prize purse! Lucio turns purple.', effects: [{ kind: 'gold', delta: 80 }, flag('silver_beat_lucio')] }, failure: { text: 'Your voice cracks on the high note. Lucio wins, and winks at you.' } } },
      { id: 'silver_duet', label: 'Offer Lucio a duet instead (+1 Guilds)', effects: [standing('guilds', 1), flag('silver_lucio_friend'), say('Your duet brings the house down. Lucio looks surprised, then almost smiles.')] },
    ],
  }),
  side('silverTongue', 2, {
    title: 'The Boss\'s Birthday',
    body: ['The gang boss is turning 50, and he wants the best singer in town for his party. Lucio already said yes. "Make me laugh," the boss growls, "and you\'ll never pay for a stall in this city again."'],
    choices: [
      { id: 'silver_party', label: 'Steal the show (Charm check, DC 13)', check: { stat: 'charm', dc: 13, success: { text: 'Your funny song about his mother makes the boss cry with laughter. Your stalls are protected for life!', effects: [{ kind: 'gold', delta: 100 }, standing('underworld', 1)] }, failure: { text: 'Lucio\'s song goes down better. You get a slice of cake and a polite clap.' } } },
      buy('silver_stage', 'Open a stage at the night market', { id: 'silver_night_stage', label: 'Night Market Stage', cost: 120, monthlyCashflow: 40, sector: 'trade' }, 'Every night your stage is packed. Stallholders pay you to bring in the crowds.'),
      { id: 'silver_skip_party', label: 'Stay away from gangsters', effects: [say('Lucio sings at the party. You hear he got a gold watch.')] },
    ],
  }),
  side('silverTongue', 3, {
    title: 'Songs for the Soldiers',
    body: ['The army is tired and homesick. The general wants a travelling show to lift spirits. Lucio is already rehearsing a long song about himself.'],
    choices: [
      buy('silver_troupe', 'Form a travelling show troupe', { id: 'silver_troupe_show', label: 'Travelling Troupe', cost: 180, monthlyCashflow: 60, sector: 'trade' }, 'Your troupe of jugglers, singers and one very clever dog tours every camp. The soldiers adore you.'),
      { id: 'silver_rally', label: 'Sing for the troops yourself (Charm check, DC 14: +140g)', check: { stat: 'charm', dc: 14, success: { text: 'Hundreds of soldiers sing along to your chorus. The general pins a medal on you, and a purse of gold.', effects: [{ kind: 'gold', delta: 140 }, standing('crown', 1)] }, failure: { text: 'It rains on your show. The soldiers clap politely from under their cloaks.' } } },
      { id: 'silver_let_lucio', label: 'Let Lucio have this one', effects: [say('Lucio\'s song lasts 2 hours. The soldiers fall asleep.')] },
    ],
  }),
  side('silverTongue', 4, {
    title: 'A Jingle for the Bank',
    body: ['The House of Merrow wants a catchy song so everyone remembers their name. "Something people hum in the bath," says the banker. Lucio has written one. It is terrible.'],
    choices: [
      { id: 'silver_jingle', label: 'Write a better jingle (Charm check, DC 14)', check: { stat: 'charm', dc: 14, success: { text: '"Merrow, Merrow, safe and sound, keeps your gold all year round!" The whole city hums it. The bank pays you handsomely.', effects: [{ kind: 'gold', delta: 150 }, standing('guilds', 1)] }, failure: { text: 'Your jingle is fine, but Lucio\'s is louder. The bank picks his.' } } },
      buy('silver_criers', 'Start a company of town criers', { id: 'silver_crier_co', label: 'Town Crier Company', cost: 250, monthlyCashflow: 85, sector: 'trade' }, 'Your criers ring their bells on every corner, shouting news and adverts. Every shop in town wants them.'),
    ],
  }),
  side('silverTongue', 5, {
    title: 'Songs of Hope',
    body: ['The fever has made the city sad and quiet. A young girl at the window asks you for a song. Down the street, Lucio has stopped singing too. He looks lost.'],
    choices: [
      { id: 'silver_hope', label: 'Sing from street to street (Charm check, DC 14)', check: { stat: 'charm', dc: 14, success: { text: 'Windows open one by one. Soon the whole street is singing along. For one evening, everyone forgets to be afraid.', effects: [standing('folk', 3), flag('silver_hope')] }, failure: { text: 'Your voice is tired, but the girl at the window smiles. That is enough.', effects: [standing('folk', 1)] } } },
      { id: 'silver_with_lucio', label: 'Ask Lucio to sing with you (+2 Common Folk)', effects: [standing('folk', 2), flag('silver_lucio_friend'), say('Lucio wipes his eyes and picks up his lute. Your voices fill the empty streets together.')] },
    ],
  }),
  side('silverTongue', 6, {
    title: 'Lucio\'s Secret',
    body: [
      'A letter arrives: proof that Lucio stole his most famous songs from an old blind fiddler. One word from you, and his career is over. The Grand Bazaar charter is coming up, and he is your only rival.',
      { if: { kind: 'flag', id: 'silver_lucio_friend', atLeast: 1 }, text: 'You think of the duets you sang together.' },
    ],
    choices: [
      { id: 'silver_expose', label: 'Expose Lucio (+2 Guilds)', effects: [standing('guilds', 2), flag('silver_lucio_gone'), say('Lucio flees the city in disgrace. The road to the Grand Bazaar is clear.')] },
      { id: 'silver_mercy', label: 'Make Lucio pay the fiddler back instead (+2 Common Folk)', effects: [standing('folk', 2), flag('silver_lucio_friend'), say('Lucio pays the old fiddler every coin he owes. He shakes your hand. "I owe you, friend."')] },
    ],
  }),
  side('silverTongue', 7, {
    title: 'The Grand Bazaar',
    body: [
      'Strange traders from beyond the rift want to open the greatest market in history: the Grand Bazaar. They will give the charter to whoever sings them the most beautiful song.',
      { if: { kind: 'flag', id: 'silver_lucio_friend', atLeast: 1 }, text: 'Lucio steps up beside you, lute in hand. "Together?" he asks.' },
    ],
    choices: [
      buy('silver_bazaar', 'Win and run the Grand Bazaar', { id: 'silver_grand_bazaar', label: 'The Grand Bazaar', cost: 550, monthlyCashflow: 240, sector: 'trade' }, 'Your song makes the starry traders weep glittering tears. The Grand Bazaar opens under your banner, and merchants from 2 worlds pay to trade there.'),
      { id: 'silver_legend', label: 'Sing the song of the age (Charm check, DC 16: +320g)', check: { stat: 'charm', dc: 16, success: { text: 'Your song is so beautiful the rift glows gold. The traders shower you with treasure!', effects: [{ kind: 'gold', delta: 320 }] }, failure: { text: 'You forget the second verse. The traders smile kindly and clap their many hands.' } } },
    ],
  }),

  // ---------------- HEALER: the House of Hope ----------------
  side('healer', 1, {
    title: 'Bandages on the Docks',
    body: ['A crate falls on a dockhand\'s foot. Everyone shouts, and nobody helps. You kneel beside him with your bag of herbs. Sister Maren, an old nun, watches you work. "You have a gift," she says. "Have you ever dreamed of a healing house?"'],
    choices: [
      { id: 'heal_treat', label: 'Treat the dockhands for coins (+70g)', effects: [{ kind: 'gold', delta: 70 }, flag('heal_maren'), say('Word spreads fast. By evening, a queue of bruised dockhands waits at your door, coins in hand.')] },
      { id: 'heal_free', label: 'Treat them for free (+2 Common Folk)', effects: [standing('folk', 2), flag('heal_maren'), say('The dockhands will not forget your kindness. Neither will Sister Maren.')] },
    ],
  }),
  side('healer', 2, {
    title: 'A Knock at Midnight',
    body: ['A gang member staggers to your door, holding a badly cut arm. "Please," he gasps. "The Watch will arrest me if I go to the infirmary." Sister Maren looks at you. "A healer helps everyone," she says softly.'],
    choices: [
      { id: 'heal_gang', label: 'Help him (+2 Underworld)', effects: [standing('underworld', 2), say('You stitch his arm by candlelight. Next week, an envelope of coins appears under your door. No name.'), { kind: 'gold', delta: 50 }] },
      buy('heal_clinic', 'Open a small night clinic', { id: 'heal_night_clinic', label: 'Night Clinic', cost: 110, monthlyCashflow: 38, sector: 'spice' }, 'Your little clinic keeps its lamp lit all night. Everyone is welcome, and everyone pays what they can.'),
      { id: 'heal_send_away', label: 'Send him to the infirmary', effects: [say('He stumbles off into the dark. You hope he makes it.')] },
    ],
  }),
  side('healer', 3, {
    title: 'The Field Hospital',
    body: ['The war has filled the army tents with wounded soldiers. The camp doctor is overwhelmed. "We need someone who can organise all this," she says. "Beds, bandages, everything."'],
    choices: [
      buy('heal_tents', 'Set up proper hospital tents', { id: 'heal_field_tents', label: 'Field Hospital Tents', cost: 170, monthlyCashflow: 58, sector: 'trade' }, 'Clean beds, fresh bandages and hot soup. The army pays well for your well-run hospital.'),
      { id: 'heal_nurse', label: 'Nurse the soldiers yourself (Charm check, DC 13: +120g)', check: { stat: 'charm', dc: 13, success: { text: 'Your gentle care and silly jokes lift every soldier\'s spirits. The general pays you a generous reward.', effects: [{ kind: 'gold', delta: 120 }, standing('crown', 1)] }, failure: { text: 'There are too many patients, and you are exhausted. But you helped many.' } } },
    ],
  }),
  side('healer', 4, {
    title: 'A Loan for the House of Hope',
    body: ['You have found the perfect building for your healing house: an old bakery with big windows. But the bank wants proof it will make money. "Hope," sniffs the banker, "is not a business plan."'],
    choices: [
      { id: 'heal_convince', label: 'Convince the banker (Charm check, DC 14)', check: { stat: 'charm', dc: 14, success: { text: 'You show him how many workers get back to work faster with good care. He is amazed, and lends you the money at a fair rate.', effects: [{ kind: 'loan', principal: 200, monthlyPayment: 20 }, flag('heal_building')] }, failure: { text: 'He shakes his head. "Come back with numbers, not feelings."' } } },
      buy('heal_bakery', 'Buy the old bakery outright', { id: 'heal_old_bakery', label: 'The Old Bakery', cost: 240, monthlyCashflow: 80, sector: 'trade' }, 'You rent out half the bakery and save the other half for your dream. It still smells of fresh bread.'),
    ],
  }),
  side('healer', 5, {
    title: 'The Fever Comes',
    body: ['This is the moment you trained for. The grey fever spreads, and the city\'s healers are running out of beds and courage. Sister Maren grips your hand. "Now, my dear. Now is when the House of Hope must open."'],
    choices: [
      { id: 'heal_open_doors', label: 'Open your doors to everyone (Charm check, DC 14)', check: { stat: 'charm', dc: 14, success: { text: 'You lead a team of volunteers day and night. Hundreds of families get well under your roof. The whole city calls you a hero.', effects: [standing('folk', 3), standing('crown', 1), flag('heal_hero')] }, failure: { text: 'It is hard, and not everyone gets better. But your doors stay open, and that matters.', effects: [standing('folk', 2)] } } },
      buy('heal_herbs', 'Grow healing herbs on every rooftop', { id: 'heal_rooftop_gardens', label: 'Rooftop Herb Gardens', cost: 290, monthlyCashflow: 98, sector: 'spice' }, 'Mint and sage spill from every rooftop. The healers buy all you can grow.'),
    ],
  }),
  side('healer', 6, {
    title: 'The Poisoned Herbs',
    body: ['Your patients are getting sicker, not better. Someone has been swapping your herbs for weeds! A rival apothecary, Master Grell, wants the House of Hope closed so people buy his expensive pills instead.'],
    choices: [
      { id: 'heal_catch_grell', label: 'Catch Grell in the act (Charm check, DC 15)', check: { stat: 'charm', dc: 15, success: { text: 'You get his own apprentice to confess. Grell is marched off by the Watch, and your patients recover at last.', effects: [standing('folk', 2), { kind: 'gold', delta: 90 }, flag('heal_safe')] }, failure: { text: 'Grell slips away. But you find the weeds and fix the herbs. Your patients get better.', effects: [flag('heal_safe')] } } },
      { id: 'heal_guards', label: 'Hire guards for your stores (-80g)', requires: [{ kind: 'goldAtLeast', amount: 80 }], showLockedAs: 'Needs 80g', effects: [{ kind: 'gold', delta: -80 }, flag('heal_safe'), say('With guards watching your stores, the swapping stops. Grell gives up.')] },
    ],
  }),
  side('healer', 7, {
    title: 'The House of Hope',
    body: [
      'Starlight pours through the rift and settles on your herb gardens. The plants glow and grow 10 times faster. Sister Maren laughs like a girl. "Now we can heal the whole kingdom," she says. "If we build big enough."',
    ],
    choices: [
      buy('heal_house', 'Build the grand House of Hope', { id: 'heal_house_of_hope', label: 'The House of Hope', cost: 540, monthlyCashflow: 235, sector: 'spice' }, 'The House of Hope opens with a hundred beds and a glowing garden. Healers come from every land to learn from you, and the kingdom pays to keep its doors open.'),
      { id: 'heal_free_cures', label: 'Give the starlight herbs away (+3 Common Folk, +250g)', effects: [standing('folk', 3), { kind: 'gold', delta: 250 }, say('You hand out starlight herbs to every village. Grateful towns send gifts for years.')] },
    ],
  }),

  // ---------------- PROSPECTOR: the Sunken Mine of Vess ----------------
  side('prospector', 1, {
    title: 'Gold in the River',
    body: ['Granny Flint, the oldest prospector in Vessarin, sits by the river with her pan. "There\'s an old legend," she cackles. "The Sunken Mine of Vess. Full of gold, lost for a hundred years. I\'ve got a piece of the map. Want to see?"'],
    choices: [
      { id: 'pros_pan', label: 'Pan the river with Granny (Grit check, DC 12: +70g)', check: { stat: 'grit', dc: 12, success: { text: 'Your pan glints! Real gold flakes, a whole handful. Granny whoops with joy.', effects: [{ kind: 'gold', delta: 70 }, flag('pros_flint')] }, failure: { text: 'Cold feet, wet sleeves, one tiny flake. Granny laughs. "That\'s prospecting, dearie."', effects: [{ kind: 'gold', delta: 10 }, flag('pros_flint')] } } },
      { id: 'pros_map', label: 'Study her piece of the map (+1 Savvy)', effects: [{ kind: 'stat', stat: 'savvy', delta: 1 }, flag('pros_flint'), say('The map shows a mountain shaped like a sleeping cat. You know that mountain!')] },
    ],
  }),
  side('prospector', 2, {
    title: 'Smugglers in the Tunnels',
    body: ['The old mine tunnels under the city are full of smugglers\' crates. One tunnel wall has a carving: a sleeping cat. Granny Flint grabs your arm. "That\'s the sign! The mine is close!" A smuggler blocks the way.'],
    choices: [
      { id: 'pros_bargain', label: 'Pay the smugglers to let you pass (-50g)', requires: [{ kind: 'goldAtLeast', amount: 50 }], showLockedAs: 'Needs 50g', effects: [{ kind: 'gold', delta: -50 }, flag('pros_tunnel'), say('Behind the cat carving, you find a second piece of the map!')] },
      buy('pros_claim', 'Buy a small iron claim nearby', { id: 'pros_iron_claim', label: 'Cat Mountain Iron Claim', cost: 110, monthlyCashflow: 38, sector: 'iron' }, 'Your little claim on Cat Mountain turns up good iron every week.'),
      { id: 'pros_leave_tunnel', label: 'Leave the tunnels to the smugglers', effects: [say('Granny grumbles all the way home.')] },
    ],
  }),
  side('prospector', 3, {
    title: 'The Army Needs Iron',
    body: ['The army needs iron, lots of it, and fast. Cat Mountain is full of it. A quartermaster offers a contract, but digging fast means digging dangerously.'],
    choices: [
      buy('pros_dig', 'Open a proper iron dig', { id: 'pros_iron_dig', label: 'Cat Mountain Dig', cost: 180, monthlyCashflow: 62, sector: 'iron' }, 'Carts of iron rumble down the mountain every day. The army pays on time.'),
      { id: 'pros_deep', label: 'Dig deep for the richest vein (Grit check, DC 14: +150g)', check: { stat: 'grit', dc: 14, success: { text: 'Deep in the mountain you strike a glittering vein of iron, and find a third piece of the map in an old miner\'s lunchbox!', effects: [{ kind: 'gold', delta: 150 }, flag('pros_map3')] }, failure: { text: 'The tunnel floods. You scramble out, soaked and empty-handed.' } } },
      { id: 'pros_no_army', label: 'Keep away from the war', effects: [say('You leave the mountain in peace, for now.')] },
    ],
  }),
  side('prospector', 4, {
    title: 'Shares in the Sunken Mine',
    body: ['Word has spread that you are close to finding the Sunken Mine. Bankers come knocking. "Sell shares in the mine," they say. "Everyone will want a piece of a legend!"'],
    choices: [
      { id: 'pros_sell_shares', label: 'Sell shares to fund the search (+250g)', effects: [{ kind: 'gold', delta: 250 }, flag('pros_shares'), say('Gold pours in from eager investors. Now you must find the mine, or a lot of people will be very cross.')] },
      { id: 'pros_keep', label: 'Keep the mine all yours (Grit check, DC 14: +120g)', check: { stat: 'grit', dc: 14, success: { text: 'You and Granny dig on alone and find a cave full of old miners\' tools, and a bag of forgotten gold coins.', effects: [{ kind: 'gold', delta: 120 }] }, failure: { text: 'Months of digging, and only rocks. But the mine is still all yours.' } } },
    ],
  }),
  side('prospector', 5, {
    title: 'The Miners\' Village',
    body: ['The fever has reached Cat Mountain village, where your miners\' families live. Granny Flint knows of a cave where a healing spring bubbles up through the rock. "The old miners swore by it," she says.'],
    choices: [
      { id: 'pros_spring', label: 'Find the healing spring (Grit check, DC 14)', check: { stat: 'grit', dc: 14, success: { text: 'Deep in the cave, warm water bubbles up, smelling of minerals. The village drinks it, and the fever fades.', effects: [standing('folk', 3), flag('pros_spring')] }, failure: { text: 'You find the spring, but it is only a trickle. It helps a few families.', effects: [standing('folk', 1)] } } },
      buy('pros_bathhouse', 'Build a spring-water bathhouse', { id: 'pros_spring_baths', label: 'Mountain Spring Baths', cost: 290, monthlyCashflow: 98, sector: 'salt' }, 'Visitors come from miles around to soak in your warm mineral baths.'),
    ],
  }),
  side('prospector', 6, {
    title: 'Claim Jumpers!',
    body: ['You wake to hammering. A rival gang of prospectors has jumped your claim, waving fake papers. Worse: Granny Flint\'s last map piece is missing. Did she sell you out?'],
    choices: [
      { id: 'pros_stand', label: 'Stand your ground (Grit check, DC 15)', check: { stat: 'grit', dc: 15, success: { text: 'You face down the claim jumpers until they slink away. Then Granny bursts in, waving the map. "Hid it in my boot!" she grins.', effects: [flag('pros_full_map'), { kind: 'gold', delta: 80 }] }, failure: { text: 'They take half your camp. But Granny was loyal all along, and she still has the map.', effects: [flag('pros_full_map')] } } },
      { id: 'pros_court', label: 'Take them to court (+2 Crown)', effects: [standing('crown', 2), flag('pros_full_map'), say('The judge sees through their fake papers. The claim is yours, and Granny produces the map from her boot.')] },
    ],
  }),
  side('prospector', 7, {
    title: 'The Sunken Mine of Vess',
    body: [
      'With the full map at last, you find it: a great door in Cat Mountain, glowing with the same light as the rift. Inside, the Sunken Mine sparkles with gold, and with crystals that hum like stars. Granny Flint has tears in her eyes. "A hundred years," she whispers. "And we found it."',
    ],
    choices: [
      buy('pros_mine', 'Reopen the Sunken Mine', { id: 'pros_sunken_mine', label: 'The Sunken Mine of Vess', cost: 550, monthlyCashflow: 240, sector: 'iron' }, 'Lanterns glow in the Sunken Mine once more. Gold and star-crystals roll out by the cartload, and Granny Flint runs the place like a queen.'),
      { id: 'pros_one_haul', label: 'Grab one legendary haul (Grit check, DC 16: +320g)', check: { stat: 'grit', dc: 16, success: { text: 'You carry out a star-crystal the size of a pumpkin. Every collector in the world wants it!', effects: [{ kind: 'gold', delta: 320 }] }, failure: { text: 'The mine rumbles and the door slides shut. Granny laughs. "Some legends like to stay lost."' } } },
    ],
  }),
]

/** This chapter's side-story cards (one per class), for its chapter deck. */
export function sideStories(chapter: ChapterNumber): StoryCard[] {
  return CARDS.filter((c) => c.sideChapter === chapter).map(({ sideChapter: _chapter, ...card }) => card)
}
