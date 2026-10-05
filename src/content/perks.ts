import type { Choice, Perk, ShopItem, StatId, StoryCard } from '../engine/types'

// BUILD YOUR HERO
// Perks are what you carry through every Colossus: skills you learn, gear you
// buy and trophies you win. A Colossus can take your ventures, never these.
// Each perk is a set of ability rules (engine/rules.ts), the same ones class
// abilities use. Owning one = its id is in progress.boons.

const perk = (p: Perk): Perk => p

const PERK_LIST: Perk[] = [
  // ---- Skills for sale at the Guild Hall ----
  perk({ id: 'haggler', kind: 'skill', name: "The Trader's Wink", icon: '🤝', text: 'Every venture costs you 10% less.', rules: [{ kind: 'ventureDiscount', percent: 10 }] }),
  perk({ id: 'quiet_feet', kind: 'skill', name: "Cat's Paw Step", icon: '🐾', text: 'Shady deals draw 1 less Attention.', rules: [{ kind: 'heatReduction', amount: 1 }] }),
  perk({ id: 'second_chance', kind: 'skill', name: "Lady Luck's Favour", icon: '🍀', text: 'Once per chapter, re-roll any failed roll.', rules: [{ kind: 'rerollFailed', stat: 'any' }] }),
  perk({ id: 'hidden_vault', kind: 'skill', name: 'Secret Harbour Vault', icon: '🗝️', text: 'When a Colossus comes, you keep your best venture.', rules: [{ kind: 'keepVentures', count: 1 }] }),
  perk({ id: 'golden_touch', kind: 'skill', name: "Magpie's Eye", icon: '✨', text: 'Gold you win with a good roll is 25% bigger.', rules: [{ kind: 'checkGoldBonus', percent: 25 }] }),
  perk({ id: 'steady_purse', kind: 'skill', name: "Squirrel's Stash", icon: '👛', text: 'A Colossus takes only a quarter of your wages, not half.', rules: [{ kind: 'keepWages', percent: 25 }] }),
  perk({ id: 'second_vault', kind: 'skill', name: 'The Mountain Vault', icon: '🏦', text: 'When a Colossus comes, you keep 1 more venture.', rules: [{ kind: 'keepVentures', count: 1 }] }),

  // ---- Gear for sale: +1 on rolls of one attribute ----
  perk({ id: 'gear_boots', kind: 'gear', name: 'Stormstride Boots', icon: '🥾', text: '+1 on Grit rolls.', rules: [{ kind: 'checkBonus', stat: 'grit', mod: 1 }] }),
  perk({ id: 'gear_abacus', kind: 'gear', name: "Old Mott's Abacus", icon: '🧮', text: '+1 on Savvy rolls.', rules: [{ kind: 'checkBonus', stat: 'savvy', mod: 1 }] }),
  perk({ id: 'gear_coat', kind: 'gear', name: 'The Peacock Coat', icon: '🧥', text: '+1 on Charm rolls.', rules: [{ kind: 'checkBonus', stat: 'charm', mod: 1 }] }),
  perk({ id: 'gear_coin', kind: 'gear', name: "Captain Wren's Doubloon", icon: '🪙', text: '+1 on Nerve rolls.', rules: [{ kind: 'checkBonus', stat: 'nerve', mod: 1 }] }),
  perk({ id: 'gear_staff', kind: 'gear', name: 'Ironwood Trailstaff', icon: '🦯', text: '+1 more on Grit rolls.', rules: [{ kind: 'checkBonus', stat: 'grit', mod: 1 }] }),
  perk({ id: 'gear_spectacles', kind: 'gear', name: 'Truthseer Spectacles', icon: '👓', text: '+1 more on Savvy rolls.', rules: [{ kind: 'checkBonus', stat: 'savvy', mod: 1 }] }),
  perk({ id: 'gear_brooch', kind: 'gear', name: 'Silver Swallow Brooch', icon: '📿', text: '+1 more on Charm rolls.', rules: [{ kind: 'checkBonus', stat: 'charm', mod: 1 }] }),
  perk({ id: 'gear_compass', kind: 'gear', name: 'The Fearless Compass', icon: '🧭', text: '+1 more on Nerve rolls.', rules: [{ kind: 'checkBonus', stat: 'nerve', mod: 1 }] }),

  perk({ id: 'gear_cloak', kind: 'gear', name: 'Hurricane Cloak', icon: '🧣', text: '+1 on Grit and Nerve rolls.', rules: [{ kind: 'checkBonus', stat: 'grit', mod: 1 }, { kind: 'checkBonus', stat: 'nerve', mod: 1 }] }),
  perk({ id: 'gear_ledger', kind: 'gear', name: "Saltwater Sal's Ledger", icon: '📕', text: '+1 on Savvy rolls, and ventures cost 5% less.', rules: [{ kind: 'checkBonus', stat: 'savvy', mod: 1 }, { kind: 'ventureDiscount', percent: 5 }] }),
  perk({ id: 'gear_owl', kind: 'gear', name: 'Professor Tock', icon: '🦉', text: '+1 on every roll.', rules: [{ kind: 'checkBonus', stat: 'grit', mod: 1 }, { kind: 'checkBonus', stat: 'savvy', mod: 1 }, { kind: 'checkBonus', stat: 'charm', mod: 1 }, { kind: 'checkBonus', stat: 'nerve', mod: 1 }] }),

  // ---- Class gear and skills (only that class sees them in the Guild Hall) ----
  perk({ id: 'class_shield', kind: 'gear', name: 'Old Faithful', icon: '🛡️', text: '+1 on Grit and Nerve rolls.', rules: [{ kind: 'checkBonus', stat: 'grit', mod: 1 }, { kind: 'checkBonus', stat: 'nerve', mod: 1 }] }),
  perk({ id: 'class_lantern', kind: 'gear', name: 'Moonshutter Lantern', icon: '🏮', text: '+2 on Nerve rolls.', rules: [{ kind: 'checkBonus', stat: 'nerve', mod: 2 }] }),
  perk({ id: 'class_alembic', kind: 'gear', name: 'The Wonder Flask', icon: '⚗️', text: '+1 on Savvy rolls, and 10% more gold from good rolls.', rules: [{ kind: 'checkBonus', stat: 'savvy', mod: 1 }, { kind: 'checkGoldBonus', percent: 10 }] }),
  perk({ id: 'class_lute', kind: 'gear', name: 'Nightingale Lute', icon: '🪕', text: '+2 on Charm rolls.', rules: [{ kind: 'checkBonus', stat: 'charm', mod: 2 }] }),
  perk({ id: 'class_satchel', kind: 'gear', name: 'Greenheart Satchel', icon: '🌿', text: '+1 on Grit and Charm rolls.', rules: [{ kind: 'checkBonus', stat: 'grit', mod: 1 }, { kind: 'checkBonus', stat: 'charm', mod: 1 }] }),
  perk({ id: 'class_rod', kind: 'gear', name: 'Whispering Hazel Rod', icon: '🪄', text: '15% more gold from good rolls.', rules: [{ kind: 'checkGoldBonus', percent: 15 }] }),
  perk({ id: 'class_unbreakable', kind: 'skill', name: 'Unbreakable', icon: '🪨', text: 'Once per chapter, re-roll any failed roll.', rules: [{ kind: 'rerollFailed', stat: 'any' }] }),
  perk({ id: 'class_compartments', kind: 'skill', name: 'False-Bottom Barrels', icon: '📦', text: 'When a Colossus comes, you keep your best venture.', rules: [{ kind: 'keepVentures', count: 1 }] }),
  perk({ id: 'class_gold_from_lead', kind: 'skill', name: 'Gold from Lead', icon: '🧪', text: '25% more gold from good rolls.', rules: [{ kind: 'checkGoldBonus', percent: 25 }] }),
  perk({ id: 'class_high_places', kind: 'skill', name: 'Friends in High Places', icon: '🎩', text: 'Ventures cost 10% less, and +1 on Charm rolls.', rules: [{ kind: 'ventureDiscount', percent: 10 }, { kind: 'checkBonus', stat: 'charm', mod: 1 }] }),
  perk({ id: 'class_grateful', kind: 'skill', name: 'A Thousand Thank-Yous', icon: '💐', text: 'When a Colossus comes, you keep your best venture.', rules: [{ kind: 'keepVentures', count: 1 }] }),
  perk({ id: 'class_nose', kind: 'skill', name: 'Bargain Bloodhound', icon: '💎', text: 'Every venture costs you 10% less.', rules: [{ kind: 'ventureDiscount', percent: 10 }] }),

  // ---- Skills only a mentor can teach (mentor cards, one per chapter) ----
  perk({ id: 'sharp_eye', kind: 'skill', name: "Hawk's Eye", icon: '🔍', text: '+2 on Savvy rolls.', rules: [{ kind: 'checkBonus', stat: 'savvy', mod: 2 }] }),
  perk({ id: 'shadow_step', kind: 'skill', name: 'Rooftop Runner', icon: '🌙', text: '+2 on Nerve rolls.', rules: [{ kind: 'checkBonus', stat: 'nerve', mod: 2 }] }),
  perk({ id: 'iron_will', kind: 'skill', name: 'Iron Will', icon: '🛡️', text: '+2 on Grit rolls.', rules: [{ kind: 'checkBonus', stat: 'grit', mod: 2 }] }),
  perk({ id: 'golden_words', kind: 'skill', name: 'Golden Words', icon: '🗣️', text: '+2 on Charm rolls.', rules: [{ kind: 'checkBonus', stat: 'charm', mod: 2 }] }),
  perk({ id: 'healers_calm', kind: 'skill', name: "Mother Wren's Calm", icon: '🌿', text: 'Once per chapter, re-roll any failed roll.', rules: [{ kind: 'rerollFailed', stat: 'any' }] }),
  perk({ id: 'trusted_name', kind: 'skill', name: "The Judge's Seal", icon: '📜', text: 'When a Colossus comes, you keep 1 more venture.', rules: [{ kind: 'keepVentures', count: 1 }] }),
  perk({ id: 'master_merchant', kind: 'skill', name: "Star-Merchant's Secret", icon: '👑', text: 'Every venture costs you 15% less.', rules: [{ kind: 'ventureDiscount', percent: 15 }] }),

  // ---- Trophies: won from Colossi and rare story moments ----
  perk({ id: 'ledger_wyrm_scale', kind: 'trophy', name: 'Wyrm Scale', icon: '🐉', text: '+1 on Savvy rolls. A golden scale from the Ledger-Wyrm.', rules: [{ kind: 'checkBonus', stat: 'savvy', mod: 1 }] }),
  perk({ id: 'inquisitor_grace', kind: 'trophy', name: "Inquisitor's Seal", icon: '🕯️', text: 'Shady deals draw 1 less Attention.', rules: [{ kind: 'heatReduction', amount: 1 }] }),
  perk({ id: 'tide_survivor', kind: 'trophy', name: 'Tide Pearl', icon: '🐚', text: '+1 on Nerve rolls. You stood against the sea itself.', rules: [{ kind: 'checkBonus', stat: 'nerve', mod: 1 }] }),
  perk({ id: 'machine_sponsor', kind: 'trophy', name: 'Golden Cog', icon: '⚙️', text: 'Every venture costs you 10% less.', rules: [{ kind: 'ventureDiscount', percent: 10 }] }),
  perk({ id: 'plague_survivor', kind: 'trophy', name: "Healer's Ribbon", icon: '🎗️', text: '+1 on Grit rolls. You kept going when the city fell sick.', rules: [{ kind: 'checkBonus', stat: 'grit', mod: 1 }] }),
  perk({ id: 'syndicate_grace', kind: 'trophy', name: 'Syndicate Ring', icon: '💍', text: '+1 on Charm rolls. Even the Syndicate respects you.', rules: [{ kind: 'checkBonus', stat: 'charm', mod: 1 }] }),
  perk({ id: 'mirror_survivor', kind: 'trophy', name: 'Mirror Shard', icon: '🪞', text: 'You faced yourself, and won.', rules: [] }),
  perk({ id: 'forbidden_knowledge', kind: 'trophy', name: 'Giant Lore', icon: '📖', text: '+1 on Savvy rolls. You know the Colossi better than anyone.', rules: [{ kind: 'checkBonus', stat: 'savvy', mod: 1 }] }),
  perk({ id: 'market_insider', kind: 'trophy', name: 'Market Insider', icon: '📈', text: 'Gold you win with a good roll is 10% bigger.', rules: [{ kind: 'checkGoldBonus', percent: 10 }] }),
  perk({ id: 'master_bluffer', kind: 'trophy', name: 'Poker Face', icon: '🃏', text: '+1 on Charm rolls.', rules: [{ kind: 'checkBonus', stat: 'charm', mod: 1 }] }),
]

