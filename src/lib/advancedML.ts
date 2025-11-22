// Advanced predictive analytics and inventory management for field service
import { Job, TechProfile } from './optimization'

export interface Equipment {
  id: string
  type: string
  model: string
  location: { lat: number; lng: number; address: string }
  installDate: string
  lastMaintenance: string
  warrantyExpiry: string
  criticality: 'low' | 'medium' | 'high' | 'critical'
  sensorData: {
    temperature?: number
    vibration?: number
    pressure?: number
    powerConsumption?: number
    runtime?: number
    errorCodes?: string[]
  }
  maintenanceHistory: MaintenanceRecord[]
  predictedFailureDate?: string
  failureRisk: number
}

export interface MaintenanceRecord {
  date: string
  type: 'preventive' | 'corrective' | 'emergency'
  technicianId: string
  partsUsed: Part[]
  hoursSpent: number
  issuesFound: string[]
  resolution: string
  cost: number
}

export interface Part {
  id: string
  name: string
  category: string
  cost: number
  supplier: string
  leadTime: number // days
  minimumStock: number
  currentStock: number
  predictedDemand: number
  reorderPoint: number
  criticalityScore: number
}

export interface InventoryPrediction {
  partId: string
  predictedUsage: number
  timeframe: number // days
  confidence: number
  recommendedOrderQuantity: number
  urgency: 'low' | 'medium' | 'high' | 'critical'
  reasoning: string[]
}

export interface QualityMetrics {
  jobId: string
  technicianId: string
  completionTime: number
  customerSatisfaction: number
  firstCallResolution: boolean
  safetyCompliance: number
  codeCompliance: number
  qualityScore: number
  issues: QualityIssue[]
}

export interface QualityIssue {
  category: string
  severity: 'minor' | 'major' | 'critical'
  description: string
  correctionRequired: boolean
  trainingRecommended: boolean
}

export interface PricingModel {
  baseRate: number
  skillMultipliers: Record<string, number>
  complexityMultiplier: number
  urgencyMultiplier: number
  locationMultiplier: number
  customerTierMultiplier: number
  seasonalAdjustment: number
  competitiveAdjustment: number
}

// Advanced Predictive Analytics Engine
export class AdvancedMLEngine {
  private equipmentModels: Map<string, any> = new Map()
  private inventoryModels: Map<string, any> = new Map()
  private qualityModels: Map<string, any> = new Map()
  private pricingModels: Map<string, any> = new Map()

  constructor() {
    this.initializeAdvancedModels()
  }

  private initializeAdvancedModels() {
    // Equipment failure prediction model
    this.equipmentModels.set('failurePrediction', {
      weights: {
        age: 0.25,
        usage: 0.20,
        maintenanceGap: 0.20,
        errorFrequency: 0.15,
        environmentalFactors: 0.10,
        sensorAnomalies: 0.10
      },
      accuracy: 0.87,
      falsePositiveRate: 0.12
    })

    // Inventory demand prediction
    this.inventoryModels.set('demandPrediction', {
      weights: {
        seasonality: 0.30,
        equipmentAge: 0.25,
        historicalUsage: 0.20,
        failurePredictions: 0.15,
        maintenanceSchedule: 0.10
      },
      accuracy: 0.82
    })

    // Quality prediction model
    this.qualityModels.set('qualityPrediction', {
      weights: {
        technicianExperience: 0.30,
        jobComplexity: 0.25,
        timeConstraints: 0.20,
        equipmentCondition: 0.15,
        weatherConditions: 0.10
      },
      accuracy: 0.79
    })

    // Dynamic pricing model
    this.pricingModels.set('dynamicPricing', {
      elasticity: -0.8, // Price sensitivity
      competitionWeight: 0.15,
      demandWeight: 0.25,
      costWeight: 0.40,
      valueWeight: 0.20
    })
  }

