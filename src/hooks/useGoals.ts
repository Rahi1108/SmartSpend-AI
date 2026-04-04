import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../services/goals';
import type { Goal } from '../types/database';

export const useGoals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: goals = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Goal[]>({
    queryKey: ['goals', user?.id],
    queryFn: () => getGoals(user!.id),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) =>
      createGoal({ ...goal, user_id: user!.id }),
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
