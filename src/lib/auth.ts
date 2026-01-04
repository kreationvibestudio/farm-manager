import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createAdminClient } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";

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

                if (!credentials?.username || !credentials?.password) {
                    attempts.count++;
                    loginAttempts.set(ip, attempts);
                    return null;
                }

                // Try database authentication first
                try {
                    const supabase = createAdminClient();
                    const { data: user, error } = await supabase
                        .from('users')
                        .select('id, username, password_hash, full_name, role, phone_number, must_change_password')
                        .eq('username', credentials.username)
                        .is('deleted_at', null)
                        .single();

                    if (error) {
                        console.error('Database query error for username:', credentials.username, error);
                        // Continue to fallback
                    } else if (user && user.password_hash) {
                        // Verify password
                        const isValid = await bcrypt.compare(credentials.password || '', (user.password_hash as any) as string);
                        
                        if (isValid) {
                            loginAttempts.delete(ip); // Reset on success
                            
                            // Update last_login_at (non-blocking)
                            supabase
                                .from('users')
                                .update({ last_login_at: new Date().toISOString() })
                                .eq('id', user.id)
                                .then(() => {})
                                .catch(() => {});
                            
                            return {
                                id: user.id,
                                name: user.full_name,
                                email: `${user.username}@farmmanager.com`,
                                role: user.role,
                                mustChangePassword: user.must_change_password || false,
                            };
                        } else {
                            console.error('Password verification failed for user:', credentials.username);
                        }
                    } else {
                        console.error('User not found in database:', credentials.username);
                    }
                } catch (dbError: any) {
                    // If database check fails, fall back to environment variables
                    console.error('Database authentication error:', dbError?.message || dbError);
                    // Check if it's a missing environment variable error
                    if (dbError?.message?.includes('Missing SUPABASE_SERVICE_ROLE_KEY')) {
                        console.error('⚠️ SUPABASE_SERVICE_ROLE_KEY is not set. Cannot authenticate with database.');
                    }
                }

                // Fall back to environment variables for backward compatibility
                const envUsername = process.env.ADMIN_USERNAME;
                const envPassword = process.env.ADMIN_PASSWORD;

                if (envUsername && envPassword) {
                    if (
                        credentials.username === envUsername &&
                        credentials.password === envPassword
                    ) {
                        loginAttempts.delete(ip); // Reset on success
                        return { 
                            id: "env-admin", 
                            name: "Admin User", 
                            email: "admin@plantation.com",
                            role: "Admin",
                            mustChangePassword: false,
                        };
                    }
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
                (session.user as any).role = token.role || "Admin";
                (session.user as any).mustChangePassword = token.mustChangePassword || false;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = (user as any).role || "Admin";
                token.mustChangePassword = (user as any).mustChangePassword || false;
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
