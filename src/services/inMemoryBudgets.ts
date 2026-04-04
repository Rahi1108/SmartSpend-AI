/**
 * In-Memory Budget Service - For development/testing when Supabase is not available
 * Uses browser localStorage to persist data
 */

import { getLocalStorageItems, addLocalStorageItem, updateLocalStorageItem } from './localStorage';
import type { Database } from '../types/database';

type BudgetRow = Database['public']['Tables']['budgets']['Row'];
type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];

export const getBudgets = async (userId: string): Promise<BudgetRow[]> => {
  const budgets = getLocalStorageItems<BudgetRow>('BUDGETS', userId);
  return budgets.filter(b => b.is_active);
};

export const createBudget = async (budget: BudgetInsert): Promise<BudgetRow> => {
  const newBudget: BudgetRow = {
    id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...budget,
  } as BudgetRow;
  return addLocalStorageItem('BUDGETS', newBudget);
};

export const updateBudget = async (id: string, updates: Partial<BudgetInsert>): Promise<BudgetRow> => {
  return updateLocalStorageItem<BudgetRow>('BUDGETS', id, {
    ...updates,
    updated_at: new Date().toISOString(),
  });
};

export const deleteBudget = async (id: string): Promise<void> => {
  updateLocalStorageItem('BUDGETS', id, { is_active: false });
};