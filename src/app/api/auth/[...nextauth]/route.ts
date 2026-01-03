import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NEXTAUTH_SECRET is not set. Please set it in your environment variables.");
}

// Create NextAuth handler
const handler = NextAuth(authOptions);

// NextAuth v4 was designed for Pages Router which uses plain objects, not Request objects
// We need to create a plain object that mimics the Pages Router request format
function createPagesRouterRequest(
  req: NextRequest,
  segments: string[]
): any {
  const url = new URL(req.url);
  
  // Create a plain object that mimics Next.js Pages Router request
  // This is what NextAuth v4 expects
  const pagesRouterReq: any = {
    url: url.toString(),
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    query: {
      nextauth: segments,
    },
    cookies: Object.fromEntries(
      req.cookies.getAll().map(c => [c.name, c.value])
    ),
    body: undefined, // Will be set for POST
  };
  
  // Add socket property that some NextAuth code might check
  pagesRouterReq.socket = {
    remoteAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 
                   req.headers.get('x-real-ip') || 
                   'unknown',
  };
  
  return pagesRouterReq;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    const { nextauth } = await context.params;
    const segments = nextauth || [];
    
    // Create Pages Router-style request object
    const pagesRouterReq = createPagesRouterRequest(req, segments);
    
    // Call NextAuth handler
    const response = await handler(pagesRouterReq);
    
    // NextAuth should return a Response, but if it doesn't, create one
    if (!response) {
      return NextResponse.json({ error: "No response from NextAuth" }, { status: 500 });
    }
    
    // If response is not a Response object, wrap it
    if (!(response instanceof Response)) {
      return NextResponse.json(response, { status: 200 });
    }
    
    return response;
  } catch (error: any) {
    console.error("NextAuth GET error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json({ 
      error: "Authentication error", 
      message: error.message || "Unknown error" 
    }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    const { nextauth } = await context.params;
    const segments = nextauth || [];
    
    // Read body
    let body: string | null = null;
    try {
      if (req.body) {
        body = await req.text();
      }
    } catch (e) {
      // Body might be unavailable
    }
    
    // Create Pages Router-style request object
    const pagesRouterReq = createPagesRouterRequest(req, segments);
    pagesRouterReq.body = body;
    
    // Call NextAuth handler
    const response = await handler(pagesRouterReq);
    
    // NextAuth should return a Response, but if it doesn't, create one
    if (!response) {
      return NextResponse.json({ error: "No response from NextAuth" }, { status: 500 });
    }
    
    // If response is not a Response object, wrap it
    if (!(response instanceof Response)) {
      return NextResponse.json(response, { status: 200 });
    }
    
    return response;
  } catch (error: any) {
    console.error("NextAuth POST error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json({ 
      error: "Authentication error", 
      message: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
