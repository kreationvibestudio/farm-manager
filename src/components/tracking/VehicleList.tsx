"use client";

import { VehicleWithLocation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleListProps {
  vehicles: VehicleWithLocation[];
  selectedVehicle: string | null;
  onSelect: (id: string) => void;
}

export function VehicleList({ vehicles, selectedVehicle, onSelect }: VehicleListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Maintenance': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'OutOfService': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastSeen = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="p-4 space-y-2">
      <h3 className="font-semibold text-lg mb-4">Vehicles</h3>
      {vehicles.map(vehicle => {
        const hasLocation = !!vehicle.location;
        const isSelected = selectedVehicle === vehicle.id;

        return (
          <div
            key={vehicle.id}
            onClick={() => onSelect(vehicle.id)}
            className={cn(
              "p-4 rounded-lg border cursor-pointer transition-all",
              isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/50 hover:bg-muted/50",
              !hasLocation && "opacity-60"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{vehicle.name}</div>
                  <div className="text-xs text-muted-foreground">{vehicle.licensePlate || 'No Plate'}</div>
                </div>
              </div>
              <Badge className={getStatusColor(vehicle.status)}>
                {vehicle.status}
              </Badge>
            </div>

            {hasLocation ? (
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {vehicle.location!.latitude.toFixed(6)}, {vehicle.location!.longitude.toFixed(6)}
                </div>
                {vehicle.location!.speed && (
                  <div className="flex items-center gap-1">
                    <Gauge className="h-3 w-3" />
                    {vehicle.location!.speed.toFixed(1)} km/h
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatLastSeen(vehicle.location!.recordedAt)}
                </div>
              </div>
            ) : (
              <div className="text-xs text-red-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                No GPS signal
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
