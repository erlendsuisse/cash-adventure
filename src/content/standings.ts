import type { Choice, Effect, Requirement, SkillCheck, StatId, StoryCard } from '../engine/types'
import { consequenceTuning } from './tuning'

// REPUTATION
// Four factions remember what you do. Standing is a plain flag counter
// (`standing_<faction>`), visible in the sidebar and in every effect summary,
// and it pays off: skill-check bonuses, favours you can call in on bad days,
// payback events, and doors that only open for the well-regarded.
// Reputation survives the Colossi - a reckoning takes your assets, not your name.

export type Faction = 'guilds' | 'folk' | 'crown' | 'underworld'

export const FACTIONS: Record<Faction, { label: string; flagId: string; blurb: string }> = {
  guilds: { label: 'Guilds', flagId: 'standing_guilds', blurb: 'Honest trade, kept bargains, merchants who vouch for you' },
  folk: { label: 'Common Folk', flagId: 'standing_folk', blurb: 'Charity, fair dealing with the poor, standing by the city' },
  crown: { label: 'Crown', flagId: 'standing_crown', blurb: 'Lawful service, royal contracts, staying on the right side of the Watch' },
  underworld: { label: 'Underworld', flagId: 'standing_underworld', blurb: 'Crime, smuggling, the friendship of dangerous people' },
}

/** Heat per consequence path, as shown to the player. At the threshold the
 *  next Colossus comes early (engine/colossi.ts). */
export const HEAT_PATHS = [
  { label: 'The Syndicate', flagId: consequenceTuning.mafia.flagId, threshold: consequenceTuning.mafia.threshold },
  { label: 'The Watch', flagId: consequenceTuning.police.flagId, threshold: consequenceTuning.police.threshold },
  { label: 'The Warlords', flagId: consequenceTuning.war.flagId, threshold: consequenceTuning.war.threshold },
  { label: 'The Banks', flagId: consequenceTuning.banking.flagId, threshold: consequenceTuning.banking.threshold },
]

/** Display name for a flag the player is shown, e.g. "Guilds" or "The Watch (heat)". */
export function trackedFlagLabel(flagId: string): string {
  const faction = Object.values(FACTIONS).find((f) => f.flagId === flagId)
  if (faction) return faction.label
  const heat = HEAT_PATHS.find((h) => h.flagId === flagId)
  return heat ? `${heat.label} (heat)` : flagId
}

/** Standing at which a faction does you real favours (and below -this, real harm). */
export const STANDING_THRESHOLD = 3

export const standingFlagIds = Object.values(FACTIONS).map((f) => f.flagId)

export function standing(faction: Faction, delta: number): Effect {
  return { kind: 'flag', id: FACTIONS[faction].flagId, delta }
}

export function standingAtLeast(faction: Faction, value: number): Requirement {
  return { kind: 'flag', id: FACTIONS[faction].flagId, atLeast: value }
}

/** Standing of `value` or lower (flags only test "at least", so negate the next step up). */
export function standingAtMost(faction: Faction, value: number): Requirement {
  return { kind: 'not', of: standingAtLeast(faction, value + 1) }
}

/** A choice only a friend of `faction` can take; shown locked to everyone else,
 *  so players see what a better reputation would have bought them. */
export function favour(faction: Faction, choice: Omit<Choice, 'requires' | 'showLockedAs'>): Choice {
  return {
    ...choice,
    requires: [standingAtLeast(faction, STANDING_THRESHOLD)],
    showLockedAs: `Needs ${FACTIONS[faction].label} standing ${STANDING_THRESHOLD}`,
  }
}

export function standingTier(value: number): string {
  if (value <= -5) return 'Hated'
  if (value <= -3) return 'Distrusted'
  if (value < 0) return 'Wary'
  if (value === 0) return 'Unknown'
  if (value < 3) return 'Known'
  if (value < 5) return 'Respected'
  return 'Honoured'
}

// ---- What earlier choices mean to each faction ----

/** Story flags that change standing whenever a choice raises them. Applied to
 *  every card when the campaign loads (see withReputation), so cards keep
 *  recording plain story facts and this table decides what the city thinks. */
