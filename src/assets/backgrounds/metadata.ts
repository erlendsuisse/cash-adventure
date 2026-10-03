// Central registry mapping cardId to background assets

import type { CardId } from '../../engine/types'

export interface BackgroundAsset {
  id: string
  cardId: CardId
  url: string
  alt: string
  aspectRatio: number
  blurHash?: string
}

// Main registry: all generated backgrounds
export const BACKGROUND_MAP: Record<CardId, BackgroundAsset> = {
  // Original story cards
  'prologue': { id: 'prologue', cardId: 'prologue', url: '/backgrounds/prologue.webp', alt: 'The Port of Vessarin', aspectRatio: 16 / 9 },

  // Prologue tutorial cards
  'tutorial_goal': { id: 'tutorial_goal', cardId: 'tutorial_goal', url: '/backgrounds/tutorial_goal.webp', alt: 'Understanding Your Goal', aspectRatio: 16 / 9 },
  'tutorial_sidebar': { id: 'tutorial_sidebar', cardId: 'tutorial_sidebar', url: '/backgrounds/tutorial_sidebar.webp', alt: 'Reading Your Status', aspectRatio: 16 / 9 },
  'tutorial_choices': { id: 'tutorial_choices', cardId: 'tutorial_choices', url: '/backgrounds/tutorial_choices.webp', alt: 'Making Choices Matter', aspectRatio: 16 / 9 },
  'tutorial_colossi': { id: 'tutorial_colossi', cardId: 'tutorial_colossi', url: '/backgrounds/tutorial_colossi.webp', alt: 'The Seven Colossi', aspectRatio: 16 / 9 },

  'job_offer': { id: 'job_offer', cardId: 'job_offer', url: '/backgrounds/job_offer.webp', alt: 'A Counting-House Job', aspectRatio: 16 / 9 },
  'salt_caravan_pitch': { id: 'salt_caravan_pitch', cardId: 'salt_caravan_pitch', url: '/backgrounds/salt_caravan_pitch.webp', alt: 'A Brokers Pitch', aspectRatio: 16 / 9 },
  'salt_caravan': { id: 'salt_caravan', cardId: 'salt_caravan', url: '/backgrounds/salt_caravan.webp', alt: 'The Salt Caravan', aspectRatio: 16 / 9 },
  'salt_caravan_deal': { id: 'salt_caravan_deal', cardId: 'salt_caravan_deal', url: '/backgrounds/salt_caravan_deal.webp', alt: 'Salt Caravan Deal', aspectRatio: 16 / 9 },
  'iron_claim_pitch': { id: 'iron_claim_pitch', cardId: 'iron_claim_pitch', url: '/backgrounds/iron_claim_pitch.webp', alt: 'An Iron Claim', aspectRatio: 16 / 9 },
  'iron_mine_collapse': { id: 'iron_mine_collapse', cardId: 'iron_mine_collapse', url: '/backgrounds/iron_mine_collapse.webp', alt: 'A Mine Collapses', aspectRatio: 16 / 9 },
  'tavern_doodad': { id: 'tavern_doodad', cardId: 'tavern_doodad', url: '/backgrounds/tavern_doodad.webp', alt: 'A Velvet Cloak', aspectRatio: 16 / 9 },
  'spice_market_rumor': { id: 'spice_market_rumor', cardId: 'spice_market_rumor', url: '/backgrounds/spice_market_rumor.webp', alt: 'Market Rumors', aspectRatio: 16 / 9 },
  'gambling_den': { id: 'gambling_den', cardId: 'gambling_den', url: '/backgrounds/gambling_den.webp', alt: 'A Game of Chance', aspectRatio: 16 / 9 },
  'bandit_toll': { id: 'bandit_toll', cardId: 'bandit_toll', url: '/backgrounds/bandit_toll.webp', alt: 'A Toll on the Road', aspectRatio: 16 / 9 },
  'sys_market_day': { id: 'sys_market_day', cardId: 'sys_market_day', url: '/backgrounds/sys_market_day.webp', alt: 'Market Day', aspectRatio: 16 / 9 },
  'final_freedom': { id: 'final_freedom', cardId: 'final_freedom', url: '/backgrounds/final_freedom.webp', alt: 'Freedom at Last', aspectRatio: 16 / 9 },
  'consequence_mafia': { id: 'consequence_mafia', cardId: 'consequence_mafia', url: '/backgrounds/consequence_mafia.webp', alt: 'The Mafia Calls', aspectRatio: 16 / 9 },
  'consequence_police': { id: 'consequence_police', cardId: 'consequence_police', url: '/backgrounds/consequence_police.webp', alt: 'The Law Catches Up', aspectRatio: 16 / 9 },
  'consequence_war': { id: 'consequence_war', cardId: 'consequence_war', url: '/backgrounds/consequence_war.webp', alt: 'War and Chaos', aspectRatio: 16 / 9 },
  'consequence_banking': { id: 'consequence_banking', cardId: 'consequence_banking', url: '/backgrounds/consequence_banking.webp', alt: 'Banking Crisis', aspectRatio: 16 / 9 },

  // Colossus encounters
  'colossus01_start': { id: 'colossus01_start', cardId: 'colossus01_start', url: '/backgrounds/colossus01_start.webp', alt: 'The First Reckoning', aspectRatio: 16 / 9 },
  'colossus01_outcome': { id: 'colossus01_outcome', cardId: 'colossus01_outcome', url: '/backgrounds/colossus01_outcome.webp', alt: 'The Reckoning Resolved', aspectRatio: 16 / 9 },
  'colossus02_start': { id: 'colossus02_start', cardId: 'colossus02_start', url: '/backgrounds/colossus02_start.webp', alt: 'The Inquisitor Arrives', aspectRatio: 16 / 9 },
  'colossus02_outcome': { id: 'colossus02_outcome', cardId: 'colossus02_outcome', url: '/backgrounds/colossus02_outcome.webp', alt: 'The Judgment', aspectRatio: 16 / 9 },
  'colossus03_start': { id: 'colossus03_start', cardId: 'colossus03_start', url: '/backgrounds/colossus03_start.webp', alt: 'The Market Turns', aspectRatio: 16 / 9 },
  'colossus03_outcome': { id: 'colossus03_outcome', cardId: 'colossus03_outcome', url: '/backgrounds/colossus03_outcome.webp', alt: 'The Tide Recedes', aspectRatio: 16 / 9 },
  'colossus04_start': { id: 'colossus04_start', cardId: 'colossus04_start', url: '/backgrounds/colossus04_start.webp', alt: 'The Machine Arrives', aspectRatio: 16 / 9 },
  'colossus04_outcome': { id: 'colossus04_outcome', cardId: 'colossus04_outcome', url: '/backgrounds/colossus04_outcome.webp', alt: 'The New Order', aspectRatio: 16 / 9 },
  'colossus05_start': { id: 'colossus05_start', cardId: 'colossus05_start', url: '/backgrounds/colossus05_start.webp', alt: 'The Plague Arrives', aspectRatio: 16 / 9 },
  'colossus05_outcome': { id: 'colossus05_outcome', cardId: 'colossus05_outcome', url: '/backgrounds/colossus05_outcome.webp', alt: 'The Plague Breaks', aspectRatio: 16 / 9 },
  'colossus06_start': { id: 'colossus06_start', cardId: 'colossus06_start', url: '/backgrounds/colossus06_start.webp', alt: 'The Conspiracy Revealed', aspectRatio: 16 / 9 },
  'colossus06_outcome': { id: 'colossus06_outcome', cardId: 'colossus06_outcome', url: '/backgrounds/colossus06_outcome.webp', alt: 'The Reckoning', aspectRatio: 16 / 9 },
  'colossus07_start': { id: 'colossus07_start', cardId: 'colossus07_start', url: '/backgrounds/colossus07_start.webp', alt: 'The Mirror Appears', aspectRatio: 16 / 9 },
  'colossus07_outcome': { id: 'colossus07_outcome', cardId: 'colossus07_outcome', url: '/backgrounds/colossus07_outcome.webp', alt: 'The Final Reckoning', aspectRatio: 16 / 9 },

  // Investigation cards
  'investigate_ledger_wyrm': { id: 'investigate_ledger_wyrm', cardId: 'investigate_ledger_wyrm', url: '/backgrounds/investigate_ledger_wyrm.webp', alt: 'Warnings of the Auditors', aspectRatio: 16 / 9 },
  'investigate_inquisitor': { id: 'investigate_inquisitor', cardId: 'investigate_inquisitor', url: '/backgrounds/investigate_inquisitor.webp', alt: 'Whispers of the Inquisition', aspectRatio: 16 / 9 },
  'investigate_tide': { id: 'investigate_tide', cardId: 'investigate_tide', url: '/backgrounds/investigate_tide.webp', alt: 'The Old Sailor\'s Wisdom', aspectRatio: 16 / 9 },
  'investigate_machine': { id: 'investigate_machine', cardId: 'investigate_machine', url: '/backgrounds/investigate_machine.webp', alt: 'A Mechanic\'s Warning', aspectRatio: 16 / 9 },
  'investigate_plague': { id: 'investigate_plague', cardId: 'investigate_plague', url: '/backgrounds/investigate_plague.webp', alt: 'A Healer\'s Preparation', aspectRatio: 16 / 9 },
  'investigate_betrayal': { id: 'investigate_betrayal', cardId: 'investigate_betrayal', url: '/backgrounds/investigate_betrayal.webp', alt: 'A Fixer\'s Advice', aspectRatio: 16 / 9 },
  'investigate_mirror': { id: 'investigate_mirror', cardId: 'investigate_mirror', url: '/backgrounds/investigate_mirror.webp', alt: 'A Philosopher\'s Warning', aspectRatio: 16 / 9 },

  // Fallback backgrounds
  'fallback_market': { id: 'fallback_market', cardId: 'fallback_market', url: '/backgrounds/fallback_market.webp', alt: 'Generic Market', aspectRatio: 16 / 9 },
  'fallback_tavern': { id: 'fallback_tavern', cardId: 'fallback_tavern', url: '/backgrounds/fallback_tavern.webp', alt: 'Generic Tavern', aspectRatio: 16 / 9 },
  'fallback_street': { id: 'fallback_street', cardId: 'fallback_street', url: '/backgrounds/fallback_street.webp', alt: 'Generic Street', aspectRatio: 16 / 9 },
  'fallback_workshop': { id: 'fallback_workshop', cardId: 'fallback_workshop', url: '/backgrounds/fallback_workshop.webp', alt: 'Generic Workshop', aspectRatio: 16 / 9 },

  // Expansion cards
  'ancient_ruins': { id: 'ancient_ruins', cardId: 'ancient_ruins', url: '/backgrounds/ancient_ruins.webp', alt: 'Ancient Ruins', aspectRatio: 16 / 9 },
  'ancient_ruins_aftermath': { id: 'ancient_ruins_aftermath', cardId: 'ancient_ruins_aftermath', url: '/backgrounds/ancient_ruins_aftermath.webp', alt: 'Ruins Explored', aspectRatio: 16 / 9 },
  'monster_contract': { id: 'monster_contract', cardId: 'monster_contract', url: '/backgrounds/monster_contract.webp', alt: 'Marshland Monster Hunt', aspectRatio: 16 / 9 },
  'monster_aftermath': { id: 'monster_aftermath', cardId: 'monster_aftermath', url: '/backgrounds/monster_aftermath.webp', alt: 'Marsh Conquest', aspectRatio: 16 / 9 },
  'wizard_offer': { id: 'wizard_offer', cardId: 'wizard_offer', url: '/backgrounds/wizard_offer.webp', alt: 'The Arcanist Scholar', aspectRatio: 16 / 9 },
  'guild_charter': { id: 'guild_charter', cardId: 'guild_charter', url: '/backgrounds/guild_charter.webp', alt: 'Merchant Guild Hall', aspectRatio: 16 / 9 },
  'trade_route': { id: 'trade_route', cardId: 'trade_route', url: '/backgrounds/trade_route.webp', alt: 'Mountain Trade Pass', aspectRatio: 16 / 9 },
  'property_deed': { id: 'property_deed', cardId: 'property_deed', url: '/backgrounds/property_deed.webp', alt: 'Merchant Warehouse', aspectRatio: 16 / 9 },
  'dueling_school': { id: 'dueling_school', cardId: 'dueling_school', url: '/backgrounds/dueling_school.webp', alt: 'Fencing Academy', aspectRatio: 16 / 9 },
  'philosophy_circle': { id: 'philosophy_circle', cardId: 'philosophy_circle', url: '/backgrounds/philosophy_circle.webp', alt: 'Scholarly Meeting Hall', aspectRatio: 16 / 9 },
  'charm_school': { id: 'charm_school', cardId: 'charm_school', url: '/backgrounds/charm_school.webp', alt: 'Court Etiquette School', aspectRatio: 16 / 9 },
  'market_crash': { id: 'market_crash', cardId: 'market_crash', url: '/backgrounds/market_crash.webp', alt: 'Market in Turmoil', aspectRatio: 16 / 9 },
  'spice_windfall': { id: 'spice_windfall', cardId: 'spice_windfall', url: '/backgrounds/spice_windfall.webp', alt: 'Spice Market Frenzy', aspectRatio: 16 / 9 },
  'black_market': { id: 'black_market', cardId: 'black_market', url: '/backgrounds/black_market.webp', alt: 'Underground Black Market', aspectRatio: 16 / 9 },
  'moneylenders_offer': { id: 'moneylenders_offer', cardId: 'moneylenders_offer', url: '/backgrounds/moneylenders_offer.webp', alt: 'The Moneylender', aspectRatio: 16 / 9 },
  'tailor_shop': { id: 'tailor_shop', cardId: 'tailor_shop', url: '/backgrounds/tailor_shop.webp', alt: 'A Tailors Offer', aspectRatio: 16 / 9 },
  'prospector_iron': { id: 'prospector_iron', cardId: 'prospector_iron', url: '/backgrounds/prospector_iron.webp', alt: 'An Iron Prospector', aspectRatio: 16 / 9 },
  'ack_iron_boom': { id: 'ack_iron_boom', cardId: 'ack_iron_boom', url: '/backgrounds/ack_iron_boom.webp', alt: 'Iron Market Boom', aspectRatio: 16 / 9 },
  'ack_iron_collapse': { id: 'ack_iron_collapse', cardId: 'ack_iron_collapse', url: '/backgrounds/ack_iron_collapse.webp', alt: 'Iron Market Collapse', aspectRatio: 16 / 9 },
  'ack_market_day': { id: 'ack_market_day', cardId: 'ack_market_day', url: '/backgrounds/ack_market_day.webp', alt: 'Market Day Results', aspectRatio: 16 / 9 },
  'ack_spice': { id: 'ack_spice', cardId: 'ack_spice', url: '/backgrounds/ack_spice.webp', alt: 'Spice Endeavor', aspectRatio: 16 / 9 },

  // Story expansion cards
  'captain_vex_intro': { id: 'captain_vex_intro', cardId: 'captain_vex_intro', url: '/backgrounds/captain_vex_intro.webp', alt: 'Captain Vex at Harbor', aspectRatio: 16 / 9 },
  'captain_vex_heist': { id: 'captain_vex_heist', cardId: 'captain_vex_heist', url: '/backgrounds/captain_vex_heist.webp', alt: 'A Risky Cargo Run', aspectRatio: 16 / 9 },
  'vex_heist_success': { id: 'vex_heist_success', cardId: 'vex_heist_success', url: '/backgrounds/vex_heist_success.webp', alt: 'Partnership Forged', aspectRatio: 16 / 9 },
  'vex_heist_failure': { id: 'vex_heist_failure', cardId: 'vex_heist_failure', url: '/backgrounds/vex_heist_failure.webp', alt: 'Failed Cargo', aspectRatio: 16 / 9 },
  'lord_aldric_intro': { id: 'lord_aldric_intro', cardId: 'lord_aldric_intro', url: '/backgrounds/lord_aldric_intro.webp', alt: 'A Nobles Dilemma', aspectRatio: 16 / 9 },
  'aldric_investigation': { id: 'aldric_investigation', cardId: 'aldric_investigation', url: '/backgrounds/aldric_investigation.webp', alt: 'Following the Trail', aspectRatio: 16 / 9 },
  'aldric_honest_ending': { id: 'aldric_honest_ending', cardId: 'aldric_honest_ending', url: '/backgrounds/aldric_honest_ending.webp', alt: 'Truth and Respect', aspectRatio: 16 / 9 },
  'aldric_lie_ending': { id: 'aldric_lie_ending', cardId: 'aldric_lie_ending', url: '/backgrounds/aldric_lie_ending.webp', alt: 'Convenient Lies', aspectRatio: 16 / 9 },
  'scholar_sage': { id: 'scholar_sage', cardId: 'scholar_sage', url: '/backgrounds/scholar_sage.webp', alt: 'A Merchant Scholars Secret', aspectRatio: 16 / 9 },
  'nerve_master': { id: 'nerve_master', cardId: 'nerve_master', url: '/backgrounds/nerve_master.webp', alt: 'The Confidence Game', aspectRatio: 16 / 9 },
  'the_orphanage': { id: 'the_orphanage', cardId: 'the_orphanage', url: '/backgrounds/the_orphanage.webp', alt: 'Children in Need', aspectRatio: 16 / 9 },
  'corrupt_guard': { id: 'corrupt_guard', cardId: 'corrupt_guard', url: '/backgrounds/corrupt_guard.webp', alt: 'A Guards Temptation', aspectRatio: 16 / 9 },
  'dockside_tavern': { id: 'dockside_tavern', cardId: 'dockside_tavern', url: '/backgrounds/dockside_tavern.webp', alt: 'The Anchor and Coin', aspectRatio: 16 / 9 },
  'winter_festival': { id: 'winter_festival', cardId: 'winter_festival', url: '/backgrounds/winter_festival.webp', alt: 'The Winter Festival', aspectRatio: 16 / 9 },
  'master_trader': { id: 'master_trader', cardId: 'master_trader', url: '/backgrounds/master_trader.webp', alt: 'The Masters Lesson', aspectRatio: 16 / 9 },
  'mentor_wisdom': { id: 'mentor_wisdom', cardId: 'mentor_wisdom', url: '/backgrounds/mentor_wisdom.webp', alt: 'Mentors Wisdom', aspectRatio: 16 / 9 },
  'childhood_friend': { id: 'childhood_friend', cardId: 'childhood_friend', url: '/backgrounds/childhood_friend.webp', alt: 'A Face from the Past', aspectRatio: 16 / 9 },
  'friend_crisis': { id: 'friend_crisis', cardId: 'friend_crisis', url: '/backgrounds/friend_crisis.webp', alt: 'A Friend in Trouble', aspectRatio: 16 / 9 },
  'ruthless_competitor': { id: 'ruthless_competitor', cardId: 'ruthless_competitor', url: '/backgrounds/ruthless_competitor.webp', alt: 'A Ruthless Rival Emerges', aspectRatio: 16 / 9 },
  'rival_showdown': { id: 'rival_showdown', cardId: 'rival_showdown', url: '/backgrounds/rival_showdown.webp', alt: 'Competition Heats Up', aspectRatio: 16 / 9 },
  'theft_offer': { id: 'theft_offer', cardId: 'theft_offer', url: '/backgrounds/theft_offer.webp', alt: 'A Tempting Crime', aspectRatio: 16 / 9 },
  'plague_outbreak': { id: 'plague_outbreak', cardId: 'plague_outbreak', url: '/backgrounds/plague_outbreak.webp', alt: 'Sickness Spreads', aspectRatio: 16 / 9 },
  'guild_leadership': { id: 'guild_leadership', cardId: 'guild_leadership', url: '/backgrounds/guild_leadership.webp', alt: 'A Seat on the Council', aspectRatio: 16 / 9 },
  'fortune_teller': { id: 'fortune_teller', cardId: 'fortune_teller', url: '/backgrounds/fortune_teller.webp', alt: 'Fortune Telling', aspectRatio: 16 / 9 },
  'presage_ledger_wyrm': { id: 'presage_ledger_wyrm', cardId: 'presage_ledger_wyrm', url: '/backgrounds/presage_ledger_wyrm.webp', alt: 'Disturbing Omens', aspectRatio: 16 / 9 },
  'jeweler_wares': { id: 'jeweler_wares', cardId: 'jeweler_wares', url: '/backgrounds/jeweler_wares.webp', alt: 'A Signet Ring', aspectRatio: 16 / 9 },
  'cobbler_pitch': { id: 'cobbler_pitch', cardId: 'cobbler_pitch', url: '/backgrounds/cobbler_pitch.webp', alt: 'Fine Merchant Boots', aspectRatio: 16 / 9 },
  'scribe_ledger': { id: 'scribe_ledger', cardId: 'scribe_ledger', url: '/backgrounds/scribe_ledger.webp', alt: 'A Master Ledger', aspectRatio: 16 / 9 },
  'spice_merchant': { id: 'spice_merchant', cardId: 'spice_merchant', url: '/backgrounds/spice_merchant.webp', alt: 'Exotic Spice Gift Set', aspectRatio: 16 / 9 },
  'quillwright': { id: 'quillwright', cardId: 'quillwright', url: '/backgrounds/quillwright.webp', alt: 'Fine Writing Quills', aspectRatio: 16 / 9 },
  'silk_merchant': { id: 'silk_merchant', cardId: 'silk_merchant', url: '/backgrounds/silk_merchant.webp', alt: 'Silk Handkerchiefs', aspectRatio: 16 / 9 },
  'cartographer': { id: 'cartographer', cardId: 'cartographer', url: '/backgrounds/cartographer.webp', alt: 'A Brass Compass', aspectRatio: 16 / 9 },
  'jeweler_pendant': { id: 'jeweler_pendant', cardId: 'jeweler_pendant', url: '/backgrounds/jeweler_pendant.webp', alt: 'A Silver Pendant', aspectRatio: 16 / 9 },
  'leatherworker': { id: 'leatherworker', cardId: 'leatherworker', url: '/backgrounds/leatherworker.webp', alt: 'Fine Leather Gloves', aspectRatio: 16 / 9 },
  'perfumer': { id: 'perfumer', cardId: 'perfumer', url: '/backgrounds/perfumer.webp', alt: 'Rare Merchant Perfume', aspectRatio: 16 / 9 },
  'mafia_notice': { id: 'mafia_notice', cardId: 'mafia_notice', url: '/backgrounds/mafia_notice.webp', alt: 'The Underworld Stirs', aspectRatio: 16 / 9 },
  'refugee_crisis': { id: 'refugee_crisis', cardId: 'refugee_crisis', url: '/backgrounds/refugee_crisis.webp', alt: 'Refugees Flood the City', aspectRatio: 16 / 9 },
  'wanted_poster': { id: 'wanted_poster', cardId: 'wanted_poster', url: '/backgrounds/wanted_poster.webp', alt: 'Your Face on a Wanted Poster', aspectRatio: 16 / 9 },
  'war_contracts': { id: 'war_contracts', cardId: 'war_contracts', url: '/backgrounds/war_contracts.webp', alt: 'The Crown Needs Supplies', aspectRatio: 16 / 9 },
  'market_collapse': { id: 'market_collapse', cardId: 'market_collapse', url: '/backgrounds/market_collapse.webp', alt: 'The Market Transforms', aspectRatio: 16 / 9 },
  'old_mentor_returns': { id: 'old_mentor_returns', cardId: 'old_mentor_returns', url: '/backgrounds/old_mentor_returns.webp', alt: 'An Old Mentor Reappears', aspectRatio: 16 / 9 },
  'ambitious_rival': { id: 'ambitious_rival', cardId: 'ambitious_rival', url: '/backgrounds/ambitious_rival.webp', alt: 'Your Rival Strikes', aspectRatio: 16 / 9 },
  'rebuilding_investor': { id: 'rebuilding_investor', cardId: 'rebuilding_investor', url: '/backgrounds/rebuilding_investor.webp', alt: 'A Patient Investor', aspectRatio: 16 / 9 },
  'black_market_contact': { id: 'black_market_contact', cardId: 'black_market_contact', url: '/backgrounds/black_market_contact.webp', alt: 'The Black Market Offers', aspectRatio: 16 / 9 },
  'skilled_refugee': { id: 'skilled_refugee', cardId: 'skilled_refugee', url: '/backgrounds/skilled_refugee.webp', alt: 'A Master Craftsperson', aspectRatio: 16 / 9 },
  'political_opportunity': { id: 'political_opportunity', cardId: 'political_opportunity', url: '/backgrounds/political_opportunity.webp', alt: 'A Political Rising', aspectRatio: 16 / 9 },
  'salvage_opportunity': { id: 'salvage_opportunity', cardId: 'salvage_opportunity', url: '/backgrounds/salvage_opportunity.webp', alt: 'Salvage from the Ruins', aspectRatio: 16 / 9 },
  'knowledge_broker': { id: 'knowledge_broker', cardId: 'knowledge_broker', url: '/backgrounds/knowledge_broker.webp', alt: 'Secrets Are Worth Gold', aspectRatio: 16 / 9 },
  'artisan_collective': { id: 'artisan_collective', cardId: 'artisan_collective', url: '/backgrounds/artisan_collective.webp', alt: 'Artisans United', aspectRatio: 16 / 9 },
  'city_relief_effort': { id: 'city_relief_effort', cardId: 'city_relief_effort', url: '/backgrounds/city_relief_effort.webp', alt: 'The City Rebuilds', aspectRatio: 16 / 9 },
  'old_guild_faction': { id: 'old_guild_faction', cardId: 'old_guild_faction', url: '/backgrounds/old_guild_faction.webp', alt: 'The Old Guard Resists', aspectRatio: 16 / 9 },
  'debt_collector': { id: 'debt_collector', cardId: 'debt_collector', url: '/backgrounds/debt_collector.webp', alt: 'Debts Come Due', aspectRatio: 16 / 9 },

  // Adventure deck cards
  'temple_discovery': { id: 'temple_discovery', cardId: 'temple_discovery', url: '/backgrounds/temple_discovery.webp', alt: 'Ancient Temple Discovered', aspectRatio: 16 / 9 },
  'bandit_encounter': { id: 'bandit_encounter', cardId: 'bandit_encounter', url: '/backgrounds/bandit_encounter.webp', alt: 'Bandits on the Road', aspectRatio: 16 / 9 },
  'mystery_murder': { id: 'mystery_murder', cardId: 'mystery_murder', url: '/backgrounds/mystery_murder.webp', alt: 'A Murder in the Guild', aspectRatio: 16 / 9 },
  'dragon_sighting': { id: 'dragon_sighting', cardId: 'dragon_sighting', url: '/backgrounds/dragon_sighting.webp', alt: 'Dragon Sighting', aspectRatio: 16 / 9 },
  'treasure_map_quest': { id: 'treasure_map_quest', cardId: 'treasure_map_quest', url: '/backgrounds/treasure_map_quest.webp', alt: 'A Treasure Map', aspectRatio: 16 / 9 },
  'haunted_house': { id: 'haunted_house', cardId: 'haunted_house', url: '/backgrounds/haunted_house.webp', alt: 'A Haunted Manor', aspectRatio: 16 / 9 },
  'dragon_rider_ally': { id: 'dragon_rider_ally', cardId: 'dragon_rider_ally', url: '/backgrounds/dragon_rider_ally.webp', alt: 'A Dragon Rider', aspectRatio: 16 / 9 },
  'plague_cure': { id: 'plague_cure', cardId: 'plague_cure', url: '/backgrounds/plague_cure.webp', alt: 'A Plague Cure', aspectRatio: 16 / 9 },
  'ancient_tome': { id: 'ancient_tome', cardId: 'ancient_tome', url: '/backgrounds/ancient_tome.webp', alt: 'An Ancient Tome', aspectRatio: 16 / 9 },

  // Stat training cards
  'grit_training': { id: 'grit_training', cardId: 'grit_training', url: '/backgrounds/grit_training.webp', alt: 'Steel Your Resolve', aspectRatio: 16 / 9 },
  'savvy_training': { id: 'savvy_training', cardId: 'savvy_training', url: '/backgrounds/savvy_training.webp', alt: 'Learn the Markets', aspectRatio: 16 / 9 },
  'nerve_training': { id: 'nerve_training', cardId: 'nerve_training', url: '/backgrounds/nerve_training.webp', alt: 'Master Your Fear', aspectRatio: 16 / 9 },
  'charm_training': { id: 'charm_training', cardId: 'charm_training', url: '/backgrounds/charm_training.webp', alt: 'The Art of Persuasion', aspectRatio: 16 / 9 },
  'grit_recovery_training': { id: 'grit_recovery_training', cardId: 'grit_recovery_training', url: '/backgrounds/grit_recovery_training.webp', alt: 'Forge Your Spirit', aspectRatio: 16 / 9 },
  'savvy_recovery_training': { id: 'savvy_recovery_training', cardId: 'savvy_recovery_training', url: '/backgrounds/savvy_recovery_training.webp', alt: 'Decipher the Future', aspectRatio: 16 / 9 },
  'nerve_recovery_training': { id: 'nerve_recovery_training', cardId: 'nerve_recovery_training', url: '/backgrounds/nerve_recovery_training.webp', alt: 'Dance With Danger', aspectRatio: 16 / 9 },
  'charm_recovery_training': { id: 'charm_recovery_training', cardId: 'charm_recovery_training', url: '/backgrounds/charm_recovery_training.webp', alt: 'Become Unforgettable', aspectRatio: 16 / 9 },
}

