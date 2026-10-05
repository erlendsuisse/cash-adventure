import type { AbilityRule, Campaign, GameState } from './types'

// Where the hero's rules come from: the class ability plus every perk owned.
// Kept apart from hero.ts so effects.ts can use it without an import cycle.

type RuleBook = Partial<Pick<Campaign, 'heroClasses' | 'perks'>>

/** A rule and where it comes from: the class ability or a perk (skill, gear, trophy). */
export interface SourcedRule {
  rule: AbilityRule
  source: string // shown to the player, e.g. "Stand Firm" or "🧮 Brass Abacus"
  id: string // 'class' or the perk id; keys the once-per-chapter re-roll
}

/** Every rule that shapes this hero: the class ability, then each perk owned. */
export function allRules(state: GameState, campaign: RuleBook): SourcedRule[] {
  const heroClass = state.hero ? campaign.heroClasses?.[state.hero.classId] : undefined
  const fromClass = (heroClass?.ability.rules ?? []).map((rule) => ({ rule, source: heroClass!.ability.name, id: 'class' }))
  const fromPerks = state.progress.boons.flatMap((boon) => {
    const perk = campaign.perks?.[boon]
    return perk ? perk.rules.map((rule) => ({ rule, source: `${perk.icon} ${perk.name}`, id: perk.id })) : []
  })
  return [...fromClass, ...fromPerks]
}

/** Just the rules, for totals that don't care where they came from. */
export function heroRules(state: GameState, campaign: RuleBook): AbilityRule[] {
  return allRules(state, campaign).map((r) => r.rule)
}

