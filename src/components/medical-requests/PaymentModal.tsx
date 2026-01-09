"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId: string;
    onSave: (data: {
        paymentAmount: number;
        paymentDate: string;
        paymentReference: string;
    }) => Promise<void>;
}

export function PaymentModal({ isOpen, onClose, onSave, requestId }: PaymentModalProps) {
    const [formData, setFormData] = useState({
        paymentAmount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentReference: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.paymentAmount <= 0) {
            setError("Payment amount must be greater than 0.");
            return;
        }

        if (!formData.paymentReference.trim()) {
            setError("Please provide a payment reference.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(formData);
            setFormData({
                paymentAmount: 0,
                paymentDate: new Date().toISOString().split('T')[0],
                paymentReference: "",
            });
            onClose();
        } catch (error: any) {
            setError(error?.message || 'Failed to save payment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-2xl mx-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Record Payment</h2>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Payment Amount *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            value={formData.paymentAmount}
                            onChange={(e) => setFormData({ ...formData, paymentAmount: parseFloat(e.target.value) || 0 })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Payment Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.paymentDate}
                            onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Payment Reference *</label>
                        <input
                            type="text"
                            required
                            value={formData.paymentReference}
                            onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Invoice number, receipt number, etc."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Payment'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
