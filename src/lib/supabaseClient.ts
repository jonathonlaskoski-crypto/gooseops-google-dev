import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.')
  // Create a dummy client to prevent app crash
  // @ts-ignore
  supabaseInstance = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      upsert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      order: () => ({ data: [], error: { message: 'Supabase not configured' } }),
      eq: () => ({ data: [], error: { message: 'Supabase not configured' } }),
      single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    }
  }
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseInstance;

// Test connection function
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('ares_interactions')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }

    console.log('✅ Supabase connection successful!')
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}

// A.R.E.S specific functions
export const aresSupabase = {
  // Interactions
  async logInteraction(interaction: {
    id: string
    session_id: string
    input: string
    output: string
    confidence: number
    capability: string
    response_time_ms: number
  }) {
    const { data, error } = await supabase
      .from('ares_interactions')
      .insert({
        ...interaction,
        user_id: null, // Will be set when auth is implemented
        feedback: null
      })

    if (error) {
      console.error('Failed to log interaction:', error)
      return null
    }

    return data
  },

  // Equipment Catalog
  async getEquipmentCatalog() {
    const { data, error } = await supabase
      .from('ares_equipment_catalog')
      .select('*')
      .eq('is_active', true)
      .order('manufacturer', { ascending: true })

    if (error) {
      console.error('Failed to fetch equipment catalog:', error)
      return []
    }

    return data || []
  },

  // Lead Analysis
  async getLeadAnalysis() {
    const { data, error } = await supabase
      .from('ares_lead_analysis')
      .select('*')
      .order('score', { ascending: false })

    if (error) {
      console.error('Failed to fetch lead analysis:', error)
      return []
    }

    return data || []
  },

  // Mission Intelligence
  async getActiveMissions() {
    const { data, error } = await supabase
      .from('goos_mission_intelligence')
      .select('*')
      .not('mission_status', 'in', ['completed', 'cancelled'])
      .order('mission_priority', { ascending: false })
      .order('scheduled_date', { ascending: true })

    if (error) {
      console.error('Failed to fetch active missions:', error)
      return []
    }

    return data || []
  },

  async createMission(mission: any) {
    const { data, error } = await supabase
      .from('goos_mission_intelligence')
      .insert(mission)
      .select()

    if (error) {
      console.error('Failed to create mission:', error)
      return null
    }

    return data?.[0] || null
  },

  async updateMission(missionId: string, updates: any) {
    const { data, error } = await supabase
      .from('goos_mission_intelligence')
      .update(updates)
      .eq('mission_id', missionId)
      .select()

    if (error) {
      console.error('Failed to update mission:', error)
      return null
    }

    return data?.[0] || null
  }
}
