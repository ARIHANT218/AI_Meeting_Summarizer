#!/bin/bash
set -e

echo "🚀 Starting optimized build process..."

# Clear npm cache to free memory
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Install only production dependencies for server
echo "📦 Installing server dependencies..."
npm install --production --no-optional --no-audit --no-fund

# Install only production dependencies for client
echo "📦 Installing client dependencies..."
cd client
npm install --production --no-optional --no-audit --no-fund

# Build client with memory optimization
echo "🔨 Building React app..."
export NODE_OPTIONS="--max-old-space-size=512"
npm run build

echo "✅ Build completed successfully!" 