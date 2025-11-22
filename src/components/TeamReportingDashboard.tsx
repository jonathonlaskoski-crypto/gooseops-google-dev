import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Users,
  Zap,
  BarChart3,
  Lightbulb,
  Shield,
  Globe
} from 'lucide-react';

interface TeamActivity {
  id: string;
  member: string;
  action: string;
  timestamp: Date;
  status: 'completed' | 'in-progress' | 'blocked' | 'planned';
  category: 'ai' | 'visual' | 'performance' | 'integration' | 'security';
}

interface WeakSpot {
  area: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  recommendation: string;
  estimatedEffort: string;
}

interface AlternativeApproach {
  original: string;
  alternative: string;
  benefits: string[];
  drawbacks: string[];
  recommendation: 'adopt' | 'consider' | 'avoid';
}

export const TeamReportingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Mock team activity data
  const teamActivities: TeamActivity[] = [
    {
      id: '1',
      member: 'AI Engineer',
      action: 'Enhanced ARES with Claude integration and complex problem analysis',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      category: 'ai'
    },
    {
      id: '2',
      member: 'UI/UX Designer',
      action: 'Created visual assets system with optimized images and videos',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'completed',
      category: 'visual'
    },
    {
      id: '3',
      member: 'Performance Engineer',
      action: 'Implemented resource optimization and CDN delivery',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'completed',
      category: 'performance'
    },
    {
      id: '4',
      member: 'DevOps Engineer',
      action: 'Setting up Dataverse integration and API connections',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'in-progress',
      category: 'integration'
    },
    {
      id: '5',
      member: 'Security Specialist',
      action: 'Implementing enterprise-grade security protocols',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'in-progress',
      category: 'security'
    }
  ];

  const weakSpots: WeakSpot[] = [
    {
      area: 'Claude SDK Integration',
      severity: 'high',
      description: 'Anthropic Claude SDK dependency not installed due to execution policy restrictions',
      impact: 'Advanced AI reasoning capabilities are limited to GPT-4 fallback',
      recommendation: 'Install @anthropic-ai/sdk and configure API key for full AI capabilities',
      estimatedEffort: '2-4 hours'
    },
    {
      area: 'Real-time Data Synchronization',
      severity: 'medium',
      description: 'Field technician data sync relies on manual triggers rather than real-time updates',
      impact: 'Delayed information sharing between mobile and desktop platforms',
      recommendation: 'Implement WebSocket connections and background sync services',
      estimatedEffort: '1-2 weeks'
    },
    {
      area: 'Mobile Performance',
      severity: 'medium',
      description: 'Video content and high-res images may impact mobile data usage',
      impact: 'Increased bandwidth costs and slower loading on cellular connections',
      recommendation: 'Implement adaptive quality based on connection type and user preferences',
      estimatedEffort: '3-5 days'
    },
    {
      area: 'Error Handling',
      severity: 'low',
      description: 'Some components lack comprehensive error boundaries and fallback states',
      impact: 'Potential user experience degradation during network issues',
      recommendation: 'Add global error boundaries and offline-first capabilities',
      estimatedEffort: '1 week'
    },
    {
      area: 'Testing Coverage',
      severity: 'medium',
      description: 'Limited automated testing for complex AI interactions and visual components',
      impact: 'Higher risk of regressions in AI and visual features',
      recommendation: 'Implement comprehensive test suites for AI responses and visual rendering',
      estimatedEffort: '2-3 weeks'
    }
  ];

  const alternativeApproaches: AlternativeApproach[] = [
    {
      original: 'Built custom AI orchestration system',
      alternative: 'Used LangChain or CrewAI framework',
      benefits: [
        'Faster development with proven patterns',
        'Better community support and documentation',
        'Built-in agent coordination features',
        'Easier integration with external APIs'
      ],
      drawbacks: [
        'Less control over custom business logic',
        'Potential vendor lock-in',
        'May include unnecessary complexity'
      ],
      recommendation: 'consider'
    },
    {
      original: 'Custom visual optimization system',
      alternative: 'Used Cloudinary or similar CDN service',
      benefits: [
        'Professional image processing pipeline',
        'Advanced optimization algorithms',
        'Global CDN with edge computing',
        'Built-in analytics and monitoring'
      ],
      drawbacks: [
        'Monthly subscription costs',
        'Less control over optimization logic',
        'Potential data privacy concerns'
      ],
      recommendation: 'adopt'
    },
    {
      original: 'React-based video components',
      alternative: 'Used specialized video platform (Mux, Vimeo)',
      benefits: [
        'Better video compression and delivery',
        'Advanced analytics and engagement metrics',
        'Professional video player features',
        'Content protection and DRM'
      ],
      drawbacks: [
        'Higher costs for video hosting',
        'Less integration with existing codebase',
        'Potential vendor dependency'
      ],
      recommendation: 'consider'
    }
  ];

  const getStatusColor = (status: TeamActivity['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'blocked': return 'text-red-600';
      case 'planned': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: WeakSpot['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: TeamActivity['category']) => {
    switch (category) {
      case 'ai': return <Zap className="h-4 w-4" />;
      case 'visual': return <BarChart3 className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'integration': return <Globe className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Team Reporting & Analysis Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive analysis of our progress, challenges, and opportunities for improvement
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center">
          <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
            {['day', 'week', 'month', 'quarter'].map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className="capitalize"
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">Team Progress</TabsTrigger>
            <TabsTrigger value="weakspots">Weak Spots</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            <TabsTrigger value="nextsteps">Next Steps</TabsTrigger>
          </TabsList>

          {/* Team Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Completed Tasks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">8</div>
                  <p className="text-sm text-muted-foreground">of 13 total tasks</p>
                  <Progress value={62} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>In Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">3</div>
                  <p className="text-sm text-muted-foreground">active developments</p>
                  <Progress value={23} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span>Blocked Items</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">2</div>
                  <p className="text-sm text-muted-foreground">requiring attention</p>
                  <Progress value={15} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Team Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Team Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {getCategoryIcon(activity.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.member}
                          </p>
                          <Badge
                            variant="outline"
                            className={getStatusColor(activity.status)}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weak Spots Tab */}
          <TabsContent value="weakspots" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Critical Issues:</strong> 1 high-priority item requires immediate attention.
                <strong> Total Weak Spots:</strong> {weakSpots.length} identified areas for improvement.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {weakSpots.map((spot, index) => (
                <Card key={index} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{spot.area}</CardTitle>
                      <Badge className={getSeverityColor(spot.severity)}>
                        {spot.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-red-600 mb-1">Problem</h4>
                      <p className="text-sm text-gray-600">{spot.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-orange-600 mb-1">Impact</h4>
                      <p className="text-sm text-gray-600">{spot.impact}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-600 mb-1">Recommendation</h4>
                      <p className="text-sm text-gray-600 mb-2">{spot.recommendation}</p>
                      <Badge variant="outline" className="text-xs">
                        Effort: {spot.estimatedEffort}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alternatives Tab */}
          <TabsContent value="alternatives" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Alternative Development Approaches</h2>
              <p className="text-muted-foreground">
                Analysis of what we could have built differently and the trade-offs involved
              </p>
            </div>

            <div className="space-y-6">
              {alternativeApproaches.map((alt, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{alt.original}</CardTitle>
                      <Badge
                        variant={alt.recommendation === 'adopt' ? 'default' :
                               alt.recommendation === 'consider' ? 'secondary' : 'outline'}
                      >
                        {alt.recommendation.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-blue-600 mb-2">Alternative Approach</h4>
                      <p className="text-sm text-gray-600">{alt.alternative}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Benefits</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {alt.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Drawbacks</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {alt.drawbacks.map((drawback, i) => (
                            <li key={i} className="flex items-start">
                              <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                              {drawback}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Next Steps Tab */}
          <TabsContent value="nextsteps" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Immediate Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    <span>Immediate Actions (Next 24-48 hours)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Install Claude SDK</p>
                        <p className="text-sm text-muted-foreground">Resolve execution policy and install @anthropic-ai/sdk</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Configure API Keys</p>
                        <p className="text-sm text-muted-foreground">Set up Claude and Azure OpenAI API keys</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Test AI Integration</p>
                        <p className="text-sm text-muted-foreground">Verify ARES complex problem analysis works</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Short-term Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span>Short-term Goals (1-2 weeks)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Real-time Sync</p>
                        <p className="text-sm text-muted-foreground">Implement WebSocket connections for live updates</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Mobile Optimization</p>
                        <p className="text-sm text-muted-foreground">Adaptive quality for different connection types</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Error Boundaries</p>
                        <p className="text-sm text-muted-foreground">Add comprehensive error handling and fallbacks</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Long-term Vision */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-purple-500" />
                  <span>Long-term Vision (1-3 months)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">AI Advancement</h4>
                    <p className="text-sm text-muted-foreground">
                      Multi-modal AI with voice, vision, and advanced reasoning
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Platform Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Seamless Dataverse, Dynamics, and Power Platform integration
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Global Scale</h4>
                    <p className="text-sm text-muted-foreground">
                      Multi-region deployment with advanced CDN and caching
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Advanced Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Predictive modeling and real-time business intelligence
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Security & Compliance</h4>
                    <p className="text-sm text-muted-foreground">
                      Enterprise-grade security with SOC 2 and GDPR compliance
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Developer Experience</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive testing, documentation, and CI/CD pipelines
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};