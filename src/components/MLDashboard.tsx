import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FieldServiceMLEngine, type MLInsight, type PredictiveModel } from '@/lib/mlInsights'
import { type Job, type TechProfile } from '@/lib/optimization'
import { 
  Robot, 
  TrendUp, 
  Warning, 
  LightbulbFilament, 
  Target,
  ChartLine,
  Wrench,
  Users,
  Calendar,
  CurrencyDollar
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface MLDashboardProps {
  jobs: Job[]
  techProfiles: TechProfile[]
  isVisible: boolean
}

export function MLDashboard({ jobs, techProfiles, isVisible }: MLDashboardProps) {
  const [insights, setInsights] = useState<MLInsight[]>([])
  const [predictions, setPredictions] = useState<PredictiveModel | null>(null)
  const [loading, setLoading] = useState(false)
  const [mlEngine] = useState(() => new FieldServiceMLEngine())

  useEffect(() => {
    if (isVisible && jobs.length > 0) {
      generateInsights()
    }
  }, [isVisible, jobs, techProfiles])

  const generateInsights = async () => {
    setLoading(true)
    try {
      // Generate ML insights
      const newInsights = await mlEngine.generateDashboardInsights(
        jobs, 
        techProfiles, 
        { utilization: 0.75, avgJobTime: 2.5 }
      )
      setInsights(newInsights)

      // Generate predictions
      const demandForecast = await mlEngine.forecastDemand(7)
      const equipmentPredictions = await mlEngine.predictEquipmentFailures([
        {
          id: 'eq001',
          type: 'HVAC',
          age: 3,
          usageHours: 8760,
          lastMaintenance: '2024-01-15',
          errorCodes: ['E001', 'W002']
        },
        {
          id: 'eq002',
          type: 'Electrical',
          age: 5,
          usageHours: 12000,
          lastMaintenance: '2023-11-20',
          errorCodes: ['E003']
        }
      ])
      
      const satisfactionPredictions = await mlEngine.predictSatisfaction([
        {
          customerId: 'cust001',
          responseTime: 45,
          techExperience: 8,
          jobComplexity: 6,
          communicationScore: 9,
          resolutionTime: 120
        }
      ])

      setPredictions({
        demandForecasting: demandForecast,
        equipmentFailure: equipmentPredictions,
        customerSatisfaction: satisfactionPredictions,
        resourceOptimization: {
          currentUtilization: 0.75,
          optimalStaffing: techProfiles.length + 1,
          skillGaps: ['Advanced HVAC', 'IoT Systems'],
          trainingRecommendations: ['HVAC Certification', 'IoT Troubleshooting']
        }
      })

      toast.success('ML insights generated successfully')
    } catch (error) {
      console.error('Error generating insights:', error)
      toast.error('Failed to generate ML insights')
    } finally {
      setLoading(false)
    }
  }

  const getInsightIcon = (type: MLInsight['type']) => {
    switch (type) {
      case 'prediction': return <TrendUp size={16} />
      case 'recommendation': return <LightbulbFilament size={16} />
      case 'anomaly': return <Warning size={16} />
      case 'optimization': return <Target size={16} />
      default: return <Robot size={16} />
    }
  }

  const getImpactColor = (impact: MLInsight['impact']) => {
    switch (impact) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  if (!isVisible) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Robot className="text-primary" />
          <h2 className="text-2xl font-semibold">ML Intelligence Dashboard</h2>
        </div>
        <Button onClick={generateInsights} disabled={loading} size="sm">
          {loading ? 'Analyzing...' : 'Refresh Insights'}
        </Button>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${
                insight.impact === 'high' ? 'border-l-red-500' :
                insight.impact === 'medium' ? 'border-l-yellow-500' :
                'border-l-green-500'
              }`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <h4 className="font-medium">{insight.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getImpactColor(insight.impact)}>
                        {insight.impact}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confident
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  {insight.actionable && (
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {insights.length === 0 && !loading && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Robot size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    No insights available. Generate insights to see ML recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Demand Forecasting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine size={20} />
                  7-Day Demand Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictions?.demandForecasting ? (
                  <div className="space-y-3">
                    {predictions.demandForecasting.slice(0, 4).map((forecast, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">
                          {new Date(forecast.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress value={forecast.expectedJobs * 8} className="w-16" />
                          <span className="text-sm font-medium w-12">
                            {forecast.expectedJobs} jobs
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="text-xs text-muted-foreground mt-2">
                      Peak demand expected: {Math.max(...(predictions.demandForecasting.map(f => f.expectedJobs) || [0]))} jobs
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No demand forecast available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Equipment Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench size={20} />
                  Equipment Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictions?.equipmentFailure ? (
                  <div className="space-y-3">
                    {predictions.equipmentFailure.map((equipment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{equipment.equipmentId}</span>
                          <Badge variant={equipment.failureProbability > 0.7 ? 'destructive' : equipment.failureProbability > 0.4 ? 'default' : 'secondary'}>
                            {Math.round(equipment.failureProbability * 100)}% risk
                          </Badge>
                        </div>
                        <Progress value={equipment.failureProbability * 100} />
                        <p className="text-xs text-muted-foreground">
                          {equipment.maintenanceRecommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No equipment data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Customer Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Satisfaction Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictions?.customerSatisfaction ? (
                  <div className="space-y-4">
                    {predictions.customerSatisfaction.map((customer, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Customer {customer.customerId}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold">{customer.satisfactionScore}</span>
                            <span className="text-xs text-muted-foreground">/10</span>
                          </div>
                        </div>
                        <Progress value={customer.satisfactionScore * 10} />
                        {customer.riskFactors.length > 0 && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">Risk factors: </span>
                            {customer.riskFactors.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No satisfaction data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Resource Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  Resource Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictions?.resourceOptimization ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Current Utilization</span>
                        <span className="text-sm font-medium">
                          {Math.round(predictions.resourceOptimization.currentUtilization * 100)}%
                        </span>
                      </div>
                      <Progress value={predictions.resourceOptimization.currentUtilization * 100} />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Skill Gaps</h4>
                      <div className="flex flex-wrap gap-1">
                        {predictions.resourceOptimization.skillGaps.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Training Recommendations</h4>
                      <div className="space-y-1">
                        {predictions.resourceOptimization.trainingRecommendations.map((training, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                            <Calendar size={12} />
                            {training}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No optimization data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Route Efficiency Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Current Efficiency</span>
                    <Badge variant="secondary">72%</Badge>
                  </div>
                  <Progress value={72} />
                  
                  <Alert>
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                      Potential 15% improvement through route optimization. 
                      Estimated savings: $1,200/month
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {techProfiles.map((tech, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Technician {index + 1}</span>
                        <span className="text-sm">
                          {Math.round(tech.efficiency * 10)}% utilized
                        </span>
                      </div>
                      <Progress value={tech.efficiency * 10} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CurrencyDollar size={20} />
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Ops Cost</span>
                    <span className="font-medium">$12,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Potential Savings</span>
                    <span className="font-medium text-green-600">$1,875</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ROI from ML</span>
                    <span className="font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine size={20} />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Job Time</span>
                    <span className="font-medium">2.3h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">First Call Resolution</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-medium">8.4/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Robot size={20} />
                  ML Model Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Demand Forecast</span>
                    <span className="font-medium">85% accurate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duration Prediction</span>
                    <span className="font-medium">78% accurate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Models Deployed</span>
                    <span className="font-medium">6</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}