-- Migration: Add 'Herbicide Application' to maintenance_logs activity constraint
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This updates the CHECK constraint to include the new activity type

-- Step 1: Drop the existing constraint
ALTER TABLE maintenance_logs 
  DROP CONSTRAINT IF EXISTS maintenance_logs_activity_check;

-- Step 2: Add the new constraint with all activity types in the correct order
ALTER TABLE maintenance_logs 
  ADD CONSTRAINT maintenance_logs_activity_check 
  CHECK (activity IN ('Pruning', 'Fertilizer Application', 'Herbicide Application', 'Slashing', 'Ring Weeding'));

-- Verify the constraint was updated
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'maintenance_logs'::regclass
  AND conname = 'maintenance_logs_activity_check';
