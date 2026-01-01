"use client";

import { useState, useEffect } from "react";
import { HarvestLogTable } from "@/components/harvest/HarvestLogTable";
import { LogHarvestModal } from "@/components/harvest/LogHarvestModal";
import { Button } from "@/components/ui/button";
import { FileDown, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function HarvestPage() {
    const { 
        harvestLogs, 
        isLoading,
        error,
        fetchHarvestLogs,
        deleteHarvestLog 
    } = useAppStore();

    const [showLogModal, setShowLogModal] = useState(false);

    useEffect(() => {
        fetchHarvestLogs();
    }, [fetchHarvestLogs]);

    const totalYield = harvestLogs.reduce((acc, log) => acc + log.weightKg, 0);
    const averageDaily = harvestLogs.length > 0 ? Math.round(totalYield / harvestLogs.length) : 0;

    // Find best performing block
    const blockTotals = harvestLogs.reduce((acc, log) => {
        acc[log.blockId] = (acc[log.blockId] || 0) + log.weightKg;
        return acc;
    }, {} as Record<string, number>);
    const bestBlock = Object.entries(blockTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this harvest log?")) {
            deleteHarvestLog(id);
        }
    };

    const handleExport = () => {
        // Generate CSV content
        const headers = ["Date", "Block", "Weight (kg)", "Supervisor", "Vehicle"];
        const rows = harvestLogs.map(log => [
            log.date,
            log.blockId,
            log.weightKg.toString(),
            log.supervisorId,
            log.vehicleId || ""
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `harvest-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (isLoading && harvestLogs.length === 0) {
        return (
            <main className="p-6 space-y-8">
                <div>Loading...</div>
            </main>
        );
    }

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
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <FileDown className="h-4 w-4" /> Export Report
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={() => setShowLogModal(true)}>
                        <Plus className="h-4 w-4" /> Log Harvest
                    </Button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                    Error: {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Harvest (This Month)</div>
                    <div className="mt-2 text-2xl font-bold text-primary">{totalYield.toLocaleString()} kg</div>
                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        +5.4% <span className="text-muted-foreground">vs last month</span>
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Average Per Harvest</div>
                    <div className="mt-2 text-2xl font-bold">{averageDaily.toLocaleString()} kg</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Best Performing Block</div>
                    <div className="mt-2 text-2xl font-bold">{bestBlock}</div>
                </div>
            </div>

            <HarvestLogTable logs={harvestLogs} onDelete={handleDelete} />

            <LogHarvestModal isOpen={showLogModal} onClose={() => setShowLogModal(false)} />
        </main>
    );
}