export const FLAG_STANDINGS: Record<string, Partial<Record<Faction, number>>> = {
  // Heat: misconduct draws attention, and reputation, from the matching faction
  [consequenceTuning.mafia.flagId]: { underworld: 1 },
  [consequenceTuning.police.flagId]: { crown: -1 },
  [consequenceTuning.war.flagId]: { folk: -1 },
  [consequenceTuning.banking.flagId]: { guilds: -1 },

  // Guilds - honest trade and kept bargains
  in_guild: { guilds: 2 },
  guild_member: { guilds: 2 },
  merchant_leader: { guilds: 2 },
  merchant_favor: { guilds: 2 },
  mentor_found: { guilds: 1 },
  mentor_allied: { guilds: 1 },
  debt_cleared: { guilds: 1 },
  debt_negotiated: { guilds: 1 },
  honor_restored: { guilds: 1 },
  has_ally: { guilds: 1 },
  friend_partner: { guilds: 1 },
  rival_partner: { guilds: 1 },
  rival_defeated: { guilds: 1 },
  skilled_workers: { guilds: 1 },
  collective_member: { guilds: 1, folk: 1 },
  dynasty_founder: { guilds: 2 },
  old_guard_leader: { guilds: 1, crown: 1 },
  solved_murder: { guilds: 1, crown: 1 },
  helped_spice_shortage: { guilds: 1, folk: 1 },
  military_supplier: { crown: 1 },
  bad_reputation: { guilds: -1 },
  creditor_anger: { guilds: -1 },
  losing_ground: { guilds: -1 },
  panic_seller: { guilds: -1 },
  transition_profiteer: { guilds: -1 },
  profited_spice_shortage: { guilds: -1 },
  insider_trader: { guilds: -1, crown: -1 },
  market_manipulator: { guilds: -2 },
  trust_exploiter: { guilds: -2 },

  // Common folk - charity and decency
  charity_given: { folk: 2 },
  community_hero: { folk: 2 },
  city_hero: { folk: 2, crown: 1 },
  city_savior: { folk: 3 },
  city_patron: { folk: 1, crown: 1 },
  refugee_helper: { folk: 2 },
  refugee_harborer: { folk: 2 },
  refugee_workers: { folk: 1 },
  education_founder: { folk: 2 },
  noble_reputation: { folk: 1, guilds: 1 },
  friend_debt: { folk: 1 },
  street_friend_helped: { folk: 1 },
  proved_courage: { folk: 1 },
  truth_teller: { folk: 1 },
  soldier_helped: { folk: 1, crown: -1 },
  moral_compromise: { folk: -1 },
  moral_hardness: { folk: -1 },
  morally_compromised: { folk: -2 },
  exploited_refugees: { folk: -2 },
  refugee_exploiter: { folk: -2 },
  desecrator: { folk: -2, underworld: 1 },
  drug_landlord: { folk: -1, underworld: 1 },
  war_profiteer: { folk: -1, crown: -1 },
  propaganda_spreader: { crown: 1, folk: -1 },

  // Crown - the law and the state
  crown_favor: { crown: 2 },
  crown_supplier: { crown: 2 },
  name_cleared: { crown: 2 },
  political_ally: { crown: 2 },
  government_agent: { crown: 2, underworld: -2 },
  police_informant: { crown: 2, underworld: -2 },
  criminal_safe: { crown: 1, underworld: -1 },
  guard_enemy: { crown: 1, underworld: -1 },
  kingdom_spy: { crown: 1, underworld: -1 },
  deserter_informant: { crown: 1, folk: -1 },
  funded_iron_boom: { crown: 1 },
  tax_amnesty: { crown: 1 },
  under_scrutiny: { crown: -1 },
  suspected_spy: { crown: -1 },
  fled_city: { crown: -1 },
  exile: { crown: -1 },
  political_enemy: { crown: -1 },
  traitor_bought_freedom: { crown: -1 },
  authorities_hunting: { crown: -2 },
  kingdom_fugitive: { crown: -2 },
  political_exile: { crown: -2 },
  hunted_traitor: { crown: -2 },
  enemy_smuggler: { crown: -2, underworld: 1 },

  // Underworld - crime and its friends
  underworld_ally: { underworld: 2 },
  syndicate_partner: { underworld: 2 },
  mob_ally: { underworld: 2, crown: -1 },
  gang_member: { underworld: 2, crown: -1 },
  crime_lord_ally: { underworld: 2, crown: -1 },
  extortionist: { underworld: 2, guilds: -1 },
  blackmailer: { underworld: 2, guilds: -1 },
  murderer: { underworld: 2, folk: -2, crown: -2 },
  criminal_act: { underworld: 1, crown: -1 },
  criminal_network: { underworld: 1 },
  black_market_partner: { underworld: 1, guilds: -1 },
  counterfeiter: { underworld: 1, guilds: -1 },
  arms_dealer: { underworld: 1, crown: -1 },
  conspirator: { underworld: 1, crown: -1 },
  guard_corrupt: { underworld: 1, crown: -1 },
  police_corrupt: { underworld: 1, crown: -1 },
  plague_smuggler: { underworld: 1, crown: -1 },
  officer_partner: { underworld: 1 },
  has_informant: { underworld: 1 },
  information_broker: { underworld: 1 },
  spy_network: { underworld: 1 },
  shadow_merchant: { underworld: 1 },
  silent_witness: { underworld: 1 },
  smuggler_investor: { underworld: 1 },
  heat_level: { underworld: 1 },
  vendetta: { underworld: 1 },
  mob_anger: { underworld: -2 },
  syndicate_hostile: { underworld: -1 },
  underworld_ignored: { underworld: -1 },
}

