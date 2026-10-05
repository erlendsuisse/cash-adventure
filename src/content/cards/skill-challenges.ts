import type { ChapterNumber, Choice, StatId, StoryCard } from '../../engine/types'
import { heat } from './factories'
import { standing } from '../standings'

// SKILL CHALLENGES
// Cards where your attributes are the whole point. Each offers 2 or 3 ways in,
// using different attributes, so whatever you've trained has somewhere to
// shine - and gear, skills and trophies all add to these rolls.

const WEIGHT = 7

const cap = (stat: StatId) => stat[0]!.toUpperCase() + stat.slice(1)

/** A roll that pays gold on success (and the reward is in the label, so kids know what's at stake). */
function attempt(id: string, label: string, stat: StatId, dc: number, gold: number, success: string, failure: string, extra: { onSuccess?: Choice['effects']; onFailure?: Choice['effects'] } = {}): Choice {
  return {
    id,
    label: `${label} (${cap(stat)} check, DC ${dc}: +${gold}g)`,
    check: {
      stat,
      dc,
      success: { text: success, effects: [{ kind: 'gold', delta: gold }, ...(extra.onSuccess ?? [])] },
      failure: { text: failure, effects: extra.onFailure ?? [] },
    },
  }
}

const walkAway = (id: string, label: string, text: string): Choice => ({ id, label, effects: [{ kind: 'narrate', text }] })

const card = (id: string, chapter: ChapterNumber, title: string, body: string[], choices: Choice[]): StoryCard & { skillChapter: ChapterNumber } => ({
  id,
  weight: WEIGHT,
  once: true,
  title,
  body,
  choices,
  skillChapter: chapter,
})

