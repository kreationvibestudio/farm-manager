import { NextRequest, NextResponse } from 'next/server'
import * as medicalAPI from '@/lib/api/medical-requests'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'
import { sanitizeError } from '@/lib/utils/error-handler'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { session } = authResult

    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { action, notes, paymentData } = body
    const requestId = id

    // Ensure session user exists
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. User session not found.' }, { status: 401 })
    }

    const userId = session.user.id
    const userName = session.user.name

    // Get the medical request
    const { data: medicalRequest, error: fetchError } = await supabase
      .from('medical_requests')
      .select('*, staff:staff_id(id, name, role)')
      .eq('id', requestId)
      .single()

    if (fetchError || !medicalRequest) {
      return NextResponse.json({ error: 'Medical request not found' }, { status: 404 })
    }

    // Get current user's role from users table
    const { data: userData } = await supabase
      .from('users')
      .select('role, full_name')
      .eq('id', userId)
      .single()

    const userRole = userData?.role

    // Get current user's staff record (if exists)
    let userStaff = null
    // First try by user_id
    const { data: staffByUserId } = await supabase
      .from('staff')
      .select('id, name, role')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle()

    if (staffByUserId) {
      userStaff = staffByUserId
    } else if (userName) {
      // Fall back to name matching
      const { data: staffByName } = await supabase
        .from('staff')
        .select('id, name, role')
        .or(`name.eq.${userName},name.ilike.%${userName}%`)
        .limit(1)
        .maybeSingle()
      
      if (staffByName) {
        userStaff = staffByName
      }
    }

    // Allow admins/operators to proceed even without staff record
    // They will be treated as having appropriate permissions based on their user role
    if (!userStaff && userRole !== 'Admin' && userRole !== 'Operator') {
      return NextResponse.json({ error: 'Staff record not found for current user' }, { status: 403 })
    }

    const currentStatus = medicalRequest.status
    let updateData: any = {}

    // Handle payment updates - only managers/admins can record payments
    if (paymentData) {
      const canRecordPayment = userStaff?.role === 'Manager' || 
                               userRole === 'Admin' || 
                               userRole === 'Operator'
      
      if (!canRecordPayment) {
        return NextResponse.json({ error: 'Only managers or admins can record payments' }, { status: 403 })
      }
      
      updateData.payment_status = 'Paid'
      updateData.payment_amount = paymentData.paymentAmount
      updateData.payment_date = paymentData.paymentDate
      updateData.payment_reference = paymentData.paymentReference
    }
    // Handle approval/rejection workflow
    else if (action === 'approve' || action === 'reject') {
        if (currentStatus === 'Pending') {
          // Supervisor approval - check staff role or user role
          const canApprove = userStaff?.role === 'Supervisor' || 
                           userStaff?.role === 'Manager' || 
                           userRole === 'Admin' || 
                           userRole === 'Operator'
          
          if (canApprove) {
            updateData.status = action === 'approve' ? 'Approved by Supervisor' : 'Rejected by Supervisor'
            updateData.supervisor_id = userStaff?.id || null
            updateData.supervisor_action_date = new Date().toISOString()
            updateData.supervisor_notes = notes || null
          } else {
            return NextResponse.json({ error: 'Only supervisors or admins can approve pending requests' }, { status: 403 })
          }
        } else if (currentStatus === 'Approved by Supervisor') {
          // Manager approval - check staff role or user role
          const canApprove = userStaff?.role === 'Manager' || 
                           userRole === 'Admin' || 
                           userRole === 'Operator'
          
          if (canApprove) {
            updateData.status = action === 'approve' ? 'Approved by Manager' : 'Rejected by Manager'
            updateData.manager_id = userStaff?.id || null
            updateData.manager_action_date = new Date().toISOString()
            updateData.manager_notes = notes || null

            // Only set payment status for work-related requests
            if (action === 'approve' && medicalRequest.is_work_related) {
              updateData.payment_status = 'Approved for Payment'
            } else if (action === 'reject') {
              updateData.payment_status = 'Rejected'
            }
          } else {
            return NextResponse.json({ error: 'Only managers or admins can approve supervisor-approved requests' }, { status: 403 })
          }
        } else {
          return NextResponse.json({ error: 'Request cannot be modified in current status' }, { status: 400 })
        }
    } else {
      // Direct update (for other fields)
      updateData = body
    }

    const updatedRequest = await medicalAPI.updateMedicalRequest(id, updateData)

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'medical_requests',
      resourceId: id,
      oldData: medicalRequest,
      newData: updatedRequest,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
    })

    return NextResponse.json(updatedRequest)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: sanitizeError(error).message }, { status: 500 })
  }
}
