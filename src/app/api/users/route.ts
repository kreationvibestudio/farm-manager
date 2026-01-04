import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAuditEvent } from '@/lib/audit/audit-log';
import bcrypt from 'bcryptjs';
import { User } from '@/types';

// GET - List all users (only admins can view users)
export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { session } = authResult;

    // Check if user is admin (only admins can view users)
    const userRole = (session.user as any)?.role;
    if (userRole !== 'Admin') {
      return NextResponse.json(
        { error: 'Only admins can view users' },
        { status: 403 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('users')
      .select('id, username, full_name, role, phone_number, must_change_password, created_at, updated_at, last_login_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    const users: User[] = (data || []).map((user: any) => ({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      phone_number: user.phone_number || undefined,
      must_change_password: user.must_change_password || false,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login_at: user.last_login_at || undefined,
    }));

    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create a new user (only admins can create users)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { session } = authResult;

    // Check if user is admin
    const userRole = (session.user as any)?.role;
    if (userRole !== 'Admin') {
      return NextResponse.json(
        { error: 'Only admins can create users' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, password, full_name, role, phone_number } = body;

    if (!username || !password || !full_name || !role) {
      return NextResponse.json(
        { error: 'Username, password, full name, and role are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (!['Admin', 'Operator', 'Support'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be Admin, Operator, or Support' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .is('deleted_at', null)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        username,
        password_hash,
        full_name,
        role,
        phone_number: phone_number || null,
        must_change_password: true, // New users must change password on first login
      })
      .select('id, username, full_name, role, phone_number, must_change_password, created_at, updated_at')
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    const user: User = {
      id: newUser.id,
      username: newUser.username,
      full_name: newUser.full_name,
      role: newUser.role,
      phone_number: newUser.phone_number || undefined,
      must_change_password: newUser.must_change_password || false,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    };

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'CREATE',
      resourceType: 'users',
      resourceId: user.id,
      newData: { username: user.username, full_name: user.full_name, role: user.role },
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error);
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
