import { createClient } from '@/lib/supabase/server'
import { HarvestLog } from '@/types'

export async function getHarvestLogs(): Promise<HarvestLog[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('harvest_logs')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Supabase error fetching harvest logs:', error)
      return [] // Return empty array instead of throwing
    }
    return (data || []).map(log => ({
      id: log.id,
      date: log.date,
      blockId: log.block_id,
      weightKg: Number(log.weight_kg),
      supervisorId: log.supervisor_id || '',
      driverId: log.driver_id,
      vehicleId: log.vehicle_id,
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
      weight_kg: log.weightKg,
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
    weightKg: Number(data.weight_kg),
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
  if (updates.weightKg !== undefined) updateData.weight_kg = updates.weightKg
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
    weightKg: Number(data.weight_kg),
    supervisorId: data.supervisor_id || '',
    driverId: data.driver_id,
    vehicleId: data.vehicle_id,
    notes: data.notes,
  }
}

export async function deleteHarvestLog(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('harvest_logs')
    .delete()
    .eq('id', id)

  if (error) throw error
}
