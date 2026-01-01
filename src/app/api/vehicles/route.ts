import { NextResponse } from 'next/server'
import * as vehiclesAPI from '@/lib/api/vehicles'

export async function GET() {
  try {
    const vehicles = await vehiclesAPI.getVehicles()
    return NextResponse.json(vehicles)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const vehicle = await vehiclesAPI.addVehicle(body)
    return NextResponse.json(vehicle)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
