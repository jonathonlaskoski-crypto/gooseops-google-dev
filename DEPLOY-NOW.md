# 🚀 Deploy GooseOps to Vercel - RIGHT NOW

## Step 1: Push to GitHub (5 minutes)

### Option A: GitHub CLI (if authenticated)
```bash
cd "C:\Users\jonat\OneDrive\6_PERSONAL\Desktop\dev locked downfor team\GooseOps-GoogleDev-Version"
gh auth login
gh repo create gooseops-google-dev --public --source=. --push
```

### Option B: Manual (recommended - always works)
1. Go to: https://github.com/new
2. Repository name: `gooseops-google-dev`
3. Make it **Public**
4. **Don't** initialize with README
5. Click **Create repository**

6. Run these commands:
```bash
cd "C:\Users\jonat\OneDrive\6_PERSONAL\Desktop\dev locked downfor team\GooseOps-GoogleDev-Version"
git remote add origin https://github.com/jonathonlaskoski-crypto/gooseops-google-dev.git
git push -u origin master
```

## Step 2: Deploy to Vercel (2 minutes)

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select `gooseops-google-dev`
4. Framework Preset: **Vite** (auto-detected)
5. Click "Deploy"

**That's it!** Your app will be live in ~2 minutes.

## Step 3: Add Environment Variables (after first deploy)

Go to: https://vercel.com/[your-project]/settings/environment-variables

Add these 4 variables:

```
VITE_GEMINI_API_KEY = AIzaSyBlNDZRCLq0C32qvb58YjfdTI0dOPulNa4
VITE_GEMINI_PROJECT_ID = gen-lang-client-0062485201
VITE_SUPABASE_URL = https://jhpxzcjdnurocjjmpisy.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocHh6Y2pkbnVyb2Nqam1waXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTc0MjEsImV4cCI6MjA3NjEzMzQyMX0.MSnx_RZwETXtFH-uGAuEU3Gg9UdB064Qdhq6UcU4gyI
```

Then redeploy: Settings > Deployments > Latest > ⋯ > Redeploy

## Your Live URLs

After deployment, you'll get:
- **Production**: `https://gooseops-google-dev.vercel.app`
- **Preview**: Automatic for every branch/PR

## ✅ Done!

No more localhost. No more gibber jabber. Just:
1. `git push`
2. Auto-deploys
3. Live in seconds

All your changes sync across devices. Gemini AI works everywhere.

---

**Total Time**: 7 minutes
**Cost**: $0 (Vercel free tier)
**Updates**: Automatic on every git push
