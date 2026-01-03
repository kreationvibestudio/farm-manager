import { NextRequest, NextResponse } from 'next/server'
import { updateMaintenanceLog, deleteMaintenanceLog } from '@/lib/api/maintenance'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updatedLog = await updateMaintenanceLog(id, body)
    return NextResponse.json(updatedLog)
  } catch (error: any) {
    console.error('API Error updating maintenance log:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteMaintenanceLog(id)
    return NextResponse.json({ message: 'Maintenance log deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('API Error deleting maintenance log:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
