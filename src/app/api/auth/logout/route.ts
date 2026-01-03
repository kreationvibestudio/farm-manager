import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function POST(request: NextRequest) {
  try {
    // Get session before logout
    const session = await auth()
    
    // Log logout event if session exists (non-blocking)
    if (session?.user) {
      logAuditEvent(session, {
        action: 'LOGOUT',
        resourceType: 'auth',
        newData: { 
          userId: (session.user as any)?.id || session.user?.email || 'unknown',
          username: session.user.name || session.user.email || 'unknown'
        },
        request,
      }).catch(error => {
        console.error('Failed to log logout event:', error)
        // Don't fail logout if audit logging fails
      })
    }
    
    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  } catch (error: any) {
    console.error('Error in logout route:', error)
    // Still return success to allow logout to proceed
    return NextResponse.json({ success: true, message: 'Logged out' }, { status: 200 })
  }
}
