import { useEffect, useMemo, useRef, useState } from 'react'
import { campaign } from '../../content/campaign'
import { shopStatus } from '../../engine/shop'
import type { GameState } from '../../engine/types'
import type { TourTab } from '../components/GuideTour'

// Nudges toward the Guild Hall, because new players tend to stay on the story:
//   - a badge on the Guild Hall tab while it has something new you can afford
//   - now and then, a tip from Old Tobias pointing at the tab

const TIPS = [
  "You've got gold to spare! Pop into the Guild Hall: what you learn there is yours forever.",
  'Psst! The Guild Hall has something new you can afford. A Colossus can never take it!',
  'A little training at the Guild Hall now makes every roll easier later.',
  'Gear from the Guild Hall helps every roll. Have a look!',
]

/** Cards to wait between tips, so they help without nagging. */
const CARDS_BETWEEN_TIPS = 15
const TIP_MS = 7000

export function useGuildNudge(state: GameState, tab: TourTab, quiet: boolean) {
  // What the player could buy the last time they looked in
  const [seen, setSeen] = useState<Set<string>>(() => new Set())
  const affordable = useMemo(() => (campaign.shop ?? []).filter((item) => shopStatus(item, state) === 'available').map((item) => item.id), [state])

  useEffect(() => {
    if (tab === 'guild') setSeen(new Set(affordable))
  }, [tab, affordable])

  const fresh = affordable.some((id) => !seen.has(id))
  const badge = fresh && tab !== 'guild'

  // A tip when there's something new, at most once every few cards
  const cards = state.seenCardIds.length
  const lastTip = useRef(-Infinity)
  const tipCount = useRef(0)
  const [tip, setTip] = useState<string | null>(null)
  useEffect(() => {
    if (cards < lastTip.current) lastTip.current = -Infinity // a new game
    if (!badge || quiet || tab !== 'story' || state.status !== 'playing') return
    if (cards - lastTip.current < CARDS_BETWEEN_TIPS) return
    lastTip.current = cards
    setTip(TIPS[tipCount.current++ % TIPS.length]!)
  }, [badge, quiet, tab, cards, state.status])

  useEffect(() => {
    if (!tip) return
    const t = setTimeout(() => setTip(null), TIP_MS)
    return () => clearTimeout(t)
  }, [tip])

  // Something else needs the stage (payday, the tour): step aside and try again after
  useEffect(() => {
    if (!quiet) return
    setTip((current) => {
      if (current) lastTip.current = -Infinity
      return null
    })
  }, [quiet])

  // Visiting the Guild Hall answers the tip
  useEffect(() => {
    if (tab === 'guild') setTip(null)
  }, [tab])

  return { badge, tip, dismissTip: () => setTip(null) }
}
