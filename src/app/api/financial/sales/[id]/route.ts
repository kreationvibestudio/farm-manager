import { NextRequest, NextResponse } from 'next/server'
import * as salesAPI from '@/lib/api/financial/sales'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

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

    const salesRecord = await salesAPI.getSalesRecordById(params.id)
    if (!salesRecord) {
      return NextResponse.json({ error: 'Sales record not found' }, { status: 404 })
    }

    return NextResponse.json(salesRecord)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
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
    const updatedRecord = await salesAPI.updateSalesRecord(params.id, body)

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'sales_records',
      resourceId: params.id,
      oldData: {}, // Would need to fetch old data for complete audit
      newData: updatedRecord,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
      // Don't block response if audit logging fails
    })

    return NextResponse.json(updatedRecord)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
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

    await salesAPI.deleteSalesRecord(params.id, session.user.id)

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'DELETE',
      resourceType: 'sales_records',
      resourceId: params.id,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
      // Don't block response if audit logging fails
    })

    return NextResponse.json({ message: 'Sales record deleted successfully' })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
