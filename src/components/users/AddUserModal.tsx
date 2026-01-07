"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { X, Eye, EyeOff } from "lucide-react";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login_at'> & { password: string }) => Promise<void>;
    editUser?: User | null;
}

export function AddUserModal({ isOpen, onClose, onSave, editUser }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        role: 'Support' as User['role'],
        phone_number: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (editUser) {
            setFormData({
                username: editUser.username,
                password: '', // Don't pre-fill password
                full_name: editUser.full_name,
                role: editUser.role,
                phone_number: editUser.phone_number || '',
            });
        } else {
            setFormData({
                username: '',
                password: '',
                full_name: '',
                role: 'Support',
                phone_number: '',
            });
        }
        setErrorMessage('');
        setShowPassword(false);
    }, [editUser, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        // Validation
        if (!editUser && !formData.password) {
            setErrorMessage('Password is required for new users');
            setIsSubmitting(false);
            return;
        }

        if (formData.password && formData.password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long');
            setIsSubmitting(false);
            return;
        }

        try {
            await onSave({
                username: formData.username.trim(),
                password: formData.password,
                full_name: formData.full_name.trim(),
                role: formData.role.trim() as User['role'], // Ensure role is trimmed and typed correctly
                phone_number: formData.phone_number?.trim() || undefined,
                must_change_password: editUser ? editUser.must_change_password : true,
            });
            onClose();
            setFormData({
                username: '',
                password: '',
                full_name: '',
                role: 'Support',
                phone_number: '',
            });
            setErrorMessage('');
        } catch (error: any) {
            console.error('Error saving user:', error);
            const message = error?.message || 'Failed to save user. Please try again.';
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
                        {editUser ? 'Edit User' : 'Add New User'}
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
                            Username *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., johndoe"
                            disabled={!!editUser} // Can't change username when editing
                        />
                        {editUser && (
                            <p className="text-xs text-muted-foreground mt-1">Username cannot be changed</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {editUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required={!editUser}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder={editUser ? "Enter new password (optional)" : "Minimum 8 characters"}
                                minLength={editUser ? undefined : 8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {!editUser && (
                            <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters long</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Role *
                        </label>
                        <select
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Admin">Admin - Full privileges</option>
                            <option value="Operator">Operator - Can add staff only</option>
                            <option value="Support">Support - Can only view</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., 08012345678"
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
                            {isSubmitting ? 'Saving...' : editUser ? 'Update User' : 'Add User'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
