import { NextRequest, NextResponse } from 'next/server'
import * as inventoryAPI from '@/lib/api/inventory'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    const { session } = authResult
    
    const { id } = await params
    const { delta } = await request.json()
    
    // Get old data for audit
    const items = await inventoryAPI.getInventoryItems()
    const oldData = items.find(item => item.id === id)
    
    const item = await inventoryAPI.adjustStock(id, delta)
    
    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'inventory_items',
      resourceId: id,
      oldData,
      newData: item,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
    })
    
    return NextResponse.json(item)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
