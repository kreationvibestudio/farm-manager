import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Simple hardcoded check for demo purposes
                // In a real app, you would check against a database
                if (
                    credentials?.username === "admin" &&
                    credentials?.password === "plantation123"
                ) {
                    return { id: "1", name: "Admin User", email: "admin@plantation.com" };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            return session;
        },
        async jwt({ token, user }) {
            return token;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "jkhadsf897234khjasdf789234879", // Fallback for dev
};
