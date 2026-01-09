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
      designation: s.designation as Staff['designation'] || undefined,
      contact: s.contact || undefined,
      userId: s.user_id || undefined,
    }))
  } catch (error) {
    console.error('Error fetching staff:', error)
    return []
  }
}

export async function addStaff(staff: Omit<Staff, 'id'>) {
  const supabase = await createClient()
  
  // Check for duplicate name (case-insensitive, excluding soft-deleted)
  const normalizedName = staff.name.trim().toLowerCase()
  const { data: existingStaff, error: checkError } = await supabase
    .from('staff')
    .select('id, name')
    .is('deleted_at', null)
    .ilike('name', staff.name.trim())

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking for duplicates:', checkError)
    // Continue anyway - don't block if check fails
  }

  if (existingStaff && existingStaff.length > 0) {
    throw new Error(`A staff member with the name "${staff.name}" already exists. Please use a different name or edit the existing staff member.`)
  }

  const { data, error } = await supabase
    .from('staff')
    .insert({
      name: staff.name.trim(), // Trim whitespace
      role: staff.role,
      designation: staff.designation || null,
      contact: staff.contact?.trim() || null,
      user_id: staff.userId || null,
    })
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    role: data.role as Staff['role'],
    designation: data.designation as Staff['designation'] || undefined,
    contact: data.contact || undefined,
    userId: data.user_id || undefined,
  }
}

export async function updateStaff(id: string, updates: Partial<Staff>) {
  const supabase = await createClient()
  const updateData: any = {}
  
  // Check for duplicate name if name is being updated
  if (updates.name !== undefined) {
    const normalizedName = updates.name.trim().toLowerCase()
    const { data: existingStaff, error: checkError } = await supabase
      .from('staff')
      .select('id, name')
      .is('deleted_at', null)
      .neq('id', id) // Exclude current staff member
      .ilike('name', updates.name.trim())

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for duplicates:', checkError)
    }

    if (existingStaff && existingStaff.length > 0) {
      throw new Error(`A staff member with the name "${updates.name}" already exists. Please use a different name.`)
    }

    updateData.name = updates.name.trim() // Trim whitespace
  }
  
  if (updates.role !== undefined) updateData.role = updates.role
  if (updates.designation !== undefined) updateData.designation = updates.designation || null
  if (updates.contact !== undefined) updateData.contact = updates.contact?.trim() || null
  if (updates.userId !== undefined) updateData.user_id = updates.userId || null

  const { data, error } = await supabase
    .from('staff')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    role: data.role as Staff['role'],
    designation: data.designation as Staff['designation'] || undefined,
    contact: data.contact || undefined,
    userId: data.user_id || undefined,
  }
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
