import { NextRequest, NextResponse } from 'next/server'
import * as salesAPI from '@/lib/api/financial/sales'
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
    const buyerName = searchParams.get('buyerName')
    const paymentStatus = searchParams.get('paymentStatus')
    const productType = searchParams.get('productType')

    const sales = await salesAPI.getSalesRecords({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      buyerName: buyerName || undefined,
      paymentStatus: paymentStatus || undefined,
      productType: productType || undefined,
    })

    // Add caching headers for better performance (30 seconds cache)
    return NextResponse.json(sales, {
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

    const body = await request.json()
    const salesRecord = await salesAPI.addSalesRecord(body, session.user.id)

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'CREATE',
      resourceType: 'sales_records',
      resourceId: salesRecord.id,
      newData: salesRecord,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
      // Don't block response if audit logging fails
    })

    return NextResponse.json(salesRecord)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
