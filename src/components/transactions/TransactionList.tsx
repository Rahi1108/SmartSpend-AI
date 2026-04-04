import React from 'react';
import { motion } from 'framer-motion';
import { TransactionItem } from './TransactionItem';
import type { Transaction } from '../../types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (sortedTransactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No transactions yet.</p>
        <p className="text-text-muted text-sm mt-2">Add your first transaction to start tracking your finances.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <TransactionItem
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </div>
  );
};
