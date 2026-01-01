import { NextResponse } from 'next/server'
import * as inventoryAPI from '@/lib/api/inventory'

export async function GET() {
  try {
    const items = await inventoryAPI.getInventoryItems()
    return NextResponse.json(items)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const item = await inventoryAPI.addInventoryItem(body)
    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
