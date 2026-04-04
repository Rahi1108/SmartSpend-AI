/**
 * In-Memory Transaction Service - For development/testing when Supabase is not available
 * Uses browser localStorage to persist data
 */

import { getLocalStorageItems, addLocalStorageItem, updateLocalStorageItem, deleteLocalStorageItem } from './localStorage';
import type { Database } from '../types/database';

type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

export const getTransactions = async (userId: string): Promise<TransactionRow[]> => {
  return getLocalStorageItems<TransactionRow>('TRANSACTIONS', userId);
};

export const createTransaction = async (transaction: TransactionInsert): Promise<TransactionRow> => {
  const newTransaction: TransactionRow = {
    id: `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...transaction,
  } as TransactionRow;
  return addLocalStorageItem('TRANSACTIONS', newTransaction);
};

export const updateTransaction = async (id: string, updates: Partial<TransactionInsert>): Promise<TransactionRow> => {
  return updateLocalStorageItem<TransactionRow>('TRANSACTIONS', id, {
    ...updates,
    updated_at: new Date().toISOString(),
  });
};

export const deleteTransaction = async (id: string): Promise<void> => {
  deleteLocalStorageItem('TRANSACTIONS', id);
};