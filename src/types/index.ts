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
    weightKg: number;
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
    totalHarvestKg: number;
    activeVehicles: number;
    alerts: number;
}
