import type { ChapterNumber, Commodity, StoryCard } from '../../engine/types'

// CHAPTER MARKETS
// Salt, spice and iron stay worth trading all game. Each chapter's market moves
// differently (MARKET_REGIMES in tuning.ts, described on the chapter's title
// card), and these cards bring the trades to you: bargain shipments of what's
// cheap in this chapter, and buyers paying a premium for what's in demand.
// Prices are market-relative, so a shipment is always a real bargain and a
// buyer always a real premium. Stock survives a reckoning - buy cheap here,
// sell dear in the next chapter.

interface Shipment {
  type: Commodity
  multiplier: number // fraction of the market buy price
  title: string
  body: string
}

interface Buyer {
  type: Commodity
  multiplier: number // fraction of the market sell price
  title: string
  body: string
}

const pct = (m: number) => `${Math.round(Math.abs(1 - m) * 100)}%`

function shipmentCard(chapter: ChapterNumber, index: number, s: Shipment): StoryCard {
  return {
    id: `ch${chapter}_market_shipment_${index}`,
    weight: 4,
    title: s.title,
    body: [s.body],
    choices: [
      {
        id: 'buy_small_lot',
        label: `Buy up to 10 ${s.type} (${pct(s.multiplier)} below market)`,
        effects: [{ kind: 'buyStock', type: s.type, amount: 10, priceMultiplier: s.multiplier }, { kind: 'narrate', text: `You load up on cheap ${s.type}.` }],
      },
      {
        id: 'buy_large_lot',
        label: `Buy up to 30 ${s.type} (${pct(s.multiplier)} below market)`,
        effects: [{ kind: 'buyStock', type: s.type, amount: 30, priceMultiplier: s.multiplier }, { kind: 'narrate', text: `You buy all the ${s.type} you can afford. Now to find a buyer.` }],
      },
      { id: 'pass_shipment', label: 'Let it go', effects: [{ kind: 'narrate', text: 'Another merchant snaps up the shipment.' }] },
    ],
  }
}

function buyerCard(chapter: ChapterNumber, index: number, b: Buyer): StoryCard {
  return {
    id: `ch${chapter}_market_buyer_${index}`,
    weight: 5,
    requires: [{ kind: 'commodityAtLeast', type: b.type, amount: 5 }],
    title: b.title,
    body: [b.body],
    choices: [
      {
        id: 'sell_all_stock',
        label: `Sell all your ${b.type} (${pct(b.multiplier)} above market)`,
        effects: [{ kind: 'sellStock', type: b.type, priceMultiplier: b.multiplier }, { kind: 'narrate', text: 'The buyer counts out your coins without haggling. Good timing pays!' }],
      },
      {
        id: 'sell_half_stock',
        label: `Sell 10 ${b.type}, keep the rest (${pct(b.multiplier)} above market)`,
        effects: [{ kind: 'sellStock', type: b.type, amount: 10, priceMultiplier: b.multiplier }, { kind: 'narrate', text: 'You sell some, and keep the rest for later.' }],
      },
      { id: 'keep_stock', label: 'Keep your stock', effects: [{ kind: 'narrate', text: 'The buyer shrugs and moves on.' }] },
    ],
  }
}

