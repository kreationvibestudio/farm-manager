"use client";

import { useState, useEffect } from "react";
import { StaffTable } from "@/components/staff/StaffTable";
import { AddStaffModal } from "@/components/staff/AddStaffModal";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, UserMinus, Trash2, Loader2 } from "lucide-react";
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
    const [isCleaning, setIsCleaning] = useState(false);
    const [cleanupMessage, setCleanupMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const handleAdd = async (staffData: Omit<Staff, 'id'>) => {
        try {
            await addStaff(staffData);
            setShowAddModal(false);
        } catch (error: any) {
            // Error message will be shown in the modal
            throw error; // Re-throw to let modal handle it
        }
    };

    const handleEdit = (staff: Staff) => {
        setEditStaff(staff);
        setShowAddModal(true);
    };

    const handleUpdate = async (staffData: Omit<Staff, 'id'>) => {
        if (editStaff) {
            try {
                await updateStaff(editStaff.id, staffData);
                setEditStaff(null);
                setShowAddModal(false);
            } catch (error: any) {
                // Error message will be shown in the modal
                throw error; // Re-throw to let modal handle it
            }
        }
    };

    const handleCleanupDuplicates = async () => {
        if (!confirm('This will remove duplicate staff members (keeping the oldest record for each name). Continue?')) {
            return;
        }

        setIsCleaning(true);
        setCleanupMessage(null);
        
        try {
            const response = await fetch('/api/staff/cleanup-duplicates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to cleanup duplicates');
            }

            setCleanupMessage(
                result.message || `Removed ${result.duplicatesRemoved || 0} duplicate(s)`
            );

            // Refresh staff list
            await fetchStaff();

            // Clear message after 5 seconds
            setTimeout(() => setCleanupMessage(null), 5000);
        } catch (error: any) {
            setCleanupMessage(`Error: ${error.message}`);
            setTimeout(() => setCleanupMessage(null), 5000);
        } finally {
            setIsCleaning(false);
        }
    };

    const handleDelete = async (id: string) => {
        const staffMember = staff.find(s => s.id === id);
        const staffName = staffMember?.name || 'this staff member';
        if (confirm(`Are you sure you want to fire ${staffName}? This action cannot be undone.`)) {
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
                    <div className="flex gap-2">
                        <Button 
                            onClick={handleCleanupDuplicates}
                            variant="outline"
                            disabled={isCleaning}
                            className="gap-2"
                        >
                            {isCleaning ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Cleaning...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Remove Duplicates
                                </>
                            )}
                        </Button>
                        <Button 
                            onClick={() => setShowAddModal(true)}
                            className="gap-2 shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                        >
                            <UserPlus className="h-4 w-4" />
                            Hire Staff
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                        Error: {error}
                    </div>
                )}

                {cleanupMessage && (
                    <div className={`rounded-lg border p-4 ${
                        cleanupMessage.includes('Error') 
                            ? 'border-destructive bg-destructive/10 text-destructive'
                            : 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400'
                    }`}>
                        {cleanupMessage}
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
