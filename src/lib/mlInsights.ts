// Machine Learning and AI-powered insights for field service operations
import { Job, TechProfile } from './optimization'

export interface MLInsight {
  type: 'prediction' | 'recommendation' | 'anomaly' | 'optimization'
  confidence: number
  title: string
  description: string
  actionable: boolean
  impact: 'low' | 'medium' | 'high'
  data?: any
}

export interface PredictiveModel {
  demandForecasting: DemandForecast[]
  equipmentFailure: EquipmentFailurePrediction[]
  customerSatisfaction: SatisfactionPrediction[]
  resourceOptimization: ResourceOptimization
}

export interface DemandForecast {
  date: string
  expectedJobs: number
  skillDemand: Record<string, number>
  geographicHotspots: Array<{ lat: number; lng: number; demand: number }>
  confidence: number
}

export interface EquipmentFailurePrediction {
  equipmentId: string
  equipmentType: string
  failureProbability: number
  predictedFailureDate: string
  maintenanceRecommendation: string
  costImpact: number
}

export interface SatisfactionPrediction {
  customerId: string
  satisfactionScore: number
  riskFactors: string[]
  recommendations: string[]
}

export interface ResourceOptimization {
  currentUtilization: number
  optimalStaffing: number
  skillGaps: string[]
  trainingRecommendations: string[]
}

// Advanced analytics engine
export class FieldServiceMLEngine {
  private historicalData: any[] = []
  private models: Map<string, any> = new Map()
  
  constructor(historicalData: any[] = []) {
    this.historicalData = historicalData
    this.initializeModels()
  }
  
  private initializeModels() {
    // Initialize pre-trained model weights and parameters
    this.models.set('demandPrediction', {
      weights: { seasonality: 0.3, trend: 0.4, events: 0.2, weather: 0.1 },
      accuracy: 0.85
    })
    
    this.models.set('durationPrediction', {
      weights: { 
        skillMatch: 0.25, 
        complexity: 0.2, 
        experience: 0.15, 
        equipment: 0.15,
        weather: 0.1,
        traffic: 0.1,
        historical: 0.05
      },
      accuracy: 0.78
    })
    
    this.models.set('satisfactionPredictor', {
      weights: {
        responseTime: 0.3,
        techSkill: 0.25,
        communication: 0.2,
        problemResolution: 0.25
      },
      accuracy: 0.72
    })
  }
  
  // Real-time demand forecasting
  async forecastDemand(
    timeHorizon: number = 7, // days
    location?: { lat: number; lng: number; radius: number }
  ): Promise<DemandForecast[]> {
    const forecasts: DemandForecast[] = []
    const today = new Date()
    
    for (let i = 0; i < timeHorizon; i++) {
      const targetDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
      
      // Simulate ML model prediction
      const seasonalFactor = this.calculateSeasonalFactor(targetDate)
      const trendFactor = this.calculateTrendFactor(targetDate)
      const eventFactor = this.calculateEventImpact(targetDate)
      
      const baseJobs = 8 // Base jobs per day
      const predictedJobs = Math.round(
        baseJobs * seasonalFactor * trendFactor * eventFactor
      )
      
      const skillDemand = this.predictSkillDemand(targetDate, predictedJobs)
      const hotspots = this.identifyGeographicHotspots(targetDate, location)
      
      forecasts.push({
        date: targetDate.toISOString().split('T')[0],
        expectedJobs: predictedJobs,
        skillDemand,
        geographicHotspots: hotspots,
        confidence: 0.85
      })
    }
    
    return forecasts
  }
  
