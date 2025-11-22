import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Server, 
  Zap, 
  Shield, 
  EyeOff, 
  Save, 
  Trash2, 
  Edit, 
  ExternalLink, 
  TrendingUp, 
  MessageSquare, 
  Unlock 
} from 'lucide-react';

interface ARESConfigurationDashboardProps {
  isOfficeMode?: boolean;
}

export const ARESConfigurationDashboard: React.FC<ARESConfigurationDashboardProps> = ({ 
  isOfficeMode = false 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={`p-6 ${isOfficeMode ? 'cyberpunk-theme' : ''}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ARES Configuration Dashboard</h1>
        <p className="text-muted-foreground">
          Advanced AI Resource Enhancement System configuration and management
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-config">AI Config</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Systems</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Active: 10</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">98.5%</div>
                <p className="text-xs text-muted-foreground">Excellent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Secure</div>
                <p className="text-xs text-muted-foreground">All systems green</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">99.9%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Core AI Engine</p>
                      <p className="text-sm text-muted-foreground">Health: 100%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.9%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Neural Networks</p>
                      <p className="text-sm text-muted-foreground">Health: 98.5%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.8%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Processing</p>
                      <p className="text-sm text-muted-foreground">Health: 99.2%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.9%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>AI Models</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Nodes</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Allocation</span>
                    <span className="font-medium">512 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Capacity</span>
                    <span className="font-medium">2.4 TB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-config" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">GPT-4 Turbo</p>
                      <p className="text-sm text-muted-foreground">Status: Active</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Enabled</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Version: 4.0</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Claude 3 Opus</p>
                      <p className="text-sm text-muted-foreground">Status: Active</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Enabled</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Version: 3.0</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Gemini Pro</p>
                      <p className="text-sm text-muted-foreground">Status: Active</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Enabled</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Version: 1.0</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Max Tokens</span>
                    <span className="font-medium">32,768</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature</span>
                    <span className="font-medium">0.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top P</span>
                    <span className="font-medium">0.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frequency Penalty</span>
                    <span className="font-medium">0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Presence Penalty</span>
                    <span className="font-medium">0.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Encryption</span>
                    <Badge variant="default">AES-256</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Access Control</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Audit Logging</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Intrusion Detection</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Security Score</span>
                    <span className="font-medium text-green-500">98.5/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Unauthorized Access Attempt</p>
                      <p className="text-sm text-muted-foreground">14:25:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Critical</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Blocked</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security Scan Complete</p>
                      <p className="text-sm text-muted-foreground">13:45:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Info</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Clean</p>
                    </div>
                  </div>
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
                    <span>Response Time</span>
                    <span className="font-medium text-green-500">45ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput</span>
                    <span className="font-medium">12,500 req/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate</span>
                    <span className="font-medium text-green-500">0.02%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CPU Usage</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Usage</span>
                    <span className="font-medium">67%</span>
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
                    <span>Average Response Time</span>
                    <span className="font-medium text-green-500">42ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Throughput</span>
                    <span className="font-medium">15,000 req/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lowest Error Rate</span>
                    <span className="font-medium text-green-500">0.01%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Uptime</span>
                    <span className="font-medium text-green-500">100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">CPU Usage</p>
                      <p className="text-sm text-muted-foreground">Current: 23%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Normal</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Peak: 45%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Memory Usage</p>
                      <p className="text-sm text-muted-foreground">Current: 67%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Normal</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Peak: 78%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Disk Usage</p>
                      <p className="text-sm text-muted-foreground">Current: 45%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Normal</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Peak: 52%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">High CPU Usage</p>
                      <p className="text-sm text-muted-foreground">14:25:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Warning</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Memory Threshold</p>
                      <p className="text-sm text-muted-foreground">13:45:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Info</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Resolved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">ARES system startup completed</p>
                        <p className="text-sm text-muted-foreground">Core Engine</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">INFO</Badge>
                        <p className="text-sm text-muted-foreground mt-1">14:30:00</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">AI model loaded successfully</p>
                        <p className="text-sm text-muted-foreground">Neural Networks</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">INFO</Badge>
                        <p className="text-sm text-muted-foreground mt-1">14:25:00</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Security scan completed</p>
                        <p className="text-sm text-muted-foreground">Security Layer</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">INFO</Badge>
                        <p className="text-sm text-muted-foreground mt-1">14:20:00</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Log Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Logs</span>
                    <span className="font-medium">156,789</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Today&apos;s Logs</span>
                    <span className="font-medium text-green-500">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Logs</span>
                    <span className="font-medium text-red-500">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warning Logs</span>
                    <span className="font-medium text-yellow-500">45</span>
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