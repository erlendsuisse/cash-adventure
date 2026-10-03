import type { StoryCard } from '../../engine/types'
import { standing, STANDING_THRESHOLD, standingAtLeast, standingAtMost } from '../standings'

// PAYBACK
// One-time events that fire once a faction's opinion of you crosses the
// threshold either way, so the reputation the sidebar shows visibly pays off -
// or comes due. Drawn in any chapter after the first Colossus.

const T = STANDING_THRESHOLD

export const reputationEventCards: StoryCard[] = [
  // ---- Guilds ----
  {
    id: 'rep_guilds_honoured',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtLeast('guilds', T)],
    title: 'The Guilds Extend Credit',
    body: ['A guild master calls on you with a strongbox. "You keep your word, and the guilds keep theirs. Consider this an advance on your next venture - no interest, no paperwork."'],
    choices: [
      { id: 'accept_guild_credit', label: 'Accept with thanks (+250g)', effects: [{ kind: 'gold', delta: 250 }, { kind: 'narrate', text: 'Honest trade, it turns out, compounds.' }] },
    ],
  },
  {
    id: 'rep_guilds_shunned',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtMost('guilds', -T)],
    title: 'Blacklisted by the Guilds',
    body: ['Your name is struck from the guild rolls. No guild member may trade with you directly. Every deal now goes through middlemen, and the middlemen know it.'],
    choices: [
      {
        id: 'pay_restitution',
        label: 'Pay restitution to be reinstated (-200g, Guilds +2)',
        requires: [{ kind: 'goldAtLeast', amount: 200 }],
        showLockedAs: 'Needs 200g',
        effects: [{ kind: 'gold', delta: -200 }, standing('guilds', 2), { kind: 'narrate', text: 'You pay, and grovel. The guild restores your name - on probation.' }],
      },
      { id: 'use_middlemen', label: 'Trade through middlemen (-120g)', effects: [{ kind: 'gold', delta: -120 }, { kind: 'narrate', text: 'The middlemen take their cut, and smile while doing it.' }] },
    ],
  },

  // ---- Common folk ----
  {
    id: 'rep_folk_honoured',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtLeast('folk', T)],
    title: 'The People Remember',
    body: ['You arrive at your warehouse to find it swept, repaired and restocked. The dockhands, the bakers, the families you helped - they did it overnight, and they will not take your coin.'],
    choices: [
      {
        id: 'thank_the_people',
        label: 'Thank them (+200g in saved costs, +1 Grit)',
        effects: [{ kind: 'gold', delta: 200 }, { kind: 'stat', stat: 'grit', delta: 1 }, { kind: 'narrate', text: 'For once, the city gives something back.' }],
      },
    ],
  },
  {
    id: 'rep_folk_scorned',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtMost('folk', -T)],
    title: 'Rocks Through Your Windows',
    body: ['The common folk have long memories. This morning your shopfront is smashed, your name chalked on the wall with a word you would rather not repeat.'],
    choices: [
      {
        id: 'make_amends',
        label: 'Make amends - fund a soup kitchen (-150g, Common Folk +2)',
        requires: [{ kind: 'goldAtLeast', amount: 150 }],
        showLockedAs: 'Needs 150g',
        effects: [{ kind: 'gold', delta: -150 }, standing('folk', 2), { kind: 'narrate', text: 'The soup is good. Slowly, the chalk on your wall gets washed away.' }],
      },
      { id: 'repair_and_ignore', label: 'Repair the damage and ignore them (-150g)', effects: [{ kind: 'gold', delta: -150 }, { kind: 'narrate', text: 'You pay the glazier. The glares follow you down the street.' }] },
    ],
  },

  // ---- Crown ----
  {
    id: 'rep_crown_honoured',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtLeast('crown', T)],
    title: 'A Royal Stipend',
    body: ['A herald in royal livery reads a proclamation in your doorway: for services to the realm, you are granted a stipend from the treasury, payable monthly, for as long as you remain loyal.'],
    choices: [
      { id: 'accept_stipend', label: 'Accept the stipend (+25g wages)', effects: [{ kind: 'wages', delta: 25 }, { kind: 'narrate', text: 'The Crown pays its friends. You intend to remain one.' }] },
    ],
  },
  {
    id: 'rep_crown_hostile',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtMost('crown', -T)],
    title: 'The Crown Takes an Interest',
    body: ['Tax assessors arrive unannounced, with soldiers. They intend to audit everything you own, and they expect to find something.'],
    choices: [
      { id: 'pay_assessment', label: 'Pay the assessment (-200g)', effects: [{ kind: 'gold', delta: -200 }, { kind: 'narrate', text: 'They find something. They always do.' }] },
      {
        id: 'cooperate_fully',
        label: 'Open your books and cooperate (Savvy check, DC 14)',
        check: {
          stat: 'savvy',
          dc: 14,
          success: { text: 'Your books are spotless. The assessors leave with nothing - and a grudging respect.', effects: [standing('crown', 2)] },
          failure: { text: 'They find irregularities and fine you heavily.', effects: [{ kind: 'gold', delta: -300 }] },
        },
      },
    ],
  },

  // ---- Underworld ----
  {
    id: 'rep_underworld_honoured',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtLeast('underworld', T)],
    title: 'A Gift from Below',
    body: ['A crate arrives with no sender. Inside: silver, a bottle of very old brandy, and a note. "Friends look after friends."'],
    choices: [
      { id: 'accept_gift', label: 'Accept the gift (+250g, +1 Nerve)', effects: [{ kind: 'gold', delta: 250 }, { kind: 'stat', stat: 'nerve', delta: 1 }, { kind: 'narrate', text: 'You don\'t ask where it came from. That is the point.' }] },
    ],
  },
  {
    id: 'rep_underworld_hostile',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtMost('underworld', -T)],
    title: 'The Underworld Settles a Score',
    body: ['You crossed the wrong people. A shipment of yours goes missing between the docks and your warehouse, and everyone on the road swears they saw nothing.'],
    choices: [
      {
        id: 'pay_tribute',
        label: 'Pay tribute to make peace (-150g, Underworld +2)',
        requires: [{ kind: 'goldAtLeast', amount: 150 }],
        showLockedAs: 'Needs 150g',
        effects: [{ kind: 'gold', delta: -150 }, standing('underworld', 2), { kind: 'narrate', text: 'The tribute is accepted. Your next shipment arrives untouched.' }],
      },
      { id: 'write_off_shipment', label: 'Write off the shipment (-200g)', effects: [{ kind: 'gold', delta: -200 }, { kind: 'narrate', text: 'You eat the loss. The road stays dangerous for you.' }] },
    ],
  },
]
