#!/bin/bash

echo "🚀 AI Meeting Summarizer Deployment Script"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/username/repository-name.git"
    exit 1
fi

echo "✅ Git repository configured"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy to Render - $(date)"
git push origin main

echo "✅ Code pushed to GitHub"
echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://dashboard.render.com/"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Use these settings:"
echo "   - Name: ai-meeting-summarizer"
echo "   - Environment: Node"
echo "   - Build Command: npm run install-all && npm run build"
echo "   - Start Command: npm start"
echo "5. Set environment variables (see DEPLOYMENT.md)"
echo "6. Deploy!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 