"use client";

import { useState, useEffect } from "react";
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable";
import { LogMaintenanceModal } from "@/components/maintenance/LogMaintenanceModal";
import { ActivityTimelineChart } from "@/components/maintenance/ActivityTimelineChart";
import { BlockMaintenanceStatus } from "@/components/maintenance/BlockMaintenanceStatus";
import { RecentActivitiesFeed } from "@/components/maintenance/RecentActivitiesFeed";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { MaintenanceLog } from "@/types";

export default function MaintenancePage() {
    const { 
        maintenanceLogs, 
        isLoading,
        error,
        fetchMaintenanceLogs,
        deleteMaintenanceLog 
    } = useAppStore();

    const [showLogModal, setShowLogModal] = useState(false);

    useEffect(() => {
        // Only fetch if we don't have data yet
        if (maintenanceLogs.length === 0 && !isLoading) {
            fetchMaintenanceLogs();
        }
    }, []); // Empty dependency array to run only once

    // Count unique blocks per activity
    const blockCounts = {
        'Pruning': new Set(maintenanceLogs.filter(l => l.activity === 'Pruning').map(l => l.blockId)).size,
        'Fertilizer Application': new Set(maintenanceLogs.filter(l => l.activity === 'Fertilizer Application').map(l => l.blockId)).size,
        'Herbicide Application': new Set(maintenanceLogs.filter(l => l.activity === 'Herbicide Application').map(l => l.blockId)).size,
        'Slashing': new Set(maintenanceLogs.filter(l => l.activity === 'Slashing').map(l => l.blockId)).size,
        'Ring Weeding': new Set(maintenanceLogs.filter(l => l.activity === 'Ring Weeding').map(l => l.blockId)).size,
    };

    // Count total activities per type
    const activityCounts = {
        'Pruning': maintenanceLogs.filter(l => l.activity === 'Pruning').length,
        'Fertilizer Application': maintenanceLogs.filter(l => l.activity === 'Fertilizer Application').length,
        'Herbicide Application': maintenanceLogs.filter(l => l.activity === 'Herbicide Application').length,
        'Slashing': maintenanceLogs.filter(l => l.activity === 'Slashing').length,
        'Ring Weeding': maintenanceLogs.filter(l => l.activity === 'Ring Weeding').length,
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this maintenance log?")) {
            deleteMaintenanceLog(id);
        }
    };

    if (isLoading && maintenanceLogs.length === 0) {
        return (
            <main className="p-6 space-y-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading maintenance logs...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Wrench className="h-8 w-8 text-primary" />
                        Farm Maintenance
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track maintenance activities: pruning, fertilizer application, herbicide application, slashing, and ring weeding.
                    </p>
                </div>
                <Button 
                    className="gap-2 shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
                    onClick={() => setShowLogModal(true)}
                >
                    <Plus className="h-4 w-4" /> Log Maintenance
                </Button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                    Error: {error}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Blocks Pruned</div>
                    <div className="mt-2 text-2xl font-bold">{blockCounts['Pruning']}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {activityCounts['Pruning']} {activityCounts['Pruning'] === 1 ? 'activity' : 'activities'}
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Blocks Fertilized</div>
                    <div className="mt-2 text-2xl font-bold">{blockCounts['Fertilizer Application']}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {activityCounts['Fertilizer Application']} {activityCounts['Fertilizer Application'] === 1 ? 'activity' : 'activities'}
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Blocks Herbicide Applied</div>
                    <div className="mt-2 text-2xl font-bold">{blockCounts['Herbicide Application']}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {activityCounts['Herbicide Application']} {activityCounts['Herbicide Application'] === 1 ? 'activity' : 'activities'}
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Blocks Slashed</div>
                    <div className="mt-2 text-2xl font-bold">{blockCounts['Slashing']}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {activityCounts['Slashing']} {activityCounts['Slashing'] === 1 ? 'activity' : 'activities'}
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Blocks Ring Weeded</div>
                    <div className="mt-2 text-2xl font-bold">{blockCounts['Ring Weeding']}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {activityCounts['Ring Weeding']} {activityCounts['Ring Weeding'] === 1 ? 'activity' : 'activities'}
                    </div>
                </div>
            </div>

            {/* Activity Timeline Chart */}
            <ActivityTimelineChart logs={maintenanceLogs} />

            {/* Block Maintenance Status and Recent Activities */}
            <div className="space-y-6">
                <BlockMaintenanceStatus logs={maintenanceLogs} />
                <RecentActivitiesFeed logs={maintenanceLogs} />
            </div>

            {/* Full Maintenance Table */}
            <MaintenanceTable logs={maintenanceLogs} onDelete={handleDelete} />

            <LogMaintenanceModal isOpen={showLogModal} onClose={() => setShowLogModal(false)} />
        </main>
    );
}
