"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { MaintenanceActivity } from "@/types";

interface LogMaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LogMaintenanceModal({ isOpen, onClose }: LogMaintenanceModalProps) {
    const { addMaintenanceLog, staff, fetchStaff, harvestLogs, fetchHarvestLogs } = useAppStore();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        blockId: "",
        activity: 'Pruning' as MaintenanceActivity,
        supervisorId: "",
        staffCount: undefined as number | undefined,
        notes: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Fetch staff and harvest logs when modal is opened
        if (isOpen) {
            if (staff.length === 0) {
                fetchStaff();
            }
            if (harvestLogs.length === 0) {
                fetchHarvestLogs();
            }
        }
    }, [isOpen, staff.length, harvestLogs.length, fetchStaff, fetchHarvestLogs]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                blockId: "",
                activity: 'Pruning',
                supervisorId: "",
                staffCount: undefined,
                notes: "",
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addMaintenanceLog({
                date: formData.date,
                blockId: formData.blockId,
                activity: formData.activity,
                supervisorId: formData.supervisorId || undefined,
                staffCount: formData.staffCount,
                notes: formData.notes || undefined,
            });
            onClose();
        } catch (error: any) {
            console.error('Error saving maintenance log:', error);
            const errorMessage = error?.message || error?.error || 'Failed to save maintenance log. Please try again.';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const supervisors = staff.filter(s => s.role === 'Supervisor' || s.role === 'Manager');
    
    // Extract unique block IDs from harvest logs and sort them
    const uniqueBlocks = [...new Set(harvestLogs.map(log => log.blockId))].sort();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-2xl mx-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Log Maintenance Activity</h2>
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
                                No blocks found. Add harvest logs first to populate block list.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Activity Type *</label>
                        <select
                            required
                            value={formData.activity}
                            onChange={(e) => setFormData({ ...formData, activity: e.target.value as MaintenanceActivity })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="Pruning">Pruning</option>
                            <option value="Fertilizer Application">Fertilizer Application</option>
                            <option value="Herbicide Application">Herbicide Application</option>
                            <option value="Slashing">Slashing</option>
                            <option value="Ring Weeding">Ring Weeding</option>
                        </select>
                    </div>

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
                        <label className="block text-sm font-medium mb-1">Number of Staff (Optional)</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.staffCount || ''}
                            onChange={(e) => setFormData({ ...formData, staffCount: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="e.g., 5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Additional notes about the maintenance activity..."
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Log Maintenance'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
