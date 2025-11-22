// Advanced optimization algorithms for field service operations
export interface Job {
  id: string
  title: string
  address: string
  lat: number
  lng: number
  priority: 'low' | 'medium' | 'high'
  estimatedHours: number
  skillsRequired: string[]
  description: string
  deadline?: string
  customerType?: 'premium' | 'standard' | 'basic'
  emergencyLevel?: number
  trafficMultiplier?: number
  weatherImpact?: number
  equipmentComplexity?: number
  historicalDuration?: number
  profitMargin?: number
}

export interface TechProfile {
  skills: string[]
  efficiency: number
  experience: number
  currentLocation: { lat: number; lng: number }
  workingHours: { start: number; end: number }
  preferredJobTypes: string[]
}

// Haversine formula for calculating distance between two points
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// ML-based job prioritization using weighted scoring
export function calculateJobPriority(
  job: Job, 
  techProfile: TechProfile,
  currentTime: Date = new Date()
): number {
  let score = 0
  
  // Base priority scoring
  const priorityScore = { 'high': 10, 'medium': 5, 'low': 2 }[job.priority] || 0
  score += priorityScore * 2
  
  // Skill match scoring
  const skillMatch = job.skillsRequired.filter(skill => 
    techProfile.skills.includes(skill)
  ).length / Math.max(job.skillsRequired.length, 1)
  score += skillMatch * 8
  
  // Distance penalty (closer jobs get higher priority)
  const distance = calculateDistance(
    job.lat, job.lng,
    techProfile.currentLocation.lat, techProfile.currentLocation.lng
  )
  const distanceScore = Math.max(0, 10 - (distance / 5)) // penalty increases with distance
  score += distanceScore * 1.5
  
  // Time efficiency (prefer jobs that fit working hours)
  const currentHour = currentTime.getHours()
  const remainingHours = Math.max(0, techProfile.workingHours.end - currentHour)
  const timeEfficiency = job.estimatedHours <= remainingHours ? 3 : -2
  score += timeEfficiency
  
  // Deadline urgency
  if (job.deadline) {
    const deadlineDate = new Date(job.deadline)
    const hoursUntilDeadline = (deadlineDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60)
    if (hoursUntilDeadline < 24) score += 8
    else if (hoursUntilDeadline < 72) score += 4
  }
  
  // Customer type priority
  const customerScore = { 'premium': 6, 'standard': 3, 'basic': 1 }[job.customerType || 'standard']
  score += customerScore
  
  // Emergency level
  score += (job.emergencyLevel || 0) * 3
  
  // Profit margin consideration
  score += (job.profitMargin || 0) * 0.5
  
  return Math.max(0, score)
}

// Advanced route optimization using nearest neighbor with 2-opt improvements
export function optimizeRoute(
  jobs: Job[],
  startLocation: { lat: number; lng: number },
  techProfile: TechProfile
): { optimizedJobs: Job[]; totalDistance: number; estimatedTime: number } {
  if (jobs.length === 0) {
    return { optimizedJobs: [], totalDistance: 0, estimatedTime: 0 }
  }
  
  // Calculate priority scores for all jobs
  const jobsWithPriority = jobs.map(job => ({
    ...job,
    priorityScore: calculateJobPriority(job, techProfile)
  }))
  
  // Start with highest priority job
  const sortedJobs = [...jobsWithPriority].sort((a, b) => b.priorityScore - a.priorityScore)
  const route: Job[] = []
  const remaining = [...sortedJobs]
  let currentLocation = startLocation
  let totalDistance = 0
  
  // Nearest neighbor with priority weighting
  while (remaining.length > 0) {
    let bestIndex = 0
    let bestScore = -Infinity
    
    remaining.forEach((job, index) => {
      const distance = calculateDistance(
        currentLocation.lat, currentLocation.lng,
        job.lat, job.lng
      )
      
      // Combined score: priority / distance (higher priority, closer distance = better)
      const score = job.priorityScore / Math.max(distance, 0.1)
      
      if (score > bestScore) {
        bestScore = score
        bestIndex = index
      }
    })
    
    const nextJob = remaining[bestIndex]
    const distance = calculateDistance(
      currentLocation.lat, currentLocation.lng,
      nextJob.lat, nextJob.lng
    )
    
    totalDistance += distance
    route.push(nextJob)
    currentLocation = { lat: nextJob.lat, lng: nextJob.lng }
    remaining.splice(bestIndex, 1)
  }
  
  // Apply 2-opt optimization to improve route
  const optimizedRoute = twoOptOptimization(route, startLocation)
  
  // Recalculate total distance for optimized route
  let optimizedDistance = 0
  let current = startLocation
  
  for (const job of optimizedRoute) {
    optimizedDistance += calculateDistance(current.lat, current.lng, job.lat, job.lng)
    current = { lat: job.lat, lng: job.lng }
  }
  
  // Estimate total time including drive time and job duration
  const totalJobTime = optimizedRoute.reduce((sum, job) => sum + job.estimatedHours, 0)
  const driveTime = optimizedDistance / 30 // Assuming 30 km/h average including traffic
  const estimatedTime = totalJobTime + driveTime
  
  return {
    optimizedJobs: optimizedRoute,
    totalDistance: optimizedDistance,
    estimatedTime
  }
}

// 2-opt route optimization algorithm
function twoOptOptimization(route: Job[], startLocation: { lat: number; lng: number }): Job[] {
  if (route.length < 3) return route
  
  let bestRoute = [...route]
  let improved = true
  
  while (improved) {
    improved = false
    
    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length; j++) {
        const newRoute = twoOptSwap(bestRoute, i, j)
        const oldDistance = calculateRouteDistance([startLocation, ...bestRoute])
        const newDistance = calculateRouteDistance([startLocation, ...newRoute])
        
        if (newDistance < oldDistance) {
          bestRoute = newRoute
          improved = true
        }
      }
    }
  }
  
  return bestRoute
}

