# Quick Start: Populate Sample Data

## Step 1: Create .env.local File

Create a file named `.env.local` in the project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hzdralzrkkzdeumpbvdh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHJhbHpya2t6ZGV1bXBidmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNDU2MjgsImV4cCI6MjA4MjgyMTYyOH0.OqIZggdP2jRbcd3ezZfo75PFTDWqnZRus3vKCcm-xp4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHJhbHpya2t6ZGV1bXBidmRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI0NTYyOCwiZXhwIjoyMDgyODIxNjI4fQ.1oZrlpnj8n7QOxWqJJP4XbMqoWjfKX_NzEqGBbIaNs0
```

## Step 2: Ensure Database Schema is Created

Make sure you've run `supabase-schema.sql` in your Supabase Dashboard first!

## Step 3: Run the Population Script

```bash
npm run populate-data
```

That's it! The script will populate:
- ✅ 10 staff members
- ✅ 8 vehicles  
- ✅ 30 inventory items
- ✅ 30 harvest logs (past 30 days)

## Alternative: Use SQL Script

If you prefer SQL, you can also run `supabase-sample-data.sql` directly in the Supabase Dashboard SQL Editor.
