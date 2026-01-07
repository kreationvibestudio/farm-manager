import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/api-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { logAuditEvent } from '@/lib/audit/audit-log'
import { sanitizeError } from '@/lib/utils/error-handler'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    const { session } = authResult
    
    const body = await request.json()
    const { staffIds } = body

    if (!Array.isArray(staffIds) || staffIds.length === 0) {
      return NextResponse.json(
        { error: 'Staff IDs list is required and must be a non-empty array' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const userId = (session.user as any)?.id || 'system'

    // First get all records to log in audit
    const { data: staffToDelete } = await supabase
      .from('staff')
      .select('*')
      .in('id', staffIds)
      .is('deleted_at', null)

    if (!staffToDelete || staffToDelete.length === 0) {
      return NextResponse.json(
        { error: 'No active staff members found with the provided IDs' },
        { status: 404 }
      )
    }

    // Soft delete all staff at once
    const { error } = await supabase
      .from('staff')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
      })
      .in('id', staffIds)
      .is('deleted_at', null) // Only update if not already deleted

    if (error) {
      console.error('Error bulk deleting staff:', error)
      throw error
    }

    // Log audit event for each staff member (non-blocking)
    staffToDelete.forEach((staff) => {
      logAuditEvent(session, {
        action: 'DELETE',
        resourceType: 'staff',
        resourceId: staff.id,
        oldData: staff,
        request,
      }).catch(error => {
        console.error('Failed to log audit event for staff:', error)
      })
    })

    return NextResponse.json({
      message: `Successfully fired ${staffToDelete.length} staff member(s)`,
      count: staffToDelete.length,
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error in bulk fire:', error)
    const sanitized = sanitizeError(error)
    return NextResponse.json(
      { error: sanitized.message },
      { status: 500 }
    )
  }
}
