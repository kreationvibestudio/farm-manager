import { NextRequest, NextResponse } from 'next/server'
import { getStaff, addStaff } from '@/lib/api/staff'

export async function GET() {
  try {
    const staff = await getStaff()
    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const staff = await addStaff(body)
    return NextResponse.json(staff, { status: 201 })
  } catch (error: any) {
    console.error('Error adding staff:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add staff' },
      { status: 500 }
    )
  }
}
