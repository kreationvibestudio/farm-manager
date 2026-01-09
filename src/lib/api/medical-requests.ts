import { createClient } from '@/lib/supabase/server'
import { MedicalRequest } from '@/types'

export async function getMedicalRequests(): Promise<MedicalRequest[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('medical_requests')
      .select(`
        *,
        staff:staff_id(id, name),
        supervisor:supervisor_id(id, name),
        manager:manager_id(id, name)
      `)
      .order('request_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching medical requests:', error)
      return []
    }
    
    return (data || []).map((req: any) => ({
      id: req.id,
      staffId: req.staff_id,
      staffName: req.staff?.name || null,
      requestDate: req.request_date,
      reason: req.reason,
      isWorkRelated: req.is_work_related,
      urgency: req.urgency,
      status: req.status,
      supervisorId: req.supervisor_id,
      supervisorName: req.supervisor?.name || null,
      supervisorActionDate: req.supervisor_action_date,
      supervisorNotes: req.supervisor_notes,
      managerId: req.manager_id,
      managerName: req.manager?.name || null,
      managerActionDate: req.manager_action_date,
      managerNotes: req.manager_notes,
      paymentStatus: req.payment_status,
      paymentAmount: req.payment_amount ? Number(req.payment_amount) : undefined,
      paymentDate: req.payment_date,
      paymentReference: req.payment_reference,
      createdAt: req.created_at,
      updatedAt: req.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching medical requests:', error)
    return []
  }
}

export async function addMedicalRequest(request: Omit<MedicalRequest, 'id' | 'createdAt' | 'updatedAt'>) {
  const supabase = await createClient()
  
  // Validate required fields
  if (!request.staffId) {
    throw new Error('Staff ID is required')
  }
  if (!request.requestDate) {
    throw new Error('Request date is required')
  }
  if (!request.reason || !request.reason.trim()) {
    throw new Error('Reason is required')
  }
  if (!request.urgency) {
    throw new Error('Urgency level is required')
  }
  
  console.log('Inserting medical request:', {
    staff_id: request.staffId,
    request_date: request.requestDate,
    reason: request.reason,
    is_work_related: request.isWorkRelated,
    urgency: request.urgency,
  })
  
  const { data, error } = await supabase
    .from('medical_requests')
    .insert({
      staff_id: request.staffId,
      request_date: request.requestDate,
      reason: request.reason.trim(),
      is_work_related: request.isWorkRelated || false,
      urgency: request.urgency,
      status: 'Pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase error inserting medical request:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    
    // Create a more descriptive error if table doesn't exist
    if (error.message && (
      error.message.includes('Could not find the table') ||
      error.message.includes('medical_requests') && error.message.includes('not found') ||
      error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST301'
    )) {
      const tableNotFoundError = new Error(
        'Medical requests table not found. Please run the database migration: supabase-medical-requests-schema.sql'
      ) as any
      tableNotFoundError.code = error.code
      tableNotFoundError.details = error.message
      throw tableNotFoundError
    }
    
    throw error
  }
  
  if (!data) {
    throw new Error('Failed to create medical request: No data returned')
  }
  
  return {
    id: data.id,
    staffId: data.staff_id,
    requestDate: data.request_date,
    reason: data.reason,
    isWorkRelated: data.is_work_related,
    urgency: data.urgency,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateMedicalRequest(id: string, updates: Partial<MedicalRequest>) {
  const supabase = await createClient()
  const updateData: any = {}
  
  if (updates.status) updateData.status = updates.status
  if (updates.supervisorId !== undefined) updateData.supervisor_id = updates.supervisorId || null
  if (updates.supervisorActionDate !== undefined) updateData.supervisor_action_date = updates.supervisorActionDate || null
  if (updates.supervisorNotes !== undefined) updateData.supervisor_notes = updates.supervisorNotes || null
  if (updates.managerId !== undefined) updateData.manager_id = updates.managerId || null
  if (updates.managerActionDate !== undefined) updateData.manager_action_date = updates.managerActionDate || null
  if (updates.managerNotes !== undefined) updateData.manager_notes = updates.managerNotes || null
  if (updates.paymentStatus !== undefined) updateData.payment_status = updates.paymentStatus || null
  if (updates.paymentAmount !== undefined) updateData.payment_amount = updates.paymentAmount || null
  if (updates.paymentDate !== undefined) updateData.payment_date = updates.paymentDate || null
  if (updates.paymentReference !== undefined) updateData.payment_reference = updates.paymentReference || null

  const { data, error } = await supabase
    .from('medical_requests')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      staff:staff_id(id, name),
      supervisor:supervisor_id(id, name),
      manager:manager_id(id, name)
    `)
    .single()

  if (error) throw error
  return {
    id: data.id,
    staffId: data.staff_id,
    staffName: data.staff?.name || null,
    requestDate: data.request_date,
    reason: data.reason,
    isWorkRelated: data.is_work_related,
    urgency: data.urgency,
    status: data.status,
    supervisorId: data.supervisor_id,
    supervisorName: data.supervisor?.name || null,
    supervisorActionDate: data.supervisor_action_date,
    supervisorNotes: data.supervisor_notes,
    managerId: data.manager_id,
    managerName: data.manager?.name || null,
    managerActionDate: data.manager_action_date,
    managerNotes: data.manager_notes,
    paymentStatus: data.payment_status,
    paymentAmount: data.payment_amount ? Number(data.payment_amount) : undefined,
    paymentDate: data.payment_date,
    paymentReference: data.payment_reference,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
