import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import bcrypt from 'bcryptjs';
import { validatePassword } from '@/lib/utils/password-validation';
import { sanitizeError } from '@/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult; // Unauthorized response
    }
    const { session } = authResult;

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    const userId = (session.user as any)?.id;
    if (!userId || userId === 'env-admin') {
      return NextResponse.json(
        { error: 'Cannot change password for environment-based authentication' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Get current user
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, password_hash, must_change_password')
      .eq('id', userId)
      .is('deleted_at', null)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear must_change_password flag
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: newPasswordHash,
        must_change_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Password changed successfully',
      success: true,
    });
  } catch (error: any) {
    console.error('Error changing password:', error);
    const sanitized = sanitizeError(error);
    return NextResponse.json(
      { error: sanitized.message },
      { status: 500 }
    );
  }
}
