# Adding Admin User - Instructions

## Overview

To add the admin user "Usiholo Anenih" with database-backed authentication, you need to:

1. Run the database schema to create the `users` table
2. Run the script to add the admin user
3. Update the authentication system (see below)

## Step 1: Create Users Table

Run the SQL schema in your Supabase Dashboard:

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase-users-schema.sql`
3. Click **Run**

This creates the `users` table with support for:
- Username/password authentication
- Password hashing
- `must_change_password` flag
- User roles

## Step 2: Add Admin User

### Option A: Using the Node.js Script (Recommended)

1. Make sure you have `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the script:
   ```bash
   node scripts/add-admin-user.js
   ```

This will:
- Hash the password using bcrypt
- Insert the user into the database
- Set `must_change_password = true`

### Option B: Manual SQL (Alternative)

If you prefer to hash the password manually or use a different method, you can run SQL directly in Supabase.

**Note:** The password needs to be hashed using bcrypt. The script above handles this automatically.

## Step 3: Authentication System (✅ COMPLETE)

The authentication system has been fully updated to support:
- ✅ Database user authentication
- ✅ Password verification using bcrypt
- ✅ `must_change_password` flag handling
- ✅ Password change page at `/change-password`
- ✅ Middleware redirect for users who must change password
- ✅ API route for password changes
- ✅ Backward compatibility with environment variables

## Current Admin User Details

- **Full Name:** Usiholo Anenih
- **Username:** usiholo
- **Password:** Password@123 (must be changed on first login)
- **Role:** Admin
- **Phone Number:** 08028890064

## ✅ Implementation Status

All components have been implemented:

1. ✅ Create users table (see `supabase-users-schema.sql`)
2. ✅ Create script to add admin user (see `scripts/add-admin-user.js`)
3. ✅ Updated `src/lib/auth.ts` to check database for users
4. ✅ Created password change page (`src/app/change-password/page.tsx`)
5. ✅ Created API route for password change (`src/app/api/users/change-password/route.ts`)
6. ✅ Updated middleware to check `must_change_password` flag
7. ✅ Updated JWT callbacks to include `must_change_password` in token
8. ✅ Created admin Supabase client (`src/lib/supabase/admin.ts`)

## How It Works

1. **Login Flow:**
   - User enters username/password
   - System checks database first (by username)
   - If found, verifies password using bcrypt
   - If not found or DB error, falls back to environment variables
   - Sets `must_change_password` flag in JWT if user needs to change password

2. **Password Change Flow:**
   - Users with `must_change_password = true` are automatically redirected to `/change-password`
   - User must enter current password and new password (min 8 characters)
   - Password is verified, hashed, and updated in database
   - `must_change_password` flag is cleared
   - User is redirected to dashboard

3. **Backward Compatibility:**
   - Environment variable authentication still works
   - If database check fails, system falls back to env vars
   - No breaking changes for existing setups
