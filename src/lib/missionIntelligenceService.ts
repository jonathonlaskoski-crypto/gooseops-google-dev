import { supabase } from './supabaseClient';
import type { Mission, IntelligenceSource, TeamCoordination, AnalysisTool, AnalysisResult, MissionMetric } from '../types';

export const missionIntelligenceService = {
    async getMissionMetrics(): Promise<MissionMetric> {
        const { data, error } = await supabase
            .from('mission_metrics')
            .select('*')
            .single();

        if (error) {
            console.error('Error fetching mission metrics:', error);
            return {
                id: '',
                active_missions: 0,
                success_rate: 0,
                intelligence_sources_count: 0,
                team_readiness: 0,
                updated_at: ''
            };
        }

        return data as MissionMetric;
    },

    async getMissions(): Promise<Mission[]> {
        const { data, error } = await supabase
            .from('missions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching missions:', error);
            return [];
        }

        return data as Mission[];
    },

    async getIntelligenceSources(): Promise<IntelligenceSource[]> {
        const { data, error } = await supabase
            .from('intelligence_sources')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching intelligence sources:', error);
            return [];
        }

        return data as IntelligenceSource[];
    },

    async getTeamCoordination(): Promise<TeamCoordination> {
        const { data, error } = await supabase
            .from('team_coordination')
            .select('*')
            .single();

        if (error) {
            console.error('Error fetching team coordination:', error);
            return {
                id: '',
                field_teams: 0,
                support_teams: 0,
                coordination_level: 'good',
                communication_status: 'active',
                updated_at: ''
            };
        }

        return data as TeamCoordination;
    },

    async getAnalysisTools(): Promise<AnalysisTool[]> {
        const { data, error } = await supabase
            .from('analysis_tools')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching analysis tools:', error);
            return [];
        }

        return data as AnalysisTool[];
    },

    async getAnalysisResults(): Promise<AnalysisResult> {
        const { data, error } = await supabase
            .from('analysis_results')
            .select('*')
            .single();

        if (error) {
            console.error('Error fetching analysis results:', error);
            return {
                id: '',
                patterns_identified: 0,
                predictions_made: 0,
                accuracy_rate: 0,
                insights_generated: 0,
                updated_at: ''
            };
        }

        return data as AnalysisResult;
    },

    async getReports(): Promise<any[]> {  // Reuse from dashboardService or extend
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('generated_date', { ascending: false });

        if (error) {
            console.error('Error fetching reports:', error);
            return [];
        }

        return data;
    }
};
