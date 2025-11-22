// Director of Strategic Partnerships Profile
// High-level access to revenue building and partnership tools

export interface DirectorProfile {
  id: string;
  name: string;
  title: 'Director of Strategic Partnerships';
  role: 'director';
  permissions: DirectorPermissions;
  revenueTargets: RevenueTargets;
  partnershipPortfolio: PartnershipPortfolio;
  strategicInitiatives: StrategicInitiative[];
  accessLevel: 'director' | 'executive' | 'admin';
  lastLogin: Date;
  preferences: DirectorPreferences;
}

export interface DirectorPermissions {
  canViewRevenue: boolean;
  canManagePartnerships: boolean;
  canAccessStrategicData: boolean;
  canCreateContracts: boolean;
  canManageBudgets: boolean;
  canViewAnalytics: boolean;
  canExportReports: boolean;
  canManageTeams: boolean;
  canAccessAllModules: boolean;
  canOverridePermissions: boolean;
}

export interface RevenueTargets {
  quarterly: number;
  annual: number;
  monthly: number;
  currentProgress: number;
  projectedCompletion: Date;
  keyMetrics: RevenueMetric[];
}

export interface RevenueMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  importance: 'critical' | 'high' | 'medium' | 'low';
  lastUpdated: Date;
}

export interface PartnershipPortfolio {
  activePartnerships: Partnership[];
  potentialPartnerships: Partnership[];
  terminatedPartnerships: Partnership[];
  totalValue: number;
  successRate: number;
  averageDealSize: number;
}

export interface Partnership {
  id: string;
  name: string;
  type: 'strategic' | 'revenue' | 'technology' | 'distribution' | 'joint_venture';
  status: 'active' | 'negotiating' | 'proposed' | 'terminated' | 'expired';
  value: number;
  startDate: Date;
  endDate?: Date;
  contactPerson: string;
  company: string;
  description: string;
  keyTerms: string[];
  milestones: PartnershipMilestone[];
  revenueGenerated: number;
  strategicValue: number;
  riskLevel: 'low' | 'medium' | 'high';
  renewalDate?: Date;
  tags: string[];
}

export interface PartnershipMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  value: number;
  dependencies: string[];
}

export interface StrategicInitiative {
  id: string;
  name: string;
  description: string;
  objective: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'critical' | 'high' | 'medium' | 'low';
  startDate: Date;
  targetDate: Date;
  budget: number;
  allocatedResources: string[];
  keyStakeholders: string[];
  successMetrics: string[];
  progress: number;
  risks: string[];
  opportunities: string[];
}

export interface DirectorPreferences {
  dashboardLayout: 'revenue_focused' | 'partnership_focused' | 'strategic_focused' | 'balanced';
  defaultTimeframe: 'quarterly' | 'monthly' | 'annual';
  notificationSettings: {
    revenueAlerts: boolean;
    partnershipUpdates: boolean;
    strategicMilestones: boolean;
    riskAlerts: boolean;
    opportunityAlerts: boolean;
  };
  favoriteMetrics: string[];
  customReports: string[];
  theme: 'professional' | 'cyberpunk' | 'minimal';
}

export interface RevenueOpportunity {
  id: string;
  name: string;
  description: string;
  potentialValue: number;
  probability: number;
  timeframe: string;
  source: string;
  status: 'identified' | 'qualifying' | 'proposing' | 'negotiating' | 'closed_won' | 'closed_lost';
  nextAction: string;
  owner: string;
  lastUpdated: Date;
  tags: string[];
}

export interface StrategicAnalysis {
  id: string;
  title: string;
  type: 'market_analysis' | 'competitive_intelligence' | 'partnership_assessment' | 'revenue_forecast';
  content: string;
  insights: string[];
  recommendations: string[];
  confidence: number;
  lastUpdated: Date;
  source: string;
  tags: string[];
}

export class DirectorProfileManager {
  private profile: DirectorProfile;
  private revenueOpportunities: Map<string, RevenueOpportunity> = new Map();
  private strategicAnalyses: Map<string, StrategicAnalysis> = new Map();

  constructor() {
    this.profile = this.initializeDirectorProfile();
    this.loadRevenueOpportunities();
    this.loadStrategicAnalyses();
  }

