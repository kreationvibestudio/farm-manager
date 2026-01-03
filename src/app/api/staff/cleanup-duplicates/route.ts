import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/api-auth'
import { createClient } from '@/lib/supabase/server'
import { logAuditEvent } from '@/lib/audit/audit-log'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }
    const { session } = authResult

    const supabase = await createClient()

    // Get all staff members (including soft-deleted to check all)
    const { data: allStaff, error: fetchError } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Error fetching staff:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
    }

    if (!allStaff || allStaff.length === 0) {
      return NextResponse.json({ 
        message: 'No staff members found',
        duplicatesRemoved: 0,
        duplicatesFound: []
      })
    }

    // Find duplicates by name (case-insensitive, trimmed)
    const nameMap = new Map<string, any[]>()
    
    allStaff.forEach((staff: any) => {
      const normalizedName = staff.name?.trim().toLowerCase() || ''
      if (!nameMap.has(normalizedName)) {
        nameMap.set(normalizedName, [])
      }
      nameMap.get(normalizedName)!.push(staff)
    })

    // Find groups with duplicates
    const duplicateGroups: Array<{ name: string; staff: any[] }> = []
    const toDelete: string[] = []
    const duplicatesFound: Array<{ name: string; count: number; ids: string[] }> = []

    nameMap.forEach((staffList, normalizedName) => {
      if (staffList.length > 1) {
        // Sort by created_at to keep the oldest one
        staffList.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateA - dateB
        })

        duplicateGroups.push({
          name: staffList[0].name, // Use original name
          staff: staffList
        })

        duplicatesFound.push({
          name: staffList[0].name,
          count: staffList.length,
          ids: staffList.map(s => s.id)
        })

        // Keep the first (oldest) one, mark others for deletion
        for (let i = 1; i < staffList.length; i++) {
          const staff = staffList[i]
          
          // Check if already soft-deleted
          if (!staff.deleted_at) {
            toDelete.push(staff.id)
          }
        }
      }
    })

    if (toDelete.length === 0) {
      return NextResponse.json({
        message: 'No duplicates found',
        duplicatesRemoved: 0,
        duplicatesFound: duplicatesFound
      })
    }

    // Soft delete duplicates (keep the oldest record)
    const userId = (session.user as any)?.id || session.user?.email || 'unknown'
    const { error: deleteError } = await supabase
      .from('staff')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
      })
      .in('id', toDelete)
      .is('deleted_at', null) // Only update if not already deleted

    if (deleteError) {
      console.error('Error deleting duplicates:', deleteError)
      return NextResponse.json({ 
        error: 'Failed to delete duplicates',
        details: deleteError.message 
      }, { status: 500 })
    }

    // Log audit event for cleanup
    try {
      await logAuditEvent(session, {
        action: 'DELETE',
        resourceType: 'staff',
        newData: {
          cleanup: true,
          duplicatesRemoved: toDelete.length,
          duplicateNames: duplicateGroups.map(g => g.name)
        },
        request,
      })
    } catch (auditError) {
      console.error('Failed to log cleanup audit event:', auditError)
      // Don't fail if audit logging fails
    }

    return NextResponse.json({
      message: `Successfully removed ${toDelete.length} duplicate staff member(s)`,
      duplicatesRemoved: toDelete.length,
      duplicatesFound: duplicatesFound,
      details: duplicateGroups.map(g => ({
        name: g.name,
        kept: g.staff[0].id,
        removed: g.staff.slice(1).map(s => s.id)
      }))
    })
  } catch (error: any) {
    console.error('Error in cleanup-duplicates route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to cleanup duplicates' },
      { status: 500 }
    )
  }
}
