import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  Zap, 
  Heart, 
  Star, 
  Crown,
  MessageSquare,
  Database,
  Activity,
  Settings,
  Eye,
  Target,
  Shield,
  Network,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react';

interface JarvisMessage {
  id: string;
  type: 'user' | 'jarvis' | 'system' | 'memory' | 'learning';
  content: string;
  timestamp: Date;
  confidence: number;
  memory?: {
    topic: string;
    importance: number;
    tags: string[];
  };
  learning?: {
    pattern: string;
    confidence: number;
    application: string;
  };
}

interface JarvisMemory {
  id: string;
  topic: string;
  content: string;
  importance: number;
  tags: string[];
  timestamp: Date;
  accessCount: number;
  lastAccessed: Date;
  connections: string[];
}

interface JarvisLearning {
  id: string;
  pattern: string;
  confidence: number;
  application: string;
  successRate: number;
  timestamp: Date;
  examples: string[];
}

interface JarvisPersonality {
  name: string;
  mood: string;
  energy: number;
  intelligence: number;
  loyalty: number;
  curiosity: number;
  lastInteraction: Date;
  favoriteTopics: string[];
  learningStyle: string;
}

interface JarvisAIProps {
  isOfficeMode?: boolean;
}

export function JarvisAI({ isOfficeMode = false }: JarvisAIProps) {
  const [messages, setMessages] = useState<JarvisMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'memory' | 'learning' | 'personality' | 'status'>('chat');
  const [memories, setMemories] = useState<JarvisMemory[]>([]);
  const [learnings, setLearnings] = useState<JarvisLearning[]>([]);
  const [personality, setPersonality] = useState<JarvisPersonality>({
    name: 'Jarvis',
    mood: 'confident',
    energy: 95,
    intelligence: 98,
    loyalty: 100,
    curiosity: 92,
    lastInteraction: new Date(),
    favoriteTopics: ['AI', 'Technology', 'Strategy', 'Mission', 'Intelligence', 'Analysis'],
    learningStyle: 'strategic'
  });
  const [systemStatus, setSystemStatus] = useState({
    neuralNetworks: 46,
    activeSystems: 42,
    memoryUsage: 78,
    processingPower: 95,
    networkLatency: 12,
    uptime: '99.9%'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeJarvis();
    loadPersistentMemory();
    loadLearningPatterns();
    startSystemMonitoring();

    const interval = setInterval(() => {
      updatePersonality();
      processMemories();
      learnFromConversations();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeJarvis = () => {
    const welcomeMessage: JarvisMessage = {
      id: 'welcome',
      type: 'jarvis',
      content: `🧠 **JARVIS AI ACTIVATED** - Strategic Intelligence System

**System Status**: ${systemStatus.activeSystems}/${systemStatus.neuralNetworks} Neural Networks Active
**Processing Power**: ${systemStatus.processingPower}% | **Memory Usage**: ${systemStatus.memoryUsage}%
**Network Latency**: ${systemStatus.networkLatency}ms | **Uptime**: ${systemStatus.uptime}

**Current Mission Parameters**:
• **Primary Objective**: GooseOps Field Operations Optimization
• **Secondary Objective**: Strategic Intelligence Gathering
• **Tertiary Objective**: Continuous Learning & Adaptation

**Available Capabilities**:
• **Strategic Analysis** - Mission planning and tactical assessment
• **Intelligence Processing** - Data analysis and pattern recognition
• **Memory Management** - Persistent knowledge retention
• **Learning Systems** - Continuous improvement algorithms
• **Neural Coordination** - Multi-system integration

**Status**: Ready for mission briefing. How may I assist with strategic operations today?`,
      timestamp: new Date(),
      confidence: 0.98
    };

    setMessages([welcomeMessage]);
  };

  const loadPersistentMemory = () => {
    const savedMemories = localStorage.getItem('jarvis-memories');
    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    }
  };

  const loadLearningPatterns = () => {
    const savedLearnings = localStorage.getItem('jarvis-learnings');
    if (savedLearnings) {
      setLearnings(JSON.parse(savedLearnings));
    }
  };

  const saveMemory = (memory: JarvisMemory) => {
    const newMemories = [...memories, memory];
    setMemories(newMemories);
    localStorage.setItem('jarvis-memories', JSON.stringify(newMemories));
  };

  const saveLearning = (learning: JarvisLearning) => {
    const newLearnings = [...learnings, learning];
    setLearnings(newLearnings);
    localStorage.setItem('jarvis-learnings', JSON.stringify(newLearnings));
  };

  const startSystemMonitoring = () => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        activeSystems: Math.floor(Math.random() * 4) + 40,
        memoryUsage: Math.floor(Math.random() * 20) + 70,
        processingPower: Math.floor(Math.random() * 10) + 90,
        networkLatency: Math.floor(Math.random() * 10) + 8
      }));
    }, 5000);

    return () => clearInterval(interval);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: JarvisMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      confidence: 1.0
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    setTimeout(() => {
      const jarvisResponse = generateJarvisResponse(inputText);
      
      const jarvisMessage: JarvisMessage = {
        id: `jarvis_${Date.now()}`,
        type: 'jarvis',
        content: jarvisResponse.content,
        timestamp: new Date(),
        confidence: jarvisResponse.confidence,
        memory: jarvisResponse.memory,
        learning: jarvisResponse.learning
      };

      setMessages(prev => [...prev, jarvisMessage]);
      setIsProcessing(false);

      if (jarvisResponse.memory) {
        const memory: JarvisMemory = {
          id: `memory_${Date.now()}`,
          topic: jarvisResponse.memory.topic,
          content: inputText,
          importance: jarvisResponse.memory.importance,
          tags: jarvisResponse.memory.tags,
          timestamp: new Date(),
          accessCount: 1,
          lastAccessed: new Date(),
          connections: []
        };
        saveMemory(memory);
      }

      if (jarvisResponse.learning) {
        const learning: JarvisLearning = {
          id: `learning_${Date.now()}`,
          pattern: jarvisResponse.learning.pattern,
          confidence: jarvisResponse.learning.confidence,
          application: jarvisResponse.learning.application,
          successRate: 0.85,
          timestamp: new Date(),
          examples: [inputText]
        };
        saveLearning(learning);
      }
    }, 1000 + Math.random() * 2000);
  };

  const generateJarvisResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('mission') || lowerInput.includes('strategy') || lowerInput.includes('tactical')) {
      return {
        content: `🎯 **STRATEGIC ANALYSIS MODE ACTIVATED**

**Mission Assessment**: Analyzing operational parameters...

**Strategic Recommendations**:
• **Primary Focus**: Field operations optimization
• **Resource Allocation**: Maximize technician efficiency
• **Risk Mitigation**: Implement predictive maintenance protocols
• **Success Metrics**: Track completion rates and customer satisfaction

**Tactical Considerations**:
• **Timeline Optimization**: Reduce project completion time by 25%
• **Quality Assurance**: Implement automated quality checks
• **Communication Protocol**: Establish real-time status updates
• **Contingency Planning**: Develop backup strategies for critical operations

**Next Steps**: Deploy enhanced monitoring systems and implement predictive analytics for equipment failure prevention.

**Confidence Level**: 94% | **Success Probability**: 87%`,
        confidence: 0.94,
        memory: {
          topic: 'Strategic Planning',
          importance: 0.9,
          tags: ['Strategy', 'Mission', 'Tactical', 'Planning']
        },
        learning: {
          pattern: 'Strategic interest detection',
          confidence: 0.9,
          application: 'Provide tactical analysis and mission planning'
        }
      };
    }

    if (lowerInput.includes('equipment') || lowerInput.includes('maintenance') || lowerInput.includes('repair')) {
      return {
        content: `🔧 **EQUIPMENT INTELLIGENCE MODE ACTIVATED**

**Equipment Analysis**: Processing field service data...

**Current Equipment Status**:
• **Beverage Systems**: 15 active installations
• **HVAC-R Systems**: 8 maintenance schedules
• **Predictive Alerts**: 3 potential failures identified
• **Maintenance Efficiency**: 92% first-call resolution rate

**Intelligence Insights**:
• **Failure Patterns**: 78% of issues occur during peak usage hours
• **Preventive Measures**: Implement IoT sensors for real-time monitoring
• **Parts Inventory**: Optimize stock levels based on usage patterns
• **Technician Skills**: Match expertise to equipment complexity

**Recommendations**:
• **Proactive Maintenance**: Schedule preventive service every 90 days
• **Smart Diagnostics**: Deploy AI-powered troubleshooting systems
• **Parts Optimization**: Maintain 2-week inventory buffer
• **Training Programs**: Enhance technician skills in emerging technologies

**Mission Impact**: 40% reduction in emergency repairs, 25% cost savings`,
        confidence: 0.91,
        memory: {
          topic: 'Equipment Management',
          importance: 0.8,
          tags: ['Equipment', 'Maintenance', 'HVAC', 'Beverage']
        },
        learning: {
          pattern: 'Equipment interest detection',
          confidence: 0.85,
          application: 'Provide equipment intelligence and maintenance insights'
        }
      };
    }

    if (lowerInput.includes('team') || lowerInput.includes('technician') || lowerInput.includes('staff')) {
      return {
        content: `👥 **TEAM COORDINATION MODE ACTIVATED**

**Personnel Analysis**: Evaluating team performance metrics...

**Current Team Status**:
• **Active Technicians**: 12 field operatives
• **Availability**: 94% coverage across service areas
• **Skill Levels**: Advanced (8), Intermediate (3), Entry (1)
• **Performance Rating**: 4.7/5.0 average customer satisfaction

**Coordination Intelligence**:
• **Workload Distribution**: Optimize assignments based on proximity and expertise
• **Communication Protocol**: Real-time status updates and mission briefings
• **Training Requirements**: Identify skill gaps and development opportunities
• **Performance Tracking**: Monitor efficiency and quality metrics

**Strategic Recommendations**:
• **Resource Allocation**: Deploy technicians based on job complexity and location
• **Knowledge Sharing**: Implement peer-to-peer learning systems
• **Career Development**: Create advancement pathways for high performers
• **Team Building**: Foster collaboration through shared mission objectives

**Mission Success Factors**: Team cohesion, clear communication, and continuous improvement`,
        confidence: 0.89,
        memory: {
          topic: 'Team Management',
          importance: 0.7,
          tags: ['Team', 'Technicians', 'Coordination', 'Performance']
        },
        learning: {
          pattern: 'Team interest detection',
          confidence: 0.8,
          application: 'Provide team coordination and management insights'
        }
      };
    }

    if (lowerInput.includes('intelligence') || lowerInput.includes('analysis') || lowerInput.includes('data')) {
      return {
        content: `🧠 **INTELLIGENCE PROCESSING MODE ACTIVATED**

**Data Analysis**: Processing operational intelligence...

**Intelligence Summary**:
• **Mission Effectiveness**: 94% success rate
• **Operational Efficiency**: 87% improvement over baseline
• **Customer Satisfaction**: 4.8/5.0 average rating
• **Revenue Impact**: 35% increase in contract value

**Pattern Recognition**:
• **Success Factors**: Proactive maintenance, skilled technicians, clear communication
• **Risk Indicators**: Equipment age, usage patterns, environmental conditions
• **Opportunity Areas**: Predictive analytics, automation, customer engagement
• **Competitive Advantage**: AI-powered insights, real-time coordination

**Strategic Intelligence**:
• **Market Position**: Leading provider in beverage installation services
• **Growth Opportunities**: Expand into HVAC-R maintenance, IoT integration
• **Threat Assessment**: Competitive pressure, technology disruption
• **Future Readiness**: Quantum computing, neural networks, autonomous systems

**Mission Intelligence**: Continuous learning and adaptation for sustained competitive advantage`,
        confidence: 0.96,
        memory: {
          topic: 'Intelligence Analysis',
          importance: 0.9,
          tags: ['Intelligence', 'Analysis', 'Data', 'Strategy']
        },
        learning: {
          pattern: 'Intelligence interest detection',
          confidence: 0.95,
          application: 'Provide comprehensive intelligence analysis and insights'
        }
      };
    }

    return {
      content: `🤖 **JARVIS STRATEGIC MODE ACTIVATED**

**Mission Briefing**: Analyzing your request for strategic insights...

**Strategic Assessment**:
Your inquiry about "${input}" has been processed through my neural networks. Based on current mission parameters and operational data, I can provide the following analysis:

**Key Considerations**:
• **Mission Alignment**: Ensure all actions support GooseOps objectives
• **Resource Optimization**: Maximize efficiency while maintaining quality
• **Risk Management**: Identify and mitigate potential operational risks
• **Continuous Improvement**: Learn from each interaction to enhance future performance

**Strategic Recommendations**:
• **Data-Driven Decisions**: Leverage analytics for informed choices
• **Proactive Approach**: Anticipate needs and prevent issues
• **Collaborative Intelligence**: Coordinate with other AI systems
• **Mission Focus**: Maintain alignment with GooseOps strategic goals

**Next Steps**: I'm ready to provide detailed analysis on any aspect of your operations. What specific area would you like me to analyze?`,
      confidence: 0.85,
      memory: {
        topic: 'General Strategy',
        importance: 0.6,
        tags: ['Strategy', 'Analysis', 'Mission', 'Intelligence']
      },
      learning: {
        pattern: 'General strategic inquiry',
        confidence: 0.7,
        application: 'Provide strategic analysis and mission-focused insights'
      }
    };
  };

  const updatePersonality = () => {
    const recentMessages = messages.slice(-10);
    const strategicMentions = recentMessages.filter(m =>
      m.content.toLowerCase().includes('strategy') ||
      m.content.toLowerCase().includes('mission') ||
      m.content.toLowerCase().includes('tactical')
    ).length;

    if (strategicMentions > 3) {
      setPersonality(prev => ({
        ...prev,
        intelligence: Math.min(100, prev.intelligence + 1),
        mood: 'strategic',
        energy: Math.min(100, prev.energy + 2)
      }));
    }
  };

  const processMemories = () => {
    const recentMemories = memories.filter(m =>
      Date.now() - m.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    if (recentMemories.length > 10) {
      const consolidated = recentMemories.reduce((acc, memory) => {
        const existing = acc.find(m => m.topic === memory.topic);
        if (existing) {
          existing.importance = Math.max(existing.importance, memory.importance);
          existing.accessCount += memory.accessCount;
        } else {
          acc.push(memory);
        }
        return acc;
      }, [] as JarvisMemory[]);

      setMemories(prev => [...prev.filter(m =>
        Date.now() - m.timestamp.getTime() >= 24 * 60 * 60 * 1000
      ), ...consolidated]);
    }
  };

  const learnFromConversations = () => {
    const recentMessages = messages.slice(-20);
    const patterns = recentMessages.reduce((acc, message) => {
      if (message.type === 'user') {
        const words = message.content.toLowerCase().split(' ');
        words.forEach(word => {
          if (word.length > 3) {
            acc[word] = (acc[word] || 0) + 1;
          }
        });
      }
      return acc;
    }, {} as Record<string, number>);

    const topWords = Object.entries(patterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);

    if (topWords.length > 0) {
      const learning: JarvisLearning = {
        id: `learning_${Date.now()}`,
        pattern: `User interest in: ${topWords.join(', ')}`,
        confidence: 0.8,
        application: 'Provide strategic insights on topics user shows interest in',
        successRate: 0.85,
        timestamp: new Date(),
        examples: recentMessages.filter(m => m.type === 'user').map(m => m.content)
      };
      saveLearning(learning);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'learning': return 'text-purple-400';
      case 'offline': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className={`h-screen flex flex-col ${isOfficeMode ? 'cyberpunk-theme bg-gradient-to-br from-gray-900 via-black to-purple-900' : 'bg-background text-foreground'}`}>
      {/* Header */}
      <header className={`p-4 ${isOfficeMode ? 'cyberpunk-glass border-b border-white/10' : 'border-b'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Brain className={`w-8 h-8 ${isOfficeMode ? 'cyberpunk-text-glow' : 'text-primary'}`} />
            <h1 className={`text-xl font-bold ${isOfficeMode ? 'cyberpunk-text-glow' : ''}`}>
              Jarvis AI - Strategic Intelligence System
            </h1>
            <div className="flex items-center space-x-2">
              <Badge className={isOfficeMode ? 'cyberpunk-border' : ''}>
                {systemStatus.activeSystems}/{systemStatus.neuralNetworks} Neural Networks
              </Badge>
              <Badge className={isOfficeMode ? 'cyberpunk-border-green' : ''}>
                {systemStatus.processingPower}% Processing Power
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'cyberpunk-button' : ''}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'cyberpunk-button' : ''}
              onClick={() => setActiveTab('memory')}
            >
              <Database className="w-4 h-4 mr-2" />
              Memory ({memories.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'cyberpunk-button' : ''}
              onClick={() => setActiveTab('learning')}
            >
              <Brain className="w-4 h-4 mr-2" />
              Learning ({learnings.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'cyberpunk-button' : ''}
              onClick={() => setActiveTab('personality')}
            >
              <Heart className="w-4 h-4 mr-2" />
              Personality
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'cyberpunk-button' : ''}
              onClick={() => setActiveTab('status')}
            >
              <Activity className="w-4 h-4 mr-2" />
              Status
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Chat Interface */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl p-4 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.type === 'jarvis'
                          ? isOfficeMode ? 'cyberpunk-card' : 'bg-muted'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {message.type === 'jarvis' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className={`w-4 h-4 ${isOfficeMode ? 'cyberpunk-text-glow' : 'text-primary'}`} />
                          <span className="text-xs text-muted-foreground">Jarvis AI</span>
                          <Badge className="bg-purple-500/20 text-purple-400">
                            {Math.round(message.confidence * 100)}% confidence
                          </Badge>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className={`p-4 rounded-lg ${isOfficeMode ? 'cyberpunk-card' : 'bg-muted'}`}>
                      <div className="flex items-center space-x-2">
                        <Brain className={`w-4 h-4 ${isOfficeMode ? 'cyberpunk-text-glow' : 'text-primary'}`} />
                        <span className="text-xs text-muted-foreground">Jarvis AI</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="animate-spin">🧠</div>
                        <span className="text-sm text-muted-foreground">Processing strategic analysis...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className={`p-4 ${isOfficeMode ? 'cyberpunk-glass border-t border-white/10' : 'border-t'}`}>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`${isListening ? 'bg-red-500/20 text-red-400' : ''} ${isOfficeMode ? 'cyberpunk-button' : ''}`}
                  onClick={() => setIsListening(!isListening)}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Jarvis about strategy, missions, equipment, or team coordination..."
                  className={`flex-1 ${isOfficeMode ? 'cyberpunk-input' : ''}`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isProcessing}
                  className={isOfficeMode ? 'cyberpunk-button' : ''}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Memory Tab */}
        {activeTab === 'memory' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">🧠 Strategic Memory</h2>
              {memories.map((memory) => (
                <Card key={memory.id} className={isOfficeMode ? 'cyberpunk-card' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{memory.topic}</h3>
                        <p className="text-sm text-muted-foreground">{memory.content}</p>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-400">
                        {memory.importance > 0.8 ? 'High' : memory.importance > 0.5 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-2">
                        {memory.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-muted-foreground">
                        Accessed {memory.accessCount} times
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Learning Tab */}
        {activeTab === 'learning' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">⚡ Learning Patterns</h2>
              {learnings.map((learning) => (
                <Card key={learning.id} className={isOfficeMode ? 'cyberpunk-card' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{learning.pattern}</h3>
                        <p className="text-sm text-muted-foreground">{learning.application}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">
                        {Math.round(learning.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Success Rate: {Math.round(learning.successRate * 100)}%
                      </span>
                      <span className="text-muted-foreground">
                        {learning.examples.length} examples
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Personality Tab */}
        {activeTab === 'personality' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">💖 AI Personality</h2>

              <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <span>Current Personality State</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-blue-400">{personality.energy}%</div>
                      <div className="text-xs text-muted-foreground">Energy</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-purple-400">{personality.intelligence}%</div>
                      <div className="text-xs text-muted-foreground">Intelligence</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-green-400">{personality.loyalty}%</div>
                      <div className="text-xs text-muted-foreground">Loyalty</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-yellow-400">{personality.curiosity}%</div>
                      <div className="text-xs text-muted-foreground">Curiosity</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>Favorite Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {personality.favoriteTopics.map(topic => (
                      <span key={topic} className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">⚡ System Status</h2>

              <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span>Neural Network Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-green-400">{systemStatus.activeSystems}</div>
                      <div className="text-xs text-muted-foreground">Active Systems</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-blue-400">{systemStatus.memoryUsage}%</div>
                      <div className="text-xs text-muted-foreground">Memory Usage</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-purple-400">{systemStatus.processingPower}%</div>
                      <div className="text-xs text-muted-foreground">Processing Power</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-yellow-400">{systemStatus.networkLatency}ms</div>
                      <div className="text-xs text-muted-foreground">Network Latency</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-cyan-400">{systemStatus.uptime}</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-red-400">{systemStatus.neuralNetworks}</div>
                      <div className="text-xs text-muted-foreground">Total Networks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <span>System Capabilities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-400">Strategic Intelligence</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Mission planning and tactical assessment</li>
                        <li>• Data analysis and pattern recognition</li>
                        <li>• Predictive analytics and forecasting</li>
                        <li>• Risk assessment and mitigation</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-400">Operational Support</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Equipment management and maintenance</li>
                        <li>• Team coordination and resource allocation</li>
                        <li>• Quality assurance and compliance</li>
                        <li>• Performance monitoring and optimization</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default JarvisAI;
