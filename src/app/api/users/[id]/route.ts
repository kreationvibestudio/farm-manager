import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAuditEvent } from '@/lib/audit/audit-log';
import bcrypt from 'bcryptjs';

// PUT - Update user (only admins can update users)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { error: 'Only admins can update users' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    console.log('Received update request for user:', {
      userId: id,
      body: { 
        ...body, 
        password: body.password ? '[REDACTED]' : undefined,
        roleReceived: body.role,
        roleType: typeof body.role
      }
    });
    
    const { full_name, role, phone_number, password } = body;

    const supabase = createAdminClient();

    // Get current user data for audit log
    const { data: currentUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    // Normalize and validate input
    if (full_name !== undefined && full_name !== null) {
      updateData.full_name = String(full_name).trim();
    }
    
    if (role !== undefined && role !== null) {
      // Normalize role (trim whitespace, ensure proper case)
      const normalizedRole = String(role).trim();
      const validRoles = ['Admin', 'Operator', 'Support'];
      
      if (!validRoles.includes(normalizedRole)) {
        console.error('Invalid role provided:', {
          originalRole: role,
          normalizedRole: normalizedRole,
          roleType: typeof role,
          roleLength: normalizedRole.length,
          characterCodes: normalizedRole.split('').map(c => c.charCodeAt(0))
        });
        return NextResponse.json(
          { 
            error: `Invalid role. Must be exactly one of: ${validRoles.join(', ')} (case-sensitive). Received: "${normalizedRole}"`,
            received: normalizedRole,
            validRoles: validRoles
          },
          { status: 400 }
        );
      }
      updateData.role = normalizedRole;
    }
    
    if (phone_number !== undefined) {
      updateData.phone_number = phone_number ? String(phone_number).trim() || null : null;
    }

    // If password is provided, hash it
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(password, saltRounds);
      updateData.must_change_password = true; // Require password change after admin reset
    }

    // Log what we're about to update
    console.log('Updating user:', {
      userId: id,
      updateData: updateData,
      currentUserRole: currentUser?.role
    });

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .is('deleted_at', null)
      .select('id, username, full_name, role, phone_number, must_change_password, created_at, updated_at')
      .single();

    if (updateError) {
      console.error('Supabase error updating user:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        updateData: updateData
      });
      
      // Handle specific database errors
      if (updateError.code === '23514') {
        return NextResponse.json(
          { 
            error: `Invalid role value. Role must be exactly one of: Admin, Operator, or Support (case-sensitive).`,
            details: updateError.message,
            hint: updateError.hint
          },
          { status: 400 }
        );
      }
      
      if (updateError.code === '23502') {
        return NextResponse.json(
          { 
            error: 'Missing required field',
            details: updateError.message,
            hint: updateError.hint
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to update user',
          details: updateError.message,
          code: updateError.code
        },
        { status: 500 }
      );
    }

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'UPDATE',
      resourceType: 'users',
      resourceId: id,
      oldData: currentUser,
      newData: updatedUser,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error);
    });

    return NextResponse.json({
      id: updatedUser.id,
      username: updatedUser.username,
      full_name: updatedUser.full_name,
      role: updatedUser.role,
      phone_number: updatedUser.phone_number || undefined,
      must_change_password: updatedUser.must_change_password || false,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
    });
  } catch (error: any) {
    console.error('Error in PUT /api/users/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete user (only admins can delete users)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { error: 'Only admins can delete users' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = (session.user as any)?.id;

    // Prevent deleting yourself
    if (id === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Get user data for audit log
    const { data: userToDelete } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!userToDelete) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from('users')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
      })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'DELETE',
      resourceType: 'users',
      resourceId: id,
      oldData: userToDelete,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error);
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error in DELETE /api/users/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
