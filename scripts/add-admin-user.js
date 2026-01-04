/**
 * Script to add an admin user to the database
 * Run this with: node scripts/add-admin-user.js
 * 
 * Make sure to set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env or pass as env vars
 */

require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addAdminUser() {
  const username = 'usiholo';
  const password = 'Password@123';
  const fullName = 'Usiholo Anenih';
  const role = 'Admin';
  const phoneNumber = '08028890064';
  const mustChangePassword = true;

  try {
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, username')
      .eq('username', username)
      .is('deleted_at', null)
      .single();

    if (existingUser) {
      console.log(`User with username "${username}" already exists.`);
      console.log('To update the user, you can run an UPDATE query in Supabase.');
      return;
    }

    // Insert the new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash: passwordHash,
        full_name: fullName,
        role,
        phone_number: phoneNumber,
        must_change_password: mustChangePassword,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding admin user:', error);
      process.exit(1);
    }

    console.log('✅ Admin user added successfully!');
    console.log('\nUser details:');
    console.log(`  Username: ${username}`);
    console.log(`  Full Name: ${fullName}`);
    console.log(`  Role: ${role}`);
    console.log(`  Phone: ${phoneNumber}`);
    console.log(`  Must Change Password: ${mustChangePassword}`);
    console.log(`  User ID: ${data.id}`);
    console.log('\n⚠️  Note: User must change password on first login.');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

addAdminUser();
