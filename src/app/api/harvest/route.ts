import { NextRequest, NextResponse } from 'next/server'
import * as harvestAPI from '@/lib/api/harvest'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function GET() {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    
    const logs = await harvestAPI.getHarvestLogs()
    return NextResponse.json(logs)
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
    const log = await harvestAPI.addHarvestLog(body)
    
    // Log audit event
    await logAuditEvent(session, {
      action: 'CREATE',
      resourceType: 'harvest_logs',
      resourceId: log.id,
      newData: log,
      request,
    })
    
    return NextResponse.json(log)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
