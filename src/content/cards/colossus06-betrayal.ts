import type { StoryCard } from '../../engine/types'
import { enterChapter } from './factories'

const colossus06_start: StoryCard = {
  id: 'colossus06_start',
  title: 'The Conspiracy Revealed',
  body: [
    'A letter arrives with no name on it. Your hands shake as you read.',
    'It lists every shady deal you ever made. Every favour from a crook. Every corner you cut for a little more gold.',
    'The last line reads: "The Syndicate is calling in every debt, all at once."',
    'This is the sixth Colossus: the Betrayal, a giant made of shadows and broken promises. Every choice you made has come back to collect. You must outwit it, or lose everything.',
  ],
  choices: [{ id: 'face_betrayal', label: 'Face your past', goto: 'colossus06_trial_savvy' }],
}

const colossus06_trial_savvy: StoryCard = {
  id: 'colossus06_trial_savvy',
  title: 'The Web of Debts',
  body: [
    'You spread every debt across your table: smugglers, crooked officials, thieves. Each one holds a thread that could pull you down.',
    'A fixer in a grey cloak sits across from you. "You can run," she says. "Or you can untangle the web, and make yourself too useful to ruin."',
  ],
  choices: [
    {
      id: 'outthink_syndicate',
      label: 'Untangle the web (Savvy check, DC 18)',
      check: {
        stat: 'savvy',
        dc: 18,
        success: {
          text: 'Brilliant! You turn their own threads against them. Now the Syndicate needs you more than you need them.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_betrayal', atLeast: 1 }, then: [{ kind: 'narrate', text: 'Everything you learned about the underworld pays off. You know their web better than they do.' }], else: [] },
          ],
          goto: 'colossus06_trial_nerve',
        },
        failure: {
          text: 'Your plan unravels. The Syndicate pulls its threads tighter.',
          effects: [{ kind: 'stat', stat: 'savvy', delta: -1 }],
          goto: 'colossus06_trial_nerve',
        },
      },
    },
  ],
}

const colossus06_trial_nerve: StoryCard = {
  id: 'colossus06_trial_nerve',
  title: 'The Syndicate\'s Offer',
  body: [
    'The Syndicate\'s bosses meet you in a dark hall. They look impressed, and a little afraid of you.',
    '"Sign this," says their leader, sliding a paper across the table, "and the docks belong to us. Hundreds of honest families will lose their work. Refuse, and you lose everything you own."',
    'For the first time, you see clearly what you have become.',
  ],
  choices: [
    {
      id: 'refuse_evil',
      label: 'Refuse to sign, whatever it costs (Nerve check, DC 19)',
      check: {
        stat: 'nerve',
        dc: 19,
        success: {
          text: 'You push the paper back. "No." To everyone\'s surprise, the bosses respect your courage. You lose a lot, but you keep your honour.',
          effects: [
            { kind: 'stat', stat: 'nerve', delta: 2 },
            { kind: 'gold', delta: -500 },
            { kind: 'if', when: { kind: 'flag', id: 'investigated_betrayal', atLeast: 1 }, then: [{ kind: 'stat', stat: 'savvy', delta: 1 }, { kind: 'narrate', text: 'You know the Syndicate\'s own code of honour, and you use it. They respect that even more.' }], else: [] },
          ],
          goto: 'colossus06_outcome',
        },
        failure: {
          text: 'Your hand shakes, and you sign. You keep your fortune, but something inside you breaks.',
          effects: [{ kind: 'stat', stat: 'charm', delta: -2 }],
          goto: 'colossus06_outcome',
        },
      },
    },
  ],
}

const colossus06_outcome: StoryCard = {
  id: 'colossus06_outcome',
  title: 'The Reckoning',
  onEnter: [
    { kind: 'grantBoon', boon: 'syndicate_grace' },
    { kind: 'reckoning' },
    { kind: 'advancePhase', to: 'recovery' },
    ...enterChapter(7),
    { kind: 'queueCard', card: 'betrayal_aftermath' },
    { kind: 'narrate', text: 'The shadows of the Betrayal melt away. Your business is smaller now, but it is truly yours. The Syndicate leaves you alone. They have learned you are a survivor.' },
  ],
  body: [
    'Days later, you walk through the city, changed.',
    'Everyone knows what happened. Some fear you. Some respect you. Some won\'t look at you at all.',
    'You know who you really are now. You cannot forget it.',
  ],
  choices: [{ id: 'continue_after_betrayal', label: 'Walk on', effects: [] }],
}

export const colossus06Cards: StoryCard[] = [
  colossus06_start,
  colossus06_trial_savvy,
  colossus06_trial_nerve,
  colossus06_outcome,
]