function twoOptSwap(route: Job[], i: number, j: number): Job[] {
  const newRoute = [...route]
  const segment = newRoute.slice(i, j + 1).reverse()
  newRoute.splice(i, j - i + 1, ...segment)
  return newRoute
}

function calculateRouteDistance(locations: Array<{ lat: number; lng: number }>): number {
  let distance = 0
  for (let i = 0; i < locations.length - 1; i++) {
    distance += calculateDistance(
      locations[i].lat, locations[i].lng,
      locations[i + 1].lat, locations[i + 1].lng
    )
  }
  return distance
}

// Dynamic job scheduling with time windows
export function scheduleJobs(
  jobs: Job[],
  techProfile: TechProfile,
  startTime: Date = new Date()
): Array<{
  job: Job
  scheduledStart: Date
  scheduledEnd: Date
  travelTime: number
}> {
  const optimizedResult = optimizeRoute(jobs, techProfile.currentLocation, techProfile)
  const schedule: Array<{
    job: Job
    scheduledStart: Date
    scheduledEnd: Date
    travelTime: number
  }> = []
  
  let currentTime = new Date(startTime)
  let currentLocation = techProfile.currentLocation
  
  for (const job of optimizedResult.optimizedJobs) {
    const travelDistance = calculateDistance(
      currentLocation.lat, currentLocation.lng,
      job.lat, job.lng
    )
    const travelTime = (travelDistance / 30) * 60 // minutes, assuming 30 km/h
    
    // Add travel time
    currentTime = new Date(currentTime.getTime() + travelTime * 60000)
    
    const scheduledStart = new Date(currentTime)
    const jobDuration = job.estimatedHours * 60 * 60 * 1000 // milliseconds
    const scheduledEnd = new Date(currentTime.getTime() + jobDuration)
    
    schedule.push({
      job,
      scheduledStart,
      scheduledEnd,
      travelTime
    })
    
    currentTime = scheduledEnd
    currentLocation = { lat: job.lat, lng: job.lng }
  }
  
  return schedule
}

// Predictive analytics for job completion time
export function predictJobDuration(
  job: Job,
  techProfile: TechProfile,
  historicalData?: Array<{ actualDuration: number; estimatedDuration: number }>
): number {
  let adjustedDuration = job.estimatedHours
  
  // Skill proficiency adjustment
  const skillMatch = job.skillsRequired.filter(skill => 
    techProfile.skills.includes(skill)
  ).length / job.skillsRequired.length
  
  if (skillMatch < 0.5) {
    adjustedDuration *= 1.3 // 30% longer for low skill match
  } else if (skillMatch > 0.8) {
    adjustedDuration *= 0.9 // 10% faster for high skill match
  }
  
  // Experience factor
  adjustedDuration *= (1 - (techProfile.efficiency - 1) * 0.1)
  
  // Equipment complexity
  if (job.equipmentComplexity) {
    adjustedDuration *= (1 + job.equipmentComplexity * 0.1)
  }
  
  // Historical accuracy adjustment
  if (historicalData && historicalData.length > 5) {
    const avgAccuracy = historicalData.reduce((sum, data) => 
      sum + (data.actualDuration / data.estimatedDuration), 0
    ) / historicalData.length
    
    adjustedDuration *= avgAccuracy
  }
  
  return Math.max(0.5, adjustedDuration) // Minimum 30 minutes
}

// Capacity planning and workload balancing
export function optimizeWorkloadDistribution(
  jobs: Job[],
  technicians: TechProfile[],
  constraints: {
    maxHoursPerTech: number
    maxJobsPerTech: number
    skillRequirements: boolean
  }
): Map<string, Job[]> {
  const assignment = new Map<string, Job[]>()
  
  // Initialize assignments
  technicians.forEach((tech, index) => {
    assignment.set(`tech_${index}`, [])
  })
  
  // Sort jobs by priority and complexity
  const sortedJobs = jobs.sort((a, b) => {
    const aPriority = calculateJobPriority(a, technicians[0])
    const bPriority = calculateJobPriority(b, technicians[0])
    return bPriority - aPriority
  })
  
  // Assign jobs using best-fit algorithm
  for (const job of sortedJobs) {
    let bestTech = ''
    let bestScore = -Infinity
    
    technicians.forEach((tech, index) => {
      const techId = `tech_${index}`
      const currentJobs = assignment.get(techId) || []
      const currentHours = currentJobs.reduce((sum, j) => sum + j.estimatedHours, 0)
      
      // Check constraints
      if (currentHours + job.estimatedHours > constraints.maxHoursPerTech) return
      if (currentJobs.length >= constraints.maxJobsPerTech) return
      
      if (constraints.skillRequirements) {
        const hasSkills = job.skillsRequired.every(skill => tech.skills.includes(skill))
        if (!hasSkills) return
      }
      
      // Calculate assignment score
      const skillMatch = job.skillsRequired.filter(skill => 
        tech.skills.includes(skill)
      ).length / Math.max(job.skillsRequired.length, 1)
      
      const distance = calculateDistance(
        job.lat, job.lng,
        tech.currentLocation.lat, tech.currentLocation.lng
      )
      
      const score = skillMatch * 10 - distance * 0.1 + tech.efficiency * 2
      
      if (score > bestScore) {
        bestScore = score
        bestTech = techId
      }
    })
    
    if (bestTech) {
      const currentJobs = assignment.get(bestTech) || []
      assignment.set(bestTech, [...currentJobs, job])
    }
  }
  
  return assignment
}