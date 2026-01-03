import { NextRequest, NextResponse } from 'next/server'
import { getMaintenanceLogs, addMaintenanceLog } from '@/lib/api/maintenance'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function GET() {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    
    const logs = await getMaintenanceLogs()
    // Add caching headers for better performance (30 seconds cache)
    return NextResponse.json(logs, {
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
      },
    })
  } catch (error: any) {
    console.error('API Error fetching maintenance logs:', error)
    // If table doesn't exist, return empty array instead of error
    if (error.message?.includes('does not exist') || error.code === '42P01') {
      return NextResponse.json([])
    }
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
    const newLog = await addMaintenanceLog(body)
    
    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'CREATE',
      resourceType: 'maintenance_logs',
      resourceId: newLog.id,
      newData: newLog,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
      // Don't block response if audit logging fails
    })
    
    return NextResponse.json(newLog, { status: 201 })
  } catch (error: any) {
    console.error('API Error adding maintenance log:', error)
    // Check if table doesn't exist
    if (error.message?.includes('does not exist') || error.code === '42P01' || error.message?.includes('relation "maintenance_logs"')) {
      return NextResponse.json({ 
        error: 'Maintenance logs table does not exist. Please run the SQL schema in Supabase Dashboard: supabase-maintenance-schema.sql' 
      }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || 'Failed to add maintenance log' }, { status: 500 })
  }
}