/** Flags that are personal story memory - they colour narration or endings but
 *  no faction cares. Listed explicitly so a new flag can't silently go unused
 *  (content.test.ts: every flag is read, mapped above, or listed here). */
export const STORY_ONLY_FLAGS = [
  // Side stories (cards/side-stories.ts): moments each class's thread remembers
  'alch_memorised', 'alch_notebook', 'alch_page2', 'alch_page3', 'alch_page4', 'alch_page5', 'alch_recovered', 'guard_found_cellar', 'guard_hero', 'guard_trap_sprung', 'guard_tried', 'heal_building', 'heal_hero', 'heal_maren', 'heal_safe', 'pros_flint', 'pros_full_map', 'pros_map3', 'pros_shares', 'pros_spring', 'pros_tunnel', 'silver_beat_lucio', 'silver_hope', 'silver_lucio_gone', 'smug_channel', 'smug_figurehead', 'smug_location', 'smug_pip',
  'arcanist_favor', 'avoided_iron_crash', 'bad_luck', 'chose_ascension', 'chose_legacy', 'chose_self',
  'dimensional_trader', 'dragon_rider_ally', 'friend_distant', 'guild_wary', 'guilt_weight', 'harsh_reckoning',
  'has_rival', 'inquisitor_debt', 'knows_bandit_routes', 'knows_colossus_lore', 'lost_to_rival', 'loved_one_lost',
  'loved_one_saved', 'machine_adapted', 'profited_spice_blockade', 'quick_iron_profit', 'quiet_retirement',
  'riding_iron_recovery', 'rival_beaten', 'rival_sabotage', 'salt_exit', 'scrap_iron_started', 'seer_blessed',
  'soul_searching', 'tavern_patron', 'transcendent_being', 'vain',
]

// ---- Payoff: friends help when the dice roll ----

/** Standing that tips skill checks, by the stat being tested. */
const CHECK_BONUSES: Record<StatId, { faction: Faction; mod: number; reason: string; atMost?: boolean }[]> = {
  charm: [
    { faction: 'guilds', mod: 2, reason: 'the guilds vouch for you' },
    { faction: 'crown', mod: 2, reason: 'the Crown\'s favour' },
    { faction: 'guilds', mod: -2, reason: 'merchants distrust you', atMost: true },
  ],
  savvy: [
    { faction: 'guilds', mod: 2, reason: 'guild friends share their books' },
    { faction: 'crown', mod: -2, reason: 'officials obstruct you', atMost: true },
  ],
  nerve: [
    { faction: 'underworld', mod: 2, reason: 'the underworld has your back' },
    { faction: 'underworld', mod: -2, reason: 'the underworld wants you gone', atMost: true },
  ],
  grit: [
    { faction: 'folk', mod: 2, reason: 'the common folk stand with you' },
    { faction: 'folk', mod: -2, reason: 'nobody will shelter you', atMost: true },
  ],
}

function withStandingBonuses(check: SkillCheck): SkillCheck {
  if (check.stat === 'best') return check // decided at roll time, so no faction can back it in advance
  const rules = CHECK_BONUSES[check.stat].map((rule) => ({
    if: rule.atMost ? standingAtMost(rule.faction, -STANDING_THRESHOLD) : standingAtLeast(rule.faction, STANDING_THRESHOLD),
    mod: rule.mod,
    reason: rule.reason,
  }))
  return { ...check, bonuses: [...(check.bonuses ?? []), ...rules] }
}

function withFlagStandings(effects: Effect[] | undefined): Effect[] | undefined {
  if (!effects) return effects
  return effects.flatMap((effect): Effect[] => {
    if (effect.kind === 'if') return [{ ...effect, then: withFlagStandings(effect.then)!, else: withFlagStandings(effect.else) }]
    if (effect.kind !== 'flag' || !((effect.set ?? 0) > 0 || (effect.delta ?? 0) > 0)) return [effect]
    const changes = FLAG_STANDINGS[effect.id]
    if (!changes) return [effect]
    return [effect, ...Object.entries(changes).map(([faction, delta]) => standing(faction as Faction, delta))]
  })
}

/** Applied to every card when the campaign loads: story flags carry their
 *  standing changes, and every skill check feels the player's reputation. */
export function withReputation(card: StoryCard): StoryCard {
  const outcome = <T extends { effects?: Effect[] } | undefined>(o: T): T => (o ? { ...o, effects: withFlagStandings(o.effects) } : o)
  return {
    ...card,
    onEnter: withFlagStandings(card.onEnter),
    choices: card.choices.map((choice) => ({
      ...choice,
      effects: withFlagStandings(choice.effects),
      check: choice.check && {
        ...withStandingBonuses(choice.check),
        success: outcome(choice.check.success),
        failure: outcome(choice.check.failure),
        critSuccess: outcome(choice.check.critSuccess),
        critFailure: outcome(choice.check.critFailure),
      },
    })),
  }
}
