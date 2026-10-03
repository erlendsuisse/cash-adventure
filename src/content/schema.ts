import { z } from 'zod'

// Validates authored content shape (catches typos in effect/requirement `kind`
// values etc). Hand-written and checked against engine/types.ts by the
// "schema matches engine types" test - never derived via z.infer, so the
// engine keeps zero dependency on zod.

const statId = z.enum(['grit', 'savvy', 'charm', 'nerve'])
const storyPhase = z.enum(['early_game', 'climbing', 'entangled', 'reckoning', 'recovery'])

const requirement: z.ZodType<unknown> = z.lazy(() =>
  z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('goldAtLeast'), amount: z.number() }),
    z.object({ kind: z.literal('statAtLeast'), stat: statId, value: z.number() }),
    z.object({ kind: z.literal('flag'), id: z.string(), atLeast: z.number().optional(), equals: z.number().optional() }),
    z.object({ kind: z.literal('ownsAsset'), id: z.string() }),
    z.object({ kind: z.literal('isFree') }),
    z.object({ kind: z.literal('colossiAtLeast'), count: z.number() }),
    z.object({ kind: z.literal('storyPhase'), phase: storyPhase }),
    z.object({ kind: z.literal('cardSeen'), id: z.string() }),
    z.object({ kind: z.literal('cardNotSeen'), id: z.string() }),
    z.object({ kind: z.literal('not'), of: requirement }),
    z.object({ kind: z.literal('allOf'), of: z.array(requirement) }),
    z.object({ kind: z.literal('anyOf'), of: z.array(requirement) }),
  ]),
)

const ownedAsset = z.object({
  id: z.string(),
  label: z.string(),
  cost: z.number(),
  monthlyCashflow: z.number(),
  sector: z.string(),
})

const effect: z.ZodType<unknown> = z.lazy(() =>
  z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('gold'), delta: z.number() }),
    z.object({ kind: z.literal('stat'), stat: statId, delta: z.number() }),
    z.object({ kind: z.literal('flag'), id: z.string(), set: z.number().optional(), delta: z.number().optional() }),
    z.object({ kind: z.literal('acquireAsset'), asset: ownedAsset }),
    z.object({ kind: z.literal('sellAsset'), id: z.string(), priceMultiplier: z.number().optional() }),
    z.object({ kind: z.literal('wages'), delta: z.number() }),
    z.object({ kind: z.literal('expense'), delta: z.number() }),
    z.object({ kind: z.literal('loan'), principal: z.number(), monthlyPayment: z.number() }),
    z.object({ kind: z.literal('advanceDays'), days: z.number() }),
    z.object({ kind: z.literal('queueCard'), card: z.string(), front: z.boolean().optional() }),
    z.object({ kind: z.literal('marketShift'), sector: z.string(), delta: z.number() }),
    z.object({ kind: z.literal('grantBoon'), boon: z.string() }),
    z.object({ kind: z.literal('advancePhase'), to: storyPhase }),
    z.object({ kind: z.literal('reckoning') }),
    z.object({ kind: z.literal('narrate'), text: z.string() }),
    z.object({ kind: z.literal('end'), status: z.literal('won'), summary: z.string() }),
    z.object({ kind: z.literal('if'), when: requirement, then: z.array(effect), else: z.array(effect).optional() }),
    z.object({ kind: z.literal('commodity'), type: z.enum(['spice', 'salt', 'iron']), delta: z.number() }),
  ]),
)

const outcome = z.object({
  text: z.string(),
  effects: z.array(effect).optional(),
  goto: z.string().optional(),
})

const skillCheck = z.object({
  stat: statId,
  dc: z.number(),
  die: z.number().optional(),
  bonuses: z.array(z.object({ if: requirement, mod: z.number(), reason: z.string() })).optional(),
  success: outcome,
  failure: outcome,
  critSuccess: outcome.optional(),
  critFailure: outcome.optional(),
})

const proseBlock = z.union([z.string(), z.object({ if: requirement, text: z.string() })])

const choice = z.object({
  id: z.string(),
  label: z.string(),
  requires: z.array(requirement).optional(),
  showLockedAs: z.string().optional(),
  check: skillCheck.optional(),
  effects: z.array(effect).optional(),
  goto: z.string().optional(),
})

export const storyCardSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  body: z.array(proseBlock),
  onEnter: z.array(effect).optional(),
  choices: z.array(choice),
  next: z.string().optional(),
  weight: z.number().optional(),
  requires: z.array(requirement).optional(),
  minTier: z.number().optional(),
  storyPhase: storyPhase.optional(),
})
