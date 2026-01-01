import { createClient } from '@/lib/supabase/server'
import { InventoryItem } from '@/types'

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    category: item.category as InventoryItem['category'],
    quantity: item.quantity,
    unit: item.unit,
    minLevel: item.min_level,
    lastUpdated: item.last_updated,
  }))
}

export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'lastUpdated'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inventory_items')
    .insert({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      min_level: item.minLevel,
      last_updated: new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    category: data.category as InventoryItem['category'],
    quantity: data.quantity,
    unit: data.unit,
    minLevel: data.min_level,
    lastUpdated: data.last_updated,
  }
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
  const supabase = await createClient()
  const updateData: any = {}
  
  if (updates.name) updateData.name = updates.name
  if (updates.category) updateData.category = updates.category
  if (updates.quantity !== undefined) updateData.quantity = updates.quantity
  if (updates.unit) updateData.unit = updates.unit
  if (updates.minLevel !== undefined) updateData.min_level = updates.minLevel
  updateData.last_updated = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('inventory_items')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    category: data.category as InventoryItem['category'],
    quantity: data.quantity,
    unit: data.unit,
    minLevel: data.min_level,
    lastUpdated: data.last_updated,
  }
}

export async function deleteInventoryItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function adjustStock(id: string, delta: number) {
  const supabase = await createClient()
  
  const { data: current, error: fetchError } = await supabase
    .from('inventory_items')
    .select('quantity')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const newQuantity = Math.max(0, (current.quantity || 0) + delta)

  const { data, error } = await supabase
    .from('inventory_items')
    .update({
      quantity: newQuantity,
      last_updated: new Date().toISOString().split('T')[0],
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    category: data.category as InventoryItem['category'],
    quantity: data.quantity,
    unit: data.unit,
    minLevel: data.min_level,
    lastUpdated: data.last_updated,
  }
}
