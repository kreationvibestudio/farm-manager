# Medical Requests Fix - Staff Matching Issue

## Problem
Users were seeing the message "You are not registered in the staff system" even when they should have access to medical requests.

## Root Cause
The system was trying to match `session.user.name` (from the `users` table) with `staff.name` (from the `staff` table) using name matching, which is unreliable because:
1. Names might not match exactly
2. There's no direct link between users and staff tables
3. Admins/Operators should be able to manage requests even without a staff record

## Solution Implemented

### 1. Added `user_id` Field to Staff Table
- Created migration: `supabase-staff-add-user-id.sql`
- Links staff members to their user accounts via foreign key
- Provides reliable matching between users and staff

### 2. Improved Matching Logic
- **Primary**: Match by `user_id` (most reliable)
- **Fallback**: Match by exact name
- **Last resort**: Match by partial name

### 3. Admin/Operator Access
- Admins and Operators can now:
  - View all medical requests
  - Approve/reject requests (even without staff record)
  - Record payments
- They cannot create requests for themselves (requires staff record)
- Warning message only shows for non-admin users

### 4. Updated API Routes
- Medical requests API now allows admins/operators to approve/reject even without staff record
- Uses user role from `users` table as fallback when staff record not found

## Database Migration Required

**Run this SQL in Supabase Dashboard → SQL Editor:**

```sql
-- File: supabase-staff-add-user-id.sql
-- This adds user_id column to link staff to users
```

## Changes Made

### Files Modified:
1. `src/types/index.ts` - Added `userId` to Staff interface
2. `src/lib/api/staff.ts` - Updated to handle userId in CRUD operations
3. `src/app/medical-requests/page.tsx` - Improved matching logic and admin access
4. `src/app/api/medical-requests/[id]/route.ts` - Allow admins/operators to manage requests

### Files Created:
1. `supabase-staff-add-user-id.sql` - Database migration

## How It Works Now

1. **For Staff Members:**
   - System first tries to match by `user_id` (if staff record has it)
   - Falls back to name matching if `user_id` not set
   - Can create and manage their own requests

2. **For Admins/Operators:**
   - Can view all requests
   - Can approve/reject requests (treated as having appropriate permissions)
   - Can record payments
   - Cannot create requests for themselves (requires staff record)

3. **For Regular Users:**
   - Must have a staff record to access medical requests
   - Warning shown if not found in staff system

## Next Steps

1. **Run the migration**: Execute `supabase-staff-add-user-id.sql` in Supabase
2. **Link existing staff**: Update staff records to link them to user accounts:
   ```sql
   UPDATE staff s
   SET user_id = u.id
   FROM users u
   WHERE LOWER(TRIM(s.name)) = LOWER(TRIM(u.full_name));
   ```
3. **Test**: Verify that admins can now access medical requests without staff records

## Benefits

- ✅ Admins/Operators can manage requests immediately
- ✅ More reliable matching with user_id
- ✅ Better user experience (no false warnings for admins)
- ✅ Maintains security (only authorized roles can approve)
