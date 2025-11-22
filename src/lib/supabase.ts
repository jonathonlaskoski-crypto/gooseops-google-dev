import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getServiceSupabase() {
  if (!supabaseServiceKey) {
    throw new Error('Supabase service role key not configured. Set VITE_SUPABASE_SERVICE_ROLE_KEY for server-side operations.')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Field Tech Job Management Tables
export interface JobRecord {
  id: string
  title: string
  description: string
  address: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'assigned' | 'in-progress' | 'completed'
  assigned_tech_id?: string
  created_at: string
  updated_at: string
  location: {
    lat: number
    lng: number
  }
  estimated_duration: number
  customer_info?: {
    name: string
    phone: string
    email?: string
  }
}

export interface TaskRecord {
  id: string
  job_id: string
  title: string
  description: string
  completed: boolean
  order: number
  created_at: string
  completed_at?: string
}

export interface CheckInRecord {
  id: string
  job_id: string
  tech_id: string
  timestamp: string
  location: {
    lat: number
    lng: number
  }
  photos?: string[]
  notes?: string
}

export interface ChatMessageRecord {
  id: string
  job_id?: string
  tech_id: string
  message: string
  role: 'user' | 'assistant'
  timestamp: string
  metadata?: any
}

// Neural Empire Tables
export interface NeuralSystemRecord {
  id: string
  tech_id: string
  system_id: string
  active: boolean
  settings: any
  last_activated: string
}

export interface NovaMessageRecord {
  id: string
  tech_id: string
  user_message: string
  nova_response: string
  timestamp: string
  confidence_score?: number
  context?: any
}

// Real-time sync functions
export const syncJobUpdates = async (jobId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()
  
  if (error) {
    console.error('Sync error:', error)
    return null
  }
  
  return data
}

export const syncNeuralSystems = async (techId: string) => {
  const { data, error } = await supabase
    .from('neural_systems')
    .select('*')
    .eq('tech_id', techId)
  
  if (error) {
    console.error('Neural sync error:', error)
    return []
  }
  
  return data
}

export const syncNovaMessages = async (techId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('nova_messages')
    .select('*')
    .eq('tech_id', techId)
    .order('timestamp', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Nova sync error:', error)
    return []
  }
  
  return data
}
