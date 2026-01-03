import { NextRequest, NextResponse } from 'next/server'
import * as vehiclesAPI from '@/lib/api/vehicles'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function GET() {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    
    const vehicles = await vehiclesAPI.getVehicles()
    return NextResponse.json(vehicles)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
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
    const vehicle = await vehiclesAPI.addVehicle(body)
    
    // Log audit event
    await logAuditEvent(session, {
      action: 'CREATE',
      resourceType: 'vehicles',
      resourceId: vehicle.id,
      newData: vehicle,
      request,
    })
    
    return NextResponse.json(vehicle)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
