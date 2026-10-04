import { getSettings } from './settings'

// Gentle sound effects synthesised with the Web Audio API: no files to load,
// and every sound is soft and short so it suits a calm background game.
let context: AudioContext | null = null

function audio(): AudioContext | null {
  if (!getSettings().sound || typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  context ??= new Ctor()
  if (context.state === 'suspended') void context.resume()
  return context
}

/** One soft bell-like note. */
function tone(ctx: AudioContext, freq: number, start: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(volume, start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

/** A short burst of filtered noise (dice clicks, paper swish). */
function noise(ctx: AudioContext, start: number, duration: number, volume: number, frequency: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const source = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  source.buffer = buffer
  filter.type = 'bandpass'
  filter.frequency.value = frequency
  gain.gain.value = volume
  source.connect(filter).connect(gain).connect(ctx.destination)
  source.start(start)
}

export const sfx = {
  /** Coins clinking into the purse; more coins for bigger gains. */
  coins(count = 3) {
    const ctx = audio()
    if (!ctx) return
    for (let i = 0; i < Math.min(count, 6); i++) {
      const t = ctx.currentTime + i * 0.07
      tone(ctx, 2200 + ((i * 370) % 900), t, 0.18, 0.05)
      tone(ctx, 3300 + ((i * 210) % 600), t, 0.12, 0.025)
    }
  },
  /** Coins leaving: a soft falling pair of notes. */
  spend() {
    const ctx = audio()
    if (!ctx) return
    tone(ctx, 900, ctx.currentTime, 0.15, 0.05, 'triangle')
    tone(ctx, 600, ctx.currentTime + 0.08, 0.2, 0.04, 'triangle')
  },
  /** Dice rattling across a table. */
  dice() {
    const ctx = audio()
    if (!ctx) return
    for (let i = 0; i < 7; i++) noise(ctx, ctx.currentTime + i * 0.09 + Math.random() * 0.03, 0.04, 0.25, 1800 + Math.random() * 1500)
  },
  /** A warm rising chime for a passed check. */
  success() {
    const ctx = audio()
    if (!ctx) return
    ;[523, 659, 784].forEach((f, i) => tone(ctx, f, ctx.currentTime + i * 0.09, 0.5, 0.06))
  },
  /** A soft, low "hmm" for a failed check - disappointing, never harsh. */
  fail() {
    const ctx = audio()
    if (!ctx) return
    tone(ctx, 330, ctx.currentTime, 0.35, 0.05, 'triangle')
    tone(ctx, 262, ctx.currentTime + 0.18, 0.45, 0.05, 'triangle')
  },
  /** Paper swish when a card is dealt. */
  card() {
    const ctx = audio()
    if (!ctx) return
    noise(ctx, ctx.currentTime, 0.18, 0.12, 3500)
  },
  /** A little fanfare for payday. */
  payday() {
    const ctx = audio()
    if (!ctx) return
    ;[523, 659, 784, 1047].forEach((f, i) => tone(ctx, f, ctx.currentTime + i * 0.11, 0.6, 0.06))
    this.coins(5)
  },
  /** Sparkle for a stat going up or a new venture. */
  sparkle() {
    const ctx = audio()
    if (!ctx) return
    ;[1568, 2093, 2637].forEach((f, i) => tone(ctx, f, ctx.currentTime + i * 0.06, 0.3, 0.035))
  },
}
