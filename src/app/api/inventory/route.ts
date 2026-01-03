import { NextRequest, NextResponse } from 'next/server'
import * as inventoryAPI from '@/lib/api/inventory'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function GET() {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    
    const items = await inventoryAPI.getInventoryItems()
    return NextResponse.json(items)
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
    const item = await inventoryAPI.addInventoryItem(body)
    
    // Log audit event
    await logAuditEvent(session, {
      action: 'CREATE',
      resourceType: 'inventory_items',
      resourceId: item.id,
      newData: item,
      request,
    })
    
    return NextResponse.json(item)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
