import type { HeroLook } from '../engine/types'
import { Feather, FlaskConical, HeartHandshake, Pickaxe, Shield, Sparkles, type LucideIcon } from 'lucide-react'

// Class portraits live at src/assets/heroes/{classId}-{female|male}.webp
// (scripts/generate-hero-portraits.mjs). Until one exists, the class icon
// stands in, so a missing portrait never breaks the screen.
const urls = import.meta.glob<string>('../assets/heroes/*.webp', { eager: true, query: '?url', import: 'default' })
const byClass = new Map(Object.entries(urls).map(([file, url]) => [file.slice(file.lastIndexOf('/') + 1, -'.webp'.length), url]))

export function heroPortrait(classId: string, look: HeroLook = 'female'): string | undefined {
  return byClass.get(`${classId}-${look}`)
}

const ICONS: Record<string, LucideIcon> = {
  guard: Shield,
  smuggler: Feather,
  alchemist: FlaskConical,
  silverTongue: Sparkles,
  healer: HeartHandshake,
  prospector: Pickaxe,
}

export function heroIcon(classId: string): LucideIcon {
  return ICONS[classId] ?? Sparkles
}
