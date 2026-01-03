import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Rate limiting (simple in-memory - use Redis in production)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIP(req: any): string {
    return req?.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() || 
           req?.headers?.get?.('x-real-ip') || 
           req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
           req?.headers?.['x-real-ip'] ||
           req?.socket?.remoteAddress || 
           'unknown';
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
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
                    // Login audit logging is now handled in the signIn callback
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
        async signIn({ user, account, profile }) {
            // Log successful login after authentication (non-blocking)
            if (user) {
                // Fire and forget - don't block login for audit logging
                import('@/lib/audit/audit-log').then(({ logAuditEvent }) => {
                    const sessionForAudit = {
                        user: {
                            id: user.id || "1",
                            name: user.name || "Admin User",
                            email: user.email || "admin@plantation.com"
                        }
                    } as any;
                    
                    logAuditEvent(sessionForAudit, {
                        action: 'LOGIN',
                        resourceType: 'auth',
                        newData: { userId: user.id || "1", username: user.name || user.email || "admin" },
                    }).catch(error => {
                        console.error('Failed to log login event:', error);
                        // Silently fail - don't break login
                    });
                }).catch(error => {
                    console.error('Failed to import audit log module:', error);
                    // Silently fail - don't break login
                });
            }
            return true;
        },
        async session({ session, token }) {
            if (token && session.user) {
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
    },
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60, // 8 hours
    },
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || (() => {
        // Warn if secret is missing but don't crash
        if (typeof window === 'undefined') { // Server-side only
            console.error('⚠️ NEXTAUTH_SECRET or AUTH_SECRET is not set! Authentication will not work properly.');
            console.error('Please set NEXTAUTH_SECRET in your Vercel environment variables.');
        }
        return 'temporary-secret-change-in-production'; // Temporary fallback
    })(),
});
