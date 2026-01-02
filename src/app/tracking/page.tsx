"use client";

import { useState, useEffect } from "react";
import { MapContainer } from "@/components/tracking/MapContainer";
import { VehicleList } from "@/components/tracking/VehicleList";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin, Navigation } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { VehicleLocation, VehicleWithLocation } from "@/types";

export default function TrackingPage() {
  const { vehicles, fetchVehicles, isLoading: storeLoading, error: storeError } = useAppStore();
  const [locations, setLocations] = useState<Map<string, VehicleLocation>>(new Map());
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
    fetchLocations();
  }, [fetchVehicles]);

  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        fetchLocations();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/vehicles/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data: VehicleLocation[] = await response.json();
      
      const locationMap = new Map<string, VehicleLocation>();
      data.forEach(loc => {
        locationMap.set(loc.vehicleId, loc);
      });
      setLocations(locationMap);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const vehiclesWithLocations: VehicleWithLocation[] = vehicles.map(vehicle => ({
    ...vehicle,
    location: locations.get(vehicle.id),
    lastSeen: locations.get(vehicle.id)?.recordedAt,
  }));

  const vehiclesOnMap = vehiclesWithLocations.filter(v => v.location);

  if ((storeLoading || isLoading) && vehicles.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading vehicles and map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Navigation className="h-8 w-8 text-primary" />
                Vehicle GPS Tracking
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time location tracking of all vehicles in the plantation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className={isAutoRefresh ? 'bg-primary/10' : ''}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isAutoRefresh ? 'animate-spin' : ''}`} />
                {isAutoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </Button>
              <Button variant="outline" onClick={fetchLocations} disabled={isLoading}>
                <MapPin className="h-4 w-4 mr-2" />
                Refresh Now
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="text-sm text-muted-foreground">Total Vehicles</div>
              <div className="text-2xl font-bold mt-1">{vehicles.length}</div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="text-sm text-muted-foreground">Tracked</div>
              <div className="text-2xl font-bold mt-1 text-green-600">{vehiclesOnMap.length}</div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="text-sm text-muted-foreground">Active</div>
              <div className="text-2xl font-bold mt-1">
                {vehicles.filter(v => v.status === 'Active').length}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="text-sm text-muted-foreground">No Signal</div>
              <div className="text-2xl font-bold mt-1 text-red-600">
                {vehicles.length - vehiclesOnMap.length}
              </div>
            </div>
          </div>
        </div>

        {storeError && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            Error loading vehicles: {storeError}
          </div>
        )}

        <div className="flex-1 flex min-h-0" style={{ height: 'calc(100vh - 300px)' }}>
          <div className="flex-1 relative" style={{ minHeight: '100%' }}>
            <MapContainer
              vehicles={vehiclesWithLocations}
              selectedVehicle={selectedVehicle}
              onVehicleSelect={setSelectedVehicle}
            />
          </div>

          <div className="w-80 border-l border-border bg-card overflow-y-auto">
            <VehicleList
              vehicles={vehiclesWithLocations}
              selectedVehicle={selectedVehicle}
              onSelect={setSelectedVehicle}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
