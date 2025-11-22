# Personal APK Configuration

This directory contains the configuration for your **personal Samsung Fold 7 APK** with all your AI subscriptions baked in.

## Setup Instructions

1. **Copy the template:**
   ```bash
   copy PERSONAL_CONFIG_TEMPLATE.ts personal.config.ts
   ```

2. **Add your API keys** to `personal.config.ts`:
   - Claude Pro API key
   - Gemini 3.0 Pro API key
   - Azure OpenAI key (if different from .env)

3. **The `personal.config.ts` file is gitignored** - it will never be committed to version control.

## Security

⚠️ **NEVER commit `personal.config.ts` to git!**

This file contains your personal API keys and is only for your Samsung Fold 7 APK build.

## Build Process

When you build the APK with Capacitor, these keys will be baked into the app so you have:
- Full offline AI capabilities
- All 3 AI models (Claude, Gemini, Azure OpenAI) working simultaneously
- Optimizations for Samsung Fold 7 (dual screen, stylus, etc.)
