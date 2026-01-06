-- Financial Management Database Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This adds financial management capabilities to the existing farm manager

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cost Categories Table (Fertilizer, Labor, Fuel, Maintenance, etc.)
CREATE TABLE IF NOT EXISTS cost_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_category_id UUID REFERENCES cost_categories(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cost Entries Table (Individual cost transactions)
CREATE TABLE IF NOT EXISTS cost_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES cost_categories(id),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'NGN',
  description TEXT NOT NULL,
  date_incurred DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_number TEXT, -- Invoice number, receipt number, etc.
  supplier_name TEXT,
  quantity DECIMAL(10,2),
  unit TEXT,
  unit_cost DECIMAL(10,2),

  -- Related entities (optional)
  inventory_item_id UUID REFERENCES inventory_items(id),
  vehicle_id UUID REFERENCES vehicles(id),
  staff_id UUID REFERENCES staff(id),
  harvest_log_id UUID REFERENCES harvest_logs(id),
  maintenance_log_id UUID REFERENCES maintenance_logs(id),

  -- Block/Location information
  block_id TEXT,
  notes TEXT,

  -- Audit fields
  created_by UUID NOT NULL,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID
);

-- Sales Records Table (FFB sales, by-products, etc.)
CREATE TABLE IF NOT EXISTS sales_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  buyer_name TEXT NOT NULL,
  buyer_contact TEXT,
  product_type TEXT NOT NULL DEFAULT 'FFB', -- FFB, CPO, PK, etc.
  quantity_sold DECIMAL(12,2) NOT NULL CHECK (quantity_sold > 0),
  unit TEXT NOT NULL DEFAULT 'kg',
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
  total_amount DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',

  -- Quality information
  quality_grade TEXT,
  moisture_content DECIMAL(5,2),
  foreign_matter DECIMAL(5,2),

  -- Related harvest data
  harvest_log_ids UUID[], -- Array of related harvest log IDs
  total_ffb_bunches INTEGER,
  average_bunch_weight DECIMAL(8,2),

  -- Transportation costs (if applicable)
  transport_cost DECIMAL(10,2),
  transport_supplier TEXT,

  -- Payment information
  payment_terms TEXT,
  payment_due_date DATE,
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Partial', 'Paid', 'Overdue')),
  payment_received DECIMAL(12,2) DEFAULT 0,

  -- Block information
  blocks_involved TEXT[], -- Array of block IDs

  -- Notes and reference
  invoice_number TEXT,
  delivery_note TEXT,
  notes TEXT,

  -- Audit fields
  created_by UUID NOT NULL,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID
);

-- Budget Categories Table (links to cost categories but with budget-specific structure)
CREATE TABLE IF NOT EXISTS budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category_type TEXT NOT NULL CHECK (category_type IN ('Cost', 'Revenue', 'Investment')),
  parent_category_id UUID REFERENCES budget_categories(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets Table (Annual, quarterly budgets)
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  budget_year INTEGER NOT NULL,
  budget_quarter INTEGER CHECK (budget_quarter BETWEEN 1 AND 4),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget DECIMAL(15,2) NOT NULL CHECK (total_budget > 0),
  currency TEXT NOT NULL DEFAULT 'NGN',

  -- Status and approval
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Active', 'Closed')),
  submitted_by UUID,
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,

  -- Notes
  notes TEXT,

  -- Audit fields
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID,

  CONSTRAINT valid_date_range CHECK (end_date >= start_date),
  CONSTRAINT valid_quarter CHECK (budget_quarter IS NULL OR (budget_quarter BETWEEN 1 AND 4))
);

-- Budget Items Table (Line items within budgets)
CREATE TABLE IF NOT EXISTS budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  budget_category_id UUID NOT NULL REFERENCES budget_categories(id),
  cost_category_id UUID REFERENCES cost_categories(id), -- Link to actual cost categories

  -- Budget amounts
  planned_amount DECIMAL(12,2) NOT NULL CHECK (planned_amount >= 0),
  allocated_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (allocated_amount >= 0),

  -- Actual spending (calculated from cost_entries)
  actual_spent DECIMAL(12,2) NOT NULL DEFAULT 0,

  -- Block or department allocation
  block_id TEXT,
  department TEXT,

  -- Notes
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Reports Table (Saved reports and configurations)
CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL CHECK (report_type IN ('ProfitLoss', 'BudgetVariance', 'CostAnalysis', 'RevenueAnalysis', 'CashFlow')),

  -- Date range
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Filters
  filters JSONB, -- Store complex filter criteria

  -- Report data (generated)
  report_data JSONB,
  generated_at TIMESTAMP WITH TIME ZONE,
  generated_by UUID,

  -- Access control
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID,

  CONSTRAINT valid_report_date_range CHECK (end_date >= start_date)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cost_entries_category_id ON cost_entries(category_id);
CREATE INDEX IF NOT EXISTS idx_cost_entries_date_incurred ON cost_entries(date_incurred);
CREATE INDEX IF NOT EXISTS idx_cost_entries_inventory_item_id ON cost_entries(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_cost_entries_vehicle_id ON cost_entries(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_cost_entries_block_id ON cost_entries(block_id);
CREATE INDEX IF NOT EXISTS idx_cost_entries_deleted_at ON cost_entries(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_sales_records_sale_date ON sales_records(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_records_buyer_name ON sales_records(buyer_name);
CREATE INDEX IF NOT EXISTS idx_sales_records_payment_status ON sales_records(payment_status);
CREATE INDEX IF NOT EXISTS idx_sales_records_deleted_at ON sales_records(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_budgets_budget_year ON budgets(budget_year);
CREATE INDEX IF NOT EXISTS idx_budgets_status ON budgets(status);
CREATE INDEX IF NOT EXISTS idx_budgets_date_range ON budgets(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_budgets_deleted_at ON budgets(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_budget_items_budget_id ON budget_items(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_category_id ON budget_items(budget_category_id);

CREATE INDEX IF NOT EXISTS idx_financial_reports_type ON financial_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_financial_reports_date_range ON financial_reports(start_date, end_date);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_cost_categories_updated_at ON cost_categories;
DROP TRIGGER IF EXISTS update_cost_entries_updated_at ON cost_entries;
DROP TRIGGER IF EXISTS update_sales_records_updated_at ON sales_records;
DROP TRIGGER IF EXISTS update_budget_categories_updated_at ON budget_categories;
DROP TRIGGER IF EXISTS update_budgets_updated_at ON budgets;
DROP TRIGGER IF EXISTS update_budget_items_updated_at ON budget_items;
DROP TRIGGER IF EXISTS update_financial_reports_updated_at ON financial_reports;

CREATE TRIGGER update_cost_categories_updated_at BEFORE UPDATE ON cost_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_entries_updated_at BEFORE UPDATE ON cost_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_records_updated_at BEFORE UPDATE ON sales_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON budget_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON budget_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_reports_updated_at BEFORE UPDATE ON financial_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE cost_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all for authenticated users" ON cost_categories;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON cost_entries;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON sales_records;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON budget_categories;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON budgets;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON budget_items;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON financial_reports;

-- Create policies (allow all for authenticated users - customize based on your security needs)
CREATE POLICY "Allow all for authenticated users" ON cost_categories
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON cost_entries
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON sales_records
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON budget_categories
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON budgets
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON budget_items
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON financial_reports
    FOR ALL USING (true);

-- Insert sample cost categories
INSERT INTO cost_categories (name, description) VALUES
  ('Fertilizer', 'NPK, organic fertilizers, and soil amendments'),
  ('Herbicide', 'Weed control chemicals and applications'),
  ('Fuel', 'Diesel, petrol for vehicles and equipment'),
  ('Labor', 'Worker wages, supervisor salaries, overtime'),
  ('Maintenance', 'Equipment repair, spare parts, servicing'),
  ('Transportation', 'FFB transport, supplier deliveries'),
  ('Utilities', 'Electricity, water, communications'),
  ('Insurance', 'Vehicle, equipment, and liability insurance'),
  ('Administrative', 'Office supplies, software, licenses'),
  ('Other', 'Miscellaneous operational costs')
ON CONFLICT (name) DO NOTHING;

-- Insert sample budget categories
INSERT INTO budget_categories (name, description, category_type) VALUES
  ('Fertilizer & Soil', 'Fertilizers, soil amendments, and related costs', 'Cost'),
  ('Crop Protection', 'Herbicides, pesticides, and pest control', 'Cost'),
  ('Fuel & Energy', 'Diesel, electricity, and energy costs', 'Cost'),
  ('Labor Costs', 'Worker wages, salaries, and benefits', 'Cost'),
  ('Equipment Maintenance', 'Repairs, spare parts, and servicing', 'Cost'),
  ('Transportation', 'FFB transport and logistics', 'Cost'),
  ('FFB Sales Revenue', 'Fresh Fruit Bunch sales income', 'Revenue'),
  ('By-Product Sales', 'CPO, PK, and other by-product revenue', 'Revenue'),
  ('Capital Investments', 'New equipment, buildings, and major investments', 'Investment'),
  ('Administrative', 'Office, management, and overhead costs', 'Cost')
ON CONFLICT DO NOTHING;

-- Insert sample budget for current year
INSERT INTO budgets (name, description, budget_year, start_date, end_date, total_budget, currency, status, created_by)
SELECT
  '2024 Operational Budget',
  'Annual operational budget for palm plantation',
  2024,
  '2024-01-01',
  '2024-12-31',
  2500000.00,
  'NGN',
  'Active',
  id
FROM users
WHERE role = 'Admin'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Create function to calculate budget item actual spending
CREATE OR REPLACE FUNCTION calculate_budget_item_actual_spent(budget_item_id UUID)
RETURNS DECIMAL(12,2) AS $$
DECLARE
    total_spent DECIMAL(12,2) := 0;
    budget_item_record RECORD;
BEGIN
    -- Get budget item details
    SELECT * INTO budget_item_record FROM budget_items WHERE id = budget_item_id;

    -- Calculate actual spending based on cost entries linked to the cost category
    SELECT COALESCE(SUM(amount), 0) INTO total_spent
    FROM cost_entries
    WHERE cost_category_id = budget_item_record.cost_category_id
      AND date_incurred BETWEEN (
        SELECT start_date FROM budgets WHERE id = budget_item_record.budget_id
      ) AND (
        SELECT end_date FROM budgets WHERE id = budget_item_record.budget_id
      )
      AND deleted_at IS NULL;

    RETURN total_spent;
END;
$$ LANGUAGE plpgsql;

-- Create function to update budget item actual spending
CREATE OR REPLACE FUNCTION update_budget_item_actual_spent()
RETURNS TRIGGER AS $$
BEGIN
    -- Update actual_spent for all budget items affected by this cost entry
    UPDATE budget_items
    SET actual_spent = calculate_budget_item_actual_spent(id),
        updated_at = NOW()
    WHERE cost_category_id = COALESCE(NEW.category_id, OLD.category_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update budget actual spending
DROP TRIGGER IF EXISTS trigger_update_budget_actual_spent ON cost_entries;
CREATE TRIGGER trigger_update_budget_actual_spent
    AFTER INSERT OR UPDATE OR DELETE ON cost_entries
    FOR EACH ROW EXECUTE FUNCTION update_budget_item_actual_spent();
