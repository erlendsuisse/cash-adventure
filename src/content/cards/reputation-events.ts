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
    body: ['A guild master arrives carrying a heavy strongbox. "You keep your word, so we keep ours," she says. "An advance on your next venture. No interest. No paperwork."'],
    choices: [
      { id: 'accept_guild_credit', label: 'Accept with thanks (+250g)', effects: [{ kind: 'gold', delta: 250 }, { kind: 'narrate', text: 'Honest trade, it turns out, pays you back with interest.' }] },
    ],
  },
  {
    id: 'rep_guilds_shunned',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtMost('guilds', -T)],
    title: 'Blacklisted by the Guilds',
    body: ['A clerk crosses out your name in the guild\'s great book. No guild member may trade with you now. Every deal must go through middlemen, and they know it.'],
    choices: [
      {
        id: 'pay_restitution',
        label: 'Pay to be forgiven (-200g, Guilds +2)',
        requires: [{ kind: 'goldAtLeast', amount: 200 }],
        showLockedAs: 'Needs 200g',
        effects: [{ kind: 'gold', delta: -200 }, standing('guilds', 2), { kind: 'narrate', text: 'You pay, and say sorry very nicely. Your name goes back in the book, in pencil.' }],
      },
      { id: 'use_middlemen', label: 'Use middlemen (-120g)', effects: [{ kind: 'gold', delta: -120 }, { kind: 'narrate', text: 'The middlemen take their cut, and smile while they do it.' }] },
    ],
  },

  // ---- Common folk ----
  {
    id: 'rep_folk_honoured',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtLeast('folk', T)],
    title: 'The People Remember',
    body: ['Your warehouse has been swept, mended and restocked overnight! The dockhands, the bakers, the families you helped did it all. They won\'t take a single coin.'],
    choices: [
      {
        id: 'thank_the_people',
        label: 'Thank them (+200g saved, +1 Grit)',
        effects: [{ kind: 'gold', delta: 200 }, { kind: 'stat', stat: 'grit', delta: 1 }, { kind: 'narrate', text: 'For once, the city gives something back. Your heart feels full.' }],
      },
    ],
  },
  {
    id: 'rep_folk_scorned',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtMost('folk', -T)],
    title: 'Stones Through Your Window',
    body: ['The ordinary folk of Vessarin have long memories. This morning, your shop window is smashed and a rude word is chalked by your door.'],
    choices: [
      {
        id: 'make_amends',
        label: 'Make amends with a soup kitchen (-150g, Common Folk +2)',
        requires: [{ kind: 'goldAtLeast', amount: 150 }],
        showLockedAs: 'Needs 150g',
        effects: [{ kind: 'gold', delta: -150 }, standing('folk', 2), { kind: 'narrate', text: 'The soup is hot and good. Slowly, the chalk gets washed away.' }],
      },
      { id: 'repair_and_ignore', label: 'Fix the window and ignore them (-150g)', effects: [{ kind: 'gold', delta: -150 }, { kind: 'narrate', text: 'You pay the glazier. The glares follow you down the street.' }] },
    ],
  },

  // ---- Crown ----
  {
    id: 'rep_crown_honoured',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtLeast('crown', T)],
    title: 'A Royal Stipend',
    body: ['A herald in royal colours blows a trumpet at your door. "For services to the kingdom," he reads, "you shall receive gold from the treasury every month!"'],
    choices: [
      { id: 'accept_stipend', label: 'Accept the royal gold (+25g wages)', effects: [{ kind: 'wages', delta: 25 }, { kind: 'narrate', text: 'The Crown rewards its friends. You plan to stay one.' }] },
    ],
  },
  {
    id: 'rep_crown_hostile',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtMost('crown', -T)],
    title: 'The Crown Takes an Interest',
    body: ['Tax collectors arrive with soldiers at their backs. They mean to check everything you own, and they expect to find something wrong.'],
    choices: [
      { id: 'pay_assessment', label: 'Pay what they ask (-200g)', effects: [{ kind: 'gold', delta: -200 }, { kind: 'narrate', text: 'They find something. They always do.' }] },
      {
        id: 'cooperate_fully',
        label: 'Show them your books (Savvy check, DC 14)',
        check: {
          stat: 'savvy',
          dc: 14,
          success: { text: 'Your books are spotless. They leave with nothing, and a little respect.', effects: [standing('crown', 2)] },
          failure: { text: 'They find a few mistakes, and fine you heavily.', effects: [{ kind: 'gold', delta: -300 }] },
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
    body: ['A crate arrives with no name on it. Inside: silver coins, a jar of rare honey, and a note. "Friends look after friends."'],
    choices: [
      { id: 'accept_gift', label: 'Accept the gift (+250g, +1 Nerve)', effects: [{ kind: 'gold', delta: 250 }, { kind: 'stat', stat: 'nerve', delta: 1 }, { kind: 'narrate', text: 'You don\'t ask where it came from. That\'s the whole point.' }] },
    ],
  },
  {
    id: 'rep_underworld_hostile',
    weight: 4,
    once: true,
    requires: [{ kind: 'colossiAtLeast', count: 1 }, standingAtMost('underworld', -T)],
    title: 'The Underworld Settles a Score',
    body: ['You crossed the wrong people. Now a whole shipment has vanished between the docks and your warehouse, and nobody saw a thing.'],
    choices: [
      {
        id: 'pay_tribute',
        label: 'Pay them to make peace (-150g, Underworld +2)',
        requires: [{ kind: 'goldAtLeast', amount: 150 }],
        showLockedAs: 'Needs 150g',
        effects: [{ kind: 'gold', delta: -150 }, standing('underworld', 2), { kind: 'narrate', text: 'They accept your gold. Your next shipment arrives safe and sound.' }],
      },
      { id: 'write_off_shipment', label: 'Accept the loss (-200g)', effects: [{ kind: 'gold', delta: -200 }, { kind: 'narrate', text: 'You swallow the loss. The road stays dangerous for you.' }] },
    ],
  },
]
