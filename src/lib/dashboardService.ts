import { supabase } from './supabaseClient';

export interface RFPOpportunity {
  id: string;
  title: string;
  client: string;
  value: string;
  deadline: string;
  status: 'active' | 'prospect' | 'closed';
  location: string;
  requirements: string;
}

export interface RevenueTargets {
  monthly: number;
  quarterly: number;
  annual: number;
  currentMonth: number;
  currentQuarter: number;
}

export interface StrategicPartner {
  name: string;
  status: 'active' | 'prospect' | 'inactive';
  revenue: string;
  opportunities: number;
}

export interface DashboardOverviewMetric {
  metric_key: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface StrategicInitiative {
  name: string;
  progress: number;
  status: string;
  timeline: string;
}

export interface KeyMetric {
  name: string;
  value: string;
  trend_color: string;
}

export interface StrategicGoal {
  name: string;
  target: string;
  progress_value: string;
  deadline: string;
}

export interface BudgetOverview {
  category: string;
  amount: string;
  trend_color: string;
}

export interface Report {
  name: string;
  generated_date: string;
  status: string;
  type: string;
}

// Mock data (preserved for reference)
/*
const MOCK_RFP_OPPORTUNITIES: RFPOpportunity[] = [
  {
    id: 'RFP-001',
    title: 'Multi-Site Beverage Equipment Installation - QuikTrip',
    client: 'QuikTrip Corporation',
    value: '$2.5M',
    deadline: '2025-02-15',
    status: 'active',
    location: 'Oklahoma, Texas, Kansas',
    requirements: 'Coca-Cola Freestyle, FBD dispensers, glycol chillers'
  },
  {
    id: 'RFP-002',
    title: 'HVAC-R Service Contract - 7-11',
    client: '7-11 Stores',
    value: '$1.8M',
    deadline: '2025-01-30',
    status: 'active',
    location: 'Oklahoma, Arkansas',
    requirements: 'Walk-in coolers, ice machines, climate control'
  },
  {
    id: 'RFB-003',
    title: 'Pilot Flying J Equipment Upgrades',
    client: 'Pilot Travel Centers',
    value: '$950K',
    deadline: '2025-03-01',
    status: 'prospect',
    location: 'Oklahoma Turnpike locations',
    requirements: 'QTea systems, Nitro Coffee, Micromatic keg systems'
  }
];

const MOCK_REVENUE_TARGETS: RevenueTargets = {
  monthly: 450000,
  quarterly: 1350000,
  annual: 5400000,
  currentMonth: 387500,
  currentQuarter: 1125000
};

const MOCK_STRATEGIC_PARTNERS: StrategicPartner[] = [
  { name: 'Coca-Cola', status: 'active', revenue: '$2.1M YTD', opportunities: 12 },
  { name: 'FBD', status: 'active', revenue: '$890K YTD', opportunities: 8 },
  { name: 'Micromatic', status: 'prospect', revenue: '$0', opportunities: 5 },
  { name: 'QTea', status: 'active', revenue: '$675K YTD', opportunities: 15 }
];
*/

export const dashboardService = {
  async getRFPOpportunities(): Promise<RFPOpportunity[]> {
    const { data, error } = await supabase
      .from('rfp_opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching RFP opportunities:', error);
      return [];
    }

    return data as RFPOpportunity[];
  },

  async getRevenueTargets(): Promise<RevenueTargets> {
    const { data, error } = await supabase
      .from('revenue_targets')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching revenue targets:', error);
      return {
        monthly: 0,
        quarterly: 0,
        annual: 0,
        currentMonth: 0,
        currentQuarter: 0
      };
    }

    // Map snake_case to camelCase
    return {
      monthly: data.monthly,
      quarterly: data.quarterly,
      annual: data.annual,
      currentMonth: data.current_month,
      currentQuarter: data.current_quarter
    };
  },

  async getStrategicPartners(): Promise<StrategicPartner[]> {
    const { data, error } = await supabase
      .from('strategic_partners')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching strategic partners:', error);
      return [];
    }

    return data as StrategicPartner[];
  },

  async getOverviewMetrics(): Promise<DashboardOverviewMetric[]> {
    const { data, error } = await supabase
      .from('dashboard_overview_metrics')
      .select('*');

    if (error) {
      console.error('Error fetching overview metrics:', error);
      return [];
    }
    return data as DashboardOverviewMetric[];
  },

  async getStrategicInitiatives(): Promise<StrategicInitiative[]> {
    const { data, error } = await supabase
      .from('strategic_initiatives')
      .select('*');

    if (error) {
      console.error('Error fetching strategic initiatives:', error);
      return [];
    }
    return data as StrategicInitiative[];
  },

  async getKeyMetrics(): Promise<KeyMetric[]> {
    const { data, error } = await supabase
      .from('key_metrics')
      .select('*');

    if (error) {
      console.error('Error fetching key metrics:', error);
      return [];
    }
    return data as KeyMetric[];
  },

  async getStrategicGoals(): Promise<StrategicGoal[]> {
    const { data, error } = await supabase
      .from('strategic_goals')
      .select('*');

    if (error) {
      console.error('Error fetching strategic goals:', error);
      return [];
    }
    return data as StrategicGoal[];
  },

  async getBudgetOverview(): Promise<BudgetOverview[]> {
    const { data, error } = await supabase
      .from('budget_overview')
      .select('*');

    if (error) {
      console.error('Error fetching budget overview:', error);
      return [];
    }
    return data as BudgetOverview[];
  },

  async getReports(): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('generated_date', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
    return data as Report[];
  }
};
