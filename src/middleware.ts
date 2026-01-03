/**
 * Middleware for authentication and session management
 * 
 * Note: Next.js 16 shows a deprecation warning about using "proxy" instead of "middleware",
 * but the middleware.ts file is still the correct and supported way to implement middleware.
 * The warning is about future changes, but current implementation is valid.
 * See: https://nextjs.org/docs/app/building-your-application/routing/middleware
 */
import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  // Always allow login page, auth API, static files, and favicon
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // Check if NEXTAUTH_SECRET is configured
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    // If secret is missing, allow access but log warning
    console.error('⚠️ NEXTAUTH_SECRET is not set in middleware!')
    // Still allow access - the auth route will handle the error
    return NextResponse.next()
  }

  // Check for NextAuth session
  let session
  try {
    session = await auth()
  } catch (error) {
    console.error('Error getting session in middleware:', error)
    // If session check fails, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If no session and not on login page, redirect to login
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Skip Supabase check if NextAuth session exists - NextAuth is sufficient for authentication
  // Only use Supabase for database operations, not for auth checks
  // This significantly improves performance by avoiding redundant session checks
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
}
