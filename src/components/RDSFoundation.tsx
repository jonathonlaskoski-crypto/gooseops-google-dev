import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Server, Cloud, Key, Zap, Activity, TrendingUp, Monitor } from 'lucide-react';

interface RDSFoundationProps {
  isOfficeMode?: boolean;
}

export const RDSFoundation: React.FC<RDSFoundationProps> = ({ 
  isOfficeMode = false 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={`p-6 ${isOfficeMode ? 'cyberpunk-theme' : ''}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">RDS Foundation</h1>
        <p className="text-muted-foreground">
          Robust Data Systems foundation platform for enterprise operations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">Active: 142</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">98.5%</div>
                <p className="text-xs text-muted-foreground">Excellent performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">99.9%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">Excellent</div>
                <p className="text-xs text-muted-foreground">Optimal operation</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Core Engine</p>
                      <p className="text-sm text-muted-foreground">Health: 100%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.9%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Processor</p>
                      <p className="text-sm text-muted-foreground">Health: 98.5%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.8%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security Layer</p>
                      <p className="text-sm text-muted-foreground">Health: 99.2%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.9%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Gateway</p>
                      <p className="text-sm text-muted-foreground">Health: 97.8%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.7%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  <div className="flex justify-between">
                    <span>Disk Usage</span>
                    <span className="font-medium">45%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Core Engine</p>
                      <p className="text-sm text-muted-foreground">Health: 100%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.9%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Processor</p>
                      <p className="text-sm text-muted-foreground">Health: 98.5%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.8%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security Layer</p>
                      <p className="text-sm text-muted-foreground">Health: 99.2%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.9%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Gateway</p>
                      <p className="text-sm text-muted-foreground">Health: 97.8%</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Uptime: 99.7%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Module Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Max Connections</span>
                    <span className="font-medium">10000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeout</span>
                    <span className="font-medium">30s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retry Attempts</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Log Level</span>
                    <span className="font-medium">INFO</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debug Mode</span>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto Scaling</span>
                    <Badge variant="default">Enabled</Badge>
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
                  <div className="flex justify-between">
                    <span>Disk Usage</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Latency</span>
                    <span className="font-medium text-green-500">12ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Hit Rate</span>
                    <span className="font-medium text-green-500">94.2%</span>
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

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Firewall</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Encryption</span>
                    <Badge variant="default">AES-256</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SSL Certificates</span>
                    <Badge variant="default">Valid</Badge>
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
                    <span>Vulnerability Scan</span>
                    <Badge variant="default">Clean</Badge>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Disk Space Low</p>
                      <p className="text-sm text-muted-foreground">12:30:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Critical</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Network Latency</p>
                      <p className="text-sm text-muted-foreground">11:15:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Warning</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Resolved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Last Backup</span>
                    <span className="font-medium">2024-01-15 02:00:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backup Frequency</span>
                    <span className="font-medium">Daily</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backup Size</span>
                    <span className="font-medium">2.4 TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retention Period</span>
                    <span className="font-medium">30 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backup Location</span>
                    <span className="font-medium">Secure Cloud</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backup Status</span>
                    <Badge variant="default">Success</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Backup</span>
                    <span className="font-medium">2024-01-16 02:00:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backup Integrity</span>
                    <Badge variant="default">Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Backups</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Successful Backups</span>
                    <span className="font-medium text-green-500">154</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed Backups</span>
                    <span className="font-medium text-red-500">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Backup Time</span>
                    <span className="font-medium">45 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Largest Backup</span>
                    <span className="font-medium">2.8 TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Smallest Backup</span>
                    <span className="font-medium">1.9 TB</span>
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
                <CardTitle>System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System startup completed</p>
                        <p className="text-sm text-muted-foreground">Core Engine</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">INFO</Badge>
                        <p className="text-sm text-muted-foreground mt-1">14:30:00</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">CPU usage above threshold</p>
                        <p className="text-sm text-muted-foreground">Monitoring</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">WARN</Badge>
                        <p className="text-sm text-muted-foreground mt-1">14:25:00</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Backup completed successfully</p>
                        <p className="text-sm text-muted-foreground">Backup System</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">INFO</Badge>
                        <p className="text-sm text-muted-foreground mt-1">14:20:00</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Security scan completed</p>
                        <p className="text-sm text-muted-foreground">Security Layer</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">INFO</Badge>
                        <p className="text-sm text-muted-foreground mt-1">14:15:00</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cache cleared</p>
                        <p className="text-sm text-muted-foreground">Cache System</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">INFO</Badge>
                        <p className="text-sm text-muted-foreground mt-1">14:10:00</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoring Alerts</CardTitle>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Disk Space Low</p>
                      <p className="text-sm text-muted-foreground">12:30:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Critical</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Network Latency</p>
                      <p className="text-sm text-muted-foreground">11:15:00</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Warning</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Resolved</p>
                    </div>
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