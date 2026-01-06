"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

interface LogHarvestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LogHarvestModal({ isOpen, onClose }: LogHarvestModalProps) {
    const { addHarvestLog, harvestLogs, fetchHarvestLogs, staff, fetchStaff, vehicles, fetchVehicles } = useAppStore();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        blockId: "",
        bunches: 0,
        supervisorId: "",
        vehicleId: "",
    });

    useEffect(() => {
        // Fetch data when modal opens
        if (isOpen) {
            if (harvestLogs.length === 0) {
                fetchHarvestLogs();
            }
            if (staff.length === 0) {
                fetchStaff();
            }
            if (vehicles.length === 0) {
                fetchVehicles();
            }
        }
    }, [isOpen, harvestLogs.length, staff.length, vehicles.length, fetchHarvestLogs, fetchStaff, fetchVehicles]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                blockId: "",
                bunches: 0,
                supervisorId: "",
                vehicleId: "",
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Extract unique block IDs from harvest logs and sort them
    const uniqueBlocks = [...new Set(harvestLogs.map(log => log.blockId).filter(Boolean))].sort();
    
    // Get supervisors (Managers and Supervisors)
    const supervisors = staff.filter(s => s.role === 'Supervisor' || s.role === 'Manager');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const logData: any = {
                date: formData.date,
                blockId: formData.blockId,
                bunches: formData.bunches,
            };
            if (formData.supervisorId) {
                logData.supervisorId = formData.supervisorId;
            }
            if (formData.vehicleId) {
                logData.vehicleId = formData.vehicleId;
            }
            await addHarvestLog(logData);
            onClose();
        } catch (error: any) {
            console.error('Error saving harvest log:', error);
            alert(error?.message || 'Failed to save harvest log. Please try again.');
        }
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
                        <label className="block text-sm font-medium mb-1">Block ID *</label>
                        <select
                            required
                            value={formData.blockId}
                            onChange={(e) => setFormData({ ...formData, blockId: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Select block...</option>
                            {uniqueBlocks.map((block) => (
                                <option key={block} value={block}>
                                    {block}
                                </option>
                            ))}
                        </select>
                        {uniqueBlocks.length === 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                                No blocks found. Add a harvest log first to populate block list.
                            </p>
                        )}
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
                                <option value="">Select supervisor...</option>
                                {supervisors.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Vehicle</label>
                            <select
                                value={formData.vehicleId}
                                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Select vehicle...</option>
                                {vehicles.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.name} {v.licensePlate ? `(${v.licensePlate})` : ''}
                                    </option>
                                ))}
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
