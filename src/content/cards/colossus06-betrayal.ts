import type { StoryCard } from '../../engine/types'
import { enterChapter } from './factories'

const colossus06_start: StoryCard = {
  id: 'colossus06_start',
  title: 'The Conspiracy Revealed',
  body: [
    'A letter arrives. Anonymous. The contents are explosive.',
    'The Betrayal is the sixth Colossus. It is the accumulated consequence of every compromise you\'ve made, every morally gray deal, every time you chose profit over principles.',
    'It details every compromising decision you\'ve made. Every favor called in from disreputable sources. Every deal with questionable partners. Every time you chose profit over principle.',
    'The letter concludes: "Your empire is built on lies and debts owed to people who are about to collect. The Syndicate is calling in every favor. Every deal. Every obligation. You will choose between your wealth and your life."',
    'This is not a market crash. This is not a natural disaster. This is The Betrayal—the moment when every choice you made returns as a debt to be paid. The city\'s underworld will no longer let you operate freely. You must negotiate, outwit, or surrender everything.',
  ],
  choices: [{ id: 'face_betrayal', label: 'Confront Your Past', goto: 'colossus06_trial_savvy' }],
}

const colossus06_trial_savvy: StoryCard = {
  id: 'colossus06_trial_savvy',
  title: 'The Web of Debts',
  body: [
    'You spend days cataloging your obligations. The underworld contacts. The corrupt officials. The smugglers. The thieves.',
    'Each one holds a piece of you. Each one can bring you down.',
    'A fixer sits across from you: "You can run. You can hide. Or you can play the game better than anyone else ever has. Understand the web. Renegotiate the debts. Make yourself too valuable to destroy."',
    'Can you outthink the Syndicate?',
  ],
  choices: [
    {
      id: 'outthink_syndicate',
      label: 'Renegotiate all obligations (Savvy check, DC 18)',
      check: {
        stat: 'savvy',
        dc: 18,
        success: {
          text: 'You are brilliant. You turn their own network against them. You consolidate power. You become a broker of secrets, more valuable alive than dead.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_betrayal', atLeast: 1 }, then: [{ kind: 'narrate', text: 'Your earlier study of the underworld networks pays off spectacularly. You understand their systems better than they do.' }], else: [] },
          ],
          goto: 'colossus06_trial_nerve',
        },
        failure: {
          text: 'Your gambit fails. You lose leverage. The Syndicate tightens its grip.',
          effects: [{ kind: 'stat', stat: 'savvy', delta: -1 }],
          goto: 'colossus06_trial_nerve',
        },
      },
    },
  ],
}

const colossus06_trial_nerve: StoryCard = {
  id: 'colossus06_trial_nerve',
  title: 'The Price of Power',
  body: [
    'The Syndicate leadership meets with you. They are impressed and terrified in equal measure.',
    '"You\'re dangerous," their leader says. "You understand the game. But understanding is not enough. You must be willing to walk the line between justice and damnation. Are you?"',
    'They place a choice before you: take a contract that requires you to do something unspeakable, or give up everything.',
    'For the first time, you face what you\'ve become.',
  ],
  choices: [
    {
      id: 'refuse_evil',
      label: 'Refuse the contract and surrender (Nerve check, DC 19)',
      check: {
        stat: 'nerve',
        dc: 19,
        success: {
          text: 'You refuse. You name what you\'ve done. You turn yourself in. The Syndicate, shockingly, respects the courage. They let you live—diminished, but alive.',
          effects: [
            { kind: 'stat', stat: 'nerve', delta: 2 },
            { kind: 'gold', delta: -500 },
            { kind: 'if', when: { kind: 'flag', id: 'investigated_betrayal', atLeast: 1 }, then: [{ kind: 'stat', stat: 'savvy', delta: 1 }, { kind: 'narrate', text: 'Your understanding of the Syndicate\'s code of honor—learned through careful study—guides your response. They respect not just your courage, but your understanding.' }], else: [] },
          ],
          goto: 'colossus06_outcome',
        },
        failure: {
          text: 'You cannot find the courage. You take the contract. You survive, but something inside dies.',
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
    { kind: 'narrate', text: 'You survive the Syndicate\'s judgment. You emerge changed—lighter or darker depending on the choices you made. Your empire is smaller now, but it is yours in a way it never was before. The Syndicate leaves you alone. You have become something they recognize: a survivor who knows the cost of living in the grey.' },
  ],
  body: [
    'Days later, you walk through the city as a changed person.',
    'Everyone knows what happened. Some fear you. Some respect you. Some despise you.',
    'You know what you truly are now. And you cannot unknow it.',
  ],
  choices: [{ id: 'continue_after_betrayal', label: 'Carry Your Truth', effects: [] }],
}

export const colossus06Cards: StoryCard[] = [
  colossus06_start,
  colossus06_trial_savvy,
  colossus06_trial_nerve,
  colossus06_outcome,
]
