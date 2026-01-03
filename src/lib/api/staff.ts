import { createClient } from '@/lib/supabase/server'
import { Staff } from '@/types'

export async function getStaff(): Promise<Staff[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .is('deleted_at', null) // Only get non-deleted records
      .order('name', { ascending: true })

    if (error) {
      console.error('Supabase error fetching staff:', error)
      return []
    }
    return (data || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      role: s.role as Staff['role'],
      contact: s.contact || undefined,
    }))
  } catch (error) {
    console.error('Error fetching staff:', error)
    return []
  }
}

export async function addStaff(staff: Omit<Staff, 'id'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff')
    .insert({
      name: staff.name,
      role: staff.role,
      contact: staff.contact || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateStaff(id: string, updates: Partial<Staff>) {
  const supabase = await createClient()
  const updateData: any = {}
  
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.role !== undefined) updateData.role = updates.role
  if (updates.contact !== undefined) updateData.contact = updates.contact || null

  const { data, error } = await supabase
    .from('staff')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteStaff(id: string, userId: string) {
  const supabase = await createClient()
  
  // First get the record to log in audit
  const { data: oldData } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()
  
  // Soft delete instead of hard delete
  const { error } = await supabase
    .from('staff')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
    })
    .eq('id', id)
    .is('deleted_at', null) // Only update if not already deleted

  if (error) throw error
  return oldData // Return old data for audit logging
}
