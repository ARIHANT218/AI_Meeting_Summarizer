# 🚀 Quick Deploy to Render

## ⚡ 5-Minute Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `ai-meeting-summarizer`
   - **Environment**: `Node`
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### 3. Set Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Deploy! 🎉
Click **"Create Web Service"** and wait for build.

Your app will be live at: `https://ai-meeting-summarizer.onrender.com`

---
**Need help?** See `DEPLOYMENT.md` for detailed instructions. 