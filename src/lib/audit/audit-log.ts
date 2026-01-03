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
      // Try multiple ways to get IP address
      const forwardedFor = data.request.headers.get('x-forwarded-for')
      const realIp = data.request.headers.get('x-real-ip')
      const cfConnectingIp = data.request.headers.get('cf-connecting-ip') // Cloudflare
      
      ipAddress = forwardedFor?.split(',')[0]?.trim() || 
                  realIp || 
                  cfConnectingIp || 
                  null
      
      userAgent = data.request.headers.get('user-agent') || null
    }
    
    // Extract user information from session
    const userId = (session?.user as any)?.id || 
                   session?.user?.email || 
                   'anonymous'
    const userName = session?.user?.name || 
                     session?.user?.email || 
                     'Unknown'
    
    const auditEntry = {
      user_id: userId,
      user_name: userName,
      action: data.action,
      resource_type: data.resourceType,
      resource_id: data.resourceId || null,
      old_data: data.oldData ? JSON.stringify(data.oldData) : null,
      new_data: data.newData ? JSON.stringify(data.newData) : null,
      ip_address: ipAddress,
      user_agent: userAgent,
    }

    console.log('📝 Attempting to log audit event:', {
      action: data.action,
      resourceType: data.resourceType,
      userId,
      userName,
    })

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
        id: insertedData[0].id,
        action: insertedData[0].action,
        resourceType: insertedData[0].resource_type,
        resourceId: insertedData[0].resource_id,
        userId: insertedData[0].user_id,
      })
    } else {
      console.warn('⚠️ Audit event insert returned no data')
    }
  } catch (error) {
    console.error('❌ Error in audit logging:', error)
    // Silently fail - audit logging should not break the app
  }
}
