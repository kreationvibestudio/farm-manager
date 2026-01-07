"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validatePassword, getPasswordStrengthColor } from "@/lib/utils/password-validation";

export default function ChangePasswordPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState<{ isValid: boolean; errors: string[]; strength: 'weak' | 'medium' | 'strong' } | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        // Check if user needs to change password
        if (status === "authenticated" && session?.user) {
            const mustChange = (session.user as any)?.mustChangePassword;
            if (!mustChange) {
                router.push("/");
            }
        }
    }, [session, status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        // Validate password strength
        const validation = validatePassword(formData.newPassword);
        if (!validation.isValid) {
            setError(validation.errors.join('. ') || "Password does not meet requirements");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError("New password must be different from current password");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to change password');
            }

            setSuccess(true);
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            // Sign out and redirect to login immediately so user can log in with new password
            // This ensures the session is refreshed with the updated must_change_password flag
            setTimeout(() => {
                signOut({ 
                    callbackUrl: "/login",
                    redirect: true 
                });
            }, 1000); // Reduced to 1 second - just enough to show success message
        } catch (error: any) {
            setError(error.message || "Failed to change password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        You must change your password before continuing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center py-4">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <p className="text-green-600 font-medium mb-2">Password changed successfully!</p>
                            <p className="text-sm text-muted-foreground">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 flex items-center gap-2">
                                    <XCircle className="h-4 w-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="currentPassword" className="block text-sm font-medium">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={formData.currentPassword}
                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                        required
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="newPassword" className="block text-sm font-medium">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={formData.newPassword}
                                        onChange={(e) => {
                                            const newPassword = e.target.value;
                                            setFormData({ ...formData, newPassword });
                                            if (newPassword) {
                                                setPasswordValidation(validatePassword(newPassword));
                                            } else {
                                                setPasswordValidation(null);
                                            }
                                        }}
                                        required
                                        minLength={8}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Enter new password (min 8 characters)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordValidation && (
                                    <div className="space-y-1">
                                        <p className={`text-xs font-medium ${getPasswordStrengthColor(passwordValidation.strength)}`}>
                                            Password Strength: {passwordValidation.strength.toUpperCase()}
                                        </p>
                                        {passwordValidation.errors.length > 0 && (
                                            <ul className="text-xs text-red-600 space-y-0.5">
                                                {passwordValidation.errors.map((err, idx) => (
                                                    <li key={idx}>• {err}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {passwordValidation.isValid && (
                                            <p className="text-xs text-green-600">✓ Password meets all requirements</p>
                                        )}
                                    </div>
                                )}
                                {!passwordValidation && (
                                    <p className="text-xs text-muted-foreground">
                                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        minLength={8}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Changing Password...
                                    </>
                                ) : (
                                    "Change Password"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
