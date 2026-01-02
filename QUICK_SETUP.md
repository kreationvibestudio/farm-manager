# Quick Database Setup Guide

## ⚠️ Error: "relation does not exist"

If you're getting this error, it means you tried to run the sample data script **before** creating the database tables.

## ✅ Solution: Use the Combined SQL File

I've created a **single SQL file** that does everything at once:

### `supabase-setup-complete.sql`

This file includes:
1. ✅ Schema creation (tables, indexes, triggers, RLS policies)
2. ✅ Sample data (staff, vehicles, inventory, harvest logs)

### How to Use:

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project
   - Click **SQL Editor**

2. **Open `supabase-setup-complete.sql`**
   - Copy the entire file content
   - Paste into SQL Editor
   - Click **Run**

3. **Done!** ✅
   - All tables will be created
   - Sample data will be inserted
   - You'll see a summary at the end

## Alternative: Two-Step Process

If you prefer to run them separately:

### Step 1: Create Schema
Run `supabase-schema.sql` first

### Step 2: Add Sample Data
Then run `supabase-sample-data.sql`

## Verify Setup

After running, check:
- Supabase Dashboard → **Table Editor**
- You should see 4 tables: `staff`, `vehicles`, `inventory_items`, `harvest_logs`
- Each table should have data

## Need Help?

- Check the error message - it will tell you which table is missing
- Make sure you run the schema SQL before the data SQL
- Or just use `supabase-setup-complete.sql` for everything at once!
