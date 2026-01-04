export type InventoryCategory = 'Fertilizer' | 'Herbicide' | 'Fuel' | 'Spare Part' | 'Tool' | 'Other';

export interface InventoryItem {
    id: string;
    name: string;
    category: InventoryCategory;
    quantity: number;
    unit: string; // e.g., 'kg', 'L', 'bags', 'units'
    minLevel: number; // Low stock alert threshold
    lastUpdated: string; // ISO Date
}

export type VehicleType = 'Tractor' | 'Truck' | 'Motorcycle' | 'Other';
export type VehicleStatus = 'Active' | 'Maintenance' | 'OutOfService';

export interface Vehicle {
    id: string;
    name: string; // e.g., "Tractor-01"
    type: VehicleType;
    status: VehicleStatus;
    licensePlate?: string;
    lastMaintenance?: string; // ISO Date
    currentDriverId?: string;
}

export interface HarvestLog {
    id: string;
    date: string; // ISO Date
    blockId: string; // e.g., "Block A"
    bunches: number; // Changed from weightKg - FFB is counted in bunches, not weighed
    supervisorId: string;
    supervisorName?: string | null; // Resolved name from staff table
    driverId?: string; // If transport is tracked
    driverName?: string | null; // Resolved name from staff table
    vehicleId?: string;
    vehicleName?: string | null; // Resolved vehicle name
    vehicleLicensePlate?: string | null; // Resolved license plate
    notes?: string;
}

export interface Staff {
    id: string;
    name: string;
    role: 'Manager' | 'Supervisor' | 'Driver' | 'Worker';
    contact?: string;
}

export interface DailySummary {
    date: string;
    totalHarvestBunches: number; // Changed from totalHarvestKg
    activeVehicles: number;
    alerts: number;
}

export interface VehicleLocation {
    id: string;
    vehicleId: string;
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    accuracy?: number;
    recordedAt: string; // Changed from timestamp to match database column
}

export interface VehicleWithLocation extends Vehicle {
    location?: VehicleLocation;
    lastSeen?: string;
}

// Farm Maintenance Types
export type MaintenanceActivity = 'Pruning' | 'Fertilizer Application' | 'Herbicide Application' | 'Slashing' | 'Ring Weeding';

export interface MaintenanceLog {
    id: string;
    date: string; // ISO Date
    blockId: string; // e.g., "Block A"
    activity: MaintenanceActivity;
    supervisorId?: string; // Optional supervisor ID
    supervisorName?: string | null; // Resolved name from staff table
    staffCount?: number; // Number of staff involved
    notes?: string;
    created_at?: string;
    updated_at?: string;
}
