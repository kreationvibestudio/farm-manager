# Farm Maintenance Sample Data

This file contains realistic sample data for farm maintenance activities.

## What's Included

The sample data includes **50+ maintenance log entries** covering:

- **All 4 activity types:**
  - Slashing (grass clearing)
  - Pruning (removing dead/damaged fronds)
  - Ring Weeding (weeding around palm bases)
  - Fertilizer Application (NPK, Urea, DAP, etc.)

- **Time period:** Past 90 days (3 months)

- **Block coverage:** All blocks from A-01 to C-11 (matching harvest log blocks)

- **Realistic details:**
  - Staff counts: 6-14 people per activity
  - Supervisor assignments: Rotated among 3 supervisors
  - Detailed notes: Describing the work done
  - Some entries with optional fields (no supervisor or staff count)

## How to Use

### Option 1: Run in Supabase Dashboard

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-maintenance-sample-data.sql`
4. Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Option 2: Run via Supabase CLI

```bash
supabase db execute -f supabase-maintenance-sample-data.sql
```

## Prerequisites

Before running the sample data, ensure:

1. ✅ The `maintenance_logs` table exists (run `supabase-maintenance-schema.sql` first)
2. ✅ Staff members exist in the `staff` table (from `supabase-setup-complete.sql`)
3. ✅ The following supervisors exist:
   - Oluwaseun Adeyemi
   - Ngozi Okonkwo
   - Amina Mohammed

## Data Statistics

After running the script, you should see:

- **Total maintenance logs:** ~50 entries
- **Slashing activities:** ~15 entries
- **Pruning activities:** ~12 entries
- **Ring Weeding activities:** ~12 entries
- **Fertilizer Application:** ~11 entries
- **Unique blocks maintained:** ~30+ blocks

## Notes

- The script uses `ON CONFLICT DO NOTHING` to prevent duplicate entries if run multiple times
- Dates are relative to `CURRENT_DATE`, so the data will always be recent
- Some entries intentionally have NULL values for optional fields (supervisor_id, staff_count) to test the optional functionality
- All block IDs match the blocks used in harvest logs for consistency

## Clearing Existing Data

If you want to start fresh, uncomment the `TRUNCATE` line at the top of the SQL file:

```sql
TRUNCATE TABLE maintenance_logs CASCADE;
```

⚠️ **Warning:** This will delete ALL existing maintenance logs!

## Verification

After running the script, you can verify the data was inserted correctly:

```sql
SELECT 
  activity,
  COUNT(*) as count,
  COUNT(DISTINCT block_id) as unique_blocks
FROM maintenance_logs
GROUP BY activity
ORDER BY activity;
```

This will show you the distribution of activities and how many unique blocks have been maintained for each activity type.
