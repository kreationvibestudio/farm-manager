# Vercel Environment Variables Setup

## ⚠️ 500 Error Fix

The 500 error is likely due to missing environment variables in Vercel. 

### Required Environment Variables

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

#### Supabase Variables (REQUIRED):
```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

#### Optional (but recommended):
```
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET
```

#### NextAuth Variables:
```
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
NEXTAUTH_URL=https://your-app.vercel.app
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

#### Weather API (OpenWeatherMap):
```
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

**⚠️ SECURITY NOTE**: Never commit actual secrets to version control. Get these values from:
- Supabase Dashboard → Settings → API
- Vercel Dashboard → Your Project → Settings → Environment Variables

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
