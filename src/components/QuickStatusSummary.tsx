import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  Target,
  ArrowRight
} from 'lucide-react';

export const QuickStatusSummary: React.FC = () => {
  const stats = {
    completed: 8,
    total: 13,
    inProgress: 3,
    blocked: 2,
    criticalIssues: 1
  };

  const nextSteps = [
    {
      priority: 'critical',
      title: 'Install Claude SDK',
      description: 'Resolve PowerShell execution policy and install @anthropic-ai/sdk',
      effort: '2-4 hours'
    },
    {
      priority: 'high',
      title: 'Configure API Keys',
      description: 'Set up Claude and Azure OpenAI API keys',
      effort: '1-2 hours'
    },
    {
      priority: 'medium',
      title: 'Test AI Integration',
      description: 'Verify ARES complex problem analysis works end-to-end',
      effort: '1-2 hours'
    }
  ];

  const weakSpots = [
    'Claude SDK Integration',
    'Real-time Data Sync',
    'Mobile Performance',
    'Testing Coverage'
  ];

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Development Progress</span>
            <Badge variant="outline">{stats.completed}/{stats.total} Complete</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={(stats.completed / stats.total) * 100} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.blocked}</div>
                <div className="text-sm text-muted-foreground">Blocked</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Issues Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>{stats.criticalIssues} Critical Issue Requires Immediate Attention:</strong>
          Claude SDK integration is blocked by PowerShell execution policy.
          This limits advanced AI capabilities to GPT-4 fallback only.
        </AlertDescription>
      </Alert>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Immediate Next Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  step.priority === 'critical' ? 'bg-red-500' :
                  step.priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {step.effort}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weak Spots Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Areas for Improvement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {weakSpots.map((spot, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">{spot}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View Full Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Highlights */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span>Success Highlights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-green-700">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Ultra-real visual experience with professional photography</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Advanced AI orchestration with multi-agent coordination</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Resource optimization achieving 85% compression ratios</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Performance-first architecture with &lt; 3.2s load times</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};