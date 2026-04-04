import { useState, useCallback } from 'react';
import {
  parseExpenseInput,
  generateInsights,
  generatePredictions,
  generateSummary,
  analyzeTransaction,
  type ParsedExpense,
  type SpendingInsight,
  type SpendingPrediction,
} from '../services/ai';
import type { Transaction, Budget, Goal } from '../types/database';

export function useExpenseParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseExpense = useCallback(async (input: string): Promise<ParsedExpense | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await parseExpenseInput(input);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse expense');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { parseExpense, isLoading, error };
}

export function useInsights() {
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async (
    transactions: Transaction[],
    budgets: Budget[]
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedTransactions = transactions.map((t) => ({
        amount: t.amount,
        type: t.type,
        category_name: t.category_name,
        date: t.date,
        vendor: t.vendor || undefined,
      }));
      
      const formattedBudgets = budgets.map((b) => ({
        category_name: b.category_name,
        amount: b.amount,
        period: b.period,
      }));
      
      const result = await generateInsights(formattedTransactions, formattedBudgets);
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { insights, fetchInsights, isLoading, error };
}

export function usePredictions() {
  const [prediction, setPrediction] = useState<SpendingPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(async (transactions: Transaction[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const daysPassed = now.getDate();
      
      const currentMonthTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return date >= startOfMonth && t.type === 'expense';
      });
      
      const currentMonthSpending = currentMonthTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );
      
      const formattedTransactions = transactions.map((t) => ({
        amount: t.amount,
        type: t.type,
        category_name: t.category_name,
        date: t.date,
      }));
      
      const result = await generatePredictions(
        formattedTransactions,
        currentMonthSpending,
        daysInMonth,
        daysPassed
      );
      
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate predictions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { prediction, fetchPredictions, isLoading, error };
}

export function useTransactionAnalysis() {
  const [isLoading, setIsLoading] = useState(false);

  const analyzeNewTransaction = useCallback(async (
    transaction: { amount: number; type: string; category_name: string },
    transactions: Transaction[],
    budgets: Budget[],
    goals: Goal[]
  ) => {
    setIsLoading(true);
    
    try {
      // Calculate budget usage
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const budgetUsage = budgets.map((budget) => {
        const spent = transactions
          .filter((t) => {
            const date = new Date(t.date);
            return (
              t.category_name === budget.category_name &&
              t.type === 'expense' &&
              date >= startOfMonth
            );
          })
          .reduce((sum, t) => sum + t.amount, 0);
        
        // Add current transaction if same category
        const totalSpent =
          transaction.category_name === budget.category_name
            ? spent + transaction.amount
            : spent;
        
        return {
          category: budget.category_name,
          spent: totalSpent,
          limit: budget.amount,
          percentage: (totalSpent / budget.amount) * 100,
        };
      });
      
      // Format goals
      const formattedGoals = goals
        .filter((g) => g.status === 'active')
        .map((g) => ({
          name: g.name,
          target: g.target_amount,
          current: g.current_amount,
          deadline: g.deadline || undefined,
        }));
      
      const result = await analyzeTransaction(transaction, budgetUsage, formattedGoals);
      
      return result.alerts;
    } catch (err) {
      console.error('Transaction analysis failed:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analyzeNewTransaction, isLoading };
}

export function useSummary() {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (
    transactions: Transaction[],
    period: 'week' | 'month'
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedTransactions = transactions.map((t) => ({
        amount: t.amount,
        type: t.type,
        category_name: t.category_name,
        date: t.date,
        vendor: t.vendor || undefined,
      }));
      
      const result = await generateSummary(formattedTransactions, period);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { summary, fetchSummary, isLoading, error };
}
