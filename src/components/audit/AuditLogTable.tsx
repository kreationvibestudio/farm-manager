"use client";

import { AuditLog } from "@/lib/api/audit";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, MapPin, Globe, Monitor } from "lucide-react";

interface AuditLogTableProps {
    logs: AuditLog[];
}

const actionColors: Record<AuditLog['action'], string> = {
    'CREATE': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'UPDATE': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'DELETE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'LOGIN': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'LOGOUT': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'VIEW': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

export function AuditLogTable({ logs }: AuditLogTableProps) {
    if (logs.length === 0) {
        return (
            <div className="rounded-xl border bg-card shadow-sm p-8 text-center text-muted-foreground">
                No audit logs found. Audit logs will appear here once actions are performed.
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const truncateText = (text: string, maxLength: number = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Resource</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-foreground font-medium">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        {formatDate(log.created_at)}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{log.user_name || log.user_id}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge className={actionColors[log.action]}>
                                        {log.action}
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">{log.resource_type}</div>
                                            {log.resource_id && (
                                                <div className="text-xs text-muted-foreground">
                                                    ID: {truncateText(log.resource_id, 20)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-xs text-muted-foreground max-w-md">
                                    {log.action === 'DELETE' && log.old_data && (
                                        <div className="space-y-1">
                                            <div className="text-red-600 font-medium">Deleted Data:</div>
                                            <div className="bg-red-50 p-2 rounded text-xs font-mono overflow-x-auto">
                                                {JSON.stringify(log.old_data, null, 2).substring(0, 200)}
                                                {JSON.stringify(log.old_data).length > 200 && '...'}
                                            </div>
                                        </div>
                                    )}
                                    {log.action === 'UPDATE' && (
                                        <div className="space-y-1">
                                            {log.old_data && (
                                                <div>
                                                    <span className="text-red-600">Old:</span>{' '}
                                                    {truncateText(JSON.stringify(log.old_data), 30)}
                                                </div>
                                            )}
                                            {log.new_data && (
                                                <div>
                                                    <span className="text-green-600">New:</span>{' '}
                                                    {truncateText(JSON.stringify(log.new_data), 30)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {log.action === 'CREATE' && log.new_data && (
                                        <div className="text-green-600">
                                            Created: {truncateText(JSON.stringify(log.new_data), 50)}
                                        </div>
                                    )}
                                    {log.action === 'LOGIN' && (
                                        <div className="text-purple-600">Successful login</div>
                                    )}
                                    {log.action === 'LOGOUT' && (
                                        <div className="text-gray-600">User logged out</div>
                                    )}
                                    {!log.old_data && !log.new_data && log.action !== 'LOGIN' && log.action !== 'LOGOUT' && (
                                        <span className="text-muted-foreground">No details</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-xs">
                                        {log.ip_address ? (
                                            <>
                                                <Globe className="h-3 w-3 text-muted-foreground" />
                                                <span>{log.ip_address}</span>
                                            </>
                                        ) : (
                                            <span className="text-muted-foreground">N/A</span>
                                        )}
                                    </div>
                                    {log.user_agent && (
                                        <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                                            <Monitor className="h-3 w-3" />
                                            {truncateText(log.user_agent, 40)}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
