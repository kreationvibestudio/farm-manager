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
    // Add caching headers for better performance (30 seconds cache)
    return NextResponse.json(staff, {
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
      },
    })
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
    
    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'CREATE',
      resourceType: 'staff',
      resourceId: staff.id,
      newData: staff,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
      // Don't block response if audit logging fails
    })
    
    return NextResponse.json(staff, { status: 201 })
  } catch (error: any) {
    console.error('Error adding staff:', error)
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
      { error: error.message || 'Failed to add staff' },
      { status: 500 }
    )
  }
}
