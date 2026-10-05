import { applyAll } from './effects'
import { rollDie } from './rng'
import { allRules, heroRules, type SourcedRule } from './rules'
import { currentChapter } from './selectors'
import type { AbilityRule, Action, Campaign, Choice, Effect, GameState, Outcome, Requirement, StatId } from './types'

// CHARACTER CREATION AND CLASS ABILITIES
// Stats are rolled the classic way (4d6, keep the best 3) with the game's own
// rng, so a save replays the same rolls. Each 3-18 score becomes a check
// modifier on the game's scale, then the class adds +2 / +1.

export const STAT_ORDER: StatId[] = ['grit', 'savvy', 'charm', 'nerve']

/** A 3-18 dice score as a stat on the game's scale (the old flat start was 2 everywhere). */
export function scoreToStat(score: number): number {
  if (score >= 17) return 4
  if (score >= 13) return 3
  if (score >= 9) return 2
  return 1
}

/** The best 3 of 4 dice. */
export function keptScore(dice: number[]): number {
  return [...dice].sort((a, b) => b - a).slice(0, 3).reduce((sum, d) => sum + d, 0)
}

export function heroAction(state: GameState, action: Extract<Action, { type: 'rollStats' | 'swapStats' | 'createHero' }>, campaign: Campaign): GameState {
  if (state.hero) return state // a hero is created once per game
  switch (action.type) {
    case 'rollStats': {
      if (state.creation) return state // one roll per game: the swap is the only do-over
      let rng = state.rng
      const rolls = STAT_ORDER.map(() =>
        [0, 1, 2, 3].map(() => {
          const r = rollDie(rng, 6)
          rng = r.rng
          return r.roll
        }),
      )
      return { ...state, rng, creation: { rolls } }
    }
    case 'swapStats': {
      if (!state.creation) return state
      const a = STAT_ORDER.indexOf(action.a)
      const b = STAT_ORDER.indexOf(action.b)
      if (a < 0 || b < 0 || a === b) return state
      const rolls = [...state.creation.rolls]
      ;[rolls[a], rolls[b]] = [rolls[b]!, rolls[a]!]
      return { ...state, creation: { rolls } }
    }
    case 'createHero': {
      const heroClass = campaign.heroClasses?.[action.classId]
      const background = campaign.backgrounds?.[action.backgroundId]
      if (!state.creation || !heroClass || !background) return state
      const name = action.name.trim().slice(0, 24) || heroClass.name
      const stats = { ...state.stats }
      STAT_ORDER.forEach((stat, i) => {
        stats[stat] = scoreToStat(keptScore(state.creation!.rolls[i]!))
      })
      stats[heroClass.mainStat] += 2
      stats[heroClass.secondStat] += 1
      let s: GameState = {
        ...state,
        stats,
        hero: { name, classId: heroClass.id, backgroundId: background.id, ...(action.look ? { look: action.look } : {}) },
        creation: undefined,
        log: [...state.log, { day: state.clock.day, text: `${name} the ${heroClass.name}, ${background.name}, arrives in Vessarin.` }],
      }
      s = applyAll([...heroClass.start, ...background.start], s, campaign)
      return s
    }
  }
}

export { allRules, heroRules, type SourcedRule } from './rules'

export function abilityName(state: GameState, campaign: Campaign): string {
  return (state.hero && campaign.heroClasses?.[state.hero.classId]?.ability.name) || 'Ability'
}

/** Always-on check bonuses for this stat, each named after the ability or perk it comes from. */
export function abilityCheckBonuses(stat: StatId, state: GameState, campaign: Campaign): { mod: number; reason: string }[] {
  return allRules(state, campaign).flatMap(({ rule, source }) => (rule.kind === 'checkBonus' && rule.stat === stat ? [{ mod: rule.mod, reason: source }] : []))
}

/** The once-per-chapter re-roll flag for a source in the current chapter (the
 *  class keeps its original flag name, so older saves carry on). */
export function rerollFlagId(state: GameState, sourceId = 'class'): string {
  return sourceId === 'class' ? `ability_reroll_ch${currentChapter(state)}` : `perk_reroll_${sourceId}_ch${currentChapter(state)}`
}

/** The first unused re-roll that covers a failed check of this stat, if any. */
export function availableReroll(stat: StatId, state: GameState, campaign: Campaign): SourcedRule | undefined {
  return allRules(state, campaign).find(({ rule, id }) => rule.kind === 'rerollFailed' && (rule.stat === stat || rule.stat === 'any') && !state.flags[rerollFlagId(state, id)])
}

/** The hero's highest attribute (ties go to the first in STAT_ORDER). */
export function bestStat(state: GameState): StatId {
  return STAT_ORDER.reduce((best, stat) => (state.stats[stat] > state.stats[best] ? stat : best), STAT_ORDER[0]!)
}

