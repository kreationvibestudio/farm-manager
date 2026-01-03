import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Rate limiting (simple in-memory - use Redis in production)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIP(req: any): string {
    return req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || 
           req?.headers?.['x-real-ip'] || 
           req?.socket?.remoteAddress || 
           'unknown';
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Rate limiting
                const ip = getClientIP(req);
                const attempts = loginAttempts.get(ip) || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };
                
                if (attempts.resetAt < Date.now()) {
                    attempts.count = 0;
                    attempts.resetAt = Date.now() + 15 * 60 * 1000;
                }
                
                if (attempts.count >= 5) {
                    throw new Error("Too many login attempts. Please try again in 15 minutes.");
                }

                const username = process.env.ADMIN_USERNAME;
                const password = process.env.ADMIN_PASSWORD;

                if (!username || !password) {
                    throw new Error("Authentication not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD environment variables.");
                }

                if (
                    credentials?.username === username &&
                    credentials?.password === password
                ) {
                    loginAttempts.delete(ip); // Reset on success
                    
                    // Log successful login
                    try {
                        const { logAuditEvent } = await import('@/lib/audit/audit-log');
                        await logAuditEvent(
                            { user: { id: "1", name: "Admin User", email: "admin@plantation.com" } } as any,
                            {
                                action: 'LOGIN',
                                resourceType: 'auth',
                                newData: { userId: "1", username: credentials.username },
                                request: req as any,
                            }
                        );
                    } catch (error) {
                        console.error('Failed to log login event:', error);
                        // Don't fail login if audit logging fails
                    }
                    
                    return { id: "1", name: "Admin User", email: "admin@plantation.com" };
                }
                
                attempts.count++;
                loginAttempts.set(ip, attempts);
                return null;
            }
        })
    ],
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    callbacks: {
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.sub || "1";
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
        async signIn({ user, account, profile }) {
            // Log login attempt (will be logged in the authorize function on success)
            return true;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60, // 8 hours
    },
    secret: process.env.NEXTAUTH_SECRET, // Must be set - no default
};
