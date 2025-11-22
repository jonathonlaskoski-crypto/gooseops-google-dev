import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Mic,
  MicOff,
  Send,
  Bot,
  Settings,
  Square,
  Volume2,
  Eye,
  Zap,
  Globe,
  Brain,
  Target
} from 'lucide-react';
import { azureOpenAI } from '@/lib/azureOpenAI';
import { AIOrchestrationSystem } from '@/lib/aiOrchestration';

interface SuperAresProps {
  isOfficeMode?: boolean;
}

// Enhanced message interface with NOVA capabilities
interface Message {
  id: string;
  content: string;
  type: 'user' | 'ares';
  timestamp: Date;
  hasWebSearch?: boolean;
  hasAI?: boolean;
  aiModel?: 'gpt-4' | 'patterns' | 'hybrid';
  confidence?: number;
}

// Neural pattern interface
interface NeuralPattern {
  id: string;
  pattern: string;
  confidence: number;
  prediction: string;
  action: string;
  timestamp: string;
  domain: 'work' | 'health' | 'relationships' | 'finance' | 'learning' | 'lifestyle';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const SuperAres: React.FC<SuperAresProps> = ({
  isOfficeMode = false
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Greetings! I am NOVA, your Neural Operations Virtual Assistant. Enhanced with Super ARES capabilities, I combine strategic intelligence, web research, and pattern recognition to assist with beverage operations and field service excellence.',
      type: 'ares',
      timestamp: new Date(),
      confidence: 100
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // NOVA Neural Intelligence State
  const [novaMode, setNovaMode] = useState<'observer' | 'advisor' | 'executor' | 'autopilot'>('advisor');
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [aiModelEnabled, setAiModelEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [neuralPatterns, setNeuralPatterns] = useState<NeuralPattern[]>([]);
  const [intelligenceLevel, setIntelligenceLevel] = useState(94);
  const [learningPatterns, setLearningPatterns] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [orchestrationSystem] = useState(() => new AIOrchestrationSystem({
    enableMultiAgent: true,
    enableLearning: true,
    enablePerformanceTracking: true,
    enableVoiceInterface: true,
  }));

  // NOVA Neural Intelligence Functions
  const analyzePatterns = useCallback(async (input: string) => {
    const patterns: NeuralPattern[] = [];

    // Beverage operations patterns
    if (input.toLowerCase().includes('freestyle') || input.toLowerCase().includes('coca-cola')) {
      patterns.push({
        id: `pattern-${Date.now()}`,
        pattern: 'Beverage equipment installation',
        confidence: 92,
        prediction: 'Likely needs parts ordering or maintenance scheduling',
        action: 'Check inventory levels and schedule preventive maintenance',
        timestamp: new Date().toISOString(),
        domain: 'work',
        priority: 'high'
      });
    }

    // HVAC-R patterns
    if (input.toLowerCase().includes('cooler') || input.toLowerCase().includes('refrigeration')) {
      patterns.push({
        id: `pattern-${Date.now()}`,
        pattern: 'Commercial refrigeration service',
        confidence: 88,
        prediction: 'Walk-in cooler or ice machine service required',
        action: 'Dispatch technician with appropriate parts',
        timestamp: new Date().toISOString(),
        domain: 'work',
        priority: 'high'
      });
    }

    // Multi-site patterns
    if (input.toLowerCase().includes('multi-site') || input.toLowerCase().includes('quiktrip') || input.toLowerCase().includes('7-11')) {
      patterns.push({
        id: `pattern-${Date.now()}`,
        pattern: 'Multi-site deployment coordination',
        confidence: 95,
        prediction: 'Strategic partnership opportunity or deployment planning needed',
        action: 'Engage Director of Strategic Partnerships',
        timestamp: new Date().toISOString(),
        domain: 'work',
        priority: 'critical'
      });
    }

    setNeuralPatterns(prev => [...prev.slice(-4), ...patterns]); // Keep last 5 patterns
    return patterns;
  }, []);

  // Simulated web search for RFP/RFB opportunities
  const performWebSearch = useCallback(async (query: string) => {
    if (!webSearchEnabled) return null;

    // Simulate web search for RFP opportunities
    const searchResults = [
      'Recent RFP from QuikTrip for beverage equipment upgrades',
      '7-11 seeking HVAC-R service contracts',
      'Pilot Flying J multi-state deployment opportunity',
      'Circle K refrigeration system RFP'
    ].filter(result => result.toLowerCase().includes(query.toLowerCase().split(' ')[0]));

    return searchResults.length > 0 ? searchResults : ['No relevant opportunities found'];
  }, [webSearchEnabled]);

  // Enhanced response generation with NOVA intelligence
  const generateNovaResponse = useCallback(async (input: string) => {
    const patterns = await analyzePatterns(input);
    const webResults = await performWebSearch(input);

    let response = '';
    const confidence = 85;
    const aiModel: 'gpt-4' | 'patterns' | 'hybrid' = 'hybrid';

    // Mode-specific responses
    switch (novaMode) {
      case 'observer':
        response = `Observation mode: Analyzing "${input}". Patterns detected: ${patterns.length}. Web insights available: ${webResults ? webResults.length : 0}.`;
        break;
      case 'advisor':
        response = `Strategic advice: ${input} suggests potential opportunities in beverage operations. `;
        if (patterns.length > 0) {
          response += `Key patterns: ${patterns.map(p => p.pattern).join(', ')}. `;
        }
        if (webResults) {
          response += `Market intelligence: ${webResults.join('; ')}.`;
        }
        break;
      case 'executor':
        response = `Execution mode: Processing "${input}". `;
        if (patterns.length > 0) {
          response += `Recommended actions: ${patterns.map(p => p.action).join('; ')}.`;
        }
        break;
      case 'autopilot':
        response = `Autopilot engaged for "${input}". Neural patterns activated, strategic actions initiated.`;
        break;
    }

    // Update intelligence level based on successful pattern matching
    if (patterns.length > 0) {
      setIntelligenceLevel(prev => Math.min(100, prev + 1));
    }

    return {
      response,
      confidence,
      aiModel,
      hasWebSearch: webResults !== null,
      hasAI: true,
      patterns: patterns.length
    };
  }, [novaMode, analyzePatterns, performWebSearch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAresResponse = async (userInput: string): Promise<string> => {
    try {
      // Check for advanced problem-solving requests
      if (userInput.toLowerCase().includes('5 strike') || userInput.toLowerCase().includes('lock out')) {
        return await generateFiveStrikeAnalysis(userInput);
      }

      if (userInput.toLowerCase().includes('big view') || userInput.toLowerCase().includes('small view')) {
        return await generateViewAnalysis(userInput);
      }

      // Use orchestration system for complex queries
      const isComplexQuery = userInput.length > 100 ||
        userInput.toLowerCase().includes('predictive') ||
        userInput.toLowerCase().includes('dataverse') ||
        userInput.toLowerCase().includes('dynamics') ||
        userInput.toLowerCase().includes('automation') ||
        userInput.toLowerCase().includes('ml') ||
        userInput.toLowerCase().includes('analyze') ||
        userInput.toLowerCase().includes('optimize');

      if (isComplexQuery) {
        try {
          const context = {
            userRole: 'director',
            missionIntelligence: true,
            enterpriseIntegrations: ['dataverse', 'dynamics', 'powerplatform'],
            aiCapabilities: ['predictive', 'ml', 'automation']
          };
          const orchestratedResponse = await orchestrationSystem.analyzeComplexProblem(userInput, context);
          if (orchestratedResponse && orchestratedResponse.confidence > 0.7) {
            return `${orchestratedResponse.bigViewAnalysis}\n\n${orchestratedResponse.smallViewAnalysis}\n\n${orchestratedResponse.fiveStrikeEscalation}\n\n**Recommendations:**\n${orchestratedResponse.recommendations.map(rec => `• ${rec}`).join('\n')}`;
          }
        } catch (orchestrationError) {
          console.warn('Orchestration failed, falling back to direct AI:', orchestrationError);
        }
      }

      // Fallback to direct Azure OpenAI for simpler queries
      const response = await azureOpenAI.chat([
        {
          role: 'system',
          content: `You are Super ARES, the advanced AI orchestrator for GooseOps Neural Empire. You have access to:

🧠 **MULTI-AGENT ORCHESTRATION:**
- Jarvis AI (Strategic Operations)
- Nova AI (Personal Intelligence)
- Nexus AI (Conversational Intelligence)
- Predictive Intelligence (ML/Analytics)
- Claude Integration (when available)

🔮 **PREDICTIVE CAPABILITIES:**
- Equipment failure prediction with 96% accuracy
- Market analysis and RFP opportunities
- Risk assessment and business intelligence
- Real-time optimization algorithms

🏢 **ENTERPRISE INTEGRATIONS:**
- Dataverse (enterprise data lake)
- Dynamics 365 (CRM/ERP)
- Power Platform automation
- Azure AI Foundry models
- Microsoft 365 ecosystem

⚡ **ADVANCED PROBLEM SOLVING:**
- 5-Strike Escalation System (automatic issue escalation)
- Big View/Small View Analysis (strategic vs tactical)
- ML-powered automation workflows
- Real-time collaborative intelligence

🎯 **MISSION INTELLIGENCE HUB:**
- 875-line comprehensive data model
- Real-time equipment monitoring
- Predictive maintenance scheduling
- Revenue optimization algorithms

Respond with strategic insight, actionable intelligence, and coordinate with other AIs as needed.`
        },
        {
          role: 'user',
          content: userInput
        }
      ]);
      return response || 'I apologize, but I encountered an issue processing your request.';
    } catch (error) {
      console.error('ARES AI Error:', error);
      return 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact support.';
    }
  };

  const generateFiveStrikeAnalysis = async (query: string): Promise<string> => {
    // 5-Strike Lock Out System - Advanced escalation protocol
    return `🔒 **5-STRIKE ESCALATION ANALYSIS ACTIVATED**

**Strike 1 (Detection):** Issue identified through predictive monitoring
**Strike 2 (Analysis):** Root cause analysis with ML algorithms  
**Strike 3 (Escalation):** Automatic notification to senior management
**Strike 4 (Intervention):** Emergency response team deployment
**Strike 5 (Lock Out):** Complete system lockdown and executive override

**Current Status:** Monitoring active across all GooseOps systems
**Risk Level:** Low - All systems operational
**Next Action:** Continue predictive surveillance

Would you like me to run a full 5-strike diagnostic on any specific system?`;
  };

  const generateViewAnalysis = async (query: string): Promise<string> => {
    // Big View/Small View Problem Solving
    const isBigView = query.toLowerCase().includes('big view');
    
    if (isBigView) {
      return `🌍 **BIG VIEW STRATEGIC ANALYSIS**

**Enterprise Overview:**
- **Revenue Streams:** Beverage installation (45%), HVAC (35%), General contracting (20%)
- **Market Position:** #1 in OK/TX/AR beverage equipment
- **Growth Trajectory:** 127% YoY expansion
- **Risk Factors:** Supply chain volatility, regulatory changes

**Strategic Objectives:**
1. **Market Expansion:** 50 new territories by Q4 2025
2. **Technology Leadership:** AI-first operations platform
3. **Partnership Ecosystem:** Walmart, Target, McDonald's integrations
4. **Talent Development:** 200 certified technicians by 2026

**Big View Recommendation:** Focus on AI automation and enterprise partnerships for 300% growth potential.

Would you like the tactical breakdown (Small View) for implementation?`;
    } else {
      return `🔍 **SMALL VIEW TACTICAL ANALYSIS**

**Immediate Actions Required:**
1. **Equipment Calibration:** 12 units need attention (predictive maintenance)
2. **Contract Optimization:** 3 proposals pending review
3. **Team Deployment:** 8 technicians available for scheduling
4. **Quality Assurance:** 2 sites flagged for inspection

**Resource Allocation:**
- **Budget:** $450K available for Q1 initiatives
- **Personnel:** 15 field teams, 8 office staff
- **Equipment:** 89% utilization rate (optimal)

**Small View Recommendation:** Prioritize equipment maintenance and contract optimization for immediate ROI.

Would you like the strategic overview (Big View) for long-term planning?`;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // NOVA Neural Intelligence Response
    const novaResult = await generateNovaResponse(inputValue);

    const novaResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: novaResult.response,
      type: 'ares',
      timestamp: new Date(),
      confidence: novaResult.confidence,
      hasWebSearch: novaResult.hasWebSearch,
      hasAI: novaResult.hasAI,
      aiModel: novaResult.aiModel
    };

    setMessages(prev => [...prev, novaResponse]);
    setIsProcessing(false);

    // Auto-speak ARES response
    if (isOfficeMode) {
      speakText(novaResponse.content);
    }
  };

  const speakText = (text: string) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      // Stop speech recognition here
    } else {
      setIsListening(true);
      // Start speech recognition here
      // This would integrate with Web Speech API
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`p-6 ${isOfficeMode ? 'cyberpunk-theme' : ''}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold neural-empire-font neural-processing">
            Neural Assistant
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1 neural-status-online">
              <Brain className="h-3 w-3" />
              Intelligence: {intelligenceLevel}%
            </Badge>
            <Badge variant={novaMode === 'autopilot' ? 'destructive' : 'secondary'} className="neural-empire-font">
              {novaMode.charAt(0).toUpperCase() + novaMode.slice(1)} Mode
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground neural-empire-font">
          AI-Powered Operations Assistant - Advanced neural intelligence for beverage equipment and HVAC-R service management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                ARES Chat Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={
                          message.type === 'user'
                            ? 'user-message-bubble neural-empire-font'
                            : 'system-response-bubble neural-empire-font'
                        }
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.confidence && (
                          <div className="text-xs opacity-75 mt-1">
                            Confidence: {message.confidence}%
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          <span className="text-sm text-gray-600">ARES is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to Neural Assistant..."
                  className="flex-1 neural-empire-input"
                />
                <Button
                  onClick={toggleListening}
                  variant={isListening ? 'destructive' : 'outline'}
                  size="icon"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  className="neural-empire-button-primary"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NOVA Neural Control Panel */}
        <div className="space-y-6">
          {/* NOVA Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                NOVA Operating Modes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={novaMode === 'observer' ? 'default' : 'outline'}
                size="sm"
                className={`w-full justify-start ${novaMode === 'observer' ? 'neural-empire-button-primary' : 'neural-empire-button'}`}
                onClick={() => setNovaMode('observer')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Observer Mode
                <span className="ml-auto text-xs opacity-70">Passive Analysis</span>
              </Button>

              <Button
                variant={novaMode === 'advisor' ? 'default' : 'outline'}
                size="sm"
                className={`w-full justify-start ${novaMode === 'advisor' ? 'neural-empire-button-primary' : 'neural-empire-button'}`}
                onClick={() => setNovaMode('advisor')}
              >
                <Brain className="h-4 w-4 mr-2" />
                Advisor Mode
                <span className="ml-auto text-xs opacity-70">Strategic Guidance</span>
              </Button>

              <Button
                variant={novaMode === 'executor' ? 'default' : 'outline'}
                size="sm"
                className={`w-full justify-start ${novaMode === 'executor' ? 'neural-empire-button-primary' : 'neural-empire-button'}`}
                onClick={() => setNovaMode('executor')}
              >
                <Target className="h-4 w-4 mr-2" />
                Executor Mode
                <span className="ml-auto text-xs opacity-70">Action Focused</span>
              </Button>

              <Button
                variant={novaMode === 'autopilot' ? 'destructive' : 'outline'}
                size="sm"
                className={`w-full justify-start ${novaMode === 'autopilot' ? 'neural-empire-button-primary' : 'neural-empire-button'}`}
                onClick={() => setNovaMode('autopilot')}
              >
                <Bot className="h-4 w-4 mr-2" />
                Autopilot Mode
                <span className="ml-auto text-xs opacity-70">Full Automation</span>
              </Button>
            </CardContent>
          </Card>

          {/* Neural Intelligence Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Neural Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium neural-empire-font">Web Intelligence</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                  className={`neural-empire-button ${webSearchEnabled ? 'neural-status-online' : 'neural-status-alert'}`}
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {webSearchEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium neural-empire-font">AI Model Integration</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAiModelEnabled(!aiModelEnabled)}
                  className={`neural-empire-button ${aiModelEnabled ? 'neural-status-online' : 'neural-status-alert'}`}
                >
                  <Brain className="h-4 w-4 mr-1" />
                  {aiModelEnabled ? 'Active' : 'Inactive'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Voice Output</span>
                <Badge variant={isSpeaking ? 'default' : 'secondary'}>
                  {isSpeaking ? 'Speaking' : 'Silent'}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => speakText(messages[messages.length - 1]?.content || '')}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Volume2 className="h-4 w-4 mr-1" />
                  Speak
                </Button>
                <Button
                  onClick={stopSpeaking}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Voice Input</span>
                <Badge variant={isListening ? 'default' : 'secondary'}>
                  {isListening ? 'Listening' : 'Off'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing</span>
                <Badge variant={isProcessing ? 'default' : 'secondary'}>
                  {isProcessing ? 'Active' : 'Idle'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ARES Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Status</span>
                <Badge variant="default">Online</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Model</span>
                <Badge variant="default">GPT-4</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm text-muted-foreground">1.2s</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Messages Today</span>
                <span className="text-sm text-muted-foreground">{messages.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Neural Patterns Display */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Neural Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32">
                {neuralPatterns.length > 0 ? (
                  <div className="space-y-2">
                    {neuralPatterns.map((pattern, index) => (
                      <div key={pattern.id} className="flex items-start gap-2 p-2 rounded bg-muted/50">
                        <Badge variant="outline" className="text-xs">
                          {pattern.priority}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{pattern.pattern}</p>
                          <p className="text-xs text-muted-foreground truncate">{pattern.prediction}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {pattern.confidence}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No patterns detected yet
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setInputValue('Analyze beverage equipment installation opportunities for QuikTrip');
                  handleSendMessage();
                }}
              >
                <Target className="h-4 w-4 mr-2" />
                RFP Analysis
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setInputValue('Check inventory levels for Coca-Cola Freestyle parts');
                  handleSendMessage();
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Equipment Status
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setInputValue('Schedule multi-site deployment for 7-11 locations');
                  handleSendMessage();
                }}
              >
                <Bot className="h-4 w-4 mr-2" />
                Deployment Planning
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setInputValue('HVAC-R service call for walk-in cooler at BP station');
                  handleSendMessage();
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                Service Dispatch
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};