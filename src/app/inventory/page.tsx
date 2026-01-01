import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockInventory } from "@/lib/data";

export default function InventoryPage() {
    return (
        <main className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Track consumables, set low stock alerts, and monitor usage.
                    </p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" /> Add New Item
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Quick Stats Cards could go here */}
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <div className="text-sm font-medium text-muted-foreground">Total Items Stocked</div>
                    <div className="mt-2 text-2xl font-bold">59</div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <div className="text-sm font-medium text-muted-foreground">Low Stock Alerts</div>
                    <div className="mt-2 text-2xl font-bold text-red-600">2</div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <div className="text-sm font-medium text-muted-foreground">Value on Hand</div>
                    <div className="mt-2 text-2xl font-bold">$12,450</div>
                </div>
            </div>

            <InventoryTable items={mockInventory} />
        </main>
    );
}
