import { NextRequest, NextResponse } from 'next/server'
import * as budgetsAPI from '@/lib/api/financial/budgets'
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

    const budget = await budgetsAPI.getBudgetById(params.id)
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 })
    }

    return NextResponse.json(budget)
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
    const updatedBudget = await budgetsAPI.updateBudget(params.id, body)

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'budgets',
      resourceId: params.id,
      oldData: {}, // Would need to fetch old data for complete audit
      newData: updatedBudget,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
      // Don't block response if audit logging fails
    })

    return NextResponse.json(updatedBudget)
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

    await budgetsAPI.deleteBudget(params.id, session.user.id)

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'DELETE',
      resourceType: 'budgets',
      resourceId: params.id,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
      // Don't block response if audit logging fails
    })

    return NextResponse.json({ message: 'Budget deleted successfully' })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    const sanitized = sanitizeError(error)
    return NextResponse.json({ error: sanitized.message }, { status: 500 })
  }
}
