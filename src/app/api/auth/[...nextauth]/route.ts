import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NEXTAUTH_SECRET is not set. Please set it in your environment variables.");
}

const handler = NextAuth(authOptions);

// Wrap handler with error handling
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    // Check if NEXTAUTH_SECRET is set before processing
    if (!process.env.NEXTAUTH_SECRET) {
      console.error("❌ NEXTAUTH_SECRET is missing in GET handler");
      return NextResponse.json(
        { 
          error: "Authentication configuration error",
          message: "NEXTAUTH_SECRET environment variable is missing. Please set it in Vercel environment variables.",
          code: "MISSING_SECRET"
        },
        { status: 500 }
      );
    }
    
    // Get params
    const routeParams = await params;
    
    // Extract the nextauth route segments from the pathname
    const pathname = req.nextUrl.pathname;
    const segments = pathname.replace('/api/auth/', '').split('/').filter(Boolean);
    
    // Create a proper Request object for NextAuth
    const url = new URL(req.url);
    
    // Create the request object
    const nextAuthReq = new Request(url, {
      method: req.method,
      headers: req.headers,
    });
    
    // Add query property that NextAuth expects
    // NextAuth v4 expects req.query.nextauth to be an array
    Object.defineProperty(nextAuthReq, 'query', {
      value: { nextauth: segments },
      writable: false,
      configurable: false,
    });
    
    // Call the handler and ensure we get a Response
    const response = await handler(nextAuthReq);
    
    // Validate response
    if (!response || !(response instanceof Response)) {
      console.error("NextAuth handler returned invalid response:", response);
      return NextResponse.json(
        { 
          error: "Authentication configuration error",
          message: "Authentication handler returned invalid response",
          code: "INVALID_RESPONSE"
        },
        { status: 500 }
      );
    }
    
    return response;
  } catch (error: any) {
    console.error("NextAuth GET error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        error: "Authentication configuration error",
        message: process.env.NEXTAUTH_SECRET 
          ? `Server error: ${error.message || 'Unknown error'}` 
          : "NEXTAUTH_SECRET environment variable is missing. Please set it in Vercel.",
        code: process.env.NEXTAUTH_SECRET ? "SERVER_ERROR" : "MISSING_SECRET"
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    // Check if NEXTAUTH_SECRET is set before processing
    if (!process.env.NEXTAUTH_SECRET) {
      console.error("❌ NEXTAUTH_SECRET is missing in POST handler");
      return NextResponse.json(
        { 
          error: "Authentication configuration error",
          message: "NEXTAUTH_SECRET environment variable is missing. Please set it in Vercel environment variables.",
          code: "MISSING_SECRET"
        },
        { status: 500 }
      );
    }
    
    // Get params
    const routeParams = await params;
    
    // Extract the nextauth route segments from the pathname
    const pathname = req.nextUrl.pathname;
    const segments = pathname.replace('/api/auth/', '').split('/').filter(Boolean);
    
    // Create a proper Request object for NextAuth
    const url = new URL(req.url);
    
    // Get body for POST requests
    let body: string | null = null;
    try {
      body = await req.text();
    } catch (e) {
      // Body might not be available
    }
    
    // Create the request object
    const nextAuthReq = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: body,
    });
    
    // Add query property that NextAuth expects
    Object.defineProperty(nextAuthReq, 'query', {
      value: { nextauth: segments },
      writable: false,
      configurable: false,
    });
    
    // Call the handler and ensure we get a Response
    const response = await handler(nextAuthReq);
    
    // Validate response
    if (!response || !(response instanceof Response)) {
      console.error("NextAuth handler returned invalid response:", response);
      return NextResponse.json(
        { 
          error: "Authentication configuration error",
          message: "Authentication handler returned invalid response",
          code: "INVALID_RESPONSE"
        },
        { status: 500 }
      );
    }
    
    return response;
  } catch (error: any) {
    console.error("NextAuth POST error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        error: "Authentication configuration error",
        message: process.env.NEXTAUTH_SECRET 
          ? `Server error: ${error.message || 'Unknown error'}` 
          : "NEXTAUTH_SECRET environment variable is missing. Please set it in Vercel.",
        code: process.env.NEXTAUTH_SECRET ? "SERVER_ERROR" : "MISSING_SECRET"
      },
      { status: 500 }
    );
  }
}
