import { createClient } from '@/lib/supabase/server'
import { Staff } from '@/types'

export async function getStaff(): Promise<Staff[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('staff')
      .select('*')
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

export async function deleteStaff(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id)

  if (error) throw error
}
