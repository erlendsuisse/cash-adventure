import { describe, expect, it } from 'vitest'
import type { Requirement } from '../engine/types'
import { campaign } from './campaign'
import { cardEffects } from './integrity'
import { FACTIONS, FLAG_STANDINGS, standingFlagIds, STORY_ONLY_FLAGS } from './standings'

const cards = Object.values(campaign.cards)

function flagsIn(r: Requirement, out: Set<string>): void {
  if (r.kind === 'flag') out.add(r.id)
  else if (r.kind === 'not') flagsIn(r.of, out)
  else if (r.kind === 'allOf' || r.kind === 'anyOf') r.of.forEach((x) => flagsIn(x, out))
}

const written = new Set(cards.flatMap((c) => cardEffects(c).flatMap((e) => (e.kind === 'flag' && ((e.set ?? 0) > 0 || (e.delta ?? 0) > 0) ? [e.id] : []))))
const read = new Set<string>()
for (const c of cards) {
  for (const e of cardEffects(c)) if (e.kind === 'if') flagsIn(e.when, read)
  const reqs = [
    ...(c.requires ?? []),
    ...c.choices.flatMap((ch) => [...(ch.requires ?? []), ...(ch.check?.bonuses ?? []).map((b) => b.if)]),
    ...c.body.flatMap((b) => (typeof b === 'string' ? [] : [b.if])),
  ]
  reqs.forEach((r) => flagsIn(r, read))
}

describe('reputation', () => {
  it('every flag a choice records matters to something: read later, a faction, or listed as story-only', () => {
    // A flag nobody reads is a promise ("they'll remember this") the game never keeps.
    const accounted = new Set([...read, ...Object.keys(FLAG_STANDINGS), ...STORY_ONLY_FLAGS, ...standingFlagIds])
    expect([...written].filter((f) => !accounted.has(f)).sort()).toEqual([])
  })

  it('the reputation tables only name flags that content actually sets', () => {
    const stale = [...Object.keys(FLAG_STANDINGS), ...STORY_ONLY_FLAGS].filter((f) => !written.has(f))
    expect(stale).toEqual([])
  })

  it('story flags carry their standing changes onto the cards', () => {
    const accept = campaign.cards['mob_protection_offer']!.choices.find((c) => c.id === 'accept_mob_protection')!
    expect(accept.effects).toContainEqual({ kind: 'flag', id: FACTIONS.underworld.flagId, delta: 2 })
    expect(accept.effects).toContainEqual({ kind: 'flag', id: FACTIONS.crown.flagId, delta: -1 })
  })

  it('every skill check feels the player\'s reputation', () => {
    const checks = cards.flatMap((c) => c.choices.flatMap((ch) => (ch.check ? [ch.check] : [])))
    expect(checks.length).toBeGreaterThan(0)
    for (const check of checks) {
      const flags = new Set<string>()
      for (const b of check.bonuses ?? []) flagsIn(b.if, flags)
      expect([...flags].some((f) => standingFlagIds.includes(f))).toBe(true)
    }
  })

  it('every faction has something to gain and something to lose', () => {
    for (const { flagId } of Object.values(FACTIONS)) {
      const deltas = cards.flatMap((c) => cardEffects(c).flatMap((e) => (e.kind === 'flag' && e.id === flagId && e.delta ? [e.delta] : [])))
      expect(deltas.some((d) => d > 0), `${flagId} rises`).toBe(true)
      expect(deltas.some((d) => d < 0), `${flagId} falls`).toBe(true)
    }
  })

  it('the player is shown standing and heat changes', () => {
    expect(campaign.trackedFlags).toEqual(expect.arrayContaining([...standingFlagIds, 'mafia_trigger', 'police_trigger', 'war_trigger', 'banking_trigger']))
  })
})
