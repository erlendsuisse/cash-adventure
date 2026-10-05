import { useState } from 'react'
import { campaign } from '../../content/campaign'
import { itemPrice, shopReserve, shopStatus, timesBought } from '../../engine/shop'
import type { GameState, Perk, ShopItem } from '../../engine/types'
import { useGame } from '../GameProvider'
import { Sheet } from './Sheet'
import styles from './GuildHall.module.css'

type Room = ShopItem['kind'] | 'kit'

const ROOMS: { id: Room; icon: string; label: string; hint: string }[] = [
  { id: 'training', icon: '💪', label: 'Training', hint: 'Grow your attributes. Each lesson costs a little more than the last.' },
  { id: 'gear', icon: '🧰', label: 'Gear', hint: 'Things to carry that help your rolls.' },
  { id: 'skill', icon: '✨', label: 'Skills', hint: 'Special tricks that help all game long.' },
  { id: 'kit', icon: '🎒', label: 'Your Kit', hint: 'A Colossus can take your ventures, but never these.' },
]

/** The Guild Hall: spend gold on yourself. One room at a time, small tiles you
 *  tap for the full story, so it all fits on one screen. */
export function GuildHall({ state }: { state: GameState }) {
  const [room, setRoom] = useState<Room>('training')
  const [picked, setPicked] = useState<ShopItem | null>(null)
  const current = ROOMS.find((r) => r.id === room)!

  return (
    <div className={styles.hall} data-tour="guild">
      <header className={styles.header}>
        <h2 className={styles.title}>The Guild Hall</h2>
        <p className={styles.lead}>Spend gold on yourself. Ventures can be lost, but what you learn is yours forever.</p>
      </header>

      <nav className={styles.rooms} aria-label="Guild Hall rooms">
        {ROOMS.map((r) => (
          <button key={r.id} type="button" className={styles.room} aria-current={room === r.id ? 'page' : undefined} onClick={() => setRoom(r.id)}>
            <span aria-hidden="true">{r.icon}</span> {r.label}
          </button>
        ))}
      </nav>

      <p className={styles.hint}>{current.hint}</p>

      {room === 'kit' ? <Kit state={state} /> : <Shelf state={state} kind={room} onPick={setPicked} />}

      {picked && <ItemSheet item={picked} state={state} onClose={() => setPicked(null)} />}
    </div>
  )
}

function Shelf({ state, kind, onPick }: { state: GameState; kind: ShopItem['kind']; onPick: (item: ShopItem) => void }) {
  const items = (campaign.shop ?? []).filter((item) => item.kind === kind && shopStatus(item, state) !== 'hidden')
  const open = items.filter((item) => shopStatus(item, state) !== 'later')
  const later = items.filter((item) => shopStatus(item, state) === 'later')
  const nextChapter = Math.min(...later.map((item) => item.fromChapter))

  return (
    <>
      <div className={styles.grid}>
        {open.map((item) => {
          const status = shopStatus(item, state)
          const bought = timesBought(item, state)
          return (
            <button key={item.id} type="button" className={`${styles.item} ${status === 'soldOut' ? styles.owned : ''} ${item.forClass ? styles.classItem : ''}`} onClick={() => onPick(item)}>
              {item.forClass && <span className={styles.ribbon}>✦ Just for you</span>}
              <span className={styles.icon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.text}>{item.text}</span>
              {status === 'soldOut' ? (
                <span className={styles.ownedTag}>{item.limit > 1 ? 'Mastered' : 'Yours'} ✓</span>
              ) : (
                <span className={`${styles.price} ${status === 'tooPoor' ? styles.priceDim : ''}`}>
                  {itemPrice(item, state)}g{item.limit > 1 && bought > 0 ? ` · ${bought}/${item.limit}` : ''}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {later.length > 0 && (
        <p className={styles.later}>
          🔒 {later.length} more open{later.length === 1 ? 's' : ''} in Chapter {nextChapter}
          {later.some((item) => item.fromChapter > nextChapter) ? ' and later' : ''}
        </p>
      )}
    </>
  )
}

/** One item, up close: its story, what it does, and the Buy button. */
function ItemSheet({ item, state, onClose }: { item: ShopItem; state: GameState; onClose: () => void }) {
  const { dispatch } = useGame()
  const status = shopStatus(item, state)
  const price = itemPrice(item, state)
  const bought = timesBought(item, state)
  const reserve = shopReserve(state)

  return (
    <Sheet title={item.name} icon={item.icon} onClose={onClose}>
      {item.forClass && <p className={styles.sheetRibbon}>✦ Only for {item.forClass}</p>}
      {item.story && <p className={styles.story}>{item.story}</p>}
      <p className={styles.effect}>{item.text}</p>
      {item.limit > 1 && (
        <p className={styles.note}>
          Bought {bought} of {item.limit} times.
        </p>
      )}
      {status === 'soldOut' ? (
        <p className={styles.ownedBig}>{item.limit > 1 ? 'Mastered!' : 'Yours to keep!'} ✓</p>
      ) : (
        <>
          <button
            type="button"
            className={styles.buyBig}
            disabled={status !== 'available' || state.status !== 'playing'}
            onClick={() => {
              dispatch({ type: 'buyItem', itemId: item.id })
              if (item.limit - bought <= 1) onClose()
            }}
          >
            Buy for {price}g
          </button>
          {status === 'tooPoor' && (
            <p className={styles.note}>
              You need {price}g, plus {reserve}g to live on this month.
            </p>
          )}
        </>
      )}
    </Sheet>
  )
}

function Kit({ state }: { state: GameState }) {
  const owned = state.progress.boons.map((b) => campaign.perks?.[b]).filter((p): p is Perk => !!p)
  if (owned.length === 0) return <p className={styles.empty}>Nothing yet. Buy something here, or look out for mentors on your travels!</p>
  return (
    <div className={styles.grid}>
      {owned.map((p) => (
        <div key={p.id} className={`${styles.item} ${styles.owned}`}>
          <span className={styles.icon} aria-hidden="true">
            {p.icon}
          </span>
          <span className={styles.name}>{p.name}</span>
          <span className={styles.text}>{p.text}</span>
          <span className={styles.ownedTag}>{p.kind === 'trophy' ? 'Trophy' : p.kind === 'gear' ? 'Gear' : 'Skill'}</span>
        </div>
      ))}
    </div>
  )
}