  // 1. Predictive Equipment Failure Analysis
  async predictEquipmentFailures(equipment: Equipment[]): Promise<Array<{
    equipment: Equipment
    failureRisk: number
    predictedFailureDate: string
    recommendedActions: string[]
    criticality: 'low' | 'medium' | 'high' | 'critical'
    costImpact: number
  }>> {
    const model = this.equipmentModels.get('failurePrediction')
    
    return equipment.map(eq => {
      const now = new Date()
      const installAge = (now.getTime() - new Date(eq.installDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
      const maintenanceGap = (now.getTime() - new Date(eq.lastMaintenance).getTime()) / (1000 * 60 * 60 * 24)
      
      // Calculate failure risk using ML model
      let riskScore = 0
      riskScore += Math.min(installAge / 10, 1) * model.weights.age
      riskScore += Math.min(maintenanceGap / 365, 1) * model.weights.maintenanceGap
      
      // Sensor data analysis
      if (eq.sensorData.errorCodes?.length) {
        riskScore += Math.min(eq.sensorData.errorCodes.length / 5, 1) * model.weights.errorFrequency
      }
      
      // Environmental factors
      if (eq.sensorData.temperature && (eq.sensorData.temperature > 80 || eq.sensorData.temperature < -10)) {
        riskScore += 0.2 * model.weights.environmentalFactors
      }
      
      // Sensor anomalies
      if (eq.sensorData.vibration && eq.sensorData.vibration > 100) {
        riskScore += 0.3 * model.weights.sensorAnomalies
      }
      
      const failureRisk = Math.min(riskScore, 0.95)
      
      // Predict failure date
      const daysUntilFailure = Math.round(365 * (1 - failureRisk))
      const predictedDate = new Date(now.getTime() + daysUntilFailure * 24 * 60 * 60 * 1000)
      
      // Determine criticality and actions
      let criticality: 'low' | 'medium' | 'high' | 'critical'
      const actions: string[] = []
      
      if (failureRisk > 0.8) {
        criticality = 'critical'
        actions.push('Schedule immediate inspection', 'Prepare replacement parts', 'Plan emergency maintenance')
      } else if (failureRisk > 0.6) {
        criticality = 'high'
        actions.push('Schedule preventive maintenance within 2 weeks', 'Order replacement parts')
      } else if (failureRisk > 0.4) {
        criticality = 'medium'
        actions.push('Schedule maintenance within 1 month', 'Monitor sensor readings')
      } else {
        criticality = 'low'
        actions.push('Continue standard maintenance schedule')
      }
      
      // Estimate cost impact
      const baseCost = { 'HVAC': 8000, 'Electrical': 5000, 'Networking': 3000 }[eq.type] || 4000
      const costImpact = baseCost * (failureRisk + (eq.criticality === 'critical' ? 0.5 : 0))
      
      return {
        equipment: eq,
        failureRisk,
        predictedFailureDate: predictedDate.toISOString(),
        recommendedActions: actions,
        criticality,
        costImpact: Math.round(costImpact)
      }
    })
  }

  // 2. Smart Inventory Management & Parts Prediction
  async predictInventoryDemand(
    parts: Part[],
    equipment: Equipment[],
    upcomingJobs: Job[],
    historicalUsage: any[]
  ): Promise<InventoryPrediction[]> {
    const model = this.inventoryModels.get('demandPrediction')
    
    return parts.map(part => {
      // Analyze seasonal patterns
      const currentMonth = new Date().getMonth()
      const seasonalFactors = [0.8, 0.9, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 1.0, 0.9, 0.8]
      const seasonalFactor = seasonalFactors[currentMonth]
      
      // Equipment age factor
      const oldEquipmentCount = equipment.filter(eq => {
        const age = (Date.now() - new Date(eq.installDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
        return age > 5 && this.partNeededForEquipment(part, eq)
      }).length
      
      const ageImpact = oldEquipmentCount * 0.1
      
      // Historical usage trend
      const avgHistoricalUsage = historicalUsage
        .filter(usage => usage.partId === part.id)
        .reduce((sum, usage) => sum + usage.quantity, 0) / Math.max(historicalUsage.length, 1)
      
      // Upcoming jobs impact
      const relevantJobs = upcomingJobs.filter(job => 
        this.jobRequiresPart(job, part)
      ).length
      
      // Predicted usage calculation
      let predictedUsage = avgHistoricalUsage * seasonalFactor
      predictedUsage += ageImpact
      predictedUsage += relevantJobs * 0.3 // Each relevant job has 30% chance of needing part
      
      // Confidence calculation
      const dataPoints = historicalUsage.filter(usage => usage.partId === part.id).length
      const confidence = Math.min(0.95, 0.5 + (dataPoints / 50))
      
      // Order quantity recommendation
      const safetyStock = part.minimumStock * 1.5
      const leadTimeDemand = (predictedUsage / 30) * part.leadTime
      const recommendedOrder = Math.max(0, leadTimeDemand + safetyStock - part.currentStock)
      
      // Urgency determination
      let urgency: 'low' | 'medium' | 'high' | 'critical'
      const stockRatio = part.currentStock / part.minimumStock
      
      if (stockRatio < 0.2) urgency = 'critical'
      else if (stockRatio < 0.5) urgency = 'high'
      else if (stockRatio < 0.8) urgency = 'medium'
      else urgency = 'low'
      
      const reasoning: string[] = []
      if (seasonalFactor > 1.1) reasoning.push(`Seasonal demand increase (+${Math.round((seasonalFactor - 1) * 100)}%)`)
      if (oldEquipmentCount > 0) reasoning.push(`${oldEquipmentCount} aging equipment units`)
      if (relevantJobs > 0) reasoning.push(`${relevantJobs} upcoming jobs requiring this part`)
      
      return {
        partId: part.id,
        predictedUsage: Math.round(predictedUsage),
        timeframe: 30,
        confidence,
        recommendedOrderQuantity: Math.round(recommendedOrder),
        urgency,
        reasoning
      }
    })
  }

  // 3. Automated Quality Assurance & Compliance Monitoring
  async predictJobQuality(
    job: Job,
    technician: TechProfile,
    equipment?: Equipment,
    environmentalFactors?: any
  ): Promise<{
    predictedQualityScore: number
    riskFactors: Array<{
      factor: string
      impact: number
      mitigation: string
    }>
    complianceRisk: number
    recommendations: string[]
  }> {
    const model = this.qualityModels.get('qualityPrediction')
    let qualityScore = 8.5 // Base quality score
    const riskFactors: Array<{
      factor: string
      impact: number
      mitigation: string
    }> = []
    
    // Technician experience impact
    const experienceImpact = (technician.experience / 10) * model.weights.technicianExperience
    qualityScore += experienceImpact
    
    if (technician.experience < 3) {
      riskFactors.push({
        factor: 'Low technician experience',
        impact: 0.7,
        mitigation: 'Pair with senior technician or provide additional supervision'
      })
    }
    
    // Job complexity impact
    const skillMatch = job.skillsRequired.filter(skill => 
      technician.skills.includes(skill)
    ).length / job.skillsRequired.length
    
    if (skillMatch < 0.7) {
      qualityScore -= 1.5
      riskFactors.push({
        factor: 'Skills mismatch',
        impact: 0.8,
        mitigation: 'Provide additional training or reassign to qualified technician'
      })
    }
    
    // Time constraints
    const timeRatio = job.estimatedHours / 4 // Assuming 4 hours is optimal
    if (timeRatio < 0.5) {
      qualityScore -= 1.0
      riskFactors.push({
        factor: 'Rushed timeline',
        impact: 0.6,
        mitigation: 'Allow additional time or break into multiple visits'
      })
    }
    
    // Equipment condition impact
    if (equipment && equipment.failureRisk > 0.6) {
      qualityScore -= 0.8
      riskFactors.push({
        factor: 'High-risk equipment',
        impact: 0.5,
        mitigation: 'Prepare specialized tools and replacement parts'
      })
    }
    
    const predictedQualityScore = Math.max(1, Math.min(10, qualityScore))
    
    // Compliance risk assessment
    const complianceRisk = this.assessComplianceRisk(job, technician, equipment)
    
    // Generate recommendations
    const recommendations: string[] = []
    if (predictedQualityScore < 7) {
      recommendations.push('Consider additional quality assurance measures')
    }
    if (complianceRisk > 0.3) {
      recommendations.push('Review compliance requirements before starting work')
    }
    if (riskFactors.length > 2) {
      recommendations.push('Conduct pre-job briefing to address risk factors')
    }
    
    return {
      predictedQualityScore: Math.round(predictedQualityScore * 10) / 10,
      riskFactors,
      complianceRisk,
      recommendations
    }
  }

  // 4. Intelligent Dynamic Pricing
  async calculateDynamicPrice(
    job: Job,
    marketConditions: {
      competitorPrices: number[]
      demandLevel: number // 0-1
      seasonalFactor: number
    },
    customerTier: 'premium' | 'standard' | 'basic'
  ): Promise<{
    recommendedPrice: number
    priceRange: { min: number; max: number }
    confidence: number
    factors: Array<{
      name: string
      impact: number
      reasoning: string
    }>
  }> {
    let basePrice = 150 // Base hourly rate
    const factors: Array<{
      name: string
      impact: number
      reasoning: string
    }> = []
    
    // Skill complexity multiplier
    const complexityMultiplier = 1 + (job.skillsRequired.length * 0.15)
    basePrice *= complexityMultiplier
    factors.push({
      name: 'Skill Complexity',
      impact: complexityMultiplier - 1,
      reasoning: `${job.skillsRequired.length} specialized skills required`
    })
    
    // Urgency multiplier
    const urgencyMultipliers = { 'high': 1.3, 'medium': 1.1, 'low': 1.0 }
    const urgencyMultiplier = urgencyMultipliers[job.priority]
    basePrice *= urgencyMultiplier
    factors.push({
      name: 'Urgency',
      impact: urgencyMultiplier - 1,
      reasoning: `${job.priority} priority job`
    })
    
    // Market demand adjustment
    const demandMultiplier = 1 + (marketConditions.demandLevel * 0.2)
    basePrice *= demandMultiplier
    factors.push({
      name: 'Market Demand',
      impact: demandMultiplier - 1,
      reasoning: `Current demand level at ${Math.round(marketConditions.demandLevel * 100)}%`
    })
    
    // Customer tier adjustment
    const tierMultipliers = { 'premium': 1.15, 'standard': 1.0, 'basic': 0.95 }
    const tierMultiplier = tierMultipliers[customerTier]
    basePrice *= tierMultiplier
    factors.push({
      name: 'Customer Tier',
      impact: tierMultiplier - 1,
      reasoning: `${customerTier} tier customer`
    })
    
    // Competitive pricing consideration
    if (marketConditions.competitorPrices.length > 0) {
      const avgCompetitorPrice = marketConditions.competitorPrices.reduce((sum, price) => sum + price, 0) / marketConditions.competitorPrices.length
      const competitiveFactor = Math.min(1.1, Math.max(0.9, avgCompetitorPrice / basePrice))
      basePrice *= competitiveFactor
      factors.push({
        name: 'Competitive Adjustment',
        impact: competitiveFactor - 1,
        reasoning: `Aligned with market average of $${Math.round(avgCompetitorPrice)}`
      })
    }
    
    const recommendedPrice = Math.round(basePrice * job.estimatedHours)
    const priceRange = {
      min: Math.round(recommendedPrice * 0.85),
      max: Math.round(recommendedPrice * 1.15)
    }
    
    // Confidence based on data availability
    const confidence = 0.75 + (marketConditions.competitorPrices.length * 0.05)
    
    return {
      recommendedPrice,
      priceRange,
      confidence: Math.min(0.95, confidence),
      factors
    }
  }

  // 5. Advanced Route Optimization with Multi-Constraint Solving
  async optimizeMultiConstraintRoute(
    jobs: Job[],
    technicians: TechProfile[],
    constraints: {
      maxTravelDistance: number
      requiredSkillMatch: boolean
      timeWindows: Array<{ jobId: string; start: string; end: string }>
      vehicleCapacities: number[]
      trafficConditions: Record<string, number>
      weatherImpact: number
    }
  ): Promise<{
    assignments: Map<string, Job[]>
    totalDistance: number
    totalTime: number
    constraintViolations: string[]
    optimizationScore: number
  }> {
    const assignments = new Map<string, Job[]>()
    const constraintViolations: string[] = []
    
    // Initialize assignments
    technicians.forEach((tech, index) => {
      assignments.set(`tech_${index}`, [])
    })
    
    // Sort jobs by priority and complexity
    const prioritizedJobs = jobs.sort((a, b) => {
      const aPriority = { 'high': 3, 'medium': 2, 'low': 1 }[a.priority]
      const bPriority = { 'high': 3, 'medium': 2, 'low': 1 }[b.priority]
      return bPriority - aPriority
    })
    
    // Assign jobs using constraint satisfaction
    for (const job of prioritizedJobs) {
      let bestAssignment = { techIndex: -1, score: -Infinity }
      
      technicians.forEach((tech, techIndex) => {
        const currentJobs = assignments.get(`tech_${techIndex}`) || []
        
        // Check skill constraint
        if (constraints.requiredSkillMatch) {
          const hasRequiredSkills = job.skillsRequired.every(skill => tech.skills.includes(skill))
          if (!hasRequiredSkills) return
        }
        
        // Check time window constraints
        const timeWindow = constraints.timeWindows.find(tw => tw.jobId === job.id)
        if (timeWindow) {
          // Simplified time window check
          const jobStart = new Date(timeWindow.start)
          const jobEnd = new Date(timeWindow.end)
          const workingStart = tech.workingHours.start
          const workingEnd = tech.workingHours.end
          
          if (jobStart.getHours() < workingStart || jobEnd.getHours() > workingEnd) {
            constraintViolations.push(`Time window violation for job ${job.id} and tech ${techIndex}`)
            return
          }
        }
        
        // Calculate assignment score
        const skillMatch = job.skillsRequired.filter(skill => tech.skills.includes(skill)).length / job.skillsRequired.length
        const distance = this.calculateDistance(tech.currentLocation, { lat: job.lat, lng: job.lng })
        const trafficFactor = constraints.trafficConditions[`${job.lat},${job.lng}`] || 1.0
        
        const score = skillMatch * 10 - (distance * trafficFactor) * 0.1 + tech.efficiency
        
        if (score > bestAssignment.score) {
          bestAssignment = { techIndex, score }
        }
      })
      
      if (bestAssignment.techIndex >= 0) {
        const currentJobs = assignments.get(`tech_${bestAssignment.techIndex}`) || []
        assignments.set(`tech_${bestAssignment.techIndex}`, [...currentJobs, job])
      }
    }
    
    // Calculate metrics
    let totalDistance = 0
    let totalTime = 0
    
    assignments.forEach((jobList, techKey) => {
      const techIndex = parseInt(techKey.split('_')[1])
      const tech = technicians[techIndex]
      let currentLocation = tech.currentLocation
      
      for (const job of jobList) {
        const distance = this.calculateDistance(currentLocation, { lat: job.lat, lng: job.lng })
        totalDistance += distance
        totalTime += job.estimatedHours + (distance / 40) // Travel time at 40 km/h
        currentLocation = { lat: job.lat, lng: job.lng }
      }
    })
    
    const optimizationScore = Math.max(0, 100 - constraintViolations.length * 10)
    
    return {
      assignments,
      totalDistance: Math.round(totalDistance),
      totalTime: Math.round(totalTime * 10) / 10,
      constraintViolations,
      optimizationScore
    }
  }

  // Helper methods
  private partNeededForEquipment(part: Part, equipment: Equipment): boolean {
    const equipmentParts = {
      'HVAC': ['filters', 'belts', 'sensors', 'refrigerant'],
      'Electrical': ['breakers', 'wires', 'outlets', 'panels'],
      'Networking': ['cables', 'switches', 'routers', 'connectors']
    }
    
    const relevantParts = equipmentParts[equipment.type] || []
    return relevantParts.some(relevantPart => 
      part.name.toLowerCase().includes(relevantPart) || 
      part.category.toLowerCase().includes(equipment.type.toLowerCase())
    )
  }

  private jobRequiresPart(job: Job, part: Part): boolean {
    return job.skillsRequired.some(skill => 
      part.category.toLowerCase().includes(skill.toLowerCase())
    )
  }

  private assessComplianceRisk(job: Job, technician: TechProfile, equipment?: Equipment): number {
    let risk = 0
    
    // High-risk equipment increases compliance requirements
    if (equipment && equipment.criticality === 'critical') risk += 0.3
    
    // Complex jobs have higher compliance risk
    if (job.skillsRequired.length > 2) risk += 0.2
    
    // Less experienced technicians have higher compliance risk
    if (technician.experience < 3) risk += 0.4
    
    return Math.min(1.0, risk)
  }

  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
}