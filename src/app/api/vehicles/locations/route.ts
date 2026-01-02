import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Try using the function first
    const { data, error } = await supabase
      .rpc('get_latest_vehicle_locations')

    if (error) {
      // Fallback: manual query
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id')
      
      if (!vehicles || vehicles.length === 0) {
        return NextResponse.json([])
      }

      const vehicleIds = vehicles.map(v => v.id)
      const { data: locations, error: locError } = await supabase
        .from('vehicle_locations')
        .select('*')
        .in('vehicle_id', vehicleIds)
        .order('recorded_at', { ascending: false })

      if (locError) throw locError

      const latestMap = new Map()
      locations?.forEach((loc: any) => {
        const locTime = loc.recorded_at || loc.timestamp
        const existingTime = latestMap.get(loc.vehicle_id)?.recorded_at || latestMap.get(loc.vehicle_id)?.timestamp
        if (!latestMap.has(loc.vehicle_id) || 
            new Date(locTime) > new Date(existingTime)) {
          latestMap.set(loc.vehicle_id, loc)
        }
      })

      const result = Array.from(latestMap.values()).map((loc: any) => ({
        id: loc.id,
        vehicleId: loc.vehicle_id,
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
        speed: loc.speed ? Number(loc.speed) : undefined,
        heading: loc.heading ? Number(loc.heading) : undefined,
        accuracy: loc.accuracy ? Number(loc.accuracy) : undefined,
        timestamp: loc.recorded_at || loc.timestamp,
      }))

      return NextResponse.json(result)
    }

    const result = (data || []).map((loc: any) => ({
      id: loc.id || '',
      vehicleId: loc.vehicle_id,
      latitude: Number(loc.latitude),
      longitude: Number(loc.longitude),
      speed: loc.speed ? Number(loc.speed) : undefined,
      heading: loc.heading ? Number(loc.heading) : undefined,
      accuracy: loc.accuracy ? Number(loc.accuracy) : undefined,
      timestamp: loc.recorded_at || loc.timestamp,
    }))

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error fetching vehicle locations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}
