# Fix: Audit Logs Not Showing Up

## Problem
When you delete a maintenance log (or perform other actions), the audit log entry is not appearing in the audit logs page.

## Root Cause
The `audit_logs` table has Row Level Security (RLS) enabled, but there was no INSERT policy, so the audit logging was being silently blocked.

## Solution

### Step 1: Run the Updated SQL Schema

Go to your **Supabase Dashboard** → **SQL Editor** and run this SQL:

```sql
-- Add INSERT policy for audit logs
CREATE POLICY "Allow insert for audit logging" ON audit_logs
  FOR INSERT WITH CHECK (true);
```

Or run the complete updated `supabase-audit-log-schema.sql` file which now includes the INSERT policy.

### Step 2: Verify the Table Exists

If you haven't created the `audit_logs` table yet, run the complete `supabase-audit-log-schema.sql` file in Supabase Dashboard.

### Step 3: Test

1. Delete a maintenance log
2. Check the browser console (F12) for audit logging messages
3. Go to the Audit Logs page (`/audit`)
4. You should now see the DELETE action logged

## Enhanced Logging

I've also added better logging to help debug issues:

- **Server console** will show:
  - `🗑️ Deleting maintenance log:` - When delete starts
  - `📋 Old data retrieved for audit:` - Confirms old data was retrieved
  - `📝 Logging audit event for DELETE...` - When audit logging starts
  - `✅ Audit event logged` - When successful
  - `❌ Failed to log audit event:` - If there's an error

- **Error messages** will now show:
  - If the `audit_logs` table doesn't exist
  - If there's a permission issue
  - Detailed error codes and messages

## Check Your Console

After making a delete, check:
1. **Browser console** (F12 → Console tab) - for client-side errors
2. **Server console** (where `npm run dev` is running) - for server-side logs

You should see the audit logging messages there.
