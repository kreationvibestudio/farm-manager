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
    return await handler(req);
  } catch (error: any) {
    console.error("NextAuth GET error:", error);
    return NextResponse.json(
      { 
        error: "Authentication configuration error",
        message: process.env.NEXTAUTH_SECRET 
          ? "Check server logs for details" 
          : "NEXTAUTH_SECRET environment variable is missing. Please set it in Vercel."
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    return await handler(req);
  } catch (error: any) {
    console.error("NextAuth POST error:", error);
    return NextResponse.json(
      { 
        error: "Authentication configuration error",
        message: process.env.NEXTAUTH_SECRET 
          ? "Check server logs for details" 
          : "NEXTAUTH_SECRET environment variable is missing. Please set it in Vercel."
      },
      { status: 500 }
    );
  }
}
