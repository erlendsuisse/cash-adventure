import { describe, expect, it } from 'vitest'
import { CHAPTER_PLAYLISTS } from './music'

const files = Object.keys(import.meta.glob('../assets/music/**/*', { query: '?url' }))

describe('background music', () => {
  it('is all MP3, filed under a chapter folder', () => {
    expect(files.filter((f) => !/\/chapter[1-7]\/[^/]+\.mp3$/.test(f))).toEqual([])
  })

  it('every chapter has its own tracks', () => {
    const empty = Object.entries(CHAPTER_PLAYLISTS).filter(([, tracks]) => tracks.length === 0).map(([chapter]) => chapter)
    expect(empty).toEqual([])
  })

  it('Chapter 1 opens with the opening track', () => {
    expect(CHAPTER_PLAYLISTS[1][0]).toContain('optimistic-venture')
  })
})
