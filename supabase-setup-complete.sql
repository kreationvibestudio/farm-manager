-- Farm Manager Complete Database Setup
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This file includes BOTH schema creation AND sample data
-- You can run this all at once to set up everything

-- ============================================================================
-- PART 1: SCHEMA CREATION
-- ============================================================================

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

-- Create policies (allow all for authenticated users)
CREATE POLICY "Allow all for authenticated users" ON inventory_items
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON vehicles
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON staff
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON harvest_logs
    FOR ALL USING (true);

-- ============================================================================
-- PART 2: SAMPLE DATA
-- ============================================================================

-- Insert Staff Members
INSERT INTO staff (name, role, contact) VALUES
  ('John Doe', 'Manager', '+234 801 234 5678'),
  ('Jane Smith', 'Supervisor', '+234 802 345 6789'),
  ('Bob Wilson', 'Driver', '+234 803 456 7890'),
  ('Mary Johnson', 'Supervisor', '+234 804 567 8901'),
  ('David Brown', 'Driver', '+234 805 678 9012'),
  ('Sarah Williams', 'Driver', '+234 806 789 0123'),
  ('Michael Davis', 'Worker', '+234 807 890 1234'),
  ('Emily Garcia', 'Worker', '+234 808 901 2345'),
  ('James Martinez', 'Worker', '+234 809 012 3456'),
  ('Lisa Anderson', 'Supervisor', '+234 810 123 4567')
ON CONFLICT DO NOTHING;

-- Insert Vehicles
INSERT INTO vehicles (name, type, status, license_plate, last_maintenance, current_driver_id) VALUES
  ('Tractor-01', 'Tractor', 'Active', 'LAG-1234', '2024-12-15', NULL),
  ('Tractor-02', 'Tractor', 'Active', 'LAG-1235', '2024-12-10', NULL),
  ('Tractor-03', 'Tractor', 'Maintenance', 'LAG-1236', '2024-11-20', NULL),
  ('Truck-01', 'Truck', 'Active', 'LAG-5678', '2024-12-01', NULL),
  ('Truck-02', 'Truck', 'Active', 'LAG-5679', '2024-11-25', NULL),
  ('Truck-03', 'Truck', 'OutOfService', 'LAG-5680', '2024-10-15', NULL),
  ('Motorcycle-01', 'Motorcycle', 'Active', 'LAG-9012', '2024-12-20', NULL),
  ('Motorcycle-02', 'Motorcycle', 'Active', 'LAG-9013', '2024-12-18', NULL)
ON CONFLICT DO NOTHING;

-- Insert Inventory Items
INSERT INTO inventory_items (name, category, quantity, unit, min_level, last_updated) VALUES
  -- Fertilizers
  ('NPK 15:15:15', 'Fertilizer', 450, 'bags', 50, '2024-12-28'),
  ('Urea', 'Fertilizer', 320, 'bags', 40, '2024-12-25'),
  ('Potassium Sulphate', 'Fertilizer', 180, 'bags', 30, '2024-12-20'),
  ('NPK Create', 'Fertilizer', 45, 'bags', 10, '2024-12-15'),
  ('DAP (Diammonium Phosphate)', 'Fertilizer', 280, 'bags', 35, '2024-12-22'),
  
  -- Herbicides
  ('Roundup', 'Herbicide', 120, 'L', 20, '2024-12-27'),
  ('Glyphosate 360', 'Herbicide', 85, 'L', 15, '2024-12-24'),
  ('Paraquat', 'Herbicide', 45, 'L', 10, '2024-12-18'),
  ('2,4-D Amine', 'Herbicide', 60, 'L', 12, '2024-12-21'),
  
  -- Fuel
  ('Diesel', 'Fuel', 1200, 'L', 500, '2024-12-30'),
  ('Petrol', 'Fuel', 350, 'L', 100, '2024-12-28'),
  ('Engine Oil (15W-40)', 'Fuel', 45, 'L', 10, '2024-12-15'),
  ('Hydraulic Oil', 'Fuel', 80, 'L', 20, '2024-12-20'),
  
  -- Spare Parts
  ('Tractor Tire (Front)', 'Spare Part', 4, 'units', 2, '2024-12-10'),
  ('Tractor Tire (Rear)', 'Spare Part', 6, 'units', 2, '2024-12-12'),
  ('Air Filter', 'Spare Part', 12, 'units', 5, '2024-12-18'),
  ('Oil Filter', 'Spare Part', 15, 'units', 5, '2024-12-20'),
  ('Brake Pad Set', 'Spare Part', 8, 'units', 3, '2024-12-15'),
  ('Battery (12V)', 'Spare Part', 3, 'units', 1, '2024-12-05'),
  ('Fan Belt', 'Spare Part', 10, 'units', 4, '2024-12-22'),
  
  -- Tools
  ('Pruning Saw', 'Tool', 25, 'units', 5, '2024-12-25'),
  ('Harvesting Knife', 'Tool', 50, 'units', 10, '2024-12-28'),
  ('Sprayer Nozzle', 'Tool', 30, 'units', 8, '2024-12-20'),
  ('Wrench Set', 'Tool', 5, 'units', 2, '2024-12-15'),
  ('Safety Helmet', 'Tool', 40, 'units', 10, '2024-12-22'),
  ('Safety Boots', 'Tool', 20, 'units', 5, '2024-12-18'),
  
  -- Other
  ('Rope (50m)', 'Other', 15, 'units', 5, '2024-12-20'),
  ('Tarpaulin', 'Other', 8, 'units', 3, '2024-12-15'),
  ('Tying Wire', 'Other', 200, 'kg', 50, '2024-12-25')
