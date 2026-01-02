/**
 * Populate Supabase database with sample data
 * 
 * Usage:
 *   node scripts/populate-data.js
 * 
 * Make sure you have .env.local with Supabase credentials
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function populateStaff() {
  console.log('📝 Populating staff...');
  
  const staff = [
    { name: 'John Doe', role: 'Manager', contact: '+234 801 234 5678' },
    { name: 'Jane Smith', role: 'Supervisor', contact: '+234 802 345 6789' },
    { name: 'Bob Wilson', role: 'Driver', contact: '+234 803 456 7890' },
    { name: 'Mary Johnson', role: 'Supervisor', contact: '+234 804 567 8901' },
    { name: 'David Brown', role: 'Driver', contact: '+234 805 678 9012' },
    { name: 'Sarah Williams', role: 'Driver', contact: '+234 806 789 0123' },
    { name: 'Michael Davis', role: 'Worker', contact: '+234 807 890 1234' },
    { name: 'Emily Garcia', role: 'Worker', contact: '+234 808 901 2345' },
    { name: 'James Martinez', role: 'Worker', contact: '+234 809 012 3456' },
    { name: 'Lisa Anderson', role: 'Supervisor', contact: '+234 810 123 4567' },
  ];

  const { data, error } = await supabase
    .from('staff')
    .upsert(staff, { onConflict: 'name' })
    .select();

  if (error) {
    console.error('❌ Error populating staff:', error);
    return null;
  }

  console.log(`✅ Inserted ${data?.length || 0} staff members`);
  return data;
}

async function populateVehicles() {
  console.log('🚜 Populating vehicles...');
  
  const vehicles = [
    { name: 'Tractor-01', type: 'Tractor', status: 'Active', license_plate: 'LAG-1234', last_maintenance: '2024-12-15' },
    { name: 'Tractor-02', type: 'Tractor', status: 'Active', license_plate: 'LAG-1235', last_maintenance: '2024-12-10' },
    { name: 'Tractor-03', type: 'Tractor', status: 'Maintenance', license_plate: 'LAG-1236', last_maintenance: '2024-11-20' },
    { name: 'Truck-01', type: 'Truck', status: 'Active', license_plate: 'LAG-5678', last_maintenance: '2024-12-01' },
    { name: 'Truck-02', type: 'Truck', status: 'Active', license_plate: 'LAG-5679', last_maintenance: '2024-11-25' },
    { name: 'Truck-03', type: 'Truck', status: 'OutOfService', license_plate: 'LAG-5680', last_maintenance: '2024-10-15' },
    { name: 'Motorcycle-01', type: 'Motorcycle', status: 'Active', license_plate: 'LAG-9012', last_maintenance: '2024-12-20' },
    { name: 'Motorcycle-02', type: 'Motorcycle', status: 'Active', license_plate: 'LAG-9013', last_maintenance: '2024-12-18' },
  ];

  const { data, error } = await supabase
    .from('vehicles')
    .upsert(vehicles, { onConflict: 'name' })
    .select();

  if (error) {
    console.error('❌ Error populating vehicles:', error);
    return null;
  }

  console.log(`✅ Inserted ${data?.length || 0} vehicles`);
  return data;
}

async function populateInventory() {
  console.log('📦 Populating inventory...');
  
  const inventory = [
    // Fertilizers
    { name: 'NPK 15:15:15', category: 'Fertilizer', quantity: 450, unit: 'bags', min_level: 50, last_updated: '2024-12-28' },
    { name: 'Urea', category: 'Fertilizer', quantity: 320, unit: 'bags', min_level: 40, last_updated: '2024-12-25' },
    { name: 'Potassium Sulphate', category: 'Fertilizer', quantity: 180, unit: 'bags', min_level: 30, last_updated: '2024-12-20' },
    { name: 'NPK Create', category: 'Fertilizer', quantity: 45, unit: 'bags', min_level: 10, last_updated: '2024-12-15' },
    { name: 'DAP (Diammonium Phosphate)', category: 'Fertilizer', quantity: 280, unit: 'bags', min_level: 35, last_updated: '2024-12-22' },
    
    // Herbicides
    { name: 'Roundup', category: 'Herbicide', quantity: 120, unit: 'L', min_level: 20, last_updated: '2024-12-27' },
    { name: 'Glyphosate 360', category: 'Herbicide', quantity: 85, unit: 'L', min_level: 15, last_updated: '2024-12-24' },
    { name: 'Paraquat', category: 'Herbicide', quantity: 45, unit: 'L', min_level: 10, last_updated: '2024-12-18' },
    { name: '2,4-D Amine', category: 'Herbicide', quantity: 60, unit: 'L', min_level: 12, last_updated: '2024-12-21' },
    
    // Fuel
    { name: 'Diesel', category: 'Fuel', quantity: 1200, unit: 'L', min_level: 500, last_updated: '2024-12-30' },
    { name: 'Petrol', category: 'Fuel', quantity: 350, unit: 'L', min_level: 100, last_updated: '2024-12-28' },
    { name: 'Engine Oil (15W-40)', category: 'Fuel', quantity: 45, unit: 'L', min_level: 10, last_updated: '2024-12-15' },
    { name: 'Hydraulic Oil', category: 'Fuel', quantity: 80, unit: 'L', min_level: 20, last_updated: '2024-12-20' },
    
    // Spare Parts
    { name: 'Tractor Tire (Front)', category: 'Spare Part', quantity: 4, unit: 'units', min_level: 2, last_updated: '2024-12-10' },
    { name: 'Tractor Tire (Rear)', category: 'Spare Part', quantity: 6, unit: 'units', min_level: 2, last_updated: '2024-12-12' },
    { name: 'Air Filter', category: 'Spare Part', quantity: 12, unit: 'units', min_level: 5, last_updated: '2024-12-18' },
    { name: 'Oil Filter', category: 'Spare Part', quantity: 15, unit: 'units', min_level: 5, last_updated: '2024-12-20' },
    { name: 'Brake Pad Set', category: 'Spare Part', quantity: 8, unit: 'units', min_level: 3, last_updated: '2024-12-15' },
    { name: 'Battery (12V)', category: 'Spare Part', quantity: 3, unit: 'units', min_level: 1, last_updated: '2024-12-05' },
    { name: 'Fan Belt', category: 'Spare Part', quantity: 10, unit: 'units', min_level: 4, last_updated: '2024-12-22' },
    
    // Tools
    { name: 'Pruning Saw', category: 'Tool', quantity: 25, unit: 'units', min_level: 5, last_updated: '2024-12-25' },
    { name: 'Harvesting Knife', category: 'Tool', quantity: 50, unit: 'units', min_level: 10, last_updated: '2024-12-28' },
    { name: 'Sprayer Nozzle', category: 'Tool', quantity: 30, unit: 'units', min_level: 8, last_updated: '2024-12-20' },
    { name: 'Wrench Set', category: 'Tool', quantity: 5, unit: 'units', min_level: 2, last_updated: '2024-12-15' },
    { name: 'Safety Helmet', category: 'Tool', quantity: 40, unit: 'units', min_level: 10, last_updated: '2024-12-22' },
    { name: 'Safety Boots', category: 'Tool', quantity: 20, unit: 'units', min_level: 5, last_updated: '2024-12-18' },
    
    // Other
    { name: 'Rope (50m)', category: 'Other', quantity: 15, unit: 'units', min_level: 5, last_updated: '2024-12-20' },
    { name: 'Tarpaulin', category: 'Other', quantity: 8, unit: 'units', min_level: 3, last_updated: '2024-12-15' },
    { name: 'Tying Wire', category: 'Other', quantity: 200, unit: 'kg', min_level: 50, last_updated: '2024-12-25' },
  ];

  const { data, error } = await supabase
    .from('inventory_items')
    .upsert(inventory, { onConflict: 'name' })
    .select();

  if (error) {
    console.error('❌ Error populating inventory:', error);
    return null;
  }

  console.log(`✅ Inserted ${data?.length || 0} inventory items`);
  return data;
}

async function populateHarvestLogs(staffIds, vehicleIds) {
  console.log('🌴 Populating harvest logs...');
  
  if (!staffIds || staffIds.length === 0 || !vehicleIds || vehicleIds.length === 0) {
    console.error('❌ Staff or vehicles not found. Cannot populate harvest logs.');
    return;
  }

  // Get IDs
  const supervisor1 = staffIds.find(s => s.name === 'Jane Smith')?.id;
  const supervisor2 = staffIds.find(s => s.name === 'Mary Johnson')?.id;
  const supervisor3 = staffIds.find(s => s.name === 'Lisa Anderson')?.id;
  const driver1 = staffIds.find(s => s.name === 'Bob Wilson')?.id;
  const driver2 = staffIds.find(s => s.name === 'David Brown')?.id;
  const driver3 = staffIds.find(s => s.name === 'Sarah Williams')?.id;
  
  const vehicle1 = vehicleIds.find(v => v.name === 'Tractor-01')?.id;
  const vehicle2 = vehicleIds.find(v => v.name === 'Tractor-02')?.id;
  const vehicle3 = vehicleIds.find(v => v.name === 'Truck-01')?.id;
  const vehicle4 = vehicleIds.find(v => v.name === 'Truck-02')?.id;

  const harvestLogs = [];
  const today = new Date();

  // Generate harvest logs for the past 30 days
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Alternate between blocks and supervisors
    const blockNum = (i % 13) + 1;
    const blockLetter = ['A', 'B', 'C'][Math.floor((i - 1) / 10) % 3];
    const blockId = `Block ${blockLetter}-${blockNum.toString().padStart(2, '0')}`;

    const supervisor = [supervisor1, supervisor2, supervisor3][(i - 1) % 3];
    const driver = [driver1, driver2, driver3][(i - 1) % 3];
    const vehicle = [vehicle1, vehicle2, vehicle3, vehicle4][(i - 1) % 4];

    const weight = 9800 + Math.floor(Math.random() * 5000); // Random weight between 9800-14800 kg

    harvestLogs.push({
      date: dateStr,
      block_id: blockId,
      weight_kg: weight,
      supervisor_id: supervisor,
      driver_id: driver,
      vehicle_id: vehicle,
      notes: i % 3 === 0 ? 'Good quality FFB' : i % 5 === 0 ? 'Standard harvest' : null,
    });
  }

  const { data, error } = await supabase
    .from('harvest_logs')
    .upsert(harvestLogs, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('❌ Error populating harvest logs:', error);
    return null;
  }

  console.log(`✅ Inserted ${data?.length || 0} harvest logs`);
  return data;
}

async function main() {
  console.log('🚀 Starting data population...\n');

  try {
    // Populate in order (staff and vehicles first, then harvest logs need their IDs)
    const staff = await populateStaff();
    const vehicles = await populateVehicles();
    const inventory = await populateInventory();
    
    if (staff && vehicles) {
      await populateHarvestLogs(staff, vehicles);
    }

    console.log('\n✅ Data population complete!');
    console.log('\nSummary:');
    console.log(`  - Staff: ${staff?.length || 0} members`);
    console.log(`  - Vehicles: ${vehicles?.length || 0} vehicles`);
    console.log(`  - Inventory: ${inventory?.length || 0} items`);
    
  } catch (error) {
    console.error('\n❌ Error during data population:', error);
    process.exit(1);
  }
}

main();
