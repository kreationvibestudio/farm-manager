/**
 * Test script to send sample GPS data to vehicles
 * 
 * Usage:
 *   node scripts/test-gps-data.js
 * 
 * This will send sample GPS coordinates to all vehicles in the database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample GPS coordinates (Lagos, Nigeria area - adjust to your plantation location)
const sampleLocations = [
  { lat: 6.5244, lng: 3.3792, name: 'Main Gate' },
  { lat: 6.5300, lng: 3.3850, name: 'Block A' },
  { lat: 6.5200, lng: 3.3750, name: 'Block B' },
  { lat: 6.5350, lng: 3.3900, name: 'Block C' },
  { lat: 6.5150, lng: 3.3700, name: 'Storage Area' },
];

async function sendTestGPSData() {
  console.log('🚀 Sending test GPS data to vehicles...\n');

  try {
    // Get all vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, name')
      .eq('status', 'Active');

    if (vehiclesError) {
      console.error('❌ Error fetching vehicles:', vehiclesError);
      return;
    }

    if (!vehicles || vehicles.length === 0) {
      console.log('⚠️  No active vehicles found. Please add vehicles first.');
      return;
    }

    console.log(`📡 Found ${vehicles.length} active vehicles\n`);

    // Send GPS data to each vehicle
    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      const location = sampleLocations[i % sampleLocations.length];
      
      // Add some random variation
      const lat = location.lat + (Math.random() - 0.5) * 0.01;
      const lng = location.lng + (Math.random() - 0.5) * 0.01;
      const speed = Math.floor(Math.random() * 60) + 10; // 10-70 km/h
      const heading = Math.floor(Math.random() * 360); // 0-360 degrees

      const { data, error } = await supabase
        .from('vehicle_locations')
        .insert({
          vehicle_id: vehicle.id,
          latitude: lat,
          longitude: lng,
          speed: speed,
          heading: heading,
          accuracy: 5.0,
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error sending GPS data for ${vehicle.name}:`, error.message);
      } else {
        console.log(`✅ ${vehicle.name}: ${lat.toFixed(6)}, ${lng.toFixed(6)} (${speed} km/h, ${heading}°)`);
      }
    }

    console.log('\n✅ Test GPS data sent successfully!');
    console.log('💡 Visit /tracking to see the vehicles on the map');

  } catch (error) {
    console.error('\n❌ Error during GPS data test:', error);
    process.exit(1);
  }
}

sendTestGPSData();
