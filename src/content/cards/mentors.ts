import type { ChapterNumber, StatId, StoryCard } from '../../engine/types'
import { PERKS } from '../perks'

// MENTORS AND TRAINING
// Two cards per chapter for building your hero, beside the Guild Hall:
//   - a mentor who teaches a skill you can't buy anywhere: pay, or prove yourself
//   - a training chance: a cheap +2 to one of two attributes, or a free practice roll
// Both are once per game, and what they give is never taken by a Colossus.

const MENTOR_WEIGHT = 8
const TRAINING_WEIGHT = 6

/** A mentor's fee and the trainer's price both grow with the chapter, as wages do. */
const mentorFee = (chapter: ChapterNumber) => 60 + chapter * 60
const trainingFee = (chapter: ChapterNumber) => 40 + chapter * 30

const cap = (stat: StatId) => stat[0]!.toUpperCase() + stat.slice(1)

interface MentorSpec {
  title: string
  body: string[]
  perk: string
  stat: StatId // the attribute that proves you're ready
  dc: number
  payLabel: string
  proveLabel: string
  learned: string // what learning it feels like
  failed: string // a near miss: you still pick something up (+1 to the stat)
  decline: string
  declined: string
}

interface TrainingSpec {
  title: string
  body: string[]
  a: { stat: StatId; label: string; done: string }
  b: { stat: StatId; label: string; done: string }
  practice: { stat: StatId; label: string; success: string; failure: string }
}

const MENTORS: Record<ChapterNumber, MentorSpec> = {
  1: {
    title: 'Madam Quill\'s Counting School',
    body: [
      'A tiny woman with chalk on her nose blocks your path. "You count on your fingers," she sniffs. "I saw you."',
      '"Come to my school. I will teach you to spot a cheat across a crowded market."',
    ],
    perk: 'sharp_eye',
    stat: 'savvy',
    dc: 14,
    payLabel: 'Enrol in her school',
    proveLabel: 'Add up her test sums in your head',
    learned: 'By the end of the week, crooked scales and fiddled sums jump off the page at you.',
    failed: 'You fumble the last sum. Madam Quill tuts, but she shows you a few of her tricks anyway.',
    decline: 'Keep counting on your fingers',
    declined: '"Your loss," she sniffs, and marches off to find a better student.',
  },
  2: {
    title: 'The Night Fox',
    body: [
      'A grey-whiskered smuggler leans out of the shadows. "They called me the Night Fox," she whispers. "Nobody ever caught me."',
      '"Your footsteps are loud. I can fix that, if you are brave enough to learn."',
    ],
    perk: 'shadow_step',
    stat: 'nerve',
    dc: 14,
    payLabel: 'Pay for her lessons',
    proveLabel: 'Follow her over the rooftops',
    learned: 'Night after night you run the rooftops with her. Soon you can cross the market without a single head turning.',
    failed: 'You slip on a wet tile and land in a fish cart. The Fox laughs, but she teaches you a thing or two.',
    decline: 'Stay on solid ground',
    declined: 'The Fox shrugs and melts back into the dark.',
  },
  3: {
    title: 'Sergeant Brask\'s Challenge',
    body: [
      'A sergeant with a moustache like a broom watches you haul crates. "Not bad, merchant," he barks. "Not good, either."',
      '"I train soldiers who never give up. Want to be one of them?"',
    ],
    perk: 'iron_will',
    stat: 'grit',
    dc: 15,
    payLabel: 'Pay for his drill',
    proveLabel: 'Run his obstacle course',
    learned: 'Mud, ropes and dawn runs. By the end, nothing can make you quit.',
    failed: 'You collapse at the last wall. Brask hauls you up. "You\'ll do," he growls, and keeps training you anyway.',
    decline: 'Thank him and keep walking',
    declined: '"Soft!" Brask bellows after you. The soldiers laugh.',
  },
  4: {
    title: 'Lady Orrin\'s Lessons',
    body: [
      'The most famous banker in Vessarin taps her silver cane. "Half of banking is numbers," Lady Orrin says. "The other half is how you say them."',
      '"I could teach you the other half."',
    ],
    perk: 'golden_words',
    stat: 'charm',
    dc: 15,
    payLabel: 'Pay for her lessons',
    proveLabel: 'Win over her grumpy butler',
    learned: 'She teaches you when to smile, when to pause, and when to stop talking. Doors start opening for you.',
    failed: 'The butler stays grumpy. Lady Orrin smiles anyway. "A start," she says, and gives you one lesson.',
    decline: 'Politely refuse',
    declined: 'Lady Orrin nods. "Another time, perhaps." Her cane taps away down the street.',
  },
  5: {
    title: 'Mother Wren\'s Garden',
    body: [
      'An old herb healer kneels among her mint and lavender. "The sick need calm hands," Mother Wren says. "So do merchants."',
      '"Help me here, and I will teach you to stay calm when everything goes wrong."',
    ],
    perk: 'healers_calm',
    stat: 'grit',
    dc: 15,
    payLabel: 'Pay to study with her',
    proveLabel: 'Work her garden from dawn to dusk',
    learned: 'She teaches you to breathe slowly and try again. When things go wrong now, you get a second go.',
    failed: 'Your back gives out by noon. Mother Wren brews you tea, and shares some of her calm anyway.',
    decline: 'Leave her to her garden',
    declined: 'Mother Wren hands you a sprig of mint for the road.',
  },
  6: {
    title: 'Old Judge Callow',
    body: [
      'In a city full of lies, old Judge Callow is the one man everyone trusts. He peers at you over his spectacles.',
      '"A good name is worth more than gold," he says. "Let me help you build one."',
    ],
    perk: 'trusted_name',
    stat: 'charm',
    dc: 15,
    payLabel: 'Pay him to vouch for you',
    proveLabel: 'Answer his hardest questions honestly',
    learned: 'The judge writes your name in his great book. Now, whatever happens, people will still trade with you.',
    failed: 'One answer comes out wrong. The judge frowns, but he still puts in a good word for you.',
    decline: 'Keep your own counsel',
    declined: 'The judge closes his book. "As you wish."',
  },
  7: {
    title: 'The Star-Merchant',
    body: [
      'A merchant steps out of the rift, her coat full of stars. "In my world," she says, "I sold the moon twice."',
      '"I will teach you the oldest secret of trade, if you can keep up."',
    ],
    perk: 'master_merchant',
    stat: 'savvy',
    dc: 16,
    payLabel: 'Pay in rare coin',
    proveLabel: 'Out-bargain her at her own game',
    learned: 'She shows you how every price hides a better one. From now on, nobody sells to you at full price.',
    failed: 'She wins every round, laughing. But you learn a lot from losing.',
    decline: 'Keep your feet in this world',
    declined: 'The Star-Merchant bows and steps back into the rift.',
  },
}

