"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

interface LogHarvestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LogHarvestModal({ isOpen, onClose }: LogHarvestModalProps) {
    const addHarvestLog = useAppStore((state) => state.addHarvestLog);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        blockId: "",
        bunches: 0,
        supervisorId: "s2",
        vehicleId: "v3",
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addHarvestLog(formData);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            blockId: "",
            bunches: 0,
            supervisorId: "s2",
            vehicleId: "v3",
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-2xl mx-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Log New Harvest</h2>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Block ID</label>
                        <input
                            type="text"
                            required
                            value={formData.blockId}
                            onChange={(e) => setFormData({ ...formData, blockId: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="e.g., Block A-15"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Bunches (FFB)</label>
                        <input
                            type="number"
                            min="1"
                            required
                            value={formData.bunches}
                            onChange={(e) => setFormData({ ...formData, bunches: parseInt(e.target.value) || 0 })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="e.g., 2500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Supervisor</label>
                            <select
                                value={formData.supervisorId}
                                onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="s1">John Doe</option>
                                <option value="s2">Jane Smith</option>
                                <option value="s3">Bob Wilson</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Vehicle</label>
                            <select
                                value={formData.vehicleId}
                                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="v1">Tractor 01</option>
                                <option value="v2">Tractor 02</option>
                                <option value="v3">Truck 01</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Log Harvest
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
