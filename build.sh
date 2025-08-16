#!/bin/bash
set -e

echo "🚀 Starting ultra-memory-efficient build process..."

# Set memory limits
export NODE_OPTIONS="--max-old-space-size=512"
export NPM_CONFIG_CACHE="/tmp/.npm"

# Clear all caches
echo "🧹 Clearing all caches..."
npm cache clean --force
rm -rf node_modules
rm -rf client/node_modules
rm -rf client/build

# Install server dependencies (production only)
echo "📦 Installing server dependencies..."
npm install --production --no-optional --no-audit --no-fund --no-save

# Install client dependencies (production only)
echo "📦 Installing client dependencies..."
cd client
npm install --production --no-optional --no-audit --no-fund --no-save

# Build with memory optimization
echo " Building React app..."
export CI=false
export GENERATE_SOURCEMAP=false
npm run build

echo "✅ Build completed successfully!" 