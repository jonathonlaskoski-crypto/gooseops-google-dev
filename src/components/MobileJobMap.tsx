import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDevice } from '@/hooks/use-mobile';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { type Job } from '@/lib/optimization';
import { type TechProfile, optimizeRoute } from '@/lib/optimization';

interface JobWithMeta extends Job {
  distanceKm?: number;
  priorityScore?: number;
  timeEstimate?: number;
}
import { OptimizedImage } from '@/components/ui/optimized-image';

import {
  MapPin,
  NavigationArrow,
  Crosshair,
  CaretDown,
  CaretUp,
  SortAscending,
  Clock
} from '@phosphor-icons/react';

interface MobileJobMapProps {
  jobs: Job[];
  userLocation: { lat: number; lng: number } | null;
  onJobSelect: (job: Job) => void;
  selectedJob?: Job | null;
  showOptimization?: boolean;
  showMarkerLabels?: boolean;
}

export function MobileJobMap({
  jobs,
  userLocation,
  onJobSelect,
  selectedJob,
  showOptimization = true,
  showMarkerLabels = true,
}: MobileJobMapProps) {
  const { width, height, isPortrait } = useDevice();
  const [optimizedRoute, setOptimizedRoute] = useState<Job[] | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [mapHeight, setMapHeight] = useState(isPortrait ? 300 : 200);
  const [jobSort, setJobSort] = useState<'distance' | 'priority' | 'time'>('distance');
  const [sortedJobs, setSortedJobs] = useState<JobWithMeta[]>(jobs);

  // Map component to handle recenter when location changes
  const RecenterAutomatically = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], map.getZoom());
    }, [lat, lng]);
    return null;
  };

  // Location marker icon styling
  const userIcon = L.divIcon({
    className: 'user-location-marker',
    html: `<div class="h-4 w-4 rounded-full bg-blue-500 animate-ping"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  const jobIcon = L.divIcon({
    className: 'job-location-marker',
    html: `<div class="h-4 w-4 rounded-full bg-green-500"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  const selectedJobIcon = L.divIcon({
    className: 'selected-job-marker',
    html: `<div class="h-6 w-6 rounded-full bg-red-500 animate-pulse"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // Calculate distances and sort jobs
  useEffect(() => {
    if (jobs.length === 0 || !userLocation) {
      setSortedJobs(jobs);
      return;
    }

    const jobsWithMeta = jobs.map(job => {
      // Calculate distance in kilometers using Haversine formula
      const R = 6371; // Earth radius in km
      const dLat = ((job.lat - userLocation.lat) * Math.PI) / 180;
      const dLon = ((job.lng - userLocation.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((job.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km

      const timeEstimate = job.estimatedHours || 2;

      // Calculate priority score (higher number = higher priority)
      const priorityScore =
        (job.priority === 'high' ? 3 :
          job.priority === 'medium' ? 2 : 1) *
        (1 / Math.max(0.1, distance)); // Closer jobs get higher priority

      return {
        ...job,
        distanceKm: distance,
        priorityScore,
        timeEstimate
      };
    });

    let sorted = [...jobsWithMeta];

    // Sort by the selected criterion
    if (jobSort === 'distance') {
      sorted = sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (jobSort === 'priority') {
      sorted = sorted.sort((a, b) => b.priorityScore - a.priorityScore);
    } else if (jobSort === 'time') {
      sorted = sorted.sort((a, b) => a.timeEstimate - b.timeEstimate);
    }

    setSortedJobs(sorted);
  }, [jobs, userLocation, jobSort]);

  // Handle optimize route
  const handleOptimizeRoute = () => {
    if (!userLocation) return;

    const startLocation = { lat: userLocation.lat, lng: userLocation.lng };
    const techProfile: TechProfile = {
      skills: ['HVAC', 'Electrical', 'Networking'],
      efficiency: 8,
      experience: 5,
      currentLocation: startLocation,
      workingHours: { start: 8, end: 17 },
      preferredJobTypes: []
    };

    const result = optimizeRoute(jobs, startLocation, techProfile);
    setOptimizedRoute(result.optimizedJobs);
  };

  // Toggle map expansion
  const toggleMapExpanded = () => {
    const newMapExpanded = !mapExpanded;
    setMapExpanded(newMapExpanded);
    setMapHeight(newMapExpanded ? (isPortrait ? height * 0.5 : height * 0.7) : (isPortrait ? 300 : 200));
  };

  const formatDistance = (km: number): string => {
    return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Map Component - Simplified for technicians */}
      <Card className="overflow-hidden">
        <CardHeader className="p-2 pb-0 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            <MapPin className="inline mr-1" />
            Today&apos;s Jobs
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMapExpanded}
          >
            {mapExpanded ? <CaretDown size={18} /> : <CaretUp size={18} />}
          </Button>
        </CardHeader>

        <CardContent className="p-0 transition-all duration-300" style={{ height: `${mapHeight}px` }}>
          {userLocation ? (
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
              style={{ width: '100%', height: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {userLocation && (
                <Marker
                  position={[userLocation.lat, userLocation.lng]}
                  icon={userIcon}
                >
                  <Popup>Your Location</Popup>
                </Marker>
              )}

              {sortedJobs.map((job) => (
                <Marker
                  key={job.id}
                  position={[job.lat, job.lng]}
                  icon={selectedJob && selectedJob.id === job.id ? selectedJobIcon : jobIcon}
                  eventHandlers={{
                    click: () => onJobSelect(job),
                  }}
                >
                  {showMarkerLabels && (
                    <Popup>
                      <div className="text-sm">
                        <div className="font-semibold">{job.title}</div>
                        <div>{job.address}</div>
                        <div>
                          Priority: <Badge variant={
                            job.priority === 'high' ? "destructive" :
                              job.priority === 'medium' ? "default" :
                                "secondary"
                          }>{job.priority}</Badge>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => onJobSelect(job)}
                        >
                          Select Job
                        </Button>
                      </div>
                    </Popup>
                  )}
                </Marker>
              ))}

              {/* Recenter when location changes */}
              {userLocation && (
                <RecenterAutomatically lat={userLocation.lat} lng={userLocation.lng} />
              )}
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-muted">
              <div className="text-center">
                <Crosshair className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simplified Job Sorting Controls for Technicians */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">View:</div>
        <Button
          variant={jobSort === 'distance' ? "default" : "outline"}
          size="sm"
          className="text-xs"
          onClick={() => setJobSort('distance')}
        >
          <NavigationArrow className="mr-1" size={12} />
          Nearest
        </Button>
        <Button
          variant={jobSort === 'priority' ? "default" : "outline"}
          size="sm"
          className="text-xs"
          onClick={() => setJobSort('priority')}
        >
          <SortAscending className="mr-1" size={12} />
          Urgent First
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto text-xs"
          onClick={handleOptimizeRoute}
        >
          Best Route
        </Button>
      </div>

      {/* Job List */}
      <div className="space-y-2">
        {sortedJobs.length > 0 ? (
          sortedJobs.map((job) => {
            const distanceKm = job.distanceKm || 0;
            return (
              <Card
                key={job.id}
                className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedJob && selectedJob.id === job.id ? 'border-primary border-2' : ''
                  }`}
                onClick={() => onJobSelect(job)}
              >
                <div className="flex">
                  <div
                    className={`w-2 h-full ${job.priority === 'high' ? 'bg-red-500' :
                      job.priority === 'medium' ? 'bg-orange-500' :
                        'bg-green-500'
                      }`}
                  />
                  <CardContent className="p-3 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-xs text-muted-foreground">{job.address}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant={job.priority === 'high' ? "destructive" : "outline"} className="mb-1">
                          {job.priority === 'high' ? "Urgent" : formatDistance(distanceKm)}
                        </Badge>
                        <Badge variant="outline">
                          {job.estimatedHours || 2}h
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No jobs available in your area.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
