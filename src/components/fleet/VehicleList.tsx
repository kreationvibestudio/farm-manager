"use client";

import { Vehicle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Fuel, Wrench, Calendar, MapPin, Edit, Trash2 } from "lucide-react";

interface VehicleListProps {
    vehicles: Vehicle[];
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: "Active" | "Maintenance" | "Idle") => void;
}

export function VehicleList({ vehicles, onEdit, onDelete, onStatusChange }: VehicleListProps) {
    if (vehicles.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No vehicles in fleet. Add your first vehicle!
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => {
                const isMaintenance = vehicle.status === 'Maintenance';
                const isIdle = vehicle.status === 'Idle';
                return (
                    <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`h-2 w-full ${isMaintenance ? 'bg-amber-500' : isIdle ? 'bg-zinc-400' : 'bg-primary'}`} />
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2">
                                        {vehicle.type === 'Tractor' ? <Wrench className="h-5 w-5 text-muted-foreground" /> : <Truck className="h-5 w-5 text-muted-foreground" />}
                                        {vehicle.name}
                                    </CardTitle>
                                    <CardDescription>{vehicle.licensePlate || "No Plate"}</CardDescription>
                                </div>
                                <Badge variant={isMaintenance ? "warning" : isIdle ? "secondary" : "success"}>
                                    {vehicle.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-border text-muted-foreground">
                                <span className="flex items-center gap-2"><Fuel className="h-4 w-4" /> Fuel Level</span>
                                <span className="font-medium text-foreground">75%</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-border text-muted-foreground">
                                <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Last Location</span>
                                <span className="font-medium text-foreground">Mill Yard</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-border text-muted-foreground">
                                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Last Service</span>
                                <span className="font-medium text-foreground">{vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 flex gap-2">
                            <select
                                value={vehicle.status}
                                onChange={(e) => onStatusChange(vehicle.id, e.target.value as "Active" | "Maintenance" | "Idle")}
                                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Idle">Idle</option>
                            </select>
                            <Button variant="ghost" size="icon" onClick={() => onEdit(vehicle)} title="Edit">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(vehicle.id)} title="Delete">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    );
}
