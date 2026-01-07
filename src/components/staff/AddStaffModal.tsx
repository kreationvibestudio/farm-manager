"use client";

import { useState, useEffect } from "react";
import { Staff, StaffDesignation } from "@/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (staff: Omit<Staff, 'id'>) => Promise<void>;
    editStaff?: Staff | null;
}

export function AddStaffModal({ isOpen, onClose, onSave, editStaff }: AddStaffModalProps) {
    const [formData, setFormData] = useState<{
        name: string;
        role: Staff['role'];
        designation: StaffDesignation | '';
        contact: string;
    }>({
        name: '',
        role: 'Worker',
        designation: '',
        contact: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (editStaff) {
            setFormData({
                name: editStaff.name,
                role: editStaff.role,
                designation: editStaff.designation || '',
                contact: editStaff.contact || '',
            });
        } else {
            setFormData({
                name: '',
                role: 'Worker',
                designation: '',
                contact: '',
            });
        }
        setErrorMessage(''); // Clear error when modal opens/closes
    }, [editStaff, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            await onSave({
                ...formData,
                designation: formData.designation || undefined,
            });
            onClose();
            setFormData({ name: '', role: 'Worker', designation: '', contact: '' });
            setErrorMessage('');
        } catch (error: any) {
            console.error('Error saving staff:', error);
            const message = error?.message || 'Failed to save staff member. Please try again.';
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-md mx-4 border border-border">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">
                        {editStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errorMessage && (
                        <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                            {errorMessage}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., Chukwuemeka Okafor"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Role *
                        </label>
                        <select
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as Staff['role'] })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Manager">Manager</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Driver">Driver</option>
                            <option value="Worker">Worker</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Designation
                        </label>
                        <select
                            value={formData.designation || ''}
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value as StaffDesignation | '' })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select Designation (Optional)</option>
                            <option value="Estate Manager">Estate Manager</option>
                            <option value="Farm Manager">Farm Manager</option>
                            <option value="Office Data Analyst">Office Data Analyst</option>
                            <option value="Store Keeper">Store Keeper</option>
                            <option value="Plantation Data Analyst">Plantation Data Analyst</option>
                            <option value="Mill Manager">Mill Manager</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="+234 801 234 5678"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : editStaff ? 'Update' : 'Add Staff'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
