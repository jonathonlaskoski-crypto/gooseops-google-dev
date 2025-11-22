import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { optimizeRoute, scheduleJobs, type Job, type TechProfile } from '@/lib/optimization'
import { FieldServiceMLEngine } from '@/lib/mlInsights'
import { NavigationArrow, Robot, Target, Clock } from '@phosphor-icons/react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'

interface JobMapProps {
  jobs: Job[]
  userLocation: { lat: number; lng: number } | null
  onJobSelect: (job: Job) => void
  showOptimization?: boolean
}

export function JobMap({ jobs, userLocation, onJobSelect, showOptimization = true }: JobMapProps) {
  const [optimizedRoute, setOptimizedRoute] = useState<Job[]>([])
  const [showRoute, setShowRoute] = useState(false)
  const [mlEngine] = useState(() => new FieldServiceMLEngine())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Ensure we only render the map on the client side
    setIsClient(true)
  }, [])

  // Mock tech profile for optimization
  const mockTechProfile: TechProfile = {
    skills: ['HVAC', 'Electrical', 'Networking'],
    efficiency: 8,
    experience: 5,
    currentLocation: userLocation || { lat: 40.7128, lng: -74.0060 },
    workingHours: { start: 8, end: 17 },
    preferredJobTypes: ['HVAC', 'Electrical']
  }

  const handleOptimizeRoute = () => {
    if (!userLocation || jobs.length === 0) return
    
    const result = optimizeRoute(jobs, userLocation, mockTechProfile)
    setOptimizedRoute(result.optimizedJobs)
    setShowRoute(true)
  }

  const handleScheduleJobs = async () => {
    if (!userLocation || jobs.length === 0) return
    
    const schedule = scheduleJobs(jobs, mockTechProfile)
    console.log('Optimized schedule:', schedule)
    
    // Show insights
    const insights = await mlEngine.generateDashboardInsights(jobs, [mockTechProfile], {})
    console.log('ML Insights:', insights)
  }

  if (!isClient || !userLocation) {
    return (
      <div className="h-64 rounded-lg border flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  // Generate route coordinates for polyline
  const routeCoordinates = showRoute && optimizedRoute.length > 0
    ? [
        [userLocation.lat, userLocation.lng] as [number, number],
        ...optimizedRoute.map(job => [job.lat, job.lng] as [number, number])
      ]
    : []

  return (
    <div className="space-y-4">
      {showOptimization && (
        <div className="flex gap-2 mb-4">
          <Button onClick={handleOptimizeRoute} variant="outline" size="sm">
            <Target className="mr-2" size={16} />
            Optimize Route
          </Button>
          <Button onClick={handleScheduleJobs} variant="outline" size="sm">
            <Clock className="mr-2" size={16} />
            Smart Schedule
          </Button>
          <Button onClick={() => setShowRoute(!showRoute)} variant="outline" size="sm">
            <NavigationArrow className="mr-2" size={16} />
            {showRoute ? 'Hide Route' : 'Show Route'}
          </Button>
        </div>
      )}
      
      <div className="h-64 rounded-lg border overflow-hidden">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Optimized Route */}
          {showRoute && routeCoordinates.length > 1 && (
            <Polyline
              positions={routeCoordinates}
              color="#3b82f6"
              weight={3}
              opacity={0.7}
              dashArray="10, 5"
            />
          )}
          
          {/* User Location Marker */}
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
          
          {/* Job Markers */}
          {jobs.map((job, index) => {
            const isOptimized = showRoute && optimizedRoute.some(oj => oj.id === job.id)
            const optimizedIndex = optimizedRoute.findIndex(oj => oj.id === job.id)
            
            return (
              <Marker 
                key={job.id} 
                position={[job.lat, job.lng]}
              >
                <Popup>
                  <div className="min-w-48">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{job.title}</h3>
                      {isOptimized && (
                        <Badge variant="secondary" className="text-xs">
                          #{optimizedIndex + 1}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{job.address}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={job.priority === 'high' ? 'destructive' : job.priority === 'medium' ? 'default' : 'secondary'}>
                        {job.priority}
                      </Badge>
                      <span className="text-sm">{job.estimatedHours}h</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => onJobSelect(job)}
                    >
                      Select Job
                    </Button>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
      
      {showRoute && optimizedRoute.length > 0 && (
        <div className="bg-card p-3 rounded-lg border">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Robot size={16} />
            Optimized Route
          </h4>
          <div className="space-y-2">
            {optimizedRoute.slice(0, 3).map((job, index) => (
              <div key={job.id} className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                  {index + 1}
                </Badge>
                <span className="flex-1">{job.title}</span>
                <Badge variant="secondary" className="text-xs">
                  {job.estimatedHours}h
                </Badge>
              </div>
            ))}
            {optimizedRoute.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{optimizedRoute.length - 3} more jobs optimized
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}