const CARDS = [
  // ---------- Chapter 2: Underworld Rising ----------
  card('ch2_skill_card_sharp', 2, 'The Card Sharp\'s Table', [
    'A man in a velvet waistcoat shuffles cards so fast they blur. "Find the queen," he grins, "and the pot is yours."',
    'You\'re sure he\'s cheating. The question is how.',
  ], [
    attempt('sharp_watch', 'Watch his hands closely', 'savvy', 14, 90, 'You spot the queen up his sleeve and tap it. The crowd roars, and he pays up with a sour face.', 'His hands are too quick. You lose the round, but nothing more.'),
    attempt('sharp_bluff', 'Out-bluff the bluffer', 'nerve', 15, 110, 'You stare him down until he sweats. He folds, and the pot is yours.', 'He smiles. "Nice try." You walk away a little red in the face.'),
    walkAway('sharp_leave', 'Keep your coins in your pocket', 'You leave the table. Somebody else loses their wages instead.'),
  ]),
  card('ch2_skill_stolen_ledger', 2, 'The Stolen Ledger', [
    'A shaking clerk grabs your sleeve. "They stole my master\'s ledger! If the gangs read it, every merchant in the street is ruined."',
    'The thieves are playing dice in the Rusty Anchor, the ledger on the table between them.',
  ], [
    attempt('ledger_sneak', 'Slip it off the table', 'nerve', 15, 80, 'You lift it as smooth as silk. The clerk weeps with relief, and his master pays you well.', 'A thief grabs your wrist. You run for it, empty-handed.', { onSuccess: [standing('guilds', 1)] }),
    attempt('ledger_talk', 'Talk them into selling it cheap', 'charm', 14, 60, 'Two songs and a plate of pies later, they hand it over for a few coppers. The master is delighted.', 'They laugh you out of the tavern.', { onSuccess: [standing('guilds', 1)] }),
    walkAway('ledger_leave', 'Tell the clerk to fetch the Watch', 'The clerk hurries off. You hope the Watch is quicker than usual.'),
  ]),
  card('ch2_skill_counterfeit', 2, 'Funny Money', [
    'A coin in your purse rings wrong when it hits the counter. Then another. Someone is passing fake silver in the night market.',
    'The guild would pay well to know who.',
  ], [
    attempt('fake_trace', 'Trace the fake coins back', 'savvy', 15, 100, 'You follow the coins stall by stall to a forger\'s cellar. The guild pays you a fat reward.', 'The trail goes cold in a maze of alleys.', { onSuccess: [standing('guilds', 1)] }),
    attempt('fake_stakeout', 'Wait all night to catch the forger', 'grit', 14, 80, 'At dawn, a cloaked figure creeps out with a sack of fakes. Caught! The guild pays your reward.', 'You doze off at midnight. When you wake, the forger is long gone.'),
    walkAway('fake_spend', 'Just check your coins more carefully', 'You bite every coin from now on. Your teeth do not thank you.'),
  ]),
  card('ch2_skill_runaway_cart', 2, 'Runaway Cart!', [
    'A cart full of spice barrels thunders down Lantern Hill. Its driver is shouting. Children are playing at the bottom!',
  ], [
    attempt('cart_grab', 'Grab the reins', 'grit', 14, 70, 'You leap aboard and haul back on the reins. The cart stops a whisker from the children. The driver pays you in gratitude.', 'You can\'t hold it, but the children scatter in time. The driver still thanks you.', { onSuccess: [standing('folk', 2)], onFailure: [standing('folk', 1)] }),
    attempt('cart_shout', 'Shout the street clear', 'charm', 13, 40, 'Your voice rings out, and everyone dives aside. Nobody is hurt, and the driver presses coins into your hand.', 'The noise is too much, but people jump clear anyway.', { onSuccess: [standing('folk', 1)] }),
  ]),
  card('ch2_skill_smugglers_riddle', 2, 'The Smugglers\' Riddle', [
    'The smugglers\' boss is bored. "Answer my riddle," she says, "and you can sell your goods in my market, tax-free, for a month."',
    '"Get it wrong, and you pay me double."',
  ], [
    attempt('riddle_answer', 'Answer the riddle', 'savvy', 15, 120, '"A ledger!" you cry. She roars with laughter and keeps her word. Your goods fly off her stalls.', 'Wrong! She takes her fee with a wink.', { onSuccess: [heat('mafia')], onFailure: [{ kind: 'gold', delta: -30 }] }),
    walkAway('riddle_leave', 'Bow and back away', '"Clever," she says. "Too clever to play."'),
  ]),
  card('ch2_skill_watch_patrol', 2, 'Stopped by the Watch', [
    'A Watch sergeant blocks the alley with his lantern. "Out late, merchant. Let\'s see what\'s in your bag."',
    'Your bag is honest. But he looks like he wants a bribe.',
  ], [
    attempt('watch_calm', 'Stay calm and open the bag', 'nerve', 13, 30, 'You open it with a yawn. Nothing but ledgers. The embarrassed sergeant buys you a hot pie to say sorry.', 'Your hands shake, so he searches every pocket. It takes an hour.', { onFailure: [{ kind: 'advanceDays', days: 1 }] }),
    attempt('watch_charm', 'Chat about his long night shift', 'charm', 14, 30, 'Soon he\'s telling you all about his bunions. He waves you on, and slips you a tip about a cheap warehouse.', 'He is not in the mood. "Move along."', { onSuccess: [standing('crown', 1)] }),
  ]),

  // ---------- Chapter 3: Warfare & Conflict ----------
  card('ch3_skill_supply_audit', 3, 'The Missing Muskets', [
    'The army\'s ledgers say 500 muskets arrived. The racks hold 300. "Someone is stealing from the army," the colonel growls.',
    '"Find out who, and you\'ll be paid. Fail, and I may wonder about you."',
  ], [
    attempt('audit_books', 'Go through every ledger', 'savvy', 15, 140, 'Page 300 gives it away: a clerk counting crates twice. The colonel pays you handsomely.', 'The books are a tangle. The colonel frowns and finds someone else.', { onSuccess: [standing('crown', 2)] }),
    attempt('audit_watch', 'Watch the depot at night', 'grit', 15, 120, 'Three nights in the cold, and then you see them: a cart sneaking out the back. Caught!', 'Nothing happens for 3 nights. You go home with a cold.', { onSuccess: [standing('crown', 1)] }),
    walkAway('audit_leave', 'Say it\'s not your business', 'The colonel grunts and turns away.'),
  ]),
  card('ch3_skill_peace_talks', 3, 'Tea Between Enemies', [
    'Two rival captains want the same warehouse. Swords are half out.',
    '"Merchant!" one shouts. "You\'re neutral. Settle this, or we\'ll settle it ourselves."',
  ], [
    attempt('peace_charm', 'Share a pot of tea and talk', 'charm', 15, 120, 'By the second cup, they\'re laughing about the same terrible general. They split the warehouse and pay your fee.', 'They storm off in opposite directions, but at least the swords stay sheathed.', { onSuccess: [standing('crown', 1), standing('folk', 1)] }),
    attempt('peace_split', 'Draw up a fair split', 'savvy', 14, 90, 'You measure the warehouse to the inch and split it perfectly. Neither can argue.', 'Your sums are off. Both captains are cross with you now.'),
  ]),
  card('ch3_skill_river_crossing', 3, 'The Flooded Ford', [
    'Rain has turned the ford into a roaring river. Your wagon of salt is on this bank. The army camp is on the other, and it pays double today.',
  ], [
    attempt('ford_drive', 'Drive the wagon across', 'nerve', 15, 130, 'Water swirls around the wheels, but you never stop. The camp cheers as you roll in.', 'Halfway over, you lose your nerve and turn back, soaked to the bone.'),
    attempt('ford_carry', 'Carry the sacks over one by one', 'grit', 16, 150, 'Sack after sack, all night long. By dawn every one is across, and the quartermaster pays extra.', 'After 10 sacks your legs give out. You sell those 10, at least.', { onFailure: [{ kind: 'gold', delta: 20 }] }),
    walkAway('ford_wait', 'Wait for the water to fall', 'By the time the river drops, the army has bought elsewhere.'),
  ]),
  card('ch3_skill_spy', 3, 'A Spy in the Market', [
    'A trader asks too many questions about the army\'s wagons. His accent slips. His boots are far too new.',
    'The Crown pays well for spies.',
  ], [
    attempt('spy_trick', 'Trick him with a false rumour', 'savvy', 15, 120, 'You let slip a false route. When enemy scouts turn up there, the Crown knows who sent them.', 'He doesn\'t take the bait, and slips away in the crowd.', { onSuccess: [standing('crown', 2)] }),
    attempt('spy_follow', 'Follow him through the streets', 'nerve', 15, 110, 'You trail him to a hidden room full of maps. The Crown\'s soldiers do the rest.', 'He spots you and vanishes down an alley.', { onSuccess: [standing('crown', 1)] }),
    walkAway('spy_ignore', 'Stay out of it', 'Somebody else can catch spies. You have a business to run.'),
  ]),
  card('ch3_skill_war_horse', 3, 'The Wild War-Horse', [
    'The cavalry has a horse nobody can ride. "Thunder," the stable master sighs. "Tame him, and he\'s yours to sell."',
  ], [
    attempt('horse_ride', 'Climb on and hold tight', 'grit', 16, 160, 'Thunder bucks for an hour, then stops and snorts. A rich captain buys him from you on the spot.', 'You land in the hay, again and again. Thunder looks very pleased with himself.'),
    attempt('horse_calm', 'Talk to him softly', 'charm', 15, 140, 'You hum and stroke his neck until he lowers his head. A rich captain buys him at once.', 'Thunder nips your hat and runs off with it.'),
  ]),
  card('ch3_skill_recruiter', 3, 'The Recruiting Sergeant', [
    'A recruiting sergeant thumps the table. "The army needs merchants who can keep their heads. Arm-wrestle me for a supply contract!"',
  ], [
    attempt('recruit_wrestle', 'Take him on', 'grit', 15, 100, 'Your arm shakes, but his goes down first. He laughs and signs the contract.', 'He slams your hand down. "Good effort," he says, and buys you a hot pie.', { onSuccess: [{ kind: 'wages', delta: 5 }] }),
    attempt('recruit_wit', 'Challenge him to a counting race instead', 'savvy', 14, 80, 'He gets to 40 sacks. You get to the answer. He signs, chuckling.', 'He wins by a sack. "Better luck next war," he says.'),
    walkAway('recruit_no', 'Shake his hand and move on', '"Come back if you change your mind," he booms.'),
  ]),
]

/** This chapter's skill-challenge cards, for its chapter deck. */
export function skillChallenges(chapter: ChapterNumber): StoryCard[] {
  return CARDS.filter((c) => c.skillChapter === chapter).map(({ skillChapter: _chapter, ...c }) => c)
}