  // Equipment failure prediction using anomaly detection
  async predictEquipmentFailures(
    equipmentData: Array<{
      id: string
      type: string
      age: number
      usageHours: number
      lastMaintenance: string
      errorCodes: string[]
    }>
  ): Promise<EquipmentFailurePrediction[]> {
    return equipmentData.map(equipment => {
      // Simulate ML model for failure prediction
      let failureProbability = 0
      
      // Age factor
      failureProbability += Math.min(equipment.age / 10, 1) * 0.3
      
      // Usage factor
      failureProbability += Math.min(equipment.usageHours / 10000, 1) * 0.25
      
      // Maintenance factor
      const daysSinceMaintenance = (Date.now() - new Date(equipment.lastMaintenance).getTime()) 
        / (1000 * 60 * 60 * 24)
      failureProbability += Math.min(daysSinceMaintenance / 365, 1) * 0.2
      
      // Error codes factor
      failureProbability += Math.min(equipment.errorCodes.length / 5, 1) * 0.25
      
      const predictedDays = Math.round(30 * (1 - failureProbability))
      const predictedDate = new Date(Date.now() + predictedDays * 24 * 60 * 60 * 1000)
      
      return {
        equipmentId: equipment.id,
        equipmentType: equipment.type,
        failureProbability: Math.min(failureProbability, 0.95),
        predictedFailureDate: predictedDate.toISOString(),
        maintenanceRecommendation: this.generateMaintenanceRecommendation(
          equipment, failureProbability
        ),
        costImpact: this.estimateFailureCost(equipment.type, failureProbability)
      }
    })
  }
  
  // Customer satisfaction prediction
  async predictSatisfaction(
    jobData: Array<{
      customerId: string
      responseTime: number
      techExperience: number
      jobComplexity: number
      communicationScore: number
      resolutionTime: number
    }>
  ): Promise<SatisfactionPrediction[]> {
    const model = this.models.get('satisfactionPredictor')
    
    return jobData.map(data => {
      // Calculate satisfaction score using weighted model
      let score = 5.0 // Base score
      
      // Response time impact (inverse relationship)
      score -= (data.responseTime / 60) * model.weights.responseTime * 0.5
      
      // Tech skill positive impact
      score += (data.techExperience / 10) * model.weights.techSkill
      
      // Communication impact
      score += (data.communicationScore / 10) * model.weights.communication
      
      // Resolution effectiveness
      score -= (data.resolutionTime / data.jobComplexity) * model.weights.problemResolution * 0.3
      
      score = Math.max(1, Math.min(10, score))
      
      const riskFactors = this.identifyRiskFactors(data, score)
      const recommendations = this.generateSatisfactionRecommendations(data, riskFactors)
      
      return {
        customerId: data.customerId,
        satisfactionScore: Math.round(score * 10) / 10,
        riskFactors,
        recommendations
      }
    })
  }
  
  // Intelligent route optimization with real-time factors
  async optimizeRoutesWithML(
    jobs: Job[],
    techProfiles: TechProfile[],
    externalFactors: {
      weather: string
      traffic: Record<string, number>
      events: Array<{ location: { lat: number; lng: number }; impact: number }>
    }
  ): Promise<{
    routes: Map<string, Job[]>
    insights: MLInsight[]
    efficiency: number
  }> {
    const insights: MLInsight[] = []
    const routes = new Map<string, Job[]>()
    
    // Analyze external factors impact
    const weatherImpact = this.calculateWeatherImpact(externalFactors.weather)
    const trafficImpact = this.calculateTrafficImpact(externalFactors.traffic)
    
    // Generate ML insights
    if (weatherImpact > 0.3) {
      insights.push({
        type: 'prediction',
        confidence: 0.85,
        title: 'Weather Impact Alert',
        description: `Current weather conditions may increase job duration by ${Math.round(weatherImpact * 100)}%`,
        actionable: true,
        impact: weatherImpact > 0.5 ? 'high' : 'medium',
        data: { weatherFactor: weatherImpact }
      })
    }
    
    // Route optimization with ML factors
    for (let i = 0; i < techProfiles.length; i++) {
      const techJobs = jobs.filter((_, index) => index % techProfiles.length === i)
      routes.set(`tech_${i}`, techJobs)
    }
    
    // Calculate efficiency score
    const efficiency = this.calculateRouteEfficiency(routes, techProfiles)
    
    if (efficiency < 0.7) {
      insights.push({
        type: 'optimization',
        confidence: 0.9,
        title: 'Route Optimization Opportunity',
        description: `Current routing efficiency is ${Math.round(efficiency * 100)}%. Consider redistributing jobs.`,
        actionable: true,
        impact: 'high',
        data: { currentEfficiency: efficiency, targetEfficiency: 0.85 }
      })
    }
    
    return { routes, insights, efficiency }
  }
  
