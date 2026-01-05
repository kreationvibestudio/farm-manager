import { createClient } from '@/lib/supabase/server'
import { Budget, BudgetItem, BudgetCategory } from '@/types'

interface GetBudgetsFilters {
  year?: number
  status?: string
  categoryType?: string
}

export async function getBudgets(filters: GetBudgetsFilters = {}): Promise<Budget[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('budgets')
      .select('*')
      .is('deleted_at', null)
      .order('budget_year', { ascending: false })
      .order('budget_quarter', { ascending: false, nullsFirst: true })

    // Apply filters
    if (filters.year) {
      query = query.eq('budget_year', filters.year)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error fetching budgets:', error)
      return []
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      budgetYear: item.budget_year,
      budgetQuarter: item.budget_quarter,
      startDate: item.start_date,
      endDate: item.end_date,
      totalBudget: parseFloat(item.total_budget),
      currency: item.currency,

      // Status and approval
      status: item.status,
      submittedBy: item.submitted_by,
      submittedAt: item.submitted_at,
      approvedBy: item.approved_by,
      approvedAt: item.approved_at,

      // Notes
      notes: item.notes,

      // Audit fields
      createdBy: item.created_by,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at,
      deletedBy: item.deleted_by,
    }))
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return []
  }
}

export async function getBudgetById(id: string): Promise<Budget | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      console.error('Supabase error fetching budget:', error)
      throw error
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      budgetYear: data.budget_year,
      budgetQuarter: data.budget_quarter,
      startDate: data.start_date,
      endDate: data.end_date,
      totalBudget: parseFloat(data.total_budget),
      currency: data.currency,

      // Status and approval
      status: data.status,
      submittedBy: data.submitted_by,
      submittedAt: data.submitted_at,
      approvedBy: data.approved_by,
      approvedAt: data.approved_at,

      // Notes
      notes: data.notes,

      // Audit fields
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at,
      deletedBy: data.deleted_by,
    }
  } catch (error) {
    console.error('Error fetching budget by ID:', error)
    return null
  }
}

export async function addBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>, userId: string): Promise<Budget> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('budgets')
    .insert({
      name: budget.name,
      description: budget.description,
      budget_year: budget.budgetYear,
      budget_quarter: budget.budgetQuarter,
      start_date: budget.startDate,
      end_date: budget.endDate,
      total_budget: budget.totalBudget,
      currency: budget.currency,
      status: budget.status,
      submitted_by: budget.submittedBy,
      submitted_at: budget.submittedAt,
      approved_by: budget.approvedBy,
      approved_at: budget.approvedAt,
      notes: budget.notes,
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    budgetYear: data.budget_year,
    budgetQuarter: data.budget_quarter,
    startDate: data.start_date,
    endDate: data.end_date,
    totalBudget: parseFloat(data.total_budget),
    currency: data.currency,
    status: data.status,
    submittedBy: data.submitted_by,
    submittedAt: data.submitted_at,
    approvedBy: data.approved_by,
    approvedAt: data.approved_at,
    notes: data.notes,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
    deletedBy: data.deleted_by,
  }
}

export async function updateBudget(id: string, updates: Partial<Budget>): Promise<Budget> {
  const supabase = await createClient()
  const updateData: any = {}

  if (updates.name) updateData.name = updates.name
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.budgetYear) updateData.budget_year = updates.budgetYear
  if (updates.budgetQuarter !== undefined) updateData.budget_quarter = updates.budgetQuarter
  if (updates.startDate) updateData.start_date = updates.startDate
  if (updates.endDate) updateData.end_date = updates.endDate
  if (updates.totalBudget !== undefined) updateData.total_budget = updates.totalBudget
  if (updates.currency) updateData.currency = updates.currency
  if (updates.status) updateData.status = updates.status
  if (updates.submittedBy !== undefined) updateData.submitted_by = updates.submittedBy
  if (updates.submittedAt !== undefined) updateData.submitted_at = updates.submittedAt
  if (updates.approvedBy !== undefined) updateData.approved_by = updates.approvedBy
  if (updates.approvedAt !== undefined) updateData.approved_at = updates.approvedAt
  if (updates.notes !== undefined) updateData.notes = updates.notes

  const { data, error } = await supabase
    .from('budgets')
    .update(updateData)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    budgetYear: data.budget_year,
    budgetQuarter: data.budget_quarter,
    startDate: data.start_date,
    endDate: data.end_date,
    totalBudget: parseFloat(data.total_budget),
    currency: data.currency,
    status: data.status,
    submittedBy: data.submitted_by,
    submittedAt: data.submitted_at,
    approvedBy: data.approved_by,
    approvedAt: data.approved_at,
    notes: data.notes,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
    deletedBy: data.deleted_by,
  }
}

