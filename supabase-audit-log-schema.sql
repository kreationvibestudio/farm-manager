-- Audit Logging Database Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This creates the audit_logs table for tracking all user actions

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  user_name TEXT,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW')),
  resource_type TEXT NOT NULL, -- 'maintenance_logs', 'staff', 'harvest_logs', 'inventory_items', 'vehicles', etc.
  resource_id UUID,
  old_data JSONB, -- Previous state (for updates/deletes)
  new_data JSONB, -- New state (for creates/updates)
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow read for authenticated users" ON audit_logs;

-- Only authenticated users can read audit logs (for now, allow all - you can restrict further)
CREATE POLICY "Allow read for authenticated users" ON audit_logs
  FOR SELECT USING (true);

-- Only system can insert audit logs (via service role)
-- Regular users cannot insert directly
