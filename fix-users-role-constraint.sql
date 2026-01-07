-- Fix the users.role check constraint
-- This ensures the constraint matches the exact values we're using

-- Drop the existing constraint if it exists
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

-- Recreate the constraint with the correct values (case-sensitive)
ALTER TABLE public.users
ADD CONSTRAINT users_role_check 
CHECK (role IN ('Admin', 'Operator', 'Support'));

-- Verify the constraint
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.users'::regclass
  AND conname = 'users_role_check';
