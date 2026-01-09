"use client";

import { useState, useEffect } from "react";
import { UsersTable } from "@/components/users/UsersTable";
import { AddUserModal } from "@/components/users/AddUserModal";
import { Button } from "@/components/ui/button";
import { UserPlus, Shield, Loader2 } from "lucide-react";
import { User } from "@/types";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/users');
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Only admins can view users');
                }
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
            setError(null);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            setError(error.message || 'Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login_at'> & { password: string }) => {
        try {
            // Debug logging
            console.log('handleAdd - userData:', {
                ...userData,
                password: '[REDACTED]',
                role: userData.role,
                roleType: typeof userData.role
            });
            
            const requestBody = JSON.stringify(userData);
            console.log('Request body:', requestBody);
            
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody,
            });

            if (!response.ok) {
                const result = await response.json();
                console.error('API error response:', result);
                throw new Error(result.error || 'Failed to create user');
            }

            await fetchUsers();
            setShowAddModal(false);
        } catch (error: any) {
            throw error;
        }
    };

    const handleEdit = (user: User) => {
        setEditUser(user);
        setShowAddModal(true);
    };

    const handleUpdate = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login_at'> & { password: string }) => {
        if (!editUser) return;

        try {
            // Normalize role - ensure it matches exactly
            const normalizedRole = String(userData.role).trim();
            const validRoles = ['Admin', 'Operator', 'Support'];
            
            if (!validRoles.includes(normalizedRole)) {
                throw new Error(`Invalid role: "${normalizedRole}". Must be one of: ${validRoles.join(', ')}`);
            }
            
            const updateData: any = {
                full_name: userData.full_name.trim(),
                role: normalizedRole,
                phone_number: userData.phone_number?.trim() || null,
            };

            // Only include password if provided (not empty)
            if (userData.password && userData.password.trim().length > 0) {
                updateData.password = userData.password;
            }

            console.log('Updating user:', {
                userId: editUser.id,
                updateData: {
                    ...updateData,
                    password: updateData.password ? '[REDACTED]' : undefined
                },
                oldRole: editUser.role,
                newRole: normalizedRole
            });

            const response = await fetch(`/api/users/${editUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                let errorData: any = {};
                try {
                    const text = await response.text();
                    errorData = text ? JSON.parse(text) : {};
                } catch (parseError) {
                    errorData = { error: response.statusText || 'Unknown error occurred' };
                }
                
                console.error('Failed to update user:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData: errorData
                });
                
                throw new Error(errorData.error || errorData.details || `Failed to update user (${response.status})`);
            }

            const result = await response.json();
            console.log('User updated successfully:', result);
            
            await fetchUsers();
            setEditUser(null);
            setShowAddModal(false);
        } catch (error: any) {
            console.error('Error in handleUpdate:', error);
            throw error;
        }
    };

    const handleDelete = async (id: string) => {
        const user = users.find(u => u.id === id);
        const userName = user?.full_name || user?.username || 'this user';
        if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Failed to delete user');
            }

            await fetchUsers();
        } catch (error: any) {
            alert(error.message || 'Failed to delete user');
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditUser(null);
    };

    const roleCounts = {
        Admin: users.filter(u => u.role === 'Admin').length,
        Operator: users.filter(u => u.role === 'Operator').length,
        Support: users.filter(u => u.role === 'Support').length,
    };

    if (isLoading) {
        return (
            <main className="p-6 space-y-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading users...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <Shield className="h-8 w-8 text-primary" />
                            User Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage platform users and their access privileges.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add User
                    </Button>
                </div>

                {error && (
                    <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                        Error: {error}
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-sm text-muted-foreground">Total Users</div>
                        <div className="text-2xl font-bold mt-1">{users.length}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-sm text-muted-foreground">Admins</div>
                        <div className="text-2xl font-bold mt-1">{roleCounts.Admin}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-sm text-muted-foreground">Operators</div>
                        <div className="text-2xl font-bold mt-1">{roleCounts.Operator}</div>
                    </div>
                </div>

                <UsersTable
                    users={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <AddUserModal
                    isOpen={showAddModal}
                    onClose={handleCloseModal}
                    onSave={editUser ? handleUpdate : handleAdd}
                    editUser={editUser}
                />
            </main>
        </div>
    );
}
