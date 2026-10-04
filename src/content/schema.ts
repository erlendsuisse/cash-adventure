import { z } from 'zod'

// Validates authored content shape (catches typos in effect/requirement `kind`
// values, misspelled or unknown keys via strictObject, out-of-range chapters).
// Hand-written to mirror engine/types.ts - never derived via z.infer, so the
// engine keeps zero dependency on zod. Keep the two in step by hand.

const statId = z.enum(['grit', 'savvy', 'charm', 'nerve'])
const storyPhase = z.enum(['early_game', 'climbing', 'entangled', 'reckoning', 'recovery'])
const chapter = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7)])
const commodity = z.enum(['spice', 'salt', 'iron'])
// Market sectors have a live price index; asset sectors are labels for owned assets.
const marketSector = z.enum(['salt', 'spice', 'iron'])
const assetSector = z.enum([
  'salt', 'spice', 'iron', 'property', 'craft', 'trade', 'underworld', 'military',
  'banking', 'plague', 'health', 'espionage', 'transcendence', 'charity',
])

const requirement: z.ZodType<unknown> = z.lazy(() =>
  z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('goldAtLeast'), amount: z.number() }),
    z.object({ kind: z.literal('netIncomeAtLeast'), amount: z.number() }),
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

const ownedAsset = z.strictObject({
  id: z.string(),
  label: z.string(),
  cost: z.number(),
  monthlyCashflow: z.number(),
  sector: assetSector,
  visualEffect: z.enum(['headgear', 'clothing', 'accessories']).optional(),
  quantity: z.number().optional(),
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
    z.object({ kind: z.literal('marketShift'), sector: marketSector, delta: z.number() }),
    z.object({ kind: z.literal('grantBoon'), boon: z.string() }),
    z.object({ kind: z.literal('advancePhase'), to: storyPhase }),
    z.object({ kind: z.literal('reckoning') }),
    z.object({ kind: z.literal('narrate'), text: z.string() }),
    z.object({ kind: z.literal('end'), status: z.literal('won'), summary: z.string() }),
    z.object({ kind: z.literal('if'), when: requirement, then: z.array(effect), else: z.array(effect).optional() }),
    z.object({ kind: z.literal('commodity'), type: commodity, delta: z.number() }),
  ]),
)

const outcome = z.strictObject({
  text: z.string(),
  effects: z.array(effect).optional(),
  goto: z.string().optional(),
})

const skillCheck = z.strictObject({
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

const choice = z.strictObject({
  id: z.string(),
  label: z.string(),
  requires: z.array(requirement).optional(),
  showLockedAs: z.string().optional(),
  check: skillCheck.optional(),
  effects: z.array(effect).optional(),
  goto: z.string().optional(),
})

const visual = z.strictObject({
  backgroundId: z.string().optional(),
  characterMood: z.enum(['neutral', 'tense', 'triumphant', 'fearful']).optional(),
  soundEvents: z.array(z.strictObject({ trigger: z.enum(['onEnter', 'onChoice']), eventType: z.string() })).optional(),
})

export const storyCardSchema = z.strictObject({
  id: z.string(),
  title: z.string().optional(),
  body: z.array(proseBlock),
  onEnter: z.array(effect).optional(),
  choices: z.array(choice),
  next: z.string().optional(),
  weight: z.number().optional(),
  once: z.boolean().optional(),
  requires: z.array(requirement).optional(),
  minTier: z.number().optional(),
  storyPhase: storyPhase.optional(),
  chapter: chapter.optional(),
  visual: visual.optional(),
})
