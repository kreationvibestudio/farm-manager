"use client";

import { create } from 'zustand';
import { InventoryItem, Vehicle, HarvestLog, Staff, MaintenanceLog } from '@/types';

interface AppState {
    // Inventory
    inventory: InventoryItem[];
    isLoading: boolean;
    error: string | null;
    fetchInventory: () => Promise<void>;
    addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => Promise<void>;
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
    deleteInventoryItem: (id: string) => Promise<void>;
    adjustStock: (id: string, delta: number) => Promise<void>;

    // Vehicles
    vehicles: Vehicle[];
    fetchVehicles: () => Promise<void>;
    addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
    deleteVehicle: (id: string) => Promise<void>;

    // Harvest Logs
    harvestLogs: HarvestLog[];
    fetchHarvestLogs: () => Promise<void>;
    addHarvestLog: (log: Omit<HarvestLog, 'id'>) => Promise<void>;
    updateHarvestLog: (id: string, updates: Partial<HarvestLog>) => Promise<void>;
    deleteHarvestLog: (id: string) => Promise<void>;

    // Staff
    staff: Staff[];
    fetchStaff: () => Promise<void>;
    addStaff: (staff: Omit<Staff, 'id'>) => Promise<void>;
    updateStaff: (id: string, updates: Partial<Staff>) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;

    // Maintenance
    maintenanceLogs: MaintenanceLog[];
    fetchMaintenanceLogs: () => Promise<void>;
    addMaintenanceLog: (log: Omit<MaintenanceLog, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateMaintenanceLog: (id: string, updates: Partial<MaintenanceLog>) => Promise<void>;
    deleteMaintenanceLog: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Initial state
    inventory: [],
    vehicles: [],
    harvestLogs: [],
    staff: [],
    maintenanceLogs: [],
    isLoading: false,
    error: null,

    // Inventory actions
    fetchInventory: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/inventory');
            if (!response.ok) throw new Error('Failed to fetch inventory');
            const data = await response.json();
            set({ inventory: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addInventoryItem: async (item) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            });
            if (!response.ok) throw new Error('Failed to add item');
            const newItem = await response.json();
            set((state) => ({
                inventory: [...state.inventory, newItem],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateInventoryItem: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/inventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update item');
            const updatedItem = await response.json();
            set((state) => ({
                inventory: state.inventory.map(item =>
                    item.id === id ? updatedItem : item
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteInventoryItem: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/inventory/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete item');
            set((state) => ({
                inventory: state.inventory.filter(item => item.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    adjustStock: async (id, delta) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/inventory/${id}/adjust`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delta }),
            });
            if (!response.ok) throw new Error('Failed to adjust stock');
            const updatedItem = await response.json();
            set((state) => ({
                inventory: state.inventory.map(item =>
                    item.id === id ? updatedItem : item
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Vehicle actions
    fetchVehicles: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/vehicles');
            if (!response.ok) throw new Error('Failed to fetch vehicles');
            const data = await response.json();
            set({ vehicles: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addVehicle: async (vehicle) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehicle),
            });
            if (!response.ok) throw new Error('Failed to add vehicle');
            const newVehicle = await response.json();
            set((state) => ({
                vehicles: [...state.vehicles, newVehicle],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateVehicle: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/vehicles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update vehicle');
            const updatedVehicle = await response.json();
            set((state) => ({
                vehicles: state.vehicles.map(v =>
                    v.id === id ? updatedVehicle : v
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteVehicle: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/vehicles/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete vehicle');
            set((state) => ({
                vehicles: state.vehicles.filter(v => v.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Harvest Log actions
    fetchHarvestLogs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/harvest');
            if (!response.ok) throw new Error('Failed to fetch harvest logs');
            const data = await response.json();
            set({ harvestLogs: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addHarvestLog: async (log) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/harvest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(log),
            });
            if (!response.ok) throw new Error('Failed to add harvest log');
            const newLog = await response.json();
            set((state) => ({
                harvestLogs: [...state.harvestLogs, newLog],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateHarvestLog: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/harvest/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update harvest log');
            const updatedLog = await response.json();
            set((state) => ({
                harvestLogs: state.harvestLogs.map(log =>
                    log.id === id ? updatedLog : log
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteHarvestLog: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/harvest/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete harvest log');
            set((state) => ({
                harvestLogs: state.harvestLogs.filter(log => log.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Staff actions
    fetchStaff: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/staff');
            if (!response.ok) throw new Error('Failed to fetch staff');
            const data = await response.json();
            set({ staff: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addStaff: async (staff) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(staff),
            });
            if (!response.ok) throw new Error('Failed to add staff');
            const newStaff = await response.json();
            set((state) => ({
                staff: [...state.staff, newStaff],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateStaff: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/staff/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update staff');
            const updatedStaff = await response.json();
            set((state) => ({
                staff: state.staff.map(s =>
                    s.id === id ? updatedStaff : s
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteStaff: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/staff/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete staff');
            set((state) => ({
                staff: state.staff.filter(s => s.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Maintenance actions
    fetchMaintenanceLogs: async () => {
        set({ isLoading: true, error: null });
        try {
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch('/api/maintenance', {
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                // If 500 error, might be missing table - handle gracefully
                if (response.status === 500) {
                    const errorData = await response.json().catch(() => ({}));
                    if (errorData.error?.includes('does not exist')) {
                        set({ maintenanceLogs: [], isLoading: false, error: null });
                        return;
                    }
                }
                throw new Error('Failed to fetch maintenance logs');
            }
            const data = await response.json();
            set({ maintenanceLogs: data || [], isLoading: false });
        } catch (error: any) {
            // Handle abort/timeout gracefully
            if (error.name === 'AbortError') {
                set({ error: 'Request timeout. Please try again.', isLoading: false });
            } else {
                // If table doesn't exist, just set empty array
                if (error.message?.includes('does not exist')) {
                    set({ maintenanceLogs: [], isLoading: false, error: null });
                } else {
                    set({ error: error.message || 'Failed to fetch maintenance logs', isLoading: false });
                }
            }
        }
    },

    addMaintenanceLog: async (log) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(log),
            });
            if (!response.ok) throw new Error('Failed to add maintenance log');
            const newLog = await response.json();
            set((state) => ({
                maintenanceLogs: [newLog, ...state.maintenanceLogs],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateMaintenanceLog: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/maintenance/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update maintenance log');
            const updatedLog = await response.json();
            set((state) => ({
                maintenanceLogs: state.maintenanceLogs.map(l =>
                    l.id === id ? updatedLog : l
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteMaintenanceLog: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/maintenance/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete maintenance log');
            set((state) => ({
                maintenanceLogs: state.maintenanceLogs.filter(l => l.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },
}));
