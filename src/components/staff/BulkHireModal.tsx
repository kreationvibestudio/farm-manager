"use client";

import { useState } from "react";
import { Staff, StaffDesignation } from "@/types";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BulkHireModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (staffList: Omit<Staff, 'id'>[]) => Promise<void>;
}

interface StaffFormData {
    name: string;
    role: Staff['role'];
    designation: StaffDesignation | '';
    contact: string;
}

export function BulkHireModal({ isOpen, onClose, onSave }: BulkHireModalProps) {
    const [staffList, setStaffList] = useState<StaffFormData[]>([
        { name: '', role: 'Worker', designation: '', contact: '' }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    if (!isOpen) return null;

    const addRow = () => {
        setStaffList([...staffList, { name: '', role: 'Worker', designation: '', contact: '' }]);
    };

    const removeRow = (index: number) => {
        if (staffList.length > 1) {
            setStaffList(staffList.filter((_, i) => i !== index));
        }
    };

    const updateRow = (index: number, field: keyof StaffFormData, value: string | Staff['role'] | StaffDesignation | '') => {
        const updated = [...staffList];
        updated[index] = { ...updated[index], [field]: value };
        setStaffList(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        // Filter out empty rows and validate
        const validStaff = staffList
            .filter(s => s.name.trim() !== '')
            .map(s => ({
                name: s.name.trim(),
                role: s.role,
                designation: s.designation || undefined,
                contact: s.contact.trim() || undefined,
            }));

        if (validStaff.length === 0) {
            setErrorMessage('Please add at least one staff member with a name.');
            setIsSubmitting(false);
            return;
        }

        try {
            await onSave(validStaff);
            setStaffList([{ name: '', role: 'Worker', designation: '', contact: '' }]);
            onClose();
            setErrorMessage('');
        } catch (error: any) {
            console.error('Error saving staff:', error);
            const message = error?.message || 'Failed to save staff members. Please try again.';
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-4xl mx-4 border border-border max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Bulk Hire Staff</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 overflow-y-auto flex-1">
                        {errorMessage && (
                            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive mb-4">
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-muted-foreground">
                                    Add multiple staff members at once. Empty rows will be ignored.
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addRow}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Row
                                </Button>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="p-3 text-left font-medium">Name *</th>
                                                <th className="p-3 text-left font-medium">Role *</th>
                                                <th className="p-3 text-left font-medium">Designation</th>
                                                <th className="p-3 text-left font-medium">Contact</th>
                                                <th className="p-3 w-12"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {staffList.map((staff, index) => (
                                                <tr key={index} className="hover:bg-muted/30">
                                                    <td className="p-3">
                                                        <Input
                                                            type="text"
                                                            value={staff.name}
                                                            onChange={(e) => updateRow(index, 'name', e.target.value)}
                                                            placeholder="Full Name"
                                                            className="w-full"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <Select
                                                            value={staff.role}
                                                            onValueChange={(value) => updateRow(index, 'role', value as Staff['role'])}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Manager">Manager</SelectItem>
                                                                <SelectItem value="Supervisor">Supervisor</SelectItem>
                                                                <SelectItem value="Driver">Driver</SelectItem>
                                                                <SelectItem value="Worker">Worker</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="p-3">
                                                        <Select
                                                            value={staff.designation || ''}
                                                            onValueChange={(value) => updateRow(index, 'designation', value as StaffDesignation | '')}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Optional" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="">None</SelectItem>
                                                                <SelectItem value="Estate Manager">Estate Manager</SelectItem>
                                                                <SelectItem value="Farm Manager">Farm Manager</SelectItem>
                                                                <SelectItem value="Office Data Analyst">Office Data Analyst</SelectItem>
                                                                <SelectItem value="Store Keeper">Store Keeper</SelectItem>
                                                                <SelectItem value="Plantation Data Analyst">Plantation Data Analyst</SelectItem>
                                                                <SelectItem value="Mill Manager">Mill Manager</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="p-3">
                                                        <Input
                                                            type="tel"
                                                            value={staff.contact}
                                                            onChange={(e) => updateRow(index, 'contact', e.target.value)}
                                                            placeholder="Phone Number"
                                                            className="w-full"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        {staffList.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeRow(index)}
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 p-6 border-t border-border">
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
                            {isSubmitting ? 'Hiring...' : `Hire ${staffList.filter(s => s.name.trim()).length} Staff Member(s)`}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
