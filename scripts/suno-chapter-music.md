# Chapter Music for Cash Adventure

One musical identity per chapter, so each Colossus you beat changes how the
city sounds. Players are kids aged 10-13 and adults, so the music follows the
same rules as the artwork: **warm, gentle and family-friendly**. In prompts,
lead with **steampunk** (Victorian brass and clockwork). The word "whimsical"
made Suno's results come out wrong, so don't use it. It's background music:
soft, steady, never pushy. Moods can change from chapter to chapter, but only gently: curious,
sneaky-playful, busy, wistful, magical. Never scary, aggressive or warlike.

Right now the game plays only `rising-dread` from Chapter 2 onwards. These
tracks replace that.

## Rules for every track

The artwork went wrong when war images turned realistic and harsh. The music
equivalents are war drums, horror drones, dissonance and big hits. Every prompt
below avoids them:

- **Soft dynamics.** No sudden loud hits, drops or big crescendos.
- **Gentle percussion.** Brushes, light hand drums, shakers, pizzicato. No timpani or war drums.
- **Melody stays in the background.** Nothing should compete with reading a card.
- **Even "uneasy" tracks stay friendly.** Think "a puzzle to solve", not "danger".
- **No artist or game names** in prompts (Suno rejects them).

## How to make each track in Suno

1. Use **Custom** mode and switch **Instrumental** on.
2. Paste the **Style** text into "Style of Music".
3. Paste the shared **Exclude** text into "Exclude styles" (under More Options).
4. Use the **Title** as the song title, so the download is easy to find.
5. Suno gives two versions. Keep the one that sounds calmest and most even all
   the way through. Skip any version with a big build, a sudden ending or a loud
   section. Aim for 2-3 minutes.
6. Download as MP3 and save it in that chapter's folder under `src/assets/music/`
   (for example `src/assets/music/chapter2/`). Any file name works.

**Exclude** (use on every track):

```
vocals, singing, lyrics, spoken word, aggressive, horror, scary, dark ambient, war drums, timpani, heavy percussion, distorted, dissonant, epic trailer, big drops, EDM, dubstep, rock, electric guitar, metal
```

**Shared base** (already included at the start of every Style below):

```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop
```

## Overview

Each chapter gets a **main** track for normal play and an **uneasy** track for
when things go badly (in debt, heat rising, a Colossus close). The uneasy track
is only slightly more thoughtful than the main one.

| Ch | Chapter | Main (mood) | Uneasy (mood) |
|----|---------|-------------|---------------|
| 1 | Merchant City | *(existing tracks)* | *(existing tracks)* |
| 2 | Underworld Rising | Sneaky-playful caper in lantern-lit streets | Tiptoeing mystery |
| 3 | Warfare & Conflict | Busy camp and supply wagons, light parade feel | Worried waiting at the town gate |
| 4 | Banking & Finance | Elegant clockwork, music box, grand bank hall | Busy ticking, curious number puzzle |
| 5 | Plague & Decay | Caring and hopeful, a healer's herb garden | Quiet foggy morning, wistful |
| 6 | Betrayal | Whispering court, light intrigue | Puzzling mystery, who can you trust |
| 7 | Transcendence | Magical starlight wonder | Shimmering magic mirror, a little grand |
| - | Colossus encounter | `danger-imminent.mp3`: a fairy-tale giant appears, dramatic but friendly | |
| - | Colossus defeated | `victory-celebration.mp3`: warm, gentle fanfare | |

The last two files are listed in the game but have never existed. These
prompts replace the older, harsher ones in `scripts/suno-additional-music.md`.

---

## Chapter 2: Underworld Rising

### chapter2/ch2-main.mp3
**Title:** Underworld Rising - Lantern Alleys

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, playful sneaky caper, lantern-lit evening streets, pizzicato strings, soft clarinet, brushed snare, light accordion, upright bass, light swing, cosy and mischievous, mid tempo
```

### chapter2/ch2-uneasy.mp3
**Title:** Underworld Rising - Tiptoe

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, tiptoeing mystery, curious and a little cautious, soft pizzicato, gentle bassoon, light woodblock ticks, quiet celesta notes, slow steady pace, storybook detective feel
```

---

## Chapter 3: Warfare & Conflict

Keep this one far from battle. The art shows busy camps, wagons and
quartermasters, so the music sounds like bustle and toy-soldier parades.

