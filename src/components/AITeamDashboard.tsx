/**
 * AI Team Dashboard - Multi-Agent Collaboration Interface
 * 
 * Provides directors with AI assistance from specialized agents:
 * - Strategic Advisor: Business strategy and partnerships
 * - Technical Architect: System architecture and development
 * - Data Intelligence: Analytics and insights
 * - Team Coordinator: Synthesizes all perspectives
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { geminiService, AGENT_CONFIGS, type AgentRole } from '@/lib/geminiService';
import { Brain, Sparkles, Users, Zap } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    agent?: AgentRole;
    timestamp: Date;
}

export function AITeamDashboard() {
    const [activeAgent, setActiveAgent] = useState<AgentRole>('coordinator');
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [collaborationActive, setCollaborationActive] = useState(false);

    const isAvailable = geminiService.isAvailable();

    const handleSingleAgentChat = async () => {
        if (!question.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: question,
            agent: activeAgent,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setQuestion('');
        setIsLoading(true);

        try {
            const response = await geminiService.chat(activeAgent, userMessage.content);

            const assistantMessage: Message = {
                role: 'assistant',
                content: response,
                agent: activeAgent,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('AI chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTeamCollaboration = async () => {
        if (!question.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: question,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setQuestion('');
        setIsLoading(true);
        setCollaborationActive(true);

        try {
            const collaboration = await geminiService.collaborate(userMessage.content);

            // Add each agent's response
            const responses: Message[] = [
                {
                    role: 'assistant',
                    content: collaboration.strategist,
                    agent: 'strategist',
                    timestamp: new Date()
                },
                {
                    role: 'assistant',
                    content: collaboration.engineer,
                    agent: 'engineer',
                    timestamp: new Date()
                },
                {
                    role: 'assistant',
                    content: collaboration.analyst,
                    agent: 'analyst',
                    timestamp: new Date()
                },
                {
                    role: 'assistant',
                    content: collaboration.synthesis,
                    agent: 'coordinator',
                    timestamp: new Date()
                }
            ];

            setMessages(prev => [...prev, ...responses]);
        } catch (error) {
            console.error('Team collaboration error:', error);
        } finally {
            setIsLoading(false);
            setCollaborationActive(false);
        }
    };

    const clearConversation = () => {
        setMessages([]);
        geminiService.clearHistory();
    };

    if (!isAvailable) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[600px]">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-6 w-6" />
                            AI Team Dashboard
                        </CardTitle>
                        <CardDescription>
                            Multi-agent AI collaboration for strategic decisions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-6 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-4">
                                The AI Team is currently unavailable. To enable AI assistance:
                            </p>
                            <ol className="text-sm space-y-2 list-decimal list-inside">
                                <li>Get your Gemini API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a></li>
                                <li>Add <code className="bg-background px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code> to your <code className="bg-background px-1 py-0.5 rounded">.env</code> file</li>
                                <li>Restart the development server</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Brain className="h-8 w-8" />
                        AI Team Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Multi-agent AI collaboration for strategic decision-making
                    </p>
                </div>
                <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Powered by Gemini
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agents Panel */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            AI Team Members
                        </CardTitle>
                        <CardDescription>
                            Select an agent or ask the whole team
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {geminiService.getAllAgents().map((agent) => (
                            <button
                                key={agent.role}
                                onClick={() => setActiveAgent(agent.role)}
                                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${activeAgent === agent.role
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{agent.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-semibold">{agent.name}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {agent.role === 'strategist' && 'Business strategy & partnerships'}
                                            {agent.role === 'engineer' && 'System architecture & development'}
                                            {agent.role === 'analyst' && 'Data insights & analytics'}
                                            {agent.role === 'coordinator' && 'Team orchestration & synthesis'}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Chat Interface */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                Consultation Room
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearConversation}
                                disabled={messages.length === 0}
                            >
                                Clear History
                            </Button>
                        </div>
                        <CardDescription>
                            Ask questions and get expert AI guidance
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Messages */}
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                {messages.length === 0 && (
                                    <div className="text-center text-muted-foreground py-12">
                                        <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Start a conversation with the AI team</p>
                                        <p className="text-sm mt-2">Ask about strategy, technical decisions, or data insights</p>
                                    </div>
                                )}

                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-lg p-4 ${message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                                }`}
                                        >
                                            {message.agent && message.role === 'assistant' && (
                                                <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                                                    <span>{AGENT_CONFIGS[message.agent].icon}</span>
                                                    <span>{AGENT_CONFIGS[message.agent].name}</span>
                                                </div>
                                            )}
                                            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                                            <div className="text-xs opacity-70 mt-2">
                                                {message.timestamp.toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted rounded-lg p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="animate-pulse">Thinking...</div>
                                                {collaborationActive && (
                                                    <Badge variant="secondary" className="gap-1">
                                                        <Users className="h-3 w-3" />
                                                        Full Team
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="space-y-2">
                            <Textarea
                                placeholder="Ask your question here..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSingleAgentChat();
                                    }
                                }}
                                rows={3}
                                disabled={isLoading}
                            />
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSingleAgentChat}
                                    disabled={!question.trim() || isLoading}
                                    className="flex-1"
                                >
                                    Ask {AGENT_CONFIGS[activeAgent].name}
                                </Button>
                                <Button
                                    onClick={handleTeamCollaboration}
                                    disabled={!question.trim() || isLoading}
                                    variant="secondary"
                                    className="flex-1 gap-2"
                                >
                                    <Zap className="h-4 w-4" />
                                    Ask Full Team
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Example Questions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Example Questions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                        "How can we optimize our RFP response process for QuikTrip installations?",
                        "What's the best architecture for scaling to 1000+ field technicians?",
                        "Analyze our job completion data and suggest performance improvements",
                        "Identify strategic partnership opportunities with beverage equipment manufacturers",
                        "How should we price bulk Coca-Cola Freestyle installations?",
                        "What ML models would improve our route optimization?",
                    ].map((example, index) => (
                        <button
                            key={index}
                            onClick={() => setQuestion(example)}
                            className="text-left p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-sm"
                            disabled={isLoading}
                        >
                            "{example}"
                        </button>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
