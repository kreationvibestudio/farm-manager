import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header Placeholder */}
            <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
                <Skeleton className="h-8 w-48" />
            </header>

            <main className="flex-1 p-6 space-y-8">
                {/* Welcome Section */}
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-96" />
                </div>

                {/* Key Metrics Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <Skeleton className="h-4 w-24 mb-4" />
                            <div className="flex items-baseline gap-2">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Section */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
