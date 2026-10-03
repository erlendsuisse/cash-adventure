#!/bin/bash

# Generate adventure deck card images using Stability AI

set -e

API_KEY="${STABILITY_API_KEY}"
if [ -z "$API_KEY" ]; then
  echo "❌ STABILITY_API_KEY environment variable not set"
  exit 1
fi

BASE_URL="https://api.stability.ai/v2beta/stable-image/generate/ultra"
OUTPUT_DIR="public/backgrounds"

mkdir -p "$OUTPUT_DIR"

STYLE="Detailed realistic cartoon hand-painted digital art. Fantasy steampunk with Victorian architecture. Warm golds, earth browns, teal accents, candlelit oranges. Atmospheric with lanterns and dramatic lighting. Cinematic, immersive game art."

# Cards to generate: card_id|description
CARDS=(
  "temple_discovery|Explorer discovering ancient overgrown jungle temple. Stone ruins, vines, mysterious architecture. Adventure and danger. Torch light illuminating ancient symbols."
  "bandit_encounter|Dangerous bandits blocking forest road. Scarred leader stepping forward menacingly. Caravan defending itself. Tense confrontation. Weapons drawn."
  "mystery_murder|Investigation scene in guild hall. Dead merchant, clues scattered, detective examining evidence. Wealthy surroundings. Mystery and intrigue. Candlelit."
  "dragon_sighting|Dragon flying over mountain village and trade routes. People panicking below. Massive scale. Fire and smoke. Medieval city below."
  "treasure_map_quest|Drunk sailor showing crumpled treasure map in tavern. X marks spot on island. Skull symbols. Adventure waiting. Fortune to be found."
  "haunted_house|Grand abandoned manor on hillside. Mysterious lights in windows. Gothic architecture. Dark clouds overhead. Secrets hidden inside."
  "dragon_rider_ally|Mysterious rider on black dragon entering city gates. Crowd parting in awe. Dragon magnificent and powerful. Protective ally."
  "plague_cure|Healer in laboratory working on cure. Medical instruments, bottles, research. Desperate patients waiting outside. Hope and science."
  "ancient_tome|Elderly scholar displaying ancient book with prophecies. Glowing runes and symbols. Ancient knowledge. Wisdom and dread."
)

echo "⚔️  Generating ${#CARDS[@]} Adventure Card Backgrounds"
echo "=================================================="

SUCCESS=0

for card in "${CARDS[@]}"; do
  IFS='|' read -r card_id description <<< "$card"
  output_file="$OUTPUT_DIR/${card_id}.webp"

  if [ -f "$output_file" ]; then
    echo "✅ $card_id (already exists)"
    ((SUCCESS++))
    continue
  fi

  printf "📌 $card_id... "

  prompt="Scene: $description

Style: $STYLE

Create a 16:9 fantasy steampunk adventure scene matching this narrative."

  if curl -s -X POST "$BASE_URL" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Accept: image/*" \
    -F "prompt=$prompt" \
    -F "negative_prompt=blurry, low quality, distorted, ugly" \
    -F "aspect_ratio=16:9" \
    -F "output_format=webp" \
    -F "seed=0" \
    -o "$output_file" \
    --write-out "%{http_code}" | grep -q "^200$"; then
    echo "✅"
    ((SUCCESS++))
    sleep 2
  else
    echo "❌"
    rm -f "$output_file"
  fi
done

echo ""
echo "=================================================="
echo "✨ Generated $SUCCESS/${#CARDS[@]} backgrounds"
