import { isMet } from '../engine/requirements'
import type { GameState, ProseBlock } from '../engine/types'

export function resolveProse(body: ProseBlock[], state: GameState): string[] {
  return body
    .map((block) => (typeof block === 'string' ? block : isMet(block.if, state) ? block.text : undefined))
    .filter((text): text is string => text !== undefined)
}
