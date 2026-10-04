import { describe, expect, it } from 'vitest'
import { campaign } from './campaign'
import { CLASS_TOUCHES, COLOSSUS_TOUCHES } from './classTouches'
import { isMet } from '../engine/requirements'
import { play } from './testBot'
import { createSave, replay } from '../persist/save'
import { abilityCheckBonuses, effectiveChoice, effectiveOutcome, keptScore, scoreToStat, STAT_ORDER } from '../engine/hero'
import { newGame } from '../engine/init'
import { reduce } from '../engine/reduce'
import type { Choice, GameState } from '../engine/types'

function heroGame(classId: string, backgroundId = 'scribe', seed = 7): GameState {
  let s = reduce(newGame(seed, campaign), { type: 'rollStats' }, campaign)
  s = reduce(s, { type: 'createHero', name: 'Ada', classId, backgroundId }, campaign)
  return s
}

describe('character creation', () => {
  it('rolls 4d6 per stat from the game rng, once', () => {
    const s = reduce(newGame(7, campaign), { type: 'rollStats' }, campaign)
    expect(s.creation!.rolls).toHaveLength(4)
    for (const dice of s.creation!.rolls) {
      expect(dice).toHaveLength(4)
      dice.forEach((d) => expect(d).toBeGreaterThanOrEqual(1))
      dice.forEach((d) => expect(d).toBeLessThanOrEqual(6))
    }
    expect(reduce(s, { type: 'rollStats' }, campaign)).toBe(s) // no free re-rolls
    expect(reduce(newGame(7, campaign), { type: 'rollStats' }, campaign).creation).toEqual(s.creation) // same seed, same dice
  })

  it('keeps the best 3 dice and maps the score onto the game scale', () => {
    expect(keptScore([1, 6, 5, 4])).toBe(15)
    expect([3, 8, 9, 12, 13, 16, 17, 18].map(scoreToStat)).toEqual([1, 1, 2, 2, 3, 3, 4, 4])
  })

  it('swaps two rolled stats', () => {
    const s = reduce(newGame(7, campaign), { type: 'rollStats' }, campaign)
    const swapped = reduce(s, { type: 'swapStats', a: 'grit', b: 'nerve' }, campaign)
    expect(swapped.creation!.rolls[0]).toEqual(s.creation!.rolls[3])
    expect(swapped.creation!.rolls[3]).toEqual(s.creation!.rolls[0])
  })

  it('creates the hero with class and background bonuses, once', () => {
    const rolled = reduce(newGame(7, campaign), { type: 'rollStats' }, campaign)
    const s = reduce(rolled, { type: 'createHero', name: '  Ada  ', classId: 'alchemist', backgroundId: 'scribe' }, campaign)
    expect(s.hero).toEqual({ name: 'Ada', classId: 'alchemist', backgroundId: 'scribe' })
    expect(s.creation).toBeUndefined()
    const base = STAT_ORDER.map((_, i) => scoreToStat(keptScore(rolled.creation!.rolls[i]!)))
    // Alchemist: +2 Savvy, +1 Grit. Scribe's Apprentice: +1 Savvy.
    expect(s.stats).toEqual({ grit: base[0]! + 1, savvy: base[1]! + 3, charm: base[2]!, nerve: base[3]! })
    expect(s.flags.standing_guilds).toBe(2) // +1 class, +1 background
    expect(reduce(s, { type: 'createHero', name: 'Bob', classId: 'guard', backgroundId: 'noble' }, campaign)).toBe(s)
  })

  it('remembers the hero\'s chosen look', () => {
    const rolled = reduce(newGame(7, campaign), { type: 'rollStats' }, campaign)
    const s = reduce(rolled, { type: 'createHero', name: 'Bo', classId: 'healer', backgroundId: 'farmer', look: 'male' }, campaign)
    expect(s.hero!.look).toBe('male')
  })

  it('needs rolled stats and real ids', () => {
    const fresh = newGame(7, campaign)
    expect(reduce(fresh, { type: 'createHero', name: 'Ada', classId: 'guard', backgroundId: 'noble' }, campaign)).toBe(fresh)
    const rolled = reduce(fresh, { type: 'rollStats' }, campaign)
    expect(reduce(rolled, { type: 'createHero', name: 'Ada', classId: 'nope', backgroundId: 'noble' }, campaign)).toBe(rolled)
  })
})

