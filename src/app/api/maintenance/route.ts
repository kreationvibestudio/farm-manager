import { NextRequest, NextResponse } from 'next/server'
import { getMaintenanceLogs, addMaintenanceLog } from '@/lib/api/maintenance'

export async function GET() {
  try {
    const logs = await getMaintenanceLogs()
    return NextResponse.json(logs)
  } catch (error: any) {
    console.error('API Error fetching maintenance logs:', error)
    // If table doesn't exist, return empty array instead of error
    if (error.message?.includes('does not exist') || error.code === '42P01') {
      return NextResponse.json([])
    }
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
    // Check if table doesn't exist
    if (error.message?.includes('does not exist') || error.code === '42P01' || error.message?.includes('relation "maintenance_logs"')) {
      return NextResponse.json({ 
        error: 'Maintenance logs table does not exist. Please run the SQL schema in Supabase Dashboard: supabase-maintenance-schema.sql' 
      }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || 'Failed to add maintenance log' }, { status: 500 })
  }
}
