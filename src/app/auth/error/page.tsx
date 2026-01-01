"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    let errorMessage = "An unknown error occurred during authentication.";

    if (error === "Configuration") {
        errorMessage = "Server Configuration Error. Please check NEXTAUTH_SECRET and NEXTAUTH_URL environment variables.";
    } else if (error === "AccessDenied") {
        errorMessage = "Access Denied. You do not have permission to sign in.";
    } else if (error === "Verification") {
        errorMessage = "The sign in link is no longer valid. It may have been used already or it may have expired.";
    }

    const router = useRouter();

    return (
        <Card className="w-full max-w-md border-red-200 shadow-lg dark:border-red-900">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
                    <AlertCircle className="h-6 w-6" />
                    <CardTitle className="text-xl">Authentication Error</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    {errorMessage}
                </p>
                {error && (
                    <div className="mt-4 rounded-md bg-zinc-100 p-2 text-xs font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Error Code: {error}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/login")}>
                    Try Again
                </Button>
                <Button onClick={() => router.push("/")}>
                    <Home className="mr-2 h-4 w-4" />
                    Go to Home
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function AuthErrorPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
            <Suspense fallback={<div>Loading...</div>}>
                <AuthErrorContent />
            </Suspense>
        </div>
    );
}
