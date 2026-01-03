import { createClient } from '@/lib/supabase/server'
import { Session } from 'next-auth'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW'

interface AuditLogData {
  action: AuditAction
  resourceType: string
  resourceId?: string
  oldData?: any
  newData?: any
  request?: Request
}

export async function logAuditEvent(
  session: Session | null,
  data: AuditLogData
) {
  try {
    const supabase = await createClient()
    
    // Get IP and user agent from request if available
    let ipAddress: string | null = null
    let userAgent: string | null = null
    
    if (data.request) {
      ipAddress = data.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                  data.request.headers.get('x-real-ip') || null
      userAgent = data.request.headers.get('user-agent') || null
    }
    
    const auditEntry = {
      user_id: (session?.user as any)?.id || session?.user?.email || 'anonymous',
      user_name: session?.user?.name || session?.user?.email || 'Unknown',
      action: data.action,
      resource_type: data.resourceType,
      resource_id: data.resourceId || null,
      old_data: data.oldData ? JSON.stringify(data.oldData) : null,
      new_data: data.newData ? JSON.stringify(data.newData) : null,
      ip_address: ipAddress,
      user_agent: userAgent,
    }

    const { error, data: insertedData } = await supabase
      .from('audit_logs')
      .insert(auditEntry)
      .select()

    if (error) {
      console.error('❌ Failed to log audit event:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      
      // If table doesn't exist, provide helpful message
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.error('⚠️ audit_logs table does not exist!')
        console.error('Please run supabase-audit-log-schema.sql in Supabase Dashboard')
      }
      // Don't throw - audit logging should not break the app
    } else if (insertedData && insertedData.length > 0) {
      console.log('✅ Audit event logged successfully:', {
        action: insertedData[0].action,
        resourceType: insertedData[0].resource_type,
        resourceId: insertedData[0].resource_id,
      })
    }
  } catch (error) {
    console.error('❌ Error in audit logging:', error)
    // Silently fail - audit logging should not break the app
  }
}
