import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  TrendingUp, 
  Database, 
  MessageSquare, 
  AlertTriangle, 
  RefreshCw, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Zap, 
  Settings, 
  Filter 
} from 'lucide-react';

interface DataIntelligenceDashboardProps {
  isOfficeMode?: boolean;
}

export const DataIntelligenceDashboard: React.FC<DataIntelligenceDashboardProps> = ({ 
  isOfficeMode = false 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={`p-6 ${isOfficeMode ? 'cyberpunk-theme' : ''}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Data Intelligence Dashboard</h1>
        <p className="text-muted-foreground">
          Advanced analytics and data insights for strategic decision making
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Active: 22</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4TB</div>
                <p className="text-xs text-muted-foreground">+15% this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing Speed</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">98.5%</div>
                <p className="text-xs text-muted-foreground">Excellent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Insights Generated</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">1,234</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Completeness</p>
                      <p className="text-sm text-muted-foreground">95.2%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Excellent</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Target: 95%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Accuracy</p>
                      <p className="text-sm text-muted-foreground">98.7%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Excellent</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Target: 98%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Consistency</p>
                      <p className="text-sm text-muted-foreground">97.1%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Excellent</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Target: 97%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Real-time Processing</span>
                    <span className="font-medium text-green-500">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Batch Processing</span>
                    <span className="font-medium text-green-500">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Pipeline</span>
                    <span className="font-medium text-green-500">Healthy</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update</span>
                    <span className="font-medium">2 minutes ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Predictive Analytics</p>
                      <p className="text-sm text-muted-foreground">Accuracy: 94.2%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">24/7</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Descriptive Analytics</p>
                      <p className="text-sm text-muted-foreground">Coverage: 98.5%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">24/7</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Prescriptive Analytics</p>
                      <p className="text-sm text-muted-foreground">Success: 89.3%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">24/7</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Query Response Time</span>
                    <span className="font-medium text-green-500">45ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput</span>
                    <span className="font-medium">12,500 queries/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Hit Rate</span>
                    <span className="font-medium text-green-500">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate</span>
                    <span className="font-medium text-green-500">0.02%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Customer Behavior Pattern</p>
                      <p className="text-sm text-muted-foreground">Trend: Increasing</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">High Impact</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Confidence: 94%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Market Opportunity</p>
                      <p className="text-sm text-muted-foreground">Size: $2.4M</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Medium Impact</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Confidence: 87%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Operational Efficiency</p>
                      <p className="text-sm text-muted-foreground">Improvement: 18%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">High Impact</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Confidence: 92%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insight Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Business Intelligence</span>
                    <span className="font-medium">456</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operational Insights</span>
                    <span className="font-medium">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Insights</span>
                    <span className="font-medium">189</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Insights</span>
                    <span className="font-medium">123</span>
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
                <CardTitle>Generated Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Monthly Analytics Report</p>
                      <p className="text-sm text-muted-foreground">Generated: 2024-01-15</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Complete</Badge>
                      <p className="text-sm text-muted-foreground mt-1">PDF</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Quality Assessment</p>
                      <p className="text-sm text-muted-foreground">Generated: 2024-01-14</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Complete</Badge>
                      <p className="text-sm text-muted-foreground mt-1">PDF</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Insights Summary</p>
                      <p className="text-sm text-muted-foreground">Generated: 2024-01-13</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Complete</Badge>
                      <p className="text-sm text-muted-foreground mt-1">PDF</p>
                    </div>
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

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Quality Degradation</p>
                      <p className="text-sm text-muted-foreground">14:25:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Critical</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Processing Delay</p>
                      <p className="text-sm text-muted-foreground">13:45:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Warning</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Storage Threshold</p>
                      <p className="text-sm text-muted-foreground">12:30:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Info</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Resolved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Alerts</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Critical Alerts</span>
                    <span className="font-medium text-red-500">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warning Alerts</span>
                    <span className="font-medium text-yellow-500">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Info Alerts</span>
                    <span className="font-medium text-blue-500">141</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Processing Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Batch Size</span>
                    <span className="font-medium">10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Interval</span>
                    <span className="font-medium">5 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retention Period</span>
                    <span className="font-medium">90 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compression Level</span>
                    <span className="font-medium">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Confidence Threshold</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Update Frequency</span>
                    <span className="font-medium">Real-time</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alert Threshold</span>
                    <span className="font-medium">90%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-refresh</span>
                    <Badge variant="default">Enabled</Badge>
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