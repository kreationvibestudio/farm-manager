"use client";

import { useState, useEffect } from "react";
import { VehicleList } from "@/components/fleet/VehicleList";
import { AddVehicleModal } from "@/components/fleet/AddVehicleModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Vehicle } from "@/types";

export default function FleetPage() {
    const { 
        vehicles, 
        isLoading,
        error,
        fetchVehicles,
        updateVehicle,
        deleteVehicle 
    } = useAppStore();

    const [showAddModal, setShowAddModal] = useState(false);
    const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const activeVehicles = vehicles.filter(v => v.status === 'Active').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'Maintenance').length;
    const idleVehicles = vehicles.filter(v => v.status === 'OutOfService').length;

    const handleEdit = (vehicle: Vehicle) => {
        setEditVehicle(vehicle);
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditVehicle(null);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this vehicle?")) {
            deleteVehicle(id);
        }
    };

    const handleStatusChange = (id: string, status: "Active" | "Maintenance" | "OutOfService") => {
        updateVehicle(id, { status });
    };

    if (isLoading && vehicles.length === 0) {
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
                    <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor vehicle status, track maintenance, and assign drivers.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4" /> Add Vehicle
                </Button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                    Error: {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Vehicles</div>
                    <div className="mt-2 text-2xl font-bold">{vehicles.length}</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Active</div>
                    <div className="mt-2 text-2xl font-bold text-green-600">{activeVehicles}</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">In Maintenance</div>
                    <div className="mt-2 text-2xl font-bold text-amber-500">{maintenanceVehicles}</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Out of Service</div>
                    <div className="mt-2 text-2xl font-bold text-zinc-500">{idleVehicles}</div>
                </div>
            </div>

            <VehicleList
                vehicles={vehicles}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
            />

            <AddVehicleModal 
                isOpen={showAddModal} 
                onClose={handleCloseModal}
                editVehicle={editVehicle}
            />
        </main>
    );
}
