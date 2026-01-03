# Fix 500 Error on Vercel - Missing Environment Variables

## 🚨 Error: `GET /api/auth/session 500 (Internal Server Error)`

This error occurs because **required environment variables are missing** in your Vercel deployment.

## ✅ Quick Fix

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Select your project: **farm-managerr**
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Variables

Add these **REQUIRED** environment variables:

#### 1. NEXTAUTH_SECRET (CRITICAL - Required for authentication)
```
Name: NEXTAUTH_SECRET
Value: [Generate a random secret - see below]
Environments: Production, Preview, Development
```

**Generate Secret:**
- **Windows PowerShell:**
  ```powershell
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
  ```
- **Mac/Linux:**
  ```bash
  openssl rand -base64 32
  ```

#### 2. ADMIN_USERNAME (Required for login)
```
Name: ADMIN_USERNAME
Value: your_username_here
Environments: Production, Preview, Development
```

#### 3. ADMIN_PASSWORD (Required for login)
```
Name: ADMIN_PASSWORD
Value: your_secure_password_here
Environments: Production, Preview, Development
```

#### 4. NEXTAUTH_URL (Required for production)
```
Name: NEXTAUTH_URL
Value: https://farm-managerr.vercel.app
Environments: Production, Preview
```

#### 5. Supabase Variables (If using Supabase)
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: your_supabase_url

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your_supabase_anon_key
```

### Step 3: Redeploy

After adding variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or wait for automatic redeploy (if enabled)

## 🔍 Verify Variables Are Set

After redeploy, check Vercel logs:
1. Go to **Deployments** → Click on latest deployment
2. Click **View Function Logs**
3. Look for any errors about missing environment variables

## 📋 Complete Environment Variables Checklist

- [ ] `NEXTAUTH_SECRET` - Random secret (32+ characters)
- [ ] `ADMIN_USERNAME` - Your login username
- [ ] `ADMIN_PASSWORD` - Your login password
- [ ] `NEXTAUTH_URL` - Your Vercel URL (https://farm-managerr.vercel.app)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

## ⚠️ Important Notes

1. **NEXTAUTH_SECRET is CRITICAL** - Without it, authentication will fail with 500 error
2. **Never commit secrets** - They should only be in Vercel environment variables
3. **Use different secrets** for production vs development
4. **After adding variables, redeploy** for changes to take effect

## 🧪 Test After Fix

1. Visit: https://farm-managerr.vercel.app
2. Should redirect to `/login` (not show 500 error)
3. Login with your `ADMIN_USERNAME` and `ADMIN_PASSWORD`
4. Should successfully authenticate

## 📞 Still Having Issues?

Check Vercel Function Logs for specific error messages:
- Missing `NEXTAUTH_SECRET` → Add it
- Missing `ADMIN_USERNAME` → Add it
- Missing `ADMIN_PASSWORD` → Add it
- Database errors → Run SQL schemas in Supabase
