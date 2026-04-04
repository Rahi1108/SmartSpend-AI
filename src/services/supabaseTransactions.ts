/**
 * Supabase Transaction Service - For production with database persistence
 */

import { supabase } from './supabase';
import type { Database } from '../types/database';

type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

export const getTransactions = async (userId: string): Promise<TransactionRow[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createTransaction = async (transaction: TransactionInsert): Promise<TransactionRow> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const updateTransaction = async (id: string, updates: Partial<TransactionInsert>): Promise<TransactionRow> => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
};