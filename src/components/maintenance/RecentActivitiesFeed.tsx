"use client";

import { MaintenanceLog } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Users } from 'lucide-react';

interface RecentActivitiesFeedProps {
    logs: MaintenanceLog[];
}

const activityColors: Record<MaintenanceLog['activity'], string> = {
    'Pruning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Fertilizer Application': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Herbicide Application': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Slashing': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'Ring Weeding': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

export function RecentActivitiesFeed({ logs }: RecentActivitiesFeedProps) {
    // Get last 10 activities, sorted by date (newest first)
    const recentLogs = [...logs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

    if (recentLogs.length === 0) {
        return (
            <div className="rounded-xl border bg-card shadow-sm p-8 text-center text-muted-foreground">
                No recent activities. Add maintenance logs to see activity feed.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">Recent Activities</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Last 10 maintenance activities
                </p>
            </div>
            <div className="divide-y divide-border">
                {recentLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge className={activityColors[log.activity]}>
                                        {log.activity}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(log.date).toLocaleDateString(undefined, {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {log.blockId}
                                    </span>
                                    {log.supervisorName && (
                                        <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {log.supervisorName}
                                        </span>
                                    )}
                                    {log.staffCount && (
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {log.staffCount} staff
                                        </span>
                                    )}
                                </div>
                                {log.notes && (
                                    <p className="text-sm text-muted-foreground italic mt-1">
                                        "{log.notes}"
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
