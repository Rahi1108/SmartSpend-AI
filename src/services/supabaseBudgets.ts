/**
 * Supabase Budget Service - For production with database persistence
 */

import { supabase } from './supabase';
import type { Database } from '../types/database';

type BudgetRow = Database['public']['Tables']['budgets']['Row'];
type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
type BudgetInsertWithTimestamps = BudgetInsert & { created_at: string; updated_at: string };

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
  const timestampedBudget: BudgetInsertWithTimestamps = {
    ...budget,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('budgets')
    .insert(timestampedBudget)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const updateBudget = async (id: string, updates: Partial<BudgetInsert>): Promise<BudgetRow> => {
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('budgets')
    .update(updatesWithTimestamp)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('budgets')
    .update({ is_active: false })
    .eq('id', id);
  if (error) throw error;
};