"use client";

import { AuditLog } from "@/lib/api/audit";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText } from "lucide-react";

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

// Helper function to get resource name from data
const getResourceName = (log: AuditLog): string => {
    const data = log.new_data || log.old_data;
    if (!data) return log.resource_type;
    
    // Extract meaningful name based on resource type
    switch (log.resource_type) {
        case 'vehicles':
            return data.name || data.license_plate || 'Vehicle';
        case 'staff':
            return data.name || 'Staff Member';
        case 'inventory_items':
            return data.name || 'Inventory Item';
        case 'harvest_logs':
            return `Harvest - Block ${data.blockId || data.block_id || 'N/A'}`;
        case 'maintenance_logs':
            return `Maintenance - Block ${data.blockId || data.block_id || 'N/A'}`;
        case 'auth':
            return data.username || data.userId || 'User';
        default:
            return log.resource_type;
    }
};

// Helper function to format resource type for display
const formatResourceType = (resourceType: string): string => {
    const typeMap: Record<string, string> = {
        'vehicles': 'Vehicle',
        'staff': 'Staff',
        'inventory_items': 'Inventory',
        'harvest_logs': 'Harvest Log',
        'maintenance_logs': 'Maintenance Log',
        'auth': 'Authentication',
    };
    return typeMap[resourceType] || resourceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper function to format details in a readable way
const formatDetails = (log: AuditLog): string => {
    if (log.action === 'LOGIN') {
        return `User logged in`;
    }
    if (log.action === 'LOGOUT') {
        return `User logged out`;
    }
    
    if (log.action === 'CREATE' && log.new_data) {
        const data = log.new_data;
        const parts: string[] = [];
        
        if (data.name) parts.push(data.name);
        if (data.type) parts.push(`Type: ${data.type}`);
        if (data.role) parts.push(`Role: ${data.role}`);
        if (data.status) parts.push(`Status: ${data.status}`);
        if (data.licensePlate || data.license_plate) parts.push(`Plate: ${data.licensePlate || data.license_plate}`);
        if (data.blockId || data.block_id) parts.push(`Block: ${data.blockId || data.block_id}`);
        if (data.activity) parts.push(`Activity: ${data.activity}`);
        if (data.bunches) parts.push(`Bunches: ${data.bunches}`);
        if (data.category) parts.push(`Category: ${data.category}`);
        if (data.quantity !== undefined) parts.push(`Quantity: ${data.quantity}`);
        if (data.staffCount || data.staff_count) parts.push(`Staff: ${data.staffCount || data.staff_count}`);
        if (data.date) parts.push(`Date: ${new Date(data.date).toLocaleDateString()}`);
        
        return parts.length > 0 ? parts.join(', ') : 'Created';
    }
    
    if (log.action === 'UPDATE' && (log.old_data || log.new_data)) {
        const oldData = log.old_data || {};
        const newData = log.new_data || {};
        const changes: string[] = [];
        
        // Check for common fields that might have changed
        const fieldsToCheck = ['name', 'status', 'role', 'type', 'licensePlate', 'license_plate', 'quantity', 'blockId', 'block_id', 'activity', 'bunches', 'staffCount', 'staff_count', 'date'];
        
        fieldsToCheck.forEach(field => {
            const oldValue = oldData[field];
            const newValue = newData[field];
            if (oldValue !== undefined && newValue !== undefined && oldValue !== newValue) {
                const fieldName = field === 'blockId' || field === 'block_id' ? 'Block' : 
                                 field === 'staffCount' || field === 'staff_count' ? 'Staff Count' : field;
                changes.push(`${fieldName}: ${oldValue} → ${newValue}`);
            }
        });
        
        // If no specific changes found, show summary
        if (changes.length === 0) {
            return 'Updated';
        }
        
        return changes.join(', ');
    }
    
    if (log.action === 'DELETE' && log.old_data) {
        const data = log.old_data;
        const parts: string[] = [];
        
        // Handle different resource types
        if (data.name) parts.push(data.name);
        if (data.type) parts.push(`Type: ${data.type}`);
        if (data.role) parts.push(`Role: ${data.role}`);
        if (data.licensePlate || data.license_plate) parts.push(`Plate: ${data.licensePlate || data.license_plate}`);
        
        // Maintenance log specific fields
        if (data.blockId || data.block_id) parts.push(`Block: ${data.blockId || data.block_id}`);
        if (data.activity) parts.push(`Activity: ${data.activity}`);
        if (data.date) parts.push(`Date: ${new Date(data.date).toLocaleDateString()}`);
        if (data.staffCount || data.staff_count) parts.push(`Staff Count: ${data.staffCount || data.staff_count}`);
        if (data.notes) parts.push(`Notes: ${data.notes.substring(0, 30)}${data.notes.length > 30 ? '...' : ''}`);
        
        // Harvest log specific fields
        if (data.bunches) parts.push(`Bunches: ${data.bunches}`);
        
        // Inventory specific fields
        if (data.category) parts.push(`Category: ${data.category}`);
        if (data.quantity !== undefined) parts.push(`Quantity: ${data.quantity}`);
        
        return parts.length > 0 ? `Deleted: ${parts.join(', ')}` : 'Deleted';
    }
    
    return 'No details';
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
                                            <div className="font-medium">{formatResourceType(log.resource_type)}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {getResourceName(log)}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm">
                                    <div className="text-foreground">
                                        {formatDetails(log)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}




