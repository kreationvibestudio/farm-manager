import { createClient } from '@/lib/supabase/server'
import { SalesRecord } from '@/types'

interface GetSalesRecordsFilters {
  startDate?: string
  endDate?: string
  buyerName?: string
  paymentStatus?: string
  productType?: string
}

export async function getSalesRecords(filters: GetSalesRecordsFilters = {}): Promise<SalesRecord[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('sales_records')
      .select('*')
      .is('deleted_at', null)
      .order('sale_date', { ascending: false })

    // Apply filters
    if (filters.startDate) {
      query = query.gte('sale_date', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('sale_date', filters.endDate)
    }
    if (filters.buyerName) {
      query = query.ilike('buyer_name', `%${filters.buyerName}%`)
    }
    if (filters.paymentStatus) {
      query = query.eq('payment_status', filters.paymentStatus)
    }
    if (filters.productType) {
      query = query.eq('product_type', filters.productType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error fetching sales records:', error)
      return []
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      saleDate: item.sale_date,
      buyerName: item.buyer_name,
      buyerContact: item.buyer_contact,
      productType: item.product_type,
      quantitySold: parseFloat(item.quantity_sold),
      unit: item.unit,
      unitPrice: parseFloat(item.unit_price),
      totalAmount: parseFloat(item.total_amount),
      currency: item.currency,

      // Quality information
      qualityGrade: item.quality_grade,
      moistureContent: item.moisture_content ? parseFloat(item.moisture_content) : undefined,
      foreignMatter: item.foreign_matter ? parseFloat(item.foreign_matter) : undefined,

      // Related harvest data
      harvestLogIds: item.harvest_log_ids,
      totalFfbBunches: item.total_ffb_bunches,
      averageBunchWeight: item.average_bunch_weight ? parseFloat(item.average_bunch_weight) : undefined,

      // Transportation
      transportCost: item.transport_cost ? parseFloat(item.transport_cost) : undefined,
      transportSupplier: item.transport_supplier,

      // Payment information
      paymentTerms: item.payment_terms,
      paymentDueDate: item.payment_due_date,
      paymentStatus: item.payment_status,
      paymentReceived: parseFloat(item.payment_received || 0),

      // Block information
      blocksInvolved: item.blocks_involved,

      // Notes and reference
      invoiceNumber: item.invoice_number,
      deliveryNote: item.delivery_note,
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
    console.error('Error fetching sales records:', error)
    return []
  }
}

export async function addSalesRecord(record: Omit<SalesRecord, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>, userId: string): Promise<SalesRecord> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sales_records')
    .insert({
      sale_date: record.saleDate,
      buyer_name: record.buyerName,
      buyer_contact: record.buyerContact,
      product_type: record.productType,
      quantity_sold: record.quantitySold,
      unit: record.unit,
      unit_price: record.unitPrice,
      total_amount: record.totalAmount,
      currency: record.currency,

      // Quality information
      quality_grade: record.qualityGrade,
      moisture_content: record.moistureContent,
      foreign_matter: record.foreignMatter,

      // Related harvest data
      harvest_log_ids: record.harvestLogIds,
      total_ffb_bunches: record.totalFfbBunches,
      average_bunch_weight: record.averageBunchWeight,

      // Transportation
      transport_cost: record.transportCost,
      transport_supplier: record.transportSupplier,

      // Payment information
      payment_terms: record.paymentTerms,
      payment_due_date: record.paymentDueDate,
      payment_status: record.paymentStatus,
      payment_received: record.paymentReceived,

      // Block information
      blocks_involved: record.blocksInvolved,

      // Notes and reference
      invoice_number: record.invoiceNumber,
      delivery_note: record.deliveryNote,
      notes: record.notes,

      // Audit fields
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    saleDate: data.sale_date,
    buyerName: data.buyer_name,
    buyerContact: data.buyer_contact,
    productType: data.product_type,
    quantitySold: parseFloat(data.quantity_sold),
    unit: data.unit,
    unitPrice: parseFloat(data.unit_price),
    totalAmount: parseFloat(data.total_amount),
    currency: data.currency,

    // Quality information
    qualityGrade: data.quality_grade,
    moistureContent: data.moisture_content ? parseFloat(data.moisture_content) : undefined,
    foreignMatter: data.foreign_matter ? parseFloat(data.foreign_matter) : undefined,

    // Related harvest data
    harvestLogIds: data.harvest_log_ids,
    totalFfbBunches: data.total_ffb_bunches,
    averageBunchWeight: data.average_bunch_weight ? parseFloat(data.average_bunch_weight) : undefined,

    // Transportation
    transportCost: data.transport_cost ? parseFloat(data.transport_cost) : undefined,
    transportSupplier: data.transport_supplier,

    // Payment information
    paymentTerms: data.payment_terms,
    paymentDueDate: data.payment_due_date,
    paymentStatus: data.payment_status,
    paymentReceived: parseFloat(data.payment_received || 0),

    // Block information
    blocksInvolved: data.blocks_involved,

    // Notes and reference
    invoiceNumber: data.invoice_number,
    deliveryNote: data.delivery_note,
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

export async function updateSalesRecord(id: string, updates: Partial<SalesRecord>): Promise<SalesRecord> {
  const supabase = await createClient()
  const updateData: any = {}

  if (updates.saleDate) updateData.sale_date = updates.saleDate
  if (updates.buyerName) updateData.buyer_name = updates.buyerName
  if (updates.buyerContact !== undefined) updateData.buyer_contact = updates.buyerContact
  if (updates.productType) updateData.product_type = updates.productType
  if (updates.quantitySold !== undefined) updateData.quantity_sold = updates.quantitySold
  if (updates.unit) updateData.unit = updates.unit
  if (updates.unitPrice !== undefined) updateData.unit_price = updates.unitPrice
  if (updates.totalAmount !== undefined) updateData.total_amount = updates.totalAmount
  if (updates.currency) updateData.currency = updates.currency

  // Quality information
  if (updates.qualityGrade !== undefined) updateData.quality_grade = updates.qualityGrade
  if (updates.moistureContent !== undefined) updateData.moisture_content = updates.moistureContent
  if (updates.foreignMatter !== undefined) updateData.foreign_matter = updates.foreignMatter

  // Related harvest data
  if (updates.harvestLogIds !== undefined) updateData.harvest_log_ids = updates.harvestLogIds
  if (updates.totalFfbBunches !== undefined) updateData.total_ffb_bunches = updates.totalFfbBunches
  if (updates.averageBunchWeight !== undefined) updateData.average_bunch_weight = updates.averageBunchWeight

  // Transportation
  if (updates.transportCost !== undefined) updateData.transport_cost = updates.transportCost
  if (updates.transportSupplier !== undefined) updateData.transport_supplier = updates.transportSupplier

  // Payment information
  if (updates.paymentTerms !== undefined) updateData.payment_terms = updates.paymentTerms
  if (updates.paymentDueDate !== undefined) updateData.payment_due_date = updates.paymentDueDate
  if (updates.paymentStatus) updateData.payment_status = updates.paymentStatus
  if (updates.paymentReceived !== undefined) updateData.payment_received = updates.paymentReceived

  // Block information
  if (updates.blocksInvolved !== undefined) updateData.blocks_involved = updates.blocksInvolved

  // Notes and reference
  if (updates.invoiceNumber !== undefined) updateData.invoice_number = updates.invoiceNumber
  if (updates.deliveryNote !== undefined) updateData.delivery_note = updates.deliveryNote
  if (updates.notes !== undefined) updateData.notes = updates.notes

  // Approval
  if (updates.approvedBy !== undefined) updateData.approved_by = updates.approvedBy
  if (updates.approvedAt !== undefined) updateData.approved_at = updates.approvedAt

  const { data, error } = await supabase
    .from('sales_records')
    .update(updateData)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    saleDate: data.sale_date,
    buyerName: data.buyer_name,
    buyerContact: data.buyer_contact,
    productType: data.product_type,
    quantitySold: parseFloat(data.quantity_sold),
    unit: data.unit,
    unitPrice: parseFloat(data.unit_price),
    totalAmount: parseFloat(data.total_amount),
    currency: data.currency,

    // Quality information
    qualityGrade: data.quality_grade,
    moistureContent: data.moisture_content ? parseFloat(data.moisture_content) : undefined,
    foreignMatter: data.foreign_matter ? parseFloat(data.foreign_matter) : undefined,

    // Related harvest data
    harvestLogIds: data.harvest_log_ids,
    totalFfbBunches: data.total_ffb_bunches,
    averageBunchWeight: data.average_bunch_weight ? parseFloat(data.average_bunch_weight) : undefined,

    // Transportation
    transportCost: data.transport_cost ? parseFloat(data.transport_cost) : undefined,
    transportSupplier: data.transport_supplier,

    // Payment information
    paymentTerms: data.payment_terms,
    paymentDueDate: data.payment_due_date,
    paymentStatus: data.payment_status,
    paymentReceived: parseFloat(data.payment_received || 0),

    // Block information
    blocksInvolved: data.blocks_involved,

    // Notes and reference
    invoiceNumber: data.invoice_number,
    deliveryNote: data.delivery_note,
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

export async function deleteSalesRecord(id: string, userId: string): Promise<void> {
  const supabase = await createClient()

  // First get the record to log in audit
  const { data: oldData } = await supabase
    .from('sales_records')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (!oldData) throw new Error('Sales record not found')

  // Soft delete
  const { error } = await supabase
    .from('sales_records')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
    })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) throw error
}

export async function getSalesRecordById(id: string): Promise<SalesRecord | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sales_records')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      console.error('Supabase error fetching sales record:', error)
      throw error
    }

    return {
      id: data.id,
      saleDate: data.sale_date,
      buyerName: data.buyer_name,
      buyerContact: data.buyer_contact,
      productType: data.product_type,
      quantitySold: parseFloat(data.quantity_sold),
      unit: data.unit,
      unitPrice: parseFloat(data.unit_price),
      totalAmount: parseFloat(data.total_amount),
      currency: data.currency,

      // Quality information
      qualityGrade: data.quality_grade,
      moistureContent: data.moisture_content ? parseFloat(data.moisture_content) : undefined,
      foreignMatter: data.foreign_matter ? parseFloat(data.foreign_matter) : undefined,

      // Related harvest data
      harvestLogIds: data.harvest_log_ids,
      totalFfbBunches: data.total_ffb_bunches,
      averageBunchWeight: data.average_bunch_weight ? parseFloat(data.average_bunch_weight) : undefined,

      // Transportation
      transportCost: data.transport_cost ? parseFloat(data.transport_cost) : undefined,
      transportSupplier: data.transport_supplier,

      // Payment information
      paymentTerms: data.payment_terms,
      paymentDueDate: data.payment_due_date,
      paymentStatus: data.payment_status,
      paymentReceived: parseFloat(data.payment_received || 0),

      // Block information
      blocksInvolved: data.blocks_involved,

      // Notes and reference
      invoiceNumber: data.invoice_number,
      deliveryNote: data.delivery_note,
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
    console.error('Error fetching sales record by ID:', error)
    return null
  }
}

export async function approveSalesRecord(id: string, approverId: string): Promise<SalesRecord> {
  return updateSalesRecord(id, {
    approvedBy: approverId,
    approvedAt: new Date().toISOString(),
  })
}

export async function updatePaymentStatus(id: string, paymentReceived: number, status: string): Promise<SalesRecord> {
  return updateSalesRecord(id, {
    paymentReceived,
    paymentStatus: status as any,
  })
}
