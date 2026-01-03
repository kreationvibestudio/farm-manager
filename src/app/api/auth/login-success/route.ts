import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function POST(request: NextRequest) {
  try {
    // Get session after successful login
    const session = await auth()
    
    // Log login event if session exists
    if (session?.user) {
      try {
        await logAuditEvent(session, {
          action: 'LOGIN',
          resourceType: 'auth',
          newData: { 
            userId: (session.user as any)?.id || session.user?.email || 'unknown',
            username: session.user.name || session.user.email || 'unknown'
          },
          request,
        })
        console.log('✅ Login event logged successfully')
      } catch (error) {
        console.error('Failed to log login event:', error)
        // Don't fail if audit logging fails
      }
    }
    
    return NextResponse.json({ success: true, message: 'Login logged successfully' })
  } catch (error: any) {
    console.error('Error in login-success route:', error)
    // Still return success
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
