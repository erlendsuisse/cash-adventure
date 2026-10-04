import type { Background, HeroClass } from '../engine/types'
import { standing } from './standings'

// The six classes a hero can be, and the backgrounds they grew up in. A class
// changes how you survive and get rich (stats, one ability, a side story),
// never what winning means: freedom, then the 7 Colossi.

export const HERO_CLASSES: Record<string, HeroClass> = {
  guard: {
    id: 'guard',
    name: 'Caravan Guard',
    cousin: 'Fighter',
    tagline: 'Tough as old boots. Nothing gets past you.',
    description: 'You have walked the trade roads with a shield on your back. Merchants pay well for someone they can trust with their wagons.',
    mainStat: 'grit',
    secondStat: 'nerve',
    ability: { name: 'Stand Firm', text: 'Once per chapter, re-roll a failed Grit check.', rules: [{ kind: 'rerollFailed', stat: 'grit' }] },
    start: [standing('crown', 1)],
    ending: 'You came to Vessarin with a shield and a strong back. Now red feathers mean safety on every road, merchants sleep soundly, and children play at being Road Wardens. Seven Colossi tried to stop you. None of them got past.',
  },
  smuggler: {
    id: 'smuggler',
    name: 'Smuggler',
    cousin: 'Rogue',
    tagline: 'Quick hands, quiet feet, a boat that never gets caught.',
    description: 'You know every hidden cove and back alley. Shady deals come easily to you, and the Watch rarely notices.',
    mainStat: 'nerve',
    secondStat: 'charm',
    ability: { name: 'Shadow Step', text: 'Shady deals draw 1 less Attention.', rules: [{ kind: 'heatReduction', amount: 1 }] },
    start: [standing('underworld', 1)],
    ending: 'You came to Vessarin with quick hands and an empty boat. Now the Seraphina sails between worlds with Nell at the wheel and Pip in the rigging, and every harbour knows your name. Seven Colossi tried to catch you. Nobody ever does.',
  },
  alchemist: {
    id: 'alchemist',
    name: 'Alchemist',
    cousin: 'Wizard',
    tagline: 'Bubbling flasks and a head full of numbers.',
    description: 'You studied the secret science of turning things into gold. Mostly it turned out to be maths, and you are very good at maths.',
    mainStat: 'savvy',
    secondStat: 'grit',
    ability: { name: 'Foresight', text: '+2 on every Savvy check.', rules: [{ kind: 'checkBonus', stat: 'savvy', mod: 2 }] },
    start: [standing('guilds', 1)],
    ending: 'You came to Vessarin with a singed notebook and a head full of numbers. Now your laboratory turns starlight into gold, and Professor Quill tells everyone you were his best student. Seven Colossi set you their puzzles. You solved every one.',
  },
  silverTongue: {
    id: 'silverTongue',
    name: 'Silver Tongue',
    cousin: 'Bard',
    tagline: 'A song, a smile, and a better price.',
    description: 'You have sung in every tavern on the coast. People like you, and people who like you give you a good deal.',
    mainStat: 'charm',
    secondStat: 'savvy',
    ability: { name: 'Haggle', text: 'Every venture costs you 10% less.', rules: [{ kind: 'ventureDiscount', percent: 10 }] },
    start: [standing('guilds', 1)],
    ending: 'You came to Vessarin with a lute and a smile. Now the Grand Bazaar opens under your banner, and the whole city hums your songs. Seven Colossi tried to silence you. You sang louder.',
  },
  healer: {
    id: 'healer',
    name: 'Healer',
    cousin: 'Cleric',
    tagline: 'Kind hands and a bag of herbs.',
    description: 'You have nursed half the harbour back to health. The ordinary folk of Vessarin already love you.',
    mainStat: 'charm',
    secondStat: 'grit',
    ability: { name: 'Kind Hands', text: 'Start as a friend of the Common Folk, and +1 on every Charm check.', rules: [{ kind: 'checkBonus', stat: 'charm', mod: 1 }] },
    start: [standing('folk', 3)],
    ending: 'You came to Vessarin with a bag of herbs and a kind heart. Now the House of Hope heals the whole kingdom, and Sister Maren calls you the best healer she ever met. Seven Colossi brought fear and fever. You brought hope.',
  },
  prospector: {
    id: 'prospector',
    name: 'Prospector',
    cousin: 'Ranger',
    tagline: 'Muddy boots, a pickaxe, and a nose for treasure.',
    description: 'You have panned rivers and climbed mountains looking for your lucky strike. You always seem to find a little more than everyone else.',
    mainStat: 'grit',
    secondStat: 'savvy',
    ability: { name: 'Lucky Find', text: 'Gold you win from a successful check is 25% bigger.', rules: [{ kind: 'checkGoldBonus', percent: 25 }] },
    start: [{ kind: 'gold', delta: 20 }],
    ending: 'You came to Vessarin with muddy boots and an old map. Now lanterns glow in the Sunken Mine of Vess, Granny Flint runs it like a queen, and every child wants a pickaxe. Seven Colossi stood in your way. You dug right through them.',
  },
}

export const BACKGROUNDS: Record<string, Background> = {
  dockKid: {
    id: 'dockKid',
    name: 'Dock Kid',
    text: 'You grew up hauling ropes on the docks. +1 Nerve, and the Underworld knows your face.',
    start: [{ kind: 'stat', stat: 'nerve', delta: 1 }, standing('underworld', 1)],
  },
  noble: {
    id: 'noble',
    name: "Noble's Child",
    text: 'You grew up in a big house. +100 gold and a friend at court, but your fancy tastes cost +10g a month.',
    start: [{ kind: 'gold', delta: 100 }, standing('crown', 1), { kind: 'expense', delta: 10 }],
  },
  farmer: {
    id: 'farmer',
    name: "Farmer's Child",
    text: 'You grew up in the fields, up before the sun. +1 Grit, and the Common Folk trust you.',
    start: [{ kind: 'stat', stat: 'grit', delta: 1 }, standing('folk', 1)],
  },
  scribe: {
    id: 'scribe',
    name: "Scribe's Apprentice",
    text: 'You grew up copying ledgers by candlelight. +1 Savvy, and the Guilds know your neat handwriting.',
    start: [{ kind: 'stat', stat: 'savvy', delta: 1 }, standing('guilds', 1)],
  },
}
