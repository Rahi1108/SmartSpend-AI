import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../services/budgets';
import type { Budget, Database } from '../types/database';

type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];

const DEFAULT_USER_ID = 'user1'; // Default user for development/guest mode

export const useBudgets = () => {
  const { user } = useAuth();
  const userId = user?.id || DEFAULT_USER_ID;
  const queryClient = useQueryClient();

  const {
    data: budgets = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Budget[]>({
    queryKey: ['budgets', userId],
    queryFn: () => getBudgets(userId),
    enabled: true, // Always enabled, use default userId if not authenticated
  });

  const createMutation = useMutation<Budget, unknown, BudgetInsert>({
    mutationFn: createBudget,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] });
    },
    onError: (error) => {
      console.error('Budget creation failed:', error);
    },
  });

  const updateMutation = useMutation<Budget, unknown, { id: string; updates: Partial<Budget> }>({
    mutationFn: ({ id, updates }) => updateBudget(id, updates),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] });
    },
    onError: (error) => {
      console.error('Budget update failed:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] });
    },
    onError: (error) => {
      console.error('Budget delete failed:', error);
    },
  });

  return {
    budgets: budgets || [],
    isLoading,
    error,
    refetch,
    createBudget: createMutation.mutateAsync,
    updateBudget: updateMutation.mutateAsync,
    deleteBudget: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
