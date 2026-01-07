-- Financial Management Sample Data
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This populates the financial management tables with realistic sample data

-- First, get a user ID to use for created_by fields
-- We'll use the first admin user, or create a placeholder if none exists
DO $$
DECLARE
    admin_user_id UUID;
    cost_cat_fertilizer UUID;
    cost_cat_herbicide UUID;
    cost_cat_fuel UUID;
    cost_cat_labor UUID;
    cost_cat_maintenance UUID;
    cost_cat_transport UUID;
    cost_cat_utilities UUID;
    cost_cat_insurance UUID;
    cost_cat_admin UUID;
    budget_cat_fertilizer UUID;
    budget_cat_protection UUID;
    budget_cat_fuel UUID;
    budget_cat_labor UUID;
    budget_cat_maintenance UUID;
    budget_cat_transport UUID;
    budget_cat_ffb_revenue UUID;
    budget_cat_byproduct_revenue UUID;
    budget_2024_id UUID;
    budget_q1_2024_id UUID;
    budget_q2_2024_id UUID;
    budget_q3_2024_id UUID;
    budget_q4_2024_id UUID;
BEGIN
    -- Get admin user ID (or use a placeholder)
    SELECT id INTO admin_user_id
    FROM users
    WHERE role = 'Admin'
    LIMIT 1;
    
    -- If no admin user exists, we'll need to handle this
    IF admin_user_id IS NULL THEN
        -- Try to get any user
        SELECT id INTO admin_user_id
        FROM users
        LIMIT 1;
        
        -- If still no user, we'll need to create one or use a placeholder UUID
        IF admin_user_id IS NULL THEN
            -- Use a placeholder - in production, ensure users exist first
            admin_user_id := '00000000-0000-0000-0000-000000000001'::UUID;
        END IF;
    END IF;

    -- Get cost category IDs
    SELECT id INTO cost_cat_fertilizer FROM cost_categories WHERE name = 'Fertilizer' LIMIT 1;
    SELECT id INTO cost_cat_herbicide FROM cost_categories WHERE name = 'Herbicide' LIMIT 1;
    SELECT id INTO cost_cat_fuel FROM cost_categories WHERE name = 'Fuel' LIMIT 1;
    SELECT id INTO cost_cat_labor FROM cost_categories WHERE name = 'Labor' LIMIT 1;
    SELECT id INTO cost_cat_maintenance FROM cost_categories WHERE name = 'Maintenance' LIMIT 1;
    SELECT id INTO cost_cat_transport FROM cost_categories WHERE name = 'Transportation' LIMIT 1;
    SELECT id INTO cost_cat_utilities FROM cost_categories WHERE name = 'Utilities' LIMIT 1;
    SELECT id INTO cost_cat_insurance FROM cost_categories WHERE name = 'Insurance' LIMIT 1;
    SELECT id INTO cost_cat_admin FROM cost_categories WHERE name = 'Administrative' LIMIT 1;

    -- Get budget category IDs
    SELECT id INTO budget_cat_fertilizer FROM budget_categories WHERE name = 'Fertilizer & Soil' LIMIT 1;
    SELECT id INTO budget_cat_protection FROM budget_categories WHERE name = 'Crop Protection' LIMIT 1;
    SELECT id INTO budget_cat_fuel FROM budget_categories WHERE name = 'Fuel & Energy' LIMIT 1;
    SELECT id INTO budget_cat_labor FROM budget_categories WHERE name = 'Labor Costs' LIMIT 1;
    SELECT id INTO budget_cat_maintenance FROM budget_categories WHERE name = 'Equipment Maintenance' LIMIT 1;
    SELECT id INTO budget_cat_transport FROM budget_categories WHERE name = 'Transportation' LIMIT 1;
    SELECT id INTO budget_cat_ffb_revenue FROM budget_categories WHERE name = 'FFB Sales Revenue' LIMIT 1;
    SELECT id INTO budget_cat_byproduct_revenue FROM budget_categories WHERE name = 'By-Product Sales' LIMIT 1;

    -- ============================================
    -- INSERT COST ENTRIES (Last 3 months)
    -- ============================================
    
    -- Fertilizer costs (recent)
    INSERT INTO cost_entries (category_id, amount, currency, description, date_incurred, supplier_name, quantity, unit, unit_cost, block_id, reference_number, created_by) VALUES
    (cost_cat_fertilizer, 450000.00, 'NGN', 'NPK 15:15:15 Fertilizer - Block A', CURRENT_DATE - INTERVAL '5 days', 'Agro Supplies Ltd', 150, 'bags', 3000.00, 'Block A', 'INV-2024-001', admin_user_id),
    (cost_cat_fertilizer, 320000.00, 'NGN', 'Urea Fertilizer - Block B', CURRENT_DATE - INTERVAL '12 days', 'Farm Inputs Co', 200, 'bags', 1600.00, 'Block B', 'INV-2024-002', admin_user_id),
    (cost_cat_fertilizer, 280000.00, 'NGN', 'Potassium Sulphate - Block C', CURRENT_DATE - INTERVAL '18 days', 'Agro Supplies Ltd', 100, 'bags', 2800.00, 'Block C', 'INV-2024-003', admin_user_id),
    (cost_cat_fertilizer, 540000.00, 'NGN', 'NPK 12:12:17 - Block D', CURRENT_DATE - INTERVAL '25 days', 'Farm Inputs Co', 180, 'bags', 3000.00, 'Block D', 'INV-2024-004', admin_user_id),
    (cost_cat_fertilizer, 360000.00, 'NGN', 'Organic Compost - Block A', CURRENT_DATE - INTERVAL '32 days', 'Green Farm Solutions', 120, 'bags', 3000.00, 'Block A', 'INV-2024-005', admin_user_id);

    -- Herbicide costs
    INSERT INTO cost_entries (category_id, amount, currency, description, date_incurred, supplier_name, quantity, unit, unit_cost, block_id, reference_number, created_by) VALUES
    (cost_cat_herbicide, 125000.00, 'NGN', 'Roundup Glyphosate - Block A & B', CURRENT_DATE - INTERVAL '7 days', 'ChemAgro Ltd', 50, 'liters', 2500.00, 'Block A', 'INV-2024-006', admin_user_id),
    (cost_cat_herbicide, 98000.00, 'NGN', 'Paraquat Herbicide - Block C', CURRENT_DATE - INTERVAL '15 days', 'ChemAgro Ltd', 35, 'liters', 2800.00, 'Block C', 'INV-2024-007', admin_user_id),
    (cost_cat_herbicide, 156000.00, 'NGN', 'Glyphosate 360 - Block D & E', CURRENT_DATE - INTERVAL '22 days', 'Farm Chemicals Inc', 60, 'liters', 2600.00, 'Block D', 'INV-2024-008', admin_user_id);

    -- Fuel costs (recent)
    INSERT INTO cost_entries (category_id, amount, currency, description, date_incurred, supplier_name, quantity, unit, unit_cost, reference_number, created_by) VALUES
    (cost_cat_fuel, 450000.00, 'NGN', 'Diesel for Tractors and Trucks', CURRENT_DATE - INTERVAL '2 days', 'PetroMax Station', 2000, 'liters', 225.00, 'INV-2024-009', admin_user_id),
    (cost_cat_fuel, 380000.00, 'NGN', 'Diesel Refill - Fleet', CURRENT_DATE - INTERVAL '9 days', 'PetroMax Station', 1688, 'liters', 225.00, 'INV-2024-010', admin_user_id),
    (cost_cat_fuel, 420000.00, 'NGN', 'Diesel Purchase - Monthly', CURRENT_DATE - INTERVAL '16 days', 'PetroMax Station', 1866, 'liters', 225.00, 'INV-2024-011', admin_user_id),
    (cost_cat_fuel, 315000.00, 'NGN', 'Petrol for Motorcycles', CURRENT_DATE - INTERVAL '23 days', 'QuickFill Station', 1500, 'liters', 210.00, 'INV-2024-012', admin_user_id),
    (cost_cat_fuel, 495000.00, 'NGN', 'Diesel Bulk Purchase', CURRENT_DATE - INTERVAL '30 days', 'PetroMax Station', 2200, 'liters', 225.00, 'INV-2024-013', admin_user_id);

    -- Labor costs (monthly wages)
    INSERT INTO cost_entries (category_id, amount, currency, description, date_incurred, supplier_name, reference_number, created_by) VALUES
    (cost_cat_labor, 850000.00, 'NGN', 'Monthly Wages - Field Workers', CURRENT_DATE - INTERVAL '3 days', 'Payroll', 'PAY-2024-001', admin_user_id),
    (cost_cat_labor, 420000.00, 'NGN', 'Supervisor Salaries', CURRENT_DATE - INTERVAL '3 days', 'Payroll', 'PAY-2024-002', admin_user_id),
    (cost_cat_labor, 180000.00, 'NGN', 'Driver Wages', CURRENT_DATE - INTERVAL '3 days', 'Payroll', 'PAY-2024-003', admin_user_id),
    (cost_cat_labor, 850000.00, 'NGN', 'Monthly Wages - Field Workers', CURRENT_DATE - INTERVAL '33 days', 'Payroll', 'PAY-2024-004', admin_user_id),
    (cost_cat_labor, 420000.00, 'NGN', 'Supervisor Salaries', CURRENT_DATE - INTERVAL '33 days', 'Payroll', 'PAY-2024-005', admin_user_id);

    -- Maintenance costs
    INSERT INTO cost_entries (category_id, amount, currency, description, date_incurred, supplier_name, quantity, unit, unit_cost, reference_number, created_by) VALUES
    (cost_cat_maintenance, 85000.00, 'NGN', 'Tractor Engine Repair', CURRENT_DATE - INTERVAL '4 days', 'AutoTech Services', 1, 'service', 85000.00, 'SRV-2024-001', admin_user_id),
    (cost_cat_maintenance, 45000.00, 'NGN', 'Truck Tire Replacement', CURRENT_DATE - INTERVAL '11 days', 'Tire World', 4, 'units', 11250.00, 'SRV-2024-002', admin_user_id),
    (cost_cat_maintenance, 120000.00, 'NGN', 'Tractor Hydraulic System Repair', CURRENT_DATE - INTERVAL '19 days', 'AutoTech Services', 1, 'service', 120000.00, 'SRV-2024-003', admin_user_id),
    (cost_cat_maintenance, 35000.00, 'NGN', 'Oil Change and Filter Replacement', CURRENT_DATE - INTERVAL '26 days', 'Quick Service Center', 3, 'vehicles', 11666.67, 'SRV-2024-004', admin_user_id);

    -- Transportation costs
    INSERT INTO cost_entries (category_id, amount, currency, description, date_incurred, supplier_name, reference_number, created_by) VALUES
    (cost_cat_transport, 180000.00, 'NGN', 'FFB Transport to Mill', CURRENT_DATE - INTERVAL '1 day', 'Fast Logistics', 'TRN-2024-001', admin_user_id),
    (cost_cat_transport, 165000.00, 'NGN', 'FFB Transport - Weekly', CURRENT_DATE - INTERVAL '8 days', 'Fast Logistics', 'TRN-2024-002', admin_user_id),
    (cost_cat_transport, 195000.00, 'NGN', 'FFB Transport Service', CURRENT_DATE - INTERVAL '14 days', 'Fast Logistics', 'TRN-2024-003', admin_user_id),
    (cost_cat_transport, 172000.00, 'NGN', 'FFB Transport to Mill', CURRENT_DATE - INTERVAL '21 days', 'Fast Logistics', 'TRN-2024-004', admin_user_id),
    (cost_cat_transport, 188000.00, 'NGN', 'FFB Transport Service', CURRENT_DATE - INTERVAL '28 days', 'Fast Logistics', 'TRN-2024-005', admin_user_id);

    -- Utilities
    INSERT INTO cost_entries (category_id, amount, currency, description, date_incurred, supplier_name, reference_number, created_by) VALUES
    (cost_cat_utilities, 45000.00, 'NGN', 'Electricity Bill - Office', CURRENT_DATE - INTERVAL '6 days', 'Power Distribution Co', 'UTL-2024-001', admin_user_id),
    (cost_cat_utilities, 12000.00, 'NGN', 'Internet and Phone', CURRENT_DATE - INTERVAL '6 days', 'Telecom Services', 'UTL-2024-002', admin_user_id),
    (cost_cat_utilities, 45000.00, 'NGN', 'Electricity Bill - Office', CURRENT_DATE - INTERVAL '36 days', 'Power Distribution Co', 'UTL-2024-003', admin_user_id);

    -- Insurance
    INSERT INTO cost_entries (category_id, amount, currency, description, date_incurred, supplier_name, reference_number, created_by) VALUES
    (cost_cat_insurance, 250000.00, 'NGN', 'Vehicle Insurance - Quarterly', CURRENT_DATE - INTERVAL '10 days', 'Secure Insurance Ltd', 'INS-2024-001', admin_user_id),
    (cost_cat_insurance, 180000.00, 'NGN', 'Equipment Insurance', CURRENT_DATE - INTERVAL '10 days', 'Secure Insurance Ltd', 'INS-2024-002', admin_user_id);

    -- Administrative costs
    INSERT INTO cost_entries (category_id, amount, currency, description, date_incurred, supplier_name, reference_number, created_by) VALUES
    (cost_cat_admin, 25000.00, 'NGN', 'Office Supplies', CURRENT_DATE - INTERVAL '13 days', 'Office Depot', 'ADM-2024-001', admin_user_id),
    (cost_cat_admin, 150000.00, 'NGN', 'Software License Renewal', CURRENT_DATE - INTERVAL '20 days', 'Tech Solutions Inc', 'ADM-2024-002', admin_user_id),
    (cost_cat_admin, 35000.00, 'NGN', 'Business Registration Renewal', CURRENT_DATE - INTERVAL '27 days', 'Corporate Affairs', 'ADM-2024-003', admin_user_id);

    -- ============================================
    -- INSERT SALES RECORDS (Last 3 months)
    -- ============================================
    
    -- FFB Sales (recent)
    INSERT INTO sales_records (sale_date, buyer_name, buyer_contact, product_type, quantity_sold, unit, unit_price, total_amount, currency, quality_grade, moisture_content, payment_status, payment_received, invoice_number, blocks_involved, created_by) VALUES
    (CURRENT_DATE - INTERVAL '1 day', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 45000.00, 'kg', 85.00, 3825000.00, 'NGN', 'Grade A', 7.2, 'Paid', 3825000.00, 'INV-SALE-2024-001', ARRAY['Block A', 'Block B'], admin_user_id),
    (CURRENT_DATE - INTERVAL '4 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 52000.00, 'kg', 85.00, 4420000.00, 'NGN', 'Grade A', 7.5, 'Paid', 4420000.00, 'INV-SALE-2024-002', ARRAY['Block C', 'Block D'], admin_user_id),
    (CURRENT_DATE - INTERVAL '7 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 48000.00, 'kg', 85.00, 4080000.00, 'NGN', 'Grade A', 7.0, 'Paid', 4080000.00, 'INV-SALE-2024-003', ARRAY['Block A', 'Block E'], admin_user_id),
    (CURRENT_DATE - INTERVAL '10 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 55000.00, 'kg', 85.00, 4675000.00, 'NGN', 'Grade A', 7.3, 'Paid', 4675000.00, 'INV-SALE-2024-004', ARRAY['Block B', 'Block C'], admin_user_id),
    (CURRENT_DATE - INTERVAL '13 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 49000.00, 'kg', 85.00, 4165000.00, 'NGN', 'Grade A', 7.1, 'Paid', 4165000.00, 'INV-SALE-2024-005', ARRAY['Block D', 'Block E'], admin_user_id),
    (CURRENT_DATE - INTERVAL '16 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 53000.00, 'kg', 85.00, 4505000.00, 'NGN', 'Grade A', 7.4, 'Paid', 4505000.00, 'INV-SALE-2024-006', ARRAY['Block A', 'Block B', 'Block C'], admin_user_id),
    (CURRENT_DATE - INTERVAL '19 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 47000.00, 'kg', 85.00, 3995000.00, 'NGN', 'Grade A', 7.2, 'Paid', 3995000.00, 'INV-SALE-2024-007', ARRAY['Block D'], admin_user_id),
    (CURRENT_DATE - INTERVAL '22 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 51000.00, 'kg', 85.00, 4335000.00, 'NGN', 'Grade A', 7.3, 'Paid', 4335000.00, 'INV-SALE-2024-008', ARRAY['Block E', 'Block A'], admin_user_id),
    (CURRENT_DATE - INTERVAL '25 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 46000.00, 'kg', 85.00, 3910000.00, 'NGN', 'Grade A', 7.0, 'Paid', 3910000.00, 'INV-SALE-2024-009', ARRAY['Block B', 'Block C'], admin_user_id),
    (CURRENT_DATE - INTERVAL '28 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 54000.00, 'kg', 85.00, 4590000.00, 'NGN', 'Grade A', 7.5, 'Paid', 4590000.00, 'INV-SALE-2024-010', ARRAY['Block D', 'Block E'], admin_user_id),
    (CURRENT_DATE - INTERVAL '31 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 50000.00, 'kg', 85.00, 4250000.00, 'NGN', 'Grade A', 7.2, 'Paid', 4250000.00, 'INV-SALE-2024-011', ARRAY['Block A', 'Block B', 'Block C'], admin_user_id),
    (CURRENT_DATE - INTERVAL '34 days', 'Palm Oil Mill Ltd', '+234-801-234-5678', 'FFB', 48000.00, 'kg', 85.00, 4080000.00, 'NGN', 'Grade A', 7.1, 'Paid', 4080000.00, 'INV-SALE-2024-012', ARRAY['Block D'], admin_user_id);

    -- By-Product Sales (CPO and PK)
    INSERT INTO sales_records (sale_date, buyer_name, buyer_contact, product_type, quantity_sold, unit, unit_price, total_amount, currency, quality_grade, payment_status, payment_received, invoice_number, created_by) VALUES
    (CURRENT_DATE - INTERVAL '3 days', 'Cooking Oil Manufacturers', '+234-802-345-6789', 'CPO', 5000.00, 'kg', 450.00, 2250000.00, 'NGN', 'Standard', 'Paid', 2250000.00, 'INV-SALE-2024-013', admin_user_id),
    (CURRENT_DATE - INTERVAL '6 days', 'Cooking Oil Manufacturers', '+234-802-345-6789', 'CPO', 4800.00, 'kg', 450.00, 2160000.00, 'NGN', 'Standard', 'Paid', 2160000.00, 'INV-SALE-2024-014', admin_user_id),
    (CURRENT_DATE - INTERVAL '9 days', 'Animal Feed Producers', '+234-803-456-7890', 'PK', 2000.00, 'kg', 180.00, 360000.00, 'NGN', 'Standard', 'Paid', 360000.00, 'INV-SALE-2024-015', admin_user_id),
    (CURRENT_DATE - INTERVAL '12 days', 'Cooking Oil Manufacturers', '+234-802-345-6789', 'CPO', 5200.00, 'kg', 450.00, 2340000.00, 'NGN', 'Standard', 'Paid', 2340000.00, 'INV-SALE-2024-016', admin_user_id),
    (CURRENT_DATE - INTERVAL '15 days', 'Animal Feed Producers', '+234-803-456-7890', 'PK', 1800.00, 'kg', 180.00, 324000.00, 'NGN', 'Standard', 'Paid', 324000.00, 'INV-SALE-2024-017', admin_user_id),
    (CURRENT_DATE - INTERVAL '18 days', 'Cooking Oil Manufacturers', '+234-802-345-6789', 'CPO', 4900.00, 'kg', 450.00, 2205000.00, 'NGN', 'Standard', 'Paid', 2205000.00, 'INV-SALE-2024-018', admin_user_id),
    (CURRENT_DATE - INTERVAL '24 days', 'Animal Feed Producers', '+234-803-456-7890', 'PK', 2200.00, 'kg', 180.00, 396000.00, 'NGN', 'Standard', 'Paid', 396000.00, 'INV-SALE-2024-019', admin_user_id),
    (CURRENT_DATE - INTERVAL '30 days', 'Cooking Oil Manufacturers', '+234-802-345-6789', 'CPO', 5100.00, 'kg', 450.00, 2295000.00, 'NGN', 'Standard', 'Partial', 1500000.00, 'INV-SALE-2024-020', admin_user_id);

    -- ============================================
    -- CREATE BUDGETS FOR 2024
    -- ============================================
    
    -- Annual Budget 2024
    INSERT INTO budgets (name, description, budget_year, start_date, end_date, total_budget, currency, status, created_by)
    VALUES ('2024 Annual Operating Budget', 'Complete annual budget for palm plantation operations', 2024, '2024-01-01', '2024-12-31', 25000000.00, 'NGN', 'Active', admin_user_id)
    RETURNING id INTO budget_2024_id;

    -- Q1 2024 Budget
    INSERT INTO budgets (name, description, budget_year, budget_quarter, start_date, end_date, total_budget, currency, status, created_by)
    VALUES ('Q1 2024 Budget', 'First quarter budget', 2024, 1, '2024-01-01', '2024-03-31', 6250000.00, 'NGN', 'Active', admin_user_id)
    RETURNING id INTO budget_q1_2024_id;

    -- Q2 2024 Budget
    INSERT INTO budgets (name, description, budget_year, budget_quarter, start_date, end_date, total_budget, currency, status, created_by)
    VALUES ('Q2 2024 Budget', 'Second quarter budget', 2024, 2, '2024-04-01', '2024-06-30', 6250000.00, 'NGN', 'Active', admin_user_id)
    RETURNING id INTO budget_q2_2024_id;

    -- Q3 2024 Budget
    INSERT INTO budgets (name, description, budget_year, budget_quarter, start_date, end_date, total_budget, currency, status, created_by)
    VALUES ('Q3 2024 Budget', 'Third quarter budget', 2024, 3, '2024-07-01', '2024-09-30', 6250000.00, 'NGN', 'Active', admin_user_id)
    RETURNING id INTO budget_q3_2024_id;

    -- Q4 2024 Budget
    INSERT INTO budgets (name, description, budget_year, budget_quarter, start_date, end_date, total_budget, currency, status, created_by)
    VALUES ('Q4 2024 Budget', 'Fourth quarter budget', 2024, 4, '2024-10-01', '2024-12-31', 6250000.00, 'NGN', 'Active', admin_user_id)
    RETURNING id INTO budget_q4_2024_id;

    -- ============================================
    -- INSERT BUDGET ITEMS FOR ANNUAL BUDGET
    -- ============================================
    
    -- Cost budget items
    INSERT INTO budget_items (budget_id, budget_category_id, cost_category_id, planned_amount, allocated_amount, block_id, notes) VALUES
    (budget_2024_id, budget_cat_fertilizer, cost_cat_fertilizer, 3500000.00, 3500000.00, NULL, 'Annual fertilizer budget'),
    (budget_2024_id, budget_cat_protection, cost_cat_herbicide, 1200000.00, 1200000.00, NULL, 'Herbicide and pest control'),
    (budget_2024_id, budget_cat_fuel, cost_cat_fuel, 4800000.00, 4800000.00, NULL, 'Diesel and fuel costs'),
    (budget_2024_id, budget_cat_labor, cost_cat_labor, 7200000.00, 7200000.00, NULL, 'Worker wages and salaries'),
    (budget_2024_id, budget_cat_maintenance, cost_cat_maintenance, 1800000.00, 1800000.00, NULL, 'Equipment maintenance'),
    (budget_2024_id, budget_cat_transport, cost_cat_transport, 2400000.00, 2400000.00, NULL, 'FFB transport costs'),
    (budget_2024_id, budget_cat_fertilizer, cost_cat_utilities, 540000.00, 540000.00, NULL, 'Utilities and services'),
    (budget_2024_id, budget_cat_fertilizer, cost_cat_insurance, 860000.00, 860000.00, NULL, 'Insurance premiums'),
    (budget_2024_id, budget_cat_fertilizer, cost_cat_admin, 420000.00, 420000.00, NULL, 'Administrative costs');

    -- Revenue budget items
    INSERT INTO budget_items (budget_id, budget_category_id, cost_category_id, planned_amount, allocated_amount, block_id, notes) VALUES
    (budget_2024_id, budget_cat_ffb_revenue, NULL, 45000000.00, 45000000.00, NULL, 'Expected FFB sales revenue'),
    (budget_2024_id, budget_cat_byproduct_revenue, NULL, 18000000.00, 18000000.00, NULL, 'CPO and PK sales revenue');

    -- ============================================
    -- INSERT BUDGET ITEMS FOR Q1 2024
    -- ============================================
    
    INSERT INTO budget_items (budget_id, budget_category_id, cost_category_id, planned_amount, allocated_amount, block_id, notes) VALUES
    (budget_q1_2024_id, budget_cat_fertilizer, cost_cat_fertilizer, 875000.00, 875000.00, NULL, 'Q1 fertilizer budget'),
    (budget_q1_2024_id, budget_cat_protection, cost_cat_herbicide, 300000.00, 300000.00, NULL, 'Q1 herbicide budget'),
    (budget_q1_2024_id, budget_cat_fuel, cost_cat_fuel, 1200000.00, 1200000.00, NULL, 'Q1 fuel budget'),
    (budget_q1_2024_id, budget_cat_labor, cost_cat_labor, 1800000.00, 1800000.00, NULL, 'Q1 labor budget'),
    (budget_q1_2024_id, budget_cat_maintenance, cost_cat_maintenance, 450000.00, 450000.00, NULL, 'Q1 maintenance budget'),
    (budget_q1_2024_id, budget_cat_transport, cost_cat_transport, 600000.00, 600000.00, NULL, 'Q1 transport budget'),
    (budget_q1_2024_id, budget_cat_ffb_revenue, NULL, 11250000.00, 11250000.00, NULL, 'Q1 FFB revenue target'),
    (budget_q1_2024_id, budget_cat_byproduct_revenue, NULL, 4500000.00, 4500000.00, NULL, 'Q1 by-product revenue target');

    -- ============================================
    -- INSERT BUDGET ITEMS FOR Q2 2024
    -- ============================================
    
    INSERT INTO budget_items (budget_id, budget_category_id, cost_category_id, planned_amount, allocated_amount, block_id, notes) VALUES
    (budget_q2_2024_id, budget_cat_fertilizer, cost_cat_fertilizer, 875000.00, 875000.00, NULL, 'Q2 fertilizer budget'),
    (budget_q2_2024_id, budget_cat_protection, cost_cat_herbicide, 300000.00, 300000.00, NULL, 'Q2 herbicide budget'),
    (budget_q2_2024_id, budget_cat_fuel, cost_cat_fuel, 1200000.00, 1200000.00, NULL, 'Q2 fuel budget'),
    (budget_q2_2024_id, budget_cat_labor, cost_cat_labor, 1800000.00, 1800000.00, NULL, 'Q2 labor budget'),
    (budget_q2_2024_id, budget_cat_maintenance, cost_cat_maintenance, 450000.00, 450000.00, NULL, 'Q2 maintenance budget'),
    (budget_q2_2024_id, budget_cat_transport, cost_cat_transport, 600000.00, 600000.00, NULL, 'Q2 transport budget'),
    (budget_q2_2024_id, budget_cat_ffb_revenue, NULL, 11250000.00, 11250000.00, NULL, 'Q2 FFB revenue target'),
    (budget_q2_2024_id, budget_cat_byproduct_revenue, NULL, 4500000.00, 4500000.00, NULL, 'Q2 by-product revenue target');

    -- ============================================
    -- INSERT BUDGET ITEMS FOR Q3 2024
    -- ============================================
    
    INSERT INTO budget_items (budget_id, budget_category_id, cost_category_id, planned_amount, allocated_amount, block_id, notes) VALUES
    (budget_q3_2024_id, budget_cat_fertilizer, cost_cat_fertilizer, 875000.00, 875000.00, NULL, 'Q3 fertilizer budget'),
    (budget_q3_2024_id, budget_cat_protection, cost_cat_herbicide, 300000.00, 300000.00, NULL, 'Q3 herbicide budget'),
    (budget_q3_2024_id, budget_cat_fuel, cost_cat_fuel, 1200000.00, 1200000.00, NULL, 'Q3 fuel budget'),
    (budget_q3_2024_id, budget_cat_labor, cost_cat_labor, 1800000.00, 1800000.00, NULL, 'Q3 labor budget'),
    (budget_q3_2024_id, budget_cat_maintenance, cost_cat_maintenance, 450000.00, 450000.00, NULL, 'Q3 maintenance budget'),
    (budget_q3_2024_id, budget_cat_transport, cost_cat_transport, 600000.00, 600000.00, NULL, 'Q3 transport budget'),
    (budget_q3_2024_id, budget_cat_ffb_revenue, NULL, 11250000.00, 11250000.00, NULL, 'Q3 FFB revenue target'),
    (budget_q3_2024_id, budget_cat_byproduct_revenue, NULL, 4500000.00, 4500000.00, NULL, 'Q3 by-product revenue target');

    -- ============================================
    -- INSERT BUDGET ITEMS FOR Q4 2024
    -- ============================================
    
    INSERT INTO budget_items (budget_id, budget_category_id, cost_category_id, planned_amount, allocated_amount, block_id, notes) VALUES
    (budget_q4_2024_id, budget_cat_fertilizer, cost_cat_fertilizer, 875000.00, 875000.00, NULL, 'Q4 fertilizer budget'),
    (budget_q4_2024_id, budget_cat_protection, cost_cat_herbicide, 300000.00, 300000.00, NULL, 'Q4 herbicide budget'),
    (budget_q4_2024_id, budget_cat_fuel, cost_cat_fuel, 1200000.00, 1200000.00, NULL, 'Q4 fuel budget'),
    (budget_q4_2024_id, budget_cat_labor, cost_cat_labor, 1800000.00, 1800000.00, NULL, 'Q4 labor budget'),
    (budget_q4_2024_id, budget_cat_maintenance, cost_cat_maintenance, 450000.00, 450000.00, NULL, 'Q4 maintenance budget'),
    (budget_q4_2024_id, budget_cat_transport, cost_cat_transport, 600000.00, 600000.00, NULL, 'Q4 transport budget'),
    (budget_q4_2024_id, budget_cat_ffb_revenue, NULL, 11250000.00, 11250000.00, NULL, 'Q4 FFB revenue target'),
    (budget_q4_2024_id, budget_cat_byproduct_revenue, NULL, 4500000.00, 4500000.00, NULL, 'Q4 by-product revenue target');

END $$;

-- Display summary
SELECT 
    'Cost Entries' as table_name,
    COUNT(*) as record_count,
    SUM(amount) as total_amount
FROM cost_entries
WHERE deleted_at IS NULL
UNION ALL
SELECT 
    'Sales Records' as table_name,
    COUNT(*) as record_count,
    SUM(total_amount) as total_amount
FROM sales_records
WHERE deleted_at IS NULL
UNION ALL
SELECT 
    'Budgets' as table_name,
    COUNT(*) as record_count,
    SUM(total_budget) as total_amount
FROM budgets
WHERE deleted_at IS NULL
UNION ALL
SELECT 
    'Budget Items' as table_name,
    COUNT(*) as record_count,
    SUM(planned_amount) as total_amount
FROM budget_items;
