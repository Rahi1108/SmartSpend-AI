/**
 * In-Memory Goal Service - For development/testing when Supabase is not available
 * Uses browser localStorage to persist data
 */

import { getLocalStorageItems, addLocalStorageItem, updateLocalStorageItem, deleteLocalStorageItem } from './localStorage';
import type { Database } from '../types/database';

type GoalRow = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];

export const getGoals = async (userId: string): Promise<GoalRow[]> => {
  const goals = getLocalStorageItems<GoalRow>('GOALS', userId);
  return goals.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const createGoal = async (goal: GoalInsert): Promise<GoalRow> => {
  const newGoal: GoalRow = {
    id: `g_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...goal,
  } as GoalRow;
  return addLocalStorageItem('GOALS', newGoal);
};

export const updateGoal = async (id: string, updates: Partial<GoalInsert>): Promise<GoalRow> => {
  return updateLocalStorageItem<GoalRow>('GOALS', id, {
    ...updates,
    updated_at: new Date().toISOString(),
  });
};

export const deleteGoal = async (id: string): Promise<void> => {
  deleteLocalStorageItem('GOALS', id);
};