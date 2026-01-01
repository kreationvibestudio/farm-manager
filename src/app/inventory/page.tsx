"use client";

import { useState } from "react";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { AddItemModal } from "@/components/inventory/AddItemModal";
import { StockAdjustModal } from "@/components/inventory/StockAdjustModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { InventoryItem } from "@/types";

export default function InventoryPage() {
    const inventory = useAppStore((state) => state.inventory);
    const deleteInventoryItem = useAppStore((state) => state.deleteInventoryItem);

    const [showAddModal, setShowAddModal] = useState(false);
    const [stockModal, setStockModal] = useState<{ isOpen: boolean; item: InventoryItem | null; mode: "add" | "subtract" }>({
        isOpen: false,
        item: null,
        mode: "add"
    });
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);

    const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0);
    const lowStockCount = inventory.filter(item => item.quantity <= item.minLevel).length;

    const handleAddStock = (item: InventoryItem) => {
        setStockModal({ isOpen: true, item, mode: "add" });
    };

    const handleSubtractStock = (item: InventoryItem) => {
        setStockModal({ isOpen: true, item, mode: "subtract" });
    };

    const handleEdit = (item: InventoryItem) => {
        // For now, just show an alert - can expand to edit modal later
        alert(`Edit functionality for "${item.name}" - Coming soon!`);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            deleteInventoryItem(id);
        }
    };

    return (
        <main className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Track consumables, set low stock alerts, and monitor usage.
                    </p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4" /> Add New Item
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <div className="text-sm font-medium text-muted-foreground">Total Items Stocked</div>
                    <div className="mt-2 text-2xl font-bold">{totalItems.toLocaleString()}</div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <div className="text-sm font-medium text-muted-foreground">Low Stock Alerts</div>
                    <div className="mt-2 text-2xl font-bold text-red-600">{lowStockCount}</div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <div className="text-sm font-medium text-muted-foreground">Value on Hand</div>
                    <div className="mt-2 text-2xl font-bold">₦12,450,000</div>
                </div>
            </div>

            <InventoryTable
                items={inventory}
                onAddStock={handleAddStock}
                onSubtractStock={handleSubtractStock}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AddItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
            <StockAdjustModal
                isOpen={stockModal.isOpen}
                onClose={() => setStockModal({ isOpen: false, item: null, mode: "add" })}
                item={stockModal.item}
                mode={stockModal.mode}
            />
        </main>
    );
}