const MARKETS: Record<Exclude<ChapterNumber, 1>, { shipments: [Shipment, Shipment]; buyers: [Buyer, Buyer] }> = {
  2: {
    shipments: [
      { type: 'spice', multiplier: 0.6, title: 'A Smuggler\'s Hold', body: 'A smuggler is in a hurry. "The Watch is coming aboard!" he hisses. "Take my spice, cheap. No questions asked."' },
      { type: 'iron', multiplier: 0.7, title: 'Iron from a Closing Forge', body: 'The gangs have pushed an old blacksmith out of business. Sadly, he is selling all his iron cheap.' },
    ],
    buyers: [
      { type: 'salt', multiplier: 1.4, title: 'The Black-Market Salt Buyer', body: 'The salt tax has doubled! A back-alley dealer will pay well over market price for salt that never met a tax collector.' },
      { type: 'iron', multiplier: 1.3, title: 'The Gang\'s Armourer', body: 'The gang\'s blacksmith needs iron for locks, bars and things best not asked about. He pays above market, in good coin.' },
    ],
  },
  3: {
    shipments: [
      { type: 'spice', multiplier: 0.6, title: 'The Officers\' Mess Sells Up', body: 'With the war on, the officers\' kitchen is selling its fine spices to pay for boots. Nobody else wants luxuries now.' },
      { type: 'salt', multiplier: 0.75, title: 'Salt from the Coastal Pans', body: 'The salt pans on the coast are still working, far from the fighting. A carter offers you a full load before the army takes it all.' },
    ],
    buyers: [
      { type: 'iron', multiplier: 1.5, title: 'The Army Armourer', body: 'The army needs iron for horseshoes, buckles and cooking pots, and the crown will pay whatever it takes.' },
      { type: 'salt', multiplier: 1.4, title: 'The Quartermaster\'s Salt Order', body: 'Salt pork feeds an army, and the quartermaster has run out of salt! He will pay well above market for every sack.' },
    ],
  },
  4: {
    shipments: [
      { type: 'salt', multiplier: 0.6, title: 'A Bankrupt\'s Warehouse', body: 'A merchant house has gone bust, and the warehouse must be empty by Friday. The salt goes to whoever bids first.' },
      { type: 'spice', multiplier: 0.75, title: 'A Panic Sale', body: 'Spice prices dipped this morning, and a nervous trader is dumping his whole stock. Tomorrow, he will regret it.' },
    ],
    buyers: [
      { type: 'spice', multiplier: 1.5, title: 'The Spice Speculator', body: 'A greedy trader is trying to buy up all the spice in town. He will pay far above market for every pinch.' },
      { type: 'iron', multiplier: 1.3, title: 'The Mint Needs Iron', body: 'The royal mint is building new coin presses and vault doors. Their buyer pays above market, in shiny new coins.' },
    ],
  },
  5: {
    shipments: [
      { type: 'iron', multiplier: 0.5, title: 'An Idle Foundry', body: 'Nobody is building while the sickness lasts. A foundry owner will sell his iron for half its worth, just to pay his workers.' },
      { type: 'salt', multiplier: 0.8, title: 'Salt from Beyond the Walls', body: 'A carter has sneaked a load of salt past the closed gates. It\'s cheaper than in the city, and the city needs it badly.' },
    ],
    buyers: [
      { type: 'spice', multiplier: 1.6, title: 'The Apothecaries\' Guild', body: 'Cloves, cinnamon and pepper are medicine now! The healers will buy all the spice you have, at almost any price.' },
      { type: 'salt', multiplier: 1.4, title: 'The Council\'s Preserving Stores', body: 'The council is salting meat for a long, closed-up winter. It will pay above market for every sack.' },
    ],
  },
  6: {
    shipments: [
      { type: 'salt', multiplier: 0.7, title: 'A Defector\'s Cache', body: 'A merchant fleeing the city has a cellar full of salt he can\'t carry. He will take whatever you offer.' },
      { type: 'iron', multiplier: 0.7, title: 'An Abandoned Armoury', body: 'One of the feuding families has abandoned its armoury in the night. The caretaker is selling the iron before anyone notices.' },
    ],
    buyers: [
      { type: 'spice', multiplier: 1.4, title: 'A Faction Feast', body: 'A great family is throwing a feast to win friends, and the cooks need spice by tonight! Their steward pays well above market.' },
      { type: 'iron', multiplier: 1.5, title: 'Arming the Factions', body: 'Every family wants gates, bars and locks before the next betrayal. Their buyers outbid each other for your iron.' },
    ],
  },
  7: {
    shipments: [
      { type: 'spice', multiplier: 0.5, title: 'Spice from Another World', body: 'Traders from beyond the rift are selling strange, perfectly good spice for any coin you have. They seem to find gold very funny.' },
      { type: 'iron', multiplier: 0.6, title: 'Rift-Iron', body: 'Some nights, iron rains from the rift. A scavenger has a cartload, still a little warm, at a very good price.' },
    ],
    buyers: [
      { type: 'salt', multiplier: 1.8, title: 'Beings Who Love Salt', body: 'The visitors from beyond the rift adore salt. They lick it, sniff it and pay almost double the market price for every grain.' },
      { type: 'spice', multiplier: 1.6, title: 'A Taste for This World', body: 'A merchant from another world has fallen in love with ordinary spice. She will pay extra for every jar you bring.' },
    ],
  },
}

export function marketTrades(chapter: Exclude<ChapterNumber, 1>): StoryCard[] {
  const m = MARKETS[chapter]
  return [...m.shipments.map((s, i) => shipmentCard(chapter, i + 1, s)), ...m.buyers.map((b, i) => buyerCard(chapter, i + 1, b))]
}
