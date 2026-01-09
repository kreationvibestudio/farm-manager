-- Medical Requests Table
-- This creates the medical_requests table for tracking staff medical requests
-- with approval workflow: Staff -> Supervisor -> Manager
-- Only work-related requests are approved for payment

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Medical Requests Table
CREATE TABLE IF NOT EXISTS medical_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff(id),
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reason TEXT NOT NULL,
  is_work_related BOOLEAN NOT NULL DEFAULT false,
  urgency TEXT NOT NULL CHECK (urgency IN ('Low', 'Medium', 'High', 'Emergency')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved by Supervisor', 'Rejected by Supervisor', 'Approved by Manager', 'Rejected by Manager')),
  supervisor_id UUID REFERENCES staff(id),
  supervisor_action_date TIMESTAMP WITH TIME ZONE,
  supervisor_notes TEXT,
  manager_id UUID REFERENCES staff(id),
  manager_action_date TIMESTAMP WITH TIME ZONE,
  manager_notes TEXT,
  -- Payment tracking (only for approved work-related requests)
  payment_status TEXT CHECK (payment_status IN ('Pending', 'Approved for Payment', 'Paid', 'Rejected')) DEFAULT NULL,
  payment_amount NUMERIC(10, 2),
  payment_date DATE,
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_medical_requests_staff_id ON medical_requests(staff_id);
CREATE INDEX IF NOT EXISTS idx_medical_requests_status ON medical_requests(status);
CREATE INDEX IF NOT EXISTS idx_medical_requests_date ON medical_requests(request_date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_requests_work_related ON medical_requests(is_work_related);
CREATE INDEX IF NOT EXISTS idx_medical_requests_payment_status ON medical_requests(payment_status);
CREATE INDEX IF NOT EXISTS idx_medical_requests_supervisor_id ON medical_requests(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_medical_requests_manager_id ON medical_requests(manager_id);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_medical_requests_updated_at ON medical_requests;

-- Add trigger for updated_at
CREATE TRIGGER update_medical_requests_updated_at BEFORE UPDATE ON medical_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE medical_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all for authenticated users" ON medical_requests;

-- Create policy (allow all for authenticated users)
CREATE POLICY "Allow all for authenticated users" ON medical_requests
    FOR ALL USING (true);
