import { isMet } from './requirements'
import { rollDie } from './rng'
import type { CheckResult, GameState, Outcome, RngState, SkillCheck } from './types'

export interface ResolvedCheck {
  result: CheckResult
  outcome: Outcome
  rng: RngState
}

/** Rolls inside the engine so the result is deterministic and replayable; the
 *  UI only ever renders a CheckResult it was handed, never rolls itself. */
export function resolveCheck(check: SkillCheck, state: GameState, extraBonuses: { mod: number; reason: string }[] = []): ResolvedCheck {
  const die = check.die ?? 20
  const { roll, rng } = rollDie(state.rng, die)

  const statMod = state.stats[check.stat]
  const bonuses = (check.bonuses ?? [])
    .filter((b) => isMet(b.if, state))
    .map((b) => ({ mod: b.mod, reason: b.reason }))
    .concat(extraBonuses)
  const bonusTotal = bonuses.reduce((sum, b) => sum + b.mod, 0)
  const total = roll + statMod + bonusTotal

  const isCritSuccess = roll === die && check.critSuccess !== undefined
  const isCritFailure = roll === 1 && check.critFailure !== undefined

  const resultKind: CheckResult['result'] = isCritSuccess
    ? 'critSuccess'
    : isCritFailure
      ? 'critFailure'
      : total >= check.dc
        ? 'success'
        : 'failure'

  const outcome =
    resultKind === 'critSuccess'
      ? check.critSuccess!
      : resultKind === 'critFailure'
        ? check.critFailure!
        : resultKind === 'success'
          ? check.success
          : check.failure

  const result: CheckResult = {
    die,
    roll,
    stat: check.stat,
    statMod,
    bonuses,
    total,
    dc: check.dc,
    result: resultKind,
  }

  return { result, outcome, rng }
}

const RESULT_LABEL: Record<CheckResult['result'], string> = {
  critSuccess: 'CRITICAL SUCCESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  critFailure: 'CRITICAL FAILURE',
}

/** Renders the full arithmetic, e.g. "d20 (14) + savvy (3) + haggler's boon (2) = 19 vs DC 15 -> SUCCESS". */
export function formatCheck(result: CheckResult): string {
  const parts = [`d${result.die} (${result.roll})`, `${result.stat} (${result.statMod})`]
  for (const bonus of result.bonuses) {
    parts.push(`${bonus.reason} (${bonus.mod})`)
  }
  return `${parts.join(' + ')} = ${result.total} vs DC ${result.dc} -> ${RESULT_LABEL[result.result]}`
}
