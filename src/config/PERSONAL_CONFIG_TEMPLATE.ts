/**
 * PERSONAL CONFIGURATION TEMPLATE - SAMSUNG FOLD 7
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to: src/config/personal.config.ts
 * 2. Fill in YOUR actual API keys
 * 3. The personal.config.ts file is gitignored and will never be committed
 * 
 * This is for YOUR personal APK build only with all AI subscriptions baked in.
 */

export const PERSONAL_FOLD7_CONFIG = {
    // === YOUR AI SUBSCRIPTIONS ===

    // Claude Pro (Anthropic)
    CLAUDE_API_KEY: 'sk-ant-YOUR-CLAUDE-PRO-KEY-HERE',
    CLAUDE_MODEL: 'claude-3-opus-20240229',

    // Google Gemini 3.0 Pro
    GEMINI_API_KEY: 'YOUR-GEMINI-3-PRO-KEY-HERE',
    GEMINI_PROJECT_ID: 'YOUR-GOOGLE-CLOUD-PROJECT-ID',
    GEMINI_MODEL: 'gemini-3.0-pro',

    // Azure OpenAI
    AZURE_OPENAI_KEY: 'YOUR-AZURE-KEY-HERE',
    AZURE_OPENAI_ENDPOINT: 'https://api.openai.com/v1',
    AZURE_OPENAI_DEPLOYMENT: 'gpt-4',

    // === DEVICE CONFIGURATION ===
    DEVICE_ID: 'samsung-fold-7-jonathan-personal',
    DEVICE_NAME: 'Jonathan\'s Fold 7',

    // === FEATURE FLAGS (All enabled for your personal build) ===
    ENABLE_ALL_AI_MODELS: true,
    ENABLE_OFFLINE_MODE: true,
    ENABLE_VOICE_COMMANDS: true,
    ENABLE_VISION_ANALYSIS: true,
    ENABLE_DOCUMENT_PROCESSING: true,

    // === PERFORMANCE SETTINGS ===
    MAX_CONCURRENT_AI_REQUESTS: 3,
    CACHE_AI_RESPONSES: true,
    PRELOAD_MODELS: true,

    // === FOLD 7 SPECIFIC ===
    OPTIMIZE_FOR_FOLDABLE: true,
    DUAL_SCREEN_MODE: true,
    STYLUS_SUPPORT: true,

    // === BUILD INFO ===
    BUILD_TYPE: 'PERSONAL_FOLD7',
    VERSION: '1.0.0-fold7-personal',
};

export type PersonalConfig = typeof PERSONAL_FOLD7_CONFIG;
