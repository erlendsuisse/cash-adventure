import type { StoryCard } from '../../engine/types'

export const chapter5CommodityCards: StoryCard[] = [
  {
    id: 'ch5_plague_medicine',
    chapter: 5,
    weight: 5,
    storyPhase: 'reckoning',
    title: 'Plague Medicine Monopoly',
    body: ['A desperate kingdom seeks cure ingredients. A alchemist offers exclusive distribution rights. "Disease spreads fast. Medicine is worth gold."'],
    choices: [
      {
        id: 'distribute_medicine',
        label: 'Monopolize medicine sales (320g)',
        requires: [{ kind: 'goldAtLeast', amount: 320 }],
        effects: [
          { kind: 'gold', delta: -320 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch5_medicine', label: 'Plague Medicine Distribution', cost: 320, monthlyCashflow: 100, sector: 'plague' },
          },
          { kind: 'stat', stat: 'charm', delta: -1 },
          { kind: 'narrate', text: 'You profit from suffering. The medicine works, but you\'ll never feel clean again.' },
        ],
      },
      { id: 'refuse_medicine', label: 'Refuse (too immoral)', effects: [{ kind: 'narrate', text: 'You cannot profit from this misery.' }] },
    ],
  },

  {
    id: 'ch5_infection_prevention',
    chapter: 5,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Infection Prevention Network',
    body: ['A healer network offers to protect your assets from plague corruption. "Prevention is cheaper than cure. 280 gold ensures immunity."'],
    choices: [
      {
        id: 'join_prevention',
        label: 'Join protection network (280g)',
        requires: [{ kind: 'goldAtLeast', amount: 280 }],
        effects: [
          { kind: 'gold', delta: -280 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch5_prevention', label: 'Infection Prevention Network', cost: 280, monthlyCashflow: 50, sector: 'health' },
          },
          { kind: 'narrate', text: 'You buy protection. Your warehouses stay clean while cities rot.' },
        ],
      },
      { id: 'decline_prevention', label: 'Decline', effects: [{ kind: 'narrate', text: 'You risk infection like everyone else.' }] },
    ],
  },

  {
    id: 'ch5_grave_robbing_artifacts',
    chapter: 5,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Grave Robbing Opportunity',
    body: ['Gravediggers offer to sell artifacts from mass graves. "Plague victims had wealth. We\'ll split the profit. 250 gold to begin."'],
    choices: [
      {
        id: 'fund_grave_robbing',
        label: 'Fund grave robbing (250g)',
        requires: [{ kind: 'goldAtLeast', amount: 250 }],
        effects: [
          { kind: 'gold', delta: -250 },
          {
            kind: 'acquireAsset',
            asset: { id: 'ch5_grave_robbing', label: 'Grave Robbing Operation', cost: 250, monthlyCashflow: 70, sector: 'plague' },
          },
          { kind: 'stat', stat: 'grit', delta: -1 },
          { kind: 'flag', id: 'desecrator', set: 1 },
          { kind: 'narrate', text: 'You fund the desecration of the dead. The gold is cursed.' },
        ],
      },
      { id: 'refuse_graves', label: 'Refuse (respect the dead)', effects: [{ kind: 'narrate', text: 'Some lines you will not cross.' }] },
    ],
  },
]

export const chapter5MarketCards: StoryCard[] = [
  {
    id: 'ch5_plague_spreads',
    chapter: 5,
    weight: 5,
    storyPhase: 'reckoning',
    title: 'Plague Spreads Rapidly',
    body: ['The plague accelerates. Half the city is infected. Society begins to collapse. Prices become meaningless as survival replaces commerce.'],
    choices: [
      {
        id: 'hoard_supplies',
        label: 'Hoard supplies and wait (+250g)',
        effects: [
          { kind: 'gold', delta: 250 },
          { kind: 'marketShift', sector: 'health', delta: 35 },
          { kind: 'narrate', text: 'You hoard and wait. Supplies become invaluable.' },
        ],
      },
      {
        id: 'flee_city',
        label: 'Flee to countryside',
        effects: [
          { kind: 'advanceDays', days: 30 },
          { kind: 'gold', delta: -150 },
          { kind: 'narrate', text: 'You escape to rural safety. The city burns behind you.' },
        ],
      },
    ],
  },

  {
    id: 'ch5_quarantine_economy',
    chapter: 5,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Quarantine Zones Form',
    body: ['Cities partition into quarantine zones. Trade between zones is forbidden. Black market smuggling explodes.'],
    choices: [
      {
        id: 'become_smuggler',
        label: 'Smuggle between zones (+300g)',
        effects: [
          { kind: 'gold', delta: 300 },
          { kind: 'flag', id: 'plague_smuggler', set: 1 },
          { kind: 'narrate', text: 'You smuggle medical supplies and food. Lifesaving, but extremely dangerous.' },
        ],
      },
      {
        id: 'respect_quarantine',
        label: 'Respect quarantine rules',
        effects: [
          { kind: 'gold', delta: -100 },
          { kind: 'narrate', text: 'You follow the rules. Trade becomes impossible.' },
        ],
      },
    ],
  },

  {
    id: 'ch5_mass_death_discount',
    chapter: 5,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Massive Deflation from Death',
    body: ['So many people die that estates flood the market. Property, goods, and land become absurdly cheap.'],
    choices: [
      {
        id: 'buy_dead_estates',
        label: 'Buy estates at 20% value (+400g)',
        effects: [
          { kind: 'gold', delta: 400 },
          { kind: 'marketShift', sector: 'plague', delta: -50 },
          { kind: 'narrate', text: 'You buy the dead\'s possessions. The morality is questionable. The profit is not.' },
        ],
      },
      {
        id: 'ignore_discount',
        label: 'Ignore the opportunity',
        effects: [{ kind: 'narrate', text: 'Others will profit from death.' }],
      },
    ],
  },
]

