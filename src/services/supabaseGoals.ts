/**
 * Supabase Goal Service - For production with database persistence
 */

import { supabase } from './supabase';
import type { Database } from '../types/database';

type GoalRow = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];
type GoalInsertWithTimestamps = GoalInsert & { created_at: string; updated_at: string };

export const getGoals = async (userId: string): Promise<GoalRow[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createGoal = async (goal: GoalInsert): Promise<GoalRow> => {
  const timestampedGoal: GoalInsertWithTimestamps = {
    ...goal,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('goals')
    .insert(timestampedGoal)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const updateGoal = async (id: string, updates: Partial<GoalInsert>): Promise<GoalRow> => {
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('goals')
    .update(updatesWithTimestamp)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const deleteGoal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);
  if (error) throw error;
};