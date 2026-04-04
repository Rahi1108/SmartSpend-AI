import React from 'react';
import type { Transaction } from '../../types/database';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-secondary bg-background-secondary rounded-xl">
        No transactions yet. Add one from the dashboard button.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.slice(0, 5).map((transaction) => (
        <div key={transaction.id} className="flex justify-between items-center p-3 bg-glass rounded-lg">
          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-sm text-text-muted">{transaction.category_name}</p>
          </div>
          <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};
