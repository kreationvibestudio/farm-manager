-- Farm Maintenance Database Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This creates the maintenance_logs table for tracking farm maintenance activities

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Maintenance Logs Table
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  block_id TEXT NOT NULL,
  activity TEXT NOT NULL CHECK (activity IN ('Pruning', 'Fertilizer Application', 'Herbicide Application', 'Slashing', 'Ring Weeding')),
  supervisor_id UUID REFERENCES staff(id),
  staff_count INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_date ON maintenance_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_block_id ON maintenance_logs(block_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_activity ON maintenance_logs(activity);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_supervisor_id ON maintenance_logs(supervisor_id);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_maintenance_logs_updated_at ON maintenance_logs;

-- Add trigger for updated_at
CREATE TRIGGER update_maintenance_logs_updated_at BEFORE UPDATE ON maintenance_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all for authenticated users" ON maintenance_logs;

-- Create policy (allow all for authenticated users)
CREATE POLICY "Allow all for authenticated users" ON maintenance_logs
    FOR ALL USING (true);
