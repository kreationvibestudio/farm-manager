"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicalRequestUrgency } from "@/types";

interface CreateMedicalRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        staffId: string;
        reason: string;
        isWorkRelated: boolean;
        urgency: MedicalRequestUrgency;
    }) => Promise<void>;
    staffName?: string;
    staffId?: string;
    staffList?: Array<{ id: string; name: string }>;
    canSelectStaff?: boolean; // If true, show staff selection dropdown
}

export function CreateMedicalRequestModal({ 
    isOpen, 
    onClose, 
    onSubmit,
    staffName,
    staffId,
    staffList = [],
    canSelectStaff = false
}: CreateMedicalRequestModalProps) {
    const [formData, setFormData] = useState({
        selectedStaffId: staffId || "",
        reason: "",
        isWorkRelated: false,
        urgency: 'Medium' as MedicalRequestUrgency,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Reset form when modal opens/closes or props change
    useEffect(() => {
        if (isOpen) {
            setFormData({
                selectedStaffId: staffId || "",
                reason: "",
                isWorkRelated: false,
                urgency: 'Medium',
            });
            setError("");
        }
    }, [isOpen, staffId]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        // Determine the staff ID to use
        const finalStaffId = canSelectStaff ? formData.selectedStaffId : (staffId || "");
        
        if (!finalStaffId || finalStaffId.trim() === "") {
            setError("Staff member is required. Please select a staff member for this request.");
            return;
        }
        
        if (!formData.reason.trim()) {
            setError("Please provide a reason for the medical request.");
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('Submitting medical request:', {
                staffId: finalStaffId,
                reason: formData.reason,
                isWorkRelated: formData.isWorkRelated,
                urgency: formData.urgency,
            });
            
            await onSubmit({
                staffId: finalStaffId,
                reason: formData.reason,
                isWorkRelated: formData.isWorkRelated,
                urgency: formData.urgency,
            });
            
            // Reset form
            setFormData({
                selectedStaffId: staffId || "",
                reason: "",
                isWorkRelated: false,
                urgency: 'Medium',
            });
            onClose();
        } catch (error: any) {
            console.error('Error submitting medical request:', error);
            setError(error?.message || 'Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-2xl mx-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">New Medical Request</h2>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {canSelectStaff ? (
                        <div>
                            <label className="block text-sm font-medium mb-1">Staff Member *</label>
                            <select
                                required
                                value={formData.selectedStaffId}
                                onChange={(e) => setFormData({ ...formData, selectedStaffId: e.target.value })}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Select staff member...</option>
                                {staffList.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Requesting for:</p>
                            <p className="font-medium">{staffName || 'Unknown'}</p>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Reason for Medical Request *</label>
                        <textarea
                            required
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Describe the medical issue and why you need medical attention..."
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isWorkRelated}
                                onChange={(e) => setFormData({ ...formData, isWorkRelated: e.target.checked })}
                                className="rounded border-input"
                            />
                            <span className="text-sm font-medium">This is a work-related medical request</span>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1 ml-6">
                            Only work-related requests will be approved and paid for by the company.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Urgency Level *</label>
                        <select
                            required
                            value={formData.urgency}
                            onChange={(e) => setFormData({ ...formData, urgency: e.target.value as MedicalRequestUrgency })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="Low">Low - Can wait a few days</option>
                            <option value="Medium">Medium - Should be addressed soon</option>
                            <option value="High">High - Needs immediate attention</option>
                            <option value="Emergency">Emergency - Requires immediate medical care</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
