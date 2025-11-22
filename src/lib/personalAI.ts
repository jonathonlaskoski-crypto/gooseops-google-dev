/**
 * Personal AI Service - Samsung Fold 7
 * 
 * Manages all AI sources:
 * 1. Claude Pro (Anthropic)
 * 2. Gemini 3.0 Pro (Google)
 * 3. Azure OpenAI (GPT-4)
 * 4. Microsoft Copilot (Free with M365)
 * 5. Local AI (Desktop RTX 4090 via remote)
 */

import { PERSONAL_FOLD7_CONFIG } from '@/config/personal.config';

export class PersonalAIService {

    // === CLAUDE PRO ===
    async queryClaude(prompt: string) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': PERSONAL_FOLD7_CONFIG.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: PERSONAL_FOLD7_CONFIG.CLAUDE_MODEL,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 4096,
            }),
        });
        return response.json();
    }

    // === GEMINI 3.0 PRO ===
    async queryGemini(prompt: string) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/${PERSONAL_FOLD7_CONFIG.GEMINI_MODEL}:generateContent?key=${PERSONAL_FOLD7_CONFIG.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );
        return response.json();
    }

    // === AZURE OPENAI (GPT-4) ===
    async queryAzureOpenAI(prompt: string) {
        const response = await fetch(PERSONAL_FOLD7_CONFIG.AZURE_OPENAI_ENDPOINT, {
            method: 'POST',
            headers: {
                'api-key': PERSONAL_FOLD7_CONFIG.AZURE_OPENAI_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                model: PERSONAL_FOLD7_CONFIG.AZURE_OPENAI_DEPLOYMENT,
            }),
        });
        return response.json();
    }

    // === MICROSOFT COPILOT (FREE WITH M365) ===
    async queryCopilot(prompt: string) {
        if (!PERSONAL_FOLD7_CONFIG.ENABLE_COPILOT) return null;

        const response = await fetch(PERSONAL_FOLD7_CONFIG.COPILOT_STUDIO_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: prompt,
                botId: PERSONAL_FOLD7_CONFIG.COPILOT_BOT_ID,
            }),
        });
        return response.json();
    }

    // === LOCAL AI (DESKTOP RTX 4090) ===
    async queryLocalAI(prompt: string, model?: string) {
        if (!PERSONAL_FOLD7_CONFIG.ENABLE_LOCAL_AI) return null;

        try {
            const response = await fetch(PERSONAL_FOLD7_CONFIG.LOCAL_AI_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    model: model || PERSONAL_FOLD7_CONFIG.LOCAL_AI_MODELS[0],
                    max_tokens: 2048,
                }),
                // Timeout for remote connection
                signal: AbortSignal.timeout(30000),
            });
            return response.json();
        } catch (error) {
            console.warn('Local AI unavailable (desktop offline?):', error);
            return null;
        }
    }

    // === SMART ROUTING ===
    async query(prompt: string, options?: {
        preferredModel?: 'claude' | 'gemini' | 'azure' | 'copilot' | 'local';
        fallback?: boolean;
    }) {
        const { preferredModel, fallback = true } = options || {};

        // Try preferred model first
        if (preferredModel) {
            try {
                switch (preferredModel) {
                    case 'claude': return await this.queryClaude(prompt);
                    case 'gemini': return await this.queryGemini(prompt);
                    case 'azure': return await this.queryAzureOpenAI(prompt);
                    case 'copilot': return await this.queryCopilot(prompt);
                    case 'local': return await this.queryLocalAI(prompt);
                }
            } catch (error) {
                if (!fallback) throw error;
                console.warn(`${preferredModel} failed, trying fallback...`);
            }
        }

        // Auto-select based on task type
        if (prompt.includes('code') || prompt.includes('debug')) {
            return this.queryClaude(prompt); // Claude best for code
        }
        if (prompt.includes('image') || prompt.includes('vision')) {
            return this.queryGemini(prompt); // Gemini has vision
        }
        if (prompt.includes('microsoft') || prompt.includes('office')) {
            return this.queryCopilot(prompt); // Copilot for M365
        }

        // Try local AI first (free, fast if desktop is on)
        const localResult = await this.queryLocalAI(prompt);
        if (localResult) return localResult;

        // Fallback to cloud AI
        return this.queryGemini(prompt); // Gemini as default
    }

    // === MULTI-AI CONSENSUS ===
    async queryAll(prompt: string) {
        const results = await Promise.allSettled([
            this.queryClaude(prompt),
            this.queryGemini(prompt),
            this.queryAzureOpenAI(prompt),
            this.queryCopilot(prompt),
            this.queryLocalAI(prompt),
        ]);

        return results
            .filter(r => r.status === 'fulfilled')
            .map((r: any) => r.value);
    }
}

export const personalAI = new PersonalAIService();
