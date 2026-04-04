import type { Database } from './database';

export type Budget = Database['public']['Tables']['budgets']['Row'];

export interface BudgetFormData {
  category_name: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  alert_threshold: number;
  color?: string;
}