const TRAINING: Record<ChapterNumber, TrainingSpec> = {
  1: {
    title: 'The Harbour Games',
    body: ['Bunting flaps over the docks. It\'s the Harbour Games, and the trainers are offering cheap lessons to anyone who joins in.'],
    a: { stat: 'grit', label: 'Train for the barrel race', done: 'You roll barrels until your arms ache. You\'re tougher for it.' },
    b: { stat: 'nerve', label: 'Train for the mast climb', done: 'You climb higher every day, until the wind can\'t scare you.' },
    practice: { stat: 'nerve', label: 'Just have a go at the mast climb', success: 'You ring the bell at the top! The crowd cheers, and you feel braver already.', failure: 'You slide down halfway. Maybe next year.' },
  },
  2: {
    title: 'The Lantern Quarter Fencing School',
    body: ['Steel rings behind a red door in the Lantern Quarter. A fencing master is teaching tricks of the blade, and tricks of the tongue.'],
    a: { stat: 'nerve', label: 'Learn to hold your ground', done: 'You learn to stand still while the blade flashes past. Nothing rattles you now.' },
    b: { stat: 'charm', label: 'Learn the fencer\'s banter', done: 'You learn to grin, bow and say something clever. People love it.' },
    practice: { stat: 'nerve', label: 'Join a practice bout for free', success: 'You win the bout with a flourish! You walk out a little braver.', failure: 'You lose, but you learn where you went wrong.' },
  },
  3: {
    title: 'The Quartermaster\'s School',
    body: ['The army needs people who can count supplies and carry them. A quartermaster is running crash courses, cheap, for anyone willing.'],
    a: { stat: 'savvy', label: 'Study supply ledgers', done: 'Wagons, barrels and sacks: soon you can count a camp\'s supplies in your head.' },
    b: { stat: 'grit', label: 'March with the supply column', done: 'You march for a week through rain and mud. Your legs turn to iron.' },
    practice: { stat: 'savvy', label: 'Try the quartermaster\'s puzzle for free', success: 'You solve the puzzle first! The quartermaster nods. You feel sharper already.', failure: 'The numbers beat you this time.' },
  },
  4: {
    title: 'The Clockwork Gymnasium',
    body: ['Steam hisses in a hall full of brass machines. Clerks come here after work to train mind and body, and today the trial lessons are cheap.'],
    a: { stat: 'nerve', label: 'Ride the spinning brass wheel', done: 'Round and round you go, until fear simply gives up on you.' },
    b: { stat: 'savvy', label: 'Play the calculating engines', done: 'You race the clockwork calculators. Sometimes you even win.' },
    practice: { stat: 'nerve', label: 'Try the wheel once for free', success: 'You stay on to the very end! The clerks clap.', failure: 'You stumble off, dizzy and laughing.' },
  },
  5: {
    title: 'Helping in the Wards',
    body: ['The sickrooms need helpers, and the nurses teach while you work. It\'s hard, kind work, and it changes you.'],
    a: { stat: 'grit', label: 'Work the night shifts', done: 'Night after night, you keep going. You find strength you never knew you had.' },
    b: { stat: 'charm', label: 'Sit with the patients', done: 'You learn to listen and to cheer people up. Everyone feels better around you.' },
    practice: { stat: 'charm', label: 'Help out for a day', success: 'The patients ask for you by name. You feel warmer inside.', failure: 'It\'s a hard day, but you did your best.' },
  },
  6: {
    title: 'The Spymaster\'s Games',
    body: ['An old spymaster runs games in a back room: spot the liar, find the hidden coin, keep a straight face. Cheap lessons, for those who dare.'],
    a: { stat: 'savvy', label: 'Learn to spot a liar', done: 'Twitching eyes, too-quick smiles: you see every tell now.' },
    b: { stat: 'nerve', label: 'Learn to keep a straight face', done: 'You could hold four aces and look bored. Nobody can read you.' },
    practice: { stat: 'savvy', label: 'Play one game for free', success: 'You spot the liar in one go! The spymaster raises an eyebrow.', failure: 'The liar fools you completely. You laugh along.' },
  },
  7: {
    title: 'The Rift Observatory',
    body: ['Astronomers watch the rift through a great brass telescope. They teach visitors to read its strange stars, for a small fee.'],
    a: { stat: 'savvy', label: 'Study the rift\'s stars', done: 'The patterns start to make sense. You see the future of trade in them.' },
    b: { stat: 'charm', label: 'Trade stories with the star-folk', done: 'Visitors from the rift love your stories, and you love theirs.' },
    practice: { stat: 'savvy', label: 'Peek through the telescope for free', success: 'You spot a pattern the astronomers missed! They write your name in their book.', failure: 'All you see is a very big moth.' },
  },
}

