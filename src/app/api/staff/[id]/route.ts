import { NextRequest, NextResponse } from 'next/server'
import { updateStaff, deleteStaff } from '@/lib/api/staff'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const staff = await updateStaff(id, body)
    return NextResponse.json(staff)
  } catch (error: any) {
    console.error('Error updating staff:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update staff' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteStaff(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting staff:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete staff' },
      { status: 500 }
    )
  }
}
