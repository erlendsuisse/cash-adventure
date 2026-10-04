#!/usr/bin/env node
// Generates the class portraits for character creation via Stability (Stable
// Image Core, ~3 credits each), in the same warm cartoon style as the cards,
// then writes them as square WebP to src/assets/heroes/{classId}-{female|male}.webp.
// Skips classes that already have a portrait unless --force.
//
// Usage: set -a; . ./.env; set +a; node scripts/generate-hero-portraits.mjs [--force] [--only guard-male,healer-female]

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'src/assets/heroes')
const apiKey = process.env.STABILITY_API_KEY
if (!apiKey) {
  console.error('STABILITY_API_KEY is not set')
  process.exit(1)
}

const STYLE =
  'friendly character portrait, head and shoulders, looking at the viewer with a warm smile, detailed hand-painted cartoon game art, ' +
  'whimsical fantasy merchant world with Victorian steampunk touches, warm golds, earth browns and teal accents, soft lantern glow, simple warm background'
const NEGATIVE =
  'photograph, photorealistic, 3D render, anime, grayscale, scary, angry, weapons pointed at viewer, guns, blood, gore, modern clothing, text, watermark, blurry, multiple people'

// Every class has a female and a male look: {classId}-{female|male}
const PORTRAITS = {
  'guard-female': 'close-up head and shoulders portrait of a sturdy, kind young woman caravan guard with braided hair, leather armour with brass buckles and a round wooden shield on her back, a dusty road behind',
  'guard-male': 'close-up head and shoulders portrait of a sturdy, kind young man caravan guard with short hair and a short beard, leather armour with brass buckles and a round wooden shield on his back, a dusty road behind',
  'smuggler-female': 'a cheerful young woman smuggler with a gold earring and windswept dark hair, a dark blue sea coat and a red scarf, a lantern-lit harbour at night behind',
  'smuggler-male': 'a cheerful young man smuggler with a gold earring, a dark blue sea coat and a red scarf, a lantern-lit harbour at night behind',
  'alchemist-female': 'a clever young woman alchemist with round brass goggles pushed up on her forehead and curly hair, an apron with bubbling coloured flasks, a cosy workshop behind',
  'alchemist-male': 'a clever young man alchemist with round brass goggles pushed up on his forehead and messy hair, an apron with bubbling coloured flasks, a cosy workshop behind',
  'silverTongue-female': 'a charming young woman travelling bard holding a lute, a feathered cap over long wavy hair and a colourful velvet jacket, a warm tavern behind',
  'silverTongue-male': 'a charming young man travelling bard holding a lute, a feathered cap and a colourful velvet jacket, a warm tavern behind',
  'healer-female': 'a gentle young woman healer in a soft green hooded robe with a satchel of herbs and a sprig of lavender, a sunny herb garden behind',
  'healer-male': 'a gentle young man healer in a soft green hooded robe with a satchel of herbs and a sprig of lavender, a sunny herb garden behind',
  'prospector-female': 'a cheerful older woman prospector with a wide-brimmed hat and a grey braid, a pickaxe over the shoulder and a gold pan, rocky mountains behind',
  'prospector-male': 'a cheerful older man prospector with a wide-brimmed hat and a grey beard, a pickaxe over the shoulder and a gold pan, rocky mountains behind',
}

const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : undefined

fs.mkdirSync(outDir, { recursive: true })
for (const [id, prompt] of Object.entries(PORTRAITS)) {
  if (only && !only.includes(id)) continue
  const target = path.join(outDir, `${id}.webp`)
  if (!force && fs.existsSync(target)) continue
  const form = new FormData()
  form.append('prompt', `${prompt}. ${STYLE}`)
  form.append('negative_prompt', NEGATIVE)
  form.append('aspect_ratio', '1:1')
  form.append('output_format', 'png')
  const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
    method: 'POST',
    headers: { Accept: 'image/*', Authorization: `Bearer ${apiKey}` },
    body: form,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.log(`✗ ${id} - ${error.errors?.join('; ') ?? error.message ?? response.statusText}`)
    continue
  }
  if (response.headers.get('finish-reason') === 'CONTENT_FILTERED') {
    console.log(`✗ ${id} - content filter (blurred result discarded)`)
    continue
  }
  await sharp(Buffer.from(await response.arrayBuffer())).resize(384, 384).webp({ quality: 82 }).toFile(target)
  console.log(`✓ ${id}`)
}
