"use client";

import { useState } from "react";
import { Staff } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, UserMinus, User } from "lucide-react";

interface StaffTableProps {
    staff: Staff[];
    onEdit: (staff: Staff) => void;
    onDelete: (id: string) => void;
    canManage?: boolean; // If false, hide edit/delete buttons
    onBulkSelect?: (selectedIds: string[]) => void; // Callback for bulk selection
    showCheckboxes?: boolean; // Show checkboxes for bulk operations
}

const roleColors: Record<Staff['role'], string> = {
    Manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Supervisor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Driver: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Worker: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export function StaffTable({ staff, onEdit, onDelete, canManage = true, onBulkSelect, showCheckboxes = false }: StaffTableProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(staff.map(s => s.id));
            setSelectedIds(allIds);
            onBulkSelect?.(Array.from(allIds));
        } else {
            setSelectedIds(new Set());
            onBulkSelect?.([]);
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
        onBulkSelect?.(Array.from(newSelected));
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                            {showCheckboxes && canManage && (
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === staff.length && staff.length > 0}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="rounded border-border"
                                    />
                                </th>
                            )}
                            <th className="p-4">Name</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Designation</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {staff.length === 0 ? (
                            <tr>
                                <td colSpan={showCheckboxes && canManage ? 6 : 5} className="p-8 text-center text-muted-foreground">
                                    No staff members found. Add your first staff member!
                                </td>
                            </tr>
                        ) : (
                            staff.map((member) => (
                                <tr key={member.id} className="hover:bg-muted/50 transition-colors">
                                    {showCheckboxes && canManage && (
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(member.id)}
                                                onChange={(e) => handleSelectOne(member.id, e.target.checked)}
                                                className="rounded border-border"
                                            />
                                        </td>
                                    )}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="font-medium">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge className={roleColors[member.role]}>
                                            {member.role}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {member.designation || 'N/A'}
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {member.contact || 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        {canManage ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEdit(member)}
                                                    className="h-8 px-3"
                                                    title="Edit staff member"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onDelete(member.id)}
                                                    className="h-8 px-3 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                    title="Fire staff member"
                                                >
                                                    <UserMinus className="h-4 w-4 mr-1" />
                                                    Fire
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-right text-muted-foreground text-xs">
                                                View only
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
