-- Migration: Update users table role constraint
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This updates the CHECK constraint to use Admin, Operator, Support instead of Admin, Manager, Supervisor

-- Step 1: Drop the existing constraint
ALTER TABLE users 
  DROP CONSTRAINT IF EXISTS users_role_check;

-- Step 2: Add the new constraint with the correct roles
ALTER TABLE users 
  ADD CONSTRAINT users_role_check 
  CHECK (role IN ('Admin', 'Operator', 'Support'));

-- Step 3: Update any existing users with old roles (if any)
-- If you have users with 'Manager' or 'Supervisor' roles, update them:
-- UPDATE users SET role = 'Admin' WHERE role = 'Manager';
-- UPDATE users SET role = 'Operator' WHERE role = 'Supervisor';

-- Verify the constraint was updated
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'users'::regclass
  AND conname = 'users_role_check';
