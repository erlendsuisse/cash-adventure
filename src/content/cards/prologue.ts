import type { StoryCard } from '../../engine/types'

export const prologueCards: StoryCard[] = [
  {
    id: 'prologue',
    title: 'The Port of Vessarin',
    storyPhase: 'early_game',
    body: [
      'You arrive at the Port of Vessarin with fifty gold, a merchant\'s ledger, and nothing else to your name.',
      'The guild towers loom over the harbor. Somewhere beyond them, seven Colossi are said to sleep - each one a reckoning for merchants who rise too high, too fast.',
      'For now, you just need coin.',
    ],
    choices: [],
    next: 'tutorial_goal',
  },
  {
    id: 'tutorial_goal',
    title: 'Understanding Your Goal',
    storyPhase: 'early_game',
    body: [
      'An old merchant, weathered by years at sea, notices your ledger. He sits beside you and explains the merchant\'s path.',
      '"You see these numbers?" he points to your income and expenses. "Wages are money that comes in every month. Expenses are money that goes out. As long as your wages cover your expenses, you must work—you are bound."',
      '"But if you acquire assets—guild charters, trade routes, iron mines—they generate income every month. If one day your income from assets exceeds your expenses, you are free. Truly free. No master, no guild, no obligation."',
      '"That\'s the goal: build enough passive income to stop needing to work. Seven consecutive days of freedom, and you graduate from the merchant ranks."',
    ],
    choices: [],
    next: 'tutorial_sidebar',
  },
  {
    id: 'tutorial_sidebar',
    title: 'Reading Your Status',
    storyPhase: 'early_game',
    body: [
      '"Look at your left sidebar," the merchant says. "That shows your current finances. Your stats—Grit, Savvy, Charm, Nerve—determine how you handle the trials ahead. Build them through your choices."',
      '"Your gold is your cushion. Your monthly wages are what you earn from work or contracts. Your expenses are your debts and living costs. Your assets—the special items you acquire—those are your income-generating engines."',
      '"Watch these numbers closely. They tell you how close you are to freedom."',
    ],
    choices: [],
    next: 'tutorial_choices',
  },
  {
    id: 'tutorial_choices',
    title: 'Making Choices Matter',
    storyPhase: 'early_game',
    body: [
      '"Every choice you make will change these numbers," the merchant continues. "When you make a choice and see the summary of what changed, you\'ll understand the consequences."',
      '"Some choices require high stats. A merchant with high Charm can negotiate better prices. High Savvy helps you see through scams. High Grit lets you endure hardship. High Nerve means you\'ll take risks that timid merchants won\'t."',
      '"Build your stats. Seek assets. Watch your numbers. And remember—every choice echoes forward. Consequences will find you, for good or ill."',
    ],
    choices: [],
    next: 'tutorial_colossi',
  },
  {
    id: 'tutorial_colossi',
    title: 'The Seven Colossi',
    storyPhase: 'early_game',
    body: [
      'The merchant\'s expression darkens. "But understand this: the city does not let merchants escape easily. As you build wealth, you will face trials. Seven of them. The Colossi."',
      '"Each Colossus is a reckoning—a force that tests whether you\'ve truly earned your freedom. The Ledger-Wyrm judges your honesty. The Inquisitor judges your morality. The Tide tests your adaptability. Each trial strips away some of what you\'ve built."',
      '"But here\'s the secret: if you investigate the dangers ahead of time, if you prepare and learn, you can face these trials more easily. The game is not just about getting rich. It\'s about understanding the world and yourself."',
      '"Now. Are you ready to walk the path of a merchant?"',
    ],
    choices: [],
    next: 'job_offer',
  },
  {
    id: 'job_offer',
    title: 'A Counting-House Job',
    storyPhase: 'early_game',
    body: [
      'A clerk at the counting-house offers you a stool and a stack of tallies. The pay is thin, but it is pay.',
    ],
    choices: [
      {
        id: 'take_job',
        label: 'Take the clerk\'s job (+40 gold wages/mo, +10 lodging expense/mo)',
        effects: [
          { kind: 'wages', delta: 40 },
          { kind: 'expense', delta: 10 },
          { kind: 'advancePhase', to: 'climbing' },
          { kind: 'narrate', text: 'You take the stool. The tallies never end, but neither does the pay.' },
        ],
      },
      {
        id: 'skip_job',
        label: "Skip the job and chance the docks for opportunity",
        effects: [
          { kind: 'advancePhase', to: 'climbing' },
          { kind: 'narrate', text: 'You leave the counting-house behind and walk the docks instead.' },
        ],
      },
    ],
  },
]
