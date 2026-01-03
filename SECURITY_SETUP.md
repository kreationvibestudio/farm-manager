# Security Setup Instructions

## ⚠️ CRITICAL: Run These SQL Scripts First

Before the security features will work, you **MUST** run these SQL scripts in Supabase:

### Step 1: Create Audit Log Table

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase-audit-log-schema.sql`
3. Click **Run**

This creates the `audit_logs` table that tracks all user actions.

### Step 2: Add Soft Delete Columns

1. In the same **SQL Editor** (or new query)
2. Copy and paste the contents of `supabase-soft-delete-schema.sql`
3. Click **Run**

This adds `deleted_at` and `deleted_by` columns to all tables.

## 🔐 Environment Variables

**REQUIRED** - Set these in `.env.local` and Vercel:

```env
# Authentication (REQUIRED - no defaults)
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_secure_password
NEXTAUTH_SECRET=your_random_secret_key

# Supabase (for audit logging)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Generate NEXTAUTH_SECRET

```bash
# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# On Mac/Linux
openssl rand -base64 32
```

## ✅ Verification Checklist

After setup, verify:

- [ ] Can't access pages without login (redirects to `/login`)
- [ ] API routes return 401 without authentication
- [ ] Login works with correct credentials
- [ ] Wrong password shows error
- [ ] 5 failed attempts blocks login for 15 minutes
- [ ] Deleted records don't appear in lists (soft delete)
- [ ] Audit logs table exists and has entries
- [ ] Login events appear in audit_logs

## 🧪 Quick Test

1. **Test Authentication**:
   - Try accessing `/` without login → Should redirect
   - Try accessing `/api/maintenance` → Should return 401

2. **Test Login**:
   - Login with correct credentials → Should work
   - Try wrong password 6 times → Should block

3. **Test Soft Delete**:
   - Delete a record → Should disappear from UI
   - Check database → Record should have `deleted_at` set

4. **Test Audit Logging**:
   - Create/Update/Delete a record
   - Check `audit_logs` table → Should see entry

## 🚨 Important Notes

- **No default credentials** - You MUST set `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- **No default NEXTAUTH_SECRET** - You MUST generate and set this
- **Audit logging is non-blocking** - If it fails, the app still works
- **Soft delete is permanent** - Once `deleted_at` is set, records are hidden but recoverable
