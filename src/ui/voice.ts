import { useSyncExternalStore } from 'react'
import { getSettings } from './settings'

// Card narration using the device's built-in voices (Web Speech API): free,
// works offline, and iPads/Macs ship good English voices. Music listens to
// isSpeaking() to duck while the narrator talks.
let speaking = false
const listeners = new Set<() => void>()

function setSpeaking(value: boolean) {
  if (speaking === value) return
  speaking = value
  listeners.forEach((listener) => listener())
}

export function voiceSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// The game is in English, so narration always is - even on a device set to
// another language (otherwise e.g. a Norwegian iPad reads with its own voice).
const LANG = 'en-GB'

// Prefer natural-sounding English voices where the device has them
const PREFERRED = ['Daniel', 'Samantha', 'Karen', 'Moira', 'Google UK English Male', 'Google UK English Female', 'Microsoft Libby', 'Microsoft Ryan', 'Microsoft Aria']

// Devices (iPads especially) load their voice list a moment after the page,
// so keep it fresh rather than reading it once while it's still empty
let voices: SpeechSynthesisVoice[] = []

function loadVoices() {
  voices = window.speechSynthesis.getVoices().filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('en'))
}

if (voiceSupported()) {
  loadVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices)
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) loadVoices()
  for (const name of PREFERRED) {
    const match = voices.find((v) => v.name.includes(name))
    if (match) return match
  }
  const british = voices.filter((v) => v.lang.replace('_', '-') === LANG)
  return british.find((v) => v.localService) ?? british[0] ?? voices.find((v) => v.localService) ?? voices[0]
}

// Browsers refuse speech until the player has tapped or pressed a key once.
// Until then, remember the latest text and read it on that first interaction.
let pending: string | null = null

function activated(): boolean {
  const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation
  return activation ? activation.hasBeenActive : true
}

if (voiceSupported()) {
  const onFirstInteraction = () => {
    document.removeEventListener('click', onFirstInteraction, true)
    document.removeEventListener('keydown', onFirstInteraction, true)
    if (pending) {
      const text = pending
      pending = null
      speak(text)
    }
  }
  document.addEventListener('click', onFirstInteraction, true)
  document.addEventListener('keydown', onFirstInteraction, true)
}

/** Reads the text aloud, replacing anything already being read. `force` speaks even when narration is off (the read-aloud button). */
export function speak(text: string, force = false) {
  if (!voiceSupported() || (!force && !getSettings().voice) || !text.trim()) return
  if (!activated()) {
    pending = text
    return
  }
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text.replace(/(\d)g\b/g, '$1 gold').replace(/\/mo(nth)?\b/g, ' a month'))
  // lang alone makes the browser pick an English voice if no specific one is known yet
  utterance.lang = LANG
  const voice = pickVoice()
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  }
  utterance.rate = 0.95
  utterance.pitch = 1
  utterance.onstart = () => setSpeaking(true)
  utterance.onend = utterance.onerror = () => setSpeaking(synth.speaking)
  synth.speak(utterance)
}

export function stopSpeaking() {
  if (!voiceSupported()) return
  window.speechSynthesis.cancel()
  setSpeaking(false)
}

export function isSpeaking(): boolean {
  return speaking
}

export function subscribeSpeaking(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSpeaking(): boolean {
  return useSyncExternalStore(subscribeSpeaking, isSpeaking, isSpeaking)
}
