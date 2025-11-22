# Quick Install Guide - Samsung Fold 7 APK

## 🚗 You're Driving - Here's What to Do When Stopped

### Option 1: One-Click Script (Easiest)

When you're safely stopped, run this in PowerShell:

```powershell
.\build-fold7-apk.ps1
```

This will:
1. Build web assets
2. Sync to Android
3. Build APK
4. Auto-install on Fold 7 (if USB connected)

### Option 2: Manual Steps

If the script doesn't work:

1. **Build APK:**
   ```powershell
   npx cap open android
   ```
   Then in Android Studio: **Build → Build APK**

2. **Find APK:**
   `android\app\build\outputs\apk\debug\app-debug.apk`

3. **Install on Fold 7:**
   - Copy APK to phone
   - Open file manager
   - Tap APK to install

## 📱 What You'll Get

Your personal Gem AI app with:
- ✅ Claude Pro (your API key)
- ✅ Gemini 3.0 Pro (your API key)
- ✅ Azure OpenAI GPT-4
- ✅ Microsoft Copilot (FREE with M365)
- ✅ Local AI (RTX 4090 remote access)

## 🏠 Setting Up Local AI (Optional)

See `LOCAL_AI_SETUP.md` for instructions to use your desktop RTX 4090 from your Fold 7.

## ⚠️ Safety First

**Don't run commands while driving!** Pull over safely first.

## 🆘 Need Help?

If anything fails, just open Android Studio:
```powershell
npx cap open android
```

Then click the green "Run" button to build and install on your Fold 7.