ON CONFLICT DO NOTHING;

-- Insert Harvest Logs (using subqueries to get staff and vehicle IDs)
DO $$
DECLARE
  supervisor1_id UUID;
  supervisor2_id UUID;
  supervisor3_id UUID;
  driver1_id UUID;
  driver2_id UUID;
  driver3_id UUID;
  vehicle1_id UUID;
  vehicle2_id UUID;
  vehicle3_id UUID;
  vehicle4_id UUID;
BEGIN
  -- Get staff IDs
  SELECT id INTO supervisor1_id FROM staff WHERE name = 'Jane Smith' LIMIT 1;
  SELECT id INTO supervisor2_id FROM staff WHERE name = 'Mary Johnson' LIMIT 1;
  SELECT id INTO supervisor3_id FROM staff WHERE name = 'Lisa Anderson' LIMIT 1;
  SELECT id INTO driver1_id FROM staff WHERE name = 'Bob Wilson' LIMIT 1;
  SELECT id INTO driver2_id FROM staff WHERE name = 'David Brown' LIMIT 1;
  SELECT id INTO driver3_id FROM staff WHERE name = 'Sarah Williams' LIMIT 1;
  
  -- Get vehicle IDs
  SELECT id INTO vehicle1_id FROM vehicles WHERE name = 'Tractor-01' LIMIT 1;
  SELECT id INTO vehicle2_id FROM vehicles WHERE name = 'Tractor-02' LIMIT 1;
  SELECT id INTO vehicle3_id FROM vehicles WHERE name = 'Truck-01' LIMIT 1;
  SELECT id INTO vehicle4_id FROM vehicles WHERE name = 'Truck-02' LIMIT 1;
  
  -- Insert harvest logs for the past 30 days
  INSERT INTO harvest_logs (date, block_id, weight_kg, supervisor_id, driver_id, vehicle_id, notes) VALUES
    -- Recent harvests (last 7 days)
    (CURRENT_DATE - INTERVAL '1 day', 'Block A-01', 12500.50, supervisor1_id, driver1_id, vehicle1_id, 'Good quality FFB, early morning harvest'),
    (CURRENT_DATE - INTERVAL '1 day', 'Block A-02', 11800.75, supervisor1_id, driver2_id, vehicle2_id, 'Standard harvest'),
    (CURRENT_DATE - INTERVAL '1 day', 'Block B-01', 13200.25, supervisor2_id, driver3_id, vehicle3_id, 'High yield block'),
    (CURRENT_DATE - INTERVAL '2 days', 'Block A-03', 11000.00, supervisor1_id, driver1_id, vehicle1_id, NULL),
    (CURRENT_DATE - INTERVAL '2 days', 'Block B-02', 12800.50, supervisor2_id, driver2_id, vehicle2_id, 'Excellent ripeness'),
    (CURRENT_DATE - INTERVAL '3 days', 'Block C-01', 14500.75, supervisor3_id, driver3_id, vehicle3_id, 'Peak harvest period'),
    (CURRENT_DATE - INTERVAL '3 days', 'Block A-04', 9800.25, supervisor1_id, driver1_id, vehicle1_id, 'Lower yield due to recent pruning'),
    (CURRENT_DATE - INTERVAL '4 days', 'Block B-03', 12200.00, supervisor2_id, driver2_id, vehicle2_id, NULL),
    (CURRENT_DATE - INTERVAL '4 days', 'Block C-02', 13800.50, supervisor3_id, driver3_id, vehicle4_id, 'Good weather conditions'),
    (CURRENT_DATE - INTERVAL '5 days', 'Block A-05', 11500.75, supervisor1_id, driver1_id, vehicle1_id, NULL),
    (CURRENT_DATE - INTERVAL '5 days', 'Block B-04', 13000.25, supervisor2_id, driver2_id, vehicle2_id, 'Standard harvest'),
    (CURRENT_DATE - INTERVAL '6 days', 'Block C-03', 14200.00, supervisor3_id, driver3_id, vehicle3_id, 'High quality FFB'),
    (CURRENT_DATE - INTERVAL '7 days', 'Block A-06', 10800.50, supervisor1_id, driver1_id, vehicle1_id, NULL),
    
    -- Previous week
    (CURRENT_DATE - INTERVAL '8 days', 'Block B-05', 12500.75, supervisor2_id, driver2_id, vehicle2_id, 'Good harvest'),
    (CURRENT_DATE - INTERVAL '9 days', 'Block C-04', 14000.25, supervisor3_id, driver3_id, vehicle3_id, NULL),
    (CURRENT_DATE - INTERVAL '10 days', 'Block A-07', 11200.00, supervisor1_id, driver1_id, vehicle1_id, 'Standard quality'),
    (CURRENT_DATE - INTERVAL '11 days', 'Block B-06', 12800.50, supervisor2_id, driver2_id, vehicle2_id, 'Excellent yield'),
    (CURRENT_DATE - INTERVAL '12 days', 'Block C-05', 13500.75, supervisor3_id, driver3_id, vehicle4_id, NULL),
    (CURRENT_DATE - INTERVAL '13 days', 'Block A-08', 10500.25, supervisor1_id, driver1_id, vehicle1_id, 'Lower yield'),
    (CURRENT_DATE - INTERVAL '14 days', 'Block B-07', 12000.00, supervisor2_id, driver2_id, vehicle2_id, 'Good harvest'),
    
    -- Two weeks ago
    (CURRENT_DATE - INTERVAL '15 days', 'Block C-06', 13800.50, supervisor3_id, driver3_id, vehicle3_id, NULL),
    (CURRENT_DATE - INTERVAL '16 days', 'Block A-09', 11000.75, supervisor1_id, driver1_id, vehicle1_id, 'Standard harvest'),
    (CURRENT_DATE - INTERVAL '17 days', 'Block B-08', 12600.25, supervisor2_id, driver2_id, vehicle2_id, NULL),
    (CURRENT_DATE - INTERVAL '18 days', 'Block C-07', 14300.00, supervisor3_id, driver3_id, vehicle3_id, 'High yield'),
    (CURRENT_DATE - INTERVAL '19 days', 'Block A-10', 10700.50, supervisor1_id, driver1_id, vehicle1_id, NULL),
    (CURRENT_DATE - INTERVAL '20 days', 'Block B-09', 12300.75, supervisor2_id, driver2_id, vehicle2_id, 'Good quality'),
    
    -- Three weeks ago
    (CURRENT_DATE - INTERVAL '21 days', 'Block C-08', 13700.25, supervisor3_id, driver3_id, vehicle4_id, NULL),
    (CURRENT_DATE - INTERVAL '22 days', 'Block A-11', 10900.00, supervisor1_id, driver1_id, vehicle1_id, 'Standard harvest'),
    (CURRENT_DATE - INTERVAL '23 days', 'Block B-10', 12400.50, supervisor2_id, driver2_id, vehicle2_id, NULL),
    (CURRENT_DATE - INTERVAL '24 days', 'Block C-09', 14100.75, supervisor3_id, driver3_id, vehicle3_id, 'Excellent yield'),
    (CURRENT_DATE - INTERVAL '25 days', 'Block A-12', 10600.25, supervisor1_id, driver1_id, vehicle1_id, NULL),
    (CURRENT_DATE - INTERVAL '26 days', 'Block B-11', 12100.00, supervisor2_id, driver2_id, vehicle2_id, 'Good harvest'),
    (CURRENT_DATE - INTERVAL '27 days', 'Block C-10', 13600.50, supervisor3_id, driver3_id, vehicle3_id, NULL),
    (CURRENT_DATE - INTERVAL '28 days', 'Block A-13', 10800.75, supervisor1_id, driver1_id, vehicle1_id, 'Standard quality'),
    (CURRENT_DATE - INTERVAL '29 days', 'Block B-12', 12200.25, supervisor2_id, driver2_id, vehicle2_id, NULL),
    (CURRENT_DATE - INTERVAL '30 days', 'Block C-11', 13900.00, supervisor3_id, driver3_id, vehicle4_id, 'High yield block')
  ON CONFLICT DO NOTHING;
END $$;

-- Verify data insertion
SELECT 
  (SELECT COUNT(*) FROM staff) as staff_count,
  (SELECT COUNT(*) FROM vehicles) as vehicles_count,
  (SELECT COUNT(*) FROM inventory_items) as inventory_count,
  (SELECT COUNT(*) FROM harvest_logs) as harvest_logs_count;
