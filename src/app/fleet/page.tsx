import { VehicleList } from "@/components/fleet/VehicleList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockVehicles } from "@/lib/data";

export default function FleetPage() {
    const activeVehicles = mockVehicles.filter(v => v.status === 'Active').length;
    const maintenanceVehicles = mockVehicles.length - activeVehicles;

    return (
        <main className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor vehicle status, track maintenance, and assign drivers.
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Vehicle
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Vehicles</div>
                    <div className="mt-2 text-2xl font-bold">{mockVehicles.length}</div>
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
                    <div className="text-sm font-medium text-muted-foreground">Fuel Consumption (Total)</div>
                    <div className="mt-2 text-2xl font-bold">850 L</div>
                </div>
            </div>

            <VehicleList vehicles={mockVehicles} />
        </main>
    );
}
