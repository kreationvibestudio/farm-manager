-- Add user_id to staff table to link staff members to users
-- Run this SQL in your Supabase Dashboard -> SQL Editor

-- Add user_id column
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);

-- Add comment to explain the relationship
COMMENT ON COLUMN staff.user_id IS 'Links staff member to their user account in the users table';
