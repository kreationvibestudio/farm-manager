"use client";

import { useState, useEffect } from "react";
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable";
import { LogMaintenanceModal } from "@/components/maintenance/LogMaintenanceModal";
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

    const activityCounts = {
        'Slashing': maintenanceLogs.filter(l => l.activity === 'Slashing').length,
        'Pruning': maintenanceLogs.filter(l => l.activity === 'Pruning').length,
        'Ring Weeding': maintenanceLogs.filter(l => l.activity === 'Ring Weeding').length,
        'Fertilizer Application': maintenanceLogs.filter(l => l.activity === 'Fertilizer Application').length,
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
                        Track maintenance activities: slashing, pruning, ring weeding, and fertilizer application.
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Slashing</div>
                    <div className="mt-2 text-2xl font-bold">{activityCounts['Slashing']}</div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Pruning</div>
                    <div className="mt-2 text-2xl font-bold">{activityCounts['Pruning']}</div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Ring Weeding</div>
                    <div className="mt-2 text-2xl font-bold">{activityCounts['Ring Weeding']}</div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Fertilizer Application</div>
                    <div className="mt-2 text-2xl font-bold">{activityCounts['Fertilizer Application']}</div>
                </div>
            </div>

            <MaintenanceTable logs={maintenanceLogs} onDelete={handleDelete} />

            <LogMaintenanceModal isOpen={showLogModal} onClose={() => setShowLogModal(false)} />
        </main>
    );
}
