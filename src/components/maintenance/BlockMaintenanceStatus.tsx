"use client";

import { MaintenanceLog } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface BlockMaintenanceStatusProps {
    logs: MaintenanceLog[];
}

export function BlockMaintenanceStatus({ logs }: BlockMaintenanceStatusProps) {
    // Get all unique blocks
    const uniqueBlocks = [...new Set(logs.map(log => log.blockId))].sort();

    // Get last maintenance date for each activity per block
    const getBlockStatus = (blockId: string) => {
        const blockLogs = logs.filter(log => log.blockId === blockId);
        
        const getLastDate = (activity: MaintenanceLog['activity']) => {
            const activityLogs = blockLogs.filter(log => log.activity === activity);
            if (activityLogs.length === 0) return null;
            return activityLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;
        };

        const getDaysAgo = (date: string) => {
            const today = new Date();
            const logDate = new Date(date);
            const diffTime = today.getTime() - logDate.getTime();
            return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        };

        const getStatusColor = (daysAgo: number | null) => {
            if (daysAgo === null) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            if (daysAgo <= 30) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            if (daysAgo <= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        };

        return {
            blockId,
            slashing: getLastDate('Slashing'),
            pruning: getLastDate('Pruning'),
            ringWeeding: getLastDate('Ring Weeding'),
            fertilizer: getLastDate('Fertilizer Application'),
            getStatusColor,
            getDaysAgo,
        };
    };

    const blockStatuses = uniqueBlocks.map(getBlockStatus);

    if (blockStatuses.length === 0) {
        return (
            <div className="rounded-xl border bg-card shadow-sm p-8 text-center text-muted-foreground">
                No block maintenance data available. Add maintenance logs to see block status.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">Block Maintenance Status</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Last maintenance date for each activity per block
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Block</th>
                            <th className="p-4">Slashing</th>
                            <th className="p-4">Pruning</th>
                            <th className="p-4">Ring Weeding</th>
                            <th className="p-4">Fertilizer</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {blockStatuses.map((status) => (
                            <tr key={status.blockId} className="hover:bg-muted/30 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2 font-medium">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {status.blockId}
                                    </div>
                                </td>
                                <td className="p-4">
                                    {status.slashing ? (
                                        <div className="flex items-center gap-2">
                                            <Badge className={status.getStatusColor(status.getDaysAgo(status.slashing))}>
                                                {status.getDaysAgo(status.slashing)}d ago
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(status.slashing).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">Never</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {status.pruning ? (
                                        <div className="flex items-center gap-2">
                                            <Badge className={status.getStatusColor(status.getDaysAgo(status.pruning))}>
                                                {status.getDaysAgo(status.pruning)}d ago
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(status.pruning).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">Never</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {status.ringWeeding ? (
                                        <div className="flex items-center gap-2">
                                            <Badge className={status.getStatusColor(status.getDaysAgo(status.ringWeeding))}>
                                                {status.getDaysAgo(status.ringWeeding)}d ago
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(status.ringWeeding).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">Never</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {status.fertilizer ? (
                                        <div className="flex items-center gap-2">
                                            <Badge className={status.getStatusColor(status.getDaysAgo(status.fertilizer))}>
                                                {status.getDaysAgo(status.fertilizer)}d ago
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(status.fertilizer).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">Never</span>
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