### chapter3/ch3-main.mp3
**Title:** Warfare - Supply Wagons

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, busy camp and rolling supply wagons, light toy-soldier parade feel, soft fife and flute, light snare with brushes, warm horns played softly, bouncy strings, cheerful and determined, mid tempo
```

### chapter3/ch3-uneasy.mp3
**Title:** Warfare - Waiting at the Gate

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, worried waiting, travellers at a town gate, soft low strings, gentle oboe melody, quiet hand drum, warm acoustic guitar, thoughtful and hopeful, slow tempo
```

---

## Chapter 4: Banking & Finance

### chapter4/ch4-main.mp3
**Title:** Banking - The Grand Hall

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, elegant clockwork, grand bank hall with ledgers and gold coins, harpsichord, music box, soft ticking percussion, light waltz strings, refined and confident, major key, moderate tempo
```

### chapter4/ch4-uneasy.mp3
**Title:** Banking - Counting House Puzzle

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, busy ticking clockwork, a curious number puzzle, light harpsichord pattern, gentle music box, soft pizzicato, quiet woodwinds, thinking music, moderate tempo
```

---

## Chapter 5: Plague & Decay

Make this chapter about caring and helping, not sickness.

### chapter5/ch5-main.mp3
**Title:** Healers - Herb Garden

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, caring and hopeful, a healer's herb garden and candlelit apothecary, soft harp, gentle cello, warm flute, light piano, tender and comforting, slow tempo
```

### chapter5/ch5-uneasy.mp3
**Title:** Healers - Foggy Morning

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, quiet foggy morning in a sleepy town, wistful and calm, soft strings, gentle piano, distant soft bell, warm clarinet, reflective, slow tempo
```

---

## Chapter 6: Betrayal

### chapter6/ch6-main.mp3
**Title:** Betrayal - Whispering Court

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, light courtly intrigue, nobles whispering behind fans, lute, harpsichord, soft string quartet, sly woodwinds, elegant and mysterious, moderate tempo
```

### chapter6/ch6-uneasy.mp3
**Title:** Betrayal - Who to Trust

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, puzzling mystery, figuring out who to trust, soft pizzicato, gentle clarinet, quiet harpsichord, light woodblock, curious storybook detective mood, slow steady pace
```

---

## Chapter 7: Transcendence

### chapter7/ch7-main.mp3
**Title:** Transcendence - Starlight

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, magical wonder, starlight over the city, shimmering celesta, glass harmonica, soft strings, airy pads, dreamy and awe-filled, slow tempo
```

### chapter7/ch7-uneasy.mp3
**Title:** Transcendence - The Magic Mirror

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, mysterious magic mirror, shimmering and a little grand, music box, celesta, soft wordless pads, gentle harp, slowly swelling strings that stay soft, curious and enchanted, slow tempo
```

---

## Colossus encounter and victory

### colossus/danger-imminent.mp3
**Title:** A Colossus Appears

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, a fairy-tale giant appears, dramatic but friendly, steady low strings, soft horns, light hand drums, brave little melody on flute, adventurous and suspenseful like a storybook, moderate tempo
```

### colossus/victory-celebration.mp3
**Title:** Colossus Defeated

**Style:**
```
gentle steampunk background music for a fantasy merchant game, Victorian brass and clockwork, instrumental, soft and warm, low intensity, seamless loop, warm celebration, a gentle fanfare, soft brass, bright strings, glockenspiel, light tambourine, joyful and proud, major key, moderate tempo
```

---

## After downloading

Drop each MP3 into its chapter's folder. Every track in a folder joins that
chapter's playlist automatically (see `src/ui/music.ts`), and any file name
works:

```
src/assets/music/
  chapter1/   the original tracks
  chapter2/ ... chapter7/
```

**How the music plays:**
- Each chapter's tracks play one after another, then loop.
- The music only changes when a new chapter starts (after a Colossus), with a
  slow fade out and in.
- Chapter 1 opens with `optimistic-venture`.
- If a chapter's folder is empty, Chapter 1's music plays.
- There's no separate Colossus music. The encounter is only a few cards, and
  switching there and back would change the music too quickly.

Keep each file under about 4 MB (the existing tracks are about 3.4 MB).

Also listen again to `chapter1/rising-dread.mp3` and `chapter1/dark-reckoning.mp3`.
They were made from "ominous" and "dark" prompts and play in Chapter 1's
rotation. If they sound harsh, remove them or remake them with the Chapter 2
uneasy style.
