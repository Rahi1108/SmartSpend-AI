import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/transactions';
import { useAuth } from './useAuth';
import type { Transaction, Database } from '../types/database';

type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

const DEFAULT_USER_ID = 'user1'; // Default user for development/guest mode

export function useTransactions() {
  const { user } = useAuth();
  const userId = user?.id || DEFAULT_USER_ID;
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions', userId],
    queryFn: () => getTransactions(userId),
    enabled: true, // Always enabled, use default userId if not authenticated
  });

  const createTransactionMutation = useMutation<Transaction, unknown, TransactionInsert>({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
    },
    onError: (error) => {
      console.error('Transaction creation failed:', error);
    },
  });

  const updateTransactionMutation = useMutation<Transaction, unknown, { id: string; updates: any }>({
    mutationFn: ({ id, updates }) =>
      updateTransaction(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
    },
  });

  const deleteTransactionMutation = useMutation<void, unknown, string>({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
    },
  });

  return {
    transactions,
    isLoading,
    createTransaction: createTransactionMutation.mutateAsync,
    updateTransaction: updateTransactionMutation.mutateAsync,
    deleteTransaction: deleteTransactionMutation.mutateAsync,
  };
}