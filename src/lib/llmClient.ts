import { azureOpenAI } from './azureOpenAI'
import { claudeService } from './claudeService'

export enum LLMCapability {
  FieldAssistant = 'field-assistant',
  FieldVision = 'field-vision',
}

interface LLMRequest {
  capability: LLMCapability
  prompt: string
  imageBase64?: string
  context?: Record<string, unknown>
}

type LLMProvider = 'spark' | 'copilot' | 'claude' | 'azure-openai' | 'unknown'

async function trySparkLLM(prompt: string): Promise<string | null> {
  const spark = (window as unknown as { spark?: { llm?: (input: string) => Promise<string> } }).spark
  if (!spark?.llm) return null
  try {
    return await spark.llm(prompt)
  } catch (error) {
    console.warn('[LLM] Spark call failed, falling back', error)
    return null
  }
}

async function tryCopilotSDK(request: LLMRequest): Promise<string | null> {
  const copilot = (window as unknown as { copilot?: any }).copilot
  if (!copilot) return null

  try {
    if (request.capability === LLMCapability.FieldVision && copilot?.vision?.analyze) {
      const result = await copilot.vision.analyze({
        prompt: request.prompt,
        imageBase64: request.imageBase64,
        context: request.context,
      })
      return result?.analysis ?? null
    }

    if (copilot?.chat?.generateText) {
      const result = await copilot.chat.generateText({
        prompt: request.prompt,
        context: request.context,
      })
      return result?.text ?? null
    }
  } catch (error) {
    console.warn('[LLM] Copilot SDK call failed, falling back', error)
  }

  return null
}

async function tryClaude(request: LLMRequest): Promise<string | null> {
  try {
    if (request.capability === LLMCapability.FieldVision) {
      // Claude vision would require the Messages API with attachments; fall back.
      return null
    }

    return await claudeService.chat([
      { role: 'user', content: request.prompt },
    ])
  } catch (error) {
    console.warn('[LLM] Claude call failed, falling back', error)
    return null
  }
}

async function tryAzureOpenAI(request: LLMRequest): Promise<string | null> {
  try {
    const messages = [
      {
        role: 'system' as const,
        content:
          request.capability === LLMCapability.FieldVision
            ? 'You are a field-service vision assistant helping technicians analyze job-site photos.'
            : 'You are a field-service copilot providing concise, actionable guidance.',
      },
      {
        role: 'user' as const,
        content:
          request.capability === LLMCapability.FieldVision && request.imageBase64
            ? `${request.prompt}\nPhoto (base64): ${request.imageBase64}`
            : request.prompt,
      },
    ]

    return await azureOpenAI.chat(messages, 800)
  } catch (error) {
    console.error('[LLM] Azure OpenAI fallback failed', error)
    return null
  }
}

export interface LLMGenerateResult {
  provider: LLMProvider
  output: string | null
}

export const llmClient = {
  async generate(request: LLMRequest): Promise<LLMGenerateResult> {
    const sparkResult = await trySparkLLM(request.prompt)
    if (sparkResult) return { provider: 'spark', output: sparkResult }

    const copilotResult = await tryCopilotSDK(request)
    if (copilotResult) return { provider: 'copilot', output: copilotResult }

    const claudeResult = await tryClaude(request)
    if (claudeResult) return { provider: 'claude', output: claudeResult }

    const azureResult = await tryAzureOpenAI(request)
    if (azureResult) return { provider: 'azure-openai', output: azureResult }

    return { provider: 'unknown', output: null }
  },

  async assertCapability(capability: LLMCapability): Promise<boolean> {
    if (capability === LLMCapability.FieldVision) {
      const spark = (window as unknown as { spark?: { llm?: (input: string) => Promise<string> } }).spark
      if (spark?.llm) return true

      const copilot = (window as unknown as { copilot?: any }).copilot
      if (copilot?.vision?.analyze) return true
    }

    return true
  },
}