export async function deleteBudget(id: string, userId: string): Promise<void> {
  const supabase = await createClient()

  // First get the record to log in audit
  const { data: oldData } = await supabase
    .from('budgets')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (!oldData) throw new Error('Budget not found')

  // Soft delete
  const { error } = await supabase
    .from('budgets')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
    })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) throw error
}

export async function getBudgetItems(budgetId: string): Promise<BudgetItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('budget_items')
      .select(`
        *,
        budget_categories (
          id,
          name,
          description,
          category_type
        )
      `)
      .eq('budget_id', budgetId)
      .order('budget_categories(name)', { ascending: true })

    if (error) {
      console.error('Supabase error fetching budget items:', error)
      return []
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      budgetId: item.budget_id,
      budgetCategoryId: item.budget_category_id,
      costCategoryId: item.cost_category_id,

      // Budget amounts
      plannedAmount: parseFloat(item.planned_amount),
      allocatedAmount: parseFloat(item.allocated_amount),
      actualSpent: parseFloat(item.actual_spent || 0),

      // Block or department allocation
      blockId: item.block_id,
      department: item.department,

      // Notes
      notes: item.notes,

      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching budget items:', error)
    return []
  }
}

export async function addBudgetItem(item: Omit<BudgetItem, 'id' | 'createdAt' | 'updatedAt' | 'actualSpent'>): Promise<BudgetItem> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('budget_items')
    .insert({
      budget_id: item.budgetId,
      budget_category_id: item.budgetCategoryId,
      cost_category_id: item.costCategoryId,
      planned_amount: item.plannedAmount,
      allocated_amount: item.allocatedAmount,
      block_id: item.blockId,
      department: item.department,
      notes: item.notes,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    budgetId: data.budget_id,
    budgetCategoryId: data.budget_category_id,
    costCategoryId: data.cost_category_id,
    plannedAmount: parseFloat(data.planned_amount),
    allocatedAmount: parseFloat(data.allocated_amount),
    actualSpent: parseFloat(data.actual_spent || 0),
    blockId: data.block_id,
    department: data.department,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateBudgetItem(id: string, updates: Partial<BudgetItem>): Promise<BudgetItem> {
  const supabase = await createClient()
  const updateData: any = {}

  if (updates.budgetCategoryId) updateData.budget_category_id = updates.budgetCategoryId
  if (updates.costCategoryId !== undefined) updateData.cost_category_id = updates.costCategoryId
  if (updates.plannedAmount !== undefined) updateData.planned_amount = updates.plannedAmount
  if (updates.allocatedAmount !== undefined) updateData.allocated_amount = updates.allocatedAmount
  if (updates.blockId !== undefined) updateData.block_id = updates.blockId
  if (updates.department !== undefined) updateData.department = updates.department
  if (updates.notes !== undefined) updateData.notes = updates.notes

  const { data, error } = await supabase
    .from('budget_items')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    budgetId: data.budget_id,
    budgetCategoryId: data.budget_category_id,
    costCategoryId: data.cost_category_id,
    plannedAmount: parseFloat(data.planned_amount),
    allocatedAmount: parseFloat(data.allocated_amount),
    actualSpent: parseFloat(data.actual_spent || 0),
    blockId: data.block_id,
    department: data.department,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function getBudgetCategories(): Promise<BudgetCategory[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('budget_categories')
      .select('*')
      .eq('is_active', true)
      .order('category_type', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Supabase error fetching budget categories:', error)
      return []
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      categoryType: item.category_type,
      parentCategoryId: item.parent_category_id,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching budget categories:', error)
    return []
  }
}

export async function approveBudget(id: string, approverId: string): Promise<Budget> {
  return updateBudget(id, {
    status: 'Approved',
    approvedBy: approverId,
    approvedAt: new Date().toISOString(),
  })
}

export async function submitBudget(id: string, submitterId: string): Promise<Budget> {
  return updateBudget(id, {
    status: 'Submitted',
    submittedBy: submitterId,
    submittedAt: new Date().toISOString(),
  })
}

export async function calculateBudgetVariance(budgetId: string): Promise<{
  totalPlanned: number
  totalActual: number
  variance: number
  variancePercentage: number
}> {
  const budgetItems = await getBudgetItems(budgetId)

  const totalPlanned = budgetItems.reduce((sum, item) => sum + item.plannedAmount, 0)
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualSpent, 0)
  const variance = totalActual - totalPlanned
  const variancePercentage = totalPlanned > 0 ? (variance / totalPlanned) * 100 : 0

  return {
    totalPlanned,
    totalActual,
    variance,
    variancePercentage,
  }
}
