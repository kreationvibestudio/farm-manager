-- Soft Delete Database Schema Updates
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This adds soft delete columns to all tables

-- Add soft delete columns to maintenance_logs
ALTER TABLE maintenance_logs 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Add soft delete columns to harvest_logs
ALTER TABLE harvest_logs 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Add soft delete columns to staff
ALTER TABLE staff 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Add soft delete columns to inventory_items
ALTER TABLE inventory_items 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Add soft delete columns to vehicles
ALTER TABLE vehicles 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Create indexes for soft delete queries (only non-deleted records)
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_deleted_at 
  ON maintenance_logs(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_harvest_logs_deleted_at 
  ON harvest_logs(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_staff_deleted_at 
  ON staff(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_inventory_items_deleted_at 
  ON inventory_items(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_vehicles_deleted_at 
  ON vehicles(deleted_at) WHERE deleted_at IS NULL;
