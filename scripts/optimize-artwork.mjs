#!/usr/bin/env node
// Converts generated card artwork to web-ready WebP in the one place the game
// reads it from: src/assets/artwork/chapter{N}/{cardId}.webp (see src/ui/artwork.ts).
//
// Picks up PNG/JPG from src/assets/artwork/** and the old public/assets/artwork/**,
// resizes to at most 1200px wide (cards show artwork at <=600px, so 2x for
// retina), and deletes the source once the WebP is written.
//
// Usage: node scripts/optimize-artwork.mjs [--keep]   (--keep leaves the sources)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outRoot = path.join(root, 'src/assets/artwork')
const sourceRoots = [outRoot, path.join(root, 'public/assets/artwork')]
const keep = process.argv.includes('--keep')

let converted = 0
let before = 0
let after = 0

for (const sourceRoot of sourceRoots) {
  if (!fs.existsSync(sourceRoot)) continue
  for (const chapterDir of fs.readdirSync(sourceRoot)) {
    if (!/^chapter\d$/.test(chapterDir)) continue
    const dir = path.join(sourceRoot, chapterDir)
    for (const file of fs.readdirSync(dir)) {
      if (!/\.(png|jpe?g)$/i.test(file)) continue
      const source = path.join(dir, file)
      const target = path.join(outRoot, chapterDir, file.replace(/\.(png|jpe?g)$/i, '.webp'))
      fs.mkdirSync(path.dirname(target), { recursive: true })
      await sharp(source).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(target)
      before += fs.statSync(source).size
      after += fs.statSync(target).size
      if (!keep) fs.rmSync(source)
      converted++
    }
  }
}

// Drop the now-empty legacy public directory tree.
const legacy = path.join(root, 'public/assets/artwork')
if (!keep && fs.existsSync(legacy) && fs.readdirSync(legacy).every((d) => fs.readdirSync(path.join(legacy, d)).length === 0)) {
  fs.rmSync(legacy, { recursive: true })
  if (fs.readdirSync(path.join(root, 'public/assets')).length === 0) fs.rmSync(path.join(root, 'public/assets'), { recursive: true })
}

const mb = (n) => (n / 1024 / 1024).toFixed(1)
console.log(`Converted ${converted} images: ${mb(before)}MB -> ${mb(after)}MB`)
