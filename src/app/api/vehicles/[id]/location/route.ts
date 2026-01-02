import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { latitude, longitude, speed, heading, accuracy } = body

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('vehicle_locations')
      .insert({
        vehicle_id: id,
        latitude,
        longitude,
        speed: speed || null,
        heading: heading || null,
        accuracy: accuracy || null,
      })
      .select()
      .single()

    if (error) throw error

      return NextResponse.json({
        id: data.id,
        vehicleId: data.vehicle_id,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        speed: data.speed ? Number(data.speed) : undefined,
        heading: data.heading ? Number(data.heading) : undefined,
        accuracy: data.accuracy ? Number(data.accuracy) : undefined,
        recordedAt: data.recorded_at,
      }, { status: 201 })
  } catch (error: any) {
    console.error('Error saving vehicle location:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save location' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('vehicle_locations')
      .select('*')
      .eq('vehicle_id', id)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

      return NextResponse.json({
        id: data.id,
        vehicleId: data.vehicle_id,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        speed: data.speed ? Number(data.speed) : undefined,
        heading: data.heading ? Number(data.heading) : undefined,
        accuracy: data.accuracy ? Number(data.accuracy) : undefined,
        recordedAt: data.recorded_at,
      })
  } catch (error: any) {
    console.error('Error fetching vehicle location:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch location' },
      { status: 500 }
    )
  }
}
