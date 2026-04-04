import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../services/budgets';
import type { Budget } from '../types/database';

export const useBudgets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: budgets = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Budget[]>({
    queryKey: ['budgets', user?.id],
    queryFn: () => getBudgets(user!.id),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'user_id'>) =>
      createBudget({ ...budget, user_id: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Budget> }) =>
      updateBudget(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return {
    budgets: budgets || [],
    isLoading,
    error,
    refetch,
    createBudget: createMutation.mutate,
    updateBudget: updateMutation.mutate,
    deleteBudget: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
