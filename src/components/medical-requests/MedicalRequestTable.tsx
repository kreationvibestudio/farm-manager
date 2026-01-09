"use client";

import { useState } from "react";
import { MedicalRequest, MedicalRequestStatus, MedicalPaymentStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, AlertCircle, DollarSign, FileText } from "lucide-react";

interface MedicalRequestTableProps {
    requests: MedicalRequest[];
    currentUserRole?: 'Manager' | 'Supervisor' | 'Driver' | 'Worker';
    currentStaffId?: string;
    onApprove: (id: string, notes?: string) => Promise<void>;
    onReject: (id: string, notes?: string) => Promise<void>;
    onRecordPayment: (id: string, data: { paymentAmount: number; paymentDate: string; paymentReference: string }) => Promise<void>;
}

export function MedicalRequestTable({
    requests,
    currentUserRole,
    currentStaffId,
    onApprove,
    onReject,
    onRecordPayment,
}: MedicalRequestTableProps) {
    const [actionRequestId, setActionRequestId] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [paymentData, setPaymentData] = useState({
        paymentAmount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentReference: "",
    });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    const getStatusColor = (status: MedicalRequestStatus) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Approved by Supervisor':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Approved by Manager':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected by Supervisor':
            case 'Rejected by Manager':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'Emergency':
                return 'text-red-600 font-bold';
            case 'High':
                return 'text-orange-600 font-semibold';
            case 'Medium':
                return 'text-yellow-600';
            case 'Low':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    };

    const getPaymentStatusColor = (status?: MedicalPaymentStatus) => {
        if (!status) return 'text-gray-500';
        switch (status) {
            case 'Paid':
                return 'text-green-600 font-semibold';
            case 'Approved for Payment':
                return 'text-blue-600 font-semibold';
            case 'Rejected':
                return 'text-red-600';
            case 'Pending':
                return 'text-yellow-600';
            default:
                return 'text-gray-500';
        }
    };

    const canApprove = (request: MedicalRequest) => {
        if (currentUserRole === 'Manager') {
            return request.status === 'Approved by Supervisor';
        }
        if (currentUserRole === 'Supervisor') {
            return request.status === 'Pending';
        }
        return false;
    };

    const canReject = (request: MedicalRequest) => {
        if (currentUserRole === 'Manager') {
            return request.status === 'Approved by Supervisor';
        }
        if (currentUserRole === 'Supervisor') {
            return request.status === 'Pending';
        }
        return false;
    };

    const canRecordPayment = (request: MedicalRequest) => {
        return currentUserRole === 'Manager' && 
               request.status === 'Approved by Manager' && 
               request.isWorkRelated && 
               request.paymentStatus === 'Approved for Payment' &&
               request.paymentStatus !== 'Paid';
    };

    const handleActionClick = (id: string, type: 'approve' | 'reject') => {
        setActionRequestId(id);
        setActionType(type);
        setNotes("");
        setShowNotesModal(true);
    };

    const handleActionSubmit = async () => {
        if (!actionRequestId || !actionType) return;

        try {
            if (actionType === 'approve') {
                await onApprove(actionRequestId, notes || undefined);
            } else {
                await onReject(actionRequestId, notes || undefined);
            }
            setShowNotesModal(false);
            setActionRequestId(null);
            setActionType(null);
            setNotes("");
        } catch (error) {
            console.error('Error performing action:', error);
        }
    };

    const handlePaymentClick = (id: string) => {
        setSelectedRequestId(id);
        setPaymentData({
            paymentAmount: 0,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentReference: "",
        });
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = async () => {
        if (!selectedRequestId) return;
        try {
            await onRecordPayment(selectedRequestId, paymentData);
            setShowPaymentModal(false);
            setSelectedRequestId(null);
        } catch (error) {
            console.error('Error recording payment:', error);
        }
    };

    if (requests.length === 0) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No medical requests found.</p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Staff</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Reason</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Work Related</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Urgency</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Payment</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {requests.map((request) => (
                                <tr key={request.id} className="hover:bg-muted/50">
                                    <td className="px-4 py-3 text-sm">
                                        {new Date(request.requestDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium">
                                        {request.staffName || 'Unknown'}
                                    </td>
                                    <td className="px-4 py-3 text-sm max-w-xs">
                                        <div className="truncate" title={request.reason}>
                                            {request.reason}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {request.isWorkRelated ? (
                                            <span className="inline-flex items-center gap-1 text-green-600">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">No</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={getUrgencyColor(request.urgency)}>
                                            {request.urgency}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                            {request.status === 'Pending' && <Clock className="h-3 w-3" />}
                                            {request.status.includes('Approved') && <CheckCircle2 className="h-3 w-3" />}
                                            {request.status.includes('Rejected') && <XCircle className="h-3 w-3" />}
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {request.paymentStatus ? (
                                            <span className={getPaymentStatusColor(request.paymentStatus)}>
                                                {request.paymentStatus}
                                                {request.paymentAmount && (
                                                    <span className="ml-1">({request.paymentAmount.toLocaleString()})</span>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            {canApprove(request) && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleActionClick(request.id, 'approve')}
                                                    className="h-7 text-xs"
                                                >
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Approve
                                                </Button>
                                            )}
                                            {canReject(request) && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleActionClick(request.id, 'reject')}
                                                    className="h-7 text-xs text-red-600 hover:text-red-700"
                                                >
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Reject
                                                </Button>
                                            )}
                                            {canRecordPayment(request) && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handlePaymentClick(request.id)}
                                                    className="h-7 text-xs"
                                                >
                                                    <DollarSign className="h-3 w-3 mr-1" />
                                                    Record Payment
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notes Modal */}
            {showNotesModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotesModal(false)} />
                    <div className="relative w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-2xl mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    rows={4}
                                    placeholder="Add any notes or comments..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setShowNotesModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handleActionSubmit} className="flex-1">
                                    {actionType === 'approve' ? 'Approve' : 'Reject'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
                    <div className="relative w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-2xl mx-4">
                        <h3 className="text-lg font-semibold mb-4">Record Payment</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Payment Amount *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    required
                                    value={paymentData.paymentAmount}
                                    onChange={(e) => setPaymentData({ ...paymentData, paymentAmount: parseFloat(e.target.value) || 0 })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Payment Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={paymentData.paymentDate}
                                    onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Payment Reference *</label>
                                <input
                                    type="text"
                                    required
                                    value={paymentData.paymentReference}
                                    onChange={(e) => setPaymentData({ ...paymentData, paymentReference: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Invoice number, receipt number, etc."
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handlePaymentSubmit} className="flex-1">
                                    Save Payment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
