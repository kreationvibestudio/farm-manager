-- Add palm_type column to harvest_logs
-- Run this SQL in your Supabase Dashboard -> SQL Editor

-- Add palm_type column
ALTER TABLE harvest_logs 
ADD COLUMN IF NOT EXISTS palm_type TEXT CHECK (palm_type IN ('Adult Palm', 'Young Palm'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_harvest_logs_palm_type ON harvest_logs(palm_type);
