import { createClient } from '@/lib/supabase/server'

export interface AuditLog {
  id: string
  user_id: string
  user_name: string | null
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW'
  resource_type: string
  resource_id: string | null
  old_data: any
  new_data: any
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export async function getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      // If table doesn't exist, return empty array
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return []
      }
      console.error('Supabase error fetching audit logs:', error)
      return []
    }

    return (data || []).map((log: any) => ({
      id: log.id,
      user_id: log.user_id,
      user_name: log.user_name,
      action: log.action,
      resource_type: log.resource_type,
      resource_id: log.resource_id,
      old_data: log.old_data ? (typeof log.old_data === 'string' ? JSON.parse(log.old_data) : log.old_data) : null,
      new_data: log.new_data ? (typeof log.new_data === 'string' ? JSON.parse(log.new_data) : log.new_data) : null,
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      created_at: log.created_at,
    }))
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }
}

export async function getAuditLogsByResource(
  resourceType: string,
  resourceId?: string,
  limit: number = 50
): Promise<AuditLog[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('resource_type', resourceType)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (resourceId) {
      query = query.eq('resource_id', resourceId)
    }

    const { data, error } = await query

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return []
      }
      console.error('Supabase error fetching audit logs:', error)
      return []
    }

    return (data || []).map((log: any) => ({
      id: log.id,
      user_id: log.user_id,
      user_name: log.user_name,
      action: log.action,
      resource_type: log.resource_type,
      resource_id: log.resource_id,
      old_data: log.old_data ? (typeof log.old_data === 'string' ? JSON.parse(log.old_data) : log.old_data) : null,
      new_data: log.new_data ? (typeof log.new_data === 'string' ? JSON.parse(log.new_data) : log.new_data) : null,
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      created_at: log.created_at,
    }))
  } catch (error) {
    console.error('Error fetching audit logs by resource:', error)
    return []
  }
}
