# Security Implementation Guide

This document outlines all security features implemented in the Farm Manager application.

## 🔒 Security Features Implemented

### 1. Authentication & Authorization

#### Middleware Protection
- **File**: `src/middleware.ts`
- **Features**:
  - Enforces authentication on all routes except `/login` and `/api/auth`
  - Redirects unauthenticated users to login page
  - Preserves callback URL for redirect after login
  - Supports both NextAuth and Supabase authentication

#### API Route Protection
- **Files**: All files in `src/app/api/**/route.ts`
- **Features**:
  - All API routes (GET, POST, PUT, DELETE) require authentication
  - Uses `requireAuth()` helper function
  - Returns 401 Unauthorized if no valid session

#### Login Security
- **File**: `src/lib/auth.ts`
- **Features**:
  - Rate limiting: Max 5 login attempts per IP per 15 minutes
  - No default credentials (must set `ADMIN_USERNAME` and `ADMIN_PASSWORD`)
  - Session timeout: 8 hours
  - IP-based tracking of login attempts

### 2. Audit Logging

#### Audit Log Table
- **File**: `supabase-audit-log-schema.sql`
- **Features**:
  - Tracks all CREATE, UPDATE, DELETE, LOGIN, LOGOUT actions
  - Records user ID, name, IP address, user agent
  - Stores old and new data for updates/deletes
  - Timestamped with `created_at`

#### Audit Logging Service
- **File**: `src/lib/audit/audit-log.ts`
- **Features**:
  - Automatic logging on all data modifications
  - Logs login/logout events
  - Captures IP address and user agent
  - Non-blocking (errors don't break the app)

#### What Gets Logged
- ✅ All CREATE operations (new records)
- ✅ All UPDATE operations (with before/after data)
- ✅ All DELETE operations (with deleted data)
- ✅ Login attempts (successful)
- ✅ Logout events

### 3. Soft Delete

#### Database Schema
- **File**: `supabase-soft-delete-schema.sql`
- **Features**:
  - Adds `deleted_at` and `deleted_by` columns to all tables
  - Indexes for efficient queries (only non-deleted records)
  - Prevents accidental permanent data loss

#### Implementation
- **Files**: All `src/lib/api/*.ts` files
- **Features**:
  - Delete operations set `deleted_at` timestamp instead of removing records
  - Records who deleted the data (`deleted_by`)
  - All GET queries exclude deleted records automatically
  - Data can be recovered if needed

#### Tables with Soft Delete
- ✅ `maintenance_logs`
- ✅ `harvest_logs`
- ✅ `staff`
- ✅ `inventory_items`
- ✅ `vehicles`

### 4. Data Protection

#### No Permanent Deletions
- All delete operations are soft deletes
- Data is marked as deleted but remains in database
- Can be recovered by setting `deleted_at = NULL`

#### Audit Trail
- Every change is logged with:
  - Who made the change
  - When it was made
  - What changed (old vs new data)
  - IP address and user agent

## 📋 Setup Instructions

### 1. Database Setup

Run these SQL files in Supabase Dashboard → SQL Editor (in order):

1. **Audit Log Table**:
   ```sql
   -- Run: supabase-audit-log-schema.sql
   ```

2. **Soft Delete Columns**:
   ```sql
   -- Run: supabase-soft-delete-schema.sql
   ```

### 2. Environment Variables

**Required** (must be set, no defaults):

```env
# Authentication
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_secure_password
NEXTAUTH_SECRET=your_random_secret_key_here

# Supabase (for audit logging)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 3. Verify Security

#### Test Authentication
1. Try accessing `/` without logging in → Should redirect to `/login`
2. Try accessing `/api/maintenance` without auth → Should return 401
3. Try wrong credentials 6 times → Should block for 15 minutes

#### Test Audit Logging
1. Create a maintenance log → Check `audit_logs` table
2. Update a staff member → Check audit log for UPDATE
3. Delete a record → Check audit log for DELETE with old data
4. Login → Check audit log for LOGIN event

#### Test Soft Delete
1. Delete a record → Check table, `deleted_at` should be set
2. List records → Deleted record should not appear
3. Query database directly → Record still exists with `deleted_at` set

## 🔍 Viewing Audit Logs

### In Supabase Dashboard

```sql
-- View all audit logs
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100;

-- View deletions only
SELECT * FROM audit_logs WHERE action = 'DELETE' ORDER BY created_at DESC;

-- View actions by user
SELECT user_name, action, resource_type, COUNT(*) 
FROM audit_logs 
GROUP BY user_name, action, resource_type;

-- View recent login/logout events
SELECT * FROM audit_logs 
WHERE action IN ('LOGIN', 'LOGOUT') 
ORDER BY created_at DESC;
```

## 🛡️ Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env.local` to git
- ✅ Use strong, unique passwords
- ✅ Rotate `NEXTAUTH_SECRET` periodically
- ✅ Use different credentials for dev/staging/production

### 2. Database Security
- ✅ Enable Row Level Security (RLS) in Supabase
- ✅ Use service role key only on server-side
- ✅ Never expose service role key in client code

### 3. API Security
- ✅ All API routes require authentication
- ✅ Validate all input data
- ✅ Use parameterized queries (Supabase handles this)

### 4. Monitoring
- ✅ Regularly review audit logs
- ✅ Monitor for suspicious activity
- ✅ Set up alerts for multiple failed login attempts

## 🚨 Incident Response

### If Data is Accidentally Deleted

1. **Check Audit Log**:
   ```sql
   SELECT * FROM audit_logs 
   WHERE action = 'DELETE' 
   AND resource_id = 'your-record-id'
   ORDER BY created_at DESC;
   ```

2. **Recover Data**:
   ```sql
   -- Restore soft-deleted record
   UPDATE your_table 
   SET deleted_at = NULL, deleted_by = NULL 
   WHERE id = 'your-record-id';
   ```

3. **Check Who Deleted**:
   ```sql
   SELECT deleted_by, deleted_at 
   FROM your_table 
   WHERE id = 'your-record-id';
   ```

### If Unauthorized Access is Suspected

1. Check audit logs for suspicious activity
2. Review login events for unknown IPs
3. Change credentials immediately
4. Review all recent changes

## 📊 Security Checklist

- [x] Authentication enforced on all routes
- [x] API routes protected with auth checks
- [x] Rate limiting on login attempts
- [x] No default credentials
- [x] Audit logging for all actions
- [x] Soft delete implemented
- [x] IP tracking in audit logs
- [x] Session timeout configured
- [x] Environment variables required (no defaults)
- [x] All delete operations logged

## 🔄 Future Enhancements

Consider implementing:
- [ ] Two-factor authentication (2FA)
- [ ] Role-based access control (RBAC)
- [ ] Approval workflow for critical deletions
- [ ] Automated backup system
- [ ] Security alerts/notifications
- [ ] Activity dashboard for admins
- [ ] IP whitelisting for admin access
