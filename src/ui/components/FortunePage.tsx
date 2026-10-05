import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { campaign } from '../../content/campaign'
import { CHAPTERS } from '../../content/chapters'
import { commodityPrice, currentChapter, passiveIncome } from '../../engine/selectors'
import type { Commodity, GameState, Perk } from '../../engine/types'
import { useGame } from '../GameProvider'
import { heroIcon, heroPortrait } from '../heroArt'
import { Sheet } from './Sheet'
import { StatScroll } from './StatScroll'
import styles from './FortunePage.module.css'

const COMMODITIES: Commodity[] = ['salt', 'spice', 'iron']
const GOOD_ICON: Record<Commodity, string> = { salt: '🧂', spice: '🌶️', iron: '⚒️' }
const SECTOR_ICON: Record<string, string> = { salt: '🧂', spice: '🌶️', iron: '⚒️' }
/** Ventures listed on the page; the rest are one tap away */
const VENTURES_SHOWN = 3
const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1)
const signed = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n)}g`

type Detail = 'in' | 'out' | 'worth' | 'lender' | 'skills' | 'kit'

/** One line in a detail sheet: a name, a short kid-friendly explanation, an amount. */
function Line({ label, hint, amount, tone, strong }: { label: string; hint?: string; amount: string; tone?: 'plus' | 'minus'; strong?: boolean }) {
  return (
    <div className={`${styles.line} ${strong ? styles.total : ''}`}>
      <span className={styles.lineLabel}>
        {label}
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
      <span className={`${styles.amount} ${tone === 'plus' ? styles.plus : tone === 'minus' ? styles.minus : ''}`}>{amount}</span>
    </div>
  )
}

function Tile({ icon, label, value, tone, onClick, className = '', tour }: { icon: ReactNode; label: string; value: ReactNode; tone?: 'plus' | 'minus' | 'worth'; onClick: () => void; className?: string; tour?: string }) {
  return (
    <button type="button" className={`${styles.tile} ${className}`} onClick={onClick} data-tour={tour}>
      <span className={styles.tileIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.tileLabel}>{label}</span>
      <span className={`${styles.tileValue} ${tone ? styles[tone] : ''}`}>{value}</span>
    </button>
  )
}

/** A money bag with a green arrow sweeping in, or a red arrow flying out. */
function MoneyBag({ flow }: { flow: 'in' | 'out' }) {
  const Arrow = flow === 'in' ? ArrowDownRight : ArrowUpRight
  return (
    <span className={`${styles.bag} ${flow === 'in' ? styles.bagIn : styles.bagOut}`}>
      💰
      <span className={styles.bagArrow}>
        <Arrow size={22} strokeWidth={3.2} />
      </span>
    </span>
  )
}

/** Your fortune at a glance: who you are, what you hold and owe, and four
 *  tiles that open the details. Fits one screen; nothing to scroll. */
export function FortunePage({ state }: { state: GameState }) {
  const [open, setOpen] = useState<Detail | null>(null)
  const { finances } = state
  const passive = passiveIncome(state)
  const income = finances.wages + passive
  const goods = COMMODITIES.filter((c) => finances.commodities[c] > 0).map((c) => ({ c, units: finances.commodities[c], value: finances.commodities[c] * commodityPrice(state, campaign, c) }))
  const venturesValue = finances.assets.reduce((sum, a) => sum + a.cost, 0)
  const goodsValue = goods.reduce((sum, g) => sum + g.value, 0)
  const worth = finances.gold + venturesValue + goodsValue - finances.debt
  const chapter = CHAPTERS[currentChapter(state)]
  const kit = state.progress.boons.flatMap((b) => (campaign.perks?.[b] ? [campaign.perks[b]] : []))

  const heroClass = state.hero ? campaign.heroClasses?.[state.hero.classId] : undefined
  const background = state.hero ? campaign.backgrounds?.[state.hero.backgroundId] : undefined
  const Icon = heroClass ? heroIcon(heroClass.id) : null
  const portrait = heroClass ? heroPortrait(heroClass.id, state.hero?.look) : null

  const close = () => setOpen(null)

  return (
    <div className={styles.page} data-tour="fortune">
      {/* Who you are */}
      <section className={styles.hero}>
        <span className={styles.portrait}>{portrait ? <img src={portrait} alt="" /> : Icon ? <Icon size={40} strokeWidth={1.6} /> : '🧭'}</span>
        <div className={styles.heroText}>
          <h2 className={styles.heroName}>{state.hero?.name ?? 'The Merchant'}</h2>
          {heroClass && (
            <div className={styles.heroClass}>
              {heroClass.name}
              {background ? ` · ${background.name}` : ''}
            </div>
          )}
          <div className={styles.progress}>
            Chapter {chapter.numeral} · {state.progress.colossiDefeated}/7 Colossi beaten
          </div>
          {heroClass && (
            <p className={styles.ability}>
              <strong>{heroClass.ability.name}:</strong> {heroClass.ability.text}
            </p>
          )}
          {/* Phones have no side panel: attributes and reputation open from here */}
          <button type="button" className={styles.skillsButton} onClick={() => setOpen('skills')} data-tour="stats">
            🎲 Skills & friends
          </button>
          <button type="button" className={styles.kit} onClick={() => setOpen('kit')} aria-label="Skills, gear and trophies">
            {kit.length === 0 ? (
              <span className={styles.kitEmpty}>No skills or gear yet</span>
            ) : (
              kit.map((p) => (
                <span key={p.id} className={styles.kitItem} aria-hidden="true">
                  {p.icon}
                </span>
              ))
            )}
          </button>
        </div>
      </section>

      {/* What you own and owe (the road to freedom is on the Adventure page) */}
      <section className={styles.holdings}>
        <h3 className={styles.panelTitle}>Your Holdings</h3>

        <div className={styles.group}>
          <span className={styles.groupLabel}>Ventures</span>
          {finances.assets.length === 0 ? (
            <p className={styles.none}>None yet. Look out for cards that offer one!</p>
          ) : (
            <button type="button" className={styles.ventures} onClick={() => setOpen('in')}>
              {finances.assets.slice(0, VENTURES_SHOWN).map((a) => (
                <span key={a.id} className={styles.venture}>
                  <span aria-hidden="true">{SECTOR_ICON[a.sector] ?? '🏪'}</span>
                  <span className={styles.ventureName}>{a.label}</span>
                  <span className={styles.plus}>+{a.monthlyCashflow}g/mo</span>
                </span>
              ))}
              {finances.assets.length > VENTURES_SHOWN && <span className={`${styles.more} ${styles.wideOnly}`}>and {finances.assets.length - VENTURES_SHOWN} more…</span>}
              {finances.assets.length > 2 && <span className={`${styles.more} ${styles.phoneMore}`}>and {finances.assets.length - 2} more…</span>}
            </button>
          )}
        </div>

        <div className={styles.group}>
          <span className={styles.groupLabel}>Goods</span>
          <div className={styles.goods}>
            {COMMODITIES.map((c) => {
              const units = finances.commodities[c]
              return (
                <span key={c} className={`${styles.good} ${units === 0 ? styles.goodEmpty : ''}`}>
                  <span className={styles.goodIcon} aria-hidden="true">
                    {GOOD_ICON[c]}
                  </span>
                  <span className={styles.goodName}>{cap(c)}</span>
                  <strong>{units}</strong>
                  <span className={styles.goodValue}>{units > 0 ? `${units * commodityPrice(state, campaign, c)}g` : `${commodityPrice(state, campaign, c)}g each`}</span>
                </span>
              )
            })}
          </div>
        </div>

        <button type="button" className={`${styles.debt} ${finances.debt > 0 ? styles.debtOwed : ''}`} onClick={() => setOpen('lender')}>
          <span className={styles.groupLabel}>Debt</span>
          <strong>{finances.debt > 0 ? `${finances.debt}g` : 'None'}</strong>
          {(finances.loanPayments ?? 0) > 0 && <span className={styles.debtPay}>paying {finances.loanPayments}g a month</span>}
        </button>
      </section>

      {/* Tap in for the details */}
      <div className={styles.tiles}>
        <Tile icon={<MoneyBag flow="in" />} label="Coming in" value={signed(income)} tone="plus" onClick={() => setOpen('in')} />
        <Tile icon={<MoneyBag flow="out" />} label="Going out" value={`−${finances.monthlyExpenses}g`} tone="minus" onClick={() => setOpen('out')} />
        <Tile icon="⚖️" label="You're worth" value={`${worth}g`} tone="worth" onClick={() => setOpen('worth')} />
        <Tile icon="🏦" label="Money Lender" value={finances.debt > 0 ? `Owe ${finances.debt}g` : 'Borrow'} tone={finances.debt > 0 ? 'minus' : undefined} onClick={() => setOpen('lender')} />
      </div>

      {open === 'in' && (
        <Sheet title="Coming In" icon="💰" onClose={close}>
          <Line label="Wages" hint="Money you earn by working. Stop working, and it stops." amount={signed(finances.wages)} tone="plus" />
          <Line label="Ventures" hint="Money your ventures earn while you sleep." amount={signed(passive)} tone="plus" />
          {finances.assets.map((a) => (
            <div key={a.id} className={styles.subLine}>
              <span>{a.label}</span>
              <span className={styles.plus}>{signed(a.monthlyCashflow)}</span>
            </div>
          ))}
          {finances.assets.length === 0 && <p className={styles.empty}>No ventures yet. Look out for cards that offer one!</p>}
          <Line label="Every month" amount={signed(income)} strong />
        </Sheet>
      )}

      {open === 'out' && (
        <Sheet title="Going Out" icon="💸" onClose={close}>
          <Line label="Living costs" hint="Food, rent and everything it takes to live in Vessarin." amount={`−${finances.monthlyExpenses - (finances.loanPayments ?? 0)}g`} tone="minus" />
          {(finances.loanPayments ?? 0) > 0 && <Line label="Loan payments" hint="Paying back what you borrowed." amount={`−${finances.loanPayments}g`} tone="minus" />}
          <Line label="Every month" amount={`−${finances.monthlyExpenses}g`} strong />
          <p className={styles.tip}>When your ventures pay more than this, you are free!</p>
        </Sheet>
      )}

      {open === 'worth' && (
        <Sheet title="What You're Worth" icon="⚖️" onClose={close}>
          <Line label="Gold in your purse" amount={`${finances.gold}g`} />
          <Line label="Ventures" hint="What you paid for the things that earn you money." amount={`${venturesValue}g`} />
          {goods.map((g) => (
            <Line key={g.c} label={`${cap(g.c)}: ${g.units} units`} hint="At today's market price." amount={`${g.value}g`} />
          ))}
          <Line label="Debt" hint="Money you still have to pay back." amount={`−${finances.debt}g`} tone={finances.debt > 0 ? 'minus' : undefined} />
          <Line label="All together" amount={`${worth}g`} strong />
        </Sheet>
      )}

      {open === 'lender' && (
        <Sheet title="The Money Lender" icon="🏦" onClose={close}>
          <Lender state={state} />
        </Sheet>
      )}

      {open === 'skills' && (
        <Sheet title="Skills & Friends" icon="🎲" onClose={close}>
          <div className={styles.darkPanel}>
            <StatScroll state={state} />
          </div>
        </Sheet>
      )}

      {open === 'kit' && (
        <Sheet title="Carried With You" icon="🎒" onClose={close}>
          <p className={styles.tip}>A Colossus can take your ventures, but never these.</p>
          {kit.length === 0 && <p className={styles.empty}>Nothing yet. Visit the Guild Hall, or look out for mentors on your travels!</p>}
          {kit.map((p: Perk) => (
            <div key={p.id} className={styles.perk}>
              <span className={styles.perkIcon} aria-hidden="true">
                {p.icon}
              </span>
              <span>
                <strong>{p.name}</strong>
                <span className={styles.hint}>{p.text}</span>
              </span>
            </div>
          ))}
        </Sheet>
      )}
    </div>
  )
}

function Lender({ state }: { state: GameState }) {
  const { dispatch } = useGame()
  const [loanAmount, setLoanAmount] = useState('')
  const [paybackAmount, setPaybackAmount] = useState('')
  const { finances } = state
  const maxPayback = Math.max(0, Math.min(finances.gold, finances.debt))
  return (
    <>
      <p className={styles.tip}>Borrow gold now, and pay back 10% of it every month until it's all repaid.</p>
      <Line label="You owe" amount={`${finances.debt}g`} tone={finances.debt > 0 ? 'minus' : undefined} />
      <div className={styles.loanRow}>
        <input type="number" inputMode="numeric" min={0} max={1000} value={loanAmount} placeholder="How much?" aria-label="Loan amount" onChange={(e) => setLoanAmount(e.target.value)} />
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            const amount = Math.floor(Number(loanAmount) || 0)
            if (amount > 0) {
              dispatch({ type: 'takeLoan', principal: amount, monthlyPayment: Math.ceil(amount * 0.1) })
              setLoanAmount('')
            }
          }}
        >
          Borrow
        </button>
      </div>
      {finances.debt > 0 && (
        <div className={styles.loanRow}>
          <input type="number" inputMode="numeric" min={0} max={maxPayback} value={paybackAmount} placeholder={`Up to ${maxPayback}g`} aria-label="Amount to pay back" onChange={(e) => setPaybackAmount(e.target.value)} />
          <button
            type="button"
            className={styles.button}
            disabled={maxPayback === 0}
            onClick={() => {
              const amount = Math.min(maxPayback, Math.floor(Number(paybackAmount) || 0))
              if (amount > 0) {
                dispatch({ type: 'payLoan', amount })
                setPaybackAmount('')
              }
            }}
          >
            Pay back
          </button>
        </div>
      )}
    </>
  )
}
