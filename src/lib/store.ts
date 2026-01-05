"use client";

import { create } from 'zustand';
import {
  InventoryItem,
  Vehicle,
  HarvestLog,
  Staff,
  MaintenanceLog,
  CostEntry,
  CostCategory,
  SalesRecord,
  Budget,
  BudgetItem,
  BudgetCategory,
  FinancialSummary
} from '@/types';

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

    // Financial Management
    // Costs
    costEntries: CostEntry[];
    costCategories: CostCategory[];
    fetchCostEntries: (filters?: any) => Promise<void>;
    fetchCostCategories: () => Promise<void>;
    addCostEntry: (entry: Omit<CostEntry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>) => Promise<void>;
    updateCostEntry: (id: string, updates: Partial<CostEntry>) => Promise<void>;
    deleteCostEntry: (id: string) => Promise<void>;
    approveCostEntry: (id: string) => Promise<void>;

    // Sales
    salesRecords: SalesRecord[];
    fetchSalesRecords: (filters?: any) => Promise<void>;
    addSalesRecord: (record: Omit<SalesRecord, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>) => Promise<void>;
    updateSalesRecord: (id: string, updates: Partial<SalesRecord>) => Promise<void>;
    deleteSalesRecord: (id: string) => Promise<void>;
    updatePaymentStatus: (id: string, paymentReceived: number, status: string) => Promise<void>;

    // Budgets
    budgets: Budget[];
    budgetCategories: BudgetCategory[];
    fetchBudgets: (filters?: any) => Promise<void>;
    fetchBudgetCategories: () => Promise<void>;
    addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>) => Promise<void>;
    updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;
    getBudgetItems: (budgetId: string) => Promise<BudgetItem[]>;
    addBudgetItem: (item: Omit<BudgetItem, 'id' | 'createdAt' | 'updatedAt' | 'actualSpent'>) => Promise<void>;
    updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => Promise<void>;
    calculateBudgetVariance: (budgetId: string) => Promise<any>;
    approveBudget: (id: string) => Promise<void>;
    submitBudget: (id: string) => Promise<void>;

    // Financial Summary
    financialSummary: FinancialSummary | null;
    fetchFinancialSummary: (startDate: string, endDate: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Initial state
    inventory: [],
    vehicles: [],
    harvestLogs: [],
    staff: [],
    maintenanceLogs: [],
    // Financial Management
    costEntries: [],
    costCategories: [],
    salesRecords: [],
    budgets: [],
    budgetCategories: [],
    financialSummary: null,
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
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to update vehicle');
            }
            const updatedVehicle = await response.json();
            set((state) => ({
                vehicles: state.vehicles.map(v =>
                    v.id === id ? updatedVehicle : v
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error; // Re-throw so the component can handle it
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
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to add staff');
            }
            const newStaff = await response.json();
            set((state) => ({
                staff: [...state.staff, newStaff],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error; // Re-throw so the component can handle it
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
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to update staff');
            }
            const updatedStaff = await response.json();
            set((state) => ({
                staff: state.staff.map(s =>
                    s.id === id ? updatedStaff : s
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error; // Re-throw so the component can handle it
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
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to add maintenance log');
            }
            
            const newLog = await response.json();
            set((state) => ({
                maintenanceLogs: [newLog, ...state.maintenanceLogs],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to add maintenance log', isLoading: false });
            throw error; // Re-throw so modal can show error
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

    // Financial Management Actions
    // Cost actions
    fetchCostEntries: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const queryParams = new URLSearchParams();
            if (filters.startDate) queryParams.set('startDate', filters.startDate);
            if (filters.endDate) queryParams.set('endDate', filters.endDate);
            if (filters.categoryId) queryParams.set('categoryId', filters.categoryId);
            if (filters.blockId) queryParams.set('blockId', filters.blockId);

            const response = await fetch(`/api/financial/costs?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch cost entries');
            const data = await response.json();
            set({ costEntries: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchCostCategories: async () => {
        try {
            const response = await fetch('/api/financial/costs/categories');
            if (!response.ok) throw new Error('Failed to fetch cost categories');
            const data = await response.json();
            set({ costCategories: data });
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    addCostEntry: async (entry) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/financial/costs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            });
            if (!response.ok) throw new Error('Failed to add cost entry');
            const newEntry = await response.json();
            set((state) => ({
                costEntries: [newEntry, ...state.costEntries],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateCostEntry: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/costs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update cost entry');
            const updatedEntry = await response.json();
            set((state) => ({
                costEntries: state.costEntries.map(entry =>
                    entry.id === id ? updatedEntry : entry
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteCostEntry: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/costs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete cost entry');
            set((state) => ({
                costEntries: state.costEntries.filter(entry => entry.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    approveCostEntry: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/costs/${id}/approve`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to approve cost entry');
            const updatedEntry = await response.json();
            set((state) => ({
                costEntries: state.costEntries.map(entry =>
                    entry.id === id ? updatedEntry : entry
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Sales actions
    fetchSalesRecords: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const queryParams = new URLSearchParams();
            if (filters.startDate) queryParams.set('startDate', filters.startDate);
            if (filters.endDate) queryParams.set('endDate', filters.endDate);
            if (filters.buyerName) queryParams.set('buyerName', filters.buyerName);
            if (filters.paymentStatus) queryParams.set('paymentStatus', filters.paymentStatus);
            if (filters.productType) queryParams.set('productType', filters.productType);

            const response = await fetch(`/api/financial/sales?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch sales records');
            const data = await response.json();
            set({ salesRecords: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addSalesRecord: async (record) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/financial/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record),
            });
            if (!response.ok) throw new Error('Failed to add sales record');
            const newRecord = await response.json();
            set((state) => ({
                salesRecords: [newRecord, ...state.salesRecords],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateSalesRecord: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/sales/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update sales record');
            const updatedRecord = await response.json();
            set((state) => ({
                salesRecords: state.salesRecords.map(record =>
                    record.id === id ? updatedRecord : record
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteSalesRecord: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/sales/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete sales record');
            set((state) => ({
                salesRecords: state.salesRecords.filter(record => record.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updatePaymentStatus: async (id, paymentReceived, status) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/sales/${id}/payment`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentReceived, status }),
            });
            if (!response.ok) throw new Error('Failed to update payment status');
            const updatedRecord = await response.json();
            set((state) => ({
                salesRecords: state.salesRecords.map(record =>
                    record.id === id ? updatedRecord : record
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Budget actions
    fetchBudgets: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const queryParams = new URLSearchParams();
            if (filters.year) queryParams.set('year', filters.year.toString());
            if (filters.status) queryParams.set('status', filters.status);

            const response = await fetch(`/api/financial/budgets?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch budgets');
            const data = await response.json();
            set({ budgets: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchBudgetCategories: async () => {
        try {
            const response = await fetch('/api/financial/budgets/categories');
            if (!response.ok) throw new Error('Failed to fetch budget categories');
            const data = await response.json();
            set({ budgetCategories: data });
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    addBudget: async (budget) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/financial/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budget),
            });
            if (!response.ok) throw new Error('Failed to add budget');
            const newBudget = await response.json();
            set((state) => ({
                budgets: [newBudget, ...state.budgets],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateBudget: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/budgets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update budget');
            const updatedBudget = await response.json();
            set((state) => ({
                budgets: state.budgets.map(budget =>
                    budget.id === id ? updatedBudget : budget
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteBudget: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/budgets/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete budget');
            set((state) => ({
                budgets: state.budgets.filter(budget => budget.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    getBudgetItems: async (budgetId) => {
        try {
            const response = await fetch(`/api/financial/budgets/${budgetId}/items`);
            if (!response.ok) throw new Error('Failed to fetch budget items');
            return await response.json();
        } catch (error: any) {
            set({ error: error.message });
            return [];
        }
    },

    addBudgetItem: async (item) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/budgets/${item.budgetId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            });
            if (!response.ok) throw new Error('Failed to add budget item');
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateBudgetItem: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/budgets/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update budget item');
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    calculateBudgetVariance: async (budgetId) => {
        try {
            const response = await fetch(`/api/financial/budgets/${budgetId}/actions/variance`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to calculate budget variance');
            return await response.json();
        } catch (error: any) {
            set({ error: error.message });
            return null;
        }
    },

    approveBudget: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/budgets/${id}/actions/approve`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to approve budget');
            const updatedBudget = await response.json();
            set((state) => ({
                budgets: state.budgets.map(budget =>
                    budget.id === id ? updatedBudget : budget
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    submitBudget: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/budgets/${id}/actions/submit`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to submit budget');
            const updatedBudget = await response.json();
            set((state) => ({
                budgets: state.budgets.map(budget =>
                    budget.id === id ? updatedBudget : budget
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Financial Summary
    fetchFinancialSummary: async (startDate, endDate) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/financial/reports/summary?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) throw new Error('Failed to fetch financial summary');
            const data = await response.json();
            set({ financialSummary: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },
}));
