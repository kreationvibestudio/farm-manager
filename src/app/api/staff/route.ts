import { NextRequest, NextResponse } from 'next/server'
import { getStaff, addStaff } from '@/lib/api/staff'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function GET() {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    
    const staff = await getStaff()
    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    const { session } = authResult
    
    const body = await request.json()
    const staff = await addStaff(body)
    
    // Log audit event
    await logAuditEvent(session, {
      action: 'CREATE',
      resourceType: 'staff',
      resourceId: staff.id,
      newData: staff,
      request,
    })
    
    return NextResponse.json(staff, { status: 201 })
  } catch (error: any) {
    console.error('Error adding staff:', error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to add staff' },
      { status: 500 }
    )
  }
}
