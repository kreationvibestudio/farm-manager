# Platform Reset Script

This SQL script removes all sample data from the platform while keeping the system structure intact. Use this to reset your platform to a clean state for production use.

## ⚠️ WARNING

This script will delete **ALL** data from operational tables. Make sure you:
- Have a backup if needed
- Have at least one Admin user account to log in after reset
- Understand that this action cannot be undone

## What Gets Preserved

- ✅ Table structures, constraints, indexes, and triggers
- ✅ Users table (make sure you have at least one Admin user)
- ✅ Cost categories and Budget categories (reference data)
- ✅ All database schema and functions

## What Gets Deleted

- ❌ All staff members
- ❌ All vehicles
- ❌ All inventory items
- ❌ All harvest logs
- ❌ All maintenance logs
- ❌ All financial data (cost entries, sales records, budgets, budget items)
- ❌ All audit logs
- ❌ All vehicle GPS tracking data

## How to Use

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the SQL script below
3. Review the tables that will be cleared
4. Click **Run** to execute
5. Verify the counts at the end (should all be 0 except users)

## SQL Script

```sql
-- ============================================
-- PLATFORM RESET SCRIPT
-- Removes all sample data, keeps system structure
-- ============================================
-- ⚠️ WARNING: This will delete ALL data from operational tables
-- ⚠️ This script preserves:
--   - Table structures, constraints, indexes
--   - Users (you may want to keep at least one admin user)
--   - Cost categories and Budget categories (reference data)
-- ⚠️ This script deletes:
--   - All staff members
--   - All vehicles
--   - All inventory items
--   - All harvest logs
--   - All maintenance logs
--   - All financial data (costs, sales, budgets)
--   - All audit logs
--   - All vehicle GPS tracking data
-- ============================================

BEGIN;

-- ============================================
-- 1. DELETE OPERATIONAL DATA
-- ============================================

-- Delete all harvest logs
DELETE FROM harvest_logs;

-- Delete all maintenance logs
DELETE FROM maintenance_logs;

-- Delete all inventory items
DELETE FROM inventory_items;

-- Delete all vehicles
DELETE FROM vehicles;

-- Delete all staff (soft-deleted and active)
-- Note: This will also delete via CASCADE any related records
DELETE FROM staff;

-- ============================================
-- 2. DELETE FINANCIAL DATA
-- ============================================

-- Delete budget items first (has foreign key to budgets)
DELETE FROM budget_items;

-- Delete budgets
DELETE FROM budgets;

-- Delete cost entries
DELETE FROM cost_entries;

-- Delete sales records
DELETE FROM sales_records;

-- Note: Cost categories and Budget categories are kept as reference data
-- If you want to delete them too, uncomment the following:
-- DELETE FROM cost_categories;
-- DELETE FROM budget_categories;

-- ============================================
-- 3. DELETE TRACKING AND AUDIT DATA
-- ============================================

-- Delete vehicle GPS tracking data (if table exists)
DELETE FROM vehicle_locations;

-- Delete all audit logs
DELETE FROM audit_logs;

-- ============================================
-- 4. RESET SEQUENCES (if any)
-- ============================================
-- Note: UUIDs don't use sequences, but if you have any serial columns, reset them here

-- ============================================
-- 5. VERIFY DELETION
-- ============================================

-- Show counts to verify (should all be 0)
SELECT 
    'staff' AS table_name, COUNT(*) AS remaining_records FROM staff
UNION ALL
SELECT 'vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'inventory_items', COUNT(*) FROM inventory_items
UNION ALL
SELECT 'harvest_logs', COUNT(*) FROM harvest_logs
UNION ALL
SELECT 'maintenance_logs', COUNT(*) FROM maintenance_logs
UNION ALL
SELECT 'cost_entries', COUNT(*) FROM cost_entries
UNION ALL
SELECT 'sales_records', COUNT(*) FROM sales_records
UNION ALL
SELECT 'budgets', COUNT(*) FROM budgets
UNION ALL
SELECT 'budget_items', COUNT(*) FROM budget_items
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs;

-- Show user count (should have at least 1 admin user)
SELECT 
    'users' AS table_name, 
    COUNT(*) AS total_users,
    COUNT(*) FILTER (WHERE role = 'Admin') AS admin_users
FROM users
WHERE deleted_at IS NULL;

COMMIT;

-- ============================================
-- NOTES:
-- ============================================
-- 1. After running this script, you'll have a clean platform ready for production use
-- 2. Make sure you have at least one Admin user to log in
-- 3. Cost categories and Budget categories are preserved (they're reference data)
--    If you want to delete them too, uncomment the DELETE statements above
-- 4. All table structures, constraints, indexes, and triggers remain intact
-- 5. You can now start adding real data through the application
```

## After Running the Script

1. **Verify the reset**: Check the counts at the end - all should be 0 except users
2. **Check your admin user**: Make sure you have at least one Admin user account
3. **Start fresh**: You can now begin adding real data through the application interface

## Optional: Delete Reference Categories

If you also want to delete cost categories and budget categories (reference data), uncomment these lines in the script:

```sql
DELETE FROM cost_categories;
DELETE FROM budget_categories;
```

## Troubleshooting

- **Foreign key errors**: If you get foreign key constraint errors, the script handles dependencies by deleting in the correct order
- **No admin user**: If you accidentally delete all users, you'll need to create a new admin user using the `add-admin-user.js` script or manually in Supabase
- **Transaction rollback**: The script uses BEGIN/COMMIT, so if something fails, you can rollback

## Related Scripts

- `supabase-sample-data.sql` - To repopulate with sample data for testing
- `supabase-financial-sample-data.sql` - To add financial sample data
- `supabase-maintenance-sample-data.sql` - To add maintenance sample data
