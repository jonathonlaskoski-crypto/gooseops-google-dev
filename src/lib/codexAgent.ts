// Codex Copilot Studio Bot integration (Microsoft 365 / Power Platform)
// Uses environment placeholders; ensure you set real API key in .env (never commit secrets).

interface CodexMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CodexResponse {
  messages: CodexMessage[];
  raw?: any;
}

const endpoint = import.meta.env.VITE_CODEX_COPILOT_ENDPOINT;
const apiVersion = import.meta.env.VITE_CODEX_COPILOT_API_VERSION || '2022-03-01-preview';
const botId = import.meta.env.VITE_CODEX_COPILOT_BOT_ID;
const apiKey = import.meta.env.VITE_CODEX_COPILOT_API_KEY; // ROTATE if exposed.

export async function sendCodexConversation(messages: CodexMessage[]): Promise<CodexResponse | null> {
  if (!endpoint || !apiKey || !botId) {
    console.warn('[CodexAgent] Missing configuration; set VITE_CODEX_* variables.');
    return null;
  }
  try {
    const url = `${endpoint}?api-version=${apiVersion}`;
    const payload = { messages: messages.map(m => ({ role: m.role, content: m.content })) };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.error('[CodexAgent] HTTP error', res.status, res.statusText);
      return null;
    }
    const data = await res.json();
    const assistantMsg: CodexMessage | undefined = data.messages?.find((m: any) => m.role === 'assistant');
    return { messages: assistantMsg ? [assistantMsg] : [], raw: data };
  } catch (e) {
    console.error('[CodexAgent] Request failed', e);
    return null;
  }
}

export async function quickCodexAsk(prompt: string) {
  return sendCodexConversation([{ role: 'user', content: prompt }]);
}
