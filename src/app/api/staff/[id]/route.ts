import { NextRequest, NextResponse } from 'next/server'
import { updateStaff, deleteStaff, getStaff } from '@/lib/api/staff'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    const { session } = authResult
    
    const { id } = await params
    const body = await request.json()
    
    // Get old data for audit
    const staffList = await getStaff()
    const oldData = staffList.find(s => s.id === id)
    
    const staff = await updateStaff(id, body)
    
    // Log audit event
    await logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'staff',
      resourceId: id,
      oldData,
      newData: staff,
      request,
    })
    
    return NextResponse.json(staff)
  } catch (error: any) {
    console.error('Error updating staff:', error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    // Check if it's a duplicate name error
    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 } // Bad Request for validation errors
      )
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update staff' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    const { session } = authResult
    
    const { id } = await params
    const userId = (session.user as any)?.id || session.user?.email || 'unknown'
    
    // Soft delete and get old data
    const oldData = await deleteStaff(id, userId)
    
    // Log audit event
    await logAuditEvent(session, {
      action: 'DELETE',
      resourceType: 'staff',
      resourceId: id,
      oldData,
      request,
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting staff:', error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete staff' },
      { status: 500 }
    )
  }
}
