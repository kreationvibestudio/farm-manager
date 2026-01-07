"use client";

import { useState, useEffect } from "react";
import { Staff } from "@/types";
import { Button } from "@/components/ui/button";
import { X, Loader2, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BulkFireModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFire: (staffIds: string[]) => Promise<void>;
    staff: Staff[];
}

const roleColors: Record<Staff['role'], string> = {
    Manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Supervisor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Driver: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Worker: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export function BulkFireModal({ isOpen, onClose, onFire, staff }: BulkFireModalProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Reset selection when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedIds(new Set());
            setErrorMessage('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(staff.map(s => s.id));
            setSelectedIds(allIds);
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedIds);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedIds(newSelected);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedIds.size === 0) {
            setErrorMessage('Please select at least one staff member to fire.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            await onFire(Array.from(selectedIds));
            setSelectedIds(new Set());
            onClose();
        } catch (error: any) {
            console.error('Error firing staff:', error);
            const message = error?.message || 'Failed to fire staff members. Please try again.';
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedStaff = staff.filter(s => selectedIds.has(s.id));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-4xl mx-4 border border-border max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <UserMinus className="h-5 w-5 text-destructive" />
                            Bulk Fire Staff
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Select staff members to fire. This action cannot be undone.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                        disabled={isSubmitting}
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

                        {selectedIds.size > 0 && (
                            <div className="rounded-lg border border-primary bg-primary/10 p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-primary">
                                        {selectedIds.size} staff member(s) selected
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedIds(new Set())}
                                        className="h-7"
                                    >
                                        Clear Selection
                                    </Button>
                                </div>
                                {selectedStaff.length > 0 && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        Selected: {selectedStaff.map(s => s.name).join(', ')}
                                    </div>
                                )}
                            </div>
                        )}

                        {staff.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                No staff members available to fire.
                            </div>
                        ) : (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="p-3 text-left w-12">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.size === staff.length && staff.length > 0}
                                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                                        className="rounded border-border"
                                                    />
                                                </th>
                                                <th className="p-3 text-left font-medium">Name</th>
                                                <th className="p-3 text-left font-medium">Role</th>
                                                <th className="p-3 text-left font-medium">Designation</th>
                                                <th className="p-3 text-left font-medium">Contact</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {staff.map((member) => (
                                                <tr 
                                                    key={member.id} 
                                                    className={`hover:bg-muted/30 transition-colors ${
                                                        selectedIds.has(member.id) ? 'bg-muted/50' : ''
                                                    }`}
                                                >
                                                    <td className="p-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.has(member.id)}
                                                            onChange={(e) => handleSelectOne(member.id, e.target.checked)}
                                                            className="rounded border-border"
                                                        />
                                                    </td>
                                                    <td className="p-3 font-medium">{member.name}</td>
                                                    <td className="p-3">
                                                        <Badge className={roleColors[member.role]}>
                                                            {member.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {member.designation || 'N/A'}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {member.contact || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
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
                            variant="destructive"
                            className="flex-1 gap-2"
                            disabled={isSubmitting || selectedIds.size === 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Firing...
                                </>
                            ) : (
                                <>
                                    <UserMinus className="h-4 w-4" />
                                    Fire {selectedIds.size} Staff Member(s)
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
