import { NextRequest, NextResponse } from 'next/server'
import { getMaintenanceLogs, addMaintenanceLog } from '@/lib/api/maintenance'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'
import { sanitizeError } from '@/lib/utils/error-handler'
import { maintenanceLogSchema, validateInput } from '@/lib/validation/schemas'

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
    const sanitized = sanitizeError(error)
    return NextResponse.json({ error: sanitized.message }, { status: 500 })
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
    
    // Validate input
    const validation = validateInput(maintenanceLogSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validation.errors.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      )
    }
    
    const newLog = await addMaintenanceLog(validation.data)
    
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
    const sanitized = sanitizeError(error)
    return NextResponse.json({ error: sanitized.message }, { status: 500 })
  }
}
