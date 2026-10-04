import {
  Ban,
  BookOpen,
  Briefcase,
  ChevronsRight,
  Coins,
  Compass,
  Crown,
  Dices,
  Drama,
  Eye,
  Feather,
  Flame,
  Flower2,
  Footprints,
  Gem,
  Hammer,
  HandCoins,
  Handshake,
  Heart,
  Key,
  Landmark,
  Lock,
  Map,
  Package,
  Pickaxe,
  Pill,
  Scale,
  ScrollText,
  Search,
  Shield,
  Shirt,
  Ship,
  Sparkles,
  Store,
  Wheat,
  type LucideIcon,
} from 'lucide-react'
import type { Choice, Effect, StatId } from '../engine/types'

// A small ink picture beside each choice, so players can tell choices apart at
// a glance. Picked from the choice itself: a skill check shows its skill,
// otherwise what the choice is about (its words), otherwise what it does.

const STAT_ICON: Record<StatId, LucideIcon> = { grit: Shield, savvy: ScrollText, charm: Drama, nerve: Flame }

// First match wins, so more specific words come first
const WORD_ICON: [RegExp, LucideIcon][] = [
  [/perfume|scent|rose/, Flower2],
  [/cloak|boots|gloves|handkerchief|silk/, Shirt],
  [/ring|pendant|jewel|gem/, Gem],
  [/dice|gambl|wager|card game|bluff/, Dices],
  [/ship|boat|sail|harbour|navy|fleet/, Ship],
  [/book|ledger|library|tome/, BookOpen],
  [/map|treasure/, Map],
  [/compass/, Compass],
  [/quill|letter|write/, Feather],
  [/claim|mine|prospect|scrap/, Pickaxe],
  [/iron|forge|foundry|smith/, Hammer],
  [/medicine|heal|cure|tonic|doctor/, Pill],
  [/bread|bak|soup|kitchen|food|mill|farm|vineyard|garden/, Wheat],
  [/spice|salt|goods|stock|crate/, Package],
  [/spy|secret|whisper|informant|listen/, Eye],
  [/guard|protect|bodyguard/, Shield],
  [/key/, Key],
  [/crown|royal|court|king|palace/, Crown],
  [/give|donat|help|orphan|forgive|shelter|share the|kind/, Heart],
  [/loan|borrow|bank|lend/, Landmark],
  [/partner|join|shake/, Handshake],
  [/explore|search|investigat|examine|check|find|solve|look/, Search],
  [/magic|wonder|star|mirror|dream/, Sparkles],
]

const REFUSE = /^(refuse|decline|no\b|not\b|too |say no|turn (him|her|them|your \w+) (down|away)|shut|close the)/
const WALK_AWAY = /^(leave|walk|let |stay|keep |pass\b|wave|politely|send|back away|skip|wish|move on|ignore|head home|hand back|push the)/

const flat = (effects: Effect[] = []): Effect[] => effects.flatMap((e) => (e.kind === 'if' ? [e, ...flat(e.then), ...flat(e.else)] : [e]))

export function choiceIcon(choice: Choice, locked = false): LucideIcon {
  if (locked) return Lock
  if (choice.check) return STAT_ICON[choice.check.stat]

  const label = choice.label.toLowerCase()
  const effects = flat(choice.effects)
  // Nothing you can see changes (story text, flags, moving the story on)
  const quiet: Effect['kind'][] = ['narrate', 'flag', 'advancePhase', 'queueCard', 'advanceDays']
  const isQuiet = effects.every((e) => quiet.includes(e.kind))
  // Saying no or walking away beats any word in the label ("Leave it to the treasure hunters")
  if (isQuiet && REFUSE.test(label)) return Ban
  if (isQuiet && WALK_AWAY.test(label)) return Footprints

  const word = WORD_ICON.find(([pattern]) => pattern.test(label))
  if (word) return word[1]

  const has = (kind: Effect['kind']) => effects.some((e) => e.kind === kind)
  if (has('acquireAsset')) return Store
  if (has('loan')) return Landmark
  if (has('sellStock') || has('sellAsset')) return Scale
  if (has('buyStock') || has('commodity')) return Package
  if (effects.some((e) => e.kind === 'wages' && e.delta > 0)) return Briefcase
  if (effects.some((e) => e.kind === 'gold' && e.delta > 0)) return HandCoins
  if (effects.some((e) => e.kind === 'gold' && e.delta < 0)) return Coins
  if (isQuiet) return Footprints
  return ChevronsRight
}

/** The icon for a plain "Continue" button. */
export const ContinueIcon = ChevronsRight
