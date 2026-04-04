// Enhanced AI Hooks for SmartSpend AI
// Hooks that integrate with the comprehensive AI service

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useTransactions } from './useTransactions';
import { useBudgets } from './useBudgets';
import { useGoals } from './useGoals';
import { aiService } from '../services/enhancedAI';
import type {
  BehavioralPattern,
  PredictiveInsight,
  SmartCategorySuggestion,
  Transaction,
  Budget,
  Goal
} from '../services/enhancedAI';

/**
 * Hook for behavioral insights analysis
 */
export function useBehavioralInsights(months: number = 6) {
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const [patterns, setPatterns] = useState<BehavioralPattern[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePatterns = useCallback(async () => {
    if (!user?.id || transactions.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await aiService.analyzeBehavioralPatterns(
        user.id,
        transactions as Transaction[],
        months
      );
      setPatterns(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze patterns';
      setError(errorMessage);
      console.error('Behavioral analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [user?.id, transactions, months]);

  useEffect(() => {
    analyzePatterns();
  }, [analyzePatterns]);

  return {
    patterns,
    isAnalyzing,
    error,
    refresh: analyzePatterns,
  };
}

/**
 * Hook for predictive insights
 */
export function usePredictiveInsights() {
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { goals } = useGoals();
  const { patterns } = useBehavioralInsights();

  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = useCallback(async () => {
    if (!user?.id || transactions.length === 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await aiService.generatePredictiveInsights(
        user.id,
        transactions as Transaction[],
        budgets as Budget[],
        goals as Goal[],
        patterns
      );
      setInsights(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate insights';
      setError(errorMessage);
      console.error('Predictive insights error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id, transactions, budgets, goals, patterns]);

  useEffect(() => {
    if (transactions.length > 0) {
      generateInsights();
    }
  }, [generateInsights, transactions.length]);

  return {
    insights,
    isGenerating,
    error,
    refresh: generateInsights,
  };
}

/**
 * Hook for smart categorization
 */
export function useSmartCategorization() {
  const { user } = useAuth();
  const [isLearning, setIsLearning] = useState(false);

  const suggestCategory = useCallback(async (
    input: string,
    amount: number,
    vendor?: string
  ): Promise<SmartCategorySuggestion | null> => {
    if (!user?.id) return null;

    setIsLearning(true);
    try {
      const suggestion = await aiService.suggestCategory(user.id, input, amount, vendor);
      return suggestion;
    } catch (error) {
      console.error('Smart categorization error:', error);
      return null;
    } finally {
      setIsLearning(false);
    }
  }, [user?.id]);

  return {
    suggestCategory,
    isLearning,
  };
}

/**
 * Hook for enhanced natural language parsing
 */
export function useEnhancedNLP() {
  const [isProcessing, setIsProcessing] = useState(false);

  const parseInput = useCallback(async (input: string) => {
    setIsProcessing(true);
    try {
      const result = await aiService.parseNaturalLanguage(input);
      return result;
    } catch (error) {
      console.error('NLP parsing error:', error);
      return {
        type: 'transaction' as const,
        data: { description: input },
        confidence: 0.3,
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    parseInput,
    isProcessing,
  };
}

/**
 * Hook for comprehensive financial summary
 */
export function useComprehensiveSummary() {
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { goals } = useGoals();
  const { patterns } = useBehavioralInsights();

  const [summary, setSummary] = useState<{
    overview: string;
    insights: PredictiveInsight[];
    recommendations: string[];
    riskAssessment: string;
  } | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = useCallback(async () => {
    if (!user?.id || transactions.length === 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await aiService.generateComprehensiveSummary(
        user.id,
        transactions as Transaction[],
        budgets as Budget[],
        goals as Goal[],
        patterns
      );
      setSummary(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary';
      setError(errorMessage);
      console.error('Comprehensive summary error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id, transactions, budgets, goals, patterns]);

  useEffect(() => {
    if (transactions.length > 0 && !summary) {
      generateSummary();
    }
  }, [generateSummary, transactions.length, summary]);

  return {
    summary,
    isGenerating,
    error,
    refresh: generateSummary,
  };
}

/**
 * Hook for AI-powered transaction analysis
 */
export function useTransactionAnalysis() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<{
    alerts: Array<{
      type: string;
      title: string;
      message: string;
      severity: string;
    }>;
  } | null>(null);

  const analyzeTransaction = useCallback(async (
    transaction: Transaction,
    budgetUsage: any[],
    goals: Goal[]
  ) => {
    if (!user?.email) return;

    try {
      // Import the original AI service for transaction analysis
      const { analyzeTransaction } = await import('../services/ai');

      // Transform goals to the expected format
      const transformedGoals = goals.map(goal => ({
        name: goal.name,
        target: goal.target_amount,
        current: goal.current_amount,
        deadline: goal.deadline,
      }));

      const result = await analyzeTransaction(transaction, budgetUsage, transformedGoals);
      setAnalysis(result);
    } catch (error) {
      console.error('Transaction analysis error:', error);
    }
  }, [user?.email]);

  return {
    analysis,
    analyzeTransaction,
  };
}