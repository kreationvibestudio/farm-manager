"use client";

import { Vehicle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, AlertCircle, Fuel, Wrench, Calendar, MapPin } from "lucide-react";

interface VehicleListProps {
    vehicles: Vehicle[];
}

export function VehicleList({ vehicles }: VehicleListProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => {
                const isMaintenance = vehicle.status === 'Maintenance';
                return (
                    <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`h-2 w-full ${isMaintenance ? 'bg-amber-500' : 'bg-primary'}`} />
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2">
                                        {vehicle.type === 'Tractor' ? <Wrench className="h-5 w-5 text-muted-foreground" /> : <Truck className="h-5 w-5 text-muted-foreground" />}
                                        {vehicle.name}
                                    </CardTitle>
                                    <CardDescription>{vehicle.licensePlate || "No Plate"}</CardDescription>
                                </div>
                                <Badge variant={isMaintenance ? "warning" : "success"}>
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
                        <CardFooter className="pt-2">
                            <Button variant="outline" className="w-full">
                                View Details
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    );
}
