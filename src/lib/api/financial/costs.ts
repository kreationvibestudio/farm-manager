import { createClient } from '@/lib/supabase/server'
import { CostEntry, CostCategory } from '@/types'

interface GetCostEntriesFilters {
  startDate?: string
  endDate?: string
  categoryId?: string
  blockId?: string
}

export async function getCostEntries(filters: GetCostEntriesFilters = {}): Promise<CostEntry[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('cost_entries')
      .select(`
        *,
        cost_categories (
          id,
          name,
          description
        )
      `)
      .is('deleted_at', null)
      .order('date_incurred', { ascending: false })

    // Apply filters
    if (filters.startDate) {
      query = query.gte('date_incurred', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('date_incurred', filters.endDate)
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }
    if (filters.blockId) {
      query = query.eq('block_id', filters.blockId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error fetching cost entries:', error)
      return []
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      categoryId: item.category_id,
      amount: parseFloat(item.amount),
      currency: item.currency,
      description: item.description,
      dateIncurred: item.date_incurred,
      referenceNumber: item.reference_number,
      supplierName: item.supplier_name,
      quantity: item.quantity ? parseFloat(item.quantity) : undefined,
      unit: item.unit,
      unitCost: item.unit_cost ? parseFloat(item.unit_cost) : undefined,

      // Related entities
      inventoryItemId: item.inventory_item_id,
      vehicleId: item.vehicle_id,
      staffId: item.staff_id,
      harvestLogId: item.harvest_log_id,
      maintenanceLogId: item.maintenance_log_id,

      // Location info
      blockId: item.block_id,
      notes: item.notes,

      // Audit fields
      createdBy: item.created_by,
      approvedBy: item.approved_by,
      approvedAt: item.approved_at,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at,
      deletedBy: item.deleted_by,
    }))
  } catch (error) {
    console.error('Error fetching cost entries:', error)
    return []
  }
}

export async function addCostEntry(entry: Omit<CostEntry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>, userId: string): Promise<CostEntry> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cost_entries')
    .insert({
      category_id: entry.categoryId,
      amount: entry.amount,
      currency: entry.currency,
      description: entry.description,
      date_incurred: entry.dateIncurred,
      reference_number: entry.referenceNumber,
      supplier_name: entry.supplierName,
      quantity: entry.quantity,
      unit: entry.unit,
      unit_cost: entry.unitCost,

      // Related entities
      inventory_item_id: entry.inventoryItemId,
      vehicle_id: entry.vehicleId,
      staff_id: entry.staffId,
      harvest_log_id: entry.harvestLogId,
      maintenance_log_id: entry.maintenanceLogId,

      // Location info
      block_id: entry.blockId,
      notes: entry.notes,

      // Audit fields
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    categoryId: data.category_id,
    amount: parseFloat(data.amount),
    currency: data.currency,
    description: data.description,
    dateIncurred: data.date_incurred,
    referenceNumber: data.reference_number,
    supplierName: data.supplier_name,
    quantity: data.quantity ? parseFloat(data.quantity) : undefined,
    unit: data.unit,
    unitCost: data.unit_cost ? parseFloat(data.unit_cost) : undefined,

    // Related entities
    inventoryItemId: data.inventory_item_id,
    vehicleId: data.vehicle_id,
    staffId: data.staff_id,
    harvestLogId: data.harvest_log_id,
    maintenanceLogId: data.maintenance_log_id,

    // Location info
    blockId: data.block_id,
    notes: data.notes,

    // Audit fields
    createdBy: data.created_by,
    approvedBy: data.approved_by,
    approvedAt: data.approved_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
    deletedBy: data.deleted_by,
  }
}

export async function updateCostEntry(id: string, updates: Partial<CostEntry>): Promise<CostEntry> {
  const supabase = await createClient()
  const updateData: any = {}

  if (updates.categoryId) updateData.category_id = updates.categoryId
  if (updates.amount !== undefined) updateData.amount = updates.amount
  if (updates.currency) updateData.currency = updates.currency
  if (updates.description) updateData.description = updates.description
  if (updates.dateIncurred) updateData.date_incurred = updates.dateIncurred
  if (updates.referenceNumber !== undefined) updateData.reference_number = updates.referenceNumber
  if (updates.supplierName !== undefined) updateData.supplier_name = updates.supplierName
  if (updates.quantity !== undefined) updateData.quantity = updates.quantity
  if (updates.unit !== undefined) updateData.unit = updates.unit
  if (updates.unitCost !== undefined) updateData.unit_cost = updates.unitCost

  // Related entities
  if (updates.inventoryItemId !== undefined) updateData.inventory_item_id = updates.inventoryItemId
  if (updates.vehicleId !== undefined) updateData.vehicle_id = updates.vehicleId
  if (updates.staffId !== undefined) updateData.staff_id = updates.staffId
  if (updates.harvestLogId !== undefined) updateData.harvest_log_id = updates.harvestLogId
  if (updates.maintenanceLogId !== undefined) updateData.maintenance_log_id = updates.maintenanceLogId

  // Location info
  if (updates.blockId !== undefined) updateData.block_id = updates.blockId
  if (updates.notes !== undefined) updateData.notes = updates.notes

  // Approval
  if (updates.approvedBy !== undefined) updateData.approved_by = updates.approvedBy
  if (updates.approvedAt !== undefined) updateData.approved_at = updates.approvedAt

  const { data, error } = await supabase
    .from('cost_entries')
    .update(updateData)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    categoryId: data.category_id,
    amount: parseFloat(data.amount),
    currency: data.currency,
    description: data.description,
    dateIncurred: data.date_incurred,
    referenceNumber: data.reference_number,
    supplierName: data.supplier_name,
    quantity: data.quantity ? parseFloat(data.quantity) : undefined,
    unit: data.unit,
    unitCost: data.unit_cost ? parseFloat(data.unit_cost) : undefined,

    // Related entities
    inventoryItemId: data.inventory_item_id,
    vehicleId: data.vehicle_id,
    staffId: data.staff_id,
    harvestLogId: data.harvest_log_id,
    maintenanceLogId: data.maintenance_log_id,

    // Location info
    blockId: data.block_id,
    notes: data.notes,

    // Audit fields
    createdBy: data.created_by,
    approvedBy: data.approved_by,
    approvedAt: data.approved_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
    deletedBy: data.deleted_by,
  }
}

export async function deleteCostEntry(id: string, userId: string): Promise<void> {
  const supabase = await createClient()

  // First get the record to log in audit
  const { data: oldData } = await supabase
    .from('cost_entries')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (!oldData) throw new Error('Cost entry not found')

  // Soft delete
  const { error } = await supabase
    .from('cost_entries')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
    })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) throw error
}

export async function getCostCategories(): Promise<CostCategory[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('cost_categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Supabase error fetching cost categories:', error)
      return []
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      parentCategoryId: item.parent_category_id,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching cost categories:', error)
    return []
  }
}

export async function getCostEntryById(id: string): Promise<CostEntry | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('cost_entries')
      .select(`
        *,
        cost_categories (
          id,
          name,
          description
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      console.error('Supabase error fetching cost entry:', error)
      throw error
    }

    return {
      id: data.id,
      categoryId: data.category_id,
      amount: parseFloat(data.amount),
      currency: data.currency,
      description: data.description,
      dateIncurred: data.date_incurred,
      referenceNumber: data.reference_number,
      supplierName: data.supplier_name,
      quantity: data.quantity ? parseFloat(data.quantity) : undefined,
      unit: data.unit,
      unitCost: data.unit_cost ? parseFloat(data.unit_cost) : undefined,

      // Related entities
      inventoryItemId: data.inventory_item_id,
      vehicleId: data.vehicle_id,
      staffId: data.staff_id,
      harvestLogId: data.harvest_log_id,
      maintenanceLogId: data.maintenance_log_id,

      // Location info
      blockId: data.block_id,
      notes: data.notes,

      // Audit fields
      createdBy: data.created_by,
      approvedBy: data.approved_by,
      approvedAt: data.approved_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at,
      deletedBy: data.deleted_by,
    }
  } catch (error) {
    console.error('Error fetching cost entry by ID:', error)
    return null
  }
}

export async function approveCostEntry(id: string, approverId: string): Promise<CostEntry> {
  return updateCostEntry(id, {
    approvedBy: approverId,
    approvedAt: new Date().toISOString(),
  })
}
