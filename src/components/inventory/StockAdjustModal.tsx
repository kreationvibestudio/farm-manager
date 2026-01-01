"use client";

import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { InventoryItem } from "@/types";

interface StockAdjustModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    mode: "add" | "subtract";
}

export function StockAdjustModal({ isOpen, onClose, item, mode }: StockAdjustModalProps) {
    const adjustStock = useAppStore((state) => state.adjustStock);
    const [amount, setAmount] = useState(1);

    if (!isOpen || !item) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const delta = mode === "add" ? amount : -amount;
        adjustStock(item.id, delta);
        setAmount(1);
        onClose();
    };

    const isSubtract = mode === "subtract";
    const maxSubtract = item.quantity;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-xl bg-card border border-border p-6 shadow-2xl mx-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {isSubtract ? (
                            <><Minus className="h-5 w-5 text-red-500" /> Remove Stock</>
                        ) : (
                            <><Plus className="h-5 w-5 text-green-600" /> Add Stock</>
                        )}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-muted/50">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Current: {item.quantity} {item.unit}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Amount to {isSubtract ? "Remove" : "Add"}
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={isSubtract ? maxSubtract : undefined}
                            required
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {isSubtract && (
                            <p className="text-xs text-muted-foreground mt-1">Max: {maxSubtract} {item.unit}</p>
                        )}
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">New quantity will be:</p>
                        <p className="text-lg font-bold">
                            {isSubtract ? Math.max(0, item.quantity - amount) : item.quantity + amount} {item.unit}
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={`flex-1 ${isSubtract ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {isSubtract ? "Remove" : "Add"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
