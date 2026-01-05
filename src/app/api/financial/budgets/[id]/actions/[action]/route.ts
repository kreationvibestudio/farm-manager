import { NextRequest, NextResponse } from 'next/server'
import * as budgetsAPI from '@/lib/api/financial/budgets'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const params = await context.params
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    const { session } = authResult

    let result: any

    switch (params.action) {
      case 'approve':
        result = await budgetsAPI.approveBudget(params.id, session.user.id)
        break
      case 'submit':
        result = await budgetsAPI.submitBudget(params.id, session.user.id)
        break
      case 'variance':
        result = await budgetsAPI.calculateBudgetVariance(params.id)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Log audit event for approve/submit actions (non-blocking)
    if (params.action === 'approve' || params.action === 'submit') {
      logAuditEvent(session, {
        action: 'UPDATE', // Both approve and submit are updates to budget status
        resourceType: 'budgets',
        resourceId: params.id,
        newData: result,
        request,
      }).catch(error => {
        console.error('Failed to log audit event:', error)
        // Don't block response if audit logging fails
      })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
