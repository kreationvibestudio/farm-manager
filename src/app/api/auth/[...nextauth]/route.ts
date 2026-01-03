import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NEXTAUTH_SECRET is not set. Please set it in your environment variables.");
}

const handler = NextAuth(authOptions);

// NextAuth v4 App Router handler
// The handler expects a request with query.nextauth array
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  const routeParams = await params;
  const pathname = req.nextUrl.pathname;
  const segments = pathname.replace('/api/auth/', '').split('/').filter(Boolean);
  
  // Create request URL with query parameter
  const url = new URL(req.url);
  
  // Create request object
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
  });
  
  // Add query property that NextAuth expects
  (request as any).query = { nextauth: segments };
  
  return handler(request);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  const routeParams = await params;
  const pathname = req.nextUrl.pathname;
  const segments = pathname.replace('/api/auth/', '').split('/').filter(Boolean);
  
  // Create request URL
  const url = new URL(req.url);
  
  // Get body
  const body = req.body ? await req.text() : null;
  
  // Create request object
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: body,
  });
  
  // Add query property that NextAuth expects
  (request as any).query = { nextauth: segments };
  
  return handler(request);
}