export const PERKS: Record<string, Perk> = Object.fromEntries(PERK_LIST.map((p) => [p.id, p]))

// ---- The Guild Hall ----

type Chapter = ShopItem['fromChapter']

const STAT_NAME: Record<StatId, string> = { grit: 'Grit', savvy: 'Savvy', charm: 'Charm', nerve: 'Nerve' }

/** Lessons: each one is dearer than the last, and each attribute has its own teacher and price. */
const training = (stat: StatId, icon: string, name: string, story: string, price: number, priceRise: number): ShopItem => ({
  id: `train_${stat}`,
  kind: 'training',
  name,
  icon,
  text: `+1 ${STAT_NAME[stat]}`,
  story,
  price,
  priceRise,
  limit: 6,
  fromChapter: 1,
  effects: [{ kind: 'stat', stat, delta: 1 }],
})

/** A class's masterclass: +2 to its main attribute, taught by someone from its own world. */
const masterclass = (classId: string, className: string, stat: StatId, icon: string, name: string, story: string): ShopItem => ({
  id: `master_${classId}`,
  kind: 'training',
  name,
  icon,
  text: `+2 ${STAT_NAME[stat]}`,
  story,
  price: 150,
  priceRise: 110,
  limit: 2,
  fromChapter: 2,
  requires: [{ kind: 'heroClass', id: classId }],
  forClass: className,
  effects: [{ kind: 'stat', stat, delta: 2 }],
})

