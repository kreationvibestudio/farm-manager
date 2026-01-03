import { createClient } from '@/lib/supabase/server'
import { MaintenanceLog } from '@/types'

export async function getMaintenanceLogs(): Promise<MaintenanceLog[]> {
  try {
    const supabase = await createClient()
    
    // First check if table exists by trying a simple query
    const { data, error } = await supabase
      .from('maintenance_logs')
      .select(`
        *,
        supervisor:staff!supervisor_id(id, name)
      `)
      .order('date', { ascending: false })
      .limit(1000) // Limit results for performance

    if (error) {
      // If table doesn't exist (42P01), return empty array gracefully
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.warn('Maintenance logs table does not exist yet. Please run the SQL schema.')
        return []
      }
      
      console.error('Supabase error fetching maintenance logs:', error)
      // Fallback: try without joins
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('maintenance_logs')
        .select('*')
        .order('date', { ascending: false })
        .limit(1000)
      
      if (fallbackError) {
        // If table doesn't exist, return empty array
        if (fallbackError.code === '42P01' || fallbackError.message.includes('does not exist')) {
          return []
        }
        return []
      }
      
      // Fetch staff separately
      const staffIds = [...new Set(fallbackData.map((log: any) => log.supervisor_id).filter(Boolean))]
      
      const { data: staffData } = await supabase
        .from('staff')
        .select('id, name')
        .in('id', staffIds)
      
      const staffMap = new Map((staffData || []).map((s: any) => [s.id, s.name]))
      
      return (fallbackData || []).map((log: any) => ({
        id: log.id,
        date: log.date,
        blockId: log.block_id,
        activity: log.activity as MaintenanceLog['activity'],
        supervisorId: log.supervisor_id || '',
        supervisorName: log.supervisor_id ? staffMap.get(log.supervisor_id) || null : null,
        staffCount: log.staff_count || undefined,
        notes: log.notes,
        created_at: log.created_at,
        updated_at: log.updated_at,
      }))
    }
    
    return (data || []).map((log: any) => ({
      id: log.id,
      date: log.date,
      blockId: log.block_id,
      activity: log.activity as MaintenanceLog['activity'],
      supervisorId: log.supervisor_id || '',
      supervisorName: log.supervisor?.name || null,
      staffCount: log.staff_count || undefined,
      notes: log.notes,
      created_at: log.created_at,
      updated_at: log.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching maintenance logs:', error)
    return []
  }
}

export async function addMaintenanceLog(log: Omit<MaintenanceLog, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('maintenance_logs')
    .insert({
      date: log.date,
      block_id: log.blockId,
      activity: log.activity,
      supervisor_id: log.supervisorId || null,
      staff_count: log.staffCount || null,
      notes: log.notes || null,
    })
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    date: data.date,
    blockId: data.block_id,
    activity: data.activity as MaintenanceLog['activity'],
    supervisorId: data.supervisor_id || '',
    supervisorName: null,
    staffCount: data.staff_count || undefined,
    notes: data.notes,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

export async function updateMaintenanceLog(id: string, updates: Partial<MaintenanceLog>) {
  const supabase = await createClient()
  const updateData: any = {}
  
  if (updates.date) updateData.date = updates.date
  if (updates.blockId) updateData.block_id = updates.blockId
  if (updates.activity) updateData.activity = updates.activity
  if (updates.supervisorId !== undefined) updateData.supervisor_id = updates.supervisorId || null
  if (updates.staffCount !== undefined) updateData.staff_count = updates.staffCount || null
  if (updates.notes !== undefined) updateData.notes = updates.notes || null

  const { data, error } = await supabase
    .from('maintenance_logs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    date: data.date,
    blockId: data.block_id,
    activity: data.activity as MaintenanceLog['activity'],
    supervisorId: data.supervisor_id || '',
    supervisorName: null,
    staffCount: data.staff_count || undefined,
    notes: data.notes,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

export async function deleteMaintenanceLog(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('maintenance_logs')
    .delete()
    .eq('id', id)

  if (error) throw error
}
