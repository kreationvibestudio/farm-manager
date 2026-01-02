-- Vehicle GPS Tracking Database Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This creates the vehicle_locations table and related functions

-- Vehicle GPS Tracking Table
CREATE TABLE IF NOT EXISTS vehicle_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  speed NUMERIC(5, 2),
  heading NUMERIC(5, 2),
  accuracy NUMERIC(5, 2),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_vehicle_id ON vehicle_locations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_recorded_at ON vehicle_locations(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_vehicle_recorded_at ON vehicle_locations(vehicle_id, recorded_at DESC);

-- Function to get latest location for each vehicle
CREATE OR REPLACE FUNCTION get_latest_vehicle_locations()
RETURNS TABLE (
  vehicle_id UUID,
  latitude NUMERIC,
  longitude NUMERIC,
  speed NUMERIC,
  heading NUMERIC,
  recorded_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (vl.vehicle_id)
    vl.vehicle_id,
    vl.latitude,
    vl.longitude,
    vl.speed,
    vl.heading,
    vl.recorded_at
  FROM vehicle_locations vl
  ORDER BY vl.vehicle_id, vl.recorded_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE vehicle_locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all for authenticated users" ON vehicle_locations;

-- Create policy (allow all for authenticated users)
CREATE POLICY "Allow all for authenticated users" ON vehicle_locations
    FOR ALL USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_vehicle_locations_updated_at BEFORE UPDATE ON vehicle_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
