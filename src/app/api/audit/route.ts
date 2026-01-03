import { NextRequest, NextResponse } from 'next/server'
import { getAuditLogs, getAuditLogsByResource } from '@/lib/api/audit'
import { requireAuth } from '@/lib/auth/api-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }

    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get('resource_type')
    const resourceId = searchParams.get('resource_id')
    const limit = parseInt(searchParams.get('limit') || '100')

    let logs
    if (resourceType) {
      logs = await getAuditLogsByResource(resourceType, resourceId || undefined, limit)
    } else {
      logs = await getAuditLogs(limit)
    }

    return NextResponse.json(logs)
  } catch (error: any) {
    console.error('API Error fetching audit logs:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
