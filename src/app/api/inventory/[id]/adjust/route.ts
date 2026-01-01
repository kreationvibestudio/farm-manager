import { NextResponse } from 'next/server'
import * as inventoryAPI from '@/lib/api/inventory'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { delta } = await request.json()
    const item = await inventoryAPI.adjustStock(id, delta)
    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