function mentorCard(chapter: ChapterNumber): StoryCard {
  const m = MENTORS[chapter]
  const perk = PERKS[m.perk]!
  const fee = mentorFee(chapter)
  return {
    id: `mentor_ch${chapter}`,
    weight: MENTOR_WEIGHT,
    once: true,
    title: m.title,
    body: m.body,
    choices: [
      {
        id: `mentor_ch${chapter}_pay`,
        label: `${m.payLabel} (-${fee}g, gain ${perk.name})`,
        requires: [{ kind: 'goldAtLeast', amount: fee }],
        effects: [{ kind: 'gold', delta: -fee }, { kind: 'grantBoon', boon: perk.id }, { kind: 'narrate', text: m.learned }],
      },
      {
        id: `mentor_ch${chapter}_prove`,
        label: `${m.proveLabel} (${cap(m.stat)} check, DC ${m.dc})`,
        check: {
          stat: m.stat,
          dc: m.dc,
          success: { text: m.learned, effects: [{ kind: 'grantBoon', boon: perk.id }] },
          failure: { text: m.failed, effects: [{ kind: 'stat', stat: m.stat, delta: 1 }] },
        },
      },
      { id: `mentor_ch${chapter}_decline`, label: m.decline, effects: [{ kind: 'narrate', text: m.declined }] },
    ],
  }
}

function trainingCard(chapter: ChapterNumber): StoryCard {
  const t = TRAINING[chapter]
  const fee = trainingFee(chapter)
  const train = (side: 'a' | 'b') => ({
    id: `training_ch${chapter}_${side}`,
    label: `${t[side].label} (-${fee}g, +2 ${cap(t[side].stat)})`,
    requires: [{ kind: 'goldAtLeast' as const, amount: fee }],
    effects: [{ kind: 'gold' as const, delta: -fee }, { kind: 'stat' as const, stat: t[side].stat, delta: 2 }, { kind: 'narrate' as const, text: t[side].done }],
  })
  return {
    id: `training_ch${chapter}`,
    weight: TRAINING_WEIGHT,
    once: true,
    title: t.title,
    body: t.body,
    choices: [
      train('a'),
      train('b'),
      {
        id: `training_ch${chapter}_practice`,
        label: `${t.practice.label} (${cap(t.practice.stat)} check, DC 13: +1 ${cap(t.practice.stat)})`,
        check: {
          stat: t.practice.stat,
          dc: 13,
          success: { text: t.practice.success, effects: [{ kind: 'stat', stat: t.practice.stat, delta: 1 }] },
          failure: { text: t.practice.failure },
        },
      },
    ],
  }
}

/** This chapter's mentor and training cards, for its chapter deck. */
export function mentors(chapter: ChapterNumber): StoryCard[] {
  return [mentorCard(chapter), trainingCard(chapter)]
}
