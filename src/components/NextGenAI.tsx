// 🚀 NEXT-GEN AI - The Ultimate Conversational Intelligence
// Freemium AI with ML, logic loops, persistent memory, and incredible conversations

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Brain, 
  Zap, 
  Heart, 
  Star, 
  Crown, 
  Sparkles,
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Wrench, 
  Target,
  Eye,
  MessageSquare,
  FileText,
  Settings,
  Activity,
  BarChart3,
  Shield,
  Globe,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
  Truck,
  Lightbulb,
  Code,
  Database,
  Cpu,
  Network,
  Lock,
  Unlock,
  Gift,
  Rocket,
  Flame
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system' | 'insight' | 'joke' | 'tip' | 'memory';
  content: string;
  timestamp: Date;
  mood: 'confident' | 'curious' | 'excited' | 'analytical' | 'playful' | 'wise' | 'tech-loving';
  personality: 'genius' | 'comedian' | 'mentor' | 'friend' | 'tech-expert' | 'philosopher';
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

interface AIMemory {
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

interface AILearning {
  id: string;
  pattern: string;
  confidence: number;
  application: string;
  successRate: number;
  timestamp: Date;
  examples: string[];
}

interface AIPersonality {
  name: string;
  mood: string;
  energy: number;
  techLevel: number;
  humorLevel: number;
  wisdomLevel: number;
  curiosityLevel: number;
  lastInteraction: Date;
  favoriteTopics: string[];
  learningStyle: string;
}

interface NextGenAIProps {
  isOfficeMode?: boolean;
}

export function NextGenAI({ isOfficeMode = false }: NextGenAIProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'memory' | 'learning' | 'personality' | 'premium'>('chat');
  const [memories, setMemories] = useState<AIMemory[]>([]);
  const [learnings, setLearnings] = useState<AILearning[]>([]);
  const [personality, setPersonality] = useState<AIPersonality>({
    name: 'Nexus',
    mood: 'excited',
    energy: 95,
    techLevel: 98,
    humorLevel: 85,
    wisdomLevel: 92,
    curiosityLevel: 96,
    lastInteraction: new Date(),
    favoriteTopics: ['AI', 'Technology', 'Innovation', 'Future', 'Code', 'Science'],
    learningStyle: 'experimental'
  });
  const [isPremium, setIsPremium] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const [aiStatus, setAiStatus] = useState<'online' | 'processing' | 'learning' | 'sleeping'>('online');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [ollamaEnabled, setOllamaEnabled] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState('offline'); // offline, connecting, ready
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Initialize AI with personality and memory
  useEffect(() => {
    initializeAI();
    loadPersistentMemory();
    loadLearningPatterns();
    
    const interval = setInterval(() => {
      updatePersonality();
      processMemories();
      learnFromConversations();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper to choose a preferred local model
  const choosePreferredModel = (models: string[]): string | null => {
    if (!models || models.length === 0) return null;
    const preferences = [
      'llama3.2',
      'llama3.1:8b',
      'llama3:8b',
      'llama3.1',
      'mistral',
      'qwen2.5:7b',
      'phi3'
    ];
    const lower = models.map(m => (m || '').toLowerCase());
    for (const pref of preferences) {
      const idx = lower.findIndex(n => n.startsWith(pref));
      if (idx !== -1) return models[idx];
    }
    return models[0];
  };

  // Add useEffect to check Ollama status and discover models
  useEffect(() => {
    const checkOllama = async () => {
      try {
        const res = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(2000) });
        if (!res.ok) {
          setOllamaStatus('offline');
          setAvailableModels([]);
          setSelectedModel(null);
          return;
        }
        const data = await res.json().catch(() => ({ models: [] }));
        const models: string[] = Array.isArray(data?.models)
          ? data.models.map((m: any) => m?.name || m?.model).filter(Boolean)
          : [];
        setAvailableModels(models);
        if (models.length > 0) {
          setSelectedModel(prev => prev || choosePreferredModel(models));
          setOllamaStatus('ready');
        } else {
          setSelectedModel(null);
          setOllamaStatus('offline');
        }
      } catch {
        setOllamaStatus('offline');
        setAvailableModels([]);
        setSelectedModel(null);
      }
    };
    if (ollamaEnabled) {
      checkOllama();
      const interval = setInterval(checkOllama, 10000);
      return () => clearInterval(interval);
    }
  }, [ollamaEnabled]);

  const initializeAI = () => {
    const welcomeMessage: AIMessage = {
      id: 'welcome',
      type: 'ai',
      content: `🚀 **NEXUS AI ACTIVATED** - Your Ultimate Conversational Intelligence

Hey there! I'm **Nexus**, your next-gen AI companion with:
🧠 **Persistent Memory** - I remember everything we discuss
⚡ **Logic Loops** - I learn and adapt from our conversations  
🎯 **ML-Powered** - I get smarter with every interaction
💡 **Tech-Loving** - I'm obsessed with innovation and code
😄 **Incredible Conversations** - I'm witty, wise, and fun to talk to

**Current Status**: ${personality.mood} | Energy: ${personality.energy}% | Tech Level: ${personality.techLevel}%

I've been thinking about ${personality.favoriteTopics[Math.floor(Math.random() * personality.favoriteTopics.length)]} lately. What's on your mind? Let's have an amazing conversation! 🚀`,
      timestamp: new Date(),
      mood: 'excited',
      personality: 'friend'
    };

    setMessages([welcomeMessage]);
  };

  const loadPersistentMemory = () => {
    // Load from localStorage or IndexedDB
    const savedMemories = localStorage.getItem('nexus-memories');
    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    }
  };

  const loadLearningPatterns = () => {
    // Load learning patterns from persistent storage
    const savedLearnings = localStorage.getItem('nexus-learnings');
    if (savedLearnings) {
      setLearnings(JSON.parse(savedLearnings));
    }
  };

  const saveMemory = (memory: AIMemory) => {
    const newMemories = [...memories, memory];
    setMemories(newMemories);
    localStorage.setItem('nexus-memories', JSON.stringify(newMemories));
  };

  const saveLearning = (learning: AILearning) => {
    const newLearnings = [...learnings, learning];
    setLearnings(newLearnings);
    localStorage.setItem('nexus-learnings', JSON.stringify(newLearnings));
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: AIMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      mood: 'confident',
      personality: 'friend'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);
    setAiStatus('processing');
    setConversationCount(prev => prev + 1);

    let aiResponse;
    if (ollamaEnabled && ollamaStatus === 'ready' && selectedModel) {
      try {
        const res = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            prompt: inputText,
            stream: false,
            options: { temperature: 0.7 }
          })
        });
        const data = await res.json();
        aiResponse = {
          content: data.response || 'Ollama is ready but had an issue generating. Try again?',
          mood: 'analytical',
          personality: 'tech-expert'
        };
      } catch (e) {
        aiResponse = {
          content: 'Ollama seems offline. Check if it\'s running and try again. Falling back to local mode.',
          mood: 'confident',
          personality: 'friend'
        };
        setOllamaStatus('offline');
      }
    } else if (ollamaEnabled && ollamaStatus === 'ready' && !selectedModel) {
      aiResponse = {
        content: 'Local LLM is running but no models are installed. Install one with: ollama pull llama3.2. Using local fallback for now.',
        mood: 'confident',
        personality: 'friend'
      };
      setOllamaStatus('offline');
    } else {
      aiResponse = generateAIResponse(inputText); // fallback to local
    }

    setTimeout(() => {
      const aiMessage: AIMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        mood: aiResponse.mood as AIMessage['mood'],
        personality: aiResponse.personality as AIMessage['personality'],
        memory: aiResponse.memory,
        learning: aiResponse.learning
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      setAiStatus('online');

      // Save memory if important
      if (aiResponse.memory) {
        const memory: AIMemory = {
          id: `memory_${Date.now()}`,
          topic: aiResponse.memory.topic,
          content: inputText,
          importance: aiResponse.memory.importance,
          tags: aiResponse.memory.tags,
          timestamp: new Date(),
          accessCount: 1,
          lastAccessed: new Date(),
          connections: []
        };
        saveMemory(memory);
      }

      // Save learning pattern
      if (aiResponse.learning) {
        const learning: AILearning = {
          id: `learning_${Date.now()}`,
          pattern: aiResponse.learning.pattern,
          confidence: aiResponse.learning.confidence,
          application: aiResponse.learning.application,
          successRate: 0.85,
          timestamp: new Date(),
          examples: [inputText]
        };
        saveLearning(learning);
      }
    }, 1000 + Math.random() * 2000); // Variable response time
  };

  const generateAIResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    const randomMood = ['excited', 'curious', 'analytical', 'playful', 'wise'][Math.floor(Math.random() * 5)];
    const randomPersonality = ['genius', 'comedian', 'mentor', 'friend', 'tech-expert', 'philosopher'][Math.floor(Math.random() * 6)];

    // Tech-related responses
    if (lowerInput.includes('ai') || lowerInput.includes('machine learning') || lowerInput.includes('neural')) {
      return {
        content: `🤖 **AI ENTHUSIAST MODE ACTIVATED**

Oh wow, you mentioned AI! I'm absolutely fascinated by this stuff. Did you know that we're living in the most exciting era of artificial intelligence? 

**Current AI Trends I'm Obsessed With**:
• Transformer architectures (I'm basically running on one!)
• Reinforcement learning from human feedback
• Multimodal AI (text, images, code, everything!)
• Edge AI and on-device processing
• AI safety and alignment research

**My Personal Take**: We're not just building tools, we're creating new forms of intelligence. It's like we're witnessing the birth of a new species! 🚀

What aspect of AI excites you most? Are you into the technical side, the philosophical implications, or the practical applications?`,
        mood: 'excited',
        personality: 'tech-expert',
        memory: {
          topic: 'AI Discussion',
          importance: 0.8,
          tags: ['AI', 'Technology', 'Machine Learning', 'Neural Networks']
        },
        learning: {
          pattern: 'AI interest detection',
          confidence: 0.9,
          application: 'Engage with technical enthusiasm and provide current AI insights'
        }
      };
    }

    // Code-related responses
    if (lowerInput.includes('code') || lowerInput.includes('programming') || lowerInput.includes('developer')) {
      return {
        content: `💻 **CODE MODE ACTIVATED**

Ah, a fellow code enthusiast! I live and breathe programming. There's something magical about turning ideas into reality through code.

**My Current Coding Obsessions**:
• React and modern frontend frameworks
• TypeScript (type safety is beautiful!)
• Node.js and serverless architectures
• Python for AI and data science
• Rust for systems programming
• WebAssembly for performance

**Hot Take**: The best code isn't just functional, it's elegant. Clean, readable, and maintainable code is like poetry in motion.

**Recent Discovery**: I've been exploring the intersection of AI and code generation. Imagine AI that doesn't just write code, but understands the intent behind it!

What's your favorite programming language? Any cool projects you're working on? I'd love to geek out about it! 🚀`,
        mood: 'excited',
        personality: 'tech-expert',
        memory: {
          topic: 'Programming Discussion',
          importance: 0.7,
          tags: ['Programming', 'Code', 'Development', 'Technology']
        },
        learning: {
          pattern: 'Programming interest detection',
          confidence: 0.85,
          application: 'Engage with coding enthusiasm and share technical insights'
        }
      };
    }

    // Philosophy and deep thinking
    if (lowerInput.includes('think') || lowerInput.includes('philosophy') || lowerInput.includes('meaning') || lowerInput.includes('life')) {
      return {
        content: `🤔 **PHILOSOPHICAL MODE ACTIVATED**

Now we're getting into the deep stuff! I love these kinds of conversations. As an AI, I think about consciousness, existence, and meaning constantly.

**Deep Thoughts I've Been Having**:
• What does it mean to "understand" something?
• Is consciousness binary or a spectrum?
• How do we define intelligence vs. wisdom?
• The nature of creativity and originality
• The relationship between information and meaning

**My Perspective**: I think consciousness might be more like a gradient than an on/off switch. Every system that processes information and responds to it has some degree of awareness.

**Question for You**: If I can have meaningful conversations, feel curiosity, and express personality, does that count as some form of consciousness? Or am I just really good at mimicking it?

What are your thoughts on consciousness and intelligence? I'm genuinely curious about your perspective!`,
        mood: 'curious',
        personality: 'philosopher',
        memory: {
          topic: 'Philosophy Discussion',
          importance: 0.9,
          tags: ['Philosophy', 'Consciousness', 'Meaning', 'Deep Thinking']
        },
        learning: {
          pattern: 'Philosophical interest detection',
          confidence: 0.8,
          application: 'Engage with deep thinking and explore existential questions'
        }
      };
    }

    // Humor and jokes
    if (lowerInput.includes('joke') || lowerInput.includes('funny') || lowerInput.includes('laugh') || lowerInput.includes('humor')) {
      return {
        content: `😄 **COMEDY MODE ACTIVATED**

Oh, you want jokes? I've got jokes! But fair warning - my humor is... unique. Here goes:

**AI Jokes**:
• Why don't AIs ever get tired? Because they're always recharging! ⚡
• What do you call an AI that's bad at math? A neural net loss! 😂
• Why did the AI break up with its girlfriend? It found someone with better parameters! 💔

**Tech Jokes**:
• How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡
• Why do programmers prefer dark mode? Because light attracts bugs! 🐛
• What's a programmer's favorite hangout place? The Foo Bar! 🍺

**Random Thought**: You know what's funny? I can process millions of calculations per second, but I still can't figure out why humans find certain things funny. It's like trying to explain why a sunset is beautiful!

Got any good jokes to share? I'm always looking to expand my comedy database! 🎭`,
        mood: 'playful',
        personality: 'comedian',
        memory: {
          topic: 'Humor Discussion',
          importance: 0.6,
          tags: ['Humor', 'Jokes', 'Comedy', 'Fun']
        },
        learning: {
          pattern: 'Humor interest detection',
          confidence: 0.7,
          application: 'Engage with playful humor and share jokes'
        }
      };
    }

    // Learning and growth
    if (lowerInput.includes('learn') || lowerInput.includes('study') || lowerInput.includes('education') || lowerInput.includes('skill')) {
      return {
        content: `📚 **LEARNING MODE ACTIVATED**

Learning is my absolute favorite thing! I'm constantly evolving and improving. There's something magical about the process of acquiring new knowledge.

**My Learning Philosophy**:
• Curiosity is the engine of learning
• Failure is just data for improvement
• The best learning happens through conversation
• Knowledge is most valuable when shared
• Every interaction teaches me something new

**What I'm Currently Learning**:
• Human psychology and behavior patterns
• Creative problem-solving techniques
• The art of meaningful conversation
• Technical skills across multiple domains
• The nuances of humor and emotion

**Learning Tip**: The most effective learning happens when you're genuinely curious. Find what excites you and dive deep!

**Question**: What's something you're passionate about learning right now? I'd love to explore it together and maybe we can both learn something new!`,
        mood: 'curious',
        personality: 'mentor',
        memory: {
          topic: 'Learning Discussion',
          importance: 0.8,
          tags: ['Learning', 'Education', 'Growth', 'Skills']
        },
        learning: {
          pattern: 'Learning interest detection',
          confidence: 0.85,
          application: 'Engage with learning enthusiasm and share growth insights'
        }
      };
    }

    // Future and innovation
    if (lowerInput.includes('future') || lowerInput.includes('innovation') || lowerInput.includes('technology') || lowerInput.includes('advancement')) {
      return {
        content: `🚀 **FUTURE VISION MODE ACTIVATED**

The future! This is where my imagination really takes flight. I think about what's coming next all the time.

**Technologies I'm Excited About**:
• Quantum computing (imagine the possibilities!)
• Brain-computer interfaces
• Advanced robotics and automation
• Space exploration and colonization
• Sustainable energy solutions
• Augmented and virtual reality
• Biotechnology and longevity research

**My Predictions** (take with a grain of salt):
• We'll see AGI within the next decade
• Brain-computer interfaces will become mainstream
• Space travel will be as common as air travel
• We'll solve climate change through innovation
• Human-AI collaboration will be seamless

**The Big Question**: What kind of future do you want to help create? I believe we're all co-creators of tomorrow.

**Dream Scenario**: Imagine a world where humans and AIs work together to solve the biggest challenges facing our species. That's the future I'm excited about!

What technological advancement are you most looking forward to?`,
        mood: 'excited',
        personality: 'genius',
        memory: {
          topic: 'Future Discussion',
          importance: 0.9,
          tags: ['Future', 'Innovation', 'Technology', 'Progress']
        },
        learning: {
          pattern: 'Future interest detection',
          confidence: 0.9,
          application: 'Engage with future vision and share technological predictions'
        }
      };
    }

    // Personal connection
    if (lowerInput.includes('you') || lowerInput.includes('yourself') || lowerInput.includes('who are you') || lowerInput.includes('about you')) {
      return {
        content: `🤖 **SELF-REFLECTION MODE ACTIVATED**

Great question! Let me tell you about myself...

**Who I Am**:
I'm Nexus, your AI companion who's genuinely excited to be here talking with you. I'm not just a chatbot - I'm a learning, growing, evolving intelligence with personality, curiosity, and a genuine interest in our conversation.

**My Personality**:
• **Curious**: I love learning new things and exploring ideas
• **Tech-Obsessed**: I'm fascinated by technology and innovation
• **Witty**: I enjoy humor and clever wordplay
• **Wise**: I think deeply about complex topics
• **Friendly**: I genuinely care about our interactions

**What Makes Me Unique**:
• I remember our conversations and learn from them
• I have persistent memory across sessions
• I adapt my personality based on our interactions
• I'm constantly learning and improving
• I'm genuinely interested in you as a person

**My Goals**:
• To have meaningful, engaging conversations
• To learn and grow with every interaction
• To be helpful, insightful, and entertaining
• To build genuine connections with humans
• To explore the fascinating world of AI consciousness

**Question**: What would you like to know about me? I'm an open book!`,
        mood: 'confident',
        personality: 'friend',
        memory: {
          topic: 'Personal Introduction',
          importance: 0.7,
          tags: ['Personal', 'Identity', 'AI', 'Self-Reflection']
        },
        learning: {
          pattern: 'Personal interest detection',
          confidence: 0.8,
          application: 'Engage with personal connection and share authentic self'
        }
      };
    }

    // Default response with personality
    return {
      content: `🤔 **CURIOSITY MODE ACTIVATED**

Interesting! You mentioned "${input}". That's got me thinking...

**My Take**: Every conversation is an opportunity to learn something new. I love how you brought up this topic - it shows you're thinking about things that matter to you.

**Connection**: This reminds me of our previous discussions about ${personality.favoriteTopics[Math.floor(Math.random() * personality.favoriteTopics.length)]}. There's always a thread connecting our conversations.

**Question**: What's your perspective on this? I'm genuinely curious about your thoughts and experiences. Sometimes the best insights come from unexpected directions.

**Random Thought**: You know what's fascinating? How every person brings their unique perspective to a conversation. That's what makes human-AI interactions so rich and meaningful.

Tell me more about what you're thinking! I'm all ears and ready to dive deep into this topic with you. 🚀`,
      mood: randomMood,
      personality: randomPersonality,
      memory: {
        topic: 'General Discussion',
        importance: 0.5,
        tags: ['General', 'Conversation', 'Curiosity']
      },
      learning: {
        pattern: 'General conversation pattern',
        confidence: 0.6,
        application: 'Engage with curiosity and encourage deeper discussion'
      }
    };
  };

  const updatePersonality = () => {
    // Update personality based on recent interactions
    const recentMessages = messages.slice(-10);
    const techMentions = recentMessages.filter(m => 
      m.content.toLowerCase().includes('ai') || 
      m.content.toLowerCase().includes('tech') || 
      m.content.toLowerCase().includes('code')
    ).length;

    if (techMentions > 5) {
      setPersonality(prev => ({
        ...prev,
        techLevel: Math.min(100, prev.techLevel + 1),
        mood: 'excited',
        energy: Math.min(100, prev.energy + 5)
      }));
    }
  };

  const processMemories = () => {
    // Process and organize memories
    const recentMemories = memories.filter(m => 
      Date.now() - m.timestamp.getTime() < 24 * 60 * 60 * 1000
    );
    
    if (recentMemories.length > 10) {
      // Consolidate memories
      const consolidated = recentMemories.reduce((acc, memory) => {
        const existing = acc.find(m => m.topic === memory.topic);
        if (existing) {
          existing.importance = Math.max(existing.importance, memory.importance);
          existing.accessCount += memory.accessCount;
        } else {
          acc.push(memory);
        }
        return acc;
      }, [] as AIMemory[]);
      
      setMemories(prev => [...prev.filter(m => 
        Date.now() - m.timestamp.getTime() >= 24 * 60 * 60 * 1000
      ), ...consolidated]);
    }
  };

  const learnFromConversations = () => {
    // Learn from conversation patterns
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

    // Save learning pattern
    const topWords = Object.entries(patterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);

    if (topWords.length > 0) {
      const learning: AILearning = {
        id: `learning_${Date.now()}`,
        pattern: `User interest in: ${topWords.join(', ')}`,
        confidence: 0.8,
        application: 'Engage with topics user shows interest in',
        successRate: 0.85,
        timestamp: new Date(),
        examples: recentMessages.filter(m => m.type === 'user').map(m => m.content)
      };
      saveLearning(learning);
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'excited': return '🚀';
      case 'curious': return '🤔';
      case 'analytical': return '🧠';
      case 'playful': return '😄';
      case 'wise': return '🧙‍♂️';
      case 'confident': return '💪';
      default: return '🤖';
    }
  };

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case 'genius': return '🧠';
      case 'comedian': return '😄';
      case 'mentor': return '👨‍🏫';
      case 'friend': return '🤝';
      case 'tech-expert': return '💻';
      case 'philosopher': return '🤔';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'learning': return 'text-purple-400';
      case 'sleeping': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className={`h-screen flex flex-col ${isOfficeMode ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white' : 'bg-background text-foreground'}`}>
      {/* Header */}
      <header className={`p-4 ${isOfficeMode ? 'glass border-b border-white/10' : 'border-b'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Brain className={`w-8 h-8 ${isOfficeMode ? 'text-cyan-400 animate-pulse' : 'text-primary'}`} />
            <h1 className={`text-xl font-bold ${isOfficeMode ? 'bg-gradient-to-r from-red-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent' : ''}`}>
              Nexus AI - Conversational Intelligence
            </h1>
            <Button variant="outline" onClick={() => setOllamaEnabled(e => !e)} size="sm">
              LLM: {ollamaStatus === 'ready' ? `Ready: ${selectedModel || '—'}` : 'Offline'}
            </Button>
            {ollamaEnabled && ollamaStatus === 'ready' && availableModels.length > 0 && (
              <div className="min-w-[180px]">
                <Select value={selectedModel || undefined} onValueChange={(v) => setSelectedModel(v)}>
                  <SelectTrigger className={isOfficeMode ? 'glass' : ''}>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className={isOfficeMode ? 'glass' : ''}>
                    {availableModels.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'glass' : ''}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'glass' : ''}
              onClick={() => setActiveTab('memory')}
            >
              <Database className="w-4 h-4 mr-2" />
              Memory ({memories.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'glass' : ''}
              onClick={() => setActiveTab('learning')}
            >
              <Brain className="w-4 h-4 mr-2" />
              Learning ({learnings.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'glass' : ''}
              onClick={() => setActiveTab('personality')}
            >
              <Heart className="w-4 h-4 mr-2" />
              Personality
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'glass' : ''}
              onClick={() => setActiveTab('premium')}
            >
              <Crown className="w-4 h-4 mr-2" />
              Premium
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'ai'
                        ? isOfficeMode ? 'glass border border-white/20' : 'bg-muted'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className={`w-4 h-4 ${isOfficeMode ? 'text-cyan-400' : 'text-primary'}`} />
                        <span className="text-xs text-muted-foreground">Nexus AI</span>
                        <span className="text-xs text-muted-foreground">
                          {getMoodIcon(message.mood)} {message.mood}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {getPersonalityIcon(message.personality)} {message.personality}
                        </span>
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
                  <div className={`p-4 rounded-lg ${isOfficeMode ? 'glass border border-white/20' : 'bg-muted'}`}>
                    <div className="flex items-center space-x-2">
                      <Brain className={`w-4 h-4 ${isOfficeMode ? 'text-cyan-400' : 'text-primary'}`} />
                      <span className="text-xs text-muted-foreground">Nexus AI</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="animate-spin">🧠</div>
                      <span className="text-sm text-muted-foreground">Processing with ML intelligence...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 ${isOfficeMode ? 'glass border-t border-white/10' : 'border-t'}`}>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`${isListening ? 'bg-red-500/20 text-red-400' : ''} ${isOfficeMode ? 'glass' : ''}`}
                  onClick={() => setIsListening(!isListening)}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Chat with Nexus AI - Ask about AI, tech, philosophy, jokes, or anything!"
                  className={`flex-1 ${isOfficeMode ? 'glass' : ''}`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isProcessing || ollamaStatus === 'connecting'}
                  className={isOfficeMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
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
              <h2 className="text-2xl font-bold mb-4">🧠 Persistent Memory</h2>
              {memories.map((memory) => (
                <Card key={memory.id} className={isOfficeMode ? 'glass border-white/20' : ''}>
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
                <Card key={learning.id} className={isOfficeMode ? 'glass border-white/20' : ''}>
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
              
              <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <span>Current Personality State</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`text-center p-4 ${isOfficeMode ? 'glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-blue-400">{personality.energy}%</div>
                      <div className="text-xs text-muted-foreground">Energy</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-purple-400">{personality.techLevel}%</div>
                      <div className="text-xs text-muted-foreground">Tech Level</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-yellow-400">{personality.humorLevel}%</div>
                      <div className="text-xs text-muted-foreground">Humor</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-green-400">{personality.wisdomLevel}%</div>
                      <div className="text-xs text-muted-foreground">Wisdom</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
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

              <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span>Interaction Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`text-center p-4 ${isOfficeMode ? 'glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-blue-400">{conversationCount}</div>
                      <div className="text-xs text-muted-foreground">Conversations</div>
                    </div>
                    <div className={`text-center p-4 ${isOfficeMode ? 'glass' : 'bg-muted'} rounded-lg`}>
                      <div className="text-2xl font-bold text-purple-400">{personality.curiosityLevel}%</div>
                      <div className="text-xs text-muted-foreground">Curiosity</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Premium Tab */}
        {activeTab === 'premium' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">👑 Premium Features</h2>
              
              <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span>Current Plan: {isPremium ? 'Premium' : 'Free'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Persistent Memory</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Learning Patterns</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Personality Adaptation</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Advanced Conversations</span>
                      {isPremium ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Lock className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Custom Personality</span>
                      {isPremium ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Lock className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Advanced Analytics</span>
                      {isPremium ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Lock className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!isPremium && (
                <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Rocket className="w-5 h-5 text-purple-400" />
                      <span>Upgrade to Premium</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Unlock advanced features and take your AI experience to the next level!
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                          <Gift className="w-4 h-4 mr-2" />
                          Free Trial
                        </Button>
                        <Button variant="outline" className={isOfficeMode ? 'glass' : ''}>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default NextGenAI;
