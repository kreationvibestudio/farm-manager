import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NEXTAUTH_SECRET is not set. Please set it in your environment variables.");
}

const handler = NextAuth(authOptions);

// Helper function to create a compatible request object for NextAuth
// NextAuth v4 expects req.query.nextauth to be an array of route segments
function createNextAuthRequest(req: NextRequest, params: { nextauth: string[] }) {
  const url = req.nextUrl;
  
  // Get the nextauth route segments from params
  const nextauthRoute = params.nextauth || [];
  
  // Create a request object compatible with NextAuth's expected format
  // NextAuth expects req.query.nextauth to be an array
  const nextAuthReq = {
    url: url.toString(),
    query: {
      nextauth: nextauthRoute,
    },
    headers: req.headers,
    method: req.method,
    body: req.body,
    cookies: req.cookies,
  } as any;
  
  return nextAuthReq;
}

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
    
    // Create compatible request object for NextAuth
    const nextAuthReq = createNextAuthRequest(req, routeParams);
    return await handler(nextAuthReq);
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
    
    // Create compatible request object for NextAuth
    const nextAuthReq = createNextAuthRequest(req, routeParams);
    return await handler(nextAuthReq);
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
