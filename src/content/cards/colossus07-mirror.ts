import type { StoryCard } from '../../engine/types'

const colossus07_start: StoryCard = {
  id: 'colossus07_start',
  title: 'The Mirror Appears',
  body: [
    'You have survived six impossible trials. You have wealth beyond what you imagined. You have power, respect, fear.',
    'And yet, something whispers in the darkness.',
    'The Mirror is the seventh and final Colossus. It is not external—it is you. The sum of every choice, every compromise, every triumph and failure. This is self-knowledge and judgment.',
    'A figure appears—faceless, ageless. "I am not a Colossus like the others," it says. "I am the sum of all your choices. I am what you have become."',
    '"The Ledger-Wyrm cannot break you—you mastered finance. The Inquisitor cannot break you—you faced your morality. The Tide cannot break you—you adapted. The Machine cannot break you—you became efficient. The Plague cannot break you—you chose compassion. The Syndicate cannot break you—you outwitted them."',
    '"But can you survive yourself? Can you face what you are and choose to be something better?"',
    'This is The Mirror—the final reckoning. You face not an external enemy, but the consequences of every decision you ever made.',
  ],
  choices: [{ id: 'face_mirror', label: 'Look Into The Mirror', goto: 'colossus07_trial_truth' }],
}

const colossus07_trial_truth: StoryCard = {
  id: 'colossus07_trial_truth',
  title: 'The Confession',
  body: [
    'The Mirror shows you everything. Every life you hurt for profit. Every compromise you made. Every person you could have helped but didn\'t.',
    'It shows you the version of yourself that existed before all of this—the person with principles. The person with hope.',
    '"What have you done with your life?" it asks.',
    'There is nowhere to hide. No one to blame. No excuse that holds weight in this moment.',
    'Do you accept what you have become?',
  ],
  choices: [
    {
      id: 'embrace_true_self',
      label: 'Accept your true self and rebuild',
      check: {
        stat: 'savvy',
        dc: 20,
        success: {
          text: 'You see clearly. You have been both terrible and good. You are human. You accept this and choose to be better with what remains of your life.',
          effects: [
            { kind: 'stat', stat: 'savvy', delta: 1 },
            { kind: 'stat', stat: 'grit', delta: 1 },
            { kind: 'stat', stat: 'nerve', delta: 1 },
            { kind: 'stat', stat: 'charm', delta: 1 },
            { kind: 'if', when: { kind: 'flag', id: 'investigated_mirror', atLeast: 1 }, then: [{ kind: 'narrate', text: 'Your years of self-reflection come to fruition. You face the Mirror not as a stranger to yourself, but as someone who has been preparing for this moment all along.' }], else: [] },
          ],
          goto: 'colossus07_outcome',
        },
        failure: {
          text: 'You cannot face the truth. You rationalize. You justify. You survive, but the Mirror knows you have not truly changed.',
          effects: [{ kind: 'gold', delta: -300 }],
          goto: 'colossus07_outcome',
        },
      },
    },
  ],
}

const colossus07_outcome: StoryCard = {
  id: 'colossus07_outcome',
  title: 'The Final Reckoning',
  onEnter: [
    { kind: 'grantBoon', boon: 'mirror_survivor' },
    { kind: 'reckoning' },
    { kind: 'advancePhase', to: 'recovery' },
    { kind: 'queueCard', card: 'legacy_choice' },
    { kind: 'narrate', text: 'The Mirror shatters into a thousand pieces, each reflecting a different version of you. In the reflection, you see not just who you are, but who you could still become. The final Colossus is not defeated—it is integrated. You carry it with you now, forever changed, forever aware. This is not victory in the traditional sense. This is transcendence.' },
  ],
  body: [
    'You stand alone in an empty space.',
    'The weight of every choice, every consequence, every triumph and failure settles on your shoulders.',
    'But you are still standing.',
    'More than that: you are standing with eyes open. You know who you are. You know what you\'ve done. And you are still choosing to move forward.',
    'This is the real victory. Not wealth. Not power. Self-knowledge. And the choice to be better with what time remains.',
  ],
  choices: [{ id: 'begin_legacy', label: 'Begin Your Legacy', effects: [] }],
}

export const colossus07Cards: StoryCard[] = [
  colossus07_start,
  colossus07_trial_truth,
  colossus07_outcome,
]
