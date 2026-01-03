import { NextRequest, NextResponse } from 'next/server'
import * as vehiclesAPI from '@/lib/api/vehicles'
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
    const vehicles = await vehiclesAPI.getVehicles()
    const oldData = vehicles.find(v => v.id === id)
    
    const vehicle = await vehiclesAPI.updateVehicle(id, body)
    
    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'vehicles',
      resourceId: id,
      oldData,
      newData: vehicle,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
    })
    
    return NextResponse.json(vehicle)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
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
    const oldData = await vehiclesAPI.deleteVehicle(id, userId)
    
    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'DELETE',
      resourceType: 'vehicles',
      resourceId: id,
      oldData,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
