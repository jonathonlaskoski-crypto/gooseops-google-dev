// GooseOps Persistent Memory System
// Cross-AI agent memory sharing and learning

export interface MemoryEntry {
  id: string;
  type: 'conversation' | 'learning' | 'pattern' | 'preference' | 'knowledge' | 'experience';
  content: string;
  source: string; // Which AI agent created this memory
  importance: number; // 0-1 scale
  tags: string[];
  timestamp: Date;
  lastAccessed: Date;
  accessCount: number;
  connections: string[]; // IDs of related memories
  emotionalContext?: 'positive' | 'neutral' | 'negative';
  confidence: number; // How confident we are in this memory
  validated: boolean; // Has this been validated by user or system
}

export interface LearningPattern {
  id: string;
  pattern: string;
  description: string;
  confidence: number;
  successRate: number;
  examples: string[];
  applications: string[];
  source: string;
  timestamp: Date;
  lastUsed: Date;
  usageCount: number;
  validated: boolean;
}

export interface UserPreference {
  id: string;
  category: 'communication' | 'interface' | 'functionality' | 'content' | 'timing';
  preference: string;
  value: any;
  confidence: number;
  source: string;
  timestamp: Date;
  lastConfirmed: Date;
  confirmed: boolean;
}

export interface KnowledgeBase {
  id: string;
  topic: string;
  content: string;
  source: string;
  accuracy: number;
  lastUpdated: Date;
  references: string[];
  tags: string[];
  validated: boolean;
}

export interface MemorySearchResult {
  memory: MemoryEntry;
  relevance: number;
  context: string;
}

export interface MemoryAnalytics {
  totalMemories: number;
  memoriesByType: Record<string, number>;
  memoriesBySource: Record<string, number>;
  averageImportance: number;
  mostAccessedMemories: MemoryEntry[];
  recentMemories: MemoryEntry[];
  learningPatterns: number;
  userPreferences: number;
  knowledgeBaseEntries: number;
}

export class PersistentMemorySystem {
  private memories: Map<string, MemoryEntry> = new Map();
  private learningPatterns: Map<string, LearningPattern> = new Map();
  private userPreferences: Map<string, UserPreference> = new Map();
  private knowledgeBase: Map<string, KnowledgeBase> = new Map();
  private memoryIndex: Map<string, string[]> = new Map(); // For fast searching

  constructor() {
    this.loadFromStorage();
    this.startMemoryMaintenance();
  }

  // Memory Management
  public addMemory(memory: Omit<MemoryEntry, 'id' | 'timestamp' | 'lastAccessed' | 'accessCount'>): string {
    const id = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMemory: MemoryEntry = {
      ...memory,
      id,
      timestamp: new Date(),
      lastAccessed: new Date(),
      accessCount: 0
    };

    this.memories.set(id, newMemory);
    this.updateMemoryIndex(newMemory);
    this.saveToStorage();
    
    return id;
  }

  public getMemory(id: string): MemoryEntry | null {
    const memory = this.memories.get(id);
    if (memory) {
      memory.lastAccessed = new Date();
      memory.accessCount++;
      this.saveToStorage();
    }
    return memory || null;
  }

  public searchMemories(query: string, limit: number = 10): MemorySearchResult[] {
    const results: MemorySearchResult[] = [];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);

    for (const memory of this.memories.values()) {
      let relevance = 0;
      let context = '';

      // Content matching
      if (memory.content.toLowerCase().includes(queryLower)) {
        relevance += 0.4;
        context = 'Content match';
      }

      // Tag matching
      const tagMatches = memory.tags.filter(tag => 
        queryWords.some(word => tag.toLowerCase().includes(word))
      ).length;
      relevance += tagMatches * 0.3;

      // Type matching
      if (queryWords.some(word => memory.type.includes(word))) {
        relevance += 0.2;
        context = context ? `${context}, Type match` : 'Type match';
      }

      // Importance weighting
      relevance *= memory.importance;

      if (relevance > 0.1) {
        results.push({ memory, relevance, context });
      }
    }

    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);
  }

  public getRelatedMemories(memoryId: string, limit: number = 5): MemoryEntry[] {
    const memory = this.memories.get(memoryId);
    if (!memory) return [];

    const related: MemoryEntry[] = [];
    
    // Find memories with similar tags
    for (const otherMemory of this.memories.values()) {
      if (otherMemory.id === memoryId) continue;
      
      const commonTags = memory.tags.filter(tag => otherMemory.tags.includes(tag));
      if (commonTags.length > 0) {
        related.push(otherMemory);
      }
    }

    return related
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  }

  // Learning Pattern Management
  public addLearningPattern(pattern: Omit<LearningPattern, 'id' | 'timestamp' | 'lastUsed' | 'usageCount'>): string {
    const id = `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPattern: LearningPattern = {
      ...pattern,
      id,
      timestamp: new Date(),
      lastUsed: new Date(),
      usageCount: 0
    };

    this.learningPatterns.set(id, newPattern);
    this.saveToStorage();
    
    return id;
  }

  public getLearningPattern(id: string): LearningPattern | null {
    const pattern = this.learningPatterns.get(id);
    if (pattern) {
      pattern.lastUsed = new Date();
      pattern.usageCount++;
      this.saveToStorage();
    }
    return pattern || null;
  }

  public findApplicablePatterns(context: string, limit: number = 5): LearningPattern[] {
    const results: LearningPattern[] = [];
    const contextLower = context.toLowerCase();

    for (const pattern of this.learningPatterns.values()) {
      let score = 0;

      // Pattern description matching
      if (pattern.description.toLowerCase().includes(contextLower)) {
        score += 0.4;
      }

      // Application matching
      const appMatches = pattern.applications.filter(app => 
        contextLower.includes(app.toLowerCase())
      ).length;
      score += appMatches * 0.3;

      // Example matching
      const exampleMatches = pattern.examples.filter(example => 
        contextLower.includes(example.toLowerCase())
      ).length;
      score += exampleMatches * 0.2;

      // Confidence weighting
      score *= pattern.confidence;

      if (score > 0.2) {
        results.push(pattern);
      }
    }

    return results
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  // User Preference Management
  public addUserPreference(preference: Omit<UserPreference, 'id' | 'timestamp' | 'lastConfirmed'>): string {
    const id = `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPreference: UserPreference = {
      ...preference,
      id,
      timestamp: new Date(),
      lastConfirmed: new Date()
    };

    this.userPreferences.set(id, newPreference);
    this.saveToStorage();
    
    return id;
  }

  public getUserPreference(category: string, preference: string): UserPreference | null {
    for (const pref of this.userPreferences.values()) {
      if (pref.category === category && pref.preference === preference) {
        return pref;
      }
    }
    return null;
  }

  public getAllPreferences(): UserPreference[] {
    return Array.from(this.userPreferences.values());
  }

  // Knowledge Base Management
  public addKnowledge(knowledge: Omit<KnowledgeBase, 'id' | 'lastUpdated'>): string {
    const id = `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newKnowledge: KnowledgeBase = {
      ...knowledge,
      id,
      lastUpdated: new Date()
    };

    this.knowledgeBase.set(id, newKnowledge);
    this.saveToStorage();
    
    return id;
  }

  public getKnowledge(id: string): KnowledgeBase | null {
    return this.knowledgeBase.get(id) || null;
  }

  public searchKnowledge(query: string, limit: number = 10): KnowledgeBase[] {
    const results: KnowledgeBase[] = [];
    const queryLower = query.toLowerCase();

    for (const knowledge of this.knowledgeBase.values()) {
      let score = 0;

      if (knowledge.topic.toLowerCase().includes(queryLower)) {
        score += 0.5;
      }

      if (knowledge.content.toLowerCase().includes(queryLower)) {
        score += 0.3;
      }

      const tagMatches = knowledge.tags.filter(tag => 
        tag.toLowerCase().includes(queryLower)
      ).length;
      score += tagMatches * 0.2;

      if (score > 0.2) {
        results.push(knowledge);
      }
    }

    return results
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, limit);
  }

  // Analytics and Insights
  public getMemoryAnalytics(): MemoryAnalytics {
    const memories = Array.from(this.memories.values());
    const memoriesByType: Record<string, number> = {};
    const memoriesBySource: Record<string, number> = {};

    memories.forEach(memory => {
      memoriesByType[memory.type] = (memoriesByType[memory.type] || 0) + 1;
      memoriesBySource[memory.source] = (memoriesBySource[memory.source] || 0) + 1;
    });

    const averageImportance = memories.reduce((sum, m) => sum + m.importance, 0) / memories.length;
    const mostAccessedMemories = memories
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 10);
    const recentMemories = memories
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalMemories: memories.length,
      memoriesByType,
      memoriesBySource,
      averageImportance,
      mostAccessedMemories,
      recentMemories,
      learningPatterns: this.learningPatterns.size,
      userPreferences: this.userPreferences.size,
      knowledgeBaseEntries: this.knowledgeBase.size
    };
  }

  // Cross-AI Agent Sharing
  public shareMemoryWithAgent(memoryId: string, targetAgent: string): boolean {
    const memory = this.memories.get(memoryId);
    if (!memory) return false;

    // Update memory to include target agent as a connection
    memory.connections.push(targetAgent);
    this.saveToStorage();
    
    return true;
  }

  public getMemoriesForAgent(agentId: string): MemoryEntry[] {
    const agentMemories: MemoryEntry[] = [];

    for (const memory of this.memories.values()) {
      if (memory.source === agentId || memory.connections.includes(agentId)) {
        agentMemories.push(memory);
      }
    }

    return agentMemories.sort((a, b) => b.importance - a.importance);
  }

  // Memory Maintenance
  private updateMemoryIndex(memory: MemoryEntry) {
    const words = memory.content.toLowerCase().split(' ').filter(word => word.length > 2);
    words.forEach(word => {
      if (!this.memoryIndex.has(word)) {
        this.memoryIndex.set(word, []);
      }
      this.memoryIndex.get(word)!.push(memory.id);
    });
  }

  private startMemoryMaintenance() {
    // Clean up old, low-importance memories every hour
    setInterval(() => {
      this.cleanupOldMemories();
    }, 60 * 60 * 1000);

    // Consolidate similar memories every 6 hours
    setInterval(() => {
      this.consolidateSimilarMemories();
    }, 6 * 60 * 60 * 1000);
  }

  private cleanupOldMemories() {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const memoriesToDelete: string[] = [];

    for (const [id, memory] of this.memories.entries()) {
      if (memory.timestamp < cutoffDate && 
          memory.importance < 0.3 && 
          memory.accessCount < 3) {
        memoriesToDelete.push(id);
      }
    }

    memoriesToDelete.forEach(id => {
      this.memories.delete(id);
    });

    if (memoriesToDelete.length > 0) {
      this.saveToStorage();
    }
  }

  private consolidateSimilarMemories() {
    const memories = Array.from(this.memories.values());
    const consolidated: string[] = [];

    for (let i = 0; i < memories.length; i++) {
      if (consolidated.includes(memories[i].id)) continue;

      const similarMemories: MemoryEntry[] = [memories[i]];

      for (let j = i + 1; j < memories.length; j++) {
        if (consolidated.includes(memories[j].id)) continue;

        const similarity = this.calculateSimilarity(memories[i], memories[j]);
        if (similarity > 0.8) {
          similarMemories.push(memories[j]);
          consolidated.push(memories[j].id);
        }
      }

      if (similarMemories.length > 1) {
        this.mergeMemories(similarMemories);
      }
    }
  }

  private calculateSimilarity(memory1: MemoryEntry, memory2: MemoryEntry): number {
    let similarity = 0;

    // Content similarity
    const words1 = new Set(memory1.content.toLowerCase().split(' '));
    const words2 = new Set(memory2.content.toLowerCase().split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    similarity += intersection.size / union.size * 0.4;

    // Tag similarity
    const tags1 = new Set(memory1.tags);
    const tags2 = new Set(memory2.tags);
    const tagIntersection = new Set([...tags1].filter(x => tags2.has(x)));
    const tagUnion = new Set([...tags1, ...tags2]);
    similarity += tagIntersection.size / tagUnion.size * 0.3;

    // Type similarity
    if (memory1.type === memory2.type) {
      similarity += 0.2;
    }

    // Source similarity
    if (memory1.source === memory2.source) {
      similarity += 0.1;
    }

    return similarity;
  }

  private mergeMemories(memories: MemoryEntry[]) {
    if (memories.length < 2) return;

    // Find the most important memory as the base
    const baseMemory = memories.reduce((prev, current) => 
      prev.importance > current.importance ? prev : current
    );

    // Merge content and tags
    const mergedContent = memories.map(m => m.content).join(' | ');
    const mergedTags = [...new Set(memories.flatMap(m => m.tags))];
    const mergedConnections = [...new Set(memories.flatMap(m => m.connections))];

    // Update the base memory
    baseMemory.content = mergedContent;
    baseMemory.tags = mergedTags;
    baseMemory.connections = mergedConnections;
    baseMemory.importance = Math.min(1.0, baseMemory.importance + 0.1);

    // Delete the other memories
    memories.forEach(memory => {
      if (memory.id !== baseMemory.id) {
        this.memories.delete(memory.id);
      }
    });

    this.saveToStorage();
  }

  // Storage Management
  private saveToStorage() {
    try {
      const data = {
        memories: Array.from(this.memories.entries()),
        learningPatterns: Array.from(this.learningPatterns.entries()),
        userPreferences: Array.from(this.userPreferences.entries()),
        knowledgeBase: Array.from(this.knowledgeBase.entries()),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('gooseops-persistent-memory', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save persistent memory:', error);
    }
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem('gooseops-persistent-memory');
      if (data) {
        const parsed = JSON.parse(data);
        
        if (parsed.memories) {
          this.memories = new Map(parsed.memories.map(([id, memory]: [string, any]) => [
            id, 
            { ...memory, timestamp: new Date(memory.timestamp), lastAccessed: new Date(memory.lastAccessed) }
          ]));
        }
        
        if (parsed.learningPatterns) {
          this.learningPatterns = new Map(parsed.learningPatterns.map(([id, pattern]: [string, any]) => [
            id, 
            { ...pattern, timestamp: new Date(pattern.timestamp), lastUsed: new Date(pattern.lastUsed) }
          ]));
        }
        
        if (parsed.userPreferences) {
          this.userPreferences = new Map(parsed.userPreferences.map(([id, pref]: [string, any]) => [
            id, 
            { ...pref, timestamp: new Date(pref.timestamp), lastConfirmed: new Date(pref.lastConfirmed) }
          ]));
        }
        
        if (parsed.knowledgeBase) {
          this.knowledgeBase = new Map(parsed.knowledgeBase.map(([id, kb]: [string, any]) => [
            id, 
            { ...kb, lastUpdated: new Date(kb.lastUpdated) }
          ]));
        }
      }
    } catch (error) {
      console.error('Failed to load persistent memory:', error);
    }
  }

  // Public API
  public getAllMemories(): MemoryEntry[] {
    return Array.from(this.memories.values());
  }

  public getAllLearningPatterns(): LearningPattern[] {
    return Array.from(this.learningPatterns.values());
  }

  public getAllKnowledge(): KnowledgeBase[] {
    return Array.from(this.knowledgeBase.values());
  }

  public clearAllData(): void {
    this.memories.clear();
    this.learningPatterns.clear();
    this.userPreferences.clear();
    this.knowledgeBase.clear();
    this.memoryIndex.clear();
    localStorage.removeItem('gooseops-persistent-memory');
  }

  public exportData(): string {
    const data = {
      memories: Array.from(this.memories.entries()),
      learningPatterns: Array.from(this.learningPatterns.entries()),
      userPreferences: Array.from(this.userPreferences.entries()),
      knowledgeBase: Array.from(this.knowledgeBase.entries()),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.memories) {
        this.memories = new Map(data.memories.map(([id, memory]: [string, any]) => [
          id, 
          { ...memory, timestamp: new Date(memory.timestamp), lastAccessed: new Date(memory.lastAccessed) }
        ]));
      }
      
      if (data.learningPatterns) {
        this.learningPatterns = new Map(data.learningPatterns.map(([id, pattern]: [string, any]) => [
          id, 
          { ...pattern, timestamp: new Date(pattern.timestamp), lastUsed: new Date(pattern.lastUsed) }
        ]));
      }
      
      if (data.userPreferences) {
        this.userPreferences = new Map(data.userPreferences.map(([id, pref]: [string, any]) => [
          id, 
          { ...pref, timestamp: new Date(pref.timestamp), lastConfirmed: new Date(pref.lastConfirmed) }
        ]));
      }
      
      if (data.knowledgeBase) {
        this.knowledgeBase = new Map(data.knowledgeBase.map(([id, kb]: [string, any]) => [
          id, 
          { ...kb, lastUpdated: new Date(kb.lastUpdated) }
        ]));
      }
      
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const persistentMemory = new PersistentMemorySystem();