  private initializeDirectorProfile(): DirectorProfile {
    return {
      id: 'director_001',
      name: 'Director of Strategic Partnerships',
      title: 'Director of Strategic Partnerships',
      role: 'director',
      permissions: {
        canViewRevenue: true,
        canManagePartnerships: true,
        canAccessStrategicData: true,
        canCreateContracts: true,
        canManageBudgets: true,
        canViewAnalytics: true,
        canExportReports: true,
        canManageTeams: true,
        canAccessAllModules: true,
        canOverridePermissions: true
      },
      revenueTargets: {
        quarterly: 2500000,
        annual: 10000000,
        monthly: 833333,
        currentProgress: 0.68,
        projectedCompletion: new Date('2024-12-31'),
        keyMetrics: [
          {
            id: 'revenue_q1',
            name: 'Q1 Revenue',
            value: 2100000,
            target: 2500000,
            trend: 'up',
            importance: 'critical',
            lastUpdated: new Date()
          },
          {
            id: 'new_partnerships',
            name: 'New Partnerships',
            value: 12,
            target: 15,
            trend: 'up',
            importance: 'high',
            lastUpdated: new Date()
          },
          {
            id: 'deal_size_avg',
            name: 'Average Deal Size',
            value: 450000,
            target: 500000,
            trend: 'stable',
            importance: 'high',
            lastUpdated: new Date()
          }
        ]
      },
      partnershipPortfolio: {
        activePartnerships: [],
        potentialPartnerships: [],
        terminatedPartnerships: [],
        totalValue: 0,
        successRate: 0.85,
        averageDealSize: 450000
      },
      strategicInitiatives: [],
      accessLevel: 'director',
      lastLogin: new Date(),
      preferences: {
        dashboardLayout: 'revenue_focused',
        defaultTimeframe: 'quarterly',
        notificationSettings: {
          revenueAlerts: true,
          partnershipUpdates: true,
          strategicMilestones: true,
          riskAlerts: true,
          opportunityAlerts: true
        },
        favoriteMetrics: ['revenue_q1', 'new_partnerships', 'deal_size_avg'],
        customReports: ['revenue_forecast', 'partnership_pipeline', 'strategic_analysis'],
        theme: 'professional'
      }
    };
  }

  private loadRevenueOpportunities(): void {
    const opportunities: RevenueOpportunity[] = [
      {
        id: 'opp_001',
        name: 'Enterprise SaaS Partnership',
        description: 'Strategic partnership with major enterprise software provider',
        potentialValue: 2000000,
        probability: 0.75,
        timeframe: 'Q2 2024',
        source: 'Industry Conference',
        status: 'negotiating',
        nextAction: 'Finalize contract terms',
        owner: 'Director of Strategic Partnerships',
        lastUpdated: new Date(),
        tags: ['enterprise', 'saas', 'strategic']
      },
      {
        id: 'opp_002',
        name: 'Technology Integration Deal',
        description: 'Technology integration partnership with AI/ML platform',
        potentialValue: 1500000,
        probability: 0.60,
        timeframe: 'Q3 2024',
        source: 'Referral',
        status: 'proposing',
        nextAction: 'Present proposal to stakeholders',
        owner: 'Director of Strategic Partnerships',
        lastUpdated: new Date(),
        tags: ['technology', 'ai', 'integration']
      },
      {
        id: 'opp_003',
        name: 'Distribution Channel Expansion',
        description: 'Expand distribution through regional partners',
        potentialValue: 800000,
        probability: 0.85,
        timeframe: 'Q2 2024',
        source: 'Market Research',
        status: 'qualifying',
        nextAction: 'Schedule partner meetings',
        owner: 'Director of Strategic Partnerships',
        lastUpdated: new Date(),
        tags: ['distribution', 'expansion', 'regional']
      }
    ];

    opportunities.forEach(opp => {
      this.revenueOpportunities.set(opp.id, opp);
    });
  }

  private loadStrategicAnalyses(): void {
    const analyses: StrategicAnalysis[] = [
      {
        id: 'analysis_001',
        title: 'Market Opportunity Assessment',
        type: 'market_analysis',
        content: 'Comprehensive analysis of strategic partnership opportunities in the enterprise software market.',
        insights: [
          'Enterprise software market growing at 12% CAGR',
          'AI/ML integration partnerships showing highest ROI',
          'Regional distribution channels underutilized'
        ],
        recommendations: [
          'Focus on AI/ML platform partnerships',
          'Expand regional distribution network',
          'Develop enterprise-focused solutions'
        ],
        confidence: 0.92,
        lastUpdated: new Date(),
        source: 'Market Research Team',
        tags: ['market', 'opportunity', 'enterprise']
      },
      {
        id: 'analysis_002',
        title: 'Competitive Intelligence Report',
        type: 'competitive_intelligence',
        content: 'Analysis of competitor partnership strategies and market positioning.',
        insights: [
          'Competitors focusing on technology partnerships',
          'Market consolidation creating opportunities',
          'Customer demand for integrated solutions'
        ],
        recommendations: [
          'Accelerate partnership development',
          'Focus on differentiated value propositions',
          'Leverage customer feedback for positioning'
        ],
        confidence: 0.88,
        lastUpdated: new Date(),
        source: 'Competitive Intelligence',
        tags: ['competitive', 'intelligence', 'strategy']
      }
    ];

    analyses.forEach(analysis => {
      this.strategicAnalyses.set(analysis.id, analysis);
    });
  }

  public getProfile(): DirectorProfile {
    return this.profile;
  }

  public updateProfile(updates: Partial<DirectorProfile>): void {
    this.profile = { ...this.profile, ...updates };
    this.saveProfile();
  }

  public getRevenueOpportunities(): RevenueOpportunity[] {
    return Array.from(this.revenueOpportunities.values());
  }

