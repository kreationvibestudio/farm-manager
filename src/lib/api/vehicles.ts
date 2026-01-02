import { createClient } from '@/lib/supabase/server'
import { Vehicle } from '@/types'

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Supabase error fetching vehicles:', error)
      return [] // Return empty array instead of throwing
    }
    return (data || []).map(v => ({
      id: v.id,
      name: v.name,
      type: v.type as Vehicle['type'],
      status: v.status as Vehicle['status'],
      licensePlate: v.license_plate,
      lastMaintenance: v.last_maintenance,
      currentDriverId: v.current_driver_id,
    }))
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return [] // Return empty array on error
  }
}

export async function addVehicle(vehicle: Omit<Vehicle, 'id'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      name: vehicle.name,
      type: vehicle.type,
      status: vehicle.status,
      license_plate: vehicle.licensePlate,
      last_maintenance: vehicle.lastMaintenance,
      current_driver_id: vehicle.currentDriverId,
    })
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    type: data.type as Vehicle['type'],
    status: data.status as Vehicle['status'],
    licensePlate: data.license_plate,
    lastMaintenance: data.last_maintenance,
    currentDriverId: data.current_driver_id,
  }
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>) {
  const supabase = await createClient()
  const updateData: any = {}
  
  if (updates.name) updateData.name = updates.name
  if (updates.type) updateData.type = updates.type
  if (updates.status) updateData.status = updates.status
  if (updates.licensePlate !== undefined) updateData.license_plate = updates.licensePlate
  if (updates.lastMaintenance !== undefined) updateData.last_maintenance = updates.lastMaintenance
  if (updates.currentDriverId !== undefined) updateData.current_driver_id = updates.currentDriverId

  const { data, error } = await supabase
    .from('vehicles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    type: data.type as Vehicle['type'],
    status: data.status as Vehicle['status'],
    licensePlate: data.license_plate,
    lastMaintenance: data.last_maintenance,
    currentDriverId: data.current_driver_id,
  }
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)

  if (error) throw error
}
