-- Add designation column to staff table
-- Run this SQL in your Supabase Dashboard -> SQL Editor

ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS designation TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN staff.designation IS 'Job designation/title (e.g., Estate Manager, Farm Manager). This is separate from role and is just a label.';
