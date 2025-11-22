import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TrendingUp,
  Users,
  Target,
  Award,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Search,
  Globe,
  FileText,
  Zap,
  Building,
  Handshake,
  PieChart
} from 'lucide-react';
import { HeroBackground, ProfessionalPhoto, OptimizedImage } from '@/components/ui/visual-assets';

import {
  dashboardService,
  RFPOpportunity,
  RevenueTargets,
  StrategicPartner,
  DashboardOverviewMetric,
  StrategicInitiative,
  KeyMetric,
  StrategicGoal,
  BudgetOverview,
  Report
} from '@/lib/dashboardService';
import { missionIntelligenceService } from '@/lib/missionIntelligenceService';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Mission, IntelligenceSource, TeamCoordination, AnalysisTool, AnalysisResult, MissionMetric } from '@/types';

interface DirectorStrategicDashboardProps {
  isOfficeMode?: boolean;
}

export const DirectorStrategicDashboard: React.FC<DirectorStrategicDashboardProps> = ({
  isOfficeMode = false
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Strategic Intelligence State
  const [searchQuery, setSearchQuery] = useState('');
  const [rfpOpportunities, setRfpOpportunities] = useState<RFPOpportunity[]>([]);
  const [revenueTargets, setRevenueTargets] = useState<RevenueTargets>({
    monthly: 0,
    quarterly: 0,
    annual: 0,
    currentMonth: 0,
    currentQuarter: 0
  });
  const [strategicPartners, setStrategicPartners] = useState<StrategicPartner[]>([]);

  // New Data States
  const [overviewMetrics, setOverviewMetrics] = useState<DashboardOverviewMetric[]>([]);
  const [strategicInitiatives, setStrategicInitiatives] = useState<StrategicInitiative[]>([]);
  const [keyMetrics, setKeyMetrics] = useState<KeyMetric[]>([]);
  const [strategicGoals, setStrategicGoals] = useState<StrategicGoal[]>([]);
  const [budgetOverview, setBudgetOverview] = useState<BudgetOverview[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  // Mission Intelligence Data
  const [missionMetrics, setMissionMetrics] = useState<MissionMetric | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [intelligenceSources, setIntelligenceSources] = useState<IntelligenceSource[]>([]);
  const [teamCoordination, setTeamCoordination] = useState<TeamCoordination | null>(null);
  const [analysisTools, setAnalysisTools] = useState<AnalysisTool[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [
          rfpData,
          revenueData,
          partnersData,
          overviewData,
          initiativesData,
          keyMetricsData,
          goalsData,
          budgetData,
          reportsData,
          missionMetricsData,
          missionsData,
          sourcesData,
          coordinationData,
          toolsData,
          resultsData
        ] = await Promise.all([
          dashboardService.getRFPOpportunities(),
          dashboardService.getRevenueTargets(),
          dashboardService.getStrategicPartners(),
          dashboardService.getOverviewMetrics(),
          dashboardService.getStrategicInitiatives(),
          dashboardService.getKeyMetrics(),
          dashboardService.getStrategicGoals(),
          dashboardService.getBudgetOverview(),
          dashboardService.getReports(),
          missionIntelligenceService.getMissionMetrics(),
          missionIntelligenceService.getMissions(),
          missionIntelligenceService.getIntelligenceSources(),
          missionIntelligenceService.getTeamCoordination(),
          missionIntelligenceService.getAnalysisTools(),
          missionIntelligenceService.getAnalysisResults()
        ]);

        setRfpOpportunities(rfpData);
        setRevenueTargets(revenueData);
        setStrategicPartners(partnersData);
        setOverviewMetrics(overviewData);
        setStrategicInitiatives(initiativesData);
        setKeyMetrics(keyMetricsData);
        setStrategicGoals(goalsData);
        setBudgetOverview(budgetData);
        setReports(reportsData);

        setMissionMetrics(missionMetricsData);
        setMissions(missionsData);
        setIntelligenceSources(sourcesData);
        setTeamCoordination(coordinationData);
        setAnalysisTools(toolsData);
        setAnalysisResults(resultsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" label="Loading Strategic Dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <div className="text-red-500 text-xl font-bold">Error</div>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isOfficeMode ? 'cyberpunk-theme' : ''}`}>
      {/* Hero Section */}
      <HeroBackground
        variant="image"
        imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=600&fit=crop"
        className="mb-8"
      >
        <div className="text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Director Strategic Dashboard
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Executive overview and strategic decision support for GooseOps Neural Empire
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Real-time Analytics
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              AI-Powered Insights
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Strategic Intelligence
            </Badge>
          </div>
        </div>
      </HeroBackground>

      <div className="px-6 pb-6">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="rfp">RFP Analysis</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewMetrics.map((metric) => (
                <Card key={metric.metric_key}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                    {metric.metric_key === 'revenue' && <DollarSign className="h-4 w-4 text-muted-foreground" />}
                    {metric.metric_key === 'active_projects' && <Target className="h-4 w-4 text-muted-foreground" />}
                    {metric.metric_key === 'team_members' && <Users className="h-4 w-4 text-muted-foreground" />}
                    {metric.metric_key === 'performance' && <TrendingUp className="h-4 w-4 text-muted-foreground" />}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${metric.trend === 'up' && metric.metric_key === 'performance' ? 'text-green-500' : ''}`}>
                      {metric.value}
                    </div>
                    <p className="text-xs text-muted-foreground">{metric.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Initiatives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategicInitiatives.map((initiative, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{initiative.name}</p>
                          <p className="text-sm text-muted-foreground">Progress: {initiative.progress}%</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">{initiative.status}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">{initiative.timeline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {keyMetrics.map((metric, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{metric.name}</span>
                        <span className={`font-medium ${metric.trend_color === 'green' ? 'text-green-500' :
                          metric.trend_color === 'red' ? 'text-red-500' :
                            metric.trend_color === 'yellow' ? 'text-yellow-500' : ''
                          }`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategicGoals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{goal.name}</p>
                          <p className="text-sm text-muted-foreground">Target: {goal.target}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">{goal.deadline}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">Progress: {goal.progress_value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Strategic Initiatives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategicInitiatives.map((initiative, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{initiative.name}</p>
                          <p className="text-sm text-muted-foreground">Progress: {initiative.progress}%</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">{initiative.status}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">{initiative.timeline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Revenue Growth</span>
                      <span className="font-medium text-green-500">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit Margin</span>
                      <span className="font-medium text-green-500">18.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Acquisition</span>
                      <span className="font-medium text-green-500">+8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Employee Retention</span>
                      <span className="font-medium text-green-500">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Average Performance</span>
                      <span className="font-medium text-green-500">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Performance</span>
                      <span className="font-medium text-green-500">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lowest Performance</span>
                      <span className="font-medium text-yellow-500">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance Trend</span>
                      <span className="font-medium text-green-500">+5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Team Members</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Hires This Month</span>
                      <span className="font-medium text-green-500">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Departures This Month</span>
                      <span className="font-medium text-red-500">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Satisfaction</span>
                      <span className="font-medium text-green-500">4.6/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Average Performance</span>
                      <span className="font-medium text-green-500">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top Performers</span>
                      <span className="font-medium text-green-500">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Needs Improvement</span>
                      <span className="font-medium text-yellow-500">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training Completed</span>
                      <span className="font-medium text-green-500">89%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgetOverview.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.category}</span>
                        <span className={`font-medium ${item.trend_color === 'green' ? 'text-green-500' :
                          item.trend_color === 'red' ? 'text-red-500' : ''
                          }`}>
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Operations</span>
                      <span className="font-medium">$2.1M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technology</span>
                      <span className="font-medium">$1.8M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing</span>
                      <span className="font-medium">$0.9M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Human Resources</span>
                      <span className="font-medium">$0.4M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.map((report, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">Generated: {report.generated_date}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">{report.status}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">{report.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Report Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Reports</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-medium text-green-500">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Generation Time</span>
                      <span className="font-medium">2.3 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-medium text-green-500">98.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* RFP Analysis Tab */}
          <TabsContent value="rfp" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">RFP/RFB Analysis & Automation</h2>
                <p className="text-muted-foreground">Track and analyze request for proposals from major convenience store chains</p>
              </div>
              <Button className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Scan for New RFPs
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* RFP Opportunities */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Active RFP Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {rfpOpportunities.map((rfp) => (
                        <Card key={rfp.id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{rfp.title}</h3>
                              <p className="text-sm text-muted-foreground">{rfp.client}</p>
                            </div>
                            <Badge variant={rfp.status === 'active' ? 'default' : 'secondary'}>
                              {rfp.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Value: </span>{rfp.value}
                            </div>
                            <div>
                              <span className="font-medium">Deadline: </span>{rfp.deadline}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Location: </span>{rfp.location}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Requirements: </span>{rfp.requirements}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">View Details</Button>
                            <Button size="sm">Prepare Response</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* RFP Analytics */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>RFP Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Value</span>
                      <span className="font-bold">$5.25M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active RFPs</span>
                      <span className="font-bold">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate</span>
                      <span className="font-bold text-green-500">73%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Response Time</span>
                      <span className="font-bold">3.2 days</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">QuikTrip</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                          </div>
                          <span className="text-sm font-medium">47%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">7-11</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
                          </div>
                          <span className="text-sm font-medium">34%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pilot</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full w-1/4"></div>
                          </div>
                          <span className="text-sm font-medium">18%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Revenue Generation Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Revenue Generation & Strategic Partnerships</h2>
                <p className="text-muted-foreground">Track revenue targets, partnership performance, and growth opportunities</p>
              </div>
              <Button className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Generate Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(revenueTargets.monthly / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground">
                    ${(revenueTargets.currentMonth / 1000).toFixed(0)}K achieved ({((revenueTargets.currentMonth / revenueTargets.monthly) * 100).toFixed(1)}%)
                  </p>
                  <Progress value={(revenueTargets.currentMonth / revenueTargets.monthly) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quarterly Target</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(revenueTargets.quarterly / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground">
                    ${(revenueTargets.currentQuarter / 1000).toFixed(0)}K achieved ({((revenueTargets.currentQuarter / revenueTargets.quarterly) * 100).toFixed(1)}%)
                  </p>
                  <Progress value={(revenueTargets.currentQuarter / revenueTargets.quarterly) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Annual Target</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(revenueTargets.annual / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground">
                    ${(revenueTargets.currentQuarter / 1000).toFixed(0)}K Q1-Q3 ({((revenueTargets.currentQuarter / revenueTargets.annual) * 100).toFixed(1)}%)
                  </p>
                  <Progress value={(revenueTargets.currentQuarter / revenueTargets.annual) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">+24.5%</div>
                  <p className="text-xs text-muted-foreground">vs last quarter</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strategic Partnerships */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="h-5 w-5" />
                    Strategic Partnerships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategicPartners.map((partner, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{partner.name}</h3>
                          <p className="text-sm text-muted-foreground">{partner.revenue} YTD</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                            {partner.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {partner.opportunities} opportunities
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Service Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Service Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Beverage Equipment Installation</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
                        </div>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">HVAC-R Service</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Maintenance Contracts</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full w-1/5"></div>
                        </div>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Strategic Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Strategic Intelligence Hub</h2>
                <p className="text-muted-foreground">Web scraping, market intelligence, and automated data collection</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search for RFP opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  Web Scrape
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Intelligence Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Intelligence Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">GovWin IQ</span>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">SAM.gov</span>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Convenience Store News</span>
                    </div>
                    <Badge variant="secondary">Monitoring</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Equipment Manufacturer Sites</span>
                    </div>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Intelligence */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Intelligence & Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">QuikTrip Multi-State Expansion RFP</h3>
                          <Badge variant="destructive">High Priority</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Discovered via web scraping - 45 locations across Oklahoma and Texas requiring full beverage equipment installation.
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Source: GovWin IQ</span>
                          <span>2 hours ago</span>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">Coca-Cola Equipment Upgrade Program</h3>
                          <Badge variant="default">Medium Priority</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          New Freestyle 900 units available - potential partnership opportunity with Coca-Cola for 7-11 locations.
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Source: Manufacturer Alert</span>
                          <span>1 day ago</span>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">HVAC-R Maintenance Contract - Pilot</h3>
                          <Badge variant="default">Medium Priority</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Annual service contract for 23 Pilot locations - includes walk-in cooler maintenance and ice machine service.
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Source: Web Crawl</span>
                          <span>3 days ago</span>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">Industry Trend: Nitro Cold Brew Systems</h3>
                          <Badge variant="secondary">Low Priority</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Increasing demand for nitrogen-infused coffee systems across convenience store chains.
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Source: Industry News</span>
                          <span>1 week ago</span>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Intelligence Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Automated Intelligence Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-6">
                    <Search className="h-6 w-6" />
                    <span>Deep Web Search</span>
                    <span className="text-xs text-muted-foreground">Advanced RFP discovery</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-6">
                    <Zap className="h-6 w-6" />
                    <span>Competitor Analysis</span>
                    <span className="text-xs text-muted-foreground">Track market positioning</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-6">
                    <Building className="h-6 w-6" />
                    <span>Partnership Intelligence</span>
                    <span className="text-xs text-muted-foreground">Identify collaboration opportunities</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};