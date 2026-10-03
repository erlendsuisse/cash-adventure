import { newGame } from '../engine/init'
import { reduce } from '../engine/reduce'
import type { Action, Campaign, GameState } from '../engine/types'

export const SAVE_SCHEMA_VERSION = 1
const STORAGE_KEY = 'cash-adventure:save:v1'

export interface SaveEnvelope {
  schemaVersion: number
  contentVersion: string
  savedAt: string
  seed: number
  actions: Action[]
  snapshot: GameState
}

export function createSave(seed: number, actions: Action[], snapshot: GameState, contentVersion: string): SaveEnvelope {
  return { schemaVersion: SAVE_SCHEMA_VERSION, contentVersion, savedAt: new Date().toISOString(), seed, actions, snapshot }
}

/** Rebuilds state from scratch by replaying every action. The property this
 *  exists to prove: replay(seed, actions) === the snapshot taken after those
 *  same actions. That property is what makes a server able to validate a
 *  friend's turn later without trusting their client. */
export function replay(seed: number, actions: Action[], campaign: Campaign): GameState {
  let state = newGame(seed, campaign)
  for (const action of actions) {
    state = reduce(state, action, campaign)
  }
  return state
}

export function serialize(envelope: SaveEnvelope): string {
  return JSON.stringify(envelope)
}

export type LoadResult = { ok: true; envelope: SaveEnvelope } | { ok: false; reason: string }

// schemaVersion is 1 and there is nothing to migrate yet. When the envelope
// shape changes, add an ordered chain of {from, to, migrate} steps here
// instead of bumping the rejection below.
export function deserialize(raw: string): LoadResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, reason: 'invalid JSON' }
  }
  if (typeof parsed !== 'object' || parsed === null) return { ok: false, reason: 'malformed save' }
  const envelope = parsed as Partial<SaveEnvelope>
  if (typeof envelope.schemaVersion !== 'number' || typeof envelope.seed !== 'number' || !Array.isArray(envelope.actions)) {
    return { ok: false, reason: 'malformed save' }
  }
  if (envelope.schemaVersion !== SAVE_SCHEMA_VERSION) {
    return { ok: false, reason: `unsupported schema version ${envelope.schemaVersion}` }
  }
  return { ok: true, envelope: envelope as SaveEnvelope }
}

export function saveToLocalStorage(envelope: SaveEnvelope): void {
  localStorage.setItem(STORAGE_KEY, serialize(envelope))
}

export function loadFromLocalStorage(): LoadResult | undefined {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return undefined
  return deserialize(raw)
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}