export const chapter5DangerCards: StoryCard[] = [
  {
    id: 'ch5_infection_risk',
    chapter: 5,
    weight: 5,
    storyPhase: 'reckoning',
    title: 'Infection Risk Strikes You',
    body: ['You fall ill with plague symptoms. Fever, weakness. You have hours to find treatment or face death.'],
    choices: [
      {
        id: 'buy_cure',
        label: 'Buy expensive cure (-400g)',
        requires: [{ kind: 'goldAtLeast', amount: 400 }],
        effects: [
          { kind: 'gold', delta: -400 },
          { kind: 'stat', stat: 'grit', delta: 1 },
          { kind: 'narrate', text: 'You survive. Barely. The cure is worth every gold.' },
        ],
      },
      {
        id: 'fight_infection',
        label: 'Fight the plague (Grit check, DC 17)',
        check: {
          stat: 'grit',
          dc: 17,
          success: { text: 'Your body fights back. You survive without cure.', effects: [{ kind: 'stat', stat: 'grit', delta: 3 }] },
          failure: { text: 'The plague takes you. You die.', effects: [{ kind: 'end', status: 'won', summary: 'Died from plague. Your wealth passes to your heirs.' }] },
        },
      },
    ],
  },

  {
    id: 'ch5_plague_riot',
    chapter: 5,
    weight: 4,
    storyPhase: 'reckoning',
    title: 'Desperate Mob Attacks',
    body: ['Desperate plague victims, mad from fever, attack your storehouse. They\'re looking for medicine. They don\'t care if you die.'],
    choices: [
      {
        id: 'give_medicine',
        label: 'Give them medicine (-200g of stock)',
        effects: [
          { kind: 'gold', delta: -200 },
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'narrate', text: 'You appease them with medicine. They leave. Humanity survives.' },
        ],
      },
      {
        id: 'defend_warehouse',
        label: 'Defend the warehouse (Nerve check, DC 15)',
        check: {
          stat: 'nerve',
          dc: 15,
          success: { text: 'You hold firm. The mob backs down.', effects: [{ kind: 'stat', stat: 'nerve', delta: 2 }] },
          failure: { text: 'They breach your defenses. You lose everything.', effects: [{ kind: 'gold', delta: -500 }] },
        },
      },
    ],
  },

  {
    id: 'ch5_healer_betrayal',
    chapter: 5,
    weight: 3,
    storyPhase: 'reckoning',
    title: 'Your Healer Betrays You',
    body: ['The healer you trusted spreads plague to your household intentionally. "The wealthy should suffer too."'],
    choices: [
      {
        id: 'forgive_healer',
        label: 'Forgive and move on',
        effects: [
          { kind: 'stat', stat: 'charm', delta: 1 },
          { kind: 'gold', delta: -300 },
          { kind: 'narrate', text: 'You forgive. Healthcare is restored. It costs you dearly.' },
        ],
      },
      {
        id: 'execute_healer',
        label: 'Execute the healer (Grit check, DC 13)',
        check: {
          stat: 'grit',
          dc: 13,
          success: { text: 'You execute them. A message is sent.', effects: [{ kind: 'stat', stat: 'grit', delta: 2 }, { kind: 'stat', stat: 'charm', delta: -2 }] },
          failure: { text: 'Guards arrest you instead. You pay 450g in bribes to escape.', effects: [{ kind: 'gold', delta: -450 }] },
        },
      },
    ],
  },
]
