"use client";

import { useState, useEffect } from "react";
import { StaffTable } from "@/components/staff/StaffTable";
import { AddStaffModal } from "@/components/staff/AddStaffModal";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { Staff } from "@/types";
import { useAppStore } from "@/lib/store";

export default function StaffPage() {
    const { 
        staff, 
        isLoading, 
        error,
        fetchStaff,
        addStaff,
        updateStaff,
        deleteStaff 
    } = useAppStore();

    const [showAddModal, setShowAddModal] = useState(false);
    const [editStaff, setEditStaff] = useState<Staff | null>(null);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const handleAdd = async (staffData: Omit<Staff, 'id'>) => {
        await addStaff(staffData);
        setShowAddModal(false);
    };

    const handleEdit = (staff: Staff) => {
        setEditStaff(staff);
        setShowAddModal(true);
    };

    const handleUpdate = async (staffData: Omit<Staff, 'id'>) => {
        if (editStaff) {
            await updateStaff(editStaff.id, staffData);
            setEditStaff(null);
            setShowAddModal(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this staff member?")) {
            await deleteStaff(id);
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditStaff(null);
    };

    const roleCounts = {
        Manager: staff.filter(s => s.role === 'Manager').length,
        Supervisor: staff.filter(s => s.role === 'Supervisor').length,
        Driver: staff.filter(s => s.role === 'Driver').length,
        Worker: staff.filter(s => s.role === 'Worker').length,
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <Users className="h-8 w-8 text-primary" />
                            Staff Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your plantation staff members and their roles.
                        </p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Staff Member
                    </Button>
                </div>

                {error && (
                    <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                        Error: {error}
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-sm text-muted-foreground">Total Staff</div>
                        <div className="text-2xl font-bold mt-1">{staff.length}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-sm text-muted-foreground">Managers</div>
                        <div className="text-2xl font-bold mt-1">{roleCounts.Manager}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-sm text-muted-foreground">Supervisors</div>
                        <div className="text-2xl font-bold mt-1">{roleCounts.Supervisor}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-sm text-muted-foreground">Drivers</div>
                        <div className="text-2xl font-bold mt-1">{roleCounts.Driver}</div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Loading staff members...
                    </div>
                ) : (
                    <StaffTable
                        staff={staff}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}

                <AddStaffModal
                    isOpen={showAddModal}
                    onClose={handleCloseModal}
                    onSave={editStaff ? handleUpdate : handleAdd}
                    editStaff={editStaff}
                />
            </main>
        </div>
    );
}