  public addRevenueOpportunity(opportunity: Omit<RevenueOpportunity, 'id' | 'lastUpdated'>): string {
    const id = `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newOpportunity: RevenueOpportunity = {
      ...opportunity,
      id,
      lastUpdated: new Date()
    };
    this.revenueOpportunities.set(id, newOpportunity);
    this.saveRevenueOpportunities();
    return id;
  }

  public updateRevenueOpportunity(id: string, updates: Partial<RevenueOpportunity>): boolean {
    const opportunity = this.revenueOpportunities.get(id);
    if (!opportunity) return false;

    const updatedOpportunity = { ...opportunity, ...updates, lastUpdated: new Date() };
    this.revenueOpportunities.set(id, updatedOpportunity);
    this.saveRevenueOpportunities();
    return true;
  }

  public getStrategicAnalyses(): StrategicAnalysis[] {
    return Array.from(this.strategicAnalyses.values());
  }

  public addStrategicAnalysis(analysis: Omit<StrategicAnalysis, 'id' | 'lastUpdated'>): string {
    const id = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAnalysis: StrategicAnalysis = {
      ...analysis,
      id,
      lastUpdated: new Date()
    };
    this.strategicAnalyses.set(id, newAnalysis);
    this.saveStrategicAnalyses();
    return id;
  }

  public getRevenueForecast(): any {
    const opportunities = this.getRevenueOpportunities();
    const totalPotential = opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0);
    const weightedValue = opportunities.reduce((sum, opp) => sum + (opp.potentialValue * opp.probability), 0);
    
    return {
      totalPotential,
      weightedValue,
      opportunityCount: opportunities.length,
      averageProbability: opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length,
      quarterlyProjection: weightedValue * 0.25, // Assuming 25% closes per quarter
      annualProjection: weightedValue * 0.8 // Assuming 80% closes annually
    };
  }

  public getPartnershipPipeline(): any {
    const opportunities = this.getRevenueOpportunities();
    const pipeline = {
      identified: opportunities.filter(opp => opp.status === 'identified').length,
      qualifying: opportunities.filter(opp => opp.status === 'qualifying').length,
      proposing: opportunities.filter(opp => opp.status === 'proposing').length,
      negotiating: opportunities.filter(opp => opp.status === 'negotiating').length,
      closed_won: opportunities.filter(opp => opp.status === 'closed_won').length,
      closed_lost: opportunities.filter(opp => opp.status === 'closed_lost').length
    };

    return pipeline;
  }

  public getStrategicMetrics(): any {
    const profile = this.getProfile();
    const opportunities = this.getRevenueOpportunities();
    const analyses = this.getStrategicAnalyses();

    return {
      revenueProgress: profile.revenueTargets.currentProgress,
      quarterlyTarget: profile.revenueTargets.quarterly,
      currentRevenue: profile.revenueTargets.quarterly * profile.revenueTargets.currentProgress,
      activeOpportunities: opportunities.filter(opp => opp.status !== 'closed_won' && opp.status !== 'closed_lost').length,
      totalPipelineValue: opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0),
      strategicAnalyses: analyses.length,
      partnershipSuccessRate: profile.partnershipPortfolio.successRate,
      averageDealSize: profile.partnershipPortfolio.averageDealSize
    };
  }

  private saveProfile(): void {
    try {
      localStorage.setItem('director-profile', JSON.stringify(this.profile));
    } catch (error) {
      console.error('Failed to save director profile:', error);
    }
  }

  private saveRevenueOpportunities(): void {
    try {
      const opportunities = Array.from(this.revenueOpportunities.entries());
      localStorage.setItem('revenue-opportunities', JSON.stringify(opportunities));
    } catch (error) {
      console.error('Failed to save revenue opportunities:', error);
    }
  }

  private saveStrategicAnalyses(): void {
    try {
      const analyses = Array.from(this.strategicAnalyses.entries());
      localStorage.setItem('strategic-analyses', JSON.stringify(analyses));
    } catch (error) {
      console.error('Failed to save strategic analyses:', error);
    }
  }

  public loadFromStorage(): void {
    try {
      const profileData = localStorage.getItem('director-profile');
      if (profileData) {
        this.profile = JSON.parse(profileData);
      }

      const opportunitiesData = localStorage.getItem('revenue-opportunities');
      if (opportunitiesData) {
        const opportunities = JSON.parse(opportunitiesData);
        this.revenueOpportunities = new Map(opportunities);
      }

      const analysesData = localStorage.getItem('strategic-analyses');
      if (analysesData) {
        const analyses = JSON.parse(analysesData);
        this.strategicAnalyses = new Map(analyses);
      }
    } catch (error) {
      console.error('Failed to load director data:', error);
    }
  }

  public exportData(): string {
    const exportData = {
      profile: this.profile,
      revenueOpportunities: Array.from(this.revenueOpportunities.entries()),
      strategicAnalyses: Array.from(this.strategicAnalyses.entries()),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  }

  public clearData(): void {
    this.revenueOpportunities.clear();
    this.strategicAnalyses.clear();
    localStorage.removeItem('director-profile');
    localStorage.removeItem('revenue-opportunities');
    localStorage.removeItem('strategic-analyses');
  }
}

// Export singleton instance
export const directorProfile = new DirectorProfileManager();
