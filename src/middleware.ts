import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "dc1e864f6e79e0542bb4a402351052b4eff00c5c973929bc88e5eada2a1e0d58",
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth API)
         * - login (login page)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)",
    ],
};
