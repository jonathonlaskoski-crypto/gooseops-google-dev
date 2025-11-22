# GooseOps - Google Dev Version

Complete standalone deployment package for GooseOps Neural Empire with Gemini AI integration.

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/gooseops-google-dev)

### 1. One-Click Deploy
1. Click the button above
2. Connect your GitHub account
3. Deploy!

### 2. Environment Variables (Required)
Add these in Vercel dashboard under Settings > Environment Variables:

```bash
VITE_GEMINI_API_KEY=your-gemini-api-key-here
VITE_GEMINI_PROJECT_ID=your-project-id
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get your Gemini API key: https://aistudio.google.com/app/apikey

### 3. That's It!
Your app will be live at: `https://your-app.vercel.app`

## Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.template .env

# Add your API keys to .env

# Start dev server
npm run dev

# Open http://localhost:5173
```

## Features

✅ **Gemini AI Integration** - 4 specialized AI agents (Strategist, Engineer, Analyst, Coordinator)
✅ **Supabase Backend** - Real-time data and authentication
✅ **Azure OpenAI** - Additional AI capabilities
✅ **Mobile Ready** - PWA with Capacitor support
✅ **Multi-Dashboard** - 17+ role-based dashboards
✅ **Offline Support** - Works without internet

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini, Azure OpenAI
- **Backend**: Supabase
- **Deployment**: Vercel (recommended) or Azure Static Web Apps

## Project Structure

```
├── src/
│   ├── components/      # React components
│   ├── lib/            # Utilities and services
│   │   ├── geminiService.ts    # Gemini AI integration
│   │   ├── supabaseClient.ts   # Database client
│   │   └── llmClient.ts        # Multi-LLM support
│   └── App.tsx         # Main app
├── public/             # Static assets
├── scripts/            # Build and deploy scripts
└── vercel.json         # Vercel configuration

```

## Environment Variables

Create `.env` file with:

```bash
# Required
VITE_GEMINI_API_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Optional
VITE_AZURE_OPENAI_API_KEY=
VITE_GEMINI_PROJECT_ID=
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
```

## Deployment Options

### Vercel (Recommended)
- Automatic deployments on git push
- Built-in analytics
- Free SSL
- Global CDN

### Azure Static Web Apps
```bash
npm run build
# Deploy dist/ folder via Azure Portal
```

## Support

For issues or questions, check the documentation files:
- `OWNERS_MANUAL.md` - Complete user guide
- `ACTIVATION_PLAN.md` - Setup instructions
- `TECHNICAL_EVALUATION.md` - Architecture details

---

**Built for**: Retail Dispense Solutions (RDS)
**Version**: 2.0.0
**Last Updated**: November 2025