describe('class abilities', () => {
  const venture: Choice = {
    id: 'buy',
    label: 'Buy it (100g, +30g/month)',
    requires: [{ kind: 'goldAtLeast', amount: 100 }],
    effects: [{ kind: 'gold', delta: -100 }, { kind: 'acquireAsset', asset: { id: 'x', label: 'X', cost: 100, monthlyCashflow: 30, sector: 'trade' } }],
  }

  it('Haggle: ventures cost the Silver Tongue 10% less, and so does the gold they require', () => {
    const c = effectiveChoice(venture, heroGame('silverTongue'), campaign)
    expect(c.effects![0]).toEqual({ kind: 'gold', delta: -90 })
    expect(c.requires![0]).toEqual({ kind: 'goldAtLeast', amount: 90 })
    expect(effectiveChoice(venture, heroGame('guard'), campaign)).toEqual(venture)
  })

  it('Shadow Step: the Smuggler gains 1 less Attention', () => {
    const shady: Choice = { id: 's', label: 'Shady', effects: [{ kind: 'flag', id: 'police_trigger', delta: 2 }, { kind: 'flag', id: 'mafia_trigger', delta: 1 }] }
    expect(effectiveChoice(shady, heroGame('smuggler'), campaign).effects).toEqual([{ kind: 'flag', id: 'police_trigger', delta: 1 }])
  })

  it('Lucky Find: the Prospector wins 25% more gold from a successful check', () => {
    const win = { text: 'Found it!', effects: [{ kind: 'gold' as const, delta: 100 }] }
    expect(effectiveOutcome(win, true, heroGame('prospector'), campaign).effects).toEqual([{ kind: 'gold', delta: 125 }])
    expect(effectiveOutcome(win, false, heroGame('prospector'), campaign).effects).toEqual(win.effects)
  })

  it('Foresight and Kind Hands add to their checks', () => {
    expect(abilityCheckBonuses('savvy', heroGame('alchemist'), campaign)).toEqual([{ mod: 2, reason: 'Foresight' }])
    expect(abilityCheckBonuses('charm', heroGame('healer'), campaign)).toEqual([{ mod: 1, reason: 'Kind Hands' }])
    expect(abilityCheckBonuses('grit', heroGame('alchemist'), campaign)).toEqual([])
  })

  it('every class meets its own Chapter 1 side story, and never another class\'s', () => {
    for (const classId of Object.keys(campaign.heroClasses!)) {
      const { state } = play(heroGame(classId), 2500, (s) => s.seenCardIds.includes(`side_${classId}_ch1`) || s.progress.colossiDefeated >= 1)
      expect(state.seenCardIds, classId).toContain(`side_${classId}_ch1`)
      expect(state.seenCardIds.filter((id) => id.startsWith('side_') && !id.startsWith(`side_${classId}_`)), classId).toEqual([])
    }
  })

  it('every class can play into the game and reach the first Colossus', () => {
    for (const classId of Object.keys(campaign.heroClasses!)) {
      const { state, actions } = play(heroGame(classId), 2500, (s) => s.progress.colossiDefeated >= 1)
      expect(state.progress.colossiDefeated, classId).toBeGreaterThanOrEqual(1)
      // Saves still replay exactly, character creation included
      const all = [{ type: 'rollStats' } as const, { type: 'createHero', name: 'Ada', classId, backgroundId: 'scribe' } as const, ...actions]
      expect(replay(7, all, campaign)).toEqual(createSave(7, all, state, 'v1').snapshot)
    }
  })

  it('Stand Firm: the Caravan Guard re-rolls one failed Grit check per chapter', () => {
    // Play until a Grit check has been re-rolled; the flag then blocks a second re-roll this chapter
    let s = heroGame('guard')
    let rerolled = false
    play(s, 2500, (st) => {
      s = st
      rerolled = !!st.pendingOutcome?.checkResult?.reroll
      return rerolled
    })
    expect(rerolled).toBe(true)
    expect(s.pendingOutcome!.checkResult!.stat).toBe('grit')
    expect(s.flags.ability_reroll_ch1 ?? s.flags[`ability_reroll_ch${s.progress.colossiDefeated + 1}`]).toBe(1)
  })
})

describe('class-specific journeys', () => {
  it('each class starts on its own first day; heroless saves keep the old job', () => {
    for (const classId of Object.keys(campaign.heroClasses!)) {
      const s = reduce(heroGame(classId), { type: 'choose', choiceId: `continue_${classId}` }, campaign)
      expect(s.currentCardId).toBe(`opening_${classId}`)
    }
    expect(reduce(newGame(7, campaign), { type: 'choose', choiceId: 'continue' }, campaign).currentCardId).toBe('job_offer')
  })

  it('class touches sit on real cards, and only their class can take them', () => {
    for (const [cardId, touch] of Object.entries(CLASS_TOUCHES)) {
      const card = campaign.cards[cardId]
      expect(card, cardId).toBeDefined()
      const choice = card!.choices.find((c) => c.id === `class_${touch.classId}`)!
      expect(choice, cardId).toBeDefined()
      for (const classId of Object.keys(campaign.heroClasses!)) {
        const state = heroGame(classId)
        const classGate = choice.requires!.filter((r) => r.kind === 'heroClass')
        expect(classGate.every((r) => isMet(r, state)), `${cardId} for ${classId}`).toBe(classId === touch.classId)
      }
    }
  })

  it('every class has its own option on every Colossus trial', () => {
    for (const trialId of Object.keys(COLOSSUS_TOUCHES)) {
      const ids = campaign.cards[trialId]!.choices.map((c) => c.id)
      for (const classId of Object.keys(campaign.heroClasses!)) expect(ids, trialId).toContain(`class_${classId}`)
    }
  })

  it('each class has at least 12 class touches', () => {
    const perClass: Record<string, number> = {}
    for (const touch of Object.values(CLASS_TOUCHES)) perClass[touch.classId] = (perClass[touch.classId] ?? 0) + 1
    for (const classId of Object.keys(campaign.heroClasses!)) expect(perClass[classId], classId).toBeGreaterThanOrEqual(12)
  })
})
