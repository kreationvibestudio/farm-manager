"use client";

import { create } from 'zustand';
import { InventoryItem, Vehicle, HarvestLog } from '@/types';
import { mockInventory, mockVehicles, mockHarvestLogs } from '@/lib/data';

interface AppState {
    // Inventory
    inventory: InventoryItem[];
    addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
    deleteInventoryItem: (id: string) => void;
    adjustStock: (id: string, delta: number) => void;

    // Vehicles
    vehicles: Vehicle[];
    addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
    deleteVehicle: (id: string) => void;

    // Harvest Logs
    harvestLogs: HarvestLog[];
    addHarvestLog: (log: Omit<HarvestLog, 'id'>) => void;
    updateHarvestLog: (id: string, updates: Partial<HarvestLog>) => void;
    deleteHarvestLog: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Inventory
    inventory: [...mockInventory],
    addInventoryItem: (item) => set((state) => ({
        inventory: [...state.inventory, {
            ...item,
            id: `inv-${Date.now()}`,
            lastUpdated: new Date().toISOString().split('T')[0],
        }]
    })),
    updateInventoryItem: (id, updates) => set((state) => ({
        inventory: state.inventory.map(item =>
            item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : item
        )
    })),
    deleteInventoryItem: (id) => set((state) => ({
        inventory: state.inventory.filter(item => item.id !== id)
    })),
    adjustStock: (id, delta) => set((state) => ({
        inventory: state.inventory.map(item =>
            item.id === id ? {
                ...item,
                quantity: Math.max(0, item.quantity + delta),
                lastUpdated: new Date().toISOString().split('T')[0]
            } : item
        )
    })),

    // Vehicles
    vehicles: [...mockVehicles],
    addVehicle: (vehicle) => set((state) => ({
        vehicles: [...state.vehicles, {
            ...vehicle,
            id: `v-${Date.now()}`,
        }]
    })),
    updateVehicle: (id, updates) => set((state) => ({
        vehicles: state.vehicles.map(v =>
            v.id === id ? { ...v, ...updates } : v
        )
    })),
    deleteVehicle: (id) => set((state) => ({
        vehicles: state.vehicles.filter(v => v.id !== id)
    })),

    // Harvest Logs
    harvestLogs: [...mockHarvestLogs],
    addHarvestLog: (log) => set((state) => ({
        harvestLogs: [...state.harvestLogs, {
            ...log,
            id: `h-${Date.now()}`,
        }]
    })),
    updateHarvestLog: (id, updates) => set((state) => ({
        harvestLogs: state.harvestLogs.map(log =>
            log.id === id ? { ...log, ...updates } : log
        )
    })),
    deleteHarvestLog: (id) => set((state) => ({
        harvestLogs: state.harvestLogs.filter(log => log.id !== id)
    })),
}));
