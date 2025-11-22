import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import {
  Brain,
  Activity,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Database,
  Lightbulb,
  Target,
  Heart,
  Crown,
  Eye,
  Cpu,
  Network,
  Users,
  BarChart3,
  Play,
  MessageSquare,
  TrendingUp,
  Settings
} from 'lucide-react';
import { aiOrchestration, AIAgent, AIOrchestrationRequest, AIOrchestrationResponse } from '@/lib/aiOrchestration';

interface AIOrchestrationDashboardProps {
  isOfficeMode?: boolean;
}

export function AIOrchestrationDashboard({ isOfficeMode = false }: AIOrchestrationDashboardProps) {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'performance' | 'collaboration' | 'settings'>('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<AIOrchestrationResponse | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    totalAgents: 5,
    activeAgents: 5,
    totalRequests: 0,
    averageResponseTime: 0,
    systemHealth: 98,
    uptime: '99.9%'
  });

  useEffect(() => {
    loadAgentStatus();
    startRealTimeUpdates();
  }, []);

  const loadAgentStatus = () => {
    const agentStatus = aiOrchestration.getAgentStatus();
    setAgents(agentStatus);
    
    // Update system status
    const activeCount = agentStatus.filter(agent => agent.status === 'active').length;
    const avgResponseTime = agentStatus.reduce((sum, agent) => sum + agent.performance.responseTime, 0) / agentStatus.length;
    
    setSystemStatus(prev => ({
      ...prev,
      activeAgents: activeCount,
      averageResponseTime: avgResponseTime
    }));
  };

  const startRealTimeUpdates = () => {
    const interval = setInterval(() => {
      loadAgentStatus();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  };

  const handleTestOrchestration = async () => {
    setIsProcessing(true);
    
    const testRequest: AIOrchestrationRequest = {
      id: `test_${Date.now()}`,
      type: 'collaborative',
      priority: 'medium',
      context: 'Testing AI orchestration system with multi-agent coordination',
      userIntent: 'Demonstrate coordinated AI response',
      requiredCapabilities: ['strategic_planning', 'conversational', 'orchestration'],
      timestamp: new Date(),
      userId: 'test-user',
      sessionId: 'test-session'
    };

    try {
      const response = await aiOrchestration.processRequest(testRequest);
      setLastResponse(response);
    } catch (error) {
      console.error('Orchestration test failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'jarvis': return <Target className="w-5 h-5" />;
      case 'nova': return <Heart className="w-5 h-5" />;
      case 'nexus': return <Brain className="w-5 h-5" />;
      case 'ares': return <Crown className="w-5 h-5" />;
      case 'predictive': return <Eye className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const getAgentColor = (agentId: string) => {
    switch (agentId) {
      case 'jarvis': return 'text-blue-400';
      case 'nova': return 'text-pink-400';
      case 'nexus': return 'text-cyan-400';
      case 'ares': return 'text-red-400';
      case 'predictive': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'standby': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`h-screen flex flex-col ${isOfficeMode ? 'cyberpunk-theme bg-gradient-to-br from-gray-900 via-black to-purple-900' : 'bg-background text-foreground'}`}>
      {/* Header */}
      <header className={`p-4 ${isOfficeMode ? 'cyberpunk-glass border-b border-white/10' : 'border-b'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Network className={`w-8 h-8 ${isOfficeMode ? 'cyberpunk-text-glow' : 'text-primary'}`} />
            <h1 className={`text-xl font-bold ${isOfficeMode ? 'cyberpunk-text-glow' : ''}`}>
              AI Orchestration Dashboard
            </h1>
            <div className="flex items-center space-x-2">
              <Badge className={isOfficeMode ? 'cyberpunk-border' : ''}>
                {systemStatus.activeAgents}/{systemStatus.totalAgents} Agents Active
              </Badge>
              <Badge className={isOfficeMode ? 'cyberpunk-border-green' : ''}>
                {systemStatus.systemHealth}% Health
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'cyberpunk-button' : ''}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'cyberpunk-button' : ''}
              onClick={() => setActiveTab('agents')}
            >
              <Users className="w-4 h-4 mr-2" />
              Agents
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'cyberpunk-button' : ''}
              onClick={() => setActiveTab('performance')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'cyberpunk-button' : ''}
              onClick={() => setActiveTab('collaboration')}
            >
              <Network className="w-4 h-4 mr-2" />
              Collaboration
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'cyberpunk-button' : ''}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full">
          <TabsContent value="overview" className="h-full p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* System Overview */}
              <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span>System Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                        <div className="text-2xl font-bold text-green-400">{systemStatus.activeAgents}</div>
                        <div className="text-xs text-muted-foreground">Active Agents</div>
                      </div>
                      <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                        <div className="text-2xl font-bold text-blue-400">{systemStatus.systemHealth}%</div>
                        <div className="text-xs text-muted-foreground">System Health</div>
                      </div>
                      <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                        <div className="text-2xl font-bold text-purple-400">{systemStatus.averageResponseTime.toFixed(1)}s</div>
                        <div className="text-xs text-muted-foreground">Avg Response</div>
                      </div>
                      <div className={`text-center p-4 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                        <div className="text-2xl font-bold text-yellow-400">{systemStatus.uptime}</div>
                        <div className="text-xs text-muted-foreground">Uptime</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>System Performance</span>
                        <span>{systemStatus.systemHealth}%</span>
                      </div>
                      <Progress value={systemStatus.systemHealth} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Status */}
              <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span>Agent Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agents.map((agent) => (
                      <div key={agent.id} className={`flex items-center justify-between p-3 ${isOfficeMode ? 'cyberpunk-glass' : 'bg-muted'} rounded-lg`}>
                        <div className="flex items-center space-x-3">
                          <div className={getAgentColor(agent.id)}>
                            {getAgentIcon(agent.id)}
                          </div>
                          <div>
                            <div className="font-semibold">{agent.name}</div>
                            <div className="text-xs text-muted-foreground">{agent.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(agent.status)} border-current`}>
                            {agent.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(agent.performance.accuracy * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Test Orchestration */}
              <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>Test Orchestration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Test the AI orchestration system with a sample request to see multi-agent coordination in action.
                    </p>
                    <Button
                      onClick={handleTestOrchestration}
                      disabled={isProcessing}
                      className={`w-full ${isOfficeMode ? 'cyberpunk-button' : ''}`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin mr-2">⚡</div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Test Orchestration
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Last Response */}
              {lastResponse && (
                <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-cyan-400" />
                      <span>Last Response</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Primary Agent:</strong> {lastResponse.primaryAgent}
                        </div>
                        <div className="text-sm">
                          <strong>Supporting Agents:</strong> {lastResponse.supportingAgents.join(', ')}
                        </div>
                        <div className="text-sm">
                          <strong>Confidence:</strong> {Math.round(lastResponse.confidence * 100)}%
                        </div>
                        <div className="text-sm">
                          <strong>Processing Time:</strong> {lastResponse.processingTime}ms
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                          {lastResponse.response}
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="agents" className="h-full p-4">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">AI Agents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <Card key={agent.id} className={isOfficeMode ? 'cyberpunk-card' : ''}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className={getAgentColor(agent.id)}>
                          {getAgentIcon(agent.id)}
                        </div>
                        <span>{agent.name}</span>
                        <Badge className={`${getStatusColor(agent.status)} border-current`}>
                          {agent.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Capabilities</h4>
                          <div className="flex flex-wrap gap-1">
                            {agent.capabilities.slice(0, 3).map(cap => (
                              <span key={cap} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                                {cap.replace('_', ' ')}
                              </span>
                            ))}
                            {agent.capabilities.length > 3 && (
                              <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                                +{agent.capabilities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Performance</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Accuracy</span>
                              <span>{Math.round(agent.performance.accuracy * 100)}%</span>
                            </div>
                            <Progress value={agent.performance.accuracy * 100} className="h-1" />
                            
                            <div className="flex justify-between text-xs">
                              <span>Response Time</span>
                              <span>{agent.performance.responseTime.toFixed(1)}s</span>
                            </div>
                            <Progress value={(1 - agent.performance.responseTime / 5) * 100} className="h-1" />
                            
                            <div className="flex justify-between text-xs">
                              <span>Mission Alignment</span>
                              <span>{Math.round(agent.performance.missionAlignment * 100)}%</span>
                            </div>
                            <Progress value={agent.performance.missionAlignment * 100} className="h-1" />
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          <div>Usage: {agent.usageCount} times</div>
                          <div>Last Used: {agent.lastUsed.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="h-full p-4">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Performance Metrics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                  <CardHeader>
                    <CardTitle>System Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Health</span>
                          <span>{systemStatus.systemHealth}%</span>
                        </div>
                        <Progress value={systemStatus.systemHealth} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average Response Time</span>
                          <span>{systemStatus.averageResponseTime.toFixed(1)}s</span>
                        </div>
                        <Progress value={(1 - systemStatus.averageResponseTime / 5) * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Agent Availability</span>
                          <span>{Math.round((systemStatus.activeAgents / systemStatus.totalAgents) * 100)}%</span>
                        </div>
                        <Progress value={(systemStatus.activeAgents / systemStatus.totalAgents) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                  <CardHeader>
                    <CardTitle>Agent Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {agents.map((agent) => (
                        <div key={agent.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{agent.name}</span>
                            <span>{Math.round(agent.performance.accuracy * 100)}%</span>
                          </div>
                          <Progress value={agent.performance.accuracy * 100} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collaboration" className="h-full p-4">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Real-Time Collaboration</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Network className="w-5 h-5 text-green-400" />
                      <span>Collaboration Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Real-Time Sync</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Multi-Agent Coordination</span>
                        <Badge className="bg-blue-500/20 text-blue-400">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Voice Interface</span>
                        <Badge className="bg-purple-500/20 text-purple-400">Ready</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Performance Tracking</span>
                        <Badge className="bg-yellow-500/20 text-yellow-400">Monitoring</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span>Active Sessions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">No active collaboration sessions</div>
                        <div className="text-xs text-muted-foreground mt-1">Start a session to enable real-time coordination</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="h-full p-4">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Orchestration Settings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Multi-Agent Mode</span>
                        <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Learning System</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Performance Tracking</span>
                        <Badge className="bg-green-500/20 text-green-400">Monitoring</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Voice Interface</span>
                        <Badge className="bg-green-500/20 text-green-400">Ready</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={isOfficeMode ? 'cyberpunk-card' : ''}>
                  <CardHeader>
                    <CardTitle>Performance Thresholds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Max Response Time</span>
                          <span>5.0s</span>
                        </div>
                        <Progress value={80} className="h-1" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Min Confidence</span>
                          <span>70%</span>
                        </div>
                        <Progress value={70} className="h-1" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Fallback Strategy</span>
                          <span>Hybrid</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default AIOrchestrationDashboard;
