# Medical Requests Error Fix

## Error
API error response: `{}` - Empty error object when submitting medical request

## Root Cause
The most likely causes are:
1. **Database table doesn't exist** - The `medical_requests` table hasn't been created yet
2. **Invalid staff ID** - The staff member doesn't exist in the database
3. **Missing required fields** - Database constraints not met

## Solution

### Step 1: Run Database Migration

**IMPORTANT**: You must run the SQL migration file in your Supabase Dashboard:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-medical-requests-schema.sql`
4. Click "Run" to execute the SQL

This will create the `medical_requests` table with all required fields and constraints.

### Step 2: Verify Staff Member Exists

Make sure the staff member you're trying to create a request for exists in the `staff` table:

```sql
-- Check if staff member exists
SELECT id, name, role FROM staff WHERE id = 'YOUR_STAFF_ID';
```

### Step 3: Check Error Messages

With the updated error handling, you should now see more detailed error messages:

- **Table not found**: "Medical requests table not found. Please run the database migration"
- **Invalid staff ID**: "Invalid staff ID. The staff member does not exist"
- **Missing field**: "Missing required field: [field_name]"
- **Invalid data**: "Invalid data: [constraint violation message]"

## Testing

After running the migration, try creating a medical request again. The error messages should now be more descriptive and help identify the exact issue.

## Changes Made

1. ✅ Added detailed error logging in API route
2. ✅ Added validation for required fields before database insert
3. ✅ Added specific error handling for Supabase error codes:
   - `PGRST116` / `42P01`: Table not found
   - `23503`: Foreign key violation (invalid staff ID)
   - `23502`: Not null violation (missing field)
   - `23514`: Check constraint violation
4. ✅ Improved error messages to guide users to solutions

## Next Steps

1. Run `supabase-medical-requests-schema.sql` in Supabase
2. Verify staff members exist in the `staff` table
3. Try creating a medical request again
4. Check browser console and server logs for detailed error messages if it still fails
