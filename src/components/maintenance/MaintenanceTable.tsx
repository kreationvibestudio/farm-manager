"use client";

import { MaintenanceLog } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Trash2, Users } from "lucide-react";

interface MaintenanceTableProps {
    logs: MaintenanceLog[];
    onDelete: (id: string) => void;
}

const activityColors: Record<MaintenanceLog['activity'], string> = {
    'Slashing': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'Pruning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Ring Weeding': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Fertilizer Application': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export function MaintenanceTable({ logs, onDelete }: MaintenanceTableProps) {
    if (logs.length === 0) {
        return (
            <div className="rounded-xl border bg-card shadow-sm p-8 text-center text-muted-foreground">
                No maintenance logs yet. Add your first maintenance activity!
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Block Location</th>
                            <th className="p-4">Activity</th>
                            <th className="p-4">Details</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-foreground font-medium">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="gap-1 bg-muted/50 font-normal">
                                            <MapPin className="h-3 w-3" /> {log.blockId}
                                        </Badge>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge className={activityColors[log.activity]}>
                                        {log.activity}
                                    </Badge>
                                </td>
                                <td className="p-4 text-muted-foreground text-xs space-y-1">
                                    {log.supervisorName && (
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" /> Supervisor: <span className="text-foreground font-medium">{log.supervisorName}</span>
                                        </div>
                                    )}
                                    {log.staffCount && (
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3" /> Staff: <span className="text-foreground font-medium">{log.staffCount}</span>
                                        </div>
                                    )}
                                    {log.notes && (
                                        <div className="text-foreground mt-1">{log.notes}</div>
                                    )}
                                    {!log.supervisorName && !log.staffCount && !log.notes && (
                                        <span className="text-muted-foreground">No details</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => onDelete(log.id)}
                                        title="Delete log"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
