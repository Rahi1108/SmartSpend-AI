import { supabase } from './supabase';
import type { Database } from '../types/database';

type BudgetRow = Database['public']['Tables']['budgets']['Row'];
type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];

export const getBudgets = async (userId: string): Promise<BudgetRow[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);
  if (error) throw error;
  return data || [];
};

export const createBudget = async (budget: BudgetInsert): Promise<BudgetRow> => {
  const { data, error } = await (supabase as any)
    .from('budgets')
    .insert(budget)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const updateBudget = async (id: string, updates: Partial<BudgetInsert>): Promise<BudgetRow> => {
  const { data, error } = await (supabase as any)
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  const { error } = await (supabase as any)
    .from('budgets')
    .update({ is_active: false })
    .eq('id', id);
  if (error) throw error;
};