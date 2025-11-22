import Anthropic from '@anthropic-ai/sdk';

export interface ClaudeConfig {
  apiKey: string;
  model: 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307';
  maxTokens: number;
  temperature: number;
}

export class ClaudeService {
  private config: ClaudeConfig;
  private client: Anthropic | null = null;
  private isAvailable: boolean = false;

  constructor(config: ClaudeConfig) {
    this.config = config;

    // Try to initialize, but gracefully handle browser environment or missing credentials
    try {
      if (!config.apiKey) {
        console.warn('[ClaudeService] Missing API key; running in disabled stub mode');
        this.isAvailable = false;
      } else {
        this.client = new Anthropic({
          apiKey: config.apiKey,
          dangerouslyAllowBrowser: false // Keep security enabled
        });
        this.isAvailable = true;
      }
    } catch (error) {
      console.warn('[ClaudeService] Failed to initialize (likely browser environment or missing credentials); running in disabled stub mode', error);
      this.isAvailable = false;
      this.client = null;
    }
  }

  async chat(messages: Array<{ role: 'user' | 'assistant', content: string }>): Promise<string | null> {
    if (!this.isAvailable || !this.client) {
      console.warn('[ClaudeService] Service not available - returning null');
      return null;
    }

    try {
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      return response.content[0]?.type === 'text' ? response.content[0].text : null;
    } catch (error) {
      console.error('Claude API Error:', error);
      return null;
    }
  }

  async analyzeComplexProblem(problem: string, context: any): Promise<{
    bigView: string;
    smallView: string;
    fiveStrikeAnalysis: string;
    recommendations: string[];
  }> {
    const prompt = `
Analyze this complex business problem with multiple perspectives:

PROBLEM: ${problem}
CONTEXT: ${JSON.stringify(context, null, 2)}

Provide analysis in these formats:

BIG VIEW (Strategic Overview):
- Market position and long-term implications
- Competitive landscape changes
- Growth opportunities and risks
- 3-5 year strategic recommendations

SMALL VIEW (Tactical Execution):
- Immediate actions required (next 30 days)
- Resource allocation needs
- Process improvements
- Quick wins and measurable outcomes

5-STRIKE ESCALATION ANALYSIS:
- Strike 1: Detection phase (what to monitor)
- Strike 2: Analysis phase (root cause identification)
- Strike 3: Escalation phase (when/who to notify)
- Strike 4: Intervention phase (emergency response)
- Strike 5: Lock-out phase (system protection)

STRATEGIC RECOMMENDATIONS:
- Priority-ordered action items
- Success metrics
- Risk mitigation strategies
- Timeline and milestones
`;

    const response = await this.chat([
      { role: 'user', content: prompt }
    ]);

    // Parse the response (simplified parsing)
    const sections = response?.split('\n## ') || [];
    return {
      bigView: sections.find(s => s.includes('BIG VIEW')) || 'Strategic analysis pending',
      smallView: sections.find(s => s.includes('SMALL VIEW')) || 'Tactical analysis pending',
      fiveStrikeAnalysis: sections.find(s => s.includes('5-STRIKE')) || 'Escalation analysis pending',
      recommendations: sections.find(s => s.includes('RECOMMENDATIONS'))?.split('\n- ') || []
    };
  }
}

// Safe initialization - won't crash the app
let claudeServiceInstance: ClaudeService;
try {
  claudeServiceInstance = new ClaudeService({
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY ?? '',
    model: 'claude-3-opus-20240229',
    maxTokens: 4096,
    temperature: 0.7
  });
} catch (error) {
  console.error('[ClaudeService] Failed to create service instance:', error);
  // Create a stub instance with no API key to prevent crashes
  claudeServiceInstance = new ClaudeService({
    apiKey: '',
    model: 'claude-3-opus-20240229',
    maxTokens: 4096,
    temperature: 0.7
  });
}

export const claudeService = claudeServiceInstance;