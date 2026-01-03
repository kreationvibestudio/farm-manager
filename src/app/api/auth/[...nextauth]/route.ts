import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NEXTAUTH_SECRET is not set. Please set it in your environment variables.");
}

const handler = NextAuth(authOptions);

// Wrap handler with error handling
export async function GET(req: Request) {
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
    return await handler(req);
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

export async function POST(req: Request) {
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
    return await handler(req);
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
