/**
 * Goal Service - Chooses between Supabase and In-Memory based on configuration
 */

import type { Database } from '../types/database';

type GoalRow = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];

const isSupabaseConfigured = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!supabaseUrl && !!supabaseAnonKey;
};

export const getGoals = async (userId: string): Promise<GoalRow[]> => {
  if (isSupabaseConfigured()) {
    const { getGoals } = await import('./supabaseGoals');
    return getGoals(userId);
  } else {
    const { getGoals } = await import('./inMemoryGoals');
    return getGoals(userId);
  }
};

export const createGoal = async (goal: GoalInsert): Promise<GoalRow> => {
  if (isSupabaseConfigured()) {
    const { createGoal } = await import('./supabaseGoals');
    return createGoal(goal);
  } else {
    const { createGoal } = await import('./inMemoryGoals');
    return createGoal(goal);
  }
};

export const updateGoal = async (id: string, updates: Partial<GoalInsert>): Promise<GoalRow> => {
  if (isSupabaseConfigured()) {
    const { updateGoal } = await import('./supabaseGoals');
    return updateGoal(id, updates);
  } else {
    const { updateGoal } = await import('./inMemoryGoals');
    return updateGoal(id, updates);
  }
};

export const deleteGoal = async (id: string): Promise<void> => {
  if (isSupabaseConfigured()) {
    const { deleteGoal } = await import('./supabaseGoals');
    return deleteGoal(id);
  } else {
    const { deleteGoal } = await import('./inMemoryGoals');
    return deleteGoal(id);
  }
};
