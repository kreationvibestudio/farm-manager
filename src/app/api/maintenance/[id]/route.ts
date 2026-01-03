import { NextRequest, NextResponse } from 'next/server'
import { updateMaintenanceLog, deleteMaintenanceLog, getMaintenanceLogById } from '@/lib/api/maintenance'
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
    const oldData = await getMaintenanceLogById(id)
    
    const updatedLog = await updateMaintenanceLog(id, body)
    
    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'maintenance_logs',
      resourceId: id,
      oldData,
      newData: updatedLog,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
    })
    
    return NextResponse.json(updatedLog)
  } catch (error: any) {
    console.error('API Error updating maintenance log:', error)
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
    
    console.log('🗑️ Deleting maintenance log:', { id, userId })
    
    // Soft delete and get old data
    const oldData = await deleteMaintenanceLog(id, userId)
    
    console.log('📋 Old data retrieved for audit:', oldData ? 'Yes' : 'No', oldData)
    
    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'DELETE',
      resourceType: 'maintenance_logs',
      resourceId: id,
      oldData,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
    })
    
    return NextResponse.json({ message: 'Maintenance log deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('API Error deleting maintenance log:', error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