const heatFlags = (campaign: Campaign) => new Set(Object.values(campaign.consequenceTuning ?? {}).map((t) => t.flagId))

/** Who gives the hero this kind of rule, for telling the player, e.g. "Haggle & 🤝 Haggler". */
export function ruleSources(kind: AbilityRule['kind'], state: GameState, campaign: Campaign): string {
  return [...new Set(allRules(state, campaign).filter((r) => r.rule.kind === kind).map((r) => r.source))].join(' & ')
}

/** Effects as this hero experiences them: smaller Attention gains (Smuggler),
 *  bigger check winnings (Prospector), cheaper ventures (Silver Tongue) - and
 *  the same from any perks that do these things. Each change adds a short note
 *  naming what caused it, so the player sees what they bought paying off. */
export function adjustEffects(effects: Effect[], state: GameState, campaign: Campaign, context: { checkSuccess?: boolean; buysVenture?: boolean }): Effect[] {
  const rules = heroRules(state, campaign)
  if (rules.length === 0) return effects
  const heat = heatFlags(campaign)
  const heatCut = rules.reduce((sum, r) => (r.kind === 'heatReduction' ? sum + r.amount : sum), 0)
  const goldBonus = rules.reduce((sum, r) => (r.kind === 'checkGoldBonus' ? sum + r.percent : sum), 0)
  const discount = rules.reduce((sum, r) => (r.kind === 'ventureDiscount' ? sum + r.percent : sum), 0)
  let calmer = false
  let extraGold = 0
  let saved = 0

  const adjust = (list: Effect[]): Effect[] =>
    list.flatMap((e): Effect[] => {
      if (e.kind === 'if') return [{ ...e, then: adjust(e.then), ...(e.else ? { else: adjust(e.else) } : {}) }]
      if (e.kind === 'flag' && heatCut > 0 && heat.has(e.id) && (e.delta ?? 0) > 0) {
        calmer = true
        const delta = e.delta! - heatCut
        return delta > 0 ? [{ ...e, delta }] : []
      }
      if (e.kind === 'gold' && e.delta > 0 && context.checkSuccess && goldBonus > 0) {
        const delta = Math.round((e.delta * (100 + goldBonus)) / 100)
        extraGold += delta - e.delta
        return [{ ...e, delta }]
      }
      if (e.kind === 'gold' && e.delta < 0 && context.buysVenture && discount > 0) {
        const delta = Math.round((e.delta * (100 - discount)) / 100)
        saved += delta - e.delta
        return [{ ...e, delta }]
      }
      return [e]
    })
  const adjusted = adjust(effects)
  const notes: Effect[] = []
  if (saved > 0) notes.push({ kind: 'narrate', text: `${ruleSources('ventureDiscount', state, campaign)} saved you ${saved}g!` })
  if (extraGold > 0) notes.push({ kind: 'narrate', text: `${ruleSources('checkGoldBonus', state, campaign)}: ${extraGold}g extra!` })
  if (calmer) notes.push({ kind: 'narrate', text: `${ruleSources('heatReduction', state, campaign)}: fewer people noticed.` })
  return [...adjusted, ...notes]
}

const buysVenture = (effects: Effect[] = []) => effects.some((e) => e.kind === 'acquireAsset')

/** A choice as this hero sees it: discounted prices (and the gold it requires)
 *  for the Silver Tongue, smaller heat for the Smuggler. Used by the engine to
 *  apply the choice and by the UI to show it, so the two never disagree. */
export function effectiveChoice(choice: Choice, state: GameState, campaign: Campaign): Choice {
  if (heroRules(state, campaign).length === 0 || !choice.effects) return choice
  const venture = buysVenture(choice.effects)
  const effects = adjustEffects(choice.effects, state, campaign, { buysVenture: venture })
  const discount = venture ? heroRules(state, campaign).reduce((sum, r) => (r.kind === 'ventureDiscount' ? sum + r.percent : sum), 0) : 0
  const requires = discount > 0 ? choice.requires?.map((r) => discountRequirement(r, discount)) : choice.requires
  return { ...choice, effects, ...(requires ? { requires } : {}) }
}

function discountRequirement(req: Requirement, percent: number): Requirement {
  if (req.kind === 'goldAtLeast') return { ...req, amount: Math.round((req.amount * (100 - percent)) / 100) }
  if (req.kind === 'allOf' || req.kind === 'anyOf') return { ...req, of: req.of.map((r) => discountRequirement(r, percent)) }
  return req
}

/** A check outcome as this hero experiences it. */
export function effectiveOutcome(outcome: Outcome, success: boolean, state: GameState, campaign: Campaign): Outcome {
  if (!outcome.effects || heroRules(state, campaign).length === 0) return outcome
  return { ...outcome, effects: adjustEffects(outcome.effects, state, campaign, { checkSuccess: success }) }
}
