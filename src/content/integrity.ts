import type { Campaign, Choice, Effect, Outcome, StoryCard } from '../engine/types'

function effectTargets(effect: Effect): string[] {
  if (effect.kind === 'queueCard') return [effect.card]
  if (effect.kind === 'if') return [...effect.then, ...(effect.else ?? [])].flatMap(effectTargets)
  return []
}

function outcomeTargets(outcome: Outcome): string[] {
  const fromEffects = (outcome.effects ?? []).flatMap(effectTargets)
  return outcome.goto ? [outcome.goto, ...fromEffects] : fromEffects
}

function choiceTargets(choice: Choice): string[] {
  const fromEffects = (choice.effects ?? []).flatMap(effectTargets)
  const fromChoiceGoto = choice.goto ? [choice.goto] : []
  const fromCheck = choice.check
    ? [
        ...outcomeTargets(choice.check.success),
        ...outcomeTargets(choice.check.failure),
        ...(choice.check.critSuccess ? outcomeTargets(choice.check.critSuccess) : []),
        ...(choice.check.critFailure ? outcomeTargets(choice.check.critFailure) : []),
      ]
    : []
  return [...fromChoiceGoto, ...fromEffects, ...fromCheck]
}

function cardTargets(card: StoryCard): string[] {
  const fromOnEnter = (card.onEnter ?? []).flatMap(effectTargets)
  const fromNext = card.next ? [card.next] : []
  const fromChoices = card.choices.flatMap(choiceTargets)
  return [...fromOnEnter, ...fromNext, ...fromChoices]
}

function flattenEffects(effects: Effect[] = []): Effect[] {
  return effects.flatMap((e) => (e.kind === 'if' ? [e, ...flattenEffects(e.then), ...flattenEffects(e.else)] : [e]))
}

/** Every effect a card can apply - onEnter, choices, every check outcome, and
 *  both branches of nested `if`s. */
export function cardEffects(card: StoryCard): Effect[] {
  const fromChoices = card.choices.flatMap((choice) => {
    const outcomes = choice.check ? [choice.check.success, choice.check.failure, choice.check.critSuccess, choice.check.critFailure] : []
    return [...(choice.effects ?? []), ...outcomes.flatMap((o) => o?.effects ?? [])]
  })
  return flattenEffects([...(card.onEnter ?? []), ...fromChoices])
}

export interface IntegrityReport {
  danglingReferences: { fromCard: string; targetCardId: string }[]
  unreachableCards: string[]
}

/** Checks that every goto/queueCard/next target exists, and that every card
 *  is reachable from either the start card or one of the campaign's entry
 *  points (the random deck, market day, the Colossus trials). */
export function checkIntegrity(campaign: Campaign): IntegrityReport {
  const danglingReferences: IntegrityReport['danglingReferences'] = []
  const reachable = new Set<string>([campaign.startCardId, campaign.marketDayCardId, ...campaign.deckCardIds, ...campaign.colossusCardIds])

  for (const card of Object.values(campaign.cards)) {
    for (const targetCardId of cardTargets(card)) {
      if (!campaign.cards[targetCardId]) {
        danglingReferences.push({ fromCard: card.id, targetCardId })
      } else {
        reachable.add(targetCardId)
      }
    }
  }

  const unreachableCards = Object.keys(campaign.cards).filter((id) => !reachable.has(id))
  return { danglingReferences, unreachableCards }
}
