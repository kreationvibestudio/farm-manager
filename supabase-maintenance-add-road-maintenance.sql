-- Add Road Maintenance to maintenance_logs activity constraint
-- Run this SQL in your Supabase Dashboard -> SQL Editor

-- Drop existing constraint
ALTER TABLE maintenance_logs 
DROP CONSTRAINT IF EXISTS maintenance_logs_activity_check;

-- Add new constraint with Road Maintenance included
ALTER TABLE maintenance_logs 
ADD CONSTRAINT maintenance_logs_activity_check 
CHECK (activity IN ('Pruning', 'Fertilizer Application', 'Herbicide Application', 'Slashing', 'Ring Weeding', 'Road Maintenance'));
