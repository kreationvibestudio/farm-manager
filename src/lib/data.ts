import { InventoryItem, Vehicle, HarvestLog, Staff } from "@/types";

export const mockInventory: InventoryItem[] = [
    { id: "1", name: "NPK Create", category: "Fertilizer", quantity: 45, unit: "bags", minLevel: 10, lastUpdated: "2024-03-01" },
    { id: "2", name: "Roundup", category: "Herbicide", quantity: 12, unit: "L", minLevel: 20, lastUpdated: "2024-02-28" },
    { id: "3", name: "Diesel", category: "Fuel", quantity: 1200, unit: "L", minLevel: 500, lastUpdated: "2024-03-02" },
    { id: "4", name: "Tractor Tire", category: "Spare Part", quantity: 2, unit: "units", minLevel: 1, lastUpdated: "2024-01-15" },
];

export const mockVehicles: Vehicle[] = [
    { id: "v1", name: "Tractor 01", type: "Tractor", status: "Active", lastMaintenance: "2024-01-10" },
    { id: "v2", name: "Tractor 02", type: "Tractor", status: "Maintenance", lastMaintenance: "2023-12-05" },
    { id: "v3", name: "Truck 01", type: "Truck", status: "Active", licensePlate: "ABC-123", lastMaintenance: "2024-02-20" },
];

export const mockStaff: Staff[] = [
    { id: "s1", name: "John Doe", role: "Manager" },
    { id: "s2", name: "Jane Smith", role: "Supervisor" },
    { id: "s3", name: "Bob Wilson", role: "Driver" },
];

export const mockHarvestLogs: HarvestLog[] = [
    { id: "h1", date: "2024-03-02", blockId: "Block A-12", bunches: 2400, supervisorId: "s2", vehicleId: "v3" },
    { id: "h2", date: "2024-03-02", blockId: "Block B-04", bunches: 1850, supervisorId: "s2", vehicleId: "v3" },
    { id: "h3", date: "2024-03-01", blockId: "Block A-11", bunches: 3200, supervisorId: "s2", vehicleId: "v3" },
];

export const harvestStats = [
    { name: 'Mon', ffb: 2400 },
    { name: 'Tue', ffb: 1398 },
    { name: 'Wed', ffb: 9800 },
    { name: 'Thu', ffb: 3908 },
    { name: 'Fri', ffb: 4800 },
    { name: 'Sat', ffb: 3800 },
    { name: 'Sun', ffb: 4300 },
];

export const oerStats = [
    { name: 'OER', value: 19.2, fill: '#16a34a' },
    { name: 'Remaining', value: 100 - 19.2, fill: '#e5e7eb' },
];

export const vehicleStats = [
    { name: 'Active', value: 8, color: '#16a34a' },
    { name: 'Maintenance', value: 2, color: '#ca8a04' },
    { name: 'OutOfService', value: 0, color: '#dc2626' },
];

