import { NextRequest, NextResponse } from 'next/server'
import * as harvestAPI from '@/lib/api/harvest'
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
    const logs = await harvestAPI.getHarvestLogs()
    const oldData = logs.find(log => log.id === id)
    
    const log = await harvestAPI.updateHarvestLog(id, body)
    
    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'harvest_logs',
      resourceId: id,
      oldData,
      newData: log,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
    })
    
    return NextResponse.json(log)
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
    const oldData = await harvestAPI.deleteHarvestLog(id, userId)
    
    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'DELETE',
      resourceType: 'harvest_logs',
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
