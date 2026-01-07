import { NextRequest, NextResponse } from 'next/server'
import * as costsAPI from '@/lib/api/financial/costs'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'
import { sanitizeError } from '@/lib/utils/error-handler'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }

    const costEntry = await costsAPI.getCostEntryById(params.id)
    if (!costEntry) {
      return NextResponse.json({ error: 'Cost entry not found' }, { status: 404 })
    }

    return NextResponse.json(costEntry)
  } catch (error: any) {
    const sanitized = sanitizeError(error)
    return NextResponse.json({ error: sanitized.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    const { session } = authResult

    const body = await request.json()
    const updatedEntry = await costsAPI.updateCostEntry(params.id, body)

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'cost_entries',
      resourceId: params.id,
      oldData: {}, // Would need to fetch old data for complete audit
      newData: updatedEntry,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
      // Don't block response if audit logging fails
    })

    return NextResponse.json(updatedEntry)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    const sanitized = sanitizeError(error)
    return NextResponse.json({ error: sanitized.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    const { session } = authResult

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    await costsAPI.deleteCostEntry(params.id, session.user.id)

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'DELETE',
      resourceType: 'cost_entries',
      resourceId: params.id,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
      // Don't block response if audit logging fails
    })

    return NextResponse.json({ message: 'Cost entry deleted successfully' })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    const sanitized = sanitizeError(error)
    return NextResponse.json({ error: sanitized.message }, { status: 500 })
  }
}
