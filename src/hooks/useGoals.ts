import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../services/goals';
import type { Goal, Database } from '../types/database';

type GoalInsert = Database['public']['Tables']['goals']['Insert'];

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

  const createMutation = useMutation<Goal, unknown, GoalInsert>({
    mutationFn: createGoal,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
    onError: (error) => {
      console.error('Goal creation failed:', error);
    },
  });

  const updateMutation = useMutation<Goal, unknown, { id: string; updates: Partial<Goal> }>({
    mutationFn: ({ id, updates }) => updateGoal(id, updates),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
    onError: (error) => {
      console.error('Goal update failed:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
    onError: (error) => {
      console.error('Goal delete failed:', error);
    },
  });

  return {
    goals: goals || [],
    isLoading,
    error,
    refetch,
    createGoal: createMutation.mutateAsync,
    updateGoal: updateMutation.mutateAsync,
    deleteGoal: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