  // Predictive maintenance scheduling
  async optimizeMaintenanceSchedule(
    equipmentList: Array<{
      id: string
      nextMaintenance: string
      criticalityScore: number
      location: { lat: number; lng: number }
    }>,
    techProfiles: TechProfile[]
  ): Promise<{
    schedule: Array<{
      equipmentId: string
      recommendedDate: string
      assignedTech: number
      priority: number
    }>
    insights: MLInsight[]
  }> {
    const schedule: Array<{
      equipmentId: string
      recommendedDate: string
      assignedTech: number
      priority: number
    }> = []
    const insights: MLInsight[] = []
    
    // Sort by criticality and due date
    const sortedEquipment = equipmentList.sort((a, b) => {
      const aDays = (new Date(a.nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      const bDays = (new Date(b.nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      return (a.criticalityScore * aDays) - (b.criticalityScore * bDays)
    })
    
    sortedEquipment.forEach((equipment, index) => {
      const bestTech = this.findOptimalTechForMaintenance(equipment, techProfiles)
      const priority = equipment.criticalityScore * 10
      
      schedule.push({
        equipmentId: equipment.id,
        recommendedDate: equipment.nextMaintenance,
        assignedTech: bestTech,
        priority
      })
    })
    
    // Generate insights about maintenance optimization
    const overdueMaintenance = equipmentList.filter(eq => 
      new Date(eq.nextMaintenance) < new Date()
    )
    
    if (overdueMaintenance.length > 0) {
      insights.push({
        type: 'anomaly',
        confidence: 1.0,
        title: 'Overdue Maintenance Alert',
        description: `${overdueMaintenance.length} equipment items have overdue maintenance`,
        actionable: true,
        impact: 'high',
        data: { overdueCount: overdueMaintenance.length }
      })
    }
    
    return { schedule, insights }
  }
  
  // Generate comprehensive ML insights for dashboard
  async generateDashboardInsights(
    jobs: Job[],
    techProfiles: TechProfile[],
    performanceData: any
  ): Promise<MLInsight[]> {
    const insights: MLInsight[] = []
    
    // Demand pattern analysis
    const demandForecast = await this.forecastDemand(7)
    const avgDemand = demandForecast.reduce((sum, d) => sum + d.expectedJobs, 0) / 7
    
    if (avgDemand > 12) {
      insights.push({
        type: 'prediction',
        confidence: 0.88,
        title: 'High Demand Period Approaching',
        description: `Expected job volume will increase by ${Math.round((avgDemand - 8) / 8 * 100)}% this week`,
        actionable: true,
        impact: 'high',
        data: { forecastedJobs: avgDemand, baselineJobs: 8 }
      })
    }
    
    // Skill gap analysis
    const skillDemand = this.analyzeSkillDemand(jobs)
    const skillSupply = this.analyzeSkillSupply(techProfiles)
    const skillGaps = this.identifySkillGaps(skillDemand, skillSupply)
    
    if (skillGaps.length > 0) {
      insights.push({
        type: 'recommendation',
        confidence: 0.92,
        title: 'Skill Gap Identified',
        description: `Training needed in: ${skillGaps.join(', ')}`,
        actionable: true,
        impact: 'medium',
        data: { missingSkills: skillGaps }
      })
    }
    
    // Performance optimization
    const utilizationRate = this.calculateUtilizationRate(techProfiles, performanceData)
    if (utilizationRate < 0.75) {
      insights.push({
        type: 'optimization',
        confidence: 0.85,
        title: 'Underutilization Detected',
        description: `Current utilization is ${Math.round(utilizationRate * 100)}%. Consider workload rebalancing.`,
        actionable: true,
        impact: 'medium',
        data: { currentUtilization: utilizationRate, targetUtilization: 0.85 }
      })
    }
    
    // Cost optimization insights
    const costOptimization = this.analyzeCostOptimization(jobs, techProfiles)
    if (costOptimization.potentialSavings > 100) {
      insights.push({
        type: 'optimization',
        confidence: 0.78,
        title: 'Cost Optimization Opportunity',
        description: `Potential monthly savings of $${costOptimization.potentialSavings} through route optimization`,
        actionable: true,
        impact: 'high',
        data: costOptimization
      })
    }
    
    return insights
  }
  
  // Helper methods for ML calculations
  private calculateSeasonalFactor(date: Date): number {
    const month = date.getMonth()
    const dayOfWeek = date.getDay()
    
    // Seasonal patterns (simplified)
    const seasonalFactors = [0.8, 0.9, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 1.0, 0.9, 0.8]
    const weekdayFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 1.0
    
    return seasonalFactors[month] * weekdayFactor
  }
  
  private calculateTrendFactor(date: Date): number {
    // Simulate business growth trend
    const monthsFromStart = (date.getFullYear() - 2024) * 12 + date.getMonth()
    return 1 + (monthsFromStart * 0.02) // 2% monthly growth
  }
  
  private calculateEventImpact(date: Date): number {
    // Simulate event-based demand changes
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    
    // Holiday periods have different demand
    const holidays = [1, 121, 244, 359] // Simplified holiday dates
    const nearHoliday = holidays.some(holiday => Math.abs(dayOfYear - holiday) < 3)
    
    return nearHoliday ? 0.6 : 1.0
  }
  
  private predictSkillDemand(date: Date, totalJobs: number): Record<string, number> {
    const skills = ['HVAC', 'Electrical', 'Plumbing', 'Networking', 'Security Systems']
    const demand: Record<string, number> = {}
    
    skills.forEach(skill => {
      // Simulate seasonal skill demand variations
      let factor = 1.0
      if (skill === 'HVAC') factor = date.getMonth() < 3 || date.getMonth() > 8 ? 1.5 : 0.8
      if (skill === 'Electrical') factor = 1.1 // Consistent demand
      
      demand[skill] = Math.round(totalJobs * 0.3 * factor) // Each skill roughly 30% of jobs
    })
    
    return demand
  }
  
  private identifyGeographicHotspots(
    date: Date, 
    location?: { lat: number; lng: number; radius: number }
  ): Array<{ lat: number; lng: number; demand: number }> {
    // Simulate geographic demand patterns
    const hotspots = [
      { lat: 40.7128, lng: -74.0060, demand: 5 }, // NYC
      { lat: 40.7589, lng: -73.9851, demand: 3 }, // Manhattan
      { lat: 40.7282, lng: -74.0776, demand: 4 }  // Jersey City
    ]
    
    return hotspots.filter(spot => {
      if (!location) return true
      const distance = Math.sqrt(
        Math.pow(spot.lat - location.lat, 2) + Math.pow(spot.lng - location.lng, 2)
      )
      return distance <= location.radius
    })
  }
  
  private generateMaintenanceRecommendation(equipment: any, failureProbability: number): string {
    if (failureProbability > 0.8) return 'Immediate inspection and part replacement required'
    if (failureProbability > 0.6) return 'Schedule preventive maintenance within 1 week'
    if (failureProbability > 0.4) return 'Plan maintenance within 1 month'
    return 'Continue with standard maintenance schedule'
  }
  
  private estimateFailureCost(equipmentType: string, probability: number): number {
    const baseCosts = {
      'HVAC': 5000,
      'Electrical': 3000,
      'Networking': 2000,
      'Security': 1500
    }
    const baseCost = baseCosts[equipmentType] || 2500
    return Math.round(baseCost * probability)
  }
  
  private identifyRiskFactors(data: any, score: number): string[] {
    const risks: string[] = []
    if (data.responseTime > 120) risks.push('Long response time')
    if (data.techExperience < 5) risks.push('Junior technician assigned')
    if (data.jobComplexity > 8) risks.push('High complexity job')
    if (score < 7) risks.push('Below target satisfaction score')
    return risks
  }
  
  private generateSatisfactionRecommendations(data: any, risks: string[]): string[] {
    const recommendations: string[] = []
    if (risks.includes('Long response time')) {
      recommendations.push('Improve dispatch efficiency and resource allocation')
    }
    if (risks.includes('Junior technician assigned')) {
      recommendations.push('Pair with senior technician or provide additional training')
    }
    if (risks.includes('High complexity job')) {
      recommendations.push('Ensure proper preparation and tool availability')
    }
    return recommendations
  }
  
  private calculateWeatherImpact(weather: string): number {
    const impacts = {
      'sunny': 0,
      'cloudy': 0.05,
      'rain': 0.25,
      'storm': 0.5,
      'snow': 0.4,
      'extreme': 0.7
    }
    return impacts[weather] || 0
  }
  
  private calculateTrafficImpact(traffic: Record<string, number>): number {
    const avgTrafficFactor = Object.values(traffic).reduce((sum, factor) => sum + factor, 0) 
      / Object.keys(traffic).length
    return Math.max(0, (avgTrafficFactor - 1) * 0.5)
  }
  
  private calculateRouteEfficiency(routes: Map<string, Job[]>, techProfiles: TechProfile[]): number {
    // Simplified efficiency calculation
    let totalEfficiency = 0
    let routeCount = 0
    
    routes.forEach((jobs, techId) => {
      if (jobs.length > 0) {
        const avgDistance = jobs.reduce((sum, job, index) => {
          if (index === 0) return sum
          const prevJob = jobs[index - 1]
          return sum + Math.sqrt(
            Math.pow(job.lat - prevJob.lat, 2) + Math.pow(job.lng - prevJob.lng, 2)
          )
        }, 0) / Math.max(jobs.length - 1, 1)
        
        totalEfficiency += 1 / (1 + avgDistance)
        routeCount++
      }
    })
    
    return routeCount > 0 ? totalEfficiency / routeCount : 0
  }
  
  private findOptimalTechForMaintenance(equipment: any, techProfiles: TechProfile[]): number {
    // Find technician with best combination of skills and proximity
    let bestTech = 0
    let bestScore = -Infinity
    
    techProfiles.forEach((tech, index) => {
      const distance = Math.sqrt(
        Math.pow(equipment.location.lat - tech.currentLocation.lat, 2) +
        Math.pow(equipment.location.lng - tech.currentLocation.lng, 2)
      )
      
      const skillMatch = tech.skills.includes('Maintenance') ? 1 : 0.5
      const score = tech.efficiency * skillMatch - distance * 0.1
      
      if (score > bestScore) {
        bestScore = score
        bestTech = index
      }
    })
    
    return bestTech
  }
  
  private analyzeSkillDemand(jobs: Job[]): Record<string, number> {
    const demand: Record<string, number> = {}
    jobs.forEach(job => {
      job.skillsRequired.forEach(skill => {
        demand[skill] = (demand[skill] || 0) + 1
      })
    })
    return demand
  }
  
  private analyzeSkillSupply(techProfiles: TechProfile[]): Record<string, number> {
    const supply: Record<string, number> = {}
    techProfiles.forEach(tech => {
      tech.skills.forEach(skill => {
        supply[skill] = (supply[skill] || 0) + 1
      })
    })
    return supply
  }
  
  private identifySkillGaps(demand: Record<string, number>, supply: Record<string, number>): string[] {
    const gaps: string[] = []
    Object.keys(demand).forEach(skill => {
      const demandCount = demand[skill] || 0
      const supplyCount = supply[skill] || 0
      if (demandCount > supplyCount * 1.5) { // 50% buffer
        gaps.push(skill)
      }
    })
    return gaps
  }
  
  private calculateUtilizationRate(techProfiles: TechProfile[], performanceData: any): number {
    // Simplified utilization calculation
    const avgEfficiency = techProfiles.reduce((sum, tech) => sum + tech.efficiency, 0) / techProfiles.length
    return Math.min(avgEfficiency / 10, 1.0) // Normalize to 0-1 scale
  }
  
  private analyzeCostOptimization(jobs: Job[], techProfiles: TechProfile[]): any {
    // Simplified cost analysis
    const totalJobs = jobs.length
    const totalTechs = techProfiles.length
    const avgJobsPerTech = totalJobs / totalTechs
    
    // Estimate potential savings from better routing
    const currentCost = totalJobs * 50 // $50 per job average cost
    const optimizedCost = currentCost * 0.85 // 15% savings possible
    const potentialSavings = (currentCost - optimizedCost) * 4 // Monthly savings
    
    return {
      currentMonthlyCost: currentCost * 4,
      optimizedMonthlyCost: optimizedCost * 4,
      potentialSavings: Math.round(potentialSavings),
      savingsPercentage: 15
    }
  }
}