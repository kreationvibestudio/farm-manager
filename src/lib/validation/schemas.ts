/**
 * Input validation schemas using Zod
 * Prevents invalid data from reaching the database
 */

import { z } from 'zod';

// UUID validation
const uuidSchema = z.string().uuid('Invalid ID format');

// Common field validations
const nonEmptyString = z.string().min(1, 'This field is required').max(500, 'Field is too long');
const optionalString = z.string().max(500, 'Field is too long').optional();
const positiveNumber = z.number().positive('Must be a positive number');
const nonNegativeNumber = z.number().nonnegative('Must be zero or positive');
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');

// Cost Entry Schema
export const costEntrySchema = z.object({
  categoryId: uuidSchema,
  amount: positiveNumber.max(999999999, 'Amount is too large'),
  currency: z.string().length(3, 'Currency must be 3 characters').default('NGN'),
  description: nonEmptyString,
  dateIncurred: dateString,
  referenceNumber: optionalString,
  supplierName: optionalString,
  quantity: nonNegativeNumber.optional(),
  unit: optionalString,
  unitCost: nonNegativeNumber.optional(),
  inventoryItemId: uuidSchema.optional(),
  vehicleId: uuidSchema.optional(),
  staffId: uuidSchema.optional(),
  harvestLogId: uuidSchema.optional(),
  maintenanceLogId: uuidSchema.optional(),
  blockId: optionalString,
  notes: optionalString,
});

// Sales Record Schema
export const salesRecordSchema = z.object({
  saleDate: dateString,
  buyerName: nonEmptyString,
  buyerContact: optionalString,
  productType: z.enum(['FFB', 'CPO', 'PK', 'Other'], {
    message: 'Invalid product type'
  }),
  quantitySold: positiveNumber.max(999999999, 'Quantity is too large'),
  unit: z.string().min(1).max(20),
  unitPrice: positiveNumber.max(999999, 'Unit price is too large'),
  totalAmount: positiveNumber.max(999999999, 'Total amount is too large'),
  currency: z.string().length(3).default('NGN'),
  qualityGrade: optionalString,
  moistureContent: z.number().min(0).max(100).optional(),
  foreignMatter: z.number().min(0).max(100).optional(),
  transportCost: nonNegativeNumber.optional(),
  transportSupplier: optionalString,
  paymentTerms: optionalString,
  paymentDueDate: dateString.optional(),
  paymentStatus: z.enum(['Pending', 'Partial', 'Paid', 'Overdue']).default('Pending'),
  paymentReceived: nonNegativeNumber.default(0),
  invoiceNumber: optionalString,
  deliveryNote: optionalString,
  notes: optionalString,
  blocksInvolved: z.array(z.string()).optional(),
  harvestLogIds: z.array(uuidSchema).optional(),
});

// Budget Schema
export const budgetSchema = z.object({
  name: nonEmptyString.max(200),
  description: optionalString,
  budgetYear: z.number().int().min(2000).max(2100),
  budgetQuarter: z.number().int().min(1).max(4).optional(),
  startDate: dateString,
  endDate: dateString,
  totalBudget: positiveNumber.max(999999999999, 'Budget amount is too large'),
  currency: z.string().length(3).default('NGN'),
  status: z.enum(['Draft', 'Submitted', 'Approved', 'Active', 'Closed']).default('Draft'),
  notes: optionalString,
}).refine((data) => {
  // Ensure end date is after start date
  return new Date(data.endDate) >= new Date(data.startDate);
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Budget Item Schema
export const budgetItemSchema = z.object({
  budgetId: uuidSchema,
  budgetCategoryId: uuidSchema,
  costCategoryId: uuidSchema.optional(),
  plannedAmount: nonNegativeNumber.max(999999999999),
  allocatedAmount: nonNegativeNumber.max(999999999999).default(0),
  blockId: optionalString,
  department: optionalString,
  notes: optionalString,
});

// Maintenance Log Schema
export const maintenanceLogSchema = z.object({
  date: dateString,
  blockId: nonEmptyString.max(50),
  activity: z.enum(['Pruning', 'Fertilizer Application', 'Herbicide Application', 'Slashing', 'Ring Weeding']),
  supervisorId: uuidSchema.optional(),
  staffCount: z.number().int().min(0).max(1000).optional(),
  notes: optionalString,
});

// Harvest Log Schema
export const harvestLogSchema = z.object({
  date: dateString,
  blockId: nonEmptyString.max(50),
  weightKg: positiveNumber.max(999999, 'Weight is too large'),
  supervisorId: uuidSchema.optional(),
  driverId: uuidSchema.optional(),
  vehicleId: uuidSchema.optional(),
  notes: optionalString,
});

// Inventory Item Schema
export const inventoryItemSchema = z.object({
  name: nonEmptyString.max(200),
  category: z.enum(['Fertilizer', 'Herbicide', 'Fuel', 'Spare Part', 'Tool', 'Other']),
  quantity: nonNegativeNumber.max(999999999),
  unit: z.string().min(1).max(20),
  minLevel: nonNegativeNumber.max(999999999),
});

// Vehicle Schema
export const vehicleSchema = z.object({
  name: nonEmptyString.max(100),
  type: z.enum(['Tractor', 'Truck', 'Motorcycle', 'Other']),
  status: z.enum(['Active', 'Maintenance', 'OutOfService']).default('Active'),
  licensePlate: optionalString.max(20),
  lastMaintenance: dateString.optional(),
  currentDriverId: optionalString,
});

// Staff Schema
export const staffSchema = z.object({
  name: nonEmptyString.max(200),
  role: z.enum(['Manager', 'Supervisor', 'Driver', 'Worker']),
  contact: optionalString.max(50),
});

// User Schema (for creating/updating users)
export const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username is too long').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  fullName: nonEmptyString.max(200),
  role: z.enum(['Admin', 'Operator', 'Support']),
  phoneNumber: optionalString.max(20),
  mustChangePassword: z.boolean().default(false),
});

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

// Helper function to validate and parse
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
