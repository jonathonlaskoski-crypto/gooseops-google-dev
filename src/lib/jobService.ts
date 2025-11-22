import { supabase } from './supabase'
import type { Job } from '@/lib/optimization'

export async function fetchJobs(userLocation?: { lat: number; lng: number }): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select(
      `id, title, description, priority, estimated_duration, skills_required, customer_info, location_lat, location_lng`
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data || []).map((job) => ({
    id: job.id,
    title: job.title,
    description: job.description,
    priority: job.priority as Job['priority'],
    estimatedHours: job.estimated_duration ?? 1,
    skillsRequired: job.skills_required ?? [],
    address: job.customer_info?.address ?? 'Not Provided',
    lat: job.location_lat ?? userLocation?.lat ?? 40.7128,
    lng: job.location_lng ?? userLocation?.lng ?? -74.006,
  }))
}

