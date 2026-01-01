import { HarvestLogTable } from "@/components/harvest/HarvestLogTable";
import { Button } from "@/components/ui/button";
import { FileDown, Plus } from "lucide-react";
import { mockHarvestLogs } from "@/lib/data";

export default function HarvestPage() {
    const totalYield = mockHarvestLogs.reduce((acc, log) => acc + log.weightKg, 0);

    return (
        <main className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Harvest & Deliverables</h1>
                    <p className="text-muted-foreground mt-1">
                        Daily logs of Fresh Fruit Bunches (FFB) harvested and transported.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <FileDown className="h-4 w-4" /> Export Report
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                        <Plus className="h-4 w-4" /> Log Harvest
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Harvest (This Month)</div>
                    <div className="mt-2 text-2xl font-bold text-primary">{totalYield.toLocaleString()} kg</div>
                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        +5.4% <span className="text-muted-foreground">vs last month</span>
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Average Daily Yield</div>
                    <div className="mt-2 text-2xl font-bold">4,200 kg</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Best Performing Block</div>
                    <div className="mt-2 text-2xl font-bold">Block A-11</div>
                </div>
            </div>

            <HarvestLogTable logs={mockHarvestLogs} />
        </main>
    );
}
