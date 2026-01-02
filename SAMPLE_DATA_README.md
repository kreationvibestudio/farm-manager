# Sample Data Population Guide

This guide explains how to populate your Supabase database with sample data for testing and development.

## Option 1: Using SQL Script (Recommended)

### Steps:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `hzdralzrkkzdeumpbvdh`
   - Navigate to **SQL Editor**

2. **Run the Schema First** (if not already done)
   - Open `supabase-schema.sql`
   - Copy and paste the entire content
   - Click **Run** to create tables

3. **Populate Sample Data**
   - Open `supabase-sample-data.sql`
   - Copy and paste the entire content
   - Click **Run** to insert sample data

4. **Verify Data**
   - The script will output counts of inserted records
   - You can also check in **Table Editor** to see the data

### What Gets Inserted:

- **10 Staff Members**: Managers, Supervisors, Drivers, and Workers
- **8 Vehicles**: Tractors, Trucks, and Motorcycles with various statuses
- **30 Inventory Items**: Fertilizers, Herbicides, Fuel, Spare Parts, Tools, and Other items
- **30+ Harvest Logs**: Daily harvest records for the past 30 days across multiple blocks

## Option 2: Using API Endpoints (Alternative)

If you prefer to populate data programmatically, you can use the API endpoints:

```bash
# Example: Add an inventory item
curl -X POST https://your-app.vercel.app/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "name": "NPK 15:15:15",
    "category": "Fertilizer",
    "quantity": 450,
    "unit": "bags",
    "minLevel": 50
  }'
```

## Data Overview

### Staff
- 1 Manager
- 3 Supervisors
- 3 Drivers
- 3 Workers

### Vehicles
- 3 Tractors (2 Active, 1 Maintenance)
- 3 Trucks (2 Active, 1 OutOfService)
- 2 Motorcycles (Both Active)

### Inventory Items
- **Fertilizers**: 5 items (NPK, Urea, Potassium Sulphate, etc.)
- **Herbicides**: 4 items (Roundup, Glyphosate, Paraquat, etc.)
- **Fuel**: 4 items (Diesel, Petrol, Engine Oil, Hydraulic Oil)
- **Spare Parts**: 7 items (Tires, Filters, Batteries, etc.)
- **Tools**: 6 items (Pruning Saws, Harvesting Knives, Safety Equipment)
- **Other**: 3 items (Rope, Tarpaulin, Tying Wire)

### Harvest Logs
- 30+ daily harvest records
- Multiple blocks (A, B, C series)
- Weight ranges from 9,800 kg to 14,500 kg per harvest
- Includes supervisor, driver, and vehicle assignments
- Notes on harvest quality and conditions

## Notes

- The sample data uses realistic values for a palm plantation operation
- Harvest logs are distributed across the past 30 days
- Some inventory items are intentionally set below minimum levels to test alerts
- Vehicle statuses vary to show different operational states
- All foreign key relationships are properly maintained

## Clearing Sample Data

If you need to clear the sample data and start fresh:

```sql
-- WARNING: This will delete ALL data
TRUNCATE TABLE harvest_logs, inventory_items, vehicles, staff CASCADE;
```

Or delete specific tables:

```sql
DELETE FROM harvest_logs;
DELETE FROM inventory_items;
DELETE FROM vehicles;
DELETE FROM staff;
```

## Next Steps

After populating the data:
1. Refresh your application
2. Check the Dashboard to see the data visualized
3. Test CRUD operations (Create, Read, Update, Delete)
4. Verify that charts and statistics display correctly
