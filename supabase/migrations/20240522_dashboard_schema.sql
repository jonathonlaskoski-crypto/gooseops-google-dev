-- Dashboard Schema Migration
-- Created: 2024-05-22
-- Description: Schema for Director Strategic Dashboard

-- 1. RFP Opportunities
CREATE TABLE IF NOT EXISTS rfp_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    value TEXT NOT NULL,
    deadline DATE NOT NULL,
    status TEXT CHECK (status IN ('active', 'prospect', 'closed')),
    location TEXT,
    requirements TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Revenue Targets (Single row for current targets)
CREATE TABLE IF NOT EXISTS revenue_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monthly NUMERIC NOT NULL,
    quarterly NUMERIC NOT NULL,
    annual NUMERIC NOT NULL,
    current_month NUMERIC NOT NULL,
    current_quarter NUMERIC NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Strategic Partners
CREATE TABLE IF NOT EXISTS strategic_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'prospect', 'inactive')),
    revenue TEXT,
    opportunities INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Dashboard Overview Metrics
CREATE TABLE IF NOT EXISTS dashboard_overview_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_key TEXT NOT NULL UNIQUE, -- e.g., 'revenue', 'active_projects'
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    change TEXT,
    trend TEXT CHECK (trend IN ('up', 'down', 'neutral')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Strategic Initiatives
CREATE TABLE IF NOT EXISTS strategic_initiatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    progress INTEGER NOT NULL, -- 0-100
    status TEXT NOT NULL, -- 'On Track', 'Delayed', etc.
    timeline TEXT, -- 'Q2 2024'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Key Metrics
CREATE TABLE IF NOT EXISTS key_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    trend_color TEXT, -- 'green', 'red', 'yellow', 'default'
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Strategic Goals
CREATE TABLE IF NOT EXISTS strategic_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    target TEXT NOT NULL,
    progress_value TEXT NOT NULL,
    deadline TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Budget Overview
CREATE TABLE IF NOT EXISTS budget_overview (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- 'Total', 'Allocated', 'Spent', 'Remaining'
    amount TEXT NOT NULL,
    trend_color TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Budget Categories (Breakdown)
CREATE TABLE IF NOT EXISTS budget_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    amount TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Reports
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    generated_date DATE NOT NULL,
    status TEXT NOT NULL,
    type TEXT DEFAULT 'PDF',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED DATA

-- RFP Opportunities
INSERT INTO rfp_opportunities (title, client, value, deadline, status, location, requirements) VALUES
('Multi-Site Beverage Equipment Installation - QuikTrip', 'QuikTrip Corporation', '$2.5M', '2025-02-15', 'active', 'Oklahoma, Texas, Kansas', 'Coca-Cola Freestyle, FBD dispensers, glycol chillers'),
('HVAC-R Service Contract - 7-11', '7-11 Stores', '$1.8M', '2025-01-30', 'active', 'Oklahoma, Arkansas', 'Walk-in coolers, ice machines, climate control'),
('Pilot Flying J Equipment Upgrades', 'Pilot Travel Centers', '$950K', '2025-03-01', 'prospect', 'Oklahoma Turnpike locations', 'QTea systems, Nitro Coffee, Micromatic keg systems');

-- Revenue Targets
INSERT INTO revenue_targets (monthly, quarterly, annual, current_month, current_quarter) VALUES
(450000, 1350000, 5400000, 387500, 1125000);

-- Strategic Partners
INSERT INTO strategic_partners (name, status, revenue, opportunities) VALUES
('Coca-Cola', 'active', '$2.1M YTD', 12),
('FBD', 'active', '$890K YTD', 8),
('Micromatic', 'prospect', '$0', 5),
('QTea', 'active', '$675K YTD', 15);

-- Dashboard Overview Metrics
INSERT INTO dashboard_overview_metrics (metric_key, label, value, change, trend) VALUES
('revenue', 'Revenue', '$2.4M', '+12% from last month', 'up'),
('active_projects', 'Active Projects', '24', '8 completed this week', 'up'),
('team_members', 'Team Members', '156', '+3 new hires', 'up'),
('performance', 'Performance', '94%', 'Above target', 'up');

-- Strategic Initiatives
INSERT INTO strategic_initiatives (name, progress, status, timeline) VALUES
('Digital Transformation', 75, 'On Track', 'Q2 2024'),
('Market Expansion', 60, 'On Track', 'Q3 2024'),
('Operational Excellence', 85, 'On Track', 'Q1 2024');

-- Key Metrics
INSERT INTO key_metrics (name, value, trend_color) VALUES
('Customer Satisfaction', '4.8/5', 'green'),
('Employee Engagement', '87%', 'green'),
('Market Share', '23.5%', 'default'),
('ROI', '18.2%', 'green');

-- Strategic Goals
INSERT INTO strategic_goals (name, target, progress_value, deadline) VALUES
('Increase Market Share', '25%', '23.5%', 'Q4 2024'),
('Digital Innovation', '5 products', '3 products', 'Q3 2024'),
('Operational Efficiency', '20%', '18%', 'Q2 2024');

-- Budget Overview
INSERT INTO budget_overview (category, amount, trend_color) VALUES
('Total Budget', '$5.2M', 'default'),
('Allocated', '$4.8M', 'default'),
('Spent', '$3.2M', 'default'),
('Remaining', '$2.0M', 'green');

-- Budget Categories
INSERT INTO budget_categories (name, amount) VALUES
('Operations', '$2.1M'),
('Technology', '$1.8M'),
('Marketing', '$0.9M'),
('Human Resources', '$0.4M');

-- Reports
INSERT INTO reports (name, generated_date, status, type) VALUES
('Q4 Financial Report', '2024-01-15', 'Complete', 'PDF'),
('Performance Analysis', '2024-01-14', 'Complete', 'PDF'),
('Strategic Review', '2024-01-13', 'Complete', 'PDF');

-- 11. Missions
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Intelligence Sources
CREATE TABLE IF NOT EXISTS intelligence_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Team Coordination
CREATE TABLE IF NOT EXISTS team_coordination (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_teams INTEGER DEFAULT 0,
    support_teams INTEGER DEFAULT 0,
    coordination_level TEXT DEFAULT 'Excellent',
    communication_status TEXT DEFAULT 'Active',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Analysis Tools
CREATE TABLE IF NOT EXISTS analysis_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Analysis Results
CREATE TABLE IF NOT EXISTS analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patterns_identified INTEGER DEFAULT 0,
    predictions_made INTEGER DEFAULT 0,
    accuracy_rate NUMERIC DEFAULT 0,
    insights_generated INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Mission Metrics (for overview)
CREATE TABLE IF NOT EXISTS mission_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    active_missions INTEGER DEFAULT 0,
    success_rate NUMERIC DEFAULT 0,
    intelligence_sources_count INTEGER DEFAULT 0,
    team_readiness NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED DATA for new tables

-- Missions
INSERT INTO missions (name, type, status) VALUES
('Operation Alpha', 'Intelligence Gathering', 'In Progress'),
('Operation Beta', 'Surveillance', 'In Progress'),
('Operation Gamma', 'Analysis', 'Planning'),
('Operation Delta', 'Coordination', 'Completed');

-- Intelligence Sources
INSERT INTO intelligence_sources (name, status) VALUES
('Satellite Imagery', 'Active'),
('Ground Sensors', 'Active'),
('Human Intelligence', 'Active'),
('Signal Intelligence', 'Active'),
('Open Source', 'Active');

-- Team Coordination
INSERT INTO team_coordination (field_teams, support_teams) VALUES (8, 12);

-- Analysis Tools
INSERT INTO analysis_tools (name, status) VALUES
('Pattern Recognition', 'Active'),
('Predictive Modeling', 'Active'),
('Data Mining', 'Active'),
('Machine Learning', 'Active');

-- Analysis Results
INSERT INTO analysis_results (patterns_identified, predictions_made, accuracy_rate, insights_generated) VALUES (47, 23, 94.2, 89);

-- Mission Metrics
INSERT INTO mission_metrics (active_missions, success_rate, intelligence_sources_count, team_readiness) VALUES (12, 94.2, 8, 87.5);
