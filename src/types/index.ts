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

export type PalmType = 'Adult Palm' | 'Young Palm';

export interface HarvestLog {
    id: string;
    date: string; // ISO Date
    blockId: string; // e.g., "Block A"
    palmType?: PalmType;
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

export type StaffDesignation = 'Estate Manager' | 'Farm Manager' | 'Office Data Analyst' | 'Store Keeper' | 'Plantation Data Analyst' | 'Mill Manager';

export interface Staff {
    id: string;
    name: string;
    role: 'Manager' | 'Supervisor' | 'Driver' | 'Worker';
    designation?: StaffDesignation;
    contact?: string;
    userId?: string; // Link to users table
}

export interface User {
    id: string;
    username: string;
    full_name: string;
    role: 'Admin' | 'Operator' | 'Support';
    phone_number?: string;
    must_change_password: boolean;
    created_at?: string;
    updated_at?: string;
    last_login_at?: string;
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
export type MaintenanceActivity = 'Pruning' | 'Fertilizer Application' | 'Herbicide Application' | 'Slashing' | 'Ring Weeding' | 'Road Maintenance';

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

// Financial Management Types
export interface CostCategory {
    id: string;
    name: string;
    description?: string;
    parentCategoryId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CostEntry {
    id: string;
    categoryId: string;
    amount: number;
    currency: string;
    description: string;
    dateIncurred: string;
    referenceNumber?: string;
    supplierName?: string;
    quantity?: number;
    unit?: string;
    unitCost?: number;

    // Related entities
    inventoryItemId?: string;
    vehicleId?: string;
    staffId?: string;
    harvestLogId?: string;
    maintenanceLogId?: string;

    // Location info
    blockId?: string;
    notes?: string;

    // Audit fields
    createdBy: string;
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    deletedBy?: string;
}

export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Overdue';
export type ProductType = 'FFB' | 'CPO' | 'PK' | 'Other';

export interface SalesRecord {
    id: string;
    saleDate: string;
    buyerName: string;
    buyerContact?: string;
    productType: ProductType;
    quantitySold: number;
    unit: string;
    unitPrice: number;
    totalAmount: number;
    currency: string;

    // Quality information
    qualityGrade?: string;
    moistureContent?: number;
    foreignMatter?: number;

    // Related harvest data
    harvestLogIds?: string[];
    totalFfbBunches?: number;
    averageBunchWeight?: number;

    // Transportation
    transportCost?: number;
    transportSupplier?: string;

    // Payment information
    paymentTerms?: string;
    paymentDueDate?: string;
    paymentStatus: PaymentStatus;
    paymentReceived: number;

    // Block information
    blocksInvolved?: string[];

    // Notes and reference
    invoiceNumber?: string;
    deliveryNote?: string;
    notes?: string;

    // Audit fields
    createdBy: string;
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    deletedBy?: string;
}

export type BudgetCategoryType = 'Cost' | 'Revenue' | 'Investment';
export type BudgetStatus = 'Draft' | 'Submitted' | 'Approved' | 'Active' | 'Closed';

export interface BudgetCategory {
    id: string;
    name: string;
    description?: string;
    categoryType: BudgetCategoryType;
    parentCategoryId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Budget {
    id: string;
    name: string;
    description?: string;
    budgetYear: number;
    budgetQuarter?: number;
    startDate: string;
    endDate: string;
    totalBudget: number;
    currency: string;

    // Status and approval
    status: BudgetStatus;
    submittedBy?: string;
    submittedAt?: string;
    approvedBy?: string;
    approvedAt?: string;

    // Notes
    notes?: string;

    // Audit fields
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    deletedBy?: string;
}

export interface BudgetItem {
    id: string;
    budgetId: string;
    budgetCategoryId: string;
    costCategoryId?: string;

    // Budget amounts
    plannedAmount: number;
    allocatedAmount: number;
    actualSpent: number;

    // Block or department allocation
    blockId?: string;
    department?: string;

    // Notes
    notes?: string;

    createdAt: string;
    updatedAt: string;
}

export type FinancialReportType = 'ProfitLoss' | 'BudgetVariance' | 'CostAnalysis' | 'RevenueAnalysis' | 'CashFlow';

export interface FinancialReport {
    id: string;
    name: string;
    description?: string;
    reportType: FinancialReportType;

    // Date range
    startDate: string;
    endDate: string;

    // Filters
    filters?: any;

    // Report data
    reportData?: any;
    generatedAt?: string;
    generatedBy?: string;

    // Access control
    isPublic: boolean;
    createdBy: string;

    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    deletedBy?: string;
}

export interface FinancialSummary {
    totalRevenue: number;
    totalCosts: number;
    netProfit: number;
    profitMargin: number;
    budgetVariance: number;
    topCostCategories: Array<{
        category: string;
        amount: number;
        percentage: number;
    }>;
    monthlyTrends: Array<{
        month: string;
        revenue: number;
        costs: number;
        profit: number;
    }>;
}

// Medical Request Types
export type MedicalRequestUrgency = 'Low' | 'Medium' | 'High' | 'Emergency';
export type MedicalRequestStatus = 'Pending' | 'Approved by Supervisor' | 'Rejected by Supervisor' | 'Approved by Manager' | 'Rejected by Manager';
export type MedicalPaymentStatus = 'Pending' | 'Approved for Payment' | 'Paid' | 'Rejected';

export interface MedicalRequest {
    id: string;
    staffId: string;
    staffName?: string;
    requestDate: string;
    reason: string;
    isWorkRelated: boolean;
    urgency: MedicalRequestUrgency;
    status: MedicalRequestStatus;
    supervisorId?: string;
    supervisorName?: string;
    supervisorActionDate?: string;
    supervisorNotes?: string;
    managerId?: string;
    managerName?: string;
    managerActionDate?: string;
    managerNotes?: string;
    paymentStatus?: MedicalPaymentStatus;
    paymentAmount?: number;
    paymentDate?: string;
    paymentReference?: string;
    createdAt?: string;
    updatedAt?: string;
}
