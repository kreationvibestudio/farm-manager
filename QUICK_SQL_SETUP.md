# Quick SQL Setup Guide

## ⚠️ Important: Use SQL Files, NOT TypeScript Files!

**DO NOT** copy TypeScript files (`.ts` files) into Supabase SQL Editor.  
**DO** copy SQL files (`.sql` files) into Supabase SQL Editor.

## Step-by-Step Setup

### Step 1: Create the Maintenance Table (If Not Exists)

1. Open **Supabase Dashboard** → **SQL Editor**
2. Open the file: `supabase-maintenance-schema.sql`
3. **Copy ALL contents** from that file
4. **Paste** into Supabase SQL Editor
5. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

✅ This creates the `maintenance_logs` table.

### Step 2: Insert Sample Data

1. In the same **SQL Editor** (or new query)
2. Open the file: `supabase-maintenance-sample-data.sql`
3. **Copy ALL contents** from that file
4. **Paste** into Supabase SQL Editor
5. Click **Run**

✅ This inserts 50+ realistic maintenance log entries.

## Which Files to Use?

### ✅ Use These SQL Files in Supabase:
- `supabase-maintenance-schema.sql` - Creates the table
- `supabase-maintenance-sample-data.sql` - Inserts sample data
- `supabase-setup-complete.sql` - Complete database setup (if starting fresh)
- `supabase-gps-tracking.sql` - GPS tracking table setup

### ❌ DO NOT Use These TypeScript Files in Supabase:
- `src/lib/api/maintenance.ts` - This is TypeScript code, not SQL!
- Any file in `src/` folder - These are application code files

## How to Identify SQL Files

SQL files:
- Have `.sql` extension
- Start with comments like `-- Farm Maintenance Database Schema`
- Contain SQL keywords: `CREATE TABLE`, `INSERT INTO`, `SELECT`, etc.

TypeScript files:
- Have `.ts` or `.tsx` extension
- Start with `import` statements
- Contain JavaScript/TypeScript code

## Verification

After running the SQL, verify it worked:

```sql
SELECT COUNT(*) FROM maintenance_logs;
```

Should return a number > 0 if data was inserted successfully.

## Common Errors

### Error: "syntax error at or near 'import'"
**Cause:** You copied a TypeScript file instead of SQL file.  
**Fix:** Use the `.sql` file instead.

### Error: "relation 'maintenance_logs' does not exist"
**Cause:** Table hasn't been created yet.  
**Fix:** Run `supabase-maintenance-schema.sql` first.

### Error: "relation 'staff' does not exist"
**Cause:** Staff table doesn't exist.  
**Fix:** Run `supabase-setup-complete.sql` to create all tables.
