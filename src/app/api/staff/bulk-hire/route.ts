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
    const { staffList } = body

    if (!Array.isArray(staffList) || staffList.length === 0) {
      return NextResponse.json(
        { error: 'Staff list is required and must be a non-empty array' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Validate and prepare staff data
    const staffToInsert = staffList.map((staff: any) => ({
      name: staff.name.trim(),
      role: staff.role,
      designation: staff.designation || null,
      contact: staff.contact?.trim() || null,
    }))

    // Check for duplicates before inserting
    const names = staffToInsert.map(s => s.name.toLowerCase())
    const { data: existingStaff } = await supabase
      .from('staff')
      .select('name')
      .is('deleted_at', null)
      .in('name', names.map(n => n))

    if (existingStaff && existingStaff.length > 0) {
      const duplicateNames = existingStaff.map(s => s.name).join(', ')
      return NextResponse.json(
        { error: `The following staff members already exist: ${duplicateNames}. Please remove them from the list or use different names.` },
        { status: 400 }
      )
    }

    // Insert all staff at once
    const { data: insertedStaff, error } = await supabase
      .from('staff')
      .insert(staffToInsert)
      .select()

    if (error) {
      console.error('Error bulk inserting staff:', error)
      throw error
    }

    // Log audit event for each staff member (non-blocking)
    const userId = (session.user as any)?.id || 'system'
    insertedStaff.forEach((staff) => {
      logAuditEvent(session, {
        action: 'CREATE',
        resourceType: 'staff',
        resourceId: staff.id,
        newData: staff,
        request,
      }).catch(error => {
        console.error('Failed to log audit event for staff:', error)
      })
    })

    return NextResponse.json({
      message: `Successfully hired ${insertedStaff.length} staff member(s)`,
      count: insertedStaff.length,
      staff: insertedStaff,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error in bulk hire:', error)
    const sanitized = sanitizeError(error)
    return NextResponse.json(
      { error: sanitized.message },
      { status: 500 }
    )
  }
}
