-- Farm Manager Database Schema for Supabase
-- Run this SQL in your Supabase Dashboard -> SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Inventory Items Table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Fertilizer', 'Herbicide', 'Fuel', 'Spare Part', 'Tool', 'Other')),
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'units',
  min_level INTEGER NOT NULL DEFAULT 0,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Tractor', 'Truck', 'Motorcycle', 'Other')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Maintenance', 'OutOfService')),
  license_plate TEXT,
  last_maintenance DATE,
  current_driver_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Manager', 'Supervisor', 'Driver', 'Worker')),
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Harvest Logs Table
CREATE TABLE IF NOT EXISTS harvest_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  block_id TEXT NOT NULL,
  weight_kg NUMERIC(10, 2) NOT NULL,
  supervisor_id UUID REFERENCES staff(id),
  driver_id UUID REFERENCES staff(id),
  vehicle_id UUID REFERENCES vehicles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_harvest_logs_date ON harvest_logs(date);
CREATE INDEX IF NOT EXISTS idx_harvest_logs_block_id ON harvest_logs(block_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist (to avoid errors on re-run)
DROP TRIGGER IF EXISTS update_inventory_items_updated_at ON inventory_items;
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
DROP TRIGGER IF EXISTS update_harvest_logs_updated_at ON harvest_logs;

-- Add triggers for updated_at
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_harvest_logs_updated_at BEFORE UPDATE ON harvest_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvest_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Allow all for authenticated users" ON inventory_items;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON staff;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON harvest_logs;

-- Create policies (allow all for authenticated users)
-- You can customize these based on your security requirements
CREATE POLICY "Allow all for authenticated users" ON inventory_items
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON vehicles
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON staff
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON harvest_logs
    FOR ALL USING (true);

-- Insert initial staff data
INSERT INTO staff (name, role) VALUES
  ('John Doe', 'Manager'),
  ('Jane Smith', 'Supervisor'),
  ('Bob Wilson', 'Driver')
ON CONFLICT DO NOTHING;
