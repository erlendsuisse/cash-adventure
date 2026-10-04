import type { Choice, Effect, StoryCard } from '../../engine/types'
import { HERO_CLASSES } from '../heroes'

// CLASS OPENINGS
// Each class's first day in Vessarin, in place of the shared counting-house
// job (job_offer, still used by heroless saves). Same deal as that job - a
// steady wage, or chance it on your own - told the class's way. Both choices
// move the story into the climbing phase, as job_offer does.

const climb: Effect = { kind: 'advancePhase', to: 'climbing' }

function opening(classId: string, card: { title: string; body: string[]; job: string; jobStory: string; gamble: Choice }): StoryCard {
  return {
    id: `opening_${classId}`,
    title: card.title,
    chapter: 1, // never drawn; stamped so its artwork files under chapter 1
    storyPhase: 'early_game',
    body: card.body,
    choices: [
      { id: 'take_job', label: `${card.job} (+40g wages/month, +10g rent/month)`, effects: [{ kind: 'wages', delta: 40 }, { kind: 'expense', delta: 10 }, climb, { kind: 'narrate', text: card.jobStory }] },
      card.gamble.check ? card.gamble : { ...card.gamble, effects: [...(card.gamble.effects ?? []), climb] },
    ],
  }
}

export const classOpeningCards: StoryCard[] = [
  opening('guard', {
    title: 'Guards Wanted',
    body: ['A notice flaps on the harbour gate: GUARDS WANTED FOR THE COAST ROAD. A tired caravan boss looks you up and down, and grins at your shield. "You look like you\'ve done this before."'],
    job: 'Sign on as a road guard',
    jobStory: 'You sign your name. Every month you walk the coast road, and every month the pay comes in.',
    gamble: { id: 'arm_wrestle', label: 'Win coins arm-wrestling on the docks (Grit check, DC 12: +40g)', check: { stat: 'grit', dc: 12, success: { text: 'You beat the biggest docker in the harbour. The crowd roars, and the coins are yours!', effects: [{ kind: 'gold', delta: 40 }, climb] }, failure: { text: 'The docker wins, but buys you a cider. Friends already.', effects: [climb] } } },
  }),
  opening('smuggler', {
    title: 'A Boat at Midnight',
    body: ['You know this harbour by night better than by day. An old boatman waves you over. "I need someone who can row quiet and keep a secret," he whispers. "Steady work, if you want it."'],
    job: 'Row for the boatman',
    jobStory: 'Every night you row his boat across the dark harbour. Quiet work, steady pay.',
    gamble: { id: 'first_run', label: 'Make a quick run of your own (Nerve check, DC 12: +40g)', check: { stat: 'nerve', dc: 12, success: { text: 'One crate of untaxed tea, one sleepy guard, one happy buyer. Easy money!', effects: [{ kind: 'gold', delta: 40 }, climb] }, failure: { text: 'A lantern swings your way. You drop the crate in the harbour and row home empty.', effects: [climb] } } },
  }),
  opening('alchemist', {
    title: 'The Tonic Cart',
    body: ['An old apothecary is selling his rickety tonic cart, bottles still clinking. "My knees are done," he sighs. "Run it for me and I\'ll pay you a wage, until you\'re ready for your own shop."'],
    job: 'Run the tonic cart',
    jobStory: 'You polish the bottles and mix fresh tonics every morning. The cart pays a steady wage.',
    gamble: { id: 'invent_tonic', label: 'Invent a new tonic to sell (Savvy check, DC 12: +40g)', check: { stat: 'savvy', dc: 12, success: { text: 'Your fizzy lemon tonic sells out in an hour!', effects: [{ kind: 'gold', delta: 40 }, climb] }, failure: { text: 'Your tonic turns purple and smells of socks. Nobody buys it.', effects: [climb] } } },
  }),
  opening('silverTongue', {
    title: 'A Song for Supper',
    body: ['The Salty Anchor is noisy, warm and full of sailors. The landlady eyes your lute. "My singer ran off with a pirate," she says. "Sing here every night, and I\'ll pay you a wage."'],
    job: 'Sing at the Salty Anchor',
    jobStory: 'Every night you sing, and every night the sailors stamp along. The landlady pays you every month.',
    gamble: { id: 'busk', label: 'Busk in the market square (Charm check, DC 12: +40g)', check: { stat: 'charm', dc: 12, success: { text: 'A crowd gathers and your hat fills with coins!', effects: [{ kind: 'gold', delta: 40 }, climb] }, failure: { text: 'It rains. Everybody runs. Your hat fills with water.', effects: [climb] } } },
  }),
  opening('healer', {
    title: 'The Harbour Infirmary',
    body: ['The harbour infirmary is a single room with three beds and far too many patients. The tired doctor almost cries when she sees your bag of herbs. "Please stay," she says. "I can pay you a wage."'],
    job: 'Work at the infirmary',
    jobStory: 'You bandage, brew and comfort from dawn till dusk. The pay is steady, and the patients love you.',
    gamble: { id: 'herb_stall', label: 'Sell herbal remedies at the market (Charm check, DC 12: +40g)', check: { stat: 'charm', dc: 12, success: { text: 'Word spreads about your kind remedies. You sell out before noon!', effects: [{ kind: 'gold', delta: 40 }, climb] }, failure: { text: 'Few customers today, but the ones who came will be back.', effects: [climb] } } },
  }),
  opening('prospector', {
    title: 'The Assay Office',
    body: ['The assay office tests every rock and nugget brought down from the hills. The old assayer squints at you through her magnifying glass. "You know your rocks? Then work for me. Steady pay."'],
    job: 'Work at the assay office',
    jobStory: 'You weigh, scratch and test rocks all day. Some days you find gold in other people\'s buckets. The pay is steady.',
    gamble: { id: 'pan_river', label: 'Pan the river for gold (Grit check, DC 12: +40g)', check: { stat: 'grit', dc: 12, success: { text: 'Cold feet, but a pan full of gold flakes!', effects: [{ kind: 'gold', delta: 40 }, climb] }, failure: { text: 'Cold feet and nothing else. Tomorrow, maybe.', effects: [climb] } } },
  }),
]

/** The prologue's way on: each class to its own opening, heroless saves to the shared job. */
export const prologueContinues: Choice[] = [
  ...Object.keys(HERO_CLASSES).map((classId): Choice => ({ id: `continue_${classId}`, label: 'Continue', requires: [{ kind: 'heroClass', id: classId }], goto: `opening_${classId}` })),
  { id: 'continue', label: 'Continue', requires: [{ kind: 'not', of: { kind: 'anyOf', of: Object.keys(HERO_CLASSES).map((id) => ({ kind: 'heroClass' as const, id })) } }], goto: 'job_offer' },
]
