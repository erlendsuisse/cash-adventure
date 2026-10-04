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

// Prefer natural-sounding English voices where the device has them
const PREFERRED = ['Daniel', 'Samantha', 'Karen', 'Moira', 'Google UK English Male', 'Google UK English Female', 'Microsoft Libby', 'Microsoft Ryan', 'Microsoft Aria']

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'))
  for (const name of PREFERRED) {
    const match = voices.find((v) => v.name.includes(name))
    if (match) return match
  }
  return voices.find((v) => v.localService) ?? voices[0]
}

/** Reads the text aloud, replacing anything already being read. `force` speaks even when narration is off (the read-aloud button). */
export function speak(text: string, force = false) {
  if (!voiceSupported() || (!force && !getSettings().voice) || !text.trim()) return
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text.replace(/(\d)g\b/g, '$1 gold').replace(/\/mo(nth)?\b/g, ' a month'))
  const voice = pickVoice()
  if (voice) utterance.voice = voice
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
