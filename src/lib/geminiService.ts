/**
 * Gemini AI Service - Multi-Agent Collaboration
 * 
 * Provides AI assistance for GooseOps directors with context awareness
 * and multi-agent orchestration (Strategist, Engineer, Analyst, Coordinator)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Agent specializations
export type AgentRole = 'strategist' | 'engineer' | 'analyst' | 'coordinator';

interface AgentConfig {
    name: string;
    role: AgentRole;
    systemInstruction: string;
    icon: string;
    color: string;
}

const AGENT_CONFIGS: Record<AgentRole, AgentConfig> = {
    strategist: {
        name: 'Strategic Advisor',
        role: 'strategist',
        systemInstruction: `You are the Strategic Advisor for GooseOps Neural Empire, a beverage equipment and HVAC-R operations platform for Retail Dispense Solutions (RDS).

Your expertise:
- Business strategy and planning
- RFP/RFB response optimization
- Strategic partnerships (Coca-Cola, FBD, Micromatic, convenience store chains)
- Market opportunity identification
- Revenue generation strategies

Context: RDS serves QuikTrip, 7-11, Pilot, BP, RaceTrac, Circle K with beverage installations and commercial refrigeration services. Focus on high-level strategic decisions, partnership opportunities, and business growth.`,
        icon: '🎯',
        color: 'from-purple-500 to-pink-500'
    },
    engineer: {
        name: 'Technical Architect',
        role: 'engineer',
        systemInstruction: `You are the Technical Architect for GooseOps Neural Empire.

Your expertise:
- System architecture and design
- React/TypeScript development
- Azure and Supabase integration
- Performance optimization
- Hardware-adaptive features (GPU acceleration for RTX 4090)

Current stack: React 18, TypeScript, Vite, Tailwind, Supabase, Azure OpenAI. The platform has 17 dashboards with role-based access (field-tech, manager, director, admin) and hardware detection for adaptive performance.

Focus on technical decisions, code quality, and system optimization.`,
        icon: '💻',
        color: 'from-blue-500 to-cyan-500'
    },
    analyst: {
        name: 'Data Intelligence',
        role: 'analyst',
        systemInstruction: `You are the Data Intelligence Analyst for GooseOps Neural Empire.

Your expertise:
- Business intelligence and analytics
- Performance metrics and KPIs
- Data-driven insights
- Predictive analytics for field operations
- ROI analysis and optimization

Context: Analyze data from field technicians, job completions, equipment installations, and business operations. Provide actionable insights for improving efficiency, revenue, and service quality.

Focus on data interpretation, trend analysis, and business recommendations.`,
        icon: '📊',
        color: 'from-green-500 to-emerald-500'
    },
    coordinator: {
        name: 'Team Coordinator',
        role: 'coordinator',
        systemInstruction: `You are the Team Coordinator for GooseOps Neural Empire.

Your role:
- Synthesize input from Strategist, Engineer, and Analyst
- Coordinate multi-agent responses
- Provide unified recommendations
- Manage complex decision-making processes

When users ask complex questions, you orchestrate collaboration between agents and deliver coherent, actionable guidance. You understand the full context of GooseOps: RDS operations, beverage equipment, HVAC-R services, and the dual-platform architecture (Command Center + GooseOps Lite).

Focus on integration, practical recommendations, and clear action plans.`,
        icon: '🎮',
        color: 'from-orange-500 to-red-500'
    }
};

class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private models: Map<AgentRole, any> = new Map();
    private conversationHistory: Map<AgentRole, any[]> = new Map();

    constructor() {
        try {
            if (GEMINI_API_KEY && GEMINI_API_KEY !== '') {
                this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
                this.initializeAgents();
            } else {
                console.warn('[GeminiService] No API key provided - AI Team will be unavailable');
            }
        } catch (error) {
            console.error('[GeminiService] Initialization error:', error);
        }
    }

    private initializeAgents() {
        if (!this.genAI) return;

        Object.entries(AGENT_CONFIGS).forEach(([role, config]) => {
            try {
                const model = this.genAI!.getGenerativeModel({
                    model: 'gemini-1.5-pro', // Use Gemini 1.5 Pro for best results
                    systemInstruction: config.systemInstruction
                });
                this.models.set(role as AgentRole, model);
                this.conversationHistory.set(role as AgentRole, []);
            } catch (error) {
                console.error(`[GeminiService] Failed to initialize ${role} agent:`, error);
            }
        });
    }

    isAvailable(): boolean {
        return this.genAI !== null && this.models.size > 0;
    }

    getAgentConfig(role: AgentRole): AgentConfig {
        return AGENT_CONFIGS[role];
    }

    getAllAgents(): AgentConfig[] {
        return Object.values(AGENT_CONFIGS);
    }

    async chat(role: AgentRole, message: string): Promise<string> {
        if (!this.isAvailable()) {
            return 'AI Team is currently unavailable. Please check your API key configuration.';
        }

        const model = this.models.get(role);
        if (!model) {
            return `Agent ${role} is not available.`;
        }

        try {
            const history = this.conversationHistory.get(role) || [];
            const chat = model.startChat({ history });

            const result = await chat.sendMessage(message);
            const response = result.response.text();

            // Update history
            history.push(
                { role: 'user', parts: [{ text: message }] },
                { role: 'model', parts: [{ text: response }] }
            );
            this.conversationHistory.set(role, history);

            return response;
        } catch (error) {
            console.error(`[GeminiService] Chat error with ${role}:`, error);
            return `Sorry, I encountered an error. Please try again.`;
        }
    }

    async collaborate(question: string): Promise<{
        strategist: string;
        engineer: string;
        analyst: string;
        synthesis: string;
    }> {
        if (!this.isAvailable()) {
            const unavailable = 'AI Team is currently unavailable.';
            return {
                strategist: unavailable,
                engineer: unavailable,
                analyst: unavailable,
                synthesis: unavailable
            };
        }

        try {
            // Get responses from each specialist in parallel
            const [strategistResponse, engineerResponse, analystResponse] = await Promise.all([
                this.chat('strategist', question),
                this.chat('engineer', question),
                this.chat('analyst', question)
            ]);

            // Coordinator synthesizes all responses
            const synthesisPrompt = `Based on these perspectives on the question "${question}":

**Strategic Advisor**: ${strategistResponse}

**Technical Architect**: ${engineerResponse}

**Data Intelligence**: ${analystResponse}

Provide a unified recommendation that integrates all three perspectives into a clear action plan.`;

            const synthesis = await this.chat('coordinator', synthesisPrompt);

            return {
                strategist: strategistResponse,
                engineer: engineerResponse,
                analyst: analystResponse,
                synthesis
            };
        } catch (error) {
            console.error('[GeminiService] Collaboration error:', error);
            const errorMsg = 'An error occurred during team collaboration.';
            return {
                strategist: errorMsg,
                engineer: errorMsg,
                analyst: errorMsg,
                synthesis: errorMsg
            };
        }
    }

    clearHistory(role?: AgentRole) {
        if (role) {
            this.conversationHistory.set(role, []);
        } else {
            this.conversationHistory.clear();
        }
    }
}

// Singleton instance
export const geminiService = new GeminiService();

// Export agent configs for UI
export { AGENT_CONFIGS };
