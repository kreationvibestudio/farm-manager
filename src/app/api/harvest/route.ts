import { NextResponse } from 'next/server'
import * as harvestAPI from '@/lib/api/harvest'

export async function GET() {
  try {
    const logs = await harvestAPI.getHarvestLogs()
    return NextResponse.json(logs)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const log = await harvestAPI.addHarvestLog(body)
    return NextResponse.json(log)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
