import { createClient } from '@/lib/supabase/server'
import { HarvestLog } from '@/types'

export async function getHarvestLogs(): Promise<HarvestLog[]> {
  try {
    const supabase = await createClient()
    
    // Fetch harvest logs with joins
    const { data, error } = await supabase
      .from('harvest_logs')
      .select(`
        *,
        supervisor:staff!supervisor_id(id, name),
        driver:staff!driver_id(id, name),
        vehicle:vehicles!vehicle_id(id, name, license_plate)
      `)
      .is('deleted_at', null) // Only get non-deleted records
      .order('date', { ascending: false })

    if (error) {
      console.error('Supabase error fetching harvest logs:', error)
      // Fallback: try without joins
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('harvest_logs')
        .select('*')
        .is('deleted_at', null) // Only get non-deleted records
        .order('date', { ascending: false })
      
      if (fallbackError) {
        return []
      }
      
      // Fetch staff and vehicles separately and join manually
      const staffIds = [...new Set([
        ...fallbackData.map((log: any) => log.supervisor_id).filter(Boolean),
        ...fallbackData.map((log: any) => log.driver_id).filter(Boolean),
      ])]
      const vehicleIds = [...new Set(fallbackData.map((log: any) => log.vehicle_id).filter(Boolean))]
      
      const { data: staffData } = await supabase
        .from('staff')
        .select('id, name')
        .in('id', staffIds)
      
      const { data: vehicleData } = await supabase
        .from('vehicles')
        .select('id, name, license_plate')
        .in('id', vehicleIds)
      
      const staffMap = new Map((staffData || []).map((s: any) => [s.id, s.name]))
      const vehicleMap = new Map((vehicleData || []).map((v: any) => [v.id, { name: v.name, license_plate: v.license_plate }]))
      
      return (fallbackData || []).map((log: any) => ({
        id: log.id,
        date: log.date,
        blockId: log.block_id,
        palmType: log.palm_type || undefined,
        bunches: Number(log.weight_kg), // Database column still weight_kg, but we map to bunches
        supervisorId: log.supervisor_id || '',
        supervisorName: log.supervisor_id ? staffMap.get(log.supervisor_id) || null : null,
        driverId: log.driver_id || undefined,
        driverName: log.driver_id ? staffMap.get(log.driver_id) || null : null,
        vehicleId: log.vehicle_id || undefined,
        vehicleName: log.vehicle_id ? vehicleMap.get(log.vehicle_id)?.name || null : null,
        vehicleLicensePlate: log.vehicle_id ? vehicleMap.get(log.vehicle_id)?.license_plate || null : null,
        notes: log.notes,
      }))
    }
    
    return (data || []).map((log: any) => ({
      id: log.id,
      date: log.date,
      blockId: log.block_id,
      palmType: log.palm_type || undefined,
      bunches: Number(log.weight_kg), // Database column still weight_kg, but we map to bunches
      supervisorId: log.supervisor_id || '',
      supervisorName: log.supervisor?.name || null,
      driverId: log.driver_id || undefined,
      driverName: log.driver?.name || null,
      vehicleId: log.vehicle_id || undefined,
      vehicleName: log.vehicle?.name || null,
      vehicleLicensePlate: log.vehicle?.license_plate || null,
      notes: log.notes,
    }))
  } catch (error) {
    console.error('Error fetching harvest logs:', error)
    return [] // Return empty array on error
  }
}

export async function addHarvestLog(log: Omit<HarvestLog, 'id'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('harvest_logs')
    .insert({
      date: log.date,
      block_id: log.blockId,
      palm_type: log.palmType || null,
      weight_kg: log.bunches, // Database column still weight_kg, but we store bunches
      supervisor_id: log.supervisorId || null,
      driver_id: log.driverId || null,
      vehicle_id: log.vehicleId || null,
      notes: log.notes || null,
    })
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    date: data.date,
    blockId: data.block_id,
    palmType: data.palm_type || undefined,
    bunches: Number(data.weight_kg), // Map back to bunches
    supervisorId: data.supervisor_id || '',
    driverId: data.driver_id,
    vehicleId: data.vehicle_id,
    notes: data.notes,
  }
}

export async function updateHarvestLog(id: string, updates: Partial<HarvestLog>) {
  const supabase = await createClient()
  const updateData: any = {}
  
  if (updates.date) updateData.date = updates.date
  if (updates.blockId) updateData.block_id = updates.blockId
  if (updates.palmType !== undefined) updateData.palm_type = updates.palmType || null
  if (updates.bunches !== undefined) updateData.weight_kg = updates.bunches // Database column still weight_kg
  if (updates.supervisorId !== undefined) updateData.supervisor_id = updates.supervisorId || null
  if (updates.driverId !== undefined) updateData.driver_id = updates.driverId || null
  if (updates.vehicleId !== undefined) updateData.vehicle_id = updates.vehicleId || null
  if (updates.notes !== undefined) updateData.notes = updates.notes || null

  const { data, error } = await supabase
    .from('harvest_logs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    date: data.date,
    blockId: data.block_id,
    palmType: data.palm_type || undefined,
    bunches: Number(data.weight_kg), // Map back to bunches
    supervisorId: data.supervisor_id || '',
    driverId: data.driver_id,
    vehicleId: data.vehicle_id,
    notes: data.notes,
  }
}

export async function deleteHarvestLog(id: string, userId: string) {
  const supabase = await createClient()
  
  // First get the record to log in audit
  const { data: oldData } = await supabase
    .from('harvest_logs')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()
  
  // Soft delete instead of hard delete
  const { error } = await supabase
    .from('harvest_logs')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
    })
    .eq('id', id)
    .is('deleted_at', null) // Only update if not already deleted

  if (error) throw error
  return oldData // Return old data for audit logging
}
