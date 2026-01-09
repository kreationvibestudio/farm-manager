"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, FileText, AlertCircle } from "lucide-react";
import { CreateMedicalRequestModal } from "@/components/medical-requests/CreateMedicalRequestModal";
import { MedicalRequestTable } from "@/components/medical-requests/MedicalRequestTable";
import { MedicalRequest, MedicalRequestStatus, MedicalRequestUrgency } from "@/types";
import { useAppStore } from "@/lib/store";

export default function MedicalRequestsPage() {
    const { data: session } = useSession();
    const { staff, fetchStaff } = useAppStore();
    const [requests, setRequests] = useState<MedicalRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<MedicalRequestStatus | 'All'>('All');
    const [filterUrgency, setFilterUrgency] = useState<MedicalRequestUrgency | 'All'>('All');
    const [filterWorkRelated, setFilterWorkRelated] = useState<'All' | 'Yes' | 'No'>('All');
    const [currentStaffId, setCurrentStaffId] = useState<string | undefined>();
    const [currentUserRole, setCurrentUserRole] = useState<'Manager' | 'Supervisor' | 'Driver' | 'Worker' | undefined>();

    useEffect(() => {
        fetchStaff();
        fetchRequests();
    }, []);

    useEffect(() => {
        // Find current user's staff record
        if (session?.user && staff.length > 0) {
            const currentUser = session.user;
            const userId = currentUser.id;
            const userName = currentUser.name;
            
            // First, try to match by user_id (most reliable)
            let userStaff = staff.find(s => 
                s.userId && userId && s.userId === userId
            );
            
            // If no match by user_id, try name matching
            if (!userStaff && userName) {
                // Try exact match first
                userStaff = staff.find(s => 
                    s.name.toLowerCase().trim() === userName.toLowerCase().trim()
                );
                
                // If no exact match, try partial match
                if (!userStaff) {
                    const userNameLower = userName.toLowerCase().trim();
                    userStaff = staff.find(s => {
                        const staffName = s.name.toLowerCase().trim();
                        return staffName.includes(userNameLower) || userNameLower.includes(staffName);
                    });
                }
            }
            
            if (userStaff) {
                setCurrentStaffId(userStaff.id);
                setCurrentUserRole(userStaff.role);
            } else {
                // If user is Admin or Operator, allow access
                const userRole = (currentUser as any)?.role;
                if (userRole === 'Admin' || userRole === 'Operator') {
                    // Admins/Operators can view all requests and create on behalf of staff
                    console.log('User is Admin/Operator but not in staff table. Allowing full access.');
                } else {
                    console.log('User not found in staff table:', {
                        userId: userId,
                        sessionName: userName,
                        availableStaff: staff.map(s => ({ id: s.id, name: s.name, userId: s.userId }))
                    });
                }
            }
        }
    }, [session, staff]);

    const fetchRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/medical-requests');
            if (!response.ok) {
                throw new Error('Failed to fetch medical requests');
            }
            const data = await response.json();
            setRequests(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load medical requests');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateRequest = async (data: {
        staffId: string;
        reason: string;
        isWorkRelated: boolean;
        urgency: MedicalRequestUrgency;
    }) => {
        console.log('handleCreateRequest called with:', data);
        
        if (!data.staffId || data.staffId.trim() === '') {
            throw new Error('Staff ID is required. Please select a staff member.');
        }

        try {
            const response = await fetch('/api/medical-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    staffId: data.staffId,
                    requestDate: new Date().toISOString().split('T')[0],
                    reason: data.reason,
                    isWorkRelated: data.isWorkRelated,
                    urgency: data.urgency,
                }),
            });

            if (!response.ok) {
                let errorData: any = {};
                try {
                    const text = await response.text();
                    errorData = text ? JSON.parse(text) : {};
                } catch (parseError) {
                    // If JSON parsing fails, use status text
                    errorData = { error: response.statusText || 'Unknown error occurred' };
                }
                
                console.error('API error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData: errorData
                });
                
                // Provide more helpful error message
                const errorMessage = errorData.error || 
                                   errorData.details || 
                                   errorData.message ||
                                   `Failed to create medical request (${response.status}: ${response.statusText})`;
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Medical request created successfully:', result);
            await fetchRequests();
        } catch (error: any) {
            console.error('Error in handleCreateRequest:', error);
            throw error;
        }
    };

    const handleApprove = async (id: string, notes?: string) => {
        try {
            const response = await fetch(`/api/medical-requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'approve',
                    notes: notes || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to approve request');
            }

            await fetchRequests();
        } catch (err: any) {
            alert(err.message || 'Failed to approve request');
            throw err;
        }
    };

    const handleReject = async (id: string, notes?: string) => {
        try {
            const response = await fetch(`/api/medical-requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reject',
                    notes: notes || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to reject request');
            }

            await fetchRequests();
        } catch (err: any) {
            alert(err.message || 'Failed to reject request');
            throw err;
        }
    };

    const handleRecordPayment = async (
        id: string,
        paymentData: { paymentAmount: number; paymentDate: string; paymentReference: string }
    ) => {
        try {
            const response = await fetch(`/api/medical-requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentData,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to record payment');
            }

            await fetchRequests();
        } catch (err: any) {
            alert(err.message || 'Failed to record payment');
            throw err;
        }
    };

    // Filter requests
    const filteredRequests = requests.filter(request => {
        if (filterStatus !== 'All' && request.status !== filterStatus) return false;
        if (filterUrgency !== 'All' && request.urgency !== filterUrgency) return false;
        if (filterWorkRelated === 'Yes' && !request.isWorkRelated) return false;
        if (filterWorkRelated === 'No' && request.isWorkRelated) return false;
        return true;
    });

    // Role-based filtering: Staff see only their requests, Supervisors/Managers see all
    const visibleRequests = currentUserRole === 'Worker' || currentUserRole === 'Driver'
        ? filteredRequests.filter(r => r.staffId === currentStaffId)
        : filteredRequests;

    // Statistics
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        approved: requests.filter(r => r.status === 'Approved by Manager').length,
        rejected: requests.filter(r => r.status.includes('Rejected')).length,
        workRelated: requests.filter(r => r.isWorkRelated).length,
        pendingPayment: requests.filter(r => r.paymentStatus === 'Approved for Payment').length,
    };

    if (isLoading) {
        return (
            <main className="p-6 space-y-8">
                <div>Loading...</div>
            </main>
        );
    }

    return (
        <main className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Medical Requests</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage staff medical requests with approval workflow and payment tracking.
                    </p>
                </div>
                {(currentStaffId || 
                  (session?.user as any)?.role === 'Admin' || 
                  (session?.user as any)?.role === 'Operator' ||
                  currentUserRole === 'Manager') && (
                    <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
                        <Plus className="h-4 w-4" /> New Request
                    </Button>
                )}
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Error: {error}</span>
                </div>
            )}

            {!currentStaffId && (session?.user as any)?.role !== 'Admin' && (session?.user as any)?.role !== 'Operator' && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>You are not registered in the staff system. Please contact an administrator to create a medical request.</span>
                </div>
            )}

            {/* Statistics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Requests</div>
                    <div className="mt-2 text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Pending</div>
                    <div className="mt-2 text-2xl font-bold text-yellow-600">{stats.pending}</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Approved</div>
                    <div className="mt-2 text-2xl font-bold text-green-600">{stats.approved}</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Pending Payment</div>
                    <div className="mt-2 text-2xl font-bold text-blue-600">{stats.pendingPayment}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as MedicalRequestStatus | 'All')}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved by Supervisor">Approved by Supervisor</option>
                            <option value="Approved by Manager">Approved by Manager</option>
                            <option value="Rejected by Supervisor">Rejected by Supervisor</option>
                            <option value="Rejected by Manager">Rejected by Manager</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Urgency</label>
                        <select
                            value={filterUrgency}
                            onChange={(e) => setFilterUrgency(e.target.value as MedicalRequestUrgency | 'All')}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="All">All Urgencies</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Work Related</label>
                        <select
                            value={filterWorkRelated}
                            onChange={(e) => setFilterWorkRelated(e.target.value as 'All' | 'Yes' | 'No')}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="All">All</option>
                            <option value="Yes">Work Related Only</option>
                            <option value="No">Non-Work Related Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Requests Table */}
            <MedicalRequestTable
                requests={visibleRequests}
                currentUserRole={currentUserRole}
                currentStaffId={currentStaffId}
                onApprove={handleApprove}
                onReject={handleReject}
                onRecordPayment={handleRecordPayment}
            />

            {/* Create Modal */}
            <CreateMedicalRequestModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateRequest}
                staffName={currentStaffId ? (session?.user?.name ?? undefined) : undefined}
                staffId={currentStaffId}
                staffList={staff.map(s => ({ id: s.id, name: s.name }))}
                canSelectStaff={!currentStaffId && (
                    (session?.user as any)?.role === 'Admin' || 
                    (session?.user as any)?.role === 'Operator' ||
                    currentUserRole === 'Manager'
                )}
            />
        </main>
    );
}
