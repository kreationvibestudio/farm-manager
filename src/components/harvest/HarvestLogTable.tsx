"use client";

import { HarvestLog } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Scale, User, Truck, Trash2 } from "lucide-react";

interface HarvestLogTableProps {
    logs: HarvestLog[];
    onDelete: (id: string) => void;
}

export function HarvestLogTable({ logs, onDelete }: HarvestLogTableProps) {
    if (logs.length === 0) {
        return (
            <div className="rounded-xl border bg-card shadow-sm p-8 text-center text-muted-foreground">
                No harvest logs yet. Add your first harvest!
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
                            <th className="p-4">Yield (FFB)</th>
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
                                    <div className="flex items-center gap-2 font-bold text-lg">
                                        <Scale className="h-4 w-4 text-secondary" />
                                        {log.weightKg.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">kg</span>
                                    </div>
                                </td>
                                <td className="p-4 text-muted-foreground text-xs space-y-1">
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" /> Supervisor: <span className="text-foreground">{log.supervisorId}</span>
                                    </div>
                                    {log.vehicleId && (
                                        <div className="flex items-center gap-1">
                                            <Truck className="h-3 w-3" /> Vehicle: <span className="text-foreground">{log.vehicleId}</span>
                                        </div>
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
