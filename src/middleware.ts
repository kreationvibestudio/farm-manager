import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Only use Supabase auth if environment variables are set
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return await updateSession(request)
    }
    
    // If Supabase is not configured, allow access (using NextAuth for now)
    // For login page and API routes, always allow
    if (
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/api/auth') ||
      request.nextUrl.pathname.startsWith('/_next')
    ) {
      return NextResponse.next()
    }
    
    // For other routes, allow access (NextAuth will handle auth via withAuth if needed)
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow access to prevent blocking the app
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)',
  ],
}
