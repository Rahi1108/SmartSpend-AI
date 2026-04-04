import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../services/goals';
import type { Goal } from '../types/database';

const DEFAULT_USER_ID = 'user1'; // Default user for development/guest mode

export const useGoals = () => {
  const { user } = useAuth();
  const userId = user?.id || DEFAULT_USER_ID;
  const queryClient = useQueryClient();

  const {
    data: goals = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Goal[]>({
    queryKey: ['goals', userId],
    queryFn: () => getGoals(userId),
    enabled: true, // Always enabled, use default userId if not authenticated
  });

  const createMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Goal> }) =>
      updateGoal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  return {
    goals: goals || [],
    isLoading,
    error,
    refetch,
    createGoal: createMutation.mutate,
    updateGoal: updateMutation.mutate,
    deleteGoal: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
