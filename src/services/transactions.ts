/**
 * Transaction Service - Chooses between Supabase and In-Memory based on configuration
 */

import type { Database } from '../types/database';

type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

const isSupabaseConfigured = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!supabaseUrl && !!supabaseAnonKey;
};

const shouldUseSupabase = (userId: string): boolean => {
  const DEFAULT_USER_ID = 'user1';
  return isSupabaseConfigured() && userId !== DEFAULT_USER_ID;
};

export const getTransactions = async (userId: string): Promise<TransactionRow[]> => {
  if (shouldUseSupabase(userId)) {
    const { getTransactions } = await import('./supabaseTransactions');
    return getTransactions(userId);
  } else {
    const { getTransactions } = await import('./inMemoryTransactions');
    return getTransactions(userId);
  }
};

export const createTransaction = async (transaction: TransactionInsert): Promise<TransactionRow> => {
  if (shouldUseSupabase(transaction.user_id)) {
    const { createTransaction } = await import('./supabaseTransactions');
    return createTransaction(transaction);
  } else {
    const { createTransaction } = await import('./inMemoryTransactions');
    return createTransaction(transaction);
  }
};

export const updateTransaction = async (id: string, updates: Partial<TransactionInsert>): Promise<TransactionRow> => {
  if (isSupabaseConfigured()) {
    const { updateTransaction } = await import('./supabaseTransactions');
    return updateTransaction(id, updates);
  } else {
    const { updateTransaction } = await import('./inMemoryTransactions');
    return updateTransaction(id, updates);
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  if (isSupabaseConfigured()) {
    const { deleteTransaction } = await import('./supabaseTransactions');
    return deleteTransaction(id);
  } else {
    const { deleteTransaction } = await import('./inMemoryTransactions');
    return deleteTransaction(id);
  }
};