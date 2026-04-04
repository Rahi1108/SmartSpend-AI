import type { Goal as DBGoal } from './database';

export type Goal = DBGoal;

export interface GoalFormData {
  name: string;
  description?: string | null;
  target_amount: number;
  current_amount: number;
  deadline: string;
  category?: string | null;
  priority: 'low' | 'medium' | 'high';
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
}
