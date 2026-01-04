"use client";

import { User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, UserMinus, User } from "lucide-react";

interface UsersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
}

const roleColors: Record<User['role'], string> = {
    Admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Operator: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Support: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const roleDescriptions: Record<User['role'], string> = {
    Admin: 'Full privileges - can manage all aspects of the platform',
    Operator: 'Can add staff only',
    Support: 'Can only view',
};

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Username</th>
                            <th className="p-4">Full Name</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                    No users found. Add your first user!
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="font-medium">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">{user.full_name}</td>
                                    <td className="p-4">
                                        <Badge className={roleColors[user.role]} title={roleDescriptions[user.role]}>
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {user.phone_number || 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        {user.must_change_password ? (
                                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                Password Reset Required
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                Active
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => onEdit(user)}
                                                title="Edit user"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => onDelete(user.id)}
                                                title="Delete user"
                                            >
                                                <UserMinus className="h-4 w-4" />
                                            </Button>
                                        </div>
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
