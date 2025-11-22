import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AIOrchestrationSystem } from './aiOrchestration';

// Mock dependencies
vi.mock('./aiSecurityProtocols', () => ({
  aiSecurityManager: {
    validateRequest: vi.fn().mockReturnValue(true),
  },
  encryptData: vi.fn().mockImplementation((data) => `encrypted:${data}`),
  validateDataInput: vi.fn().mockReturnValue({ isValid: true, errors: [] }),
  logSecurityEvent: vi.fn(),
}));

vi.mock('./claudeService', () => ({
  ClaudeService: vi.fn().mockImplementation(() => ({
    chat: vi.fn().mockResolvedValue(JSON.stringify({
      bigViewAnalysis: 'Strategic analysis test',
      smallViewAnalysis: 'Tactical analysis test',
      fiveStrikeEscalation: 'Escalation protocol test',
      recommendations: ['Recommendation 1', 'Recommendation 2'],
      confidence: 0.95
    })),
  })),
  claudeService: {
    chat: vi.fn().mockResolvedValue(JSON.stringify({
      bigViewAnalysis: 'Strategic analysis test',
      smallViewAnalysis: 'Tactical analysis test',
      fiveStrikeEscalation: 'Escalation protocol test',
      recommendations: ['Recommendation 1', 'Recommendation 2'],
      confidence: 0.95
    })),
  },
}));

vi.mock('./azureOpenAI', () => ({
  azureOpenAI: {
    chat: vi.fn().mockResolvedValue('Azure OpenAI response'),
  },
}));

describe('AIOrchestrationSystem', () => {
  let aiSystem: AIOrchestrationSystem;

  beforeEach(() => {
    aiSystem = new AIOrchestrationSystem({
      enableMultiAgent: true,
      enableLearning: true,
      enablePerformanceTracking: true,
      enableVoiceInterface: true,
      enableClaudeIntegration: true,
      enableRealTimeSync: true,
      maxResponseTime: 5000,
      minConfidenceThreshold: 0.7,
      fallbackStrategy: 'claude-fallback',
    });

    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('analyzeComplexProblem', () => {
    it('should use Claude when available', async () => {
      const result = await aiSystem.analyzeComplexProblem(
        'How can we optimize our supply chain?',
        { userRole: 'director' }
      );

      expect(result.bigViewAnalysis).toContain('Strategic analysis');
      expect(result.smallViewAnalysis).toContain('Tactical analysis');
      expect(result.fiveStrikeEscalation).toContain('Escalation protocol');
      expect(result.recommendations).toHaveLength(2);
      expect(result.confidence).toBeGreaterThan(0.9);
    });
  });

  describe('agent selection', () => {
    it('should have access to multiple AI agents', () => {
      const agents = aiSystem.getAgentStatus();
      expect(agents).toBeTruthy();
      expect(agents.length).toBeGreaterThan(1);
      expect(agents.some(agent => agent.name === 'Super ARES')).toBe(true);
    });

    it('should track agent performance metrics', () => {
      const metrics = aiSystem.getPerformanceMetrics();
      expect(metrics).toBeTruthy();
    });
  });
});
