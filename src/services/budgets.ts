/**
 * Budget Service - Chooses between Supabase and In-Memory based on configuration
 */

import type { Database } from '../types/database';

type BudgetRow = Database['public']['Tables']['budgets']['Row'];
type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];

const isSupabaseConfigured = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!supabaseUrl && !!supabaseAnonKey;
};

export const getBudgets = async (userId: string): Promise<BudgetRow[]> => {
  if (isSupabaseConfigured()) {
    const { getBudgets } = await import('./supabaseBudgets');
    return getBudgets(userId);
  } else {
    const { getBudgets } = await import('./inMemoryBudgets');
    return getBudgets(userId);
  }
};

export const createBudget = async (budget: BudgetInsert): Promise<BudgetRow> => {
  if (isSupabaseConfigured()) {
    const { createBudget } = await import('./supabaseBudgets');
    return createBudget(budget);
  } else {
    const { createBudget } = await import('./inMemoryBudgets');
    return createBudget(budget);
  }
};

export const updateBudget = async (id: string, updates: Partial<BudgetInsert>): Promise<BudgetRow> => {
  if (isSupabaseConfigured()) {
    const { updateBudget } = await import('./supabaseBudgets');
    return updateBudget(id, updates);
  } else {
    const { updateBudget } = await import('./inMemoryBudgets');
    return updateBudget(id, updates);
  }
};

export const deleteBudget = async (id: string): Promise<void> => {
  if (isSupabaseConfigured()) {
    const { deleteBudget } = await import('./supabaseBudgets');
    return deleteBudget(id);
  } else {
    const { deleteBudget } = await import('./inMemoryBudgets');
    return deleteBudget(id);
  }
};