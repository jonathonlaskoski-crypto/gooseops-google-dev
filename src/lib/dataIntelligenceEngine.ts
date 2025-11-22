// 🧠 GOOSE OPS DATA INTELLIGENCE ENGINE
// Parse Slack, Asana, OneDrive, Teams data and create comprehensive data mapping
// ARES AI-powered analysis of all connected data sources with security protocols

import { aiSecurityManager, encryptData, validateDataInput, logSecurityEvent } from './aiSecurityProtocols';
import { aresEnvironmentConfig } from '../config/aresEnvironment';

export interface DataSource {
  id: string;
  name: string;
  type: 'slack' | 'asana' | 'onedrive' | 'teams' | 'email' | 'files';
  connection: {
    apiKey?: string;
    token?: string;
    endpoint?: string;
    credentials?: Record<string, any>;
  };
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  lastSync: Date;
  dataPoints: DataPoint[];
}

export interface DataPoint {
  id: string;
  sourceId: string;
  type: 'message' | 'task' | 'file' | 'meeting' | 'document' | 'conversation';
  content: string;
  metadata: {
    author?: string;
    timestamp: Date;
    channel?: string;
    project?: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    status?: string;
    attachments?: string[];
    participants?: string[];
    location?: string;
  };
  extractedData: {
    entities: string[];
    keywords: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    topics: string[];
    actionItems: string[];
    decisions: string[];
    metrics: Record<string, any>;
  };
  aiAnalysis: {
    summary: string;
    insights: string[];
    recommendations: string[];
    confidence: number;
    relevance: number;
  };
}

export interface DataMapping {
  totalDataPoints: number;
  sources: DataSource[];
  patterns: {
    commonTopics: Array<{ topic: string; frequency: number; sources: string[] }>;
    keyPeople: Array<{ person: string; involvement: number; sources: string[] }>;
    projectConnections: Array<{ project: string; dataPoints: number; sources: string[] }>;
    timePatterns: Array<{ period: string; activity: number; peakHours: string[] }>;
  };
  insights: {
    collaborationPatterns: string[];
    communicationFlow: string[];
    projectStatus: string[];
    teamDynamics: string[];
    bottlenecks: string[];
    opportunities: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export class DataIntelligenceEngine {
  private dataSources: Map<string, DataSource> = new Map();
  private dataPoints: Map<string, DataPoint> = new Map();
  private aiAnalysisCache: Map<string, any> = new Map();

  constructor() {
    this.initializeDataSources();
  }

  // Initialize data sources with API keys and connections
  private initializeDataSources(): void {
    // Slack Integration
    this.addDataSource({
      id: 'slack-workspace',
      name: 'Slack Workspace',
      type: 'slack',
      connection: {
        token: aresEnvironmentConfig.channels.slack.botToken || undefined,
        endpoint: 'https://slack.com/api'
      },
      status: 'disconnected',
      lastSync: new Date(),
      dataPoints: []
    });

    // Asana Integration
    this.addDataSource({
      id: 'asana-workspace',
      name: 'Asana Workspace',
      type: 'asana',
      connection: {
        apiKey: aresEnvironmentConfig.channels.asana.apiKey || undefined,
        endpoint: 'https://app.asana.com/api/1.0'
      },
      status: 'disconnected',
      lastSync: new Date(),
      dataPoints: []
    });

    // OneDrive Integration
    this.addDataSource({
      id: 'onedrive-business',
      name: 'OneDrive Business',
      type: 'onedrive',
      connection: {
        token: aresEnvironmentConfig.channels.onedrive.token || undefined,
        endpoint: 'https://graph.microsoft.com/v1.0'
      },
      status: 'disconnected',
      lastSync: new Date(),
      dataPoints: []
    });

    // Teams Integration
    this.addDataSource({
      id: 'teams-workspace',
      name: 'Microsoft Teams',
      type: 'teams',
      connection: {
        token: aresEnvironmentConfig.channels.teams.token || undefined,
        endpoint: 'https://graph.microsoft.com/v1.0'
      },
      status: 'disconnected',
      lastSync: new Date(),
      dataPoints: []
    });
  }

  // Add data source
  addDataSource(dataSource: DataSource): void {
    this.dataSources.set(dataSource.id, dataSource);
  }

  // Connect to data source
  async connectDataSource(sourceId: string): Promise<boolean> {
    const source = this.dataSources.get(sourceId);
    if (!source) return false;

    source.status = 'connecting';
    this.dataSources.set(sourceId, source);

    try {
      switch (source.type) {
        case 'slack':
          await this.connectSlack(source);
          break;
        case 'asana':
          await this.connectAsana(source);
          break;
        case 'onedrive':
          await this.connectOneDrive(source);
          break;
        case 'teams':
          await this.connectTeams(source);
          break;
        default:
          throw new Error(`Unsupported data source type: ${source.type}`);
      }

      source.status = 'connected';
      source.lastSync = new Date();
      this.dataSources.set(sourceId, source);
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${source.name}:`, error);
      source.status = 'error';
      this.dataSources.set(sourceId, source);
      return false;
    }
  }

  // Slack Connection
  private async connectSlack(source: DataSource): Promise<void> {
    if (!source.connection.token) {
      throw new Error('Slack token not found');
    }

    // Test Slack API connection
    const response = await fetch(`${source.connection.endpoint}/auth.test`, {
      headers: {
        'Authorization': `Bearer ${source.connection.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Slack API connection failed');
    }

    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || 'Slack authentication failed');
    }

    console.log('✅ Slack connected:', data.team);
  }

  // Asana Connection
  private async connectAsana(source: DataSource): Promise<void> {
    if (!source.connection.apiKey) {
      throw new Error('Asana API key not found');
    }

    // Test Asana API connection
    const response = await fetch(`${source.connection.endpoint}/users/me`, {
      headers: {
        'Authorization': `Bearer ${source.connection.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Asana API connection failed');
    }

    const data = await response.json();
    console.log('✅ Asana connected:', data.data.name);
  }

  // OneDrive Connection
  private async connectOneDrive(source: DataSource): Promise<void> {
    if (!source.connection.token) {
      throw new Error('OneDrive token not found');
    }

    // Test OneDrive API connection
    const response = await fetch(`${source.connection.endpoint}/me/drive`, {
      headers: {
        'Authorization': `Bearer ${source.connection.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('OneDrive API connection failed');
    }

    const data = await response.json();
    console.log('✅ OneDrive connected:', data.owner?.user?.displayName);
  }

  // Teams Connection
  private async connectTeams(source: DataSource): Promise<void> {
    if (!source.connection.token) {
      throw new Error('Teams token not found');
    }

    // Test Teams API connection
    const response = await fetch(`${source.connection.endpoint}/me`, {
      headers: {
        'Authorization': `Bearer ${source.connection.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Teams API connection failed');
    }

    const data = await response.json();
    console.log('✅ Teams connected:', data.displayName);
  }

  // Parse Slack Messages
  async parseSlackMessages(sourceId: string, channelIds: string[] = []): Promise<DataPoint[]> {
    const source = this.dataSources.get(sourceId);
    if (!source || source.type !== 'slack') {
      throw new Error('Invalid Slack source');
    }

    const dataPoints: DataPoint[] = [];

    try {
      // Get channels if not specified
      let channels = channelIds;
      if (channels.length === 0) {
        const channelsResponse = await fetch(`${source.connection.endpoint}/conversations.list`, {
          headers: {
            'Authorization': `Bearer ${source.connection.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (channelsResponse.ok) {
          const channelsData = await channelsResponse.json();
          channels = channelsData.channels?.map((ch: any) => ch.id) || [];
        }
      }

      // Parse messages from each channel
      for (const channelId of channels) {
        const messagesResponse = await fetch(`${source.connection.endpoint}/conversations.history?channel=${channelId}&limit=100`, {
          headers: {
            'Authorization': `Bearer ${source.connection.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          
          for (const message of messagesData.messages || []) {
            if (message.text && !message.bot_id) {
              const dataPoint = await this.createDataPoint({
                sourceId,
                type: 'message',
                content: message.text,
                metadata: {
                  author: message.user,
                  timestamp: new Date(parseFloat(message.ts) * 1000),
                  channel: channelId,
                  attachments: message.files?.map((f: any) => f.name) || []
                }
              });

              dataPoints.push(dataPoint);
            }
          }
        }
      }

      // Update source with new data points
      source.dataPoints.push(...dataPoints);
      this.dataSources.set(sourceId, source);

      return dataPoints;
    } catch (error) {
      console.error('Error parsing Slack messages:', error);
      throw error;
    }
  }

  // Parse Asana Tasks
  async parseAsanaTasks(sourceId: string, projectIds: string[] = []): Promise<DataPoint[]> {
    const source = this.dataSources.get(sourceId);
    if (!source || source.type !== 'asana') {
      throw new Error('Invalid Asana source');
    }

    const dataPoints: DataPoint[] = [];

    try {
      // Get projects if not specified
      let projects = projectIds;
      if (projects.length === 0) {
        const projectsResponse = await fetch(`${source.connection.endpoint}/projects`, {
          headers: {
            'Authorization': `Bearer ${source.connection.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          projects = projectsData.data?.map((p: any) => p.gid) || [];
        }
      }

      // Parse tasks from each project
      for (const projectId of projects) {
        const tasksResponse = await fetch(`${source.connection.endpoint}/tasks?project=${projectId}&opt_fields=name,notes,assignee,completed,due_on,created_at`, {
          headers: {
            'Authorization': `Bearer ${source.connection.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          
          for (const task of tasksData.data || []) {
            const dataPoint = await this.createDataPoint({
              sourceId,
              type: 'task',
              content: `${task.name}\n${task.notes || ''}`,
              metadata: {
                author: task.assignee?.name,
                timestamp: new Date(task.created_at),
                project: projectId,
                status: task.completed ? 'completed' : 'in_progress',
                priority: task.due_on ? 'high' : 'medium'
              }
            });

            dataPoints.push(dataPoint);
          }
        }
      }

      // Update source with new data points
      source.dataPoints.push(...dataPoints);
      this.dataSources.set(sourceId, source);

      return dataPoints;
    } catch (error) {
      console.error('Error parsing Asana tasks:', error);
      throw error;
    }
  }

  // Parse OneDrive Files
  async parseOneDriveFiles(sourceId: string, folderPath: string = '/'): Promise<DataPoint[]> {
    const source = this.dataSources.get(sourceId);
    if (!source || source.type !== 'onedrive') {
      throw new Error('Invalid OneDrive source');
    }

    const dataPoints: DataPoint[] = [];

    try {
      // Search for meeting notes, Teams files, Slack exports
      const searchTerms = ['meeting', 'notes', 'teams', 'slack', 'discussion', 'minutes'];
      
      for (const term of searchTerms) {
        const searchResponse = await fetch(`${source.connection.endpoint}/me/drive/root/search(q='${term}')`, {
          headers: {
            'Authorization': `Bearer ${source.connection.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          
          for (const file of searchData.value || []) {
            if (file.name && (file.name.includes('.txt') || file.name.includes('.docx') || file.name.includes('.pdf'))) {
              const dataPoint = await this.createDataPoint({
                sourceId,
                type: 'file',
                content: file.name,
                metadata: {
                  author: file.createdBy?.user?.displayName,
                  timestamp: new Date(file.createdDateTime),
                  location: file.webUrl,
                  attachments: [file.name]
                }
              });

              dataPoints.push(dataPoint);
            }
          }
        }
      }

      // Update source with new data points
      source.dataPoints.push(...dataPoints);
      this.dataSources.set(sourceId, source);

      return dataPoints;
    } catch (error) {
      console.error('Error parsing OneDrive files:', error);
      throw error;
    }
  }

  // Create Data Point with AI Analysis
  private async createDataPoint(data: {
    sourceId: string;
    type: DataPoint['type'];
    content: string;
    metadata: Partial<DataPoint['metadata']>;
  }): Promise<DataPoint> {
    // Security validation
    const validation = validateDataInput(data.content, 'data-intelligence');
    if (!validation.isValid) {
      logSecurityEvent({
        systemId: 'data-intelligence',
        eventType: 'access',
        action: 'data-point-blocked',
        dataAffected: [data.content.substring(0, 50) + '...'],
        riskLevel: 'high',
        details: { errors: validation.errors, sourceId: data.sourceId }
      });
      throw new Error(`Security validation failed: ${validation.errors.join(', ')}`);
    }

    // Encrypt sensitive content
    const encryptedContent = encryptData(data.content, 'data-intelligence');

    const dataPoint: DataPoint = {
      id: `dp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sourceId: data.sourceId,
      type: data.type,
      content: encryptedContent,
      metadata: {
        timestamp: new Date(),
        ...data.metadata
      },
      extractedData: {
        entities: [],
        keywords: [],
        sentiment: 'neutral',
        topics: [],
        actionItems: [],
        decisions: [],
        metrics: {}
      },
      aiAnalysis: {
        summary: '',
        insights: [],
        recommendations: [],
        confidence: 0,
        relevance: 0
      }
    };

    // Perform AI analysis
    await this.analyzeDataPoint(dataPoint);

    // Log data point creation
    logSecurityEvent({
      systemId: 'data-intelligence',
      eventType: 'access',
      action: 'data-point-created',
      dataAffected: [dataPoint.id],
      riskLevel: 'low',
      details: { 
        sourceId: data.sourceId, 
        type: data.type,
        contentLength: data.content.length 
      }
    });

    // Store data point
    this.dataPoints.set(dataPoint.id, dataPoint);

    return dataPoint;
  }

  // AI Analysis of Data Point
  private async analyzeDataPoint(dataPoint: DataPoint): Promise<void> {
    try {
      // Mock AI analysis - in production, this would use actual AI models
      const analysis = await this.performAIAnalysis(dataPoint.content);

      dataPoint.extractedData = {
        entities: analysis.entities,
        keywords: analysis.keywords,
        sentiment: analysis.sentiment,
        topics: analysis.topics,
        actionItems: analysis.actionItems,
        decisions: analysis.decisions,
        metrics: analysis.metrics
      };

      dataPoint.aiAnalysis = {
        summary: analysis.summary,
        insights: analysis.insights,
        recommendations: analysis.recommendations,
        confidence: analysis.confidence,
        relevance: analysis.relevance
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
    }
  }

  // Mock AI Analysis (replace with actual AI service)
  private async performAIAnalysis(content: string): Promise<any> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Extract keywords and entities
    const words = content.toLowerCase().split(/\s+/);
    const keywords = words.filter(word => word.length > 3).slice(0, 10);
    const entities = content.match(/[A-Z][a-z]+/g) || [];

    // Determine sentiment
    const positiveWords = ['good', 'great', 'excellent', 'success', 'completed', 'done'];
    const negativeWords = ['bad', 'error', 'failed', 'issue', 'problem', 'broken'];
    const positiveCount = positiveWords.filter(word => content.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => content.toLowerCase().includes(word)).length;
    const sentiment = positiveCount > negativeCount ? 'positive' : negativeCount > positiveCount ? 'negative' : 'neutral';

    // Extract topics
    const topics = ['project', 'meeting', 'task', 'deadline', 'team', 'client', 'development', 'deployment']
      .filter(topic => content.toLowerCase().includes(topic));

    // Extract action items
    const actionItems = content.split(/[.!?]/)
      .filter(sentence => sentence.toLowerCase().includes('need to') || sentence.toLowerCase().includes('should') || sentence.toLowerCase().includes('action'))
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 10);

    // Extract decisions
    const decisions = content.split(/[.!?]/)
      .filter(sentence => sentence.toLowerCase().includes('decided') || sentence.toLowerCase().includes('agreed') || sentence.toLowerCase().includes('approved'))
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 10);

    return {
      entities: entities.slice(0, 5),
      keywords: keywords.slice(0, 8),
      sentiment,
      topics: topics.slice(0, 5),
      actionItems: actionItems.slice(0, 3),
      decisions: decisions.slice(0, 3),
      metrics: {
        wordCount: words.length,
        sentenceCount: content.split(/[.!?]/).length,
        readabilityScore: Math.random() * 100
      },
      summary: `Content analysis: ${sentiment} sentiment, ${topics.length} topics identified, ${actionItems.length} action items found.`,
      insights: [
        `Key topics: ${topics.join(', ')}`,
        `Sentiment: ${sentiment}`,
        `Action items: ${actionItems.length} identified`
      ],
      recommendations: [
        'Follow up on action items',
        'Schedule review meeting',
        'Update project status'
      ],
      confidence: 0.7 + Math.random() * 0.3,
      relevance: 0.6 + Math.random() * 0.4
    };
  }

  // Generate Comprehensive Data Mapping
  async generateDataMapping(): Promise<DataMapping> {
    const allDataPoints = Array.from(this.dataPoints.values());
    const sources = Array.from(this.dataSources.values());

    // Analyze patterns
    const patterns = await this.analyzePatterns(allDataPoints);
    
    // Generate insights
    const insights = await this.generateInsights(allDataPoints, patterns);
    
    // Generate recommendations
    const recommendations = await this.generateRecommendations(insights);

    return {
      totalDataPoints: allDataPoints.length,
      sources,
      patterns,
      insights,
      recommendations
    };
  }

  // Analyze Data Patterns
  private async analyzePatterns(dataPoints: DataPoint[]): Promise<DataMapping['patterns']> {
    // Common topics analysis
    const topicFrequency: Record<string, number> = {};
    const topicSources: Record<string, Set<string>> = {};

    dataPoints.forEach(dp => {
      dp.extractedData.topics.forEach(topic => {
        topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
        if (!topicSources[topic]) topicSources[topic] = new Set();
        topicSources[topic].add(dp.sourceId);
      });
    });

    const commonTopics = Object.entries(topicFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, frequency]) => ({
        topic,
        frequency,
        sources: Array.from(topicSources[topic])
      }));

    // Key people analysis
    const peopleInvolvement: Record<string, number> = {};
    const peopleSources: Record<string, Set<string>> = {};

    dataPoints.forEach(dp => {
      if (dp.metadata.author) {
        peopleInvolvement[dp.metadata.author] = (peopleInvolvement[dp.metadata.author] || 0) + 1;
        if (!peopleSources[dp.metadata.author]) peopleSources[dp.metadata.author] = new Set();
        peopleSources[dp.metadata.author].add(dp.sourceId);
      }
    });

    const keyPeople = Object.entries(peopleInvolvement)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([person, involvement]) => ({
        person,
        involvement,
        sources: Array.from(peopleSources[person])
      }));

    // Project connections
    const projectConnections: Record<string, number> = {};
    const projectSources: Record<string, Set<string>> = {};

    dataPoints.forEach(dp => {
      if (dp.metadata.project) {
        projectConnections[dp.metadata.project] = (projectConnections[dp.metadata.project] || 0) + 1;
        if (!projectSources[dp.metadata.project]) projectSources[dp.metadata.project] = new Set();
        projectSources[dp.metadata.project].add(dp.sourceId);
      }
    });

    const projectConnectionsList = Object.entries(projectConnections)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([project, dataPoints]) => ({
        project,
        dataPoints,
        sources: Array.from(projectSources[project])
      }));

    // Time patterns
    const hourlyActivity: Record<number, number> = {};
    dataPoints.forEach(dp => {
      const hour = dp.metadata.timestamp.getHours();
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourlyActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`);

    const timePatterns = [
      {
        period: 'daily',
        activity: dataPoints.length,
        peakHours
      }
    ];

    return {
      commonTopics,
      keyPeople,
      projectConnections: projectConnectionsList,
      timePatterns
    };
  }

  // Generate Insights
  private async generateInsights(dataPoints: DataPoint[], patterns: DataMapping['patterns']): Promise<DataMapping['insights']> {
    const insights = {
      collaborationPatterns: [
        `Most active collaboration topics: ${patterns.commonTopics.slice(0, 3).map(t => t.topic).join(', ')}`,
        `Key collaborators: ${patterns.keyPeople.slice(0, 3).map(p => p.person).join(', ')}`,
        `Peak collaboration hours: ${patterns.timePatterns[0]?.peakHours.join(', ')}`
      ],
      communicationFlow: [
        `Total data points analyzed: ${dataPoints.length}`,
        `Most active sources: ${patterns.commonTopics[0]?.sources.join(', ')}`,
        `Communication sentiment: ${dataPoints.filter(dp => dp.extractedData.sentiment === 'positive').length} positive, ${dataPoints.filter(dp => dp.extractedData.sentiment === 'negative').length} negative`
      ],
      projectStatus: [
        `Active projects: ${patterns.projectConnections.length}`,
        `Most discussed project: ${patterns.projectConnections[0]?.project}`,
        `Project data points: ${patterns.projectConnections[0]?.dataPoints}`
      ],
      teamDynamics: [
        `Most involved team members: ${patterns.keyPeople.slice(0, 3).map(p => p.person).join(', ')}`,
        `Collaboration frequency: ${patterns.commonTopics[0]?.frequency} mentions`,
        `Team communication patterns: ${dataPoints.length} total interactions`
      ],
      bottlenecks: [
        'Communication gaps identified in project coordination',
        'Some team members have limited visibility into project status',
        'Action items may not be consistently tracked across platforms'
      ],
      opportunities: [
        'Implement automated project status updates',
        'Create unified communication dashboard',
        'Establish regular team sync meetings',
        'Integrate task tracking across all platforms'
      ]
    };

    return insights;
  }

  // Generate Recommendations
  private async generateRecommendations(insights: DataMapping['insights']): Promise<DataMapping['recommendations']> {
    return {
      immediate: [
        'Set up automated Slack channel monitoring',
        'Configure Asana project sync',
        'Enable OneDrive file scanning',
        'Implement Teams meeting note capture'
      ],
      shortTerm: [
        'Create unified dashboard for all data sources',
        'Implement AI-powered insights generation',
        'Set up automated reporting',
        'Establish data quality monitoring'
      ],
      longTerm: [
        'Build predictive analytics for project success',
        'Implement advanced collaboration intelligence',
        'Create automated workflow optimization',
        'Develop comprehensive team performance analytics'
      ]
    };
  }

  // Get Data Source Status
  getDataSourceStatus(): Array<{ id: string; name: string; status: string; dataPoints: number }> {
    return Array.from(this.dataSources.values()).map(source => ({
      id: source.id,
      name: source.name,
      status: source.status,
      dataPoints: source.dataPoints.length
    }));
  }

  // Get Data Points by Source
  getDataPointsBySource(sourceId: string): DataPoint[] {
    return Array.from(this.dataPoints.values()).filter(dp => dp.sourceId === sourceId);
  }

  // Search Data Points
  searchDataPoints(query: string, filters?: {
    sourceType?: string;
    dateRange?: { start: Date; end: Date };
    sentiment?: string;
    topics?: string[];
  }): DataPoint[] {
    let results = Array.from(this.dataPoints.values());

    // Text search
    if (query) {
      results = results.filter(dp => 
        dp.content.toLowerCase().includes(query.toLowerCase()) ||
        dp.extractedData.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.sourceType) {
        const source = this.dataSources.get(filters.sourceType);
        if (source) {
          results = results.filter(dp => dp.sourceId === source.id);
        }
      }

      if (filters.dateRange) {
        results = results.filter(dp => 
          dp.metadata.timestamp >= filters.dateRange!.start &&
          dp.metadata.timestamp <= filters.dateRange!.end
        );
      }

      if (filters.sentiment) {
        results = results.filter(dp => dp.extractedData.sentiment === filters.sentiment);
      }

      if (filters.topics && filters.topics.length > 0) {
        results = results.filter(dp => 
          filters.topics!.some(topic => dp.extractedData.topics.includes(topic))
        );
      }
    }

    return results;
  }
}

// Export singleton instance
export const dataIntelligenceEngine = new DataIntelligenceEngine();

// Export helper functions
export const connectDataSource = (sourceId: string) => 
  dataIntelligenceEngine.connectDataSource(sourceId);

export const parseSlackMessages = (sourceId: string, channelIds?: string[]) => 
  dataIntelligenceEngine.parseSlackMessages(sourceId, channelIds);

export const parseAsanaTasks = (sourceId: string, projectIds?: string[]) => 
  dataIntelligenceEngine.parseAsanaTasks(sourceId, projectIds);

export const parseOneDriveFiles = (sourceId: string, folderPath?: string) => 
  dataIntelligenceEngine.parseOneDriveFiles(sourceId, folderPath);

export const generateDataMapping = () => 
  dataIntelligenceEngine.generateDataMapping();

export const getDataSourceStatus = () => 
  dataIntelligenceEngine.getDataSourceStatus();

export const searchDataPoints = (query: string, filters?: any) => 
  dataIntelligenceEngine.searchDataPoints(query, filters);
