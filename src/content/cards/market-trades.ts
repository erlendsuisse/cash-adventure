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
      { id: 'pass_shipment', label: 'Pass', effects: [{ kind: 'narrate', text: 'The shipment goes to another merchant.' }] },
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
        effects: [{ kind: 'sellStock', type: b.type, priceMultiplier: b.multiplier }, { kind: 'narrate', text: 'The buyer pays without haggling. Good timing pays.' }],
      },
      {
        id: 'sell_half_stock',
        label: `Sell 10 ${b.type}, keep the rest (${pct(b.multiplier)} above market)`,
        effects: [{ kind: 'sellStock', type: b.type, amount: 10, priceMultiplier: b.multiplier }, { kind: 'narrate', text: 'You sell some and hold the rest for later.' }],
      },
      { id: 'keep_stock', label: 'Keep your stock', effects: [{ kind: 'narrate', text: 'The buyer shrugs and moves on.' }] },
    ],
  }
}

const MARKETS: Record<Exclude<ChapterNumber, 1>, { shipments: [Shipment, Shipment]; buyers: [Buyer, Buyer] }> = {
  2: {
    shipments: [
      { type: 'spice', multiplier: 0.6, title: 'A Smuggler\'s Hold', body: 'A smuggler needs his hold emptied before the harbour watch comes aboard. The spice inside is yours at a fraction of the price - no questions asked.' },
      { type: 'iron', multiplier: 0.7, title: 'Iron from a Closing Forge', body: 'A blacksmith squeezed out by the gangs is closing up shop and selling his iron stock cheap.' },
    ],
    buyers: [
      { type: 'salt', multiplier: 1.4, title: 'The Black-Market Salt Buyer', body: 'The salt tax has doubled, and a black-market dealer will pay well over the market price for salt that never saw a tax collector.' },
      { type: 'iron', multiplier: 1.3, title: 'The Gang\'s Armourer', body: 'A gang armourer needs iron for locks, bars and other things best not asked about. He pays above market, in good coin.' },
    ],
  },
  3: {
    shipments: [
      { type: 'spice', multiplier: 0.6, title: 'The Officers\' Mess Sells Up', body: 'With the war on, the officers\' mess is selling its fine spices to pay for boots. Nobody else is buying luxuries.' },
      { type: 'salt', multiplier: 0.75, title: 'Salt from the Coastal Pans', body: 'The salt pans on the coast are still working, far from the fighting. A carter offers you a full load before the army claims it.' },
    ],
    buyers: [
      { type: 'iron', multiplier: 1.5, title: 'The Army Armourer', body: 'The army armourer needs iron for horseshoes, buckles and cookpots, and the crown is paying whatever it takes.' },
      { type: 'salt', multiplier: 1.4, title: 'The Quartermaster\'s Salt Order', body: 'Salt pork feeds an army, and the quartermaster has run out of salt. He will pay well above market for every sack.' },
    ],
  },
  4: {
    shipments: [
      { type: 'salt', multiplier: 0.6, title: 'A Bankrupt\'s Warehouse', body: 'A merchant house has gone under and its creditors want the warehouse emptied by Friday. The salt goes to whoever bids first.' },
      { type: 'spice', multiplier: 0.75, title: 'A Panic Sale', body: 'Spice prices dipped this morning and a nervous speculator is dumping his whole stock. Tomorrow he will regret it.' },
    ],
    buyers: [
      { type: 'spice', multiplier: 1.5, title: 'The Spice Speculator', body: 'A speculator is cornering the spice market and will pay far above market for every ounce he can get his hands on.' },
      { type: 'iron', multiplier: 1.3, title: 'The Mint Needs Iron', body: 'The royal mint is building new presses and vault doors. Their buyer pays above market, in fresh coin.' },
    ],
  },
  5: {
    shipments: [
      { type: 'iron', multiplier: 0.5, title: 'An Idle Foundry', body: 'Nobody is building while the plague rages. A foundry master will sell his iron for half its worth just to pay his workers.' },
      { type: 'salt', multiplier: 0.8, title: 'Salt from Beyond the Walls', body: 'A carter has slipped a load of salt past the quarantine. It is cheaper than in the city, and the city needs it badly.' },
    ],
    buyers: [
      { type: 'spice', multiplier: 1.6, title: 'The Apothecaries\' Guild', body: 'Cloves, cinnamon and pepper are medicine now. The apothecaries\' guild will buy all the spice you have, at almost any price.' },
      { type: 'salt', multiplier: 1.4, title: 'The Council\'s Preserving Stores', body: 'The council is salting meat against a long winter of quarantine and will pay above market for every sack.' },
    ],
  },
  6: {
    shipments: [
      { type: 'salt', multiplier: 0.7, title: 'A Defector\'s Cache', body: 'A merchant fleeing the city in a hurry has a cellar full of salt he cannot carry. He will take whatever you offer.' },
      { type: 'iron', multiplier: 0.7, title: 'An Abandoned Armoury', body: 'One faction has abandoned its armoury in the night. The caretaker is selling the iron before anyone else notices.' },
    ],
    buyers: [
      { type: 'spice', multiplier: 1.4, title: 'A Faction Feast', body: 'A faction is throwing a feast to win allies, and the cooks need spice by tonight. Their steward pays well above market.' },
      { type: 'iron', multiplier: 1.5, title: 'Arming the Factions', body: 'Every faction wants gates, bars and locks before the next betrayal. Their buyers outbid each other for your iron.' },
    ],
  },
  7: {
    shipments: [
      { type: 'spice', multiplier: 0.5, title: 'Spice from Another World', body: 'Traders from beyond the rift are dumping strange, perfectly good spice for whatever coin you have. They seem to find gold amusing.' },
      { type: 'iron', multiplier: 0.6, title: 'Rift-Iron', body: 'Iron rains from the rift some nights. A scavenger has a cartload of it, still faintly warm, at a very good price.' },
    ],
    buyers: [
      { type: 'salt', multiplier: 1.8, title: 'Beings Who Love Salt', body: 'The visitors from beyond the rift are fascinated by salt. They will pay almost double the market price for every grain.' },
      { type: 'spice', multiplier: 1.6, title: 'A Taste for This World', body: 'An otherworldly merchant has developed a taste for ordinary spice and will pay a premium for as much as you can bring.' },
    ],
  },
}

export function marketTrades(chapter: Exclude<ChapterNumber, 1>): StoryCard[] {
  const m = MARKETS[chapter]
  return [...m.shipments.map((s, i) => shipmentCard(chapter, i + 1, s)), ...m.buyers.map((b, i) => buyerCard(chapter, i + 1, b))]
}
