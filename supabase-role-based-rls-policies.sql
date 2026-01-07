-- Role-Based Row Level Security (RLS) Policies
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This replaces the overly permissive "USING (true)" policies with role-based access control

-- ============================================
-- FINANCIAL MANAGEMENT TABLES
-- ============================================

-- Cost Categories: Only Admins can manage
DROP POLICY IF EXISTS "Allow all for authenticated users" ON cost_categories;
CREATE POLICY "Admins can manage cost categories" ON cost_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );

-- Cost Entries: Admins can manage, Operators can view
DROP POLICY IF EXISTS "Allow all for authenticated users" ON cost_entries;
CREATE POLICY "Admins can manage cost entries" ON cost_entries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );
CREATE POLICY "Operators can view cost entries" ON cost_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role IN ('Admin', 'Operator')
            AND users.deleted_at IS NULL
        )
    );

-- Sales Records: Admins can manage, Operators can view
DROP POLICY IF EXISTS "Allow all for authenticated users" ON sales_records;
CREATE POLICY "Admins can manage sales records" ON sales_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );
CREATE POLICY "Operators can view sales records" ON sales_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role IN ('Admin', 'Operator')
            AND users.deleted_at IS NULL
        )
    );

-- Budget Categories: Only Admins can manage
DROP POLICY IF EXISTS "Allow all for authenticated users" ON budget_categories;
CREATE POLICY "Admins can manage budget categories" ON budget_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );

-- Budgets: Admins can manage, Operators can view
DROP POLICY IF EXISTS "Allow all for authenticated users" ON budgets;
CREATE POLICY "Admins can manage budgets" ON budgets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );
CREATE POLICY "Operators can view budgets" ON budgets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role IN ('Admin', 'Operator')
            AND users.deleted_at IS NULL
        )
    );

-- Budget Items: Admins can manage, Operators can view
DROP POLICY IF EXISTS "Allow all for authenticated users" ON budget_items;
CREATE POLICY "Admins can manage budget items" ON budget_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );
CREATE POLICY "Operators can view budget items" ON budget_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role IN ('Admin', 'Operator')
            AND users.deleted_at IS NULL
        )
    );

-- Financial Reports: Admins can manage, Operators can view
DROP POLICY IF EXISTS "Allow all for authenticated users" ON financial_reports;
CREATE POLICY "Admins can manage financial reports" ON financial_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );
CREATE POLICY "Operators can view financial reports" ON financial_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role IN ('Admin', 'Operator')
            AND users.deleted_at IS NULL
        )
    );

-- ============================================
-- CORE OPERATIONAL TABLES
-- ============================================

-- Inventory Items: All authenticated users can view, Admins can manage
DROP POLICY IF EXISTS "Allow all for authenticated users" ON inventory_items;
CREATE POLICY "Authenticated users can view inventory" ON inventory_items
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage inventory" ON inventory_items
    FOR INSERT, UPDATE, DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );

-- Vehicles: All authenticated users can view, Admins can manage
DROP POLICY IF EXISTS "Allow all for authenticated users" ON vehicles;
CREATE POLICY "Authenticated users can view vehicles" ON vehicles
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage vehicles" ON vehicles
    FOR INSERT, UPDATE, DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );

-- Staff: All authenticated users can view, Admins can manage
DROP POLICY IF EXISTS "Allow all for authenticated users" ON staff;
CREATE POLICY "Authenticated users can view staff" ON staff
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage staff" ON staff
    FOR INSERT, UPDATE, DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );

-- Harvest Logs: All authenticated users can view and create, Admins can manage
DROP POLICY IF EXISTS "Allow all for authenticated users" ON harvest_logs;
CREATE POLICY "Authenticated users can view and create harvest logs" ON harvest_logs
    FOR SELECT, INSERT USING (true);
CREATE POLICY "Admins can manage harvest logs" ON harvest_logs
    FOR UPDATE, DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND users.role = 'Admin'
            AND users.deleted_at IS NULL
        )
    );

-- Maintenance Logs: All authenticated users can view and create, Admins can manage
-- Note: If maintenance_logs table exists, update its policies
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'maintenance_logs') THEN
        DROP POLICY IF EXISTS "Allow all for authenticated users" ON maintenance_logs;
        CREATE POLICY "Authenticated users can view and create maintenance logs" ON maintenance_logs
            FOR SELECT, INSERT USING (true);
        CREATE POLICY "Admins can manage maintenance logs" ON maintenance_logs
            FOR UPDATE, DELETE USING (
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
                    AND users.role = 'Admin'
                    AND users.deleted_at IS NULL
                )
            );
    END IF;
END $$;

-- Users: Only Admins can view and manage
DROP POLICY IF EXISTS "Allow all for authenticated users" ON users;
CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND u.role = 'Admin'
            AND u.deleted_at IS NULL
        )
    );
-- Allow users to view their own record
CREATE POLICY "Users can view own record" ON users
    FOR SELECT USING (
        id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    );

-- Audit Logs: Only Admins can view
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        DROP POLICY IF EXISTS "Allow all for authenticated users" ON audit_logs;
        CREATE POLICY "Admins can view audit logs" ON audit_logs
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
                    AND users.role = 'Admin'
                    AND users.deleted_at IS NULL
                )
            );
        -- Allow system to insert audit logs (this is handled by service role key in API)
        CREATE POLICY "System can insert audit logs" ON audit_logs
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- ============================================
-- NOTES
-- ============================================

-- These policies use JWT claims from NextAuth
-- The user ID is stored in the JWT token's 'sub' claim
-- Policies check the users table to verify role

-- IMPORTANT: These policies work with NextAuth JWT tokens
-- If you're using Supabase Auth instead, you'll need to adjust the policy conditions

-- To test policies:
-- 1. Login as Admin - should have full access
-- 2. Login as Operator - should have read-only access to financial data
-- 3. Login as Support - should have limited access
