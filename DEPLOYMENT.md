# Deployment Guide for AI Meeting Summarizer

## Deploying on Render

### Prerequisites
1. A Render account (free tier available)
2. A MongoDB database (MongoDB Atlas free tier recommended)
3. Google AI API key for Gemini
4. Gmail account for email functionality

### Step 1: Prepare Your MongoDB Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<database>` with your actual values

### Step 2: Get Google AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### Step 3: Set up Gmail for Email
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use this password in the EMAIL_PASS environment variable

### Step 4: Deploy on Render
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: ai-meeting-summarizer
   - **Environment**: Node
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 5: Set Environment Variables
In Render, add these environment variables:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
```

### Step 6: Deploy
1. Click "Create Web Service"
2. Wait for the build to complete
3. Your app will be available at: `https://your-app-name.onrender.com`

### Important Notes
- The free tier will spin down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds
- Make sure all environment variables are set correctly
- The app will automatically build the React client and serve it from the Node.js server

### Troubleshooting
- Check Render logs for build errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct
- Check that Google AI API key is valid 