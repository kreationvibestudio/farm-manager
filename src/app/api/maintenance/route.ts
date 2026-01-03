import { NextRequest, NextResponse } from 'next/server'
import { getMaintenanceLogs, addMaintenanceLog } from '@/lib/api/maintenance'

export async function GET() {
  try {
    const logs = await getMaintenanceLogs()
    return NextResponse.json(logs)
  } catch (error: any) {
    console.error('API Error fetching maintenance logs:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newLog = await addMaintenanceLog(body)
    return NextResponse.json(newLog, { status: 201 })
  } catch (error: any) {
    console.error('API Error adding maintenance log:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
