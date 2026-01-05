import { NextRequest, NextResponse } from 'next/server'
import * as costsAPI from '@/lib/api/financial/costs'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const categoryId = searchParams.get('categoryId')
    const blockId = searchParams.get('blockId')

    const costs = await costsAPI.getCostEntries({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      categoryId: categoryId || undefined,
      blockId: blockId || undefined,
    })

    // Add caching headers for better performance (30 seconds cache)
    return NextResponse.json(costs, {
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
      },
    })
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

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const costEntry = await costsAPI.addCostEntry(body, session.user.id)

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'CREATE',
      resourceType: 'cost_entries',
      resourceId: costEntry.id,
      newData: costEntry,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
      // Don't block response if audit logging fails
    })

    return NextResponse.json(costEntry)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
