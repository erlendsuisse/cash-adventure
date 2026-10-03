import type { StoryCard } from '../../engine/types'

const colossus04_start: StoryCard = {
  id: 'colossus04_start',
  title: 'The Machine Arrives',
  body: [
    'The factories come without warning. Not built by Vessarin\'s craftsmen, but by outsiders—foreigners with strange designs and stranger ambitions.',
    'The Machine is the fourth Colossus. It represents obsolescence, the crushing force of technological progress that makes old methods worthless overnight. It does not conquer through violence—it conquers through efficiency.',
    'Smoke fills the harbor. The traditional trades—salt harvesters, spice merchants, ironworkers—watch their livelihoods collapse in days. The Machine produces in hours what took them weeks.',
    'The old powers, the guilds that once bent kings, now bend their knees to industrial magnates who speak of progress and efficiency. You must either adapt to survive, or be ground beneath the wheels of progress.',
    'The Colossus does not wear armor. It wears a factory. Confront it, or be crushed.',
  ],
  choices: [{ id: 'face_machine', label: 'Confront the New World', goto: 'colossus04_trial_savvy' }],
}

const colossus04_trial_savvy: StoryCard = {
  id: 'colossus04_trial_savvy',
  title: 'Understanding the Machine',
  body: [
    'A factory owner—cold, precise, uninterested in tradition—offers you a choice:',
    '"Your old methods are dying. They are already dead; you simply haven\'t recognized it yet. Join us, and profit from the new order. Resist, and become obsolete."',
    'You study the machines. Understand their logic. They are not evil—merely efficient beyond imagination.',
    'Can you adapt your mind to understand this new way of thinking?',
  ],
  choices: [
    {
      id: 'understand_machines',
      label: 'Master the logic of industry (Savvy check, DC 17)',
      check: {
        stat: 'savvy',
        dc: 17,
        success: {
          text: 'You begin to see it. The brutal elegance of industry. The way it compounds advantage. You understand—perhaps not love, but understand—the new world.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_machine', atLeast: 1 }, then: [{ kind: 'narrate', text: 'The factory worker\'s warnings echo in your mind. You\'ve studied how to stay valuable to machines—and it shows. The owner respects your comprehension.' }], else: [] },
          ],
          goto: 'colossus04_trial_charm',
        },
        failure: {
          text: 'You struggle to grasp the economics. Numbers that should compound do not. You are left behind by minds sharper than yours.',
          effects: [{ kind: 'stat', stat: 'savvy', delta: -1 }],
          goto: 'colossus04_trial_charm',
        },
      },
    },
  ],
}

const colossus04_trial_charm: StoryCard = {
  id: 'colossus04_trial_charm',
  title: 'The Negotiation',
  body: [
    'The factory owner leans back in his chair. "I respect those who adapt. But adaptation comes at a price. What are you willing to give up to survive?"',
    'He speaks of your workers—many will no longer be needed. Of the traditional crafts that made you wealthy—soon worthless. Of the guild structures that protected you—soon irrelevant.',
    '"You can join us," he says. "But you cannot keep the old world. Choose what you lose."',
  ],
  choices: [
    {
      id: 'negotiate_terms',
      label: 'Negotiate terms for survival (Charm check, DC 16)',
      check: {
        stat: 'charm',
        dc: 16,
        success: {
          text: 'You speak his language: profit, efficiency, the future. He agrees to take you on as a minor partner in his expansion. A fall, but not a total collapse.',
          effects: [
            { kind: 'if', when: { kind: 'flag', id: 'investigated_machine', atLeast: 1 }, then: [{ kind: 'stat', stat: 'savvy', delta: 1 }, { kind: 'narrate', text: 'Your preparation has made you invaluable. He offers you a better position than he first promised—you\'re too clever to waste.' }], else: [] },
          ],
          goto: 'colossus04_outcome',
        },
        failure: {
          text: 'He finds you sentimental. You care too much about workers, tradition, the old way. He sees this as weakness. His offer hardens—you can join, but only at the lowest rung.',
          effects: [{ kind: 'wages', delta: -20 }],
          goto: 'colossus04_outcome',
        },
      },
    },
  ],
}

const colossus04_outcome: StoryCard = {
  id: 'colossus04_outcome',
  title: 'The New Order',
  onEnter: [
    { kind: 'grantBoon', boon: 'machine_sponsor' },
    { kind: 'reckoning' },
    { kind: 'advancePhase', to: 'recovery' },
    { kind: 'queueCard', card: 'market_collapse' },
    { kind: 'narrate', text: 'The Machine grinds on, indifferent to your choices. Your old assets are worthless now—the guild recognizes them no longer. Your wages, redefined by the factory\'s logic, are stripped to what industrial efficiency requires. But you survived. More than that: you adapted. And in a world remade by machines, adaptation is the only victory that matters.' },
  ],
  body: [
    'Months pass. The old Vessarin is gone. The harbor that once belonged to merchants now belongs to factory owners and their investors.',
    'You are smaller now. Diminished. But you are not obsolete. You have learned to think like the Machine, and that knowledge keeps you alive.',
    'You wonder: is this progress, or catastrophe? The answer, you realize, is that it is both.',
  ],
  choices: [{ id: 'endure', label: 'Endure the New Age', effects: [] }],
}

export const colossus04Cards: StoryCard[] = [
  colossus04_start,
  colossus04_trial_savvy,
  colossus04_trial_charm,
  colossus04_outcome,
]