/** A perk for sale. Class items are only shown to that class. */
const sell = (perkId: string, price: number, fromChapter: Chapter, story: string, forClass?: { id: string; name: string }): ShopItem => {
  const p = PERKS[perkId]!
  return {
    id: `buy_${perkId}`,
    kind: p.kind === 'gear' ? 'gear' : 'skill',
    name: p.name,
    icon: p.icon,
    text: p.text,
    story,
    price,
    limit: 1,
    fromChapter,
    ...(forClass ? { requires: [{ kind: 'heroClass' as const, id: forClass.id }], forClass: forClass.name } : {}),
    effects: [{ kind: 'grantBoon', boon: perkId }],
  }
}

const GUARD = { id: 'guard', name: 'Caravan Guards' }
const SMUGGLER = { id: 'smuggler', name: 'Smugglers' }
const ALCHEMIST = { id: 'alchemist', name: 'Alchemists' }
const SILVER = { id: 'silverTongue', name: 'Silver Tongues' }
const HEALER = { id: 'healer', name: 'Healers' }
const PROSPECTOR = { id: 'prospector', name: 'Prospectors' }

export const SHOP: ShopItem[] = [
  // ---- Training ----
  training('grit', '💪', 'Barracks Drills', 'An old soldier runs you up and down the harbour steps at dawn. "Again!" he bellows. "Again!"', 40, 35),
  training('savvy', '📚', 'Counting-House Lessons', 'Sums, ledgers and secrets of the trade, taught by a clerk who has never once been cheated.', 60, 45),
  training('charm', '🎭', 'Playhouse Voice Lessons', 'An actor teaches you to stand tall, speak clearly and make a whole room listen.', 50, 40),
  training('nerve', '⛵', 'Rigging Climbs', 'The harbour pilots dare you up the tallest mast in port. The view from the top is worth it.', 45, 40),
  masterclass('guard', 'Caravan Guards', 'grit', '🛡️', 'Shield-Wall Drills', 'The captain of the Old Guard takes you on herself. "A guard never gives an inch," she says. Neither will you.'),
  masterclass('smuggler', 'Smugglers', 'nerve', '🌊', 'Night-Tide Runs', 'Race the harbour patrol boats in the dark, with no lantern and no second chances.'),
  masterclass('alchemist', 'Alchemists', 'savvy', '⚗️', 'The Grand Laboratory', 'A week among bubbling flasks and ancient formulas. You come out seeing patterns everywhere.'),
  masterclass('silverTongue', 'Silver Tongues', 'charm', '🎶', 'Royal Court Debates', 'Argue before the Queen\'s own advisers. Win them over, and you can win over anyone.'),
  masterclass('healer', 'Healers', 'charm', '🌿', 'The Herbalists\' Circle', 'Wise healers teach you to calm a frightened patient with a few kind words.'),
  masterclass('prospector', 'Prospectors', 'grit', '⛏️', 'Deep-Mine Expedition', 'Three weeks underground with Granny Flint\'s old crew. Your arms turn to iron.'),

  // ---- Gear ----
  sell('gear_coin', 45, 1, 'Captain Wren flipped this gold coin before every daring escape. She never lost a toss. Rub it, and your heart goes steady.'),
  sell('gear_boots', 55, 1, 'These hobnailed boots walked the coast road through 3 winters. They still smell of sea salt. In them, you can march all day.'),
  sell('gear_coat', 75, 1, 'Teal velvet, brass buttons, and a collar that catches every lantern. Walk in wearing this, and every head turns.'),
  sell('gear_abacus', 85, 1, 'Old Mott the moneylender never got a sum wrong in 60 years. When he retired, he sold his abacus. Late at night, its beads still click by themselves.'),
  sell('gear_cloak', 120, 2, 'Woven from the sail of a ship that sailed through a hurricane and came home. Wind and rain just slide off.'),
  sell('gear_ledger', 140, 2, 'Saltwater Sal built a fortune from one fish stall. Her secrets are scribbled in the margins. "Never pay the first price," says page one.'),
  sell('gear_compass', 160, 3, 'Its needle points north. Tap the glass, and it points at whatever scares you most. Follow it, and the fear shrinks.'),
  sell('gear_staff', 170, 3, 'Cut from the toughest tree on Cat Mountain and capped with iron. Lean on it, and you can walk until sunrise.'),
  sell('gear_brooch', 190, 3, 'A silver swallow with sapphire eyes. Everyone asks where you got it, and the conversation starts itself.'),
  sell('gear_spectacles', 210, 3, 'Three sets of lenses on brass hinges. Flip down the green ones, and fake coins, tiny print and fibbing smiles all show up.'),
  sell('gear_owl', 520, 5, 'A brass owl who rides on your shoulder, ticking softly. "Hoo-hoo," he whispers, "not that one." He is always right. Nobody knows who wound him up first.'),
  sell('class_shield', 130, 1, 'Your old caravan shield, dented from 100 roads and polished like new by the best smith in Vessarin. It has never let you down.', GUARD),
  sell('class_lantern', 120, 1, 'A smuggler\'s lantern with a sliding shutter. Open, it lights your way. Shut, you vanish into the night.', SMUGGLER),
  sell('class_alembic', 140, 1, 'A tiny lab of glass and copper that fits in your coat pocket. It bubbles, it hisses, and now and then it makes something brilliant.', ALCHEMIST),
  sell('class_lute', 125, 1, 'Silver strings that ring like bells. Play one song, and the whole tavern sings along, even the grumpy ones.', SILVER),
  sell('class_satchel', 115, 1, 'Stitched with lavender, mint and moon-sage. Its smell alone makes worried people smile.', HEALER),
  sell('class_rod', 150, 1, 'A forked hazel rod that trembles near treasure. "Mine found a whole silver seam," Granny Flint says. "Then it found my lost teeth."', PROSPECTOR),

  // ---- Skills ----
  sell('haggler', 130, 1, 'A wink, a smile, a slow shake of the head. That\'s the market traders\' secret. Never pay the first price!'),
  sell('quiet_feet', 90, 2, 'An old cat burglar teaches you to walk like a cat. Soft paws, hood up, and nobody remembers your face.'),
  sell('second_chance', 220, 2, 'A gambler with a silver tooth shows you how to shrug off bad luck. "Lady Luck likes a smile," she says. "Try again."'),
  sell('hidden_vault', 320, 2, 'A locksmith who owes you a favour builds a vault under the harbour. Only you know the knock. Not even a Colossus can find it.'),
  sell('golden_touch', 260, 3, 'Magpies spot every shiny thing. Now you do too: the extra coin in every deal, the bonus hidden in every reward.'),
  sell('steady_purse', 240, 3, 'Like a squirrel hiding nuts, you tuck your savings all over the city. No Colossus can grab them all at once.'),
  sell('second_vault', 520, 5, 'Deep in Cat Mountain, behind a waterfall, a second vault waits. Two hiding places are better than one.'),
  sell('class_unbreakable', 260, 2, 'The Old Guard\'s last lesson is simple. "When you fall, you get back up. Every single time."', GUARD),
  sell('class_compartments', 280, 2, 'Barrels with false bottoms, crates with secret drawers, a cart with a hollow floor. A Colossus can\'t take what it can\'t find.', SMUGGLER),
  sell('class_gold_from_lead', 300, 2, 'It isn\'t real magic. You just know which "worthless" bits and bobs are worth a fortune.', ALCHEMIST),
  sell('class_high_places', 280, 2, 'Dukes, bankers and harbour masters all owe you a favour now. Doors swing open, and prices drop.', SILVER),
  sell('class_grateful', 260, 2, 'Everyone you ever healed keeps an eye on your business. When a Colossus comes, they hide your best venture for you.', HEALER),
  sell('class_nose', 250, 2, 'Sniff, sniff. You can smell a bargain from the far side of the market. Nobody sells to you at full price.', PROSPECTOR),
]

// ---- Facing a Colossus your own way ----

/** The extra DC for using your best attribute instead of the one the trial asks for. */
export const OWN_WAY_DC = 2

/** Every Colossus trial also lets you use your strongest attribute, a little
 *  harder: a hero built around one attribute can always lean on it. */
export function withOwnWay(card: StoryCard): StoryCard {
  if (!/^colossus0\d_trial/.test(card.id)) return card
  const main = card.choices.find((c) => c.check && c.check.stat !== 'best' && !c.requires)
  if (!main?.check) return card
  const dc = main.check.dc + OWN_WAY_DC
  const ownWay: Choice = { id: `${main.id}_own_way`, label: `Do it your own way (your best attribute, DC ${dc})`, check: { ...main.check, stat: 'best', dc } }
  const at = card.choices.indexOf(main) + 1
  return { ...card, choices: [...card.choices.slice(0, at), ownWay, ...card.choices.slice(at)] }
}
