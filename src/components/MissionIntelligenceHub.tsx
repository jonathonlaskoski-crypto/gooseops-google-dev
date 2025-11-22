import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Target, Brain, Zap, Activity, TrendingUp, Database, Server, Loader2 } from 'lucide-react';
import { missionIntelligenceService } from '@/lib/missionIntelligenceService';
import type { Mission, IntelligenceSource, TeamCoordination, AnalysisTool, AnalysisResult, MissionMetric } from '@/types';

interface MissionIntelligenceHubProps {
  isOfficeMode?: boolean;
}

export const MissionIntelligenceHub: React.FC<MissionIntelligenceHubProps> = ({
  isOfficeMode = false
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [missionMetrics, setMissionMetrics] = useState<MissionMetric | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [intelligenceSources, setIntelligenceSources] = useState<IntelligenceSource[]>([]);
  const [teamCoordination, setTeamCoordination] = useState<TeamCoordination | null>(null);
  const [analysisTools, setAnalysisTools] = useState<AnalysisTool[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [metrics, missionsData, sources, coordination, tools, results, reportsData] = await Promise.all([
          missionIntelligenceService.getMissionMetrics(),
          missionIntelligenceService.getMissions(),
          missionIntelligenceService.getIntelligenceSources(),
          missionIntelligenceService.getTeamCoordination(),
          missionIntelligenceService.getAnalysisTools(),
          missionIntelligenceService.getAnalysisResults(),
          missionIntelligenceService.getReports()
        ]);

        setMissionMetrics(metrics);
        setMissions(missionsData);
        setIntelligenceSources(sources);
        setTeamCoordination(coordination);
        setAnalysisTools(tools);
        setAnalysisResults(results);
        setReports(reportsData);
      } catch (err) {
        setError('Failed to load mission intelligence data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`p-6 ${isOfficeMode ? 'cyberpunk-theme' : ''}`}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading Mission Intelligence...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${isOfficeMode ? 'cyberpunk-theme' : ''}`}>
        <div className="flex items-center justify-center h-64 text-destructive">
          <Server className="h-8 w-8 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Derive mission status counts
  const missionStatusCounts = missions.reduce((acc, mission) => {
    acc[mission.status] = (acc[mission.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Derive intelligence feed data
  const totalAnalysis = reports.length;
  const activeSources = intelligenceSources.filter(s => s.status === 'active').length;
  const alerts = 3; // Static for now, can be from notifications table later

  // Derive report stats
  const totalReports = reports.length;
  const avgLength = 12; // Static
  const processingTime = '45 minutes'; // Static
  const distribution = 24; // Static

  return (
    <div className={`p-6 ${isOfficeMode ? 'cyberpunk-theme' : ''}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mission Intelligence Hub</h1>
        <p className="text-muted-foreground">
          Advanced mission planning and intelligence coordination platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="coordination">Coordination</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Missions</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{missionMetrics?.active_missions || 0}</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{(missionMetrics?.success_rate || 0).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">+1.2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Intelligence Sources</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{missionMetrics?.intelligence_sources_count || 0}</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Readiness</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{(missionMetrics?.team_readiness || 0).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Optimal performance</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mission Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Planning</span>
                    <Badge variant="secondary">{missionStatusCounts.planning || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>In Progress</span>
                    <Badge variant="default">{missionStatusCounts['in_progress'] || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed</span>
                    <Badge variant="outline">{missionStatusCounts.completed || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>On Hold</span>
                    <Badge variant="destructive">{missionStatusCounts['on_hold'] || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intelligence Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Real-time Updates</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Sources</span>
                    <Badge variant="secondary">{activeSources}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Analysis Complete</span>
                    <Badge variant="outline">{totalAnalysis}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alerts</span>
                    <Badge variant="destructive">{alerts}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="missions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Missions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {missions.slice(0, 4).map((mission) => (
                    <div key={mission.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{mission.name}</p>
                        <p className="text-sm text-muted-foreground">{mission.type}</p>
                      </div>
                      <Badge variant={mission.status === 'completed' ? 'outline' : mission.status === 'planning' ? 'secondary' : 'default'}>
                        {mission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mission Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-medium text-green-500">{(missionMetrics?.success_rate || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Duration</span>
                    <span className="font-medium">3.2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resource Utilization</span>
                    <span className="font-medium">87.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Team Efficiency</span>
                    <span className="font-medium">91.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Intelligence Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intelligenceSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between">
                      <span>{source.name}</span>
                      <Badge variant="default">{source.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intelligence Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Reports Generated</span>
                    <span className="font-medium">{totalReports}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analysis Accuracy</span>
                    <span className="font-medium text-green-500">{(analysisResults?.accuracy_rate || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Time</span>
                    <span className="font-medium">2.3 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Volume</span>
                    <span className="font-medium">2.4 TB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="coordination" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Coordination</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Field Teams</span>
                    <Badge variant="default">{teamCoordination?.field_teams || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Support Teams</span>
                    <Badge variant="secondary">{teamCoordination?.support_teams || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Coordination Level</span>
                    <Badge variant="outline">{teamCoordination?.coordination_level || 'Excellent'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Communication Status</span>
                    <Badge variant="default">{teamCoordination?.communication_status || 'Active'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Personnel</span>
                    <span className="font-medium">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipment</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicles</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technology</span>
                    <span className="font-medium">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytical Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisTools.map((tool) => (
                    <div key={tool.id} className="flex items-center justify-between">
                      <span>{tool.name}</span>
                      <Badge variant="default">{tool.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Patterns Identified</span>
                    <span className="font-medium">{analysisResults?.patterns_identified || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Predictions Made</span>
                    <span className="font-medium">{analysisResults?.predictions_made || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy Rate</span>
                    <span className="font-medium text-green-500">{(analysisResults?.accuracy_rate || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insights Generated</span>
                    <span className="font-medium">{analysisResults?.insights_generated || 0}</span>
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
                <CardTitle>Report Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Daily Reports</span>
                    <Badge variant="default">Generated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weekly Summaries</span>
                    <Badge variant="default">Generated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Monthly Analysis</span>
                    <Badge variant="default">Generated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Special Reports</span>
                    <Badge variant="secondary">{reports.filter(r => r.type === 'PDF').length}</Badge>
                  </div>
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
                    <span className="font-medium">{totalReports}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Length</span>
                    <span className="font-medium">{avgLength} pages</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Time</span>
                    <span className="font-medium">{processingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distribution</span>
                    <span className="font-medium">{distribution} recipients</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};