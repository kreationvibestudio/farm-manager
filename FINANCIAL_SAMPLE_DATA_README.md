# Financial Management Sample Data

This guide explains how to populate your Supabase database with sample financial management data.

## Overview

The sample data includes:
- **Cost Entries**: 30+ cost transactions across different categories (Fertilizer, Herbicide, Fuel, Labor, Maintenance, Transportation, Utilities, Insurance, Administrative)
- **Sales Records**: 20+ sales records including FFB (Fresh Fruit Bunch) and by-product sales (CPO, PK)
- **Budgets**: Annual budget for 2024 plus quarterly budgets (Q1, Q2, Q3, Q4)
- **Budget Items**: Line items for each budget covering costs and revenue targets

## Prerequisites

1. **Database Schema**: Ensure you've run `supabase-financial-management-schema.sql` first
2. **User Account**: You need at least one user in the `users` table with `role = 'Admin'`
3. **Cost Categories**: The script uses existing cost categories from the schema
4. **Budget Categories**: The script uses existing budget categories from the schema

## How to Run

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Navigate to **SQL Editor**

2. **Run the Script**
   - Open `supabase-financial-sample-data.sql`
   - Copy and paste the entire content
   - Click **Run** to execute

3. **Verify Data**
   - The script will display a summary at the end showing:
     - Number of cost entries created
     - Number of sales records created
     - Number of budgets created
     - Number of budget items created
   - You can also check in **Table Editor** to see the data

### Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db execute --file supabase-financial-sample-data.sql
```

## What Gets Created

### Cost Entries (30+ records)
- **Fertilizer Costs**: 5 entries (NPK, Urea, Potassium Sulphate, etc.)
- **Herbicide Costs**: 3 entries (Roundup, Paraquat, Glyphosate)
- **Fuel Costs**: 5 entries (Diesel and Petrol purchases)
- **Labor Costs**: 5 entries (Monthly wages and salaries)
- **Maintenance Costs**: 4 entries (Equipment repairs and servicing)
- **Transportation Costs**: 5 entries (FFB transport to mill)
- **Utilities**: 3 entries (Electricity, Internet, Phone)
- **Insurance**: 2 entries (Vehicle and equipment insurance)
- **Administrative**: 3 entries (Office supplies, software, licenses)

**Total Cost Entries**: ~35 records covering the last 3 months
**Total Cost Amount**: Approximately ₦6,000,000+ across all entries

### Sales Records (20+ records)
- **FFB Sales**: 12 records (Fresh Fruit Bunch sales to Palm Oil Mill Ltd)
  - Quantity: 45,000 - 55,000 kg per sale
  - Unit Price: ₦85.00 per kg
  - Quality Grade: Grade A
  - Payment Status: Mostly Paid
  
- **By-Product Sales**: 8 records
  - **CPO (Crude Palm Oil)**: 5 sales to Cooking Oil Manufacturers
    - Quantity: 4,800 - 5,200 kg per sale
    - Unit Price: ₦450.00 per kg
  - **PK (Palm Kernel)**: 3 sales to Animal Feed Producers
    - Quantity: 1,800 - 2,200 kg per sale
    - Unit Price: ₦180.00 per kg

**Total Sales Records**: 20 records covering the last 3 months
**Total Revenue**: Approximately ₦55,000,000+ across all sales

### Budgets (5 budgets)
- **Annual Budget 2024**: ₦25,000,000 total budget
- **Q1 2024 Budget**: ₦6,250,000
- **Q2 2024 Budget**: ₦6,250,000
- **Q3 2024 Budget**: ₦6,250,000
- **Q4 2024 Budget**: ₦6,250,000

### Budget Items (41 items total)
- **Annual Budget**: 9 cost items + 2 revenue items = 11 items
- **Each Quarterly Budget**: 6 cost items + 2 revenue items = 8 items each
- **Total**: 11 + (8 × 4) = 43 budget items

## Data Characteristics

### Date Range
- **Cost Entries**: Last 35 days (recent costs)
- **Sales Records**: Last 35 days (recent sales)
- **Budgets**: Full year 2024 with quarterly breakdowns

### Financial Summary
- **Total Costs**: ~₦6,000,000 (last 3 months)
- **Total Revenue**: ~₦55,000,000 (last 3 months)
- **Net Profit**: ~₦49,000,000 (last 3 months)
- **Profit Margin**: ~89%

### Categories Covered
- **Cost Categories**: Fertilizer, Herbicide, Fuel, Labor, Maintenance, Transportation, Utilities, Insurance, Administrative
- **Product Types**: FFB, CPO, PK
- **Payment Statuses**: Paid, Partial, Pending
- **Quality Grades**: Grade A, Standard

## Notes

1. **User ID Requirement**: The script automatically finds an admin user to use for `created_by` fields. If no admin user exists, it will use any available user, or a placeholder UUID.

2. **Date Handling**: All dates are relative to `CURRENT_DATE`, so the data will always be recent when you run the script.

3. **Currency**: All amounts are in NGN (Nigerian Naira).

4. **Realistic Data**: The sample data includes:
   - Realistic supplier names
   - Invoice/reference numbers
   - Block IDs (Block A, B, C, D, E)
   - Payment statuses
   - Quality grades and moisture content for FFB

5. **Budget Relationships**: Budget items are linked to:
   - Budget categories (for budget structure)
   - Cost categories (for actual cost tracking)
   - Budgets (parent budget)

## Troubleshooting

### Error: "relation 'users' does not exist"
- Make sure you've set up the users table first
- Check if your authentication schema is properly configured

### Error: "cost_categories not found"
- Run `supabase-financial-management-schema.sql` first
- This creates the cost categories table and inserts default categories

### Error: "budget_categories not found"
- Run `supabase-financial-management-schema.sql` first
- This creates the budget categories table and inserts default categories

### No data inserted
- Check if you have at least one user in the `users` table
- Verify that cost categories and budget categories exist
- Check the SQL Editor output for specific error messages

## Next Steps

After running the sample data script:

1. **Verify in Application**: 
   - Go to `/financial` page to see the overview
   - Check `/financial/costs` for cost entries
   - Check `/financial/sales` for sales records
   - Check `/financial/budgets` for budgets

2. **Review Dashboard**:
   - Total Cost should show ~₦6,000,000+
   - Total Revenue should show ~₦55,000,000+
   - Net Profit should show ~₦49,000,000+

3. **Test Features**:
   - Filter costs by category
   - Filter sales by product type
   - View budget variance reports
   - Check recent costs and recent sales

## Data Refresh

If you want to refresh the sample data:
1. Delete existing records (be careful in production!)
2. Re-run the script
3. The dates will automatically adjust to be recent

---

**Created**: 2024
**Last Updated**: 2024
