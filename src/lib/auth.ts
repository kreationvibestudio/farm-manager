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
                const username = process.env.ADMIN_USERNAME || "admin";
                const password = process.env.ADMIN_PASSWORD || "plantation123";

                if (
                    credentials?.username === username &&
                    credentials?.password === password
                ) {
                    return { id: "1", name: "Admin User", email: "admin@plantation.com" };
                }
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
            return session;
        },
        async jwt({ token, user }) {
            return token;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "dc1e864f6e79e0542bb4a402351052b4eff00c5c973929bc88e5eada2a1e0d58",
};
