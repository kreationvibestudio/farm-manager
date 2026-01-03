import { NextRequest, NextResponse } from 'next/server'
import * as inventoryAPI from '@/lib/api/inventory'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function PUT(
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
    const body = await request.json()
    
    // Get old data for audit
    const items = await inventoryAPI.getInventoryItems()
    const oldData = items.find(item => item.id === id)
    
    const item = await inventoryAPI.updateInventoryItem(id, body)
    
    // Log audit event
    await logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'inventory_items',
      resourceId: id,
      oldData,
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

export async function DELETE(
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
    const userId = (session.user as any)?.id || session.user?.email || 'unknown'
    
    // Soft delete and get old data
    const oldData = await inventoryAPI.deleteInventoryItem(id, userId)
    
    // Log audit event
    await logAuditEvent(session, {
      action: 'DELETE',
      resourceType: 'inventory_items',
      resourceId: id,
      oldData,
      request,
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
