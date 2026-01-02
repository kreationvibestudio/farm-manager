# Vercel Environment Variables Setup

## ⚠️ 500 Error Fix

The 500 error is likely due to missing environment variables in Vercel. 

### Required Environment Variables

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

#### Supabase Variables (REQUIRED):
```
NEXT_PUBLIC_SUPABASE_URL=https://hzdralzrkkzdeumpbvdh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHJhbHpya2t6ZGV1bXBidmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNDU2MjgsImV4cCI6MjA4MjgyMTYyOH0.OqIZggdP2jRbcd3ezZfo75PFTDWqnZRus3vKCcm-xp4
```

#### Optional (but recommended):
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHJhbHpya2t6ZGV1bXBidmRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI0NTYyOCwiZXhwIjoyMDgyODIxNjI4fQ.1oZrlpnj8n7QOxWqJJP4XbMqoWjfKX_NzEqGBbIaNs0
SUPABASE_JWT_SECRET=oJKA1lkdHS0m58k4zABX3dSXx/tV5x8ru3krpeALlSek75pJl7ic866XAs0o2dEjqMxM72bYF/X9acgUtxik1g==
```

#### NextAuth Variables:
```
NEXTAUTH_SECRET=dc1e864f6e79e0542bb4a402351052b4eff00c5c973929bc88e5eada2a1e0d58
NEXTAUTH_URL=https://farm-managerr.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=plantation123
```

### Steps:

1. Go to https://vercel.com/dashboard
2. Select your project: `farm-managerr`
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. Make sure to select **Production**, **Preview**, and **Development** for each variable
6. Click **Save**
7. **Redeploy** your application (or wait for automatic redeploy)

### After Adding Variables:

1. The app will automatically redeploy
2. The 500 error should be resolved
3. Make sure the database schema is set up in Supabase (run `supabase-schema.sql`)

### Error Handling Added:

The code now gracefully handles:
- Missing Supabase environment variables
- Supabase connection failures
- Returns empty arrays instead of crashing
- Logs errors to console for debugging

### Check Vercel Logs:

If the error persists, check:
- Vercel Dashboard → Your Project → **Deployments** → Click on latest deployment → **Logs**
- Look for any error messages about missing variables or database connection
