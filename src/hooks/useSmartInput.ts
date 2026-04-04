/**
 * useSmartInput Hook
 * Uses the smart input classifier to identify and route entries
 */

import { useState } from 'react';
import { classifyUserInput, type ClassifiedInput } from '../services/smartInput';
import type { TransactionFormData } from '../types/transaction';

interface BudgetFormData {
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  description?: string;
}

interface GoalFormData {
  name: string;
  targetAmount: number;
  deadline: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
}

interface UseSmartInputResult {
  isClassifying: boolean;
  classifiedData: ClassifiedInput | null;
  error: string | null;
  classify: (text: string) => Promise<void>;
  getTransactionData: () => TransactionFormData | null;
  getBudgetData: () => BudgetFormData | null;
  getGoalData: () => GoalFormData | null;
  reset: () => void;
}

export function useSmartInput(): UseSmartInputResult {
  const [isClassifying, setIsClassifying] = useState(false);
  const [classifiedData, setClassifiedData] = useState<ClassifiedInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classify = async (text: string) => {
    try {
      setIsClassifying(true);
      setError(null);
      const result = await classifyUserInput(text);
      setClassifiedData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to classify input';
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsClassifying(false);
    }
  };

  const getTransactionData = (): TransactionFormData | null => {
    if (!classifiedData || classifiedData.type !== 'transaction') return null;

    const { data } = classifiedData;
    
    // Default to expense if not specified
    const type = data.transactionType || 'expense';
    
    // Use current date if no date provided
    const date = data.date || new Date();

    return {
      amount: data.amount || 0,
      description: data.description || classifiedData.originalText,
      category: data.category || 'Other',
      date,
      type,
      tags: data.tags || [],
    };
  };

  const getBudgetData = (): BudgetFormData | null => {
    if (!classifiedData || classifiedData.type !== 'budget') return null;

    const { data } = classifiedData;

    return {
      category: data.category || 'Other',
      amount: data.amount || 0,
      period: (data.period as 'weekly' | 'monthly' | 'yearly') || 'monthly',
      description: data.description || classifiedData.originalText,
    };
  };

  const getGoalData = (): GoalFormData | null => {
    if (!classifiedData || classifiedData.type !== 'goal') return null;

    const { data } = classifiedData;
    
    // Default deadline to 1 year from now
    const defaultDeadline = new Date();
    defaultDeadline.setFullYear(defaultDeadline.getFullYear() + 1);

    return {
      name: data.goalName || data.description || 'New Goal',
      targetAmount: data.amount || 0,
      deadline: data.deadline || defaultDeadline,
      category: data.category || 'Savings',
      priority: (data.priority as 'low' | 'medium' | 'high') || 'medium',
      description: data.description || classifiedData.originalText,
    };
  };

  const reset = () => {
    setClassifiedData(null);
    setError(null);
    setIsClassifying(false);
  };

  return {
    isClassifying,
    classifiedData,
    error,
    classify,
    getTransactionData,
    getBudgetData,
    getGoalData,
    reset,
  };
}
