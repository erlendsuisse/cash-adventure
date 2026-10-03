#!/bin/bash

# Cash Adventure - Image Generation Setup Script
# This script helps you set up automated background image generation

set -e

echo "🎬 Cash Adventure - Image Generation Setup"
echo "=========================================="
echo ""

# Check if API key is already set
if [ -z "$STABILITY_API_KEY" ]; then
    echo "❌ STABILITY_API_KEY not found"
    echo ""
    echo "Follow these steps:"
    echo "1. Go to: https://platform.stability.ai/"
    echo "2. Sign up (free tier included)"
    echo "3. Go to Account → API Keys"
    echo "4. Copy your API key"
    echo "5. Run this in your terminal:"
    echo ""
    echo "   export STABILITY_API_KEY=\"sk-your-key-here\""
    echo ""
    echo "Make it permanent by adding to ~/.zshrc:"
    echo "   echo 'export STABILITY_API_KEY=\"sk-your-key-here\"' >> ~/.zshrc"
    echo "   source ~/.zshrc"
    echo ""
    exit 1
else
    echo "✅ STABILITY_API_KEY is set"
fi

echo ""
echo "Checking dependencies..."

# Check if node-fetch is installed
if npm list node-fetch > /dev/null 2>&1; then
    echo "✅ node-fetch installed"
else
    echo "📦 Installing node-fetch..."
    npm install node-fetch
fi

# Check if sharp is installed (optional)
if npm list sharp > /dev/null 2>&1; then
    echo "✅ sharp installed (WebP conversion enabled)"
else
    echo "⚠️  sharp not installed (optional, for WebP compression)"
    echo "   Install it: npm install sharp"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Test with dry-run: npx ts-node scripts/generate-backgrounds.ts --dry-run"
echo "2. Generate images: npx ts-node scripts/generate-backgrounds.ts --cards prologue"
echo "3. Review images in: src/assets/backgrounds/images/"
echo "4. Build and test: npm run build && npm run dev"
echo ""
