"use client";

import { useState, useEffect } from "react";
import { AuditLogTable } from "@/components/audit/AuditLogTable";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw, Filter, Download } from "lucide-react";
import { AuditLog } from "@/lib/api/audit";

export default function AuditLogPage() {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<{
        action?: string;
        resourceType?: string;
    }>({});

    const fetchAuditLogs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let url = '/api/audit?limit=500';
            if (filter.resourceType) {
                url += `&resource_type=${filter.resourceType}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch audit logs');
            }
            const data = await response.json();
            
            let filteredData = data;
            if (filter.action) {
                filteredData = filteredData.filter((log: AuditLog) => log.action === filter.action);
            }
            
            setAuditLogs(filteredData);
        } catch (error: any) {
            console.error('Error fetching audit logs:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, [filter]);

    const handleExport = () => {
        // Generate CSV content
        const headers = ["Timestamp", "User", "Action", "Resource Type", "Resource ID", "IP Address"];
        const rows = auditLogs.map(log => [
            new Date(log.created_at).toLocaleString(),
            log.user_name || log.user_id,
            log.action,
            log.resource_type,
            log.resource_id || "",
            log.ip_address || "",
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const actionCounts = {
        CREATE: auditLogs.filter(l => l.action === 'CREATE').length,
        UPDATE: auditLogs.filter(l => l.action === 'UPDATE').length,
        DELETE: auditLogs.filter(l => l.action === 'DELETE').length,
        LOGIN: auditLogs.filter(l => l.action === 'LOGIN').length,
        LOGOUT: auditLogs.filter(l => l.action === 'LOGOUT').length,
    };

    if (isLoading && auditLogs.length === 0) {
        return (
            <main className="p-6 space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading audit logs...</p>
            </main>
        );
    }

    return (
        <main className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        Audit Logs
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Complete history of all user actions and system changes.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={fetchAuditLogs} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                    Error: {error}
                    {error.includes('does not exist') && (
                        <div className="mt-2 text-sm">
                            Please run <code className="bg-red-100 px-2 py-1 rounded">supabase-audit-log-schema.sql</code> in Supabase Dashboard.
                        </div>
                    )}
                </div>
            )}

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Logs</div>
                    <div className="mt-2 text-2xl font-bold">{auditLogs.length}</div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Created</div>
                    <div className="mt-2 text-2xl font-bold text-green-600">{actionCounts.CREATE}</div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Updated</div>
                    <div className="mt-2 text-2xl font-bold text-blue-600">{actionCounts.UPDATE}</div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Deleted</div>
                    <div className="mt-2 text-2xl font-bold text-red-600">{actionCounts.DELETE}</div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Logins</div>
                    <div className="mt-2 text-2xl font-bold text-purple-600">{actionCounts.LOGIN}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                    </div>
                    <select
                        value={filter.action || ''}
                        onChange={(e) => setFilter({ ...filter, action: e.target.value || undefined })}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">All Actions</option>
                        <option value="CREATE">Create</option>
                        <option value="UPDATE">Update</option>
                        <option value="DELETE">Delete</option>
                        <option value="LOGIN">Login</option>
                        <option value="LOGOUT">Logout</option>
                    </select>
                    <select
                        value={filter.resourceType || ''}
                        onChange={(e) => setFilter({ ...filter, resourceType: e.target.value || undefined })}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">All Resources</option>
                        <option value="maintenance_logs">Maintenance Logs</option>
                        <option value="harvest_logs">Harvest Logs</option>
                        <option value="staff">Staff</option>
                        <option value="inventory_items">Inventory</option>
                        <option value="vehicles">Vehicles</option>
                        <option value="auth">Authentication</option>
                    </select>
                    {(filter.action || filter.resourceType) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilter({})}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            <AuditLogTable logs={auditLogs} />
        </main>
    );
}