export const BACKGROUND_FALLBACKS = [
  'fallback_market',
  'fallback_tavern',
  'fallback_street',
  'fallback_workshop',
] as const

export const BACKGROUND_PRESETS = {
  harbor: { dawn: 'harbor-dawn', afternoon: 'harbor-afternoon', night: 'harbor-night' },
  temple: { rich: 'temple-rich', austere: 'temple-austere' },
  market: { busy: 'market-busy', quiet: 'market-quiet' },
  coastal: { storm: 'coastal-storm', calm: 'coastal-calm' },
} as const

export function hasBackground(cardId: CardId): boolean {
  return cardId in BACKGROUND_MAP
}

export function getBackground(cardId: CardId): BackgroundAsset | undefined {
  const specific = BACKGROUND_MAP[cardId]
  if (specific) return specific

  // Use fallback based on card ID hash for consistent rotation
  const fallbackIndex = hashCardId(cardId) % BACKGROUND_FALLBACKS.length
  const fallbackId = BACKGROUND_FALLBACKS[fallbackIndex]
  return BACKGROUND_MAP[fallbackId as CardId]
}

function hashCardId(cardId: CardId): number {
  let hash = 0
  for (let i = 0; i < cardId.length; i++) {
    const char = cardId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export function getAllBackgrounds(): BackgroundAsset[] {
  return Object.values(BACKGROUND_MAP)
}
