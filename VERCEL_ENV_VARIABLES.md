# Vercel Environment Variables Setup Guide

## 📋 Required Environment Variables

Copy and paste these into your Vercel Dashboard.

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your project: **farm-managerr**
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Each Variable

For each variable below:
1. Click **Add New**
2. Enter the **Name** (exactly as shown)
3. Enter the **Value** (copy the entire value)
4. Select **Production**, **Preview**, and **Development** (check all three)
5. Click **Save**

---

## 🔐 Environment Variables to Add

### 1. Supabase URL
**Name:** `NEXT_PUBLIC_SUPABASE_URL`  
**Value:** `https://hzdralzrkkzdeumpbvdh.supabase.co`  
**Environments:** ✅ Production ✅ Preview ✅ Development

---

### 2. Supabase Anon Key
**Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHJhbHpya2t6ZGV1bXBidmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNDU2MjgsImV4cCI6MjA4MjgyMTYyOH0.OqIZggdP2jRbcd3ezZfo75PFTDWqnZRus3vKCcm-xp4`  
**Environments:** ✅ Production ✅ Preview ✅ Development

---

### 3. Supabase Service Role Key (Optional but Recommended)
**Name:** `SUPABASE_SERVICE_ROLE_KEY`  
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHJhbHpya2t6ZGV1bXBidmRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI0NTYyOCwiZXhwIjoyMDgyODIxNjI4fQ.1oZrlpnj8n7QOxWqJJP4XbMqoWjfKX_NzEqGBbIaNs0`  
**Environments:** ✅ Production ✅ Preview ✅ Development

---

### 4. NextAuth Secret
**Name:** `NEXTAUTH_SECRET`  
**Value:** `dc1e864f6e79e0542bb4a402351052b4eff00c5c973929bc88e5eada2a1e0d58`  
**Environments:** ✅ Production ✅ Preview ✅ Development

---

### 5. NextAuth URL
**Name:** `NEXTAUTH_URL`  
**Value:** `https://farm-managerr.vercel.app`  
**Environments:** ✅ Production ✅ Preview

**For Development:**
**Name:** `NEXTAUTH_URL`  
**Value:** `http://localhost:3000`  
**Environments:** ✅ Development

---

### 6. Admin Username
**Name:** `ADMIN_USERNAME`  
**Value:** `admin`  
**Environments:** ✅ Production ✅ Preview ✅ Development

---

### 7. Admin Password
**Name:** `ADMIN_PASSWORD`  
**Value:** `plantation123`  
**Environments:** ✅ Production ✅ Preview ✅ Development

---

### 8. Mapbox Token
**Name:** `NEXT_PUBLIC_MAPBOX_TOKEN`  
**Value:** `pk.eyJ1Ijoic2Rrb25jZXB0IiwiYSI6ImNtamtvaDNqejIzeHIzZ3F4bXo0bXN3MDgifQ.GAkm6kW5nBlWe8H8RbT0rg`  
**Environments:** ✅ Production ✅ Preview ✅ Development

---

## ✅ Verification Checklist

After adding all variables:

- [ ] All 7 variables are added
- [ ] Each variable has the correct name (case-sensitive!)
- [ ] Each variable has the correct value
- [ ] Production, Preview, and Development are selected for each
- [ ] `NEXTAUTH_URL` has different values for Production/Preview vs Development

## 🔄 After Adding Variables

1. **Redeploy your application:**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**
   - Or wait for the next automatic deployment

2. **Verify deployment:**
   - Check the build logs for any errors
   - Visit your site: https://farm-managerr.vercel.app
   - Try logging in with admin/plantation123

## 🐛 Troubleshooting

### Variables Not Working?
- Make sure variable names are **exactly** as shown (case-sensitive)
- Verify you selected all three environments (Production, Preview, Development)
- Redeploy after adding variables
- Check Vercel build logs for errors

### Still Getting 500 Errors?
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check that your Supabase database has the schema and data
- Look at Vercel function logs for specific error messages

### Can't Login?
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your actual Vercel URL
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are correct

## 📝 Quick Copy-Paste Format

If you prefer to add them all at once, here's the format:

```
NEXT_PUBLIC_SUPABASE_URL=https://hzdralzrkkzdeumpbvdh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHJhbHpya2t6ZGV1bXBidmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNDU2MjgsImV4cCI6MjA4MjgyMTYyOH0.OqIZggdP2jRbcd3ezZfo75PFTDWqnZRus3vKCcm-xp4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHJhbHpya2t6ZGV1bXBidmRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI0NTYyOCwiZXhwIjoyMDgyODIxNjI4fQ.1oZrlpnj8n7QOxWqJJP4XbMqoWjfKX_NzEqGBbIaNs0
NEXTAUTH_SECRET=dc1e864f6e79e0542bb4a402351052b4eff00c5c973929bc88e5eada2a1e0d58
NEXTAUTH_URL=https://farm-managerr.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=plantation123
```

Note: You'll need to add `NEXTAUTH_URL` separately for Development with value `http://localhost:3000`
