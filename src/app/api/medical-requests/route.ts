import { NextRequest, NextResponse } from 'next/server'
import * as medicalAPI from '@/lib/api/medical-requests'
import { requireAuth } from '@/lib/auth/api-auth'
import { logAuditEvent } from '@/lib/audit/audit-log'
import { sanitizeError } from '@/lib/utils/error-handler'

export async function GET() {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const requests = await medicalAPI.getMedicalRequests()
    return NextResponse.json(requests, {
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: sanitizeError(error).message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { session } = authResult
    
    const body = await request.json()
    console.log('Received medical request data:', body)
    
    // Validate required fields
    if (!body.staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 })
    }
    if (!body.reason) {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 })
    }
    if (!body.urgency) {
      return NextResponse.json({ error: 'Urgency level is required' }, { status: 400 })
    }
    
    const medicalRequest = await medicalAPI.addMedicalRequest(body)
    
    // Log audit event (non-blocking)
    logAuditEvent(session, {
      action: 'CREATE',
      resourceType: 'medical_requests',
      resourceId: medicalRequest.id,
      newData: medicalRequest,
      request,
    }).catch(error => {
      console.error('Failed to log audit event:', error)
    })
    
    return NextResponse.json(medicalRequest)
  } catch (error: any) {
    console.error('Error creating medical request:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      stack: error?.stack
    })
    
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }
    
    // Check for table not found by message FIRST (before code check)
    if (error?.message) {
      const errorMsg = String(error.message).toLowerCase();
      if (errorMsg.includes('could not find the table') || 
          (errorMsg.includes('medical_requests') && (errorMsg.includes('not found') || errorMsg.includes('does not exist')))) {
        return NextResponse.json({ 
          error: 'Medical requests table not found. Please run the database migration: supabase-medical-requests-schema.sql in your Supabase Dashboard → SQL Editor',
          code: error?.code || 'TABLE_NOT_FOUND',
          details: error.message
        }, { status: 500 })
      }
    }
    
    // Handle Supabase errors by code
    if (error?.code) {
      if (error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST301') {
        return NextResponse.json({ 
          error: 'Medical requests table not found. Please run the database migration: supabase-medical-requests-schema.sql',
          code: error.code,
          details: error.message 
        }, { status: 500 })
      }
      if (error.code === '23503') {
        return NextResponse.json({ 
          error: `Invalid staff ID. The staff member does not exist.`,
          code: error.code,
          details: error.message 
        }, { status: 400 })
      }
      if (error.code === '23502') {
        return NextResponse.json({ 
          error: 'Missing required field',
          code: error.code,
          details: error.message,
          hint: error.hint
        }, { status: 400 })
      }
      if (error.code === '23514') {
        return NextResponse.json({ 
          error: `Invalid data: ${error.message || 'Check constraint violation'}`,
          code: error.code,
          details: error.details || error.hint
        }, { status: 400 })
      }
      return NextResponse.json({ 
        error: error.message || 'Database error occurred',
        code: error.code,
        details: error.details || error.hint
      }, { status: 400 })
    }
    
    // Handle string errors
    if (typeof error === 'string') {
      return NextResponse.json({ 
        error: error
      }, { status: 500 })
    }
    
    // Handle Error objects - check for table not found FIRST
    if (error instanceof Error && error.message) {
      // Check if error message indicates missing table
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes('could not find the table') || 
          (errorMsg.includes('medical_requests') && (errorMsg.includes('not found') || errorMsg.includes('does not exist')))) {
        return NextResponse.json({ 
          error: 'Medical requests table not found. Please run the database migration: supabase-medical-requests-schema.sql in your Supabase Dashboard → SQL Editor',
          details: error.message,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        error: error.message || 'Failed to create medical request',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }, { status: 500 })
    }
    
    // Fallback for unknown error types
    const sanitized = sanitizeError(error)
    return NextResponse.json({ 
      error: sanitized.message || 'Failed to create medical request',
      ...(process.env.NODE_ENV === 'development' && { 
        details: JSON.stringify(error),
        originalError: error
      })
    }, { status: 500 })
  }
}
