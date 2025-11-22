import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { llmClient, LLMCapability } from './llmClient';
import { azureOpenAI } from './azureOpenAI';
import { claudeService } from './claudeService';

// Mock dependencies
vi.mock('./azureOpenAI', () => ({
  azureOpenAI: {
    chat: vi.fn(),
  },
}));

vi.mock('./claudeService', () => ({
  claudeService: {
    chat: vi.fn(),
  },
}));

describe('llmClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generate', () => {
    it('should try providers in sequence until one succeeds', async () => {
      // Mock all providers failing except Azure OpenAI
      (claudeService.chat as any).mockRejectedValue(new Error('Claude error'));
      (azureOpenAI.chat as any).mockResolvedValue('Azure OpenAI response');

      const result = await llmClient.generate({
        capability: LLMCapability.FieldAssistant,
        prompt: 'Test prompt',
      });

      expect(claudeService.chat).toHaveBeenCalled();
      expect(azureOpenAI.chat).toHaveBeenCalled();
      expect(result).toEqual({
        provider: 'azure-openai',
        output: 'Azure OpenAI response',
      });
    });

    it('should return from Claude if it succeeds first', async () => {
      // Mock Claude succeeding
      (claudeService.chat as any).mockResolvedValue('Claude response');
      
      const result = await llmClient.generate({
        capability: LLMCapability.FieldAssistant,
        prompt: 'Test prompt',
      });

      expect(claudeService.chat).toHaveBeenCalled();
      expect(azureOpenAI.chat).not.toHaveBeenCalled();
      expect(result).toEqual({
        provider: 'claude',
        output: 'Claude response',
      });
    });

    it('should return unknown provider if all providers fail', async () => {
      // Mock all providers failing
      (claudeService.chat as any).mockRejectedValue(new Error('Claude error'));
      (azureOpenAI.chat as any).mockRejectedValue(new Error('Azure error'));

      const result = await llmClient.generate({
        capability: LLMCapability.FieldAssistant,
        prompt: 'Test prompt',
      });

      expect(claudeService.chat).toHaveBeenCalled();
      expect(azureOpenAI.chat).toHaveBeenCalled();
      expect(result).toEqual({
        provider: 'unknown',
        output: null,
      });
    });
  });

  describe('assertCapability', () => {
    it('should return true for known capabilities', async () => {
      const result = await llmClient.assertCapability(LLMCapability.FieldAssistant);
      expect(result).toBe(true);
    });
  });
});
