# Railway Deployment Guide

## Quick Setup (5 minutes)

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2. Deploy Your App
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your `ArtisanAura` repository
- Railway will automatically detect it's a Node.js app

### 3. Set Environment Variables
In Railway dashboard, go to your project → Variables tab:
```
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
```

### 4. Deploy!
- Railway will automatically build and deploy
- You'll get a URL like: `https://your-app-name.railway.app`

## What Railway Does Automatically
- ✅ Detects Node.js app
- ✅ Runs `npm install`
- ✅ Runs `npm run build` 
- ✅ Runs `npm start`
- ✅ Provides HTTPS
- ✅ Handles environment variables
- ✅ Auto-deploys on git push

## No Complex Configuration Needed!
Unlike Vercel, Railway handles full-stack apps automatically.
