import { describe, expect, it } from 'vitest'
import { campaign } from '../content/campaign'
import { heroPortrait } from './heroArt'

describe('hero portraits', () => {
  it('every class has a female and a male portrait', () => {
    const missing = Object.keys(campaign.heroClasses!).flatMap((id) => (['female', 'male'] as const).filter((look) => !heroPortrait(id, look)).map((look) => `${id}-${look}`))
    expect(missing).toEqual([])
  })
})
