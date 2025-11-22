import { ClaudeService } from './claudeService';

// Test script to verify Claude integration
async function testClaudeIntegration() {
  console.log('Testing Claude integration...');

  try {
    const claudeService = new ClaudeService({
      apiKey: import.meta.env.VITE_CLAUDE_API_KEY || 'test-key',
      model: 'claude-3-opus-20240229',
      maxTokens: 1000,
      temperature: 0.7
    });

    const testResponse = await claudeService.chat([
      { role: 'user', content: 'Hello, can you analyze a simple business problem?' }
    ]);

    if (testResponse) {
      console.log('✅ Claude integration working:', testResponse.substring(0, 100) + '...');
    } else {
      console.log('❌ Claude integration failed - no response');
    }
  } catch (error) {
    console.log('❌ Claude integration error:', error.message);
  }
}

// Test orchestration system
async function testOrchestration() {
  console.log('Testing AI orchestration...');

  try {
    const { AIOrchestrationSystem } = await import('./aiOrchestration');

    const orchestration = new AIOrchestrationSystem({
      enableMultiAgent: true,
      enableLearning: true,
      enablePerformanceTracking: true,
      enableVoiceInterface: true,
      enableRealTimeSync: true,
      enableClaudeIntegration: true,
      maxResponseTime: 30000,
      minConfidenceThreshold: 0.7,
      fallbackStrategy: 'claude-fallback'
    });

    const testProblem = 'How can we optimize beverage delivery routes?';
    const context = {
      userRole: 'director',
      missionIntelligence: true,
      enterpriseIntegrations: ['dataverse', 'dynamics'],
      aiCapabilities: ['predictive', 'ml']
    };

    const result = await orchestration.analyzeComplexProblem(testProblem, context);

    if (result && result.confidence > 0.5) {
      console.log('✅ Orchestration working - confidence:', result.confidence);
      console.log('Big View preview:', result.bigViewAnalysis.substring(0, 50) + '...');
    } else {
      console.log('❌ Orchestration failed or low confidence');
    }
  } catch (error) {
    console.log('❌ Orchestration error:', error.message);
  }
}

// Run tests
testClaudeIntegration();
testOrchestration